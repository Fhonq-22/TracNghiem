import { isDangNhap, isAdmin, removeAuth } from "../../Utils/AUTH.js";

$(document).ready(function () {
    if (!isDangNhap()) {
        alert("Bạn chưa đăng nhập");
        window.location.href = "dang-nhap.html";
        return;
    }

    if (!isAdmin()) {
        alert("Bạn không có quyền truy cập trang này");
        window.location.href = "index.html";
        return;
    }

    $("#btnLogout").click(() => {
        removeAuth();
        window.location.href = "dang-nhap.html";
    });
});