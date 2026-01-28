import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { BoDe } from "../Models/MODEL.js";

export async function themBoDe(boDe) {
    const newBoDe = new BoDe(
        boDe.MaBoDe,
        boDe.TenBoDe,
        boDe.DanhSachCauHoi,
        boDe.ThoiGian,
        boDe.NgayTao,
        boDe.NguoiTao
    );
    await addData("BoDe", newBoDe.MaBoDe, newBoDe.toJSON());
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

export async function layDanhSachBoDeDayDu() {
    const maList = await layDanhSachBoDe();
    return await Promise.all(maList.map(ma => layBoDe(ma)));
}

export async function suaBoDe(maBoDe, boDeMoi) {
    const updatedBoDe = new BoDe(
        maBoDe,
        boDeMoi.TenBoDe,
        boDeMoi.DanhSachCauHoi,
        boDeMoi.ThoiGian,
        boDeMoi.NgayTao,
        boDeMoi.NguoiTao
    );
    await updateData("BoDe", maBoDe, updatedBoDe.toJSON());
}

export async function xoaBoDe(maBoDe) {
    await deleteData("BoDe", maBoDe);
}