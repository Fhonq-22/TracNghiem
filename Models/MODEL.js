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
    constructor(MaCauHoi, NoiDung, PhuongAn = [], DapAnDung = 0, GiaiThich = "", NguoiTao = "", NgayTao = "") {
        this.MaCauHoi = MaCauHoi;
        this.NoiDung = NoiDung;
        this.PhuongAn = PhuongAn;
        this.DapAnDung = DapAnDung;
        this.GiaiThich = GiaiThich;
        this.NguoiTao = NguoiTao || "Admin";
        this.NgayTao = NgayTao;
    }

    toJSON() {
        return {
            NoiDung: this.NoiDung,
            PhuongAn: this.PhuongAn,
            DapAnDung: this.DapAnDung,
            GiaiThich: this.GiaiThich,
            NguoiTao: this.NguoiTao,
            NgayTao: this.NgayTao
        };
    }
}

export class BoDe {
    constructor(MaBoDe, TenBoDe, DanhSachCauHoi, CapDo, ThoiGian, NgayTao, NguoiTao) {
        this.MaBoDe = MaBoDe;
        this.TenBoDe = TenBoDe;
        this.DanhSachCauHoi = DanhSachCauHoi || [];
        this.SoCauHoi = DanhSachCauHoi ? DanhSachCauHoi.length : 0;
        this.CapDo = CapDo || "DE";
        this.ThoiGian = ThoiGian || 30;
        this.NgayTao = NgayTao;
        this.NguoiTao = NguoiTao || "Admin";
    }

    toJSON() {
        return {
            TenBoDe: this.TenBoDe,
            DanhSachCauHoi: this.DanhSachCauHoi,
            SoCauHoi: this.SoCauHoi,
            CapDo: this.CapDo,
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

export class PhienChoi {
    constructor(MaPhienChoi, DanhSachNguoiChoi, SoVong, VongHienTai, NguoiChoiHienTai, ChuDeHienTai, NguoiTao, NgayTao, DaKetThuc  = false) {
        this.MaPhienChoi = MaPhienChoi;
        this.DanhSachNguoiChoi = DanhSachNguoiChoi || {};
        this.SoVong = SoVong || 1;
        this.VongHienTai = VongHienTai || 1;
        this.NguoiChoiHienTai = NguoiChoiHienTai;
        this.ChuDeHienTai = ChuDeHienTai;
        this.NguoiTao = NguoiTao;
        this.NgayTao = NgayTao;
        this.DaKetThuc  = DaKetThuc ;
    }

    toJSON() {
        return {
            DanhSachNguoiChoi: this.DanhSachNguoiChoi,
            SoVong: this.SoVong,
            VongHienTai: this.VongHienTai,
            NguoiChoiHienTai: this.NguoiChoiHienTai,
            ChuDeHienTai: this.ChuDeHienTai,
            NguoiTao: this.NguoiTao,
            NgayTao: this.NgayTao,
            DaKetThuc : this.DaKetThuc 
        };
    }
}

export class CapDo {
    constructor(MaCapDo, TenCapDo, DiemMoiCau, HeSoTraLoiPhu, NgayCapNhat) {
        this.MaCapDo = MaCapDo;
        this.TenCapDo = TenCapDo;
        this.DiemMoiCau = DiemMoiCau;
        this.HeSoTraLoiPhu = HeSoTraLoiPhu ?? 0.5;
        this.NgayCapNhat = NgayCapNhat;
    }

    toJSON() {
        return {
            TenCapDo: this.TenCapDo,
            DiemMoiCau: this.DiemMoiCau,
            HeSoTraLoiPhu: this.HeSoTraLoiPhu,
            NgayCapNhat: this.NgayCapNhat
        };
    }
}