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

    const tbody = $("#ketQuaTable tbody");
    tbody.empty();

    const row = $(`
        <tr>
            <td>${maKetQua}</td>
            <td>${kq.MaDe}</td>
            <td>${kq.TenNguoiDung}</td>
            <td>${kq.ThoiGianBatDau}</td>
            <td>${kq.ThoiGianNop}</td>
            <td>${kq.Diem}</td>
        </tr>
    `);

    tbody.append(row);
});