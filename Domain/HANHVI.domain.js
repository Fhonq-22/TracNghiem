export const HANHVI = {
    ROI_TAB: { CODE: "ROI_TAB", LABEL: "Rời khỏi tab làm bài" },
    COPY: { CODE: "COPY", LABEL: "Sao chép nội dung" },
    PASTE: { CODE: "PASTE", LABEL: "Dán nội dung" },
    DEVTOOLS: { CODE: "DEVTOOLS", LABEL: "Mở công cụ phát triển" }
};

let isHidden = false;
let danhSachHanhVi = [];

function ghiNhan(code) {
    danhSachHanhVi.push({
        Code: code,
        ThoiGian: new Date().toISOString()
    });
}

export function khoiTaoGiamSatHanhVi() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            isHidden = true;
        } else if (isHidden) {
            ghiNhan(HANHVI.ROI_TAB.CODE);
            isHidden = false;
        }
    });

    document.addEventListener("copy", () => {
        ghiNhan(HANHVI.COPY.CODE);
    });

    document.addEventListener("paste", () => {
        ghiNhan(HANHVI.PASTE.CODE);
    });

    document.addEventListener("keydown", (e) => {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key))
        ) {
            ghiNhan(HANHVI.DEVTOOLS.CODE);
        }
    });
}

export function layDanhSachHanhVi() {
    return danhSachHanhVi;
}