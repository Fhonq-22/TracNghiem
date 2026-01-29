import { layNguoiDung, themNguoiDung } from "../Controllers/UserController.js";

$(document).ready(function () {
    $("#registerForm").submit(async function (e) {
        e.preventDefault();

        const btn = $("#registerForm button[type=submit]");
        btn.prop("disabled", true);

        const username = String($("#username").val().trim());
        const fullName = $("#fullName").val().trim();
        const email = $("#email").val().trim();
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();

        if (!username || !password) {
            alert("Tên người dùng và mật khẩu không được để trống");
            btn.prop("disabled", false);
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp");
            btn.prop("disabled", false);
            return;
        }

        if (await layNguoiDung(username)) {
            alert("Tên người dùng đã tồn tại");
            btn.prop("disabled", false);
            return;
        }

        await themNguoiDung({
            TenNguoiDung: username,
            HoTen: fullName,
            Email: email,
            MatKhau: password,
            NgayDangKy: new Date().toISOString(),
            VaiTro: "User"
        });

        alert("Đăng ký thành công");
        window.location.replace("dang-nhap.html");
    });
});