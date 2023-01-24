/**
 * Service class to implement functions to authenticate, execute REST API exposed by external applications such as M3, ION API Suite
 */
module h5.application {

    interface IOauthToken {
        access_token: string;
        token_type: string;
        refresh_token: string;
        expires_in: number;
        scope: string;
    }

    export interface IRestService {
        executeIDMRestService(transaction: string, requestData: any, requestMethod?: string, contentType?: string): ng.IPromise<any>;
        executeM3MIRestService(program: string, transaction: string, requestData: any, maxReturnedRecords?: number, company?: string, division?: string): ng.IPromise<M3.IMIResponse>;
        executeM3MIRestServiceViaIONAPI(program: string, transaction: string, requestData: any, maxReturnedRecords?: number, company?: string, division?: string): ng.IPromise<M3.IMIResponse>;
    }

    export class RestService implements IRestService {

        private authInfoION: IOauthToken;
        private globalConfig: IGlobalConfiguration;
        private csrfToken: string;

        static $inject = ["$http", "$q", "configService", "OdinMIService"];
        constructor(private $http: ng.IHttpService, private $q: ng.IQService, private configService: h5.application.ConfigService, private odinMIService: h5.application.OdinMIService) {
            this.init();
        }

        private init() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.globalConfig = configData;
                if (angular.isDefined(this.globalConfig.inforIONAPI) && (angular.isDefined(this.globalConfig.inforIONAPI.URL) || this.globalConfig.inforIONAPI.useSessionOAuth)) {
                    this.setOAuthInfoIONAPI();
                }
                if (angular.isDefined(this.globalConfig.inforM3API) && this.globalConfig.inforM3API.enableCSRFToken) {
                    this.setCSRFToken();
                }
            }, (errorResponse: any) => {
                console.log("Error while getting global configurations " + errorResponse);
            });
        }

        private setCSRFToken(): ng.IPromise<any> {
            let deferred = this.$q.defer();
            let csrfURL = "/m3api-rest/csrf";
            this.$http.get(csrfURL).then((response: ng.IHttpPromiseCallbackArg<any>) => {
                this.csrfToken = response.data;
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        private setOAuthInfoIONAPI(): ng.IPromise<any> {
            let deferred = this.$q.defer();
            if (this.globalConfig.inforIONAPI.useSessionOAuth && angular.isDefined(this.globalConfig.inforIONAPI.sessionOAuthURL)) {
                this.$http.get(this.globalConfig.inforIONAPI.sessionOAuthURL).then((response: ng.IHttpPromiseCallbackArg<any>) => {
                    this.authInfoION = { access_token: response.data, token_type: "Bearer", refresh_token: null, expires_in: null, scope: null };
                    deferred.resolve(response);
                });
            } else if (angular.isDefined(this.globalConfig.inforIONAPI) && angular.isDefined(this.globalConfig.inforIONAPI.URL)) {
                let tokenURL = this.globalConfig.inforIONAPI.URL + "/" + this.globalConfig.inforIONAPI.access_token_url;
                let formData = "grant_type=" + this.globalConfig.inforIONAPI.grant_type + "&username=" + this.globalConfig.inforIONAPI.username + "&password=" + this.globalConfig.inforIONAPI.password + "&client_id=" + this.globalConfig.inforIONAPI.client_id + "&client_secret=" + this.globalConfig.inforIONAPI.client_secret;
                this.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                let response = this.$http.post(tokenURL, formData);
                response.then((response: ng.IHttpPromiseCallbackArg<IOauthToken>) => {
                    this.authInfoION = response.data;
                    deferred.resolve(response);
                });
            } else {
                deferred.reject("Required ION REST API configurations are not available. Please contact support.");
            }
            return deferred.promise;
        }

        public executeIDMRestService(transaction: string, requestData: any, requestMethod: string, contentType: string): ng.IPromise<any> {
            if (angular.isUndefined(this.globalConfig.inforIDMAPI) || angular.isUndefined(this.globalConfig.inforIDMAPI.URL)) {
                let deferred = this.$q.defer();
                let reason: ng.IHttpPromiseCallbackArg<any> = {};
                reason.status = 500;
                reason.statusText = "Required IDM REST API configurations are not available. Please contact support.";
                deferred.reject(reason);
                return deferred.promise
            } else {
                return this.executeIONRestService(this.globalConfig.inforIDMAPI.URL, transaction, requestData, requestMethod, contentType);
            }
        }

        public executeIONRestService(baseURL: string, transaction: string, requestData: any, requestMethod: string = "POST", contentType: string = "application/json"): ng.IPromise<any> {
            let retries = 0;
            let maxRetry = 1;
            let deferred = this.$q.defer();
            if (angular.isUndefined(baseURL) || baseURL.length == 0) {
                let reason: ng.IHttpPromiseCallbackArg<any> = {};
                reason.status = 500;
                reason.statusText = "Required ION REST API configurations are not available. Please contact support.";
                deferred.reject(reason);
            } else {
                let URL = baseURL + transaction;
                let authInfo: IOauthToken = this.authInfoION;
                Odin.Log.debug("Execute ION REST API " + transaction + " Is authInfo present " + Odin.Util.hasValue(authInfo) + ": " + JSON.stringify(authInfo));
                let config = null;
                if (Odin.Util.hasValue(authInfo)) {
                    config = {
                        headers: { 'Authorization': authInfo.token_type + ' ' + authInfo.access_token }
                    }
                }
                let response = null;
                if (angular.equals("GET", requestMethod)) {
                    response = this.$http.get(URL, config);
                } else if (angular.equals("POST", requestMethod)) {
                    this.$http.defaults.headers.post['Content-Type'] = contentType;
                    response = this.$http.post(URL, requestData, config);
                } else if (angular.equals("PUT", requestMethod)) {
                    this.$http.defaults.headers.put['Content-Type'] = contentType;
                    response = this.$http.put(URL, requestData, config);
                } else if (angular.equals("DELETE", requestMethod)) {
                    response = this.$http.delete(URL, config);
                }
                response.then((response: ng.IHttpPromiseCallbackArg<any>) => {
                    deferred.resolve(response.data);
                }, (reason: ng.IHttpPromiseCallbackArg<any>) => {
                    reason.data = requestData;
                    Odin.Log.debug("Execute ION REST API '" + transaction + "' failed " + reason.status + ":" + reason.statusText);
                    if (reason.status == 401) {
                        while (retries < maxRetry) {
                            Odin.Log.debug("Retrying " + retries + ", as previous call to ION REST API '" + transaction + " failed due to token expired");
                            this.setOAuthInfoIONAPI().then((response: ng.IHttpPromiseCallbackArg<IOauthToken>) => {
                                authInfo = this.authInfoION;
                                config = {
                                    headers: { 'Authorization': authInfo.token_type + ' ' + authInfo.access_token }
                                }
                                let response1 = null;
                                if (angular.equals("GET", requestMethod)) {
                                    response1 = this.$http.get(URL, config);
                                } else if (angular.equals("POST", requestMethod)) {
                                    this.$http.defaults.headers.post['Content-Type'] = contentType;
                                    response1 = this.$http.post(URL, requestData, config);
                                } else if (angular.equals("PUT", requestMethod)) {
                                    this.$http.defaults.headers.put['Content-Type'] = contentType;
                                    response1 = this.$http.put(URL, requestData, config);
                                } else if (angular.equals("DELETE", requestMethod)) {
                                    response1 = this.$http.delete(URL, config);
                                }
                                response1.then(
                                    (response: ng.IHttpPromiseCallbackArg<any>) => { deferred.resolve(response.data) },
                                    (reason: ng.IHttpPromiseCallbackArg<any>) => { deferred.reject(reason); });
                            });
                            retries++;
                        }
                    } else {
                        if (reason.status == 0) {
                            reason.statusText = "An unexpected error occurred. Please check your network connection and try again in a moment. Contact support if the problem persists.";
                        }
                        deferred.reject(reason);
                    }
                });
            }
            return deferred.promise;
        }

        public executeM3MIRestService(program: string, transaction: string, requestData: any, maxReturnedRecords?: number, company?: string, division?: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            if(this.csrfToken === undefined){
               this.csrfToken = "AcHTa9ySswZ8Isf5FzshLNb8wVHEbEPTeaUg5Fq43/3LhaiN/ZOYa4f/qninsit3fixtdYDw7fbaOrrV2/jDCmZXH+s9a52uP7wbw6o=";
            }
            if (this.globalConfig.inforM3API.useIONAPIInsteadOfOdinMI) {
                return this.executeM3MIRestServiceViaIONAPI(program, transaction, requestData, maxReturnedRecords, company, division).then((val: M3.IMIResponse) => {
                    val.requestData = requestData;
                    deferred.resolve(val);
                    return deferred.promise;
                }, (val: M3.IMIResponse) => {
                    val.requestData = requestData;
                    deferred.reject(val);
                    return deferred.promise;
                });
            } else {
                return this.odinMIService.callWebService(program, transaction, requestData, maxReturnedRecords, company, division, this.csrfToken).then((val: M3.IMIResponse) => {
                    val.requestData = requestData;
                    deferred.resolve(val);
                    return deferred.promise;
                }, (val: M3.IMIResponse) => {
                    val.requestData = requestData;
                    if (angular.equals(400, val.errorCode) || angular.equals(403, val.errorCode)) {
                        this.setCSRFToken().then((response: ng.IHttpPromiseCallbackArg<IOauthToken>) => {
                            return this.odinMIService.callWebService(program, transaction, requestData, maxReturnedRecords, company, division, this.csrfToken).then((val: M3.IMIResponse) => {
                                val.requestData = requestData;
                                deferred.resolve(val);
                                return deferred.promise;
                            }, (val: M3.IMIResponse) => {
                                val.requestData = requestData;
                                deferred.reject(val);
                                return deferred.promise;
                            });
                        });
                    } else {
                        deferred.reject(val);
                    }
                    return deferred.promise;
                });
            }

        }

        public executeM3MIRestServiceViaIONAPI(program: string, transaction: string, requestData: any, maxReturnedRecords = 100, company?: string, division?: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            if (angular.isUndefined(this.globalConfig.inforM3API) || angular.isUndefined(this.globalConfig.inforM3API.URL)) {
                let reason: ng.IHttpPromiseCallbackArg<any> = {};
                reason.status = 500;
                reason.statusText = "Required M3 REST API configurations are not available. Please contact support.";
                deferred.reject(reason);
                return deferred.promise
            }
            let request = {
                program: program,
                transaction: transaction,
                record: requestData,
                maxReturnedRecords: maxReturnedRecords,
                includeMetadata: true,
                company: company,
                division: division
            };
            let baseUrl = M3.MIAccess.createUrl(this.globalConfig.inforM3API.URL, request);
            return this.executeIONRestService(baseUrl, null, requestData, "GET").then((val: any) => {
                let response = M3.MIAccess.parseResponse(request, val);
                if (response.hasError()) {
                    response.errorType = M3.M3ErrorTypes.MI;
                    deferred.reject(response);
                }
                else {
                    deferred.resolve(response);
                }
                return deferred.promise;
            }, (val: any) => {
                let response = new M3.MIResponse();
                let status = val.status;
                let message = "Failed to call " + request.program + "." + request.transaction + " " + status;
                response.errorMessage = message;
                response.errorCode = status;
                response.errorType = Odin.ErrorTypes.http;
                deferred.reject(response);
                return deferred.promise;
            });
        }

    }
}