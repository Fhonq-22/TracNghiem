import { layNguoiDung } from "../Controllers/UserController.js";
import { setAuth } from "../Utils/AUTH.utils.js";

$(document).ready(function () {
    $("#loginForm").submit(async function (e) {
        e.preventDefault();

        const btn = $(this).find("button[type=submit]");
        btn.prop("disabled", true);

        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            btn.prop("disabled", false);
            return;
        }

        const user = await layNguoiDung(username);

        if (!user) {
            alert("Tên đăng nhập không tồn tại!");
            btn.prop("disabled", false);
        } else if (user.MatKhau !== password) {
            alert("Mật khẩu không chính xác!");
            btn.prop("disabled", false);
        } else {
            setAuth(user);
            window.location.replace(
                user.VaiTro === "Admin" ? "admin.html" : "index.html"
            );
        }
    });
});