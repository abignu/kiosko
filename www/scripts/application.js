define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServerURL = "http://kubiko.bignu.es/games/bk/";
    var xmlhttp = new XMLHttpRequest();
    var uuid = '';
    function initialize() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    exports.initialize = initialize;
    function onDeviceReady() {
        console.log("device ready!");
        InitMessageEventListener();
    }
    var cargadoReceptorMessages = false;
    setTimeout(InitMessageEventListener, 10000);
    function InitMessageEventListener() {
        if (cargadoReceptorMessages)
            return;
        cargadoReceptorMessages = true;
        StatusBar.hide();
        if (navigator.connection.type == Connection.NONE)
            SetOfflineMode();
        else
            SetOnlineMode();
        uuid = device.uuid;
        SendToServer({ uuid: device.uuid, device: device });
        window.addEventListener('online', SetOnlineMode, false);
        window.addEventListener('offline', SetOfflineMode, false);
        window.addEventListener("message", ReceiveMessage, false);
    }
    function limpiarDebug() {
        GetById("debug").innerText = '';
    }
    function MsgDebug(msg) {
        GetById("debug").innerText = msg;
        setTimeout(limpiarDebug, 2000);
    }
    function SendToServer(data) {
        xmlhttp.open("POST", ServerURL + "api.php");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(data));
    }
    function SetOnlineMode() {
        GetById("offline").style.display = "none";
        GetById("games").style.display = "block";
    }
    function SetOfflineMode() {
        GetById("offline").style.display = "block";
        GetById("games").style.display = "none";
    }
    function GetById(id) {
        return document.getElementById(id);
    }
    function ReceiveMessage(e) {
        var msg = e.data.data;
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
                if (clave == "kbk123") {
                    alert("ATENCIÓN: se va a alterar el modo Kiosko!");
                    KioskPlugin.exitKiosk();
                }
                break;
            default:
                SendToServer({ uuid: uuid, game: msg });
                break;
        }
    }
});
//# sourceMappingURL=application.js.map