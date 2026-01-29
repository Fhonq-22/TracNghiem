import { yeuCauDangNhap, getUserHienTai, removeAuth } from "../../Utils/AUTH.js";

$(document).ready(function () {
    if (!yeuCauDangNhap()) return;

    $("#userDisplay").text(getUserHienTai()?.TenNguoiDung || "");

    const disableAll = () => $("button").prop("disabled", true);

    $("#btnLogout").click(() => {
        disableAll();
        removeAuth();
        window.location.replace("dang-nhap.html");
    });

    $("#btnChonDe").click(() => {
        disableAll();
        window.location.href = "u-chonde.html";
    });

    $("#btnKetQua").click(() => {
        disableAll();
        window.location.href = "u-lichsu.html";
    });

    $("#btnPhienChoi").click(() => {
        disableAll();
        window.location.href = "u-phienchoi.html";
    });
});