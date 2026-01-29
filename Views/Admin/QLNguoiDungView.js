import { layDanhSachNguoiDung, layNguoiDung, themNguoiDung, suaNguoiDung, xoaNguoiDung } from "../../Controllers/UserController.js";
import { yeuCauAdmin } from "../../Utils/AUTH.js";

let editingUser = null;
let currentPage = 1;
const pageSize = 10;
let cachedUsers = [];

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    const usernames = await layDanhSachNguoiDung();
    cachedUsers = await Promise.all(usernames.map(layNguoiDung));

    renderUsers();

    $("#btnAddUser").on("click", openAddModal);
    $("#modalCancel").on("click", () => $("#userModal").hide());
    $("#modalSave").on("click", saveUser);

    $("#userTable").on("click", ".editBtn", onEditUser);
    $("#userTable").on("click", ".deleteBtn", onDeleteUser);
    $("#pagination").on("click", ".pageBtn", onChangePage);
});

function openAddModal() {
    editingUser = null;
    $("#modalTitle").text("Thêm người dùng");
    $("#modalUsername").val("").prop("disabled", false);
    $("#modalHoTen, #modalEmail, #modalMatKhau").val("");
    $("#modalVaiTro").val("User");
    $("#userModal").show();
}

async function saveUser() {
    const username = $("#modalUsername").val().trim();
    const matKhau = $("#modalMatKhau").val().trim();

    if (!username || !matKhau) {
        alert("Tên người dùng và mật khẩu không được để trống");
        return;
    }

    if (editingUser) {
        const old = cachedUsers.find(u => u.TenNguoiDung === editingUser);

        const newData = {
            ...old,
            HoTen: $("#modalHoTen").val().trim(),
            Email: $("#modalEmail").val().trim(),
            MatKhau: matKhau,
            VaiTro: $("#modalVaiTro").val()
        };

        await suaNguoiDung(editingUser, newData);

        const idx = cachedUsers.findIndex(u => u.TenNguoiDung === editingUser);
        cachedUsers[idx] = newData;
    } else {
        const userData = {
            TenNguoiDung: username,
            HoTen: $("#modalHoTen").val().trim(),
            Email: $("#modalEmail").val().trim(),
            MatKhau: matKhau,
            VaiTro: $("#modalVaiTro").val(),
            NgayDangKy: new Date().toLocaleDateString()
        };

        if (await layNguoiDung(username)) {
            alert("Tên người dùng đã tồn tại");
            return;
        }

        await themNguoiDung(userData);
        cachedUsers.push(userData);
    }

    $("#userModal").hide();
    renderUsers();
}

function onEditUser() {
    const username = $(this).data("user");
    const user = cachedUsers.find(u => u.TenNguoiDung === username);

    editingUser = username;
    $("#modalTitle").text("Sửa người dùng");
    $("#modalUsername").val(user.TenNguoiDung).prop("disabled", true);
    $("#modalHoTen").val(user.HoTen || "");
    $("#modalEmail").val(user.Email || "");
    $("#modalMatKhau").val(user.MatKhau || "");
    $("#modalVaiTro").val(user.VaiTro || "User");
    $("#userModal").show();
}

async function onDeleteUser() {
    const username = $(this).data("user");
    if (!confirm(`Xóa người dùng ${username}?`)) return;

    const res = await xoaNguoiDung(username);

    if (!res.success) {
        let msg = res.message || "Không thể xóa người dùng";
        if (res.refs?.length) {
            msg += "\n\nĐang được sử dụng tại:";
            res.refs.forEach(r => msg += `\n- ${r.collection} (${r.ma})`);
        }
        alert(msg);
        return;
    }

    cachedUsers = cachedUsers.filter(u => u.TenNguoiDung !== username);
    renderUsers();
}

function renderUsers(page = currentPage) {
    const tbody = $("#userTable tbody").empty();

    const totalPages = Math.ceil(cachedUsers.length / pageSize);
    currentPage = Math.min(Math.max(page, 1), totalPages || 1);

    const start = (currentPage - 1) * pageSize;
    const pageUsers = cachedUsers.slice(start, start + pageSize);

    pageUsers.forEach(u => {
        tbody.append(`
            <tr>
                <td>${u.TenNguoiDung}</td>
                <td>${u.HoTen || ""}</td>
                <td>${u.Email || ""}</td>
                <td>${u.NgayDangKy || ""}</td>
                <td>${u.VaiTro || ""}</td>
                <td>
                    <button class="editBtn" data-user="${u.TenNguoiDung}">Sửa</button>
                    <button class="deleteBtn" data-user="${u.TenNguoiDung}">Xóa</button>
                </td>
            </tr>
        `);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = $("#pagination").empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        container.append(`<button class="pageBtn" data-page="1"><<</button>`);
        container.append(`<button class="pageBtn" data-page="${currentPage - 1}">Prev</button>`);
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        container.append(`
            <button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">
                ${i}
            </button>
        `);
    }

    if (currentPage < totalPages) {
        container.append(`<button class="pageBtn" data-page="${currentPage + 1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }
}

function onChangePage() {
    renderUsers(parseInt($(this).data("page")));
}