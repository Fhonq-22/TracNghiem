import { getData, updateData, addData, deleteData } from "../Models/firebase-CRUD.js";

export const BANG_THAM_CHIEU = {
    User: [
        { collection: "BoDe", field: "NguoiTao", kieu: "value" },
        { collection: "CauHoi", field: "NguoiTao", kieu: "value" },
        { collection: "KetQua", field: "TenNguoiDung", kieu: "value" },
        { collection: "PhienChoi", field: "NguoiTao", kieu: "value" }
    ],

    BoDe: [
        { collection: "KetQua", field: "MaDe", kieu: "value" },
        { collection: "PhienChoi", field: "ChuDeHienTai", kieu: "value" }
    ],

    CauHoi: [
        { collection: "BoDe", field: "DanhSachCauHoi", kieu: "array" }
    ],

    CapDo: [
        { collection: "BoDe", field: "CapDo", kieu: "value" }
    ]
};

export async function kiemTraThamChieu(collection, ma) {
    const rules = BANG_THAM_CHIEU[collection];
    if (!rules) return [];

    const ketQua = [];

    for (let rule of rules) {
        const data = await getData(rule.collection, "");
        if (!data) continue;

        for (let key of Object.keys(data)) {
            const obj = data[key];

            if (
                rule.kieu === "array" &&
                Array.isArray(obj[rule.field]) &&
                obj[rule.field].includes(ma)
            ) {
                ketQua.push({
                    collection: rule.collection,
                    ma: key,
                    field: rule.field,
                    kieu: rule.kieu
                });
            }

            if (
                rule.kieu === "value" &&
                obj[rule.field] === ma
            ) {
                ketQua.push({
                    collection: rule.collection,
                    ma: key,
                    field: rule.field,
                    kieu: rule.kieu
                });
            }
        }
    }

    return ketQua;
}

export async function doiMaCoRangBuoc(collection, maCu, maMoi) {
    const dataCu = await getData(collection, maCu);
    if (!dataCu) {
        return { success: false, message: "Không tìm thấy mã cũ" };
    }

    const danhSachLienQuan = await kiemTraThamChieu(collection, maCu);

    await addData(collection, maMoi, dataCu);
    await deleteData(collection, maCu);

    for (let item of danhSachLienQuan) {
        const obj = await getData(item.collection, item.ma);
        if (!obj) continue;

        if (item.kieu === "array" && Array.isArray(obj[item.field])) {
            obj[item.field] = obj[item.field].map(x => x === maCu ? maMoi : x);
        }

        if (item.kieu === "value") {
            obj[item.field] = maMoi;
        }

        await updateData(item.collection, item.ma, obj);
    }

    return {
        success: true,
        updated: danhSachLienQuan
    };
}