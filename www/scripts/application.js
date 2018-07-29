define(["require", "exports"], function (require, exports) {
    // For an introduction to the Blank template, see the following documentation:
    // http://go.microsoft.com/fwlink/?LinkID=397705
    // To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
    // and then run "window.location.reload()" in the JavaScript Console.
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function initialize() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    exports.initialize = initialize;
    function onDeviceReady() {
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
        window.addEventListener("message", function (e) {
            var msg = e.data.data; // comando recibido
            console.log("Mensaje recibido desde el iframe", msg);
            switch (msg) {
                case 'kiosko':
                    KioskPlugin.isInKiosk(function (isInKiosk) {
                        document.getElementById("debug").innerText = 'kiosko: ' + isInKiosk;
                        setTimeout(limpiarDebug, 2000);
                    });
                    break;
                case 'launcher':
                    KioskPlugin.isSetAsLauncher(function (isLauncher) {
                        document.getElementById("debug").innerText = 'launcher ' + isLauncher;
                        setTimeout(limpiarDebug, 2000);
                    });
                    break;
                case 'quit':
                    KioskPlugin.exitKiosk();
                    break;
            }
        }, false);
    }
    function limpiarDebug() {
        document.getElementById("debug").innerText = '';
    }
});
/*
function onPause(): void {
    // TODO: This application has been suspended. Save application state here.
}

function onResume(): void {
    // TODO: This application has been reactivated. Restore application state here.
}
*/ 
//# sourceMappingURL=application.js.map