const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  tinhTien: (data) => ipcRenderer.invoke('tinh-tien', data),
  xuatExcel: (data) => ipcRenderer.invoke('xuat-excel', data),
  chonDuongDan: () => ipcRenderer.invoke('chon-duong-dan'),
  moFile: (filePath) => ipcRenderer.invoke('mo-file', filePath),
});
