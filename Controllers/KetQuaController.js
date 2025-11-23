import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { KetQua } from "../Models/MODEL.js";

export async function themKetQua(ketQua) {
    const newKetQua = new KetQua(
        ketQua.MaKetQua,
        ketQua.MaDe,
        ketQua.TenNguoiDung,
        ketQua.ThoiGianBatDau,
        ketQua.ThoiGianNop,
        ketQua.Diem
    );
    await addData("KetQua", newKetQua.MaKetQua, newKetQua.toJSON());
}

export async function layKetQua(maKetQua) {
    const data = await getData("KetQua", maKetQua);
    return data ? new KetQua(
        maKetQua,
        data.MaDe,
        data.TenNguoiDung,
        data.ThoiGianBatDau,
        data.ThoiGianNop,
        data.Diem
    ) : null;
}

export async function layDanhSachKetQua() {
    const data = await getData("KetQua", "");
    return data ? Object.keys(data) : [];
}

export async function suaKetQua(maKetQua, ketQuaMoi) {
    const updatedKetQua = new KetQua(
        maKetQua,
        ketQuaMoi.MaDe,
        ketQuaMoi.TenNguoiDung,
        ketQuaMoi.ThoiGianBatDau,
        ketQuaMoi.ThoiGianNop,
        ketQuaMoi.Diem
    );
    await updateData("KetQua", maKetQua, updatedKetQua.toJSON());
}

export async function xoaKetQua(maKetQua) {
    await deleteData("KetQua", maKetQua);
}