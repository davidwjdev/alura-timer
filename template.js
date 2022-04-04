const data = require("./data");
const { ipcMain } = require("electron");

module.exports = {
  templateInicial: null,
  geraTrayTemplate(win) {
    let template = [{ label: "Cursos" }, { type: "separator" }];
    let cursos = data.pegaNomeDosCursos();

    cursos.forEach((curso) => {
      let menuItem = {
        label: curso,
        type: "radio",
        click: () => {
          win.send("curso-trocado", curso);
        },
      };
      template.push(menuItem);
    });
    this.templateInicial = template;
    return template;
  },
  adicionaCursoNoTray(curso, win) {
    this.templateInicial.push({
      label: curso,
      type: "radio",
      checked: true,
      click: () => {
        win.send("curso-trocado", curso);
      },
    });
    return this.templateInicial;
  },
  geraMenuPrincipalTemplate(app) {
    let templateMenu = [
      {
        label: "View",
        submenu: [
          {
            role: "reload",
          },
          {
            role: "toggledevtools",
          },
        ],
      },
      {
        label: "Window",
        submenu: [
            { role: "minimize", accelerator: "CmdOrCtrl+m" },
            { role: "close", accelerator: "CmdOrCtrl+q" }],
      },
      {
        label: "Sobre",
        submenu: [
          {
            label: "Sobre o timer",
            click: () => {
              ipcMain.emit("abrir-janela-sobre");
            },
            accelerator: "CommandOrControl+i",
          },
        ],
      },
    ];
    if (process.platform == "darwin") {
      template.unshift({
        label: app.getName(),
        submenu: [
          {
            label: "Estou rodando mac",
          },
        ],
      });
    }
    return templateMenu;
  },
};
