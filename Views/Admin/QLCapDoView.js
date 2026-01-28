import { layDanhSachCapDo, layCapDo, themCapDo, suaCapDo, xoaCapDo } from "../../Controllers/CapDoController.js";

let cachedCapDo = [];
let editingCapDo = null;

$(document).ready(async function () {
    const maList = await layDanhSachCapDo();
    cachedCapDo = await Promise.all(maList.map(ma => layCapDo(ma)));
    renderCapDo();

    $("#btnAddCapDo").click(() => {
        editingCapDo = null;
        $("#modalTitle").text("Thêm cấp độ");
        $("#modalTenCapDo").val("");
        $("#modalDiemMoiCau").val("");
        $("#modalHeSoTraLoiPhu").val(0.5);
        $("#capDoModal").show();
    });

    $("#modalCancel").click(() => $("#capDoModal").hide());

    $("#modalSave").click(async () => {
        const tenCapDo = $("#modalTenCapDo").val().trim();
        const diemMoiCau = parseFloat($("#modalDiemMoiCau").val());
        const heSoTraLoiPhu = parseFloat($("#modalHeSoTraLoiPhu").val());

        if (!tenCapDo || isNaN(diemMoiCau)) {
            alert("Dữ liệu không hợp lệ");
            return;
        }

        const maCapDo = editingCapDo || await generateNextCapDoCode();
        const data = {
            MaCapDo: maCapDo,
            TenCapDo: tenCapDo,
            DiemMoiCau: diemMoiCau,
            HeSoTraLoiPhu: heSoTraLoiPhu,
            NgayCapNhat: new Date().toLocaleDateString("vi-VN")
        };

        if (editingCapDo) {
            await suaCapDo(editingCapDo, data);
            const idx = cachedCapDo.findIndex(c => c.MaCapDo === editingCapDo);
            if (idx >= 0) cachedCapDo[idx] = data;
        } else {
            await themCapDo(data);
            cachedCapDo.push(data);
        }

        $("#capDoModal").hide();
        renderCapDo();
    });
});

function renderCapDo() {
    const tbody = $("#capDoTable tbody").empty();

    for (let cd of cachedCapDo) {
        const row = $(`
            <tr>
                <td>${cd.MaCapDo}</td>
                <td>${cd.TenCapDo}</td>
                <td>${cd.DiemMoiCau}</td>
                <td>${cd.HeSoTraLoiPhu}</td>
                <td>${cd.NgayCapNhat}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(() => {
            editingCapDo = cd.MaCapDo;
            $("#modalTitle").text("Sửa cấp độ");
            $("#modalTenCapDo").val(cd.TenCapDo);
            $("#modalDiemMoiCau").val(cd.DiemMoiCau);
            $("#modalHeSoTraLoiPhu").val(cd.HeSoTraLoiPhu);
            $("#capDoModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa cấp độ ${cd.MaCapDo}?`)) {
                await xoaCapDo(cd.MaCapDo);
                cachedCapDo = cachedCapDo.filter(c => c.MaCapDo !== cd.MaCapDo);
                renderCapDo();
            }
        });

        tbody.append(row);
    }
}

async function generateNextCapDoCode() {
    const nums = cachedCapDo
        .map(c => parseInt(c.MaCapDo.slice(2)))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    let next = 1;
    for (let n of nums) {
        if (n === next) next++;
        else break;
    }
    return "CD" + String(next).padStart(2, "0");
}