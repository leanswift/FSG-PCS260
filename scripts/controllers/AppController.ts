/**
 * Application controller which will have the global scope functions and models and can be accessed through out the application. 
 * Functions and models shared across one or more modules should be implemented here. 
 * For independent modules create module specific controllers and declare it as a nested controller, i.e under the module specific page.
 */
module h5.application {

    export class AppController {

        //Array of strings in this property represent names of services to be injected into this controller. Note: The services are declared in app.ts
        static $inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location","$http"];

        constructor(private scope: IAppScope, private configService: h5.application.ConfigService, private appService: h5.application.IAppService, private restService: h5.application.RestService, private storageService: h5.application.StorageService, private gridService: h5.application.GridService, private userService: M3.IUserService, private languageService: h5.application.LanguageService, private $uibModal: ng.ui.bootstrap.IModalService, private $interval: ng.IIntervalService, private $timeout: ng.ITimeoutService, private $filter: h5.application.AppFilter, private $q: ng.IQService, private $window: ng.IWindowService, private formService: M3.FormService, private $location: ng.ILocationService,private $http: ng.IHttpService) {
            this.init();
        }

        /**
        * The initialize function which will be called when the controller is created
        */
        private init() {
            this.scope.appReady = false;
            this.scope.loadingData = false;
            this.scope.statusBar = [];
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBarVisible = true;

            this.languageService.getAppLanguage().then((val: Odin.ILanguage) => {
                this.scope.languageConstants = this.languageService.languageConstants;
                this.initApplication();
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language constants " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            if (this.$window.innerWidth <= 768) {
                this.scope.showSideNavLabel = false;
                this.scope.showSideNav = false;
            } else {
                this.scope.showSideNavLabel = true;
                this.scope.showSideNav = true;
            }
        }

        /**
        * This function will have any application specific initialization functions
        */
        private initApplication() {
            this.initGlobalConfig();
            this.initAppScope();
            this.initUIGrids();
            this.initScopeFunctions();
            this.$timeout(() => { this.scope.appReady = true; }, 5000);
            this.initApplicationConstants();
        }

        /**
        * This function will call the config service and set the global configuration model object with the configured settings 
        */
        private initGlobalConfig() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.scope.globalConfig = configData;
                this.initLanguage();
                this.initTheme();
                this.getUserContext();
                this.initModule();
            }, (errorResponse: any) => {
                Odin.Log.error("Error while getting global configuration " + errorResponse);
                this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
        }

        /**
        * Codes and function calls to initialize Application Scope model
        */
        private initAppScope() {
            //Initialize data objects
            this.scope.transactionStatus = {
                appConfig: false
            };
            this.scope["errorMessages"] = [];
            this.scope.infiniteScroll = {
                numToAdd: 20,
                currentItems: 20
            };
            this.scope.themes = [
                { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
            ];
            this.scope.textures = [
                { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
            ];
            this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
            ];
            this.scope.statusBarMessagetype = { Information: 0, Warning: 1, Error: 2 };
            this.scope.views = {
                h5Application: { url: "views/Application.html" },
                webService: {url : "views/WebServices.html"}
            };
            this.scope.modules = [
               { moduleId: 1, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'Web Services', content: this.scope.views.webService.url, active: true, available: true }
            
                ];
            this.scope.appConfig = {};
            this.scope.userContext = new M3.UserContext();
            this.scope["dateRef"] = new Date();
            this.initGlobalSelection();
            this.initWebService();
            
        }

        private initGlobalSelection() {
            this.scope.globalSelection = {
                reload: true,
                transactionStatus: {
                    sampleDataList1: false,
                    sampleDataList2: false,
                    facilityDataList: false,
                    workcenterDataList: false,
                    facility: false,
                    
                    
                    fromlocationDataList: false,
                    warehouseDataList: false,
                    containertypeDataList: false,
                    locationtypeDataList: false,
                    availabilityDataList: false
                },
                sampleDataList1: [],
                sampleData1: undefined,
                sampleDataList2: [],
                sampleData2: undefined,
                facilityDataList: [],
                userSelection: {},
                facilityList: [],
                facilityData: undefined,
                workcenterList: [],
                workcenterData: undefined,
                //---------
                fromlocationDataList: [],
                fromlocationData: undefined,
                warehouseDataList: [],
                warehouseData: undefined,
                containertypeDataList: [],
                containertypeData: undefined,
                locationtypeDataList: [],
                locationttypeData: undefined,
                availabilityDataList: [],
                availabilityData: undefined
            };
        }
    
        private initWebService(){
                this.scope.webService = {
                    reload: true,
                    transactionStatus: {
                        programList: false,
                        transactionList: false,
                        executeTransactions: false
                    },
                    collapseSel: false,
                    collapseSection1: false,
                    program: undefined,
                    programList: [],
                    transaction: undefined,
                    transactionList: [],
                    executionMethod: "async",
                    manualInput: false,
                    ignoreBlankInput: true,
                    executionMethodList: [
                        { name: "Parallel (Asynchronously)", value: "async" },
                        { name: "One by one (Synchronously)", value: "sync" },
                    ],
                    maxNumberOfRecords: 100,
                    transactionLayoutInput: [],
                    transactionLayoutOutput: [],
                    inputDataGrid: {},
                    ErrorListGrid: {},
                    isInputDataGridReady: false,
                    selectedInputDataGridRow: {},
                    outputDataGrid: {},
                    isOutputDataGridReady: false,
                    executeConfirmationMessage: "",
                    STRT: "",
                    inputItems:false,
                    errorBoolean: false,
                    errorText:" "
                };
        }
        
        

        /**
        * Initialize the application constants/labels
        */
        private initApplicationConstants() {
            //Add the Constants, Labels, Options which are not need to be hard-coded and used in the application
            //this.scope.sampleModule1.sampleM3Options = [{ id: "1", name: "1-Truck Load" }, { id: "2", name: "2-Train" }, { id: "3", name: "3-Air Charter" }];
        }

        /**
        * Initialize the binding of controller function mapping with the module scope
        */
        private initScopeFunctions() {
        }

        /**
        * Initialize UI grids objects defined in all modules
        */
        private initUIGrids() {
            //Initialize the grid objects via gridService
            this.scope.webService.inputDataGrid = this.gridService.getInputDataGrid();
            this.scope.webService.ErrorListGrid = this.gridService.getErrorListGrid()
            this.scope.webService.inputDataGrid.importerDataAddCallback = (grid, newObjects) => {
                newObjects.forEach((newObject) => {
                    newObject.executionStatus = undefined;
                    newObject.apiResponse = undefined;
                    newObject.errorCode = undefined;
                    newObject.errorMessage = undefined;
                });
                this.scope.webService.inputDataGrid.data = newObjects;
                this.scope.webService.ErrorListGrid.data = [];
                this.scope.webService.manualInput = true;
                this.gridService.adjustGridHeight("inputDataGrid", this.scope.webService.inputDataGrid.data.length, 500);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
            };
            this.initUIGridsOnRegisterApi();
        }

        /**
        * Initialize UI Grid On Register API if required
        */
        private initUIGridsOnRegisterApi() {
               this.scope.webService.inputDataGrid.onRegisterApi = (gridApi) => {
                this.scope.webService.inputDataGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("inputDataGrid", this.scope.webService.inputDataGrid.data.length, 500);

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    // called whenever the user select a row
                    this.inputDataGridRowSelected(row);
                });
            };

            this.scope.webService.ErrorListGrid.onRegisterApi = (gridApi) => {
                this.scope.webService.ErrorListGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("ErrorListGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("ErrorListGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("ErrorListGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("ErrorListGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("ErrorListGrid", gridApi); });

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
                
            };
            
        }
        /***
         * Input Grid Selected
         */
        private inputDataGridRowSelected(gridRow: any) {
            this.scope.webService.outputDataGrid.data = [];
            this.scope.webService.selectedInputDataGridRow = {};
            if (gridRow.isSelected) {
                this.scope.webService.selectedInputDataGridRow = gridRow.entity;
                let resultItems = angular.isDefined(gridRow.entity.apiResponse) ? gridRow.entity.apiResponse.items : [];
            }
        }
    

        /**
        * Reset UI Grid Column Definitions (Required to reflect if the user changed the application language)
        */
        private resetUIGridsColumnDefs() {
            this.scope.webService.inputDataGrid.columnDefs = this.gridService.getInputDataGrid().columnDefs;
        }

        /**
        * Initialize theme on application start
        */
        private initTheme() {
            let themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
            let textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
            themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
            textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
            this.themeSelected(themeId);
            this.textureSelected(textureId);

            this.scope.themes.forEach((theme) => {
                if (this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                    theme.available = false;
                } else {
                    theme.available = true;
                }
            });
            this.scope.textures.forEach((texture) => {
                if (this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                    texture.available = false;
                } else {
                    texture.available = true;
                }
            });
        }

        /**
        * Initialize module on application start
        */
        private initModule() {
            let moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
            moduleId = angular.isNumber(moduleId) ? moduleId : 1;
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
                if (this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                    appmodule.available = false;
                } else {
                    appmodule.available = true;
                }
            });
        }

        /**
        *  Initialize language on application start
        */
        private initLanguage() {
            let languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
            languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
            this.scope.currentLanguage = languageCode;
            if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                    this.resetUIGridsColumnDefs();
                }, (errorResponse: any) => {
                    Odin.Log.error("Error getting language " + errorResponse);
                    this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                });
            }
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                } else {
                    language.active = false;
                }
                if (this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                    language.available = false;
                } else {
                    language.available = true;
                }
            });
        }

        /**
        * Set the application theme
        * @param themeId the theme id
        */
        private themeSelected(themeId: number) {
            this.scope.themes.forEach((theme) => {
                if (angular.equals(theme.themeId, themeId)) {
                    theme.active = true;
                    this.scope.theme = theme;
                } else {
                    theme.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
        }

        /**
        * Set the application background
        * @param textureId the texture id
        */
        private textureSelected(textureId: number) {
            this.scope.textures.forEach((texture) => {
                if (angular.equals(texture.textureId, textureId)) {
                    texture.active = true;
                    this.scope.texture = texture;
                } else {
                    texture.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
        }

        /**
        * Get User Context for the logged in H5 user
        */
        private getUserContext() {
            Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
            this.scope.loadingData = true;
            this.userService.getUserContext().then((val: M3.IUserContext) => {
                this.scope.userContext = val;
                this.loadGlobalData();
            }, (reason: any) => {
                Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                this.loadGlobalData();
            });
        }

        /**
        * Launch the H5 program or H5 link when the app runs inside the H5 client
        */
        private launchM3Program(link: string): void {
            Odin.Log.debug("H5 link to launch -->" + link);
            this.formService.launch(link);
        }

        /**
        * Trigger load application data when the user hit a specific key
        */
        private mapKeyUp(event: any) {
            //F4 : 115, ENTER : 13
            if (event.keyCode === 115) {
                this.loadApplicationData();
            }
        }

        /**
        * Used by infinite scroll functionality in the ui-select dropdown with large number of records
        */
        private addMoreItemsToScroll() {
            this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
        };

        /**
        * Hack function to facilitate copy paste shortcut in ui grid cells
        */
        private copyCellContentToClipBoard(cells: any) {
            let hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
            hiddenTextArea.val("");
            let textToCopy = '', rowId = cells[0].row.uid;
            cells.forEach((cell: any) => {
                textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                let cellValue = cell.row.entity[cell.col.name];
                if (angular.isDefined(cellValue)) {
                    if (cell.row.uid !== rowId) {
                        textToCopy += '\n';
                        rowId = cell.row.uid;
                    }
                    textToCopy += cellValue;
                }

            });
            hiddenTextArea.val(textToCopy);
            hiddenTextArea.select();
        }

        /**
        * Opens About Page in a modal window
        */
        private openAboutPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/About.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application theme
        */
        private openChangeThemePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeThemeModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application wallpaper
        */
        private openChangeWallpaperPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeWallpaperModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application language
        */
        private openChangeAppLanguagePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeLanguageModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Change the application language
        * @param languageCode the language code to change
        */
        private changeAppLanguage(languageCode: string) {
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                    this.scope.currentLanguage = languageCode;
                } else {
                    language.active = false;
                }
            });
            this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                this.scope.appReady = false;
                this.closeModalWindow();
                this.resetUIGridsColumnDefs();
                this.$timeout(() => { this.scope.appReady = true; }, 1000);
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
        }
        
        /**
        * Toggle Side Nav Menu bar based on screen size
        */
        private sideMenuToggler(): void {
            if (this.$window.innerWidth <= 768) {
                this.scope.showSideNavLabel = false;
                this.scope.showSideNav = !this.scope.showSideNav;
            } else {
                this.scope.showSideNav = true;
                this.scope.showSideNavLabel = !this.scope.showSideNavLabel;
            }
        }

        /**
        * Close the modal window if any opened
        */
        private closeModalWindow() {
            this.scope.modalWindow.close("close");
        }

        /**
        * Close the status bar panel in the footer
        */
        private closeStatusBar() {
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBar = [];
        }

        /**
        * Remove the row item at the status bar
        */
        private removeStatusBarItemAt(index: number): void {
            if (index || index == 0) {
                this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
            }
            this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
        };

        /**
        * Show the error message in application error panel
        * @param error the error prefix/description to show
        * @param errorMessages array of error messages to display
        */
        private showError(error: string, errorMessages: string[]) {
            this.scope["hasError"] = true;
            this.scope["error"] = error;
            this.scope["errorMessages"] = errorMessages;
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = this.$timeout(() => { this.hideError(); }, 30000);
        }

        /**
        * Function to hide/clear the error messages
        */
        private hideError() {
            this.scope["hasError"] = false;
            this.scope["error"] = null;
            this.scope["errorMessages"] = [];
            this.scope["destroyErrMsgTimer"] = undefined;
        }

        /**
         * Show the warning message in application error panel
         * @param warning the warning prefix/description to show
         * @param warningMessages array of warning messages to display
         */
        private showWarning(warning: string, warningMessages: string[]) {
            this.scope["hasWarning"] = true;
            this.scope["warning"] = warning;
            this.scope["warningMessages"] = warningMessages;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = this.$timeout(() => { this.hideWarning(); }, 10000);
        }

        /**
        * Function to hide/clear the warning messages
        */
        private hideWarning() {
            this.scope["hasWarning"] = false;
            this.scope["warning"] = null;
            this.scope["warningMessages"] = null;
            this.scope["destroyWarnMsgTimer"] = undefined;
        }

        /**
        * Show the info message in application error panel
        * @param info the warning prefix/description to show
        * @param infoMessages array of info messages to display
        */
        private showInfo(info: string, infoMessages: string[]) {
            this.scope["hasInfo"] = true;
            this.scope["info"] = info;
            this.scope["infoMessages"] = infoMessages;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = this.$timeout(() => { this.hideInfo(); }, 10000);
        }

        /**
        * Function to hide/clear the info messages
        */
        private hideInfo() {
            this.scope["hasInfo"] = false;
            this.scope["info"] = null;
            this.scope["infoMessages"] = null;
            this.scope["destroyInfoMsgTimer"] = undefined;
        }

        /**
        * Add function calls which are required to be called during application load data for the first time 
        */
        private loadGlobalData() {
            let userContext = this.scope.userContext;
            let globalConfig = this.scope.globalConfig;

            this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then((val: any) => {
                 //console.log("GINloadGlobalData");
                this.setCSRFToken();
                this.refreshTransactionStatus();
                this.loadDefaultFields();
                this.hideWarning();
            });
        }

        /**
        * Auto selecting an option based on the query parameters or logged in user's details
        */
        private loadDefaultFields() {
            let userContext = this.scope.userContext;
            let appConfig = this.scope.appConfig;
            let division = angular.isString(appConfig.searchQuery.divi) ? appConfig.searchQuery.divi : userContext.division;
            let warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
            this.scope.globalSelection.sampleData1 = division;
            this.scope.globalSelection.sampleData2 = warehouse;
        }

        /**
        * Upon calling this function will reset the application data for all modules/tabs and load the application data for the active module/tab
        */
        private loadApplicationData() {
            let categories = ['globalSelection', 'mainScreen','webService'];
            this.clearData(categories);
            this.resetReloadStatus();
            this.loadData(this.scope.activeModule);
        }

        /**
        * Re-initializing or clearing the data based on modules or categories/business logic should be implemented here
        * @param categories the categories to clear data
        */
        private clearData(categories: string[]) {
            categories.forEach((category) => {
                if (category == "globalSelection") {
                    //Reset data from the global selection object
                }
                if (category == "mainScreen") {
                    //Reset data from the specific module or category
                   
                    
                }
                if (category == "sampleModule1") {
                    //Reset data from the specific module or category
                   
                }
                if (category == "webService") {
                    //Reset data from the specific module or category
                    this.scope.webService.isInputDataGridReady = false;
                    this.scope.webService.inputDataGrid.data = [];
                    this.scope.webService.ErrorListGrid.data = [];
                    this.scope.webService.manualInput = false;
                    this.scope.webService.selectedInputDataGridRow = {};
                    this.scope.webService.inputDataGrid.columnDefs = this.gridService.getInputDataGrid().columnDefs;
                }
            });
        }

        /**
        * Code for resetting reload status of all module's to stop showing loading indicator should be implemented here
        */
        private resetReloadStatus() {
            this.scope.webService.reload = true;
        }

        /**
        * Call this function from the view when a tab/module is selected to load
        * @param moduleId the selected module id
        */
        private moduleSelected(moduleId: number) {
            // this.scope.transactions.ErrorListGrid.data = [];
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
            //this.loadData(this.scope.activeModule);
        }

        /**
        * This function will be called whenever the tab is selected, so add the functions calls with respect to the tab id
        * @param activeModule the module to activate/load
        */
        private loadData(activeModule: number) {
            this.refreshTransactionStatus();
            switch (activeModule) {
                case 1:
                    this.loadwebService(this.scope.webService.reload);
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        private loadwebService(reLoad: boolean): void {
            let userContext = this.scope.userContext;

            if (reLoad) {
                this.clearData(["webService"]);
            }

            //Add functions calls / business logics below which are required when this module is requested to load by an user
            if (reLoad) {
                this.callWebServiceOne();
            }

            this.scope.webService.reload = false;
        }


        /**
        * This function will be called to iterate over the transactions states of a tab and set the loading indicator to true if there any running transactions
        */
        private refreshTransactionStatus() {
            let isLoading = false;
            for (let transaction in this.scope.transactionStatus) {
                let value = this.scope.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }

            for (let transaction in this.scope.globalSelection.transactionStatus) {
                let value = this.scope.globalSelection.transactionStatus[transaction];
                 //console.log("G scope.globalSelection value"+value);
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }
            this.scope.loadingData = isLoading;
            if (isLoading) { return; }

            switch (this.scope.activeModule) {
                case 1:
                    for (let transaction in this.scope.webService.transactionStatus) {
                        let value = this.scope.webService.transactionStatus[transaction];
                        if (value == true) {
                            isLoading = true;
                            break;
                        }
                    }
                    this.scope.loadingData = isLoading;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        //************************************************Application specific functions starts************************************************

        /**
        * Load Application Configurations
        */
        private loadAppConfig(company: string, division: string, user: string, environment: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            this.scope.appConfig = this.scope.globalConfig.appConfig;
            this.scope.appConfig.searchQuery = this.$location.search();
            if (this.scope.appConfig.enableM3Authority) {
                this.scope.loadingData = true;
                this.scope.transactionStatus.appConfig = true;
                //To restrict functionalities based on logged in user's authority for a M3 Program, use the below service to set and use an authority flag
                let promise1 = this.appService.getAuthority(company, division, user, "CRS610", 1).then((result: boolean) => {
                    //this.scope.appConfig.allowSaveData = result;
                });
                let promises = [promise1];
                this.$q.all(promises).finally(() => {
                   // console.log("G loadAppConfig");
                    deferred.resolve(this.scope.appConfig);
                    this.scope.transactionStatus.appConfig = false;
                    this.refreshTransactionStatus();
                    Odin.Log.debug("Application configurations" + JSON.stringify(this.scope.appConfig));
                });
            } else {
                deferred.resolve(this.scope.appConfig);
            }
            return deferred.promise;
        }
        /**
         * Add new row
         */
        private addNewRowInInputDataGrid(): void {
            let inputDataRows: any[] = this.scope.webService.inputDataGrid.data;
            inputDataRows.push({});
            this.gridService.adjustGridHeight("inputDataGrid", inputDataRows.length, 500);
        }
        /**
         * Remove Input Data
         */
        private removeInputDataGridRows(): void {
            let inputDataRows: any[] = this.scope.webService.inputDataGrid.data;
            let selectedRows = this.scope.webService.inputDataGrid.gridApi.selection.getSelectedRows();
            if (selectedRows.length == 0) {
                //show warning message
                let warningMessage = "Please select the rows to remove";
                this.showWarning(warningMessage, null);
                return;
            }
            selectedRows.forEach((selectedRow: any) => {
                let index = inputDataRows.lastIndexOf(selectedRow);
                inputDataRows.splice(index, 1);
            });
            this.scope.webService.inputDataGrid.gridApi.selection.clearSelectedRows();
            this.gridService.adjustGridHeight("inputDataGrid", inputDataRows.length, 500);
        }
        /**
         * Geting input from grid and execute transactions
         */
        private executeTransactions(): void {
            let inputRecords = [];
            let selectedRows = this.scope.webService.inputDataGrid.gridApi.selection.getSelectedRows();
            if (selectedRows.length > 0) {
                inputRecords = selectedRows;
            } else {
                inputRecords = this.scope.webService.inputDataGrid.data;
            }
           
           //if (angular.equals("async", executionMethod)) {
           // this.Asynchronously("", "", "", inputRecords, 10);
           //} else if (angular.equals("sync", executionMethod)) {
            //   this.executeLines(inputRecords,0);
           //}
           this.scope.webService.ErrorListGrid.data = [];

           let asyncflag = this.scope.webService.manualInput;
           //console.log("G asyncflag--"+asyncflag);
           if(asyncflag){
            this.executeAsynchronous("", "", 0, inputRecords, 10,0);
           }else{
            this.executeLines(inputRecords,0); 
           }

           //this.executeAsynchronously("", "", "", inputRecords, 10); //not using
           //this.executeAsynchronous("", "", 0, inputRecords, 10,0);G this is working function FOR ASYNC
           
           //this.executeLines(inputRecords,0); G this is working function FOR SYNC
           this.closeModalWindow();
        }
        /**
         * Open Confirm Panel
         */
        private openConfirmExecuteTransactionsModal(): void {
            let userContext = this.scope.userContext;
            let records = this.scope.webService.inputDataGrid.data;
            let selectedRows = this.scope.webService.inputDataGrid.gridApi.selection.getSelectedRows();
            if (records.length == 0) {
                //show warning message
                let warningMessage = "No input rows available to execute";
                this.showWarning(warningMessage, null);
                return;
            }
            this.scope.webService.executeConfirmationMessage = "You have selected " + selectedRows.length + " input row(s), Do you want to execute only the selected row(s)?";
            if (selectedRows.length == 0) {
                //show warning message
                this.scope.webService.executeConfirmationMessage = "You didn't selected any rows, Are you sure you want to execute all inputs from the list?";
            }
            let options: any = {
                animation: true,
                templateUrl: "views/ConfirmExecuteTransactionsModal.html",
                size: "sm",
                backdrop: 'static',
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
         * 
         * @param inputRecords Exe
         */
        private executeLines(inputRecords: any,itemIndex: number)   {
            //console.log("G TEST Running");
            //var _this = this;
            let nextItem = itemIndex;
            let inputRecord = inputRecords[itemIndex];
            //let requestData = angular.copy(inputRecord); 
           // this.scope.loadingData = true;
            //this.scope.webService.transactionStatus.executeTransactions = true;
            //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
            //var xmlhttp = new XMLHttpRequest();
            
            
            if(!angular.equals("",inputRecords[nextItem].W1STRT) &&  inputRecords[nextItem].W1STRT != undefined){
                if(inputRecords[nextItem].WWMAUM === undefined){inputRecords[nextItem].WWMAUM = "0";}
                if(inputRecords[nextItem].DIVI === undefined){inputRecords[nextItem].DIVI = "";}
                var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                console.log("G strXml -- FAILURE---"+inputRecords[nextItem].W1STRT+"---"+strXml);
                //console.log("G GETPDS001 FAILUREC strXml---"+strXml);
                this.executeXMLHttp(inputRecords,itemIndex,strXml).then((response: any) => {
                nextItem++;
                //console.log("G executeLines -- FAILURE---"+nextItem);
              if (nextItem < inputRecords.length) {
                   this.executeLines(inputRecords,nextItem);
              }else{
                this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
               }
               });
                }else{
                
                if(angular.equals("",inputRecords[nextItem].W1STRT) ||  inputRecords[nextItem].W1STRT === undefined){
                    inputRecords[nextItem].W1STRT = " ";
                }
                if(inputRecords[nextItem].WWMAUM === undefined){inputRecords[nextItem].WWMAUM = "0";}
                if(inputRecords[nextItem].DIVI === undefined){inputRecords[nextItem].DIVI = "";}
                var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                this.executeXMLHttp(inputRecords,itemIndex,strXml).then((response: any) => {
                nextItem++;
              if (nextItem < inputRecords.length) {
                   this.executeLines(inputRecords,nextItem);
              }else{
                this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
               }
               });
                /*
                //G ENABLE BELOW CODE FOR STRT INPUT FIELD 11MARCH2022  
                if(angular.equals("",this.scope.webService.STRT)){
                 this.scope.webService.STRT = "001";
                }
                this.appService.getPDS001Sync(inputRecords[nextItem].W1FACI, inputRecords[nextItem].W1ITNO,this.scope.webService.STRT).then((val: M3.IMIResponse) => {
                if(val.items.length > 0){
                if(angular.equals("",val.item.STRT)){
                val.item.STRT =  " ";
                }
               var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+val.item.STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
               console.log("G strXml -- SUCCESS---"+this.scope.webService.STRT+"---"+strXml);
                //console.log("G GETPDS001 SUCCESS strXml---"+strXml);
                this.executeXMLHttp(inputRecords,itemIndex,strXml).then((response: any) => {
                     nextItem++;
               
               if (nextItem < inputRecords.length) {
                    this.executeLines(inputRecords,nextItem);
               }else{
                this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
               }
                });
            
            } 
            }, (err: M3.MIResponse) => {
                if(angular.equals("",inputRecords[nextItem].W1STRT) ||  inputRecords[nextItem].W1STRT === undefined){
                    inputRecords[nextItem].W1STRT = " ";
                }
                var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                //console.log("G GETPDS001 FAILUREC strXml---"+strXml);
                console.log("G strXml -- FAILURE---"+strXml);
                this.executeXMLHttp(inputRecords,itemIndex,strXml).then((response: any) => {
                nextItem++;
                //console.log("G executeLines -- FAILURE---"+nextItem);
              if (nextItem < inputRecords.length) {
                   this.executeLines(inputRecords,nextItem);
              }else{
                this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
               }
               });
                //this.showError(err.errorMessage, null);
            }); */
                //G ENABLE ABOVE CODE FOR STRT INPUT FIELD ON SCREEN 11MARCH2022 
            }
        }
        
        
        private executeLinesPREVIOUSLATEST(inputRecords: any,itemIndex: number)   {
            //console.log("G TEST Running");
            //var _this = this;
            let nextItem = itemIndex;
            let inputRecord = inputRecords[itemIndex];
            //let requestData = angular.copy(inputRecord); 
           // this.scope.loadingData = true;
            //this.scope.webService.transactionStatus.executeTransactions = true;
            //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
            //var xmlhttp = new XMLHttpRequest();
            if(angular.equals("",this.scope.webService.STRT)){
                 this.scope.webService.STRT = "001";
             }
            this.appService.getPDS001Sync(inputRecords[nextItem].W1FACI, inputRecords[nextItem].W1ITNO,this.scope.webService.STRT).then((val: M3.IMIResponse) => {
                if(val.items.length > 0){
                var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+val.item.STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                //console.log("G GETPDS001 SUCCESS strXml---"+strXml);
                this.executeXMLHttp(inputRecords,itemIndex,strXml).then((response: any) => {
                     nextItem++;
               console.log("G strXml -- SUCCESS---"+strXml);
               if (nextItem < inputRecords.length) {
                    this.executeLines(inputRecords,nextItem);
               }else{
                this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
               }
                });
            
            }
            }, (err: M3.MIResponse) => {
                var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                //console.log("G GETPDS001 FAILUREC strXml---"+strXml);
                this.executeXMLHttp(inputRecords,itemIndex,strXml).then((response: any) => {
                nextItem++;
                console.log("G strXml -- FAILURE---"+strXml);
                //console.log("G executeLines -- FAILURE---"+nextItem);
              if (nextItem < inputRecords.length) {
                   this.executeLines(inputRecords,nextItem);
              }else{
                this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
                this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
               }
               });
                //this.showError(err.errorMessage, null);
            });
        }

        /**
         * 
         * @param inputRecords Exe
         */
        private executeXMLHttp(inputRecords: any,itemIndex: number,strXml: any): ng.IPromise<any>    {
            //console.log("G TEST Running");
            
            var _this = this;
            let deferred = _this.$q.defer();
            let nextItem = itemIndex;
            let executeOnce = "1";
            let errorString = "";
            let inputRecord = inputRecords[itemIndex];
            //let requestData = angular.copy(inputRecord); 
            this.scope.loadingData = true;
            this.scope.webService.transactionStatus.executeTransactions = true;
            //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', 'https://m3prduse1b.m3.inforcloudsuite.com/ips/service/PCS_Load', true); //old url https://m3prduse1.m3.inforcloudsuite.com/ips/service/PCS_Load
            xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                inputRecord.executionStatus = "success";
                inputRecord.errorCode = xmlhttp.response;
                _this.scope.webService.errorText = xmlhttp.responseText;
                inputRecord.apiResponse = angular.copy(xmlhttp.response);
                _this.scope.webService.transactionStatus.executeTransactions = false;
                _this.refreshTransactionStatus();
                if(xmlhttp.responseText.indexOf("faultstring") > 0){
                    errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12,xmlhttp.responseText.lastIndexOf("faultstring")-2)
                     }else{
                    errorString = "The Record is processed successfully";
                     }
               let errorLines: any = {
                PRNO: inputRecords[nextItem].W1ITNO,FACI: inputRecords[nextItem].W1FACI, ERRR: errorString
                };
              // _this.scope.webService.ErrorListGrid.data.push(errorLines);
              // nextItem++;
               //console.log("G nextItem-- SUCCESS---"+nextItem);
              // console.log("G nextItem-- SUCCESS xmlhttp.responseText---"+xmlhttp.responseText);
              // if (nextItem < inputRecords.length) {
               //    _this.executeLines(inputRecords,nextItem);
               //} 
               deferred.resolve("G done");
              }
              if (xmlhttp.readyState == 4 && xmlhttp.status == 500)  {  
                inputRecord.executionStatus = "failure";  
                inputRecord.apiResponse = angular.copy(xmlhttp.response);
                inputRecord.errorCode = xmlhttp.response;
                _this.scope.webService.errorText = xmlhttp.responseText;
                _this.scope.webService.transactionStatus.executeTransactions = false;
                _this.refreshTransactionStatus();
             //   if(!angular.equals("", xmlhttp.responseText) && angular.equals("1", executeOnce)){
               executeOnce = "2";
               if(xmlhttp.responseText.indexOf("faultstring") > 0){
              errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12,xmlhttp.responseText.lastIndexOf("faultstring")-2)
               let errorLines: any = {
                PRNO: inputRecords[nextItem].W1ITNO,FACI: inputRecords[nextItem].W1FACI, ERRR: errorString
                };
               _this.scope.webService.ErrorListGrid.data.push(errorLines);
               
               }else{
             // errorString = xmlhttp.responseText;
                   console.log("G SYNC 500---"+xmlhttp.responseText);
                   _this.setSyncCSRFTokenFORWS(inputRecords,itemIndex,strXml);
               
               }
               
               //nextItem++;
               //console.log("G nextItem-- FAILUER---"+nextItem);
               //console.log("G nextItem-- FAILUER xmlhttp.responseText---"+xmlhttp.responseText);
           // }
               //if (nextItem < inputRecords.length) {
               //    _this.executeLines(inputRecords,nextItem);
              // } 
               deferred.resolve("G done");
              }
                
         if (xmlhttp.readyState == 4 && xmlhttp.status == 403)  { 
         console.log("G SYNC 403---"+xmlhttp.responseText); 
         _this.setSyncCSRFTokenFORWS(inputRecords,itemIndex,strXml);
            }
                
            };
            xmlhttp.setRequestHeader('Content-Type', 'text/xml');
            xmlhttp.setRequestHeader('fnd-csrf-token', this.scope.webService.csrfToken);
            //xmlhttp.withCredentials = true;
            //xmlhttp.setRequestHeader('Authorization', "Basic "+ "TTNBUElATUlSLUJFTFRJTkcuQ09NOkFwaVVzM3Ix")
            xmlhttp.send(strXml);
            //nextItem++;
            //if (nextItem < inputRecords.length) {
            //    this.executeLines(inputRecords,nextItem);
            //} 
            return deferred.promise;  
            
        }


        //private executeAsynchronouslyXMLHttp(inputRecords: any,itemIndex: number,strXml: any): ng.IPromise<any>    {
    //         private executeAsynchronouslyXMLHttp(ITNO: any,FACI: any,PCDT: any,CUS1: any,strXml: any,inputRecords:any): ng.IPromise<any>    {
    //             //console.log("G TEST Running");
    //             console.log("G OUTSIDE ITNO: any,FACI: any,PCDT: any,CUS1: any" + ITNO +"-"+FACI+"-",PCDT+"-"+CUS1);
                    
    //         var _this = this;
    //         let deferred = _this.$q.defer();
    //         //let nextItem = itemIndex;
    //         let executeOnce = "1";
    //         let errorString = "";
    //         //let inputRecord = inputRecords[itemIndex];
    //         let inputRecord  = this.$filter('filter')(inputRecords, (value: any) => {
    //             if(angular.equals(ITNO, value.W1ITNO) && angular.equals(FACI.trim(), value.W1FACI.trim()) 
    //             && angular.equals(PCDT, value.W1PCDT) && angular.equals(CUS1, value.WWCSU1)){
    //                console.log("G ITNO: any,FACI: any,PCDT: any,CUS1: any" + ITNO +"-"+FACI+"-",PCDT+"-"+CUS1);
    //                 return true; 
    //                     }else{
    //                 console.log("G ITNO: any,FACI: any,PCDT: any,CUS1: any" + ITNO +"-"+FACI+"-",PCDT+"-"+CUS1);
    //                 return false; 
    //                 }
    //          });
    //          console.log("G executeAsynchronouslyXMLHttp---"+JSON.stringify(inputRecord));
    //         //let requestData = angular.copy(inputRecord); 
    //         this.scope.loadingData = true;
    //         this.scope.webService.transactionStatus.executeTransactions = true;
    //         //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+inputRecords[nextItem].CONO+'</cred:company><cred:division>'+inputRecords[nextItem].DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+inputRecords[nextItem].W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+inputRecords[nextItem].W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+inputRecords[nextItem].W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+inputRecords[nextItem].W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+inputRecords[nextItem].W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+inputRecords[nextItem].WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+inputRecords[nextItem].WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
    //         var xmlhttp = new XMLHttpRequest();
    //         xmlhttp.open('POST', 'https://m3prduse1.m3.inforcloudsuite.com/ips/service/PCS_Load', true);
    //         xmlhttp.onreadystatechange = function () {
    //           if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //             inputRecord.forEach((gridData,index) => {
    //                 //console.log("G Error");
    //                 if (index === 0) {
    //                 gridData.executionStatus = "success";
    //                 gridData.errorCode = xmlhttp.response;
    //                 gridData.apiResponse = angular.copy(xmlhttp.response);
    //                 }
    //            });

    //            // inputRecord.executionStatus = "success";
    //             //inputRecord.errorCode = xmlhttp.response;
    //             _this.scope.webService.errorText = xmlhttp.responseText;
    //             //inputRecord.apiResponse = angular.copy(xmlhttp.response);
    //             _this.scope.webService.transactionStatus.executeTransactions = false;
    //             _this.refreshTransactionStatus();
    //            //let errorLines: any = {
    //            // PRNO: inputRecords[nextItem].W1ITNO, ERRR: xmlhttp.responseText
    //            // };
    //           // _this.scope.webService.ErrorListGrid.data.push(errorLines);
    //           // nextItem++;
    //            //console.log("G nextItem-- SUCCESS---"+nextItem);
    //           // console.log("G nextItem-- SUCCESS xmlhttp.responseText---"+xmlhttp.responseText);
    //           // if (nextItem < inputRecords.length) {
    //            //    _this.executeLines(inputRecords,nextItem);
    //            //} 
    //            //deferred.resolve("G done");
    //           }
    //           else {  
    //             inputRecord.forEach((gridData,index) => {
    //                 if (index === 0) {
    //                 console.log("G _this.scope.webService.ErrorListGrid.data---"+_this.scope.webService.ErrorListGrid.data.length);
                
    //                 let errorRecord  = _this.$filter('filter')(_this.scope.webService.ErrorListGrid.data, (value: any) => {
    //                     if(angular.equals(gridData.W1ITNO.toString(), value.PRNO.toString()) && angular.equals(gridData.W1FACI.trim(), value.FACI.trim())){
    //                         //console.log("G Matching");
    //                         return true; 
    //                             }else{
    //                         return false; 
    //                         }
    //                  });
    //                  if(errorRecord.length === 0){
    //                     console.log("G errorRecord.length --"+ errorRecord.length + "--"+ gridData.W1ITNO);
    //                 //console.log("G Error index--"+index + "--"+ gridData.W1ITNO);
                    
    //                 //console.log("G Error index 0 --"+index + "--"+ gridData.W1ITNO);
    //                 gridData.executionStatus = "failure";
    //                 gridData.errorCode = xmlhttp.response;
    //                 gridData.apiResponse = angular.copy(xmlhttp.response);
    //                 // inputRecord.executionStatus = "failure";  
    //            // inputRecord.apiResponse = angular.copy(xmlhttp.response);
    //             //inputRecord.errorCode = xmlhttp.response;
    //             _this.scope.webService.errorText = xmlhttp.responseText;
    //             _this.scope.webService.transactionStatus.executeTransactions = false;
    //             _this.refreshTransactionStatus();
    //             if(!angular.equals("", xmlhttp.responseText) && angular.equals("1", executeOnce)){
    //            executeOnce = "2";
    //            if(xmlhttp.responseText.indexOf("faultstring") > 0){
    //             //errorString = xmlhttp.response;
    //     errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12,xmlhttp.responseText.lastIndexOf("faultstring")-2)
    //            }else{
    //           errorString = xmlhttp.responseText;
    //            }
    //            let errorLines: any = {
    //             PRNO: gridData.W1ITNO,FACI: gridData.W1FACI,  ERRR: errorString
    //             };
    //            _this.scope.webService.ErrorListGrid.data.push(errorLines);
               
    //            //nextItem++;
    //            //console.log("G nextItem-- FAILUER---"+nextItem);
    //            //console.log("G nextItem-- FAILUER xmlhttp.responseText---"+xmlhttp.responseText);
    //         }
    //     }
    // }
    //            });

              
    //            //if (nextItem < inputRecords.length) {
    //            //    _this.executeLines(inputRecords,nextItem);
    //           // } 
    //            //deferred.resolve("G done");
    //           }
    //         };
    //         xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    //         //xmlhttp.withCredentials = true;
    //         //xmlhttp.setRequestHeader('Authorization', "Basic "+ "TTNBUElATUlSLUJFTFRJTkcuQ09NOkFwaVVzM3Ix")
    //         xmlhttp.send(strXml);
    //         //nextItem++;
    //         //if (nextItem < inputRecords.length) {
    //         //    this.executeLines(inputRecords,nextItem);
    //         //} 
    //         deferred.resolve("G done");
    //         return deferred.promise;  
            
    //     }


    //     /**
    //     * Execute all transactions asynchronously in batch
    //     */
    //    private executeAsynchronously(program: string, transaction: string, maxNumberOfRecords: number, inputRecords: any, batchSize: number): void {
    //     let promises = [];
    //     for (let index = 0; index < inputRecords.length; index += batchSize) {
    //         let inputRecordsChunk = inputRecords.slice(index, index + batchSize);
    //        // console.log("G inputRecordsChunk---"+JSON.stringify(inputRecordsChunk) );
    //         let promise1 = this.executeAsynchronouslyInBatch(program, transaction, maxNumberOfRecords, inputRecordsChunk);
    //         //console.log("G AFTER inputRecordsChunk---"+JSON.stringify(inputRecordsChunk));
    //         promises.push(promise1);
    //     }
    //     this.$q.all(promises).finally(() => {
    //         this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
    //     });
    // }

    private executeAsynchronous(program: string, transaction: string, maxNumberOfRecords: number, inputRecords: any, batchSize: number,index: number): void {
       // let promises = [];

       let inputRecordsChunk = inputRecords.slice(index, index + batchSize);
    // console.log("G inputRecordsChunk---"+JSON.stringify(inputRecordsChunk) );
     //console.log("G inputRecords.length---" + inputRecords.length);
     //console.log("G inputRecordsChunk.length---" + inputRecordsChunk.length);
     if (inputRecordsChunk.length > 0) {
     //this.executeAsynchronouslyInBatch(program, transaction, maxNumberOfRecords, inputRecordsChunk).then((response: any) => {
        this.executeAsynchronuslyInBatch(program, transaction, maxNumberOfRecords, inputRecordsChunk).then((response: any) => {
            index = index + batchSize;
        this.executeAsynchronous("", "", 0, inputRecords,10, index);
     
       });
    }else{
        this.scope.webService.transactionStatus.executeTransactions = false;
        this.refreshTransactionStatus();
       this.showInfo("Processing input file is completed for " + inputRecords.length + "no of Records", null);
       this.gridService.adjustGridHeight("ErrorListGrid", this.scope.webService.ErrorListGrid.data.length, 500);
      }
    }

    /**
    * Execute all transactions asynchronously
    */
   /*
    private executeAsynchronouslyInBatch(program: string, transaction: string, maxNumberOfRecords: number, inputRecords: any): ng.IPromise<any> {
        let deferred = this.$q.defer();
        let promises = [];
        let itemIndex = 0;
        this.scope.loadingData = true;
        this.scope.webService.transactionStatus.executeTransactions = true;
        inputRecords.forEach((record) => {
        let promise1 = this.appService.getPDS001(record.W1FACI, record.W1ITNO,"100").then((val: M3.IMIResponse) => {
             if(val.items.length > 0){
            //console.log("G this.scope.webService.inputDataGrid.data---"+this.scope.webService.inputDataGrid.data);
             let filteredLinesu = this.$filter('filter')(inputRecords, (value: any) => {
                if(angular.equals(val.item.PRNO, value.W1ITNO.toString()) && angular.equals(val.item.FACI.trim(), value.W1FACI.trim())){
                return true; 
            }else{
                return false; 
                            }
                     });
                     //console.log("G filteredLine---"+JSON.stringify(filteredLinesu));
                     filteredLinesu.forEach((gridData,index) => {
                        if (index === 0) {
                        var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+gridData.CONO+'</cred:company><cred:division>'+gridData.DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+gridData.W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+gridData.W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+gridData.W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+gridData.W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+val.item.STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+gridData.WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+gridData.WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                
                //console.log("G GETPDS001 SUCCESS strXml---"+strXml);
                //console.log("G GETPDS001 SUCCESS itemIndex---"+itemIndex);
                this.executeAsynchronouslyXMLHttp(gridData.W1ITNO,gridData.W1FACI,gridData.W1PCDT,gridData.WWCSU1,strXml,inputRecords).then((response: any) => {
                    
                });
            }
            });
            }
            }, (err: M3.MIResponse) => {
               // console.log("G GETPDS001 JSON.stringify(err.requestData) strXml---"+JSON.stringify(err.requestData));  
                let filteredLine = this.$filter('filter')(inputRecords, (value: any) => {
                    if(angular.equals(err.requestData.PRNO, value.W1ITNO) && angular.equals(err.requestData.FACI.trim(), value.W1FACI.trim())){
                        return true; 
                            }else{
                        return false; 
                        }
                 });
                // console.log("G error filteredLine---"+JSON.stringify(filteredLine));
                 filteredLine.forEach((gridData,index) => {
                if (index === 0) {
                    var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+gridData.CONO+'</cred:company><cred:division>'+gridData.DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+gridData.W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+gridData.W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+gridData.W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+gridData.W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+gridData.W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+gridData.WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+gridData.WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
            
                //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+record.CONO+'</cred:company><cred:division>'+record.DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+record.W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+record.W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+record.W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+record.W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+val.item.STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+record.WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+record.WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
                //console.log("G GETPDS001 FAILUREC strXml---"+strXml);
                //console.log("G GETPDS001 FAILUREC itemIndex---"+itemIndex);
                this.executeAsynchronouslyXMLHttp(gridData.W1ITNO,gridData.W1FACI,gridData.W1PCDT,gridData.WWCSU1,strXml,inputRecords).then((response: any) => {
                    itemIndex++;
               });
                 }
            });
                //this.showError(err.errorMessage, null);
            });
            promises.push(promise1);
            });

        this.$q.all(promises).finally(() => {
            console.log("G deferred.resolve()---");
            deferred.resolve();
            this.scope.webService.transactionStatus.executeTransactions = false;
            this.refreshTransactionStatus();
        });
        return deferred.promise;
    }

*/

/**
    * Execute all transactions asynchronously
    */
   private executeAsynchronuslyInBatch(program: string, transaction: string, maxNumberOfRecords: number, inputRecords: any): ng.IPromise<any> {
    let deferred = this.$q.defer();
    let promises = [];
    let itemIndex = 0;
    this.scope.loadingData = true;
    this.scope.webService.transactionStatus.executeTransactions = true;
    inputRecords.forEach((record) => {
        record.executionStatus = "";
        record.errorCode = "";
        record.apiResponse = "";
         if(record.DIVI == undefined){record.DIVI = "";}   
          if(record.WWMAUM == undefined){record.WWMAUM = "0";} 
         if(!angular.equals("",record.W1STRT) &&  record.W1STRT != undefined){
         var strXml1 = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+record.CONO+'</cred:company><cred:division>'+record.DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+record.W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+record.W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+record.W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+record.W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+record.W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+record.WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+record.WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
             console.log("G STRT NOT BALNK"); 
             console.log(strXml1);    
         this.executeAsynchronouslyXMLHttp(strXml1,record).then((response: any) => {
        });
         }else{
          if(angular.equals("",record.W1STRT) ||  record.W1STRT === undefined){
              record.W1STRT = " ";
              }   
          var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+record.CONO+'</cred:company><cred:division>'+record.DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+record.W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+record.W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+record.W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+record.W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+record.W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+record.WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+record.WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
         console.log(strXml);
         this.executeAsynchronouslyXMLHttp(strXml,record).then((response: any) => {
        });
             
       /*
                //G ENABLE BELOW CODE FOR STRT INPUT FIELD 11MARCH2022       
             
             if(angular.equals("",this.scope.webService.STRT)){
                 this.scope.webService.STRT = "001";
             }
             console.log("G STRT BALNK---"+this.scope.webService.STRT);
        let promise1 = this.appService.getPDS001(record.CONO,record.DIVI,record.W1FACI, record.W1ITNO,record.W1PCDT, this.scope.webService.STRT, record.W1PCTP,record.W1RORN,record.W1VASE,record.WWCSU1,record.WWMAUM).then((val: any) => {
        if(!angular.equals("",val.W1ITNO) && !angular.equals("",val.W1PCDT) ){
        // console.log("G record.CONO---"+val.W1ITNO);
        // console.log("G record.DIVI---"+val.DIVI);
        // console.log("G record.W1FACI---"+val.W1FACI);
        // console.log("G record.W1ITNO---"+val.W1ITNO);
        // console.log("G record.W1PCDT---"+val.W1PCDT);
        // console.log("G record.W1STRT---"+val.W1STRT);
        // console.log("G record.W1PCTP---"+val.W1PCTP);
        // console.log("G record.W1RORN---"+val.W1RORN);
        // console.log("G record.W1VASE---"+val.W1VASE);
        // console.log("G record.WWCSU1---"+val.WWCSU1);
        // console.log("G record.WWMAUM---"+val.WWMAUM);
            if(angular.equals("",val.W1STRT)){
                console.log("G Blank---"+val.W1STRT);
                val.W1STRT = " ";
            }
        var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:pcs="http://schemas.infor.com/ips/PCS_Load/PCS260"> <soapenv:Header><cred:lws><cred:company>'+val.CONO+'</cred:company><cred:division>'+val.DIVI+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><pcs:PCS260><pcs:PCS260><pcs:W1FACI>'+val.W1FACI+'</pcs:W1FACI><pcs:W1ITNO>'+val.W1ITNO+'</pcs:W1ITNO><pcs:W1PCDT>'+val.W1PCDT+'</pcs:W1PCDT><pcs:W1PCTP>'+val.W1PCTP+'</pcs:W1PCTP><pcs:W1RORN/><pcs:W1STRT>'+val.W1STRT+'</pcs:W1STRT><pcs:W1VASE/><pcs:WWCSU1>'+val.WWCSU1+'</pcs:WWCSU1><pcs:WWMAUM>'+val.WWMAUM+'</pcs:WWMAUM></pcs:PCS260></pcs:PCS260></soapenv:Body></soapenv:Envelope>';
        console.log(strXml);
            // let currentRecord = this.$filter('filter')(inputRecords, (value: any) => {
        //        if(angular.equals(val.W1ITNO.toString().trim(), value.W1ITNO.toString().trim()) 
        //        && angular.equals(val.W1FACI.trim(), value.W1FACI.trim())
        //        && angular.equals(val.W1PCDT.toString().trim(), value.W1PCDT.toString().trim())
        //        && angular.equals(val.WWCSU1.toString().trim(), value.WWCSU1.toString().trim())
        //        ){
        //     return true; 
        // }else{
        //     return false; 
        //      }
        //          });
                  //console.log("G strXml---"+strXml);
        //          console.log("G currentRecord---"+JSON.stringify(currentRecord));
        this.executeAsynchronouslyXMLHttp(strXml,record).then((response: any) => {
        });
    }
        }).finally(() => {
        });
        promises.push(promise1);
            
                //G ENABLE  CODE FOR STRT INPUT FIELD 11MARCH2022 
             */
        }
        
        
        });

    this.$q.all(promises).finally(() => {
       // console.log("G deferred.resolve()---");
        deferred.resolve();
        this.scope.webService.transactionStatus.executeTransactions = false;
        this.refreshTransactionStatus();
    });
    return deferred.promise;
}

private executeAsynchronouslyXMLHttp(strXml: any,inputRecords:any): ng.IPromise<any>    {
    //console.log("G TEST Running");
     console.log("G begin Running---"+this.scope.webService.csrfToken);    
    var _this = this;
    let deferred = _this.$q.defer();
    //let nextItem = itemIndex;
    let executeOnce = "1";
    let errorString = "";
    let inputRecord  = inputRecords;
        //console.log("G executeAsynchronouslyXMLHttp---"+JSON.stringify(inputRecord));
        //let requestData = angular.copy(inputRecord); 
        this.scope.loadingData = true;
        this.scope.webService.transactionStatus.executeTransactions = true;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'https://m3prduse1b.m3.inforcloudsuite.com/ips/service/PCS_Load', true); //url https://m3prduse1.m3.inforcloudsuite.com/ips/service/PCS_Load
        xmlhttp.onreadystatechange = function () {
        //console.log("G outside record---"+inputRecord.W1ITNO +"-"+ xmlhttp.readyState + "-" + xmlhttp.status);
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //console.log("G SUCCESS record---"+inputRecord.W1ITNO);
        //inputRecord.forEach((gridData,index) => {
        //console.log("G Error");
        //if (index === 0) {
            inputRecord.executionStatus = "success";
            inputRecord.errorCode = xmlhttp.response;
            inputRecord.apiResponse = angular.copy(xmlhttp.response);
        //}
        //});

    _this.scope.webService.errorText = xmlhttp.responseText;
    _this.scope.webService.transactionStatus.executeTransactions = false;
    _this.refreshTransactionStatus();

    if(xmlhttp.responseText.indexOf("faultstring") > 0){
        //errorString = xmlhttp.response;
    errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12,xmlhttp.responseText.lastIndexOf("faultstring")-2)
        }else{
    //errorString = xmlhttp.responseText;
    errorString = "The Record is processed successfully";
    }
    let errorLines: any = {
        PRNO: inputRecord.W1ITNO,FACI: inputRecord.W1FACI,  ERRR: errorString
        };
    _this.scope.webService.ErrorListGrid.data.push(errorLines);
   
  }
  if (xmlhttp.readyState == 4 && xmlhttp.status == 500)  {  
    //inputRecord.forEach((gridData,index) => {
        //if (index === 0) {
       // if(!angular.equals("", xmlhttp.responseText) && angular.equals("1", executeOnce)){
        executeOnce = "2";
        //console.log("G error record---"+inputRecord.W1ITNO);
    
        // let errorRecord  = _this.$filter('filter')(_this.scope.webService.ErrorListGrid.data, (value: any) => {
        //     if(angular.equals(gridData.W1ITNO.toString(), value.PRNO.toString()) && angular.equals(gridData.W1FACI.trim(), value.FACI.trim())){
        //         //console.log("G Matching");
        //         return true; 
        //             }else{
        //         return false; 
        //         }
        //  });
         //if(errorRecord.length === 0){
        //console.log("G errorRecord.length --"+ errorRecord.length + "--"+ gridData.W1ITNO);
        inputRecord.executionStatus = "failure";
        inputRecord.errorCode = xmlhttp.response;
        inputRecord.apiResponse = angular.copy(xmlhttp.response);
        _this.scope.webService.errorText = xmlhttp.responseText;
        _this.scope.webService.transactionStatus.executeTransactions = false;
        _this.refreshTransactionStatus();
        
    if(xmlhttp.responseText.indexOf("faultstring") > 0){
        //errorString = xmlhttp.response;
    errorString = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("faultstring") + 12,xmlhttp.responseText.lastIndexOf("faultstring")-2)
     let errorLines: any = {
        PRNO: inputRecord.W1ITNO,FACI: inputRecord.W1FACI,  ERRR: errorString
        };
    _this.scope.webService.ErrorListGrid.data.push(errorLines);   
    }else{
    //errorString = xmlhttp.responseText;
    //errorString = "The Record is created successfully"; // AK 07SEP2021 500 ERROR
        console.log("G Error 500--"+xmlhttp.responseText);
        _this.setAsyncCSRFTokenFORWS(strXml,inputRecords); // AK 07SEP2021 500 ERROR
       
    }
       // AK 07SEP2021 500 ERROR
    //let errorLines: any = {  // AK 07SEP2021 500 ERROR
    //    PRNO: inputRecord.W1ITNO,FACI: inputRecord.W1FACI,  ERRR: errorString 
    //    };
    //_this.scope.webService.ErrorListGrid.data.push(errorLines);
    // AK 07SEP2021 500 ERROR
       // }
        //}
        //}
        //});

        }
        if (xmlhttp.readyState == 4 && xmlhttp.status == 403)  { 
        console.log("G Error 403--"+xmlhttp.responseText); 
         _this.setAsyncCSRFTokenFORWS(strXml,inputRecords);

        }
        };
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.setRequestHeader('fnd-csrf-token', this.scope.webService.csrfToken); 
        xmlhttp.send(strXml);
        deferred.resolve("G done");
        return deferred.promise;  
}

        private removeBlankInputs(requestData: any): any {
            for (let inputName in requestData) {
                let inputValue = requestData[inputName];
                if (angular.isString(inputValue) && angular.equals("", inputValue.trim())) {
                    requestData[inputName] = undefined;
                }
            }
            return requestData;
          }
        /**
         * Enable input data
         */
        private callWebServiceOne(): void {
            this.scope.webService.inputItems = true;
            this.scope.webService.inputDataGrid.data = [];
          
        }
        
         private setCSRFToken(): ng.IPromise<any> {
            let deferred = this.$q.defer();
            let csrfURL = "/m3api-rest/csrf";
            this.$http.get(csrfURL).then((response: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.webService.csrfToken = response.data;
                console.log("G CSRF TOKEN");
                console.log(this.scope.webService.csrfToken);
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        
         private getCSRFToken(): ng.IPromise<any> {
            let deferred = this.$q.defer();
            let csrfURL = "/m3api-rest/csrf";
            this.$http.get(csrfURL).then((response: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.webService.csrfToken = response.data;
                console.log("G getCSRFToken TOKEN");
                console.log(this.scope.webService.csrfToken);
                this.executeTransactions();
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        
        private setAsyncCSRFTokenFORWS(strXml: any,inputRecords:any): void {
            //let deferred = this.$q.defer();
            let csrfURL = "/m3api-rest/csrf";
            this.$http.get(csrfURL).then((response: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.webService.csrfToken = response.data;
                console.log("G setCSRFTokenFORWS TOKEN");
                this.executeAsynchronouslyXMLHttp(strXml,inputRecords);
                console.log(this.scope.webService.csrfToken);
               // deferred.resolve(response);
            });
            //return deferred.promise;
        }
        
         private setSyncCSRFTokenFORWS(inputRecords: any,itemIndex: number,strXml: any): void {
            //let deferred = this.$q.defer();
            let csrfURL = "/m3api-rest/csrf";
            this.$http.get(csrfURL).then((response: ng.IHttpPromiseCallbackArg<any>) => {
                this.scope.webService.csrfToken = response.data;
                console.log("G setCSRFTokenFORWS TOKEN");
                this.executeXMLHttp(inputRecords,itemIndex,strXml);
                console.log(this.scope.webService.csrfToken);
               // deferred.resolve(response);
            });
            //return deferred.promise;
        }
   
        //*************************************************Application specific functions ends*************************************************/

    }
}