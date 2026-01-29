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
            localStorage.setItem("P-auth", JSON.stringify({
                project: "quizie",
                user: {
                    TenNguoiDung: user.TenNguoiDung,
                    VaiTro: user.VaiTro
                },
                loginAt: new Date().toISOString()
            }));
            
            if (user.VaiTro === "Admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }
    });
});