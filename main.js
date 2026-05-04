const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 750,
    minHeight: 600,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
    backgroundColor: '#0f172a',
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ─── IPC: Tính tiền ───────────────────────────────────────────────────────────
ipcMain.handle('tinh-tien', async (event, data) => {
  const { giaPhong, soDeM, kieuXuatHoaDon, tongTienMuonXuat } = data;

  const tongTienPhong = giaPhong * soDeM;
  let tienHoaDonPhong = 0;
  let tienHoaDonThem = 0;
  let tongTienHoaDon = 0;
  let soTienCanThu = 0;

  if (kieuXuatHoaDon === 'bang_gia') {
    // Xuất bằng giá phòng: chỉ tính 10% tiền phòng, không có tiền thêm
    tienHoaDonPhong = tongTienPhong * 0.10;
    tienHoaDonThem = 0;
    tongTienHoaDon = tienHoaDonPhong;
    soTienCanThu = tongTienMuonXuat - tongTienHoaDon;
  } else if (kieuXuatHoaDon === 'cao_hon_10_15') {
    // Xuất cao hơn (10% + 15%)
    const phanTramPhong = 0.10;
    const phanTramThem = 0.15;
    tienHoaDonPhong = tongTienPhong * phanTramPhong;
    tienHoaDonThem = (tongTienMuonXuat - tongTienPhong) * phanTramThem;
    tongTienHoaDon = tienHoaDonPhong + tienHoaDonThem;
    soTienCanThu = tongTienMuonXuat + tongTienHoaDon - (tongTienMuonXuat - tongTienPhong);
  }

  // Tính lại đúng theo logic file gốc:
  // SỐ TIỀN CẦN THU = Tổng tiền phòng + Tiền hóa đơn phòng + Tiền hóa đơn thêm
  soTienCanThu = tongTienPhong + tienHoaDonPhong + tienHoaDonThem;

  return {
    tongTienPhong,
    tienHoaDonPhong,
    tienHoaDonThem,
    tongTienHoaDon: tienHoaDonPhong + tienHoaDonThem,
    soTienCanThu,
  };
});

// ─── IPC: Xuất Excel ──────────────────────────────────────────────────────────
ipcMain.handle('xuat-excel', async (event, data) => {
  const { savePath, formData, ketQua } = data;

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Form Tính Tiền Hóa Đơn';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Form tính tiền', {
      pageSetup: { paperSize: 9, orientation: 'portrait' },
    });

    // Column widths
    sheet.getColumn(1).width = 28;
    sheet.getColumn(2).width = 22;

    // Styles
    const titleStyle = {
      font: { name: 'Times New Roman', size: 14, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e3a5f' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
    };
    const labelStyle = {
      font: { name: 'Times New Roman', size: 11, color: { argb: 'FF1e293b' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf1f5f9' } },
      alignment: { horizontal: 'left', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: 'FFcbd5e1' } },
        bottom: { style: 'thin', color: { argb: 'FFcbd5e1' } },
        left: { style: 'thin', color: { argb: 'FFcbd5e1' } },
        right: { style: 'thin', color: { argb: 'FFcbd5e1' } },
      },
    };
    const valueStyle = {
      font: { name: 'Times New Roman', size: 11, color: { argb: 'FF0f172a' } },
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '#,##0',
      border: {
        top: { style: 'thin', color: { argb: 'FFcbd5e1' } },
        bottom: { style: 'thin', color: { argb: 'FFcbd5e1' } },
        left: { style: 'thin', color: { argb: 'FFcbd5e1' } },
        right: { style: 'thin', color: { argb: 'FFcbd5e1' } },
      },
    };
    const totalLabelStyle = {
      font: { name: 'Times New Roman', size: 12, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1d4ed8' } },
      alignment: { horizontal: 'left', vertical: 'middle' },
      border: {
        top: { style: 'medium', color: { argb: 'FF1d4ed8' } },
        bottom: { style: 'medium', color: { argb: 'FF1d4ed8' } },
        left: { style: 'medium', color: { argb: 'FF1d4ed8' } },
        right: { style: 'medium', color: { argb: 'FF1d4ed8' } },
      },
    };
    const totalValueStyle = {
      font: { name: 'Times New Roman', size: 13, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdc2626' } },
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '#,##0',
      border: {
        top: { style: 'medium', color: { argb: 'FFdc2626' } },
        bottom: { style: 'medium', color: { argb: 'FFdc2626' } },
        left: { style: 'medium', color: { argb: 'FFdc2626' } },
        right: { style: 'medium', color: { argb: 'FFdc2626' } },
      },
    };

    const applyStyle = (cell, style) => Object.assign(cell, style);
    const addRow = (label, value, lStyle = labelStyle, vStyle = valueStyle, height = 22) => {
      const row = sheet.addRow([label, value]);
      row.height = height;
      applyStyle(row.getCell(1), lStyle);
      applyStyle(row.getCell(2), vStyle);
      return row;
    };

    // Title
    sheet.mergeCells('A1:B1');
    const titleRow = sheet.getRow(1);
    titleRow.height = 34;
    const titleCell = titleRow.getCell(1);
    titleCell.value = 'FORM TÍNH TIỀN HÓA ĐƠN';
    Object.assign(titleCell, titleStyle);

    sheet.addRow([]).height = 6;

    // Input section
    addRow('Giá phòng / đêm', formData.giaPhong);
    addRow('Số đêm', formData.soDeM);
    addRow('Tổng tiền phòng', ketQua.tongTienPhong);
    addRow('Kiểu xuất hóa đơn', (() => {
      const m = { bang_gia: 'Xuất bằng giá phòng', cao_hon_10_15: 'Xuất cao hơn (10% + 15%)' };
      const cell2 = sheet.lastRow ? null : null;
      return m[formData.kieuXuatHoaDon] || formData.kieuXuatHoaDon;
    })());
    // Fix kiểu xuất hóa đơn cell to not use number format
    const kieuRow = sheet.lastRow;
    kieuRow.getCell(2).numFmt = '@';
    kieuRow.getCell(2).value = { bang_gia: 'Xuất bằng giá phòng', cao_hon_10_15: 'Xuất cao hơn (10% + 15%)' }[formData.kieuXuatHoaDon] || formData.kieuXuatHoaDon;
    kieuRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };

    addRow('Tổng tiền muốn xuất', formData.tongTienMuonXuat);

    sheet.addRow([]).height = 6;

    // Result section
    addRow('Tiền hóa đơn phòng', ketQua.tienHoaDonPhong);
    addRow('Tiền hóa đơn thêm', ketQua.tienHoaDonThem);

    sheet.addRow([]).height = 6;

    addRow('Tổng tiền hóa đơn', ketQua.tongTienHoaDon);

    sheet.addRow([]).height = 6;

    addRow('SỐ TIỀN CẦN THU', ketQua.soTienCanThu, totalLabelStyle, totalValueStyle, 28);

    // Timestamp
    sheet.addRow([]).height = 6;
    const tsRow = sheet.addRow([`Xuất ngày: ${new Date().toLocaleString('vi-VN')}`, '']);
    tsRow.height = 18;
    tsRow.getCell(1).font = { name: 'Times New Roman', size: 9, italic: true, color: { argb: 'FF94a3b8' } };

    await workbook.xlsx.writeFile(savePath);
    return { success: true, path: savePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ─── IPC: Chọn đường dẫn lưu file ────────────────────────────────────────────
ipcMain.handle('chon-duong-dan', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Lưu hóa đơn',
    defaultPath: `HoaDon_${new Date().toISOString().slice(0, 10)}.xlsx`,
    filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
  });
  return result.canceled ? null : result.filePath;
});

// ─── IPC: Mở file sau khi lưu ────────────────────────────────────────────────
ipcMain.handle('mo-file', async (event, filePath) => {
  shell.openPath(filePath);
});
