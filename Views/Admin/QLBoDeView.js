import { layDanhSachBoDe, layBoDe, themBoDe, suaBoDe, xoaBoDe } from "../../Controllers/BoDeController.js";
import { layDanhSachCauHoi, layCauHoi } from "../../Controllers/CauHoiController.js";
import { layDanhSachCapDo, layCapDo } from "../../Controllers/CapDoController.js";

let editingBoDe = null;
let currentPage = 1;
const pageSize = 10;
let cachedCauHoiList = [];
let cachedBoDe = [];
let cachedCapDo = [];

$(document).ready(async function() {
    cachedCauHoiList = await Promise.all((await layDanhSachCauHoi()).map(ma => layCauHoi(ma)));

    const maCapDoList = await layDanhSachCapDo();
    cachedCapDo = await Promise.all(maCapDoList.map(ma => layCapDo(ma)));

    const maBoDeList = await layDanhSachBoDe();
    cachedBoDe = await Promise.all(maBoDeList.map(ma => layBoDe(ma)));

    renderBoDe(currentPage);

    $("#btnAddBoDe").click(() => {
        editingBoDe = null;
        $("#modalTitle").text("Thêm bộ đề");
        $("#modalTenBoDe").val("");
        $("#modalThoiGian").val(30);
        $("#modalCauHoiList").empty();
        renderCapDoSelect();

        for (let ch of cachedCauHoiList) {
            $("#modalCauHoiList").append(`
                <div>
                    <input type="checkbox" class="chkCauHoi" value="${ch.MaCauHoi}">
                    ${ch.MaCauHoi} - ${ch.NoiDung}
                </div>
            `);
        }

        $("#boDeModal").show();
    });

    $("#modalCancel").click(() => $("#boDeModal").hide());

    $("#modalSave").click(async function() {
        const tenBoDe = $("#modalTenBoDe").val().trim();
        const capDo = $("#modalCapDo").val();
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
            CapDo: capDo,
            DanhSachCauHoi: danhSachCauHoi,
            ThoiGian: thoiGian,
            NgayTao: new Date().toLocaleDateString(),
            NguoiTao: "Admin"
        };

        if (editingBoDe) {
            await suaBoDe(editingBoDe, boDeData);
            const idx = cachedBoDe.findIndex(bd => bd.MaBoDe === editingBoDe);
            if (idx >= 0) cachedBoDe[idx] = boDeData;
        } else {
            await themBoDe(boDeData);
            cachedBoDe.push(boDeData);
        }

        $("#boDeModal").hide();
        renderBoDe(currentPage);
    });
});

function renderCapDoSelect(selected = null) {
    const select = $("#modalCapDo");
    select.empty();

    for (let cd of cachedCapDo) {
        select.append(`
            <option value="${cd.MaCapDo}">
                ${cd.TenCapDo}
            </option>
        `);
    }

    if (selected) select.val(selected);
}

function renderBoDe(page = 1) {
    const tbody = $("#boDeTable tbody");
    tbody.empty();

    const totalPages = Math.ceil(cachedBoDe.length / pageSize);
    currentPage = Math.min(Math.max(page, 1), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, cachedBoDe.length);
    const pageItems = cachedBoDe.slice(startIndex, endIndex);

    for (let bd of pageItems) {
        const row = $(`
            <tr>
                <td>${bd.MaBoDe}</td>
                <td>${bd.TenBoDe}</td>
                <td>${bd.CapDo}</td>
                <td>${bd.DanhSachCauHoi?.length || 0}</td>
                <td>${bd.ThoiGian}</td>
                <td>${bd.NgayTao}</td>
                <td>${bd.NguoiTao}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(() => {
            editingBoDe = bd.MaBoDe;
            $("#modalTitle").text("Sửa bộ đề");
            $("#modalTenBoDe").val(bd.TenBoDe);
            $("#modalThoiGian").val(bd.ThoiGian);
            $("#modalCauHoiList").empty();
            renderCapDoSelect(bd.CapDo);

            for (let ch of cachedCauHoiList) {
                $("#modalCauHoiList").append(`
                    <div>
                        <input type="checkbox" class="chkCauHoi" value="${ch.MaCauHoi}" ${bd.DanhSachCauHoi.includes(ch.MaCauHoi) ? "checked" : ""}>
                        ${ch.MaCauHoi} - ${ch.NoiDung}
                    </div>
                `);
            }

            $("#boDeModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa bộ đề ${bd.MaBoDe}?`)) {
                await xoaBoDe(bd.MaBoDe);
                cachedBoDe = cachedBoDe.filter(b => b.MaBoDe !== bd.MaBoDe);
                renderBoDe(currentPage);
            }
        });

        tbody.append(row);
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = $("#pagination");
    container.empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        container.append(`<button class="pageBtn" data-page="1"><<</button>`);
        container.append(`<button class="pageBtn" data-page="${currentPage-1}">Prev</button>`);
    }

    const range = 2;
    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);

    if (start > 1) container.append(`<span>...</span>`);
    for (let i = start; i <= end; i++) {
        container.append(`<button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    }
    if (end < totalPages) container.append(`<span>...</span>`);

    if (currentPage < totalPages) {
        container.append(`<button class="pageBtn" data-page="${currentPage+1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    container.find(".pageBtn").click(function() {
        renderBoDe(parseInt($(this).data("page")));
    });
}

async function generateNextBoDeCode() {
    let numbers = cachedBoDe.map(bd => parseInt(bd.MaBoDe.slice(2))).sort((a,b) => a-b);
    let nextNum = 1;
    for (let n of numbers) {
        if (n === nextNum) nextNum++;
        else if (n > nextNum) break;
    }
    return "BD" + String(nextNum).padStart(4, "0");
}