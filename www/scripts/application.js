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
    var exitKiosk = document.getElementById("exitKiosk");
    exitKiosk.onclick = function () {
        KioskPlugin.exitKiosk();
    };
    var detectarKiosk = document.getElementById("detectarKiosk");
    detectarKiosk.onclick = function () {
        KioskPlugin.isInKiosk(function (isInKiosk) {
            document.getElementById("debug").innerText = isInKiosk;
        });
    };
    var detectarLauncher = document.getElementById("detectarLauncher");
    detectarLauncher.onclick = function () {
        KioskPlugin.isSetAsLauncher(function (isLauncher) {
            document.getElementById("debug").innerText = isLauncher;
        });
    };
    function onDeviceReady() {
        document.addEventListener('pause', onPause, false);
        document.addEventListener('resume', onResume, false);
        //document.getElementById("debug").innerHTML = "pasé por onDeviceReady";
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        /*
        * var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
    }
    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }
    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
});
//# sourceMappingURL=application.js.map