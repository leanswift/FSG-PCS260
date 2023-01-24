module h5.application
{
    export interface IUIGrid
    {
        enableGridMenu?: boolean;
        enableRowSelection?: boolean;
        enableFullRowSelection?: boolean;
        modifierKeysToMultiSelect?: boolean;
        modifierKeysToMultiSelectCells?: boolean;
        enableRowHeaderSelection?: boolean;
        enableSelectAll?: boolean;
        showGridFooter?: boolean;
        showColumnFooter?: boolean;
        enableColumnMenus?: boolean;
        enableSorting?: boolean;
        enableFiltering?: boolean;
        flatEntityAccess?: boolean;
        fastWatch?: boolean;
        scrollDebounce?: number;
        wheelScrollThrottle?: number;
        virtualizationThreshold?: number;
        gridFooterTemplate?: string;
        exporterFieldCallback?: (grid: any, row: any, col: any, value: any) => any;
        exporterCsvFilename?: string;
        exporterPdfFilename?: string;
        exporterPdfCustomFormatter?: (docDefinition: any) => any;
        exporterPdfDefaultStyle?: any;
        exporterPdfHeader?: any;
        exporterPdfFooter?: any;
        exporterPdfOrientation?: string;
        exporterPdfPageSize?: string;
        exporterPdfMaxGridWidth?: number;
        exporterPdfTableStyle?: any;
        saveSelection?:boolean;
        columnDefs?: [{
            name?: string;
            width?: string;
            minWidth?: string;
            maxWidth? : string;
            displayName?: string;
            type?: string;
            aggregationType?: number;
            visible?: boolean;
            filter?: any;
            filters?: [any],
            cellTemplate?: string;
            footerCellTemplate?: string;
            cellFilter?: string;
            exporterSuppressExport?: boolean;
            sort?: {
                direction?: string;
                priority?: number;
            };
            headerCellClass?: any;
            cellClass?: any;
            footerCellClass?: any;
            enableCellEdit?: boolean;
            cellEditableCondition?: (scope: any) => boolean;
            cellTooltip?: boolean;
            headerTooltip?: boolean;
            enablePinning?: boolean;
            pinnedLeft?: boolean;
            pinnedRight?: boolean;
            editableCellTemplate?: string;
            editDropdownOptionsArray?: [any];
            enableGrouping?: boolean;
            grouping?: any;
            groupingShowAggregationMenu?: boolean;
            groupingShowGroupingMenu?: boolean;
            treeAggregationType?: string;
            treeAggregationLabel?: string;
            customTreeAggregationFn?: (aggregation: any, fieldValue: any, numValue: any, row: any) => void;
            customTreeAggregationFinalizerFn?: (aggregation: any) => void;
        }];
        importerDataAddCallback?: (grid: any, newObjects: any) => any;
        data?: any;
        onRegisterApi?: (gridApi: any) => void;
        gridApi?: any;
        showTreeExpandNoChildren?: boolean;
    }
}