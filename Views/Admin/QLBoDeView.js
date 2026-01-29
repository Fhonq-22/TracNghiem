import { layDanhSachBoDe, layBoDe, themBoDe, suaBoDe, xoaBoDe } from "../../Controllers/BoDeController.js";
import { layDanhSachCauHoi, layCauHoi } from "../../Controllers/CauHoiController.js";
import { layDanhSachCapDo, layCapDo } from "../../Controllers/CapDoController.js";
import { yeuCauAdmin, getUserHienTai } from "../../Utils/AUTH.js";

let editingBoDe = null;
let currentPage = 1;
const pageSize = 10;
let cachedCauHoiList = [];
let cachedBoDe = [];
let cachedCapDo = [];

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    cachedCauHoiList = await Promise.all((await layDanhSachCauHoi()).map(ma => layCauHoi(ma)));
    cachedCapDo = await Promise.all((await layDanhSachCapDo()).map(ma => layCapDo(ma)));
    cachedBoDe = (await Promise.all((await layDanhSachBoDe()).map(ma => layBoDe(ma)))).map(chuanHoaBoDe);

    renderBoDe(currentPage);

    $("#btnAddBoDe").click(() => {
        editingBoDe = null;
        $("#modalTitle").text("Thêm bộ đề");
        $("#modalTenBoDe").val("");
        $("#modalThoiGian").val(30);
        $("#modalCauHoiList").empty();
        renderCapDoSelect();

        cachedCauHoiList.forEach(ch => {
            $("#modalCauHoiList").append(`
                <div>
                    <input type="checkbox" class="chkCauHoi" value="${ch.MaCauHoi}">
                    ${ch.MaCauHoi} - ${ch.NoiDung}
                </div>
            `);
        });

        $("#boDeModal").show();
    });

    $("#modalCancel").click(() => $("#boDeModal").hide());

    $("#modalSave").click(async () => {
        const tenBoDe = $("#modalTenBoDe").val().trim();
        const capDo = $("#modalCapDo").val();
        const thoiGian = parseInt($("#modalThoiGian").val());
        const danhSachCauHoi = $(".chkCauHoi:checked").map((_, el) => el.value).get();

        if (!tenBoDe || danhSachCauHoi.length === 0) {
            alert("Tên bộ đề và danh sách câu hỏi không được để trống");
            return;
        }

        let maBoDe = editingBoDe || await generateNextBoDeCode();

        if (editingBoDe) {
            const old = cachedBoDe.find(b => b.MaBoDe === editingBoDe);
            const newData = {
                ...old,
                TenBoDe: tenBoDe,
                CapDo: capDo,
                DanhSachCauHoi: danhSachCauHoi,
                ThoiGian: thoiGian
            };

            await suaBoDe(editingBoDe, newData);
            cachedBoDe[cachedBoDe.findIndex(b => b.MaBoDe === editingBoDe)] = chuanHoaBoDe(newData);
            alert("Cập nhật bộ đề thành công");
        } else {
            const boDeData = {
                MaBoDe: maBoDe,
                TenBoDe: tenBoDe,
                CapDo: capDo,
                DanhSachCauHoi: danhSachCauHoi,
                ThoiGian: thoiGian,
                NgayTao: new Date().toLocaleDateString(),
                NguoiTao: getUserHienTai()?.TenNguoiDung || ""
            };

            await themBoDe(boDeData);
            cachedBoDe.push(chuanHoaBoDe(boDeData));
            alert("Thêm bộ đề thành công");
        }

        $("#boDeModal").hide();
        renderBoDe(currentPage);
    });
});

function chuanHoaBoDe(bd) {
    const ds = Array.isArray(bd?.DanhSachCauHoi) ? bd.DanhSachCauHoi : [];
    return { ...bd, DanhSachCauHoi: ds, SoCauHoi: ds.length };
}

function renderCapDoSelect(selected = null) {
    const select = $("#modalCapDo").empty();
    cachedCapDo.forEach(cd => select.append(`<option value="${cd.MaCapDo}">${cd.TenCapDo}</option>`));
    if (selected) select.val(selected);
}

function renderBoDe(page = 1) {
    const tbody = $("#boDeTable tbody").empty();
    const totalPages = Math.ceil(cachedBoDe.length / pageSize);
    currentPage = Math.min(Math.max(page, 1), totalPages);

    cachedBoDe.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(bd => {
        const row = $(`
            <tr>
                <td>${bd.MaBoDe}</td>
                <td>${bd.TenBoDe}</td>
                <td>${bd.CapDo}</td>
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

        row.find(".editBtn").click(() => {
            editingBoDe = bd.MaBoDe;
            $("#modalTitle").text("Sửa bộ đề");
            $("#modalTenBoDe").val(bd.TenBoDe);
            $("#modalThoiGian").val(bd.ThoiGian);
            $("#modalCauHoiList").empty();
            renderCapDoSelect(bd.CapDo);

            cachedCauHoiList.forEach(ch => {
                $("#modalCauHoiList").append(`
                    <div>
                        <input type="checkbox" class="chkCauHoi" value="${ch.MaCauHoi}" ${bd.DanhSachCauHoi.includes(ch.MaCauHoi) ? "checked" : ""}>
                        ${ch.MaCauHoi} - ${ch.NoiDung}
                    </div>
                `);
            });

            $("#boDeModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (!confirm(`Xóa bộ đề ${bd.MaBoDe}?`)) return;

            const res = await xoaBoDe(bd.MaBoDe);
            if (!res.success) {
                let msg = res.message || "Không thể xóa bộ đề";
                if (res.refs?.length) {
                    msg += "\n\nĐang được sử dụng tại:";
                    res.refs.forEach(r => msg += `\n- ${r.collection} (${r.ma})`);
                }
                alert(msg);
                return;
            }

            cachedBoDe = cachedBoDe.filter(b => b.MaBoDe !== bd.MaBoDe);
            renderBoDe(currentPage);
        });

        tbody.append(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const c = $("#pagination").empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        c.append(`<button class="pageBtn" data-page="1"><<</button>`);
        c.append(`<button class="pageBtn" data-page="${currentPage - 1}">Prev</button>`);
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        c.append(`<button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    }

    if (currentPage < totalPages) {
        c.append(`<button class="pageBtn" data-page="${currentPage + 1}">Next</button>`);
        c.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    c.find(".pageBtn").click(e => renderBoDe(+e.target.dataset.page));
}

async function generateNextBoDeCode() {
    let n = 1;
    const used = cachedBoDe.map(b => parseInt(b.MaBoDe.slice(2))).sort((a, b) => a - b);
    for (let x of used) if (x === n) n++; else if (x > n) break;
    return "BD" + String(n).padStart(4, "0");
}