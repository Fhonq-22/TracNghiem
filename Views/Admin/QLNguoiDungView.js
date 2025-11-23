import { layDanhSachNguoiDung, layNguoiDung } from "../../Controllers/UserController.js";

$(document).ready(async function() {
    const danhSachUser = await layDanhSachNguoiDung();
    const tbody = $("#userTable tbody");
    tbody.empty();

    for (let username of danhSachUser) {
        const user = await layNguoiDung(username);
        const row = `<tr>
            <td>${username}</td>
            <td>${user.HoTen || ""}</td>
            <td>${user.Email || ""}</td>
            <td>${user.NgayDangKy || ""}</td>
            <td>${user.VaiTro || ""}</td>
        </tr>`;
        tbody.append(row);
    }
});