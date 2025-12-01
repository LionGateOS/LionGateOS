const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Future secure APIs go here
});
