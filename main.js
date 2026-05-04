const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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
  mainWindow.once('ready-to-show', () => mainWindow.show());
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

  if (kieuXuatHoaDon === 'bang_gia') {
    tienHoaDonPhong = tongTienPhong * 0.10;
  } else if (kieuXuatHoaDon === 'cao_hon_10_15') {
    tienHoaDonPhong = tongTienPhong * 0.10;
    tienHoaDonThem = (tongTienMuonXuat - tongTienPhong) * 0.15;
  }

  const tongTienHoaDon = tienHoaDonPhong + tienHoaDonThem;
  const soTienCanThu = tongTienPhong + tongTienHoaDon;

  return { tongTienPhong, tienHoaDonPhong, tienHoaDonThem, tongTienHoaDon, soTienCanThu };
});

