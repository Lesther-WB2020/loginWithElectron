const {ipcRenderer} = require('electron');

document.getElementById('userDate').addEventListener('change',event=>{

    userDate.classList.remove('invalid');
    var errorDate = document.getElementById('errorDate');
    errorDate.innerHTML = '';

    //event.target.value es el string value del datepicker, pero como queremos @separar los valores pues lo pasamos a new date
    let fechaSeleccionada = new Date(event.target.value);
    let diaSeleccionado = fechaSeleccionada.getDate();
    if(diaSeleccionado!=31){
        diaSeleccionado = diaSeleccionado+1;
    }
    let mesSeleccionado = fechaSeleccionada.getMonth()+1;
    let anioSeleccioando = fechaSeleccionada.getFullYear();

    let fs = anioSeleccioando + '-' + mesSeleccionado + '-' + diaSeleccionado;
    console.log(fs);

    let fechaActual = new Date();
    let diaActual = fechaActual.getDate();
    let mesActual = fechaActual.getMonth()+1;
    let anioActual = fechaActual.getFullYear();
    let fa = anioActual + '-' + mesActual + '-' + diaActual;
    console.log(fa); 

        if(anioSeleccioando>anioActual){
            errorDate.innerHTML = 'EL AÑO SELECCIONADO NO ES VÁLIDO';
            userDate.classList.add('invalid');
        }else if((anioSeleccioando==anioActual)&&(mesSeleccionado>mesActual)){
                errorDate.innerHTML = 'EL MES SELECCIONADO NO ES VÁLIDO';
                userDate.classList.add('invalid');
        }else if((anioSeleccioando==anioActual)&&(mesSeleccionado==mesActual)&&(diaSeleccionado>diaActual)){
                    errorDate.innerHTML = 'EL DÍA SELECCIONADO NO ES VÁLIDO';
                    userDate.classList.add('invalid');
        }
});

document.getElementById('myForm').addEventListener('submit',event=>{
    event.preventDefault()
        //obtenemos los datos del formulario
        var userName = document.getElementById('userName');
        var userMail = document.getElementById('userMail');
        var userPass = document.getElementById('userPass');

        //obtenemos los divs, para eventualmente poder poner contenido o mensajes de error en caso de que lo haya.
        var errorName = document.getElementById('errorName');
        var errorEmail = document.getElementById('errorEmail');
        var errorPass = document.getElementById('errorPass');

        //limpiar contenido de validaciones previas para poner las nuevas.
        errorName.innerHTML = '';
        errorEmail.innerHTML = '';
        errorPass.innerHTML = '';

        //varialbes 'banderas' para disparar mensajes dependiendo del caso.
        var cantidadDeErrores = 0;
        var erroNameBand = 0;
        var erroMailBand = 0;
        var erroPassBand = 0;

        //limpiamos classlist invalid de los inputs para que permita enviar los formularios
        //en caso de que se cumplan con todas las validaciones que quizas de forma previa no se hayan cumplido
        userName.classList.remove('invalid');
        userMail.classList.remove('invalid');
        userPass.classList.remove('invalid');

        //validar usuario
        if(userName.value==''){
                errorName.innerHTML = 'DEBES LLENAR ESTE CAMPO'
                erroNameBand++;
                userName.classList.add('invalid');
        }else{
                ipcRenderer.send('validarUsuario',userName.value);
        }

        //*****validando e-mail
        if(validarEmail(userMail.value)!=true){
            errorEmail.innerHTML = 'EL CORREO ELECTRÓNICO NO ES VÁLIDO';
            erroMailBand++;
            userMail.classList.add('invalid');
        }

        //*****validando contraseña
            //longitud
            if(userPass.value.length < 8 ){
                if(erroPassBand==0){
                    errorPass.innerHTML += 'TIENE QUE TENER AL MENOS 8 CARACTERES';
                    erroPassBand++;
                }else{
                    errorPass.innerHTML += '; AL MENOS 8 CARACTERES';
                }
                userPass.classList.add('invalid');
            }
            //caracteres que debe tener
            var exprMin = RegExp('[a-z]');
            var exprMax = RegExp('[A-Z]');
            var exprNum = RegExp('[0-9]');
            var exprSim = RegExp('[\-\\\_]');
            //si no ecuentra una may[uscula, minuscula, numeros y simbolos indicarlo a traves del div error.
            if(!userPass.value.match(exprMin)){
                if(erroPassBand==0){
                    errorPass.innerHTML += 'TIENE QUE TENER MINÚSCULAS';
                    erroPassBand++;
                }else{
                    errorPass.innerHTML += '; MINÚSCULAS';
                }
                userPass.classList.add('invalid');
            }
            if(!userPass.value.match(exprMax)){
                if(erroPassBand==0){
                    errorPass.innerHTML += 'TIENE QUE TENER MAYÚSCULAS';
                    erroPassBand++;
                }else{
                    errorPass.innerHTML += '; MAYÚSCULAS';
                }
                userPass.classList.add('invalid');
            }
            if(!userPass.value.match(exprNum)){
                if(erroPassBand==0){
                    errorPass.innerHTML += 'TIENE QUE TENER NÚMEROS';
                    erroPassBand++;
                }else{
                    errorPass.innerHTML += '; NÚMEROS';
                }
                userPass.classList.add('invalid');
            }
            if(!userPass.value.match(exprSim)){
                if(erroPassBand==0){
                    errorPass.innerHTML += 'TIENE QUE TENER SÍMBOLOS COMO: _ / ';
                    erroPassBand++;
                }else{
                    errorPass.innerHTML += '; SÍMBOLOS COMO: _ /';
                }
                userPass.classList.add('invalid');
            }

        // SE AJUSTA LA VENTANA CON BASE AL N[UMERO DE ERRORES ENCONTRADO.
        cantidadDeErrores = erroNameBand + erroMailBand + erroPassBand;

        //SI LOS INPUTS NO TIENEN CLASES INVALID, PODEMOS ENVIAR EL FORMULARIO
        setTimeout(()=>{
            if((!userPass.classList.contains('invalid'))&&(!userMail.classList.contains('invalid'))&&(!userName.classList.contains('invalid')&&(!userDate.classList.contains('invalid')))){
                ipcRenderer.send('formularioValido',[userName.value,userMail.value]);
                //var window = remote.getCurrentWindow();
                //window.close();
            }else{
                ipcRenderer.send('errorEnFormulario',cantidadDeErrores);
            }
        },0001)     
});

function validarEmail(emailUser) {
    var expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        return expReg.test(emailUser);
}

ipcRenderer.on('usuario-existe',(event,args)=>{
        document.getElementById('errorName').innerHTML = args;
        document.getElementById('userName').classList.add('invalid');
})