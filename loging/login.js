const {ipcRenderer} = require('electron');

document.getElementById('myForm').addEventListener('submit',function(event){
    event.preventDefault()

        //obtenemos los datos del formulario
        var userName = document.getElementById('userName');
        var userMail = document.getElementById('userMail');
        var userPass = document.getElementById('userPass');
        var userDate = document.getElementById('userDate');

        //obtenemos los divs, para eventualmente poder poner contenido o mensajes de error en caso de que lo haya.
        var errorName = document.getElementById('errorName');
        var errorEmail = document.getElementById('errorEmail');
        var errorPass = document.getElementById('errorPass');
        var errorDate = document.getElementById('errorDate');

        //limpiar contenido de validaciones previas para poner las nuevas.
        errorName.innerHTML = '';
        errorEmail.innerHTML = '';
        errorPass.innerHTML = '';
        errorDate.innerHTML = '';

        //varialbes 'banderas' para disparar mensajes dependiendo del caso.
        var cantidadDeErrores = 0;
        var erroNameBand = 0;
        var erroMailBand = 0;
        var erroPassBand = 0;
        var erroDateBand = 0;

        //limpiamos classlist invalid de los inputs para que permita enviar los formularios
        //en caso de que se cumplan con todas las validaciones que quizas de forma previa no se hayan cumplido
        userName.classList.remove('invalid');
        userMail.classList.remove('invalid');
        userPass.classList.remove('invalid');
        userDate.classList.remove('invalid');

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
        cantidadDeErrores = erroNameBand + erroMailBand + erroPassBand + erroDateBand;

        //SI LOS INPUTS NO TIENEN CLASES INVALID, PODEMOS ENVIAR EL FORMULARIO
        if(!userPass.classList.contains('invalid')){
            ipcRenderer.send('formularioValido',[userName.value,userMail.value]);
            //var window = remote.getCurrentWindow();
            //window.close();
        }else{
            ipcRenderer.send('errorEnFormulario',cantidadDeErrores);
        }
})

