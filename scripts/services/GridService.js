/**
 * Utility service to design and control UI Grids used in the application
 */
var h5;
(function (h5) {
    var application;
    (function (application) {
        var GridService = /** @class */ (function () {
            function GridService($filter, $timeout, storageService, languageService) {
                this.$filter = $filter;
                this.$timeout = $timeout;
                this.storageService = storageService;
                this.languageService = languageService;
                this.init();
            }
            /**
            * Initialize a Grid object with default configurations to enable/disable features
            */
            GridService.prototype.init = function () {
                var _this = this;
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
                    exporterFieldCallback: function (grid, row, col, value) {
                        if (col.name.indexOf('Date') > 0) {
                            value = _this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                        }
                        return value;
                    },
                    exporterPdfCustomFormatter: function (docDefinition) {
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
                    exporterPdfFooter: function (currentPage, pageCount) { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                    exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                    exporterPdfMaxGridWidth: 700,
                    data: []
                };
            };
            /**
            * Get a copy of the base grid with default attributes
            */
            GridService.prototype.getBaseGrid = function () {
                return angular.copy(this.baseGrid);
            };
            /**
            * When called this function will adjust the UI Grid height based on the number of rows loaded
            * @param gridId the grid Id
            * @param noOfRows the number of rows in the grid
            * @param timeDelay the time delay to initiate resizing the grid
            * @param initialHeight the initial height to calculate the grid row(s) height, default is 150 px
            */
            GridService.prototype.adjustGridHeight = function (gridId, noOfRows, timeDelay, initialHeight) {
                if (initialHeight === void 0) { initialHeight = 150; }
                noOfRows = (noOfRows < 1 ? 1 : noOfRows);
                this.$timeout(function () {
                    var newHeight = noOfRows > 15 ? 600 : (initialHeight + noOfRows * 30);
                    angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
                }, timeDelay);
            };
            /**
            * Save the current state of the UI Grid in the browser memory
            * @param gridId the grid Id
            */
            GridService.prototype.saveGridState = function (gridId, gridApi) {
                var gridState = gridApi.saveState.save();
                this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
            };
            /**
            * Restore the last saved state of the UI Grid
            * @param gridId the grid Id
            */
            GridService.prototype.restoreGridState = function (gridId, gridApi) {
                var gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
                if (gridState) {
                    this.$timeout(function () {
                        gridApi.saveState.restore(undefined, gridState);
                    }, 100);
                }
            };
            GridService.prototype.clearGridStates = function () {
                var _this = this;
                var gridIds = ["inputDataGrid", "outputDataGrid"];
                gridIds.forEach(function (gridId) {
                    _this.storageService.removeLocalData('h5.app.restclient.gridState.' + gridId);
                });
            };
            GridService.prototype.getInputDataGrid = function () {
                var inputDataGrid = angular.copy(this.baseGrid);
                var completionStatusCellTemplate = "<div class=\"ui-grid-cell-contents\"><span><span ng-if=\"row.entity['executionStatus']=='success'\" title=\"Completion Status\"><i class=\"fa fa-check font-20 h5-color-green\"></i></span><span ng-if=\"row.entity['executionStatus']=='failure'\" title=\"Completion Status\"><i class=\"fa fa-times font-20 h5-color-red\"></i></span></span></div>";
                inputDataGrid.columnDefs = [
                    {
                        name: "executionStatus", displayName: this.languageService.languageConstants.get('Execution Status'), width: '130', visible: true, enableCellEdit: false, cellTemplate: completionStatusCellTemplate, exporterSuppressExport: false, pinnedLeft: true,
                        filter: {
                            type: "select",
                            selectOptions: [{ value: "success", label: 'Success' }, { value: 'failure', label: 'Failure' }],
                            condition: function (searchTerm, cellValue) {
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
            };
            GridService.prototype.getErrorListGrid = function () {
                var ErrorListGrid = angular.copy(this.baseGrid);
                ErrorListGrid.saveSelection = true;
                //   }
                ErrorListGrid.columnDefs = [
                    { name: "PRNO", displayName: this.languageService.languageConstants.get('ITNO') },
                    { name: "FACI", displayName: this.languageService.languageConstants.get('FACI') },
                    { name: "ERRR", displayName: this.languageService.languageConstants.get('Status Message') },
                ];
                return ErrorListGrid;
            };
            GridService.$inject = ["$filter", "$timeout", "StorageService", "languageService"];
            return GridService;
        }());
        application.GridService = GridService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
