import { layKetQua } from "../../Controllers/KetQuaController.js";
import { yeuCauDangNhap } from "../../Utils/AUTH.utils.js";
import { yeuCauDongYDieuKhoan } from "../../Utils/DIEUKHOAN.utils.js";
import { HANHVI } from "../../Domain/HANHVI.domain.js";

function layLabelHanhVi(code) {
    return Object.values(HANHVI).find(h => h.CODE === code)?.LABEL ?? code;
}

function dinhDangThoiGian(iso) {
    const tg = new Date(iso);
    return tg.toLocaleDateString("vi-VN") + " " +
           tg.toLocaleTimeString("vi-VN");
}

$(document).ready(async function () {
    if (!yeuCauDangNhap()) return;
    if (!yeuCauDongYDieuKhoan()) return;

    const maKetQua = new URLSearchParams(window.location.search).get("maKetQua");
    if (!maKetQua) {
        alert("Không có mã kết quả");
        return;
    }

    const kq = await layKetQua(maKetQua);
    if (!kq) {
        alert("Không tìm thấy kết quả");
        return;
    }

    const hanhVi = kq.HanhViBatThuong ?? [];
    const htmlHanhVi = hanhVi.length
        ? `
            <ul>
                ${hanhVi.map(hv => `
                    <li>
                        <b>${layLabelHanhVi(hv.Code)}</b>
                        <br>
                        <small>⏱ ${dinhDangThoiGian(hv.ThoiGian)}</small>
                    </li>
                `).join("")}
            </ul>
        `
        : `<p>Không ghi nhận hành vi bất thường</p>`;

    $("#ketQuaContainer").html(`
        <p><b>Mã kết quả:</b> ${maKetQua}</p>
        <p><b>Mã đề:</b> ${kq.MaDe}</p>
        <p><b>Tên người dùng:</b> ${kq.TenNguoiDung}</p>
        <p><b>Thời gian bắt đầu:</b> ${kq.ThoiGianBatDau}</p>
        <p><b>Thời gian nộp:</b> ${kq.ThoiGianNop}</p>
        <p><b>Điểm:</b> ${kq.Diem}</p>
        <hr>
        <h4>Hành vi trong quá trình làm bài</h4>
        ${htmlHanhVi}
    `);
});