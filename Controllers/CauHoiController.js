import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { CauHoi } from "../Models/MODEL.js";

export async function themCauHoi(cauHoi) {
    await addData("CauHoi", cauHoi.MaCauHoi, new CauHoi(
        cauHoi.MaCauHoi,
        cauHoi.NoiDung,
        cauHoi.PhuongAn,
        cauHoi.DapAnDung,
        cauHoi.GiaiThich,
        cauHoi.NguoiTao,
        cauHoi.NgayTao
    ).toJSON());
}

export async function layCauHoi(maCauHoi) {
    const data = await getData("CauHoi", maCauHoi);
    return data ? new CauHoi(
        maCauHoi,
        data.NoiDung,
        data.PhuongAn,
        data.DapAnDung,
        data.GiaiThich || "",
        data.NguoiTao || "",
        data.NgayTao || ""
    ) : null;
}

export async function layDanhSachCauHoi() {
    const data = await getData("CauHoi", "");
    return data ? Object.keys(data) : [];
}

export async function suaCauHoi(maCauHoi, cauHoiMoi) {
    const updatedQuestion = new CauHoi(
        maCauHoi,
        cauHoiMoi.NoiDung,
        cauHoiMoi.PhuongAn,
        cauHoiMoi.DapAnDung,
        cauHoiMoi.GiaiThich,
        cauHoiMoi.NguoiTao,
        cauHoiMoi.NgayTao
    );
    await updateData("CauHoi", maCauHoi, updatedQuestion.toJSON());
}

export async function xoaCauHoi(maCauHoi) {
    await deleteData("CauHoi", maCauHoi);
}