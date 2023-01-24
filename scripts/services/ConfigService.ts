module h5.application {

    export interface IGlobalConfiguration {
         name: string;
        description: string;
        version: string;
        environment: string;
        inforIONAPI: {
            URL: string;
            grant_type: string;
            username: string;
            password: string;
            client_id: string;
            client_secret: string;
            access_token_url: string;
            useSessionOAuth: boolean;
            sessionOAuthURL: string;
        };
        inforIDMAPI: {
            URL: string;
        };
        inforM3API: {
            URL: string;
            useIONAPIInsteadOfOdinMI: boolean;
            enableCSRFToken: boolean;
        };
        companyId: string;
        apiKey: string;
        defaultLanguage: string;
        defaultThemeId: number;
        defaultTextureId: number;
        faviconURL: string;
        appLogoURL: string;
        showThemeSelection: boolean;
        showWallpaperSelection: boolean;
        showLanguageSelection: boolean;
        excludeThemes: [number];
        excludeWallpapers: [number];
        excludeLanguages: [string];
        excludeModules: [number];
        appConfig: IAppConfiguration;
    }

    export interface IAppConfiguration {
        enableM3Authority?: boolean;
        globalDateFormat?: string;
        searchQuery?: any;
    }

    export class ConfigService {

        static $inject = ["$http", "$q"];

        private globalConfig: IGlobalConfiguration;

        constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

        }

        public getGlobalConfig(): ng.IPromise<any> {
            let deferred = this.$q.defer();
            if (this.globalConfig == undefined) {
                this.$http.get('application.js').then((val: any) => {
                    let data = this.decodeConfigData(val.data);
                    this.globalConfig = JSON.parse(data);
                    if (!angular.isArray(this.globalConfig.excludeWallpapers)) {
                        this.globalConfig.excludeWallpapers = [-1];
                    }
                    if (!angular.isArray(this.globalConfig.excludeThemes)) {
                        this.globalConfig.excludeThemes = [-1];
                    }
                    if (!angular.isArray(this.globalConfig.excludeLanguages)) {
                        this.globalConfig.excludeLanguages = ['-1'];
                    }
                    if (!angular.isArray(this.globalConfig.excludeModules)) {
                        this.globalConfig.excludeModules = [-1];
                    }
                    deferred.resolve(this.globalConfig);
                }, (errorResponse: any) => {
                    deferred.reject(errorResponse);
                });
            } else {
                deferred.resolve(this.globalConfig);
            }
            return deferred.promise;
        }

        private decodeConfigData(data): string {
            return decodeURIComponent(atob(data).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    }

}