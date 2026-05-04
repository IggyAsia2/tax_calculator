const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  tinhTien: (data) => ipcRenderer.invoke('tinh-tien', data),
});
