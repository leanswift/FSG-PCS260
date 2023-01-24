/**
 * Initialize the app and register the components on which it depends, the components are containers for the various parts of an application,
 *  such as modules, controllers , services, directives etc
 */
module h5.application {

    class App extends M3.ApplicationBase {
        public onStart() {
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
            this.module.service("configService", ConfigService).service("languageService", LanguageService).service("RestService", RestService).service("AppService", AppService).service("StorageService", StorageService).service("GridService", GridService).service("OdinMIService", OdinMIService);
            this.module.filter("m3Date", ["$filter", m3Date]).filter("rollingDate", ["$filter", rollingDate]).filter("m3DateFilter", ["$filter", m3DateFilter]).filter("numberStrFilter", ["$filter", numberStringFilter]);
            this.module.directive("uiSelectWrap", ["$document","uiGridEditConstants", uiSelectWrap]);
            this.module.controller("AppController", AppController);

            //Disabling angular debug on production to boost the performance
            this.module.config(['$compileProvider', function($compileProvider) {
                $compileProvider.debugInfoEnabled(false);
            }]);
            this.module.config(['$locationProvider', function($locationProvider) {
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }]);

            // Set the log level to debug during development
            //Odin.Log.setDebug();
        }
    }
    new App().start();
}