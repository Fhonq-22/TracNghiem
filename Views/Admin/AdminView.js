import { yeuCauAdmin, removeAuth } from "../../Utils/AUTH.js";

$(document).ready(function () {
    if (!yeuCauAdmin()) return;

    $("#btnLogout").click(() => {
        removeAuth();
        window.location.href = "dang-nhap.html";
    });
});