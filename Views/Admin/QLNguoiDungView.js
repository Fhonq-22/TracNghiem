import { layDanhSachNguoiDung, layNguoiDung, themNguoiDung, suaNguoiDung, xoaNguoiDung } from "../../Controllers/UserController.js";

let editingUser = null;
let currentPage = 1;
const pageSize = 10;

$(document).ready(async function() {
    await loadUsers(currentPage);

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
        } else {
            await themNguoiDung(userData);
        }

        $("#userModal").hide();
        await loadUsers(currentPage);
    });
});

async function loadUsers(page = 1) {
    const danhSach = await layDanhSachNguoiDung();
    currentPage = page;
    const totalPages = Math.ceil(danhSach.length / pageSize);

    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pageUsers = danhSach.slice(startIdx, endIdx);

    const tbody = $("#userTable tbody");
    tbody.empty();

    for (let username of pageUsers) {
        const user = await layNguoiDung(username);
        const row = $(`
            <tr>
                <td>${username}</td>
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
            editingUser = username;
            $("#modalTitle").text("Sửa người dùng");
            $("#modalUsername").val(user.TenNguoiDung).prop("disabled", true);
            $("#modalHoTen").val(user.HoTen);
            $("#modalEmail").val(user.Email);
            $("#modalMatKhau").val(user.MatKhau);
            $("#modalVaiTro").val(user.VaiTro);
            $("#userModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa người dùng ${username}?`)) {
                await xoaNguoiDung(username);
                await loadUsers(currentPage);
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
        loadUsers(page);
    });
}