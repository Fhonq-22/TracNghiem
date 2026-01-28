import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { CapDo } from "../Models/MODEL.js";

export async function themCapDo(capDo) {
    const newCapDo = new CapDo(
        capDo.MaCapDo,
        capDo.TenCapDo,
        capDo.DiemMoiCau,
        capDo.HeSoTraLoiPhu,
        capDo.NgayCapNhat
    );
    await addData("CapDo", newCapDo.MaCapDo, newCapDo.toJSON());
}

export async function layCapDo(maCapDo) {
    const data = await getData("CapDo", maCapDo);
    return data ? new CapDo(
        maCapDo,
        data.TenCapDo,
        data.DiemMoiCau,
        data.HeSoTraLoiPhu,
        data.NgayCapNhat
    ) : null;
}

export async function layDanhSachCapDo() {
    const data = await getData("CapDo", "");
    return data ? Object.keys(data) : [];
}

export async function layDanhSachCapDoDayDu() {
    const maList = await layDanhSachCapDo();
    return await Promise.all(maList.map(ma => layCapDo(ma)));
}

export async function suaCapDo(maCapDo, capDoMoi) {
    const updatedCapDo = new CapDo(
        maCapDo,
        capDoMoi.TenCapDo,
        capDoMoi.DiemMoiCau,
        capDoMoi.HeSoTraLoiPhu,
        capDoMoi.NgayCapNhat
    );
    await updateData("CapDo", maCapDo, updatedCapDo.toJSON());
}

export async function xoaCapDo(maCapDo) {
    await deleteData("CapDo", maCapDo);
}