# Form Tính Tiền Hóa Đơn — Tauri App

Ứng dụng desktop tính tiền phòng và xuất hóa đơn, xây dựng bằng **Tauri + Rust + Vanilla JS**.

---

## Cấu trúc thư mục

```
tax_calculator/
├── src/
│   └── index.html       # Giao diện chính (HTML + CSS + JS)
├── src-tauri/
│   ├── src/             # Rust backend
│   ├── icons/           # Icon ứng dụng
│   ├── Cargo.toml       # Rust dependencies
│   └── tauri.conf.json  # Cấu hình Tauri
├── package.json
└── README.md
```

---

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18.x
- **Rust** (cài qua [rustup](https://rustup.rs))
- **npm** >= 9.x

### Bước 1 — Cài dependencies

```bash
npm install
```

### Bước 2 — Chạy dev

```bash
npm run dev
```

---

## Tính năng

| Tính năng | Mô tả |
|---|---|
| **Tính tiền tự động** | Nhập giá phòng, số đêm, kiểu hóa đơn → tính ngay |
| **3 kiểu xuất hóa đơn** | Bằng giá phòng / Cao hơn 10%+15% / Tùy chỉnh |
| **Giao diện tối** | Dark UI hiện đại, dễ nhìn |

---

## Công thức tính

```
Tổng tiền phòng    = Giá phòng × Số đêm

--- Kiểu "Xuất cao hơn (10% + 15%)":
Tiền HĐ phòng     = Tổng tiền phòng × 10%
Tiền HĐ thêm      = (Tổng muốn xuất - Tổng tiền phòng) × 15%
Tổng tiền HĐ      = Tiền HĐ phòng + Tiền HĐ thêm
Số tiền cần thu   = Tổng tiền phòng + Tổng tiền HĐ
```

---

## Build thành file cài đặt

```bash
npm run build
```

Output: `tax_calculate.exe` (NSIS installer) tại thư mục gốc.

---

## Tech Stack

- **Tauri** 1.8 — desktop runtime
- **Rust** — backend logic
- **Vanilla JS + CSS** — frontend (không cần framework)
