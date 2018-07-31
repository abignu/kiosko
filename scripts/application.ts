﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397705
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
"use strict";

declare var KioskPlugin: any;

export function initialize(): void {
    document.addEventListener('deviceready', onDeviceReady, false);
}

function onDeviceReady(): void {

    //document.addEventListener('pause', onPause, false);
    //document.addEventListener('resume', onResume, false);

    //document.getElementById("debug").innerHTML = "pasé por onDeviceReady";

    // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    /*
    * var parentElement = document.getElementById('deviceready');
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    */

    console.log("device ready!");
    InitMessageEventListener();
}

var cargadoReceptorMessages = false;
setTimeout(InitMessageEventListener, 10000);

// se llama postdatada al cargar el JS y también onDeviceReady (el onDeviceReady no se carga al hacer return de los juegos)
function InitMessageEventListener() {

    if (cargadoReceptorMessages)        // si ya lo cargué
        return;                             // me voy

    cargadoReceptorMessages = true;     // cierro puerta de próxima llamada

    // poner a escuchar eventos "message"
    window.addEventListener("message", (e: MessageEvent) => {

        var msg: any = e.data.data;        // comando recibido
        console.log("Mensaje recibido desde el iframe", msg);

        switch (msg) {
            case 'kiosko':
                KioskPlugin.isInKiosk(function (isInKiosk) {

                    document.getElementById("debug").innerText = 'kiosko: ' + isInKiosk.toString();
                    setTimeout(limpiarDebug, 2000);
                });
                break;

            case 'launcher':
                KioskPlugin.isSetAsLauncher(function (isLauncher) {

                    document.getElementById("debug").innerText = 'launcher ' + isLauncher.toString();
                    setTimeout(limpiarDebug, 2000);
                });
                break;

            case 'quit':

                var clave = window.prompt("Por favor, ingresa tu clave: ");

                alert(clave);
                alert(clave == 'Kbk123');

                //if (clave == "Kbk123")
                    KioskPlugin.exitKiosk();
                break;
        }
    }, false);
}

function limpiarDebug() {
    document.getElementById("debug").innerText = '';
}

/*
function onPause(): void {
    // TODO: This application has been suspended. Save application state here.
}

function onResume(): void {
    // TODO: This application has been reactivated. Restore application state here.
}
*/