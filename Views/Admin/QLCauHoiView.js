import { layDanhSachCauHoi, layCauHoi, themCauHoi, suaCauHoi, xoaCauHoi } from "../../Controllers/CauHoiController.js";
import { yeuCauAdmin, getUserHienTai } from "../../Utils/AUTH.utils.js";

let maDangSua = null;
let trangHienTai = 1;
const soDongMoiTrang = 10;
let danhSachCauHoi = [];

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    danhSachCauHoi = await Promise.all(
        (await layDanhSachCauHoi()).map(ma => layCauHoi(ma))
    );

    renderDanhSach();

    $("#btn-them").on("click", moModalThem);
    $("#modal-huy").on("click", dongModal);
    $("#modal-luu").on("click", luuCauHoi);

    $("#phan-trang").on("click", ".page-btn", e => {
        renderDanhSach(+e.target.dataset.page);
    });
});

function moModalThem() {
    maDangSua = null;
    $("#modal-title").text("Thêm câu hỏi");

    $("#noi-dung").val("");
    $(".phuong-an").val("");
    $("#dap-an-dung").val("0");
    $("#giai-thich").val("");

    $("#tu-dong-ma").prop("checked", true).prop("disabled", false);
    $("#ma-cau-hoi").val("").prop("disabled", true);

    $("#tu-dong-ma").off("change").on("change", function () {
        $("#ma-cau-hoi").prop("disabled", $(this).is(":checked"));
        if ($(this).is(":checked")) $("#ma-cau-hoi").val("");
    });

    $("#modal").removeClass("hidden");
}

function dongModal() {
    $("#modal").addClass("hidden");
}

async function luuCauHoi() {
    let maCauHoi = $("#ma-cau-hoi").val().trim();

    if ($("#tu-dong-ma").is(":checked") && !maDangSua) {
        let n = 1;
        const used = danhSachCauHoi
            .map(q => parseInt(q.MaCauHoi.slice(1)))
            .sort((a, b) => a - b);

        for (let x of used) {
            if (x === n) n++;
            else if (x > n) break;
        }

        maCauHoi = "Q" + String(n).padStart(5, "0");
    }

    const phuongAn = $(".phuong-an").map((_, el) => el.value.trim()).get();

    const duLieu = {
        MaCauHoi: maCauHoi,
        NoiDung: $("#noi-dung").val().trim(),
        PhuongAn: phuongAn,
        DapAnDung: parseInt($("#dap-an-dung").val()),
        GiaiThich: $("#giai-thich").val().trim(),
        NguoiTao: getUserHienTai()?.TenNguoiDung || "",
        NgayTao: new Date().toLocaleDateString()
    };

    if (!duLieu.MaCauHoi || !duLieu.NoiDung) {
        alert("Mã câu hỏi và nội dung không được để trống");
        return;
    }

    if (maDangSua) {
        const cu = danhSachCauHoi.find(q => q.MaCauHoi === maDangSua);
        const moi = { ...cu, ...duLieu };

        await suaCauHoi(maDangSua, moi);
        danhSachCauHoi[danhSachCauHoi.findIndex(q => q.MaCauHoi === maDangSua)] = moi;
    } else {
        await themCauHoi(duLieu);
        danhSachCauHoi.push(duLieu);
    }

    dongModal();
    renderDanhSach();
}

function renderDanhSach(page = trangHienTai) {
    const tbody = $("#bang-body").empty();

    const tongTrang = Math.ceil(danhSachCauHoi.length / soDongMoiTrang);
    trangHienTai = Math.min(Math.max(page, 1), tongTrang || 1);

    danhSachCauHoi
        .slice((trangHienTai - 1) * soDongMoiTrang, trangHienTai * soDongMoiTrang)
        .forEach(ch => {
            const row = $(`
                <tr>
                    <td>${ch.MaCauHoi}</td>
                    <td>${ch.NoiDung}</td>
                    <td>${ch.PhuongAn[0] || ""}</td>
                    <td>${ch.PhuongAn[1] || ""}</td>
                    <td>${ch.PhuongAn[2] || ""}</td>
                    <td>${ch.PhuongAn[3] || ""}</td>
                    <td>${ch.DapAnDung}</td>
                    <td>${ch.GiaiThich || ""}</td>
                    <td>${ch.NguoiTao || ""}</td>
                    <td>${ch.NgayTao || ""}</td>
                    <td>
                        <button class="btn-sua">Sửa</button>
                        <button class="btn-xoa">Xóa</button>
                    </td>
                </tr>
            `);

            row.find(".btn-sua").on("click", () => moModalSua(ch));
            row.find(".btn-xoa").on("click", () => xoa(ch.MaCauHoi));

            tbody.append(row);
        });

    renderPhanTrang(tongTrang);
}

function moModalSua(ch) {
    maDangSua = ch.MaCauHoi;

    $("#modal-title").text("Sửa câu hỏi");
    $("#ma-cau-hoi").val(ch.MaCauHoi).prop("disabled", true);
    $("#noi-dung").val(ch.NoiDung);
    $(".phuong-an").each((i, el) => $(el).val(ch.PhuongAn[i] || ""));
    $("#dap-an-dung").val(ch.DapAnDung);
    $("#giai-thich").val(ch.GiaiThich || "");

    $("#tu-dong-ma").prop("checked", true).prop("disabled", true);
    $("#modal").removeClass("hidden");
}

async function xoa(ma) {
    if (!confirm(`Xóa câu hỏi ${ma}?`)) return;

    const res = await xoaCauHoi(ma);
    if (!res.success) {
        let msg = res.message || "Không thể xóa câu hỏi";
        if (res.refs?.length) {
            msg += "\n\nĐang được sử dụng tại:";
            res.refs.forEach(r => msg += `\n- ${r.collection} (${r.ma})`);
        }
        alert(msg);
        return;
    }

    danhSachCauHoi = danhSachCauHoi.filter(q => q.MaCauHoi !== ma);
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