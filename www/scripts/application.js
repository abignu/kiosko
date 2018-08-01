define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServerURL = "http://bk.bignu.es/games/quick/";
    var xmlhttp = new XMLHttpRequest();
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
        SendToServer({ date: Date(), device: device });
        window.addEventListener("message", function (e) {
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
                        alert("ATENCIÓN: se va a salir del modo Kiosko!");
                        KioskPlugin.exitKiosk();
                    }
                    break;
                default:
                    SendToServer({ game: msg });
                    break;
            }
        }, false);
    }
    function limpiarDebug() {
        document.getElementById("debug").innerText = '';
    }
    function MsgDebug(msg) {
        document.getElementById("debug").innerText = msg;
        setTimeout(limpiarDebug, 2000);
    }
    function SendToServer(data) {
        xmlhttp.open("POST", ServerURL + "api.php");
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(data));
    }
});
//# sourceMappingURL=application.js.map