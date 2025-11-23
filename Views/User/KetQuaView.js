import { layKetQua } from "../../Controllers/KetQuaController.js";

$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const maKetQua = urlParams.get("maKetQua");
    if (!maKetQua) {
        alert("Không có mã kết quả");
        return;
    }

    const kq = await layKetQua(maKetQua);
    if (!kq) {
        alert("Không tìm thấy kết quả");
        return;
    }

    const container = $("#ketQuaContainer");
    container.empty();

    container.append(`<p><b>Mã kết quả:</b> ${maKetQua}</p>`);
    container.append(`<p><b>Mã đề:</b> ${kq.MaDe}</p>`);
    container.append(`<p><b>Tên người dùng:</b> ${kq.TenNguoiDung}</p>`);
    container.append(`<p><b>Thời gian bắt đầu:</b> ${kq.ThoiGianBatDau}</p>`);
    container.append(`<p><b>Thời gian nộp:</b> ${kq.ThoiGianNop}</p>`);
    container.append(`<p><b>Điểm:</b> ${kq.Diem}</p>`);
});