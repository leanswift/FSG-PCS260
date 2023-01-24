/**
 * Utility service to load the localization file 'translation.json' for the selected language in the application
 */
var h5;
(function (h5) {
    var application;
    (function (application) {
        var LanguageService = /** @class */ (function () {
            function LanguageService(odinLanguageService) {
                this.odinLanguageService = odinLanguageService;
            }
            LanguageService.prototype.getAppLanguage = function () {
                var _this = this;
                var languagePromise = this.odinLanguageService.get();
                languagePromise.then(function (val) {
                    _this.languageConstants = val;
                }, function (errorResponse) {
                    console.log("Error getting language constants " + errorResponse);
                });
                return languagePromise;
            };
            LanguageService.prototype.changeAppLanguage = function (languageCode) {
                var _this = this;
                var languageOptions = {
                    application: true,
                    applicationFilename: "translation.json",
                    language: languageCode,
                    standard: false
                };
                var languagePromise = this.odinLanguageService.load(languageOptions);
                languagePromise.then(function (val) {
                    _this.languageConstants = val;
                }, function (errorResponse) {
                    console.log("Error getting language " + errorResponse);
                });
                return languagePromise;
            };
            LanguageService.$inject = ["odinLanguageService"];
            return LanguageService;
        }());
        application.LanguageService = LanguageService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
