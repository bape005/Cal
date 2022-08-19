const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
});

contextBridge.exposeInMainWorld('documentMode', {
    getDocuments: () => ipcRenderer.invoke('document:getDocuments'),
    openExplorer: () => ipcRenderer.invoke('document:openExplorer')
    //readDocuments: (data) => ipcRenderer.invoke('document:readDocuments')
});

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
});