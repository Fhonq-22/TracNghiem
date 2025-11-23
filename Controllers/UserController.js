import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { User } from "../Models/MODEL.js";

export async function themNguoiDung(nguoiDung) {
    await addData("User", nguoiDung.TenNguoiDung, new User(
        nguoiDung.TenNguoiDung,
        nguoiDung.MatKhau,
        nguoiDung.HoTen,
        nguoiDung.Email,
        nguoiDung.NgayDangKy,
        nguoiDung.VaiTro
    ).toJSON());
}

export async function layNguoiDung(username) {
    const data = await getData("Users", username);
    return data ? new User(
        username,
        data.MatKhau,
        data.HoTen,
        data.Email,
        data.NgayDangKy,
        data.VaiTro
    ) : null;
}

export async function layDanhSachNguoiDung() {
    const data = await getData("User","");
    return data ? Object.keys(data) : [];
}

export async function suaNguoiDung(username, newData) {
    const updatedUser = new User(
        username,
        newData.MatKhau,
        newData.HoTen,
        newData.Email,
        newData.NgayDangKy,
        newData.VaiTro
    );
    await updateData("User", username, updatedUser.toJSON());
}

export async function xoaNguoiDung(username) {
    await deleteData("User", username);
}