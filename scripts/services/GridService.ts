/**
 * Utility service to design and control UI Grids used in the application
 */
module h5.application {

    export class GridService {

        static $inject = ["$filter", "$timeout", "StorageService", "languageService"];
        private baseGrid: IUIGrid;

        constructor(private $filter: h5.application.AppFilter, private $timeout: ng.ITimeoutService, private storageService: h5.application.StorageService, private languageService: h5.application.LanguageService) {
            this.init();
        }

        /**
        * Initialize a Grid object with default configurations to enable/disable features
        */
        private init() {
            this.baseGrid = {
                enableGridMenu: true,
                enableRowSelection: true,
                enableFullRowSelection: false,
                modifierKeysToMultiSelect: true,
                modifierKeysToMultiSelectCells: true,
                enableRowHeaderSelection: true,
                enableSelectAll: true,
                showGridFooter: true,
                showColumnFooter: true,
                enableColumnMenus: true,
                enableSorting: true,
                enableFiltering: true,
                flatEntityAccess: true,
                fastWatch: true,
                scrollDebounce: 500,
                wheelScrollThrottle: 500,
                virtualizationThreshold: 10,
                exporterCsvFilename: "grid_data.csv",
                exporterPdfFilename: "grid_data.pdf",
                exporterFieldCallback: (grid: any, row: any, col: any, value: any) => {
                    if (col.name.indexOf('Date') > 0) {
                        value = this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                    }
                    return value;
                },
                exporterPdfCustomFormatter: (docDefinition: any) => {
                    docDefinition.styles.pageHeader = { fontSize: 10, italics: true, alignment: 'left', margin: 10 };
                    docDefinition.styles.pageFooter = { fontSize: 10, italics: true, alignment: 'right', margin: 10 };
                    return docDefinition;
                },
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfHeader: {
                    columns: [
                        { text: 'H5 Application', style: 'pageHeader' }
                    ]
                },
                exporterPdfFooter: (currentPage: number, pageCount: number) => { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                exporterPdfMaxGridWidth: 700,
                data: []
            };
        }

        /**
        * Get a copy of the base grid with default attributes
        */
        public getBaseGrid(): IUIGrid {
            return angular.copy(this.baseGrid);
        }

        /**
        * When called this function will adjust the UI Grid height based on the number of rows loaded
        * @param gridId the grid Id
        * @param noOfRows the number of rows in the grid
        * @param timeDelay the time delay to initiate resizing the grid
        * @param initialHeight the initial height to calculate the grid row(s) height, default is 150 px
        */
        public adjustGridHeight(gridId: string, noOfRows: number, timeDelay: number, initialHeight = 150) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 600 : (initialHeight + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        /**
        * Save the current state of the UI Grid in the browser memory
        * @param gridId the grid Id
        */
        public saveGridState(gridId: string, gridApi: any) {
            let gridState = gridApi.saveState.save();
            this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
        }

        /**
        * Restore the last saved state of the UI Grid
        * @param gridId the grid Id
        */
        public restoreGridState(gridId: string, gridApi: any) {
            let gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
            if (gridState) {
                this.$timeout(() => {
                    gridApi.saveState.restore(undefined, gridState);
                }, 100);
            }
        }
        
        public clearGridStates() {
            let gridIds = ["inputDataGrid", "outputDataGrid"];
            gridIds.forEach((gridId: string) => {
                this.storageService.removeLocalData('h5.app.restclient.gridState.' + gridId);
            });

        }

        public getInputDataGrid(): IUIGrid {
            let inputDataGrid: IUIGrid = angular.copy(this.baseGrid);
            let completionStatusCellTemplate = "<div class=\"ui-grid-cell-contents\"><span><span ng-if=\"row.entity['executionStatus']=='success'\" title=\"Completion Status\"><i class=\"fa fa-check font-20 h5-color-green\"></i></span><span ng-if=\"row.entity['executionStatus']=='failure'\" title=\"Completion Status\"><i class=\"fa fa-times font-20 h5-color-red\"></i></span></span></div>";
            inputDataGrid.columnDefs = [
                {
                    name: "executionStatus", displayName: this.languageService.languageConstants.get('Execution Status'), width: '130', visible: true, enableCellEdit: false, cellTemplate: completionStatusCellTemplate, exporterSuppressExport: false, pinnedLeft: true,
                    filter: {
                        type: "select",
                        selectOptions: [{ value: "success", label: 'Success' }, { value: 'failure', label: 'Failure' }],
                        condition: function(searchTerm, cellValue) {
                            return angular.equals(searchTerm, cellValue);
                        }
                    }
                },
                { name: "CONO", displayName: this.languageService.languageConstants.get('CONO'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "DIVI", displayName: this.languageService.languageConstants.get('DIVI'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "W1FACI", displayName: this.languageService.languageConstants.get('W1FACI'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "W1ITNO", displayName: this.languageService.languageConstants.get('W1ITNO'), minWidth: '100', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
               { name: "W1PCDT", displayName: this.languageService.languageConstants.get('W1PCDT'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "W1PCTP", displayName: this.languageService.languageConstants.get('W1PCTP'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "W1RORN", displayName: this.languageService.languageConstants.get('W1RORN'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "W1STRT", displayName: this.languageService.languageConstants.get('W1STRT'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "W1VASE", displayName: this.languageService.languageConstants.get('W1VASE'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "WWCSU1", displayName: this.languageService.languageConstants.get('WWCSU1'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                { name: "WWMAUM", displayName: this.languageService.languageConstants.get('WWMAUM'), minWidth: '70', visible: true, enableCellEdit: true, headerTooltip: true, cellTooltip: true, exporterSuppressExport: false, pinnedRight: true },
                
            ];
            inputDataGrid.exporterCsvFilename = "inputData_list.csv";
            inputDataGrid.exporterPdfFilename = "inputData_list.pdf";
            inputDataGrid.saveSelection = false;
            return inputDataGrid;
        }

        public getErrorListGrid(): IUIGrid {
            let ErrorListGrid: IUIGrid = angular.copy(this.baseGrid);
            ErrorListGrid.saveSelection = true;
              //   }
              ErrorListGrid.columnDefs = [
               { name: "PRNO", displayName: this.languageService.languageConstants.get('ITNO') },
               { name: "FACI", displayName: this.languageService.languageConstants.get('FACI') },
               { name: "ERRR", displayName: this.languageService.languageConstants.get('Status Message') },
               ];
            return ErrorListGrid;
        }

    }

}