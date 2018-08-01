"use strict";

declare var KioskPlugin: any;       // plugin que convierte en kiosko la pantalla
declare var device: any;            // plugin que devuelve datos del hardware (SN, UUID, etc.)
declare var StatusBar: any;         // plugin para customizar la status bar (lo usamos para intentar ocultarla)

var ServerURL = "http://bk.bignu.es/games/quick/";
var xmlhttp = new XMLHttpRequest();

export function initialize(): void {
    document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady(): void {

    //document.addEventListener('pause', onPause, false);
    //document.addEventListener('resume', onResume, false);

    // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

    console.log("device ready!");

    // inicializar la escucha de mensajes de la App
    InitMessageEventListener();
}

var cargadoReceptorMessages = false;
setTimeout(InitMessageEventListener, 10000);

// se llama postdatada al cargar el JS y también onDeviceReady (el onDeviceReady no se carga al hacer return de los juegos)
function InitMessageEventListener() {

    if (cargadoReceptorMessages)        // si ya lo cargué
        return;                             // me voy

    cargadoReceptorMessages = true;     // cierro puerta de próxima llamada

    StatusBar.hide();                   // intentar ocultar la barra de status

    // enviar datos del dispositivo al server
    SendToServer({ date: Date(), device: device });   // device lo define un plug-in: cordova-plugin-device

    // poner a escuchar eventos "message"
    window.addEventListener("message", (e: MessageEvent) => {

        var msg: any = e.data.data;        // comando recibido
        //console.log("Mensaje recibido desde el iframe", msg);

        switch (msg) {
            case 'kiosko':
                KioskPlugin.isInKiosk(function (isInKiosk) {
                    MsgDebug('kiosko: ' + isInKiosk.toString());
                });
                break;

            case 'launcher':
                KioskPlugin.isSetAsLauncher(function (isLauncher) {
                    MsgDebug('launcher ' + isLauncher.toString());
                });
                break;

            case 'quit':

                var clave = window.prompt("Por favor, ingresa tu clave: ");

                //alert(clave);
                //alert(clave == 'kbk123');

                if (clave == "kbk123") {

                    alert("ATENCIÓN: se va a salir del modo Kiosko!")
                    KioskPlugin.exitKiosk();
                }
                break;

            default:
                SendToServer({ game: msg });    // avisar al server que pidieron este juego
                break;
        }
    }, false);
}

// limpiar los mensajes de la pantalla
function limpiarDebug() {
    document.getElementById("debug").innerText = '';
}

// sacar mensajes en pantalla por 2 segundos para conocer status del Kiosko
function MsgDebug(msg: string) {

    document.getElementById("debug").innerText = msg;
    setTimeout(limpiarDebug, 2000);
}

// enviar JSON por ajax al server
function SendToServer(data: any) {

    xmlhttp.open("POST", ServerURL + "api.php");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}

/*
function onPause(): void {
    // TODO: This application has been suspended. Save application state here.
}

function onResume(): void {
    // TODO: This application has been reactivated. Restore application state here.
}
*/