import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { BoDe } from "../Models/MODEL.js";

export async function themBoDe(boDe) {
    await addData("BoDe", boDe.MaBoDe, boDe.toJSON());
}

export async function layBoDe(maBoDe) {
    const data = await getData("BoDe", maBoDe);
    return data ? new BoDe(maBoDe, data.TenBoDe, data.DanhSachCauHoi, data.ThoiGian, data.NgayTao, data.NguoiTao) : null;
}

export async function layDanhSachBoDe() {
    const data = await getData("BoDe", "");
    return data ? Object.keys(data) : [];
}

export async function suaBoDe(maBoDe, boDeMoi) {
    await updateData("BoDe", maBoDe, boDeMoi.toJSON());
}

export async function xoaBoDe(maBoDe) {
    await deleteData("BoDe", maBoDe);
}