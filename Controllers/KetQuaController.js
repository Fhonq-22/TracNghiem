import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { KetQua } from "../Models/MODEL.js";

export async function themKetQua(ketQua) {
    const newKetQua = new KetQua(
        ketQua.MaKetQua,
        ketQua.MaDe,
        ketQua.TenNguoiDung,
        ketQua.ThoiGianBatDau,
        ketQua.ThoiGianNop,
        ketQua.Diem,
        ketQua.HanhViBatThuong ?? []
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
        data.Diem,
        data.HanhViBatThuong ?? []
    ) : null;
}

export async function layDanhSachKetQua() {
    const data = await getData("KetQua", "");
    return data ? Object.keys(data) : [];
}

export async function layMaKetQuaTheoNguoiDung(tenNguoiDung) {
    const data = await getData("KetQua", "");
    if (!data) return [];

    return Object.keys(data).filter(
        maKetQua => data[maKetQua].TenNguoiDung === tenNguoiDung
    );
}

export async function suaKetQua(maKetQua, ketQuaMoi) {
    const updatedKetQua = new KetQua(
        maKetQua,
        ketQuaMoi.MaDe,
        ketQuaMoi.TenNguoiDung,
        ketQuaMoi.ThoiGianBatDau,
        ketQuaMoi.ThoiGianNop,
        ketQuaMoi.Diem,
        ketQuaMoi.HanhViBatThuong ?? []
    );
    await updateData("KetQua", maKetQua, updatedKetQua.toJSON());
}

export async function xoaKetQua(maKetQua) {
    await deleteData("KetQua", maKetQua);
}