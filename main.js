const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require("electron");
const data = require("./data.js");
const templateGenerator = require("./template");

let tray = null;
let mainWindow = null;

app.on("ready", () => {
  console.log("Aplicacao Iniciada");
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  tray = new Tray(__dirname + "/app/img/icon-tray.png");
  let template = templateGenerator.geraTrayTemplate(mainWindow);
  let trayMenu = Menu.buildFromTemplate(template);
  tray.setContextMenu(trayMenu);
  mainWindow.send("curso-trocado");

  let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
  let menuPrincipal = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menuPrincipal);

  globalShortcut.register('CmdOrCtrl+Shift+s',()=>{
      mainWindow.send('atalho-iniciar-parar');
  });
//   mainWindow.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});

app.on("window-all-closed", () => {
  app.quit();
});

let sobreWindow = null;
ipcMain.on("abrir-janela-sobre", () => {
  if (sobreWindow == null) {
    sobreWindow = new BrowserWindow({
      width: 300,
      height: 250,
      alwaysOnTop: true,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    sobreWindow.on("closed", () => {
      sobreWindow = null;
    });
  }
  sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`);
});

ipcMain.on("fechar-janela-sobre", () => {
  sobreWindow.close();
});

ipcMain.on("curso-parado", (event, curso, tempoEstudado) => {
  console.log(`O curso ${curso} foi estudado por ${tempoEstudado}`);
  data.salvaDados(curso, tempoEstudado);
});

ipcMain.on("curso-adicionado", (event, novoCurso) => {
  let novoTemplate = templateGenerator.adicionaCursoNoTray(
    novoCurso,
    mainWindow
  );
  let novotrayMenu = Menu.buildFromTemplate(novoTemplate);
  tray.setContextMenu(novotrayMenu);
});
