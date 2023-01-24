var h5;
(function (h5) {
    var application;
    (function (application) {
        var ConfigService = /** @class */ (function () {
            function ConfigService($http, $q) {
                this.$http = $http;
                this.$q = $q;
            }
            ConfigService.prototype.getGlobalConfig = function () {
                var _this = this;
                var deferred = this.$q.defer();
                if (this.globalConfig == undefined) {
                    this.$http.get('application.js').then(function (val) {
                        var data = _this.decodeConfigData(val.data);
                        _this.globalConfig = JSON.parse(data);
                        if (!angular.isArray(_this.globalConfig.excludeWallpapers)) {
                            _this.globalConfig.excludeWallpapers = [-1];
                        }
                        if (!angular.isArray(_this.globalConfig.excludeThemes)) {
                            _this.globalConfig.excludeThemes = [-1];
                        }
                        if (!angular.isArray(_this.globalConfig.excludeLanguages)) {
                            _this.globalConfig.excludeLanguages = ['-1'];
                        }
                        if (!angular.isArray(_this.globalConfig.excludeModules)) {
                            _this.globalConfig.excludeModules = [-1];
                        }
                        deferred.resolve(_this.globalConfig);
                    }, function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                }
                else {
                    deferred.resolve(this.globalConfig);
                }
                return deferred.promise;
            };
            ConfigService.prototype.decodeConfigData = function (data) {
                return decodeURIComponent(atob(data).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            };
            ConfigService.$inject = ["$http", "$q"];
            return ConfigService;
        }());
        application.ConfigService = ConfigService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
