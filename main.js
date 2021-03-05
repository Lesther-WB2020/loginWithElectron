const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron'); 

let loginW;
function loginWindow(){
    loginW = new BrowserWindow({
        width: 865,
        height: 500,
        webPreferences: ({
            nodeIntegration: true
        })
    })
    loginW.loadFile('./loging/login.html')
} 

let dashboardW;
function dashBoardWindow(){
    dashboardW = new BrowserWindow({
        width: 865,
        height: 500,
        webPreferences: ({
            nodeIntegration: true
        })
    })
    dashboardW.loadFile('./loging/dashBoard/dashBoard.html')
}
 
app.whenReady().then(loginWindow)

// on es para esperar un mensaje a traves de un canal 
// y eventualmente realizar una accion
ipcMain.on('errorEnFormulario',(event,args)=>{
    //console.log(event);
    //console.log(args);
    var lineas = parseInt(args);
    var theNewHeight = 500 + (lineas*2);
    loginW.setSize(865,theNewHeight);
})
    
ipcMain.on('formularioValido',(event,args)=>{
    loginW.setSize(865,500);
    console.log(args);
    //event.reply('send-data-to-dashboard',args); 
    //creamos la ventana
    dashBoardWindow();
    //on, en este caso, actúa como "whenReady().then".
    dashboardW.webContents.on('did-finish-load',()=>{
        dashboardW.webContents.send('send-data-to-dashboard',args)
    })
})
