var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Initialize the app and register the components on which it depends, the components are containers for the various parts of an application,
 *  such as modules, controllers , services, directives etc
 */
var h5;
(function (h5) {
    var application;
    (function (application) {
        var App = /** @class */ (function (_super) {
            __extends(App, _super);
            function App() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            App.prototype.onStart = function () {
                this.name = "H5 Application";
                this.description = "LeanSwift - H5 Application.";
                this.addUrlOverride("M3", "localhost", "http://localhost:8181");
                this.frameworkPath = "lib/odin";
                this.languageOptions = {
                    application: true,
                    applicationFilename: "translation.json",
                    language: "en-US",
                    defaultLanguage: "en-US",
                    standard: false,
                    supportedLanguages: []
                };
                this.module = angular.module("h5.application", ["ngAnimate", "odin", "m3", "ngSanitize", "ngTouch", "ui.select", "infinite.scroll", "ui.bootstrap",
                    "ui.grid", "ui.grid.autoResize", "ui.grid.resizeColumns", "ui.grid.moveColumns", "ui.grid.selection", "ui.grid.cellNav", "ui.grid.exporter", "ui.grid.saveState", "ui.grid.edit", "ui.grid.pinning", "sohoxi", "ui.grid.importer"]);
                this.module.service("configService", application.ConfigService).service("languageService", application.LanguageService).service("RestService", application.RestService).service("AppService", application.AppService).service("StorageService", application.StorageService).service("GridService", application.GridService).service("OdinMIService", application.OdinMIService);
                this.module.filter("m3Date", ["$filter", application.m3Date]).filter("rollingDate", ["$filter", application.rollingDate]).filter("m3DateFilter", ["$filter", application.m3DateFilter]).filter("numberStrFilter", ["$filter", application.numberStringFilter]);
                this.module.directive("uiSelectWrap", ["$document", "uiGridEditConstants", application.uiSelectWrap]);
                this.module.controller("AppController", application.AppController);
                //Disabling angular debug on production to boost the performance
                this.module.config(['$compileProvider', function ($compileProvider) {
                        $compileProvider.debugInfoEnabled(false);
                    }]);
                this.module.config(['$locationProvider', function ($locationProvider) {
                        $locationProvider.html5Mode({
                            enabled: true,
                            requireBase: false
                        });
                    }]);
                // Set the log level to debug during development
                //Odin.Log.setDebug();
            };
            return App;
        }(M3.ApplicationBase));
        new App().start();
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
