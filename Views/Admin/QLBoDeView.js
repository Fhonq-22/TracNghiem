import { layDanhSachBoDe, layBoDe, themBoDe, suaBoDe, xoaBoDe } from "../../Controllers/BoDeController.js";
import { layDanhSachCauHoi, layCauHoi } from "../../Controllers/CauHoiController.js";
import { layDanhSachCapDo, layCapDo } from "../../Controllers/CapDoController.js";
import { yeuCauAdmin, getUserHienTai } from "../../Utils/AUTH.utils.js";

let maDangSua = null;
let trangHienTai = 1;
const soDongMoiTrang = 10;

let dsBoDe = [];
let dsCauHoi = [];
let dsCapDo = [];

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    dsCauHoi = await Promise.all((await layDanhSachCauHoi()).map(ma => layCauHoi(ma)));
    dsCapDo = await Promise.all((await layDanhSachCapDo()).map(ma => layCapDo(ma)));
    dsBoDe = (await Promise.all((await layDanhSachBoDe()).map(ma => layBoDe(ma)))).map(chuanHoa);

    renderDanhSach();

    $("#btn-them").on("click", moModalThem);
    $("#modal-huy").on("click", dongModal);
    $("#modal-luu").on("click", luuBoDe);
    $("#phan-trang").on("click", ".page-btn", e => renderDanhSach(+e.target.dataset.page));
});

function chuanHoa(bd) {
    const ds = Array.isArray(bd?.DanhSachCauHoi) ? bd.DanhSachCauHoi : [];
    return { ...bd, DanhSachCauHoi: ds, SoCauHoi: ds.length };
}

function moModalThem() {
    maDangSua = null;

    $("#modal-title").text("Thêm bộ đề");
    $("#ten-bo-de").val("");
    $("#thoi-gian").val(30);
    $("#danh-sach-cau-hoi").empty();

    renderCapDo();

    dsCauHoi.forEach(ch => {
        $("#danh-sach-cau-hoi").append(`
            <label class="dong-cau-hoi">
                <input type="checkbox" value="${ch.MaCauHoi}">
                ${ch.MaCauHoi} - ${ch.NoiDung}
            </label>
        `);
    });

    $("#modal").removeClass("hidden");
}

function dongModal() {
    $("#modal").addClass("hidden");
}

async function luuBoDe() {
    const tenBoDe = $("#ten-bo-de").val().trim();
    const capDo = $("#cap-do").val();
    const thoiGian = parseInt($("#thoi-gian").val());
    const danhSachCauHoi = $("#danh-sach-cau-hoi input:checked").map((_, el) => el.value).get();

    if (!tenBoDe || danhSachCauHoi.length === 0) {
        alert("Tên bộ đề và câu hỏi không được để trống");
        return;
    }

    let maBoDe = maDangSua || await taoMaBoDe();

    if (maDangSua) {
        const cu = dsBoDe.find(b => b.MaBoDe === maDangSua);
        const moi = { ...cu, TenBoDe: tenBoDe, CapDo: capDo, ThoiGian: thoiGian, DanhSachCauHoi: danhSachCauHoi };

        await suaBoDe(maDangSua, moi);
        dsBoDe[dsBoDe.findIndex(b => b.MaBoDe === maDangSua)] = chuanHoa(moi);
    } else {
        const bd = {
            MaBoDe: maBoDe,
            TenBoDe: tenBoDe,
            CapDo: capDo,
            ThoiGian: thoiGian,
            DanhSachCauHoi: danhSachCauHoi,
            NgayTao: new Date().toLocaleDateString(),
            NguoiTao: getUserHienTai()?.TenNguoiDung || ""
        };

        await themBoDe(bd);
        dsBoDe.push(chuanHoa(bd));
    }

    dongModal();
    renderDanhSach();
}

function renderCapDo(selected = null) {
    const s = $("#cap-do").empty();
    dsCapDo.forEach(cd => s.append(`<option value="${cd.MaCapDo}">${cd.TenCapDo}</option>`));
    if (selected) s.val(selected);
}

function renderDanhSach(page = trangHienTai) {
    const tbody = $("#bang-body").empty();
    const tongTrang = Math.ceil(dsBoDe.length / soDongMoiTrang);

    trangHienTai = Math.min(Math.max(page, 1), tongTrang || 1);

    dsBoDe
        .slice((trangHienTai - 1) * soDongMoiTrang, trangHienTai * soDongMoiTrang)
        .forEach(bd => {
            const row = $(`
                <tr>
                    <td>${bd.MaBoDe}</td>
                    <td>${bd.TenBoDe}</td>
                    <td>${bd.CapDo}</td>
                    <td>${bd.SoCauHoi}</td>
                    <td>${bd.ThoiGian}</td>
                    <td>${bd.NgayTao}</td>
                    <td>${bd.NguoiTao}</td>
                    <td>
                        <button class="btn-sua">Sửa</button>
                        <button class="btn-xoa">Xóa</button>
                    </td>
                </tr>
            `);

            row.find(".btn-sua").on("click", () => moModalSua(bd));
            row.find(".btn-xoa").on("click", () => xoa(bd.MaBoDe));

            tbody.append(row);
        });

    renderPhanTrang(tongTrang);
}

function moModalSua(bd) {
    maDangSua = bd.MaBoDe;

    $("#modal-title").text("Sửa bộ đề");
    $("#ten-bo-de").val(bd.TenBoDe);
    $("#thoi-gian").val(bd.ThoiGian);
    $("#danh-sach-cau-hoi").empty();

    renderCapDo(bd.CapDo);

    dsCauHoi.forEach(ch => {
        $("#danh-sach-cau-hoi").append(`
            <label class="dong-cau-hoi">
                <input type="checkbox" value="${ch.MaCauHoi}" ${bd.DanhSachCauHoi.includes(ch.MaCauHoi) ? "checked" : ""}>
                ${ch.MaCauHoi} - ${ch.NoiDung}
            </label>
        `);
    });

    $("#modal").removeClass("hidden");
}

async function xoa(ma) {
    if (!confirm(`Xóa bộ đề ${ma}?`)) return;

    const res = await xoaBoDe(ma);
    if (!res.success) {
        let msg = res.message || "Không thể xóa bộ đề";
        if (res.refs?.length) {
            msg += "\n\nĐang được sử dụng tại:";
            res.refs.forEach(r => msg += `\n- ${r.collection} (${r.ma})`);
        }
        alert(msg);
        return;
    }

    dsBoDe = dsBoDe.filter(b => b.MaBoDe !== ma);
    renderDanhSach();
}

function renderPhanTrang(tongTrang) {
    const c = $("#phan-trang").empty();
    if (tongTrang <= 1) return;

    if (trangHienTai > 1) {
        c.append(`<button class="page-btn" data-page="1"><<</button>`);
        c.append(`<button class="page-btn" data-page="${trangHienTai - 1}">Prev</button>`);
    }

    for (let i = Math.max(1, trangHienTai - 2); i <= Math.min(tongTrang, trangHienTai + 2); i++) {
        c.append(`<button class="page-btn ${i === trangHienTai ? "active" : ""}" data-page="${i}">${i}</button>`);
    }

    if (trangHienTai < tongTrang) {
        c.append(`<button class="page-btn" data-page="${trangHienTai + 1}">Next</button>`);
        c.append(`<button class="page-btn" data-page="${tongTrang}">>></button>`);
    }
}

async function taoMaBoDe() {
    let n = 1;
    const used = dsBoDe.map(b => parseInt(b.MaBoDe.slice(2))).sort((a, b) => a - b);
    for (let x of used) {
        if (x === n) n++;
        else if (x > n) break;
    }
    return "BD" + String(n).padStart(4, "0");
}