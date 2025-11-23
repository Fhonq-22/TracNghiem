import { layDanhSachKetQua, layKetQua } from "../../Controllers/KetQuaController.js";

$(document).ready(async function() {
    await loadKetQua();
});

async function loadKetQua() {
    const danhSach = await layDanhSachKetQua();
    const tbody = $("#ketQuaTable tbody");
    tbody.empty();

    for (let ma of danhSach) {
        const kq = await layKetQua(ma);
        const row = $(`
            <tr>
                <td>${ma}</td>
                <td>${kq.MaDe}</td>
                <td>${kq.TenNguoiDung}</td>
                <td>${kq.ThoiGianBatDau}</td>
                <td>${kq.ThoiGianNop}</td>
                <td>${kq.Diem}</td>
            </tr>
        `);
        tbody.append(row);
    }
}