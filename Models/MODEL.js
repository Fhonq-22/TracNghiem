export class User {
    constructor(TenNguoiDung, MatKhau, HoTen, Email, NgayDangKy, VaiTro = "User") {
        this.TenNguoiDung = TenNguoiDung;
        this.MatKhau = MatKhau;
        this.HoTen = HoTen;
        this.Email = Email;
        this.NgayDangKy = NgayDangKy;
        this.VaiTro = VaiTro;
    }

    toJSON() {
        return {
            MatKhau: this.MatKhau,
            HoTen: this.HoTen,
            Email: this.Email,
            NgayDangKy: this.NgayDangKy,
            VaiTro: this.VaiTro
        };
    }
}

export class CauHoi {
    constructor(MaCauHoi, NoiDung, PhuongAn = [], DapAnDung = 0) {
        this.MaCauHoi = MaCauHoi;
        this.NoiDung = NoiDung;
        this.PhuongAn = PhuongAn;
        this.DapAnDung = DapAnDung;
    }

    toJSON() {
        return {
            NoiDung: this.NoiDung,
            PhuongAn: this.PhuongAn,
            DapAnDung: this.DapAnDung
        };
    }
}

export class BoDe {
    constructor(MaBoDe, TenBoDe, DanhSachCauHoi, ThoiGian, NgayTao, NguoiTao) {
        this.MaBoDe = MaBoDe;
        this.TenBoDe = TenBoDe;
        this.DanhSachCauHoi = DanhSachCauHoi || [];
        this.SoCauHoi = DanhSachCauHoi ? DanhSachCauHoi.length : 0;
        this.ThoiGian = ThoiGian || 30;
        this.NgayTao = NgayTao;
        this.NguoiTao = NguoiTao || "Admin";
    }

    toJSON() {
        return {
            TenBoDe: this.TenBoDe,
            DanhSachCauHoi: this.DanhSachCauHoi,
            SoCauHoi: this.SoCauHoi,
            ThoiGian: this.ThoiGian,
            NgayTao: this.NgayTao,
            NguoiTao: this.NguoiTao
        };
    }
}

export class KetQua {
    constructor(MaKetQua, MaDe, TenNguoiDung, ThoiGianBatDau, ThoiGianNop, Diem) {
        this.MaKetQua = MaKetQua;
        this.MaDe = MaDe;
        this.TenNguoiDung = TenNguoiDung;
        this.ThoiGianBatDau = ThoiGianBatDau;
        this.ThoiGianNop = ThoiGianNop;
        this.Diem = Diem;
    }

    toJSON() {
        return {
            MaDe: this.MaDe,
            TenNguoiDung: this.TenNguoiDung,
            ThoiGianBatDau: this.ThoiGianBatDau,
            ThoiGianNop: this.ThoiGianNop,
            Diem: this.Diem
        };
    }
}