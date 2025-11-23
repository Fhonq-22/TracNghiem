import { addData, getData, deleteData } from "../Models/firebase-CRUD.js";

export async function chuyenMotMa(collection, oldKey, newKey) {
    const data = await getData(collection, oldKey);
    if (!data) return { success: false, message: "Không tìm thấy mã cũ" };

    await addData(collection, newKey, data);
    await deleteData(collection, oldKey);

    return { success: true };
}

export async function chuyenHangLoat(collection, patternOld, patternNew) {
    const allData = await getData(collection, "");
    if (!allData) return { success: false, message: "Collection rỗng" };

    const oldLen = (patternOld.match(/#+/) || [""])[0].length;
    const newLen = (patternNew.match(/#+/) || [""])[0].length;

    const keys = Object.keys(allData);
    let result = [];

    for (let key of keys) {
        const match = key.match(/\d+/);
        if (!match) continue;

        const number = match[0];
        const newKey = patternNew.replace(/#+/, number.padStart(newLen, "0"));

        if (newKey === key) continue;

        await addData(collection, newKey, allData[key]);
        await deleteData(collection, key);

        result.push({ from: key, to: newKey });
    }

    return { success: true, changed: result };
}