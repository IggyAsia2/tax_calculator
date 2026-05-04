# 🧾 Form Tính Tiền Hóa Đơn — Electron App

Ứng dụng desktop tính tiền phòng và xuất hóa đơn Excel, xây dựng bằng **Node.js + Electron**.

---

## 📁 Cấu trúc thư mục

```
electron-app/
├── main.js          # Electron main process (backend logic)
├── preload.js       # Secure IPC bridge (contextBridge)
├── index.html       # Giao diện chính (HTML + CSS + JS)
├── package.json     # Config & dependencies
├── assets/
│   └── icon.png     # Icon ứng dụng (tùy chọn)
└── README.md
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- **Node.js** >= 18.x  
- **npm** >= 9.x

### Bước 1 — Cài dependencies

```bash
cd electron-app
npm install
```

### Bước 2 — Chạy ứng dụng

```bash
npm start
```

---

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| **Tính tiền tự động** | Nhập giá phòng, số đêm, kiểu hóa đơn → tính ngay |
| **3 kiểu xuất hóa đơn** | Bằng giá phòng / Cao hơn 10%+15% / Tùy chỉnh |
| **Xuất file Excel** | Tạo file `.xlsx` đẹp với đầy đủ thông tin |
| **Mở file sau khi xuất** | Tự động mở file Excel vừa tạo |
| **Giao diện tối** | Dark UI hiện đại, dễ nhìn |

---

## 🔧 Công thức tính

```
Tổng tiền phòng    = Giá phòng × Số đêm

--- Kiểu "Xuất cao hơn (10% + 15%)":
Tiền HĐ phòng     = Tổng tiền phòng × 10%
Tiền HĐ thêm      = (Tổng muốn xuất - Tổng tiền phòng) × 15%
Tổng tiền HĐ      = Tiền HĐ phòng + Tiền HĐ thêm
Số tiền cần thu   = Tổng tiền phòng + Tổng tiền HĐ
```

---

## 📦 Build thành file cài đặt

```bash
npm run build
```

File output sẽ nằm trong thư mục `dist/`.

> Cần cài thêm: `npm install --save-dev electron-builder`

---

## 🛠 Tech Stack

- **Electron** 28 — desktop runtime
- **ExcelJS** 4.4 — tạo file Excel
- **Node.js** — backend logic
- **Vanilla JS + CSS** — frontend (không cần framework)
