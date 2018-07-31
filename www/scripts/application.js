define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        window.addEventListener("message", function (e) {
            var msg = e.data.data;
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
                    KioskPlugin.exitKiosk();
                    break;
            }
        }, false);
    }
    function limpiarDebug() {
        document.getElementById("debug").innerText = '';
    }
});
//# sourceMappingURL=application.js.map