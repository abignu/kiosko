"use strict";

declare var KioskPlugin: any;       // plugin que convierte en kiosko la pantalla
declare var device: any;            // plugin que devuelve datos del hardware (SN, UUID, etc.)
declare var StatusBar: any;         // plugin para customizar la status bar (lo usamos para intentar ocultarla)

//ACÁ PONER LA URL A LA QUE SE ENVIARÁN LOS COMANDOS DE API Y DESDE DONDE SE CARGARÁN LOS JUEGOS, SLIDESHOW, ETC.
//EN TEORÍA SÓLO CAMBIA LA URL DE ESTE ARCHIVO PARA ALTERNAR ENTRE QUICK / BK / Y OTROS QUE SURJAN EN EL FUTURO
var ServerURL = "https://bk.kubikoplaygrounds.com/games/bk/";         // BK server Kubiko
//var ServerURL = "http://bk.bignu.es/games/quick/";        // Juegos Quick
//var ServerURL = "http://kubiko.bignu.es/games/bk/";         // Juegos Feria Barcelona / Burger King
//var ServerURL = "http://test-bk-php73.bignu.es/games/quick/";         // Test PHP v7.3

var xmlhttp = new XMLHttpRequest();
var uuid: string = '';
var onlineStatus: string = "off";

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

    if (navigator.connection.type == Connection.NONE)
        SetOfflineMode();
    else
        SetOnlineMode();

    // enviar datos del dispositivo al server
    uuid = device.uuid;
    SendToServer({ uuid: device.uuid, device: device });   // device lo define un plug-in: cordova-plugin-device

    window.addEventListener('online', SetOnlineMode, false);
    window.addEventListener('offline', SetOfflineMode, false);
    window.addEventListener("message", ReceiveMessage, false);    // poner a escuchar eventos "message"
}

// limpiar los mensajes de la pantalla
function limpiarDebug() {
    GetById("debug").innerText = '';
}

// sacar mensajes en pantalla por 2 segundos para conocer status del Kiosko
function MsgDebug(msg: string) {

    GetById("debug").innerText = msg;
    setTimeout(limpiarDebug, 2000);
}

// enviar JSON por ajax al server
function SendToServer(data: any) {

    xmlhttp.open("POST", ServerURL + "api.php");
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}

function SetOnlineMode(): void {

    //console.log("online!");
    onlineStatus = "on";
    GetById("offline").style.display = "none";
    GetById("games").style.display = "block";
}

function SetOfflineMode(): void {

    //console.log("OFFLINE!!!!!");
    onlineStatus = "off";
    GetById("offline").style.display = "block";
    GetById("games").style.display = "none";
}

function GetById(id: string): HTMLElement {
    return document.getElementById(id);
}

function ReceiveMessage(e: MessageEvent) {

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

        case 'quit': Quit(); break;

        default:
            SendToServer({ uuid: uuid, game: msg });    // avisar al server que pidieron este juego
            break;
    }
}


// contar los clicks en la pantalla de offline para disparar la opción de Quit del modo quiosko
// el Quit también es lanzado desde la página (menú de los juegos, al dar 5 clicks en el logo)
// Vale decir que el Quit viene por dos lados:
//    1) si está online: en el menú del juego (server de Kubiko en 1and1) cuenta los click en el logo 
//       y por mensajería llama al Quit de este JS(que está en el index de al App Cordova)
//    2) si está offline: está visible el div#offline, entonces cuento los clicks acá mismo y disparo el Quit

var quitTimeout, vecesQuit = 0;

function tryQuit()      // llamada con un click en div#offline
{
    if (onlineStatus == "on")       // por las dudas protejo (aunque no debería entrar si el div#offline esta apagado)
        return; 

    clearTimeout(quitTimeout);
    {
        vecesQuit++;
        if (vecesQuit == 5) Quit();
    }
    quitTimeout = setTimeout(limpiarQuit, 1500);
}

function limpiarQuit() {

    vecesQuit = 0;
}

function Quit() {
    var clave = window.prompt("Por favor, ingresa tu clave: ");

    if (clave == "kbk123") {

        alert("ATENCIÓN: se va a alterar el modo Kiosko!")
        KioskPlugin.exitKiosk();
    }
}


/*
function onPause(): void {
    // TODO: This application has been suspended. Save application state here.
}

function onResume(): void {
    // TODO: This application has been reactivated. Restore application state here.
}
*/