import { layKetQua } from "../../Controllers/KetQuaController.js";
import { yeuCauDangNhap } from "../../Utils/AUTH.utils.js";

$(document).ready(async function () {
    if (!yeuCauDangNhap()) return;

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

    $("#ketQuaContainer").html(`
        <p><b>Mã kết quả:</b> ${maKetQua}</p>
        <p><b>Mã đề:</b> ${kq.MaDe}</p>
        <p><b>Tên người dùng:</b> ${kq.TenNguoiDung}</p>
        <p><b>Thời gian bắt đầu:</b> ${kq.ThoiGianBatDau}</p>
        <p><b>Thời gian nộp:</b> ${kq.ThoiGianNop}</p>
        <p><b>Điểm:</b> ${kq.Diem}</p>
    `);
});