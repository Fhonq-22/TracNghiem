import {
    layDanhSachNguoiDung,
    layNguoiDung,
    themNguoiDung,
    suaNguoiDung,
    xoaNguoiDung
} from "../../Controllers/UserController.js";

import { yeuCauAdmin } from "../../Utils/AUTH.utils.js";

let nguoiDungDangSua = null;
let trangHienTai = 1;
const soDongMoiTrang = 10;
let danhSachNguoiDung = [];

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    $("#tieu-de-trang").text("Quản lý người dùng");
    $("#btn-them").text("Thêm người dùng");

    $("#bang-head").html(`
        <tr>
            <th>Tên người dùng</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Ngày đăng ký</th>
            <th>Vai trò</th>
            <th>Hành động</th>
        </tr>
    `);

    const dsTen = await layDanhSachNguoiDung();
    danhSachNguoiDung = await Promise.all(dsTen.map(layNguoiDung));

    renderDanhSach();

    $("#btn-them").on("click", moModalThem);
    $("#modal-huy").on("click", dongModal);
    $("#modal-luu").on("click", luuNguoiDung);

    $("#bang-body").on("click", ".btn-sua", suaClick);
    $("#bang-body").on("click", ".btn-xoa", xoaClick);
    $("#phan-trang").on("click", ".page-btn", doiTrang);
});

function moModalThem() {
    nguoiDungDangSua = null;

    $("#modal-title").text("Thêm người dùng");
    $("#modal-body").html(`
        <input id="ten-nguoi-dung" placeholder="Tên người dùng">
        <input id="ho-ten" placeholder="Họ tên">
        <input id="email" placeholder="Email">
        <input id="mat-khau" placeholder="Mật khẩu">
        <select id="vai-tro">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
        </select>
    `);

    $("#modal").removeClass("hidden");
}

function dongModal() {
    $("#modal").addClass("hidden");
}

async function luuNguoiDung() {
    const ten = $("#ten-nguoi-dung").val().trim();
    const mk = $("#mat-khau").val().trim();

    if (!ten || !mk) {
        alert("Tên người dùng và mật khẩu không được để trống");
        return;
    }

    if (nguoiDungDangSua) {
        const cu = danhSachNguoiDung.find(u => u.TenNguoiDung === nguoiDungDangSua);
        const moi = {
            ...cu,
            HoTen: $("#ho-ten").val(),
            Email: $("#email").val(),
            MatKhau: mk,
            VaiTro: $("#vai-tro").val()
        };
        await suaNguoiDung(nguoiDungDangSua, moi);
        Object.assign(cu, moi);
    } else {
        if (await layNguoiDung(ten)) {
            alert("Tên người dùng đã tồn tại");
            return;
        }
        const user = {
            TenNguoiDung: ten,
            HoTen: $("#ho-ten").val(),
            Email: $("#email").val(),
            MatKhau: mk,
            VaiTro: $("#vai-tro").val(),
            NgayDangKy: new Date().toLocaleDateString()
        };
        await themNguoiDung(user);
        danhSachNguoiDung.push(user);
    }

    dongModal();
    renderDanhSach();
}

function renderDanhSach(trang = trangHienTai) {
    const tbody = $("#bang-body").empty();
    const tongTrang = Math.ceil(danhSachNguoiDung.length / soDongMoiTrang);
    trangHienTai = Math.min(Math.max(trang, 1), tongTrang || 1);

    const batDau = (trangHienTai - 1) * soDongMoiTrang;
    const dsTrang = danhSachNguoiDung.slice(batDau, batDau + soDongMoiTrang);

    dsTrang.forEach(u => {
        tbody.append(`
            <tr>
                <td>${u.TenNguoiDung}</td>
                <td>${u.HoTen || ""}</td>
                <td>${u.Email || ""}</td>
                <td>${u.NgayDangKy || ""}</td>
                <td>${u.VaiTro || ""}</td>
                <td>
                    <button class="btn-sua" data-id="${u.TenNguoiDung}">Sửa</button>
                    <button class="btn-xoa" data-id="${u.TenNguoiDung}">Xóa</button>
                </td>
            </tr>
        `);
    });

    renderPhanTrang(tongTrang);
}

function renderPhanTrang(tongTrang) {
    const box = $("#phan-trang").empty();
    if (tongTrang <= 1) return;

    if (trangHienTai > 1) {
        box.append(`<button class="page-btn" data-page="${trangHienTai - 1}">Prev</button>`);
    }

    for (let i = 1; i <= tongTrang; i++) {
        box.append(`
            <button class="page-btn ${i === trangHienTai ? "active" : ""}" data-page="${i}">
                ${i}
            </button>
        `);
    }

    if (trangHienTai < tongTrang) {
        box.append(`<button class="page-btn" data-page="${trangHienTai + 1}">Next</button>`);
    }
}

function doiTrang() {
    renderDanhSach(parseInt($(this).data("page")));
}

function suaClick() {
    nguoiDungDangSua = $(this).data("id");
    const u = danhSachNguoiDung.find(x => x.TenNguoiDung === nguoiDungDangSua);

    $("#modal-title").text("Sửa người dùng");
    $("#modal-body").html(`
        <input id="ten-nguoi-dung" value="${u.TenNguoiDung}" disabled>
        <input id="ho-ten" value="${u.HoTen || ""}">
        <input id="email" value="${u.Email || ""}">
        <input id="mat-khau" value="${u.MatKhau || ""}">
        <select id="vai-tro">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
        </select>
    `);

    $("#vai-tro").val(u.VaiTro);
    $("#modal").removeClass("hidden");
}

async function xoaClick() {
    const ten = $(this).data("id");
    if (!confirm(`Xóa người dùng ${ten}?`)) return;

    const res = await xoaNguoiDung(ten);
    if (!res.success) {
        alert(res.message || "Không thể xóa");
        return;
    }

    danhSachNguoiDung = danhSachNguoiDung.filter(u => u.TenNguoiDung !== ten);
    renderDanhSach();
}