import { layDanhSachNguoiDung, layNguoiDung, themNguoiDung, suaNguoiDung, xoaNguoiDung } from "../../Controllers/UserController.js";

let editingUser = null;
let currentPage = 1;
const pageSize = 10;
let cachedUsers = [];

$(document).ready(async function() {
    const usernames = await layDanhSachNguoiDung();
    cachedUsers = await Promise.all(usernames.map(u => layNguoiDung(u)));

    renderUsers(currentPage);

    $("#btnAddUser").click(() => {
        editingUser = null;
        $("#modalTitle").text("Thêm người dùng");
        $("#modalUsername").val("").prop("disabled", false);
        $("#modalHoTen").val("");
        $("#modalEmail").val("");
        $("#modalMatKhau").val("");
        $("#modalVaiTro").val("User");
        $("#userModal").show();
    });

    $("#modalCancel").click(() => $("#userModal").hide());

    $("#modalSave").click(async function() {
        const userData = {
            TenNguoiDung: $("#modalUsername").val().trim(),
            HoTen: $("#modalHoTen").val().trim(),
            Email: $("#modalEmail").val().trim(),
            MatKhau: $("#modalMatKhau").val().trim(),
            VaiTro: $("#modalVaiTro").val(),
            NgayDangKy: new Date().toLocaleDateString()
        };

        if (!userData.TenNguoiDung || !userData.MatKhau) {
            alert("Tên người dùng và mật khẩu không được để trống");
            return;
        }

        if (editingUser) {
            await suaNguoiDung(editingUser, userData);
            const idx = cachedUsers.findIndex(u => u.TenNguoiDung === editingUser);
            if (idx >= 0) cachedUsers[idx] = userData;
        } else {
            await themNguoiDung(userData);
            cachedUsers.push(userData);
        }

        $("#userModal").hide();
        renderUsers(currentPage);
    });
});

function renderUsers(page = 1) {
    const tbody = $("#userTable tbody");
    tbody.empty();

    const totalPages = Math.ceil(cachedUsers.length / pageSize);
    currentPage = Math.min(Math.max(page, 1), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, cachedUsers.length);
    const pageUsers = cachedUsers.slice(startIndex, endIndex);

    for (let user of pageUsers) {
        const row = $(`
            <tr>
                <td>${user.TenNguoiDung}</td>
                <td>${user.HoTen || ""}</td>
                <td>${user.Email || ""}</td>
                <td>${user.NgayDangKy || ""}</td>
                <td>${user.VaiTro || ""}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(() => {
            editingUser = user.TenNguoiDung;
            $("#modalTitle").text("Sửa người dùng");
            $("#modalUsername").val(user.TenNguoiDung).prop("disabled", true);
            $("#modalHoTen").val(user.HoTen);
            $("#modalEmail").val(user.Email);
            $("#modalMatKhau").val(user.MatKhau);
            $("#modalVaiTro").val(user.VaiTro);
            $("#userModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa người dùng ${user.TenNguoiDung}?`)) {
                await xoaNguoiDung(user.TenNguoiDung);
                cachedUsers = cachedUsers.filter(u => u.TenNguoiDung !== user.TenNguoiDung);
                renderUsers(currentPage);
            }
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
        renderUsers(page);
    });
}