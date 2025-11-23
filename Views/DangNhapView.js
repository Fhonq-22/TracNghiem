import { layNguoiDung } from "../Controllers/UserController.js";

$(document).ready(function() {
    $("#loginForm").submit(async function(e) {
        e.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const user = await layNguoiDung(username);

        if (!user) {
            alert("Tên đăng nhập không tồn tại!");
        } else if (user.MatKhau !== password) {
            alert("Mật khẩu không chính xác!");
        } else {
            if (user.VaiTro === "Admin") {
                window.location.href = "admin-home.html";
            } else {
                window.location.href = "user-home.html";
            }
        }
    });
});