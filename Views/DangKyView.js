import { layNguoiDung, themNguoiDung } from "../Controllers/UserController.js";

$(document).ready(function() {
    $("#registerForm").submit(async function(e) {
        e.preventDefault();

        const username = $("#username").val().trim();
        const fullName = $("#fullName").val().trim();
        const email = $("#email").val().trim();
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();

        if (!username || !password) {
            alert("Tên người dùng và mật khẩu không được để trống");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp");
            return;
        }

        const existingUser = await layNguoiDung(username);
        if (existingUser) {
            alert("Tên người dùng đã tồn tại");
            return;
        }

        await themNguoiDung({
            TenNguoiDung: username,
            HoTen: fullName,
            Email: email,
            MatKhau: password,
            NgayDangKy: new Date().toLocaleDateString(),
            VaiTro: "User"
        });

        alert("Đăng ký thành công");
        window.location.href = "dang-nhap.html";
    });
});