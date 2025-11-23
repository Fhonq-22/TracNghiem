import { layDanhSachNguoiDung, layNguoiDung, themNguoiDung, suaNguoiDung, xoaNguoiDung } from "../../Controllers/UserController.js";

let editingUser = null;

$(document).ready(async function() {
    await loadUsers();

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
        await loadUsers();
    });
});

async function loadUsers() {
    const danhSach = await layDanhSachNguoiDung();
    const tbody = $("#userTable tbody");
    tbody.empty();

    for (let username of danhSach) {
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
                await loadUsers();
            }
        });

        tbody.append(row);
    }
}