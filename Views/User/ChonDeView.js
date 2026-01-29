import { layDanhSachBoDe, layBoDe } from "../../Controllers/BoDeController.js";
import { yeuCauDangNhap, getUserHienTai } from "../../Utils/AUTH.js";

let currentPage = 1;
const pageSize = 10;
let cachedBoDe = [];

$(document).ready(async function () {
    if (!yeuCauDangNhap()) return;

    $("#userDisplay").text(getUserHienTai()?.TenNguoiDung || "");

    const maList = await layDanhSachBoDe();
    cachedBoDe = await Promise.all(maList.map(ma => layBoDe(ma)));

    renderBoDe(currentPage);
});

function renderBoDe(page = 1) {
    const tbody = $("#boDeTable tbody").empty();

    const totalPages = Math.ceil(cachedBoDe.length / pageSize) || 1;
    currentPage = Math.min(Math.max(page, 1), totalPages);

    const start = (currentPage - 1) * pageSize;
    const pageItems = cachedBoDe.slice(start, start + pageSize);

    for (let bd of pageItems) {
        const row = $(`
            <tr>
                <td>${bd.MaBoDe}</td>
                <td>${bd.TenBoDe}</td>
                <td>${bd.SoCauHoi ?? bd.DanhSachCauHoi?.length ?? 0}</td>
                <td>${bd.ThoiGian}</td>
                <td>${bd.NgayTao || ""}</td>
                <td>${bd.NguoiTao || ""}</td>
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
    const container = $("#pagination").empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        container.append(`<button class="pageBtn" data-page="1"><<</button>`);
        container.append(`<button class="pageBtn" data-page="${currentPage - 1}">Prev</button>`);
    }

    const range = 2;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    if (start > 1) container.append(`<span>...</span>`);
    for (let i = start; i <= end; i++) {
        container.append(`<button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    }
    if (end < totalPages) container.append(`<span>...</span>`);

    if (currentPage < totalPages) {
        container.append(`<button class="pageBtn" data-page="${currentPage + 1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    container.find(".pageBtn").click(function () {
        renderBoDe(parseInt($(this).data("page")));
    });
}