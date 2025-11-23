import { layDanhSachBoDe, layBoDe } from "../../Controllers/BoDeController.js";

let currentPage = 1;
const pageSize = 10;

$(document).ready(async function() {
    const username = localStorage.getItem("currentUser") || "Khách";
    $("#userDisplay").text(username);

    $("#btnLogout").click(() => {
        localStorage.removeItem("currentUser");
        window.location.href = "dang-nhap.html";
    });

    await loadBoDe(currentPage);
});

async function loadBoDe(page = 1) {
    const danhSach = await layDanhSachBoDe();
    currentPage = page;
    const totalPages = Math.ceil(danhSach.length / pageSize);

    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pageBoDe = danhSach.slice(startIdx, endIdx);

    const tbody = $("#boDeTable tbody");
    tbody.empty();

    for (let ma of pageBoDe) {
        const bd = await layBoDe(ma);
        const row = $(`
            <tr>
                <td>${ma}</td>
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
            window.location.href = `u-lambai.html?maBoDe=${ma}`;
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
        container.append(`<button class="pageBtn" data-page="${currentPage - 1}">Prev</button>`);
    }

    const visibleRange = 2;
    let start = Math.max(1, currentPage - visibleRange);
    let end = Math.min(totalPages, currentPage + visibleRange);

    if (start > 1) container.append(`<span>...</span>`);

    for (let i = start; i <= end; i++) {
        container.append(`<button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    }

    if (end < totalPages) container.append(`<span>...</span>`);

    if (currentPage < totalPages) {
        container.append(`<button class="pageBtn" data-page="${currentPage + 1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    container.find(".pageBtn").click(function() {
        const page = parseInt($(this).data("page"));
        loadBoDe(page);
    });
}