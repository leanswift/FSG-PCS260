/**
 * Utility service to execute M3 MI transactions using built in MI service
 */
var h5;
(function (h5) {
    var application;
    (function (application) {
        var OdinMIService = /** @class */ (function () {
            function OdinMIService(miService) {
                this.miService = miService;
            }
            OdinMIService.prototype.callWebService = function (program, transaction, requestData, maxReturnedRecords, company, division, csrfToken) {
                if (maxReturnedRecords === void 0) { maxReturnedRecords = 100; }
                var request = {
                    program: program,
                    transaction: transaction,
                    record: requestData,
                    maxReturnedRecords: maxReturnedRecords,
                    company: company,
                    division: division,
                    csrfToken: csrfToken
                };
                return this.miService.executeRequest(request).then(function (val) { return val; });
            };
            OdinMIService.$inject = ["m3MIService"];
            return OdinMIService;
        }());
        application.OdinMIService = OdinMIService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
