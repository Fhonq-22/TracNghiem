import { layDanhSachBoDe, layBoDe, themBoDe, suaBoDe, xoaBoDe } from "../../Controllers/BoDeController.js";
import { layDanhSachCauHoi, layCauHoi } from "../../Controllers/CauHoiController.js";

let editingBoDe = null;

$(document).ready(async function() {
    await loadBoDe();

    $("#btnAddBoDe").click(async () => {
        editingBoDe = null;
        $("#modalTitle").text("Thêm bộ đề");
        $("#modalTenBoDe").val("");
        $("#modalThoiGian").val(30);
        $("#modalCauHoiList").empty();

        const danhSachCauHoi = await layDanhSachCauHoi();
        for (let ma of danhSachCauHoi) {
            const ch = await layCauHoi(ma);
            $("#modalCauHoiList").append(`
                <div>
                    <input type="checkbox" class="chkCauHoi" value="${ma}">
                    ${ma} - ${ch.NoiDung}
                </div>
            `);
        }

        $("#boDeModal").show();
    });

    $("#modalCancel").click(() => $("#boDeModal").hide());

    $("#modalSave").click(async function() {
        const tenBoDe = $("#modalTenBoDe").val().trim();
        const thoiGian = parseInt($("#modalThoiGian").val());
        const danhSachCauHoi = $(".chkCauHoi:checked").map((i, el) => $(el).val()).get();

        if (!tenBoDe || danhSachCauHoi.length === 0) {
            alert("Tên bộ đề và danh sách câu hỏi không được để trống");
            return;
        }

        let maBoDe = editingBoDe || await generateNextBoDeCode();

        const boDeData = {
            MaBoDe: maBoDe,
            TenBoDe: tenBoDe,
            DanhSachCauHoi: danhSachCauHoi,
            ThoiGian: thoiGian,
            NgayTao: new Date().toLocaleDateString(),
            NguoiTao: "Admin"
        };

        if (editingBoDe) {
            await suaBoDe(editingBoDe, boDeData);
        } else {
            await themBoDe(boDeData);
        }

        $("#boDeModal").hide();
        await loadBoDe();
    });
});

async function loadBoDe() {
    const danhSach = await layDanhSachBoDe();
    const tbody = $("#boDeTable tbody");
    tbody.empty();

    for (let ma of danhSach) {
        const bd = await layBoDe(ma);
        const row = $(`
            <tr>
                <td>${ma}</td>
                <td>${bd.TenBoDe}</td>
                <td>${bd.SoCauHoi}</td>
                <td>${bd.ThoiGian}</td>
                <td>${bd.NgayTao}</td>
                <td>${bd.NguoiTao}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(async () => {
            editingBoDe = ma;
            $("#modalTitle").text("Sửa bộ đề");
            $("#modalTenBoDe").val(bd.TenBoDe);
            $("#modalThoiGian").val(bd.ThoiGian);
            $("#modalCauHoiList").empty();

            const danhSachCauHoi = await layDanhSachCauHoi();
            for (let maC of danhSachCauHoi) {
                const ch = await layCauHoi(maC);
                $("#modalCauHoiList").append(`
                    <div>
                        <input type="checkbox" class="chkCauHoi" value="${maC}" ${bd.DanhSachCauHoi.includes(maC) ? "checked" : ""}>
                        ${maC} - ${ch.NoiDung}
                    </div>
                `);
            }

            $("#boDeModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa bộ đề ${ma}?`)) {
                await xoaBoDe(ma);
                await loadBoDe();
            }
        });

        tbody.append(row);
    }
}

async function generateNextBoDeCode() {
    const danhSach = await layDanhSachBoDe();
    let numbers = danhSach.map(code => parseInt(code.slice(2))).sort((a,b) => a-b);
    let nextNum = 1;
    for (let n of numbers) {
        if (n === nextNum) nextNum++;
        else if (n > nextNum) break;
    }
    return "BD" + String(nextNum).padStart(3, "0");
}