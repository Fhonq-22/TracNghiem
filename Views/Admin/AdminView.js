import { yeuCauAdmin, removeAuth } from "../../Utils/AUTH.js";

$(document).ready(function () {
    if (!yeuCauAdmin()) return;

    $("#btnLogout").on("click", function () {
        removeAuth();
        window.location.replace("dang-nhap.html");
    });
});