const{ipcRenderer} = require('electron');

ipcRenderer.on('send-data-to-dashboard',(event,args)=>{
    var welcomeContent = document.getElementById('welcomeUser');
    welcomeContent.innerHTML = 'BIENVENID@ <br> ' + args[0] + '<br>' + args[1];
})