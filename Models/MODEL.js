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