import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { BoDe } from "../Models/MODEL.js";

export async function themBoDe(boDe) {
    const boDeInstance = new BoDe(
        boDe.MaBoDe,
        boDe.TenBoDe,
        boDe.DanhSachCauHoi,
        boDe.ThoiGian,
        boDe.NgayTao,
        boDe.NguoiTao
    );
    await addData("BoDe", boDe.MaBoDe, boDeInstance.toJSON());
}

export async function layBoDe(maBoDe) {
    const data = await getData("BoDe", maBoDe);
    return data ? new BoDe(
        maBoDe,
        data.TenBoDe,
        data.DanhSachCauHoi,
        data.ThoiGian,
        data.NgayTao,
        data.NguoiTao
    ) : null;
}

export async function layDanhSachBoDe() {
    const data = await getData("BoDe", "");
    return data ? Object.keys(data) : [];
}

export async function suaBoDe(maBoDe, boDeMoi) {
    const boDeInstance = new BoDe(
        maBoDe,
        boDeMoi.TenBoDe,
        boDeMoi.DanhSachCauHoi,
        boDeMoi.ThoiGian,
        boDeMoi.NgayTao,
        boDeMoi.NguoiTao
    );
    await updateData("BoDe", maBoDe, boDeInstance.toJSON());
}

export async function xoaBoDe(maBoDe) {
    await deleteData("BoDe", maBoDe);
}