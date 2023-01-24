module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            sampleDataList1: boolean;
            sampleDataList2: boolean;
            facilityDataList: boolean;
            workcenterDataList: boolean;
             facility: boolean;
            
            fromlocationDataList: boolean;
            warehouseDataList: boolean;
            containertypeDataList: boolean;
             locationtypeDataList: boolean;
            availabilityDataList: boolean;
        };
        
        userSelection: {
            facility?: any;
        };
        facilityDataList: any;
        
        
        facilityList: any;
        facilityData: any;
        workcenterList: any;
        workcenterData: any;
        //-------------------------------
        sampleDataList1: any;
        sampleData1: any;
        sampleDataList2: any;
        sampleData2: any;
        fromlocationDataList: any;
        fromlocationData: any;
        warehouseDataList: any;
        warehouseData: any;
        locationtypeDataList: any;
        locationttypeData: any;
        containertypeDataList: any;
        containertypeData: any;
        AVIL?: string;
        PLGR?: string;
        availabilityDataList: any;
        availabilityData: any;
    }
}