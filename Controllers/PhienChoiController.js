import { addData, getData, updateData, deleteData } from "../Models/firebase-CRUD.js";
import { PhienChoi } from "../Models/MODEL.js";

export async function themPhienChoi(phienChoi) {
    const newPhienChoi = new PhienChoi(
        phienChoi.MaPhienChoi,
        phienChoi.DanhSachNguoiChoi,
        phienChoi.SoVong,
        phienChoi.VongHienTai,
        phienChoi.NguoiChoiHienTai,
        phienChoi.ChuDeHienTai,
        phienChoi.NguoiTao,
        phienChoi.NgayTao
    );
    await addData("PhienChoi", newPhienChoi.MaPhienChoi, newPhienChoi.toJSON());
}

export async function layPhienChoi(maPhienChoi) {
    const data = await getData("PhienChoi", maPhienChoi);
    return data ? new PhienChoi(
        maPhienChoi,
        data.DanhSachNguoiChoi,
        data.SoVong,
        data.VongHienTai,
        data.NguoiChoiHienTai,
        data.ChuDeHienTai,
        data.NguoiTao,
        data.NgayTao
    ) : null;
}

export async function layDanhSachPhienChoi() {
    const data = await getData("PhienChoi", "");
    return data ? Object.keys(data) : [];
}

export async function suaPhienChoi(maPhienChoi, phienChoiMoi) {
    const updatedPhienChoi = new PhienChoi(
        maPhienChoi,
        phienChoiMoi.DanhSachNguoiChoi,
        phienChoiMoi.SoVong,
        phienChoiMoi.VongHienTai,
        phienChoiMoi.NguoiChoiHienTai,
        phienChoiMoi.ChuDeHienTai,
        phienChoiMoi.NguoiTao,
        phienChoiMoi.NgayTao
    );
    await updateData("PhienChoi", maPhienChoi, updatedPhienChoi.toJSON());
}

export async function xoaPhienChoi(maPhienChoi) {
    await deleteData("PhienChoi", maPhienChoi);
}