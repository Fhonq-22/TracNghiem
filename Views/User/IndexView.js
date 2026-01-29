import { layDanhSachBoDe, layBoDe } from "../../Controllers/BoDeController.js";
import { yeuCauDangNhap } from "../../Utils/AUTH.js";

let currentPage = 1;
const pageSize = 10;
let cachedBoDe = [];

$(document).ready(async function() {
    if (!yeuCauDangNhap()) return;

    const username = localStorage.getItem("currentUser") || "Khách";
    $("#userDisplay").text(username);

    $("#btnLogout").click(() => {
        localStorage.removeItem("currentUser");
        window.location.href = "dang-nhap.html";
    });

    const maList = await layDanhSachBoDe();
    cachedBoDe = await Promise.all(maList.map(ma => layBoDe(ma)));

    renderBoDe(currentPage);
});

function renderBoDe(page = 1) {
    const tbody = $("#boDeTable tbody");
    tbody.empty();

    const totalPages = Math.ceil(cachedBoDe.length / pageSize);
    currentPage = Math.min(Math.max(page,1), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, cachedBoDe.length);
    const pageItems = cachedBoDe.slice(startIndex, endIndex);

    for (let bd of pageItems) {
        const row = $(`
            <tr>
                <td>${bd.MaBoDe}</td>
                <td>${bd.TenBoDe}</td>
                <td>${bd.SoCauHoi}</td>
                <td>${bd.ThoiGian}</td>
                <td>${bd.NgayTao}</td>
                <td>${bd.NguoiTao}</td>
                <td>
                    <button class="startBtn">Bắt đầu</button>
                </td>
            </tr>
        `);

        row.find(".startBtn").click(() => {
            window.location.href = `u-lambai.html?maBoDe=${bd.MaBoDe}`;
        });

        tbody.append(row);
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = $("#pagination");
    container.empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        container.append(`<button class="pageBtn" data-page="1"><<</button>`);
        container.append(`<button class="pageBtn" data-page="${currentPage-1}">Prev</button>`);
    }

    const visibleRange = 2;
    let start = Math.max(1, currentPage-visibleRange);
    let end = Math.min(totalPages, currentPage+visibleRange);

    if (start>1) container.append(`<span>...</span>`);
    for (let i=start;i<=end;i++){
        container.append(`<button class="pageBtn ${i===currentPage?"active":""}" data-page="${i}">${i}</button>`);
    }
    if (end<totalPages) container.append(`<span>...</span>`);
    if (currentPage<totalPages){
        container.append(`<button class="pageBtn" data-page="${currentPage+1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    container.find(".pageBtn").click(function(){
        const page = parseInt($(this).data("page"));
        renderBoDe(page);
    });
}