const electron = require('electron')
const {app, BrowserWindow} = require('electron') 

  ////////////////////////////////////////////
  const fs = require('fs');
  const os = require('os');
  const ipc = electron.ipcMain;
  const shell = electron.shell;

  ////////////////////////////////////////////
 
  // Mantén una referencia global del objeto window, si no lo haces, la ventana 
  // se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
  let win
  
  function createWindow () {
    // Crea la ventana del navegador.
    win = new BrowserWindow({width: 800, height: 600, minWidth: 800, minHeight: 600})
    win.maximize()
  
    // y carga el archivo index.html de la aplicación.
    win.loadFile('html/index.html')
  
    // Emitido cuando la ventana es cerrada.
    win.on('closed', () => {
      // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
      // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
      // en el que deberías borrar el elemento correspondiente.
      win = null
    })
  }
  
  // Este método será llamado cuando Electron haya terminado
  // la inicialización y esté listo para crear ventanas del navegador.
  // Algunas APIs pueden usarse sólo después de que este evento ocurra.
  app.on('ready', createWindow)
  
  // Sal cuando todas las ventanas hayan sido cerradas.
  app.on('window-all-closed', () => {
    // En macOS es común para las aplicaciones y sus barras de menú
    // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.
    if (win === null) {
      createWindow()
    }
  })
  
  // En este archivo puedes incluir el resto del código del proceso principal de
  // tu aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.
  ipc.on('print-to-pdf', function(event) {  
    var basepath = app.getAppPath();
    const pdfPath = basepath + '/Print.pdf';
    const win = BrowserWindow.fromWebContents(event.sender);
    win.webContents.printToPDF({}, function(error, data) {
      if(error) return console.log(error.message)

      fs.writeFile(pdfPath, data, function(err)
      {
        if(err) return console.log(err.message);
        shell.openExternal('file://', + pdfPath);
        event.sender.send('wrote-pdf', pdfPath);
      })
    })
  });