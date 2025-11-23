import { layDanhSachCauHoi, layCauHoi, themCauHoi, suaCauHoi, xoaCauHoi } from "../../Controllers/CauHoiController.js";

let editingQuestion = null;

$(document).ready(async function() {
    await loadQuestions();

    $("#btnAddQuestion").click(() => {
        editingQuestion = null;
        $("#modalTitle").text("Thêm câu hỏi");
        $("#modalNoiDung").val("");
        $(".modalPhuongAn").val("");
        $("#modalDapAnDung").val("0");
        $("#autoCode").prop("checked", true);
        $("#modalMaCauHoi").val("").prop("disabled", true);

        $("#autoCode").off("change").on("change", function() {
            if ($(this).is(":checked")) {
                $("#modalMaCauHoi").val("").prop("disabled", true);
            } else {
                $("#modalMaCauHoi").prop("disabled", false);
            }
        });

        $("#questionModal").show();
    });

    $("#modalCancel").click(() => $("#questionModal").hide());

    $("#modalSave").click(async function() {
        let maCauHoi = $("#modalMaCauHoi").val().trim();

        if ($("#autoCode").is(":checked") && !editingQuestion) {
            const danhSach = await layDanhSachCauHoi();
            let maxNum = 0;
            for (let code of danhSach) {
                const num = parseInt(code.slice(1));
                if (num > maxNum) maxNum = num;
            }
            maCauHoi = "Q" + String(maxNum + 1).padStart(3, "0");
        }

        const phuongAn = $(".modalPhuongAn").map((i, el) => $(el).val().trim()).get();
        const cauHoiData = {
            MaCauHoi: maCauHoi,
            NoiDung: $("#modalNoiDung").val().trim(),
            PhuongAn: phuongAn,
            DapAnDung: parseInt($("#modalDapAnDung").val())
        };

        if (!cauHoiData.MaCauHoi || !cauHoiData.NoiDung) {
            alert("Mã câu hỏi và nội dung không được để trống");
            return;
        }

        if (editingQuestion) {
            await suaCauHoi(editingQuestion, cauHoiData);
        } else {
            await themCauHoi(cauHoiData);
        }

        $("#questionModal").hide();
        await loadQuestions();
    });
});

async function loadQuestions() {
    const danhSach = await layDanhSachCauHoi();
    const tbody = $("#questionTable tbody");
    tbody.empty();

    for (let maCauHoi of danhSach) {
        const cauHoi = await layCauHoi(maCauHoi);
        const row = $(`
            <tr>
                <td>${maCauHoi}</td>
                <td>${cauHoi.NoiDung || ""}</td>
                <td>${cauHoi.PhuongAn[0] || ""}</td>
                <td>${cauHoi.PhuongAn[1] || ""}</td>
                <td>${cauHoi.PhuongAn[2] || ""}</td>
                <td>${cauHoi.PhuongAn[3] || ""}</td>
                <td>${cauHoi.DapAnDung}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(() => {
            editingQuestion = maCauHoi;
            $("#modalTitle").text("Sửa câu hỏi");
            $("#modalMaCauHoi").val(cauHoi.MaCauHoi).prop("disabled", true);
            $("#modalNoiDung").val(cauHoi.NoiDung);
            $(".modalPhuongAn").each((i, el) => $(el).val(cauHoi.PhuongAn[i] || ""));
            $("#modalDapAnDung").val(cauHoi.DapAnDung);
            $("#autoCode").prop("checked", true).prop("disabled", true);
            $("#questionModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa câu hỏi ${maCauHoi}?`)) {
                await xoaCauHoi(maCauHoi);
                await loadQuestions();
            }
        });

        tbody.append(row);
    }
}