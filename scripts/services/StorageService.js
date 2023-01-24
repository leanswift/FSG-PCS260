var h5;
(function (h5) {
    var application;
    (function (application) {
        var StorageService = /** @class */ (function () {
            function StorageService(odinStorageService) {
                this.odinStorageService = odinStorageService;
            }
            StorageService.prototype.getAppData = function (key) {
                return this.odinStorageService.getApplication(key, undefined);
            };
            StorageService.prototype.setAppData = function (key, value) {
                return this.odinStorageService.setApplication(key, value);
            };
            StorageService.prototype.removeAppData = function (key) {
                this.odinStorageService.deleteKeyApplicationStorage(key);
            };
            StorageService.prototype.getSessionData = function (key) {
                return this.odinStorageService.getSession(key, undefined);
            };
            StorageService.prototype.setSessionData = function (key, value) {
                return this.odinStorageService.setSession(key, value);
            };
            StorageService.prototype.removeSessionData = function (key) {
                this.odinStorageService.deleteKeySessionStorage(key);
            };
            StorageService.prototype.getLocalData = function (key) {
                return this.odinStorageService.getLocal(key, undefined);
            };
            StorageService.prototype.setLocalData = function (key, value) {
                return this.odinStorageService.setLocal(key, value);
            };
            StorageService.prototype.removeLocalData = function (key) {
                this.odinStorageService.deleteKeyLocalStorage(key);
            };
            StorageService.$inject = ["odinStorageService"];
            return StorageService;
        }());
        application.StorageService = StorageService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
