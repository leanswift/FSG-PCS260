module h5.application {
    export interface IWebService {
      reload: boolean;
        transactionStatus: {
            programList: boolean;
            transactionList: boolean;
            executeTransactions: boolean;
        };
        collapseSel: boolean;
        collapseSection1: boolean;
        program: any;
        programList: any[];
        transaction: any;
        transactionList: any[];
        executionMethod: any;
        executionMethodList: any[];
        ignoreBlankInput: boolean;
        maxNumberOfRecords: number;
        transactionLayoutInput: any;
        transactionLayoutOutput: any;
        inputDataGrid: IUIGrid;
        ErrorListGrid: IUIGrid;
        manualInput:boolean;
        isInputDataGridReady: boolean;
        selectedInputDataGridRow: any;
        outputDataGrid: IUIGrid;
        isOutputDataGridReady: boolean; 
        executeConfirmationMessage: string;
        STRT: string;    
        inputItems: boolean;
        errorBoolean : boolean;
        errorText : string;
        csrfToken?: string;
    }
  }