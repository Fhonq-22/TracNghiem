import { layDanhSachCapDo, layCapDo, themCapDo, suaCapDo, xoaCapDo } from "../../Controllers/CapDoController.js";
import { yeuCauAdmin } from "../../Utils/AUTH.utils.js";

let dsCapDo = [];
let maDangSua = null;

let trangHienTai = 1;
const soDongMoiTrang = 10;

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    dsCapDo = await Promise.all((await layDanhSachCapDo()).map(ma => layCapDo(ma)));

    renderDanhSach();

    $("#btn-them").on("click", moModalThem);
    $("#modal-huy").on("click", dongModal);
    $("#modal-luu").on("click", luuCapDo);
    $("#phan-trang").on("click", ".page-btn", e => renderDanhSach(+e.target.dataset.page));
});

function moModalThem() {
    maDangSua = null;

    $("#modal-title").text("Thêm cấp độ");
    $("#ten-cap-do").val("");
    $("#diem-moi-cau").val("");
    $("#he-so-tra-loi-phu").val(0.5);

    $("#modal").removeClass("hidden");
}

function dongModal() {
    $("#modal").addClass("hidden");
}

async function luuCapDo() {
    const tenCapDo = $("#ten-cap-do").val().trim();
    const diemMoiCau = parseFloat($("#diem-moi-cau").val());
    const heSoTraLoiPhu = parseFloat($("#he-so-tra-loi-phu").val());
    const ngayCapNhat = new Date().toLocaleDateString("vi-VN");

    if (!tenCapDo || isNaN(diemMoiCau)) {
        alert("Dữ liệu không hợp lệ");
        return;
    }

    const maCapDo = maDangSua || await taoMaCapDo();

    if (maDangSua) {
        const cu = dsCapDo.find(c => c.MaCapDo === maDangSua);
        const moi = {
            ...cu,
            TenCapDo: tenCapDo,
            DiemMoiCau: diemMoiCau,
            HeSoTraLoiPhu: heSoTraLoiPhu,
            NgayCapNhat: ngayCapNhat
        };

        await suaCapDo(maDangSua, moi);
        dsCapDo[dsCapDo.findIndex(c => c.MaCapDo === maDangSua)] = moi;
    } else {
        const data = {
            MaCapDo: maCapDo,
            TenCapDo: tenCapDo,
            DiemMoiCau: diemMoiCau,
            HeSoTraLoiPhu: heSoTraLoiPhu,
            NgayCapNhat: ngayCapNhat
        };

        await themCapDo(data);
        dsCapDo.push(data);
    }

    dongModal();
    renderDanhSach();
}

function renderDanhSach(page = trangHienTai) {
    const tbody = $("#bang-body").empty();
    const tongTrang = Math.ceil(dsCapDo.length / soDongMoiTrang) || 1;

    trangHienTai = Math.min(Math.max(page, 1), tongTrang);

    dsCapDo
        .slice((trangHienTai - 1) * soDongMoiTrang, trangHienTai * soDongMoiTrang)
        .forEach(cd => {
            const row = $(`
                <tr>
                    <td>${cd.MaCapDo}</td>
                    <td>${cd.TenCapDo}</td>
                    <td>${cd.DiemMoiCau}</td>
                    <td>${cd.HeSoTraLoiPhu}</td>
                    <td>${cd.NgayCapNhat}</td>
                    <td>
                        <button class="btn-sua">Sửa</button>
                        <button class="btn-xoa">Xóa</button>
                    </td>
                </tr>
            `);

            row.find(".btn-sua").on("click", () => moModalSua(cd));
            row.find(".btn-xoa").on("click", () => xoa(cd.MaCapDo));

            tbody.append(row);
        });

    renderPhanTrang(tongTrang);
}

function moModalSua(cd) {
    maDangSua = cd.MaCapDo;

    $("#modal-title").text("Sửa cấp độ");
    $("#ten-cap-do").val(cd.TenCapDo);
    $("#diem-moi-cau").val(cd.DiemMoiCau);
    $("#he-so-tra-loi-phu").val(cd.HeSoTraLoiPhu);

    $("#modal").removeClass("hidden");
}

async function xoa(ma) {
    if (!confirm(`Xóa cấp độ ${ma}?`)) return;

    const res = await xoaCapDo(ma);
    if (!res.success) {
        let msg = res.message || "Không thể xóa cấp độ";
        if (res.refs?.length) {
            msg += "\n\nĐang được sử dụng tại:";
            res.refs.forEach(r => msg += `\n- ${r.collection} (${r.ma})`);
        }
        alert(msg);
        return;
    }

    dsCapDo = dsCapDo.filter(c => c.MaCapDo !== ma);
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

async function taoMaCapDo() {
    const used = dsCapDo
        .map(c => parseInt(c.MaCapDo.slice(2)))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    let n = 1;
    for (let x of used) {
        if (x === n) n++;
        else break;
    }
    return "CD" + String(n).padStart(2, "0");
}