/**
 * Service class to implement functions to retrieve, push data via Rest API with generic business logics if required. Will be used by the controller.
 */
module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        
        
        AddProductGroup(ITCL: string, TX40: string,TX15: string, SECU: string, CONF: string): ng.IPromise<M3.IMIResponse>;
        DelProductGroup(ITCL: string): ng.IPromise<M3.IMIResponse>;
        UpdProductGroup(ITCL: string, TX40: string,TX15: string, SECU: string, CONF: string): ng.IPromise<M3.IMIResponse>;
        
        AddItemGroup(ITGR: string, TX40: string,TX15: string, SECU: string, TECU: string, TCWP: string, TCWQ: string): ng.IPromise<M3.IMIResponse>;
        DelItemGroup(ITGR: string): ng.IPromise<M3.IMIResponse>;
        UpdItemGroup(ITGR: string, TX40: string,TX15: string, SECU: string, TECU: string, TCWP: string, TCWQ: string): ng.IPromise<M3.IMIResponse>;
        
        AddUserGroup(ACRF: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>;
        DelUserGroup(ACRF: string): ng.IPromise<M3.IMIResponse>;
        UpdUserGroup(ACRF: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>;
        
        
        AddProductLine(PDLN: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>;
        DelProductLine(PDLN: string): ng.IPromise<M3.IMIResponse>;
        UpdProductLine(PDLN: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>;
        
        
        AddAlternativeUnit(ITNO: string, AUTP: string,ALUN: string,DCCD: string, COFA: string,DMCF: string,PCOF: string, AUS1: string,AUS2: string,AUS3: string, AUS4: string,AUS5: string,AUS6: string, AUS9: string,UNMU: string,FMID: string, RESI: string,PACT: string,AUSC: string,AUSB: string, LGUN: string,CWPU: string): ng.IPromise<M3.IMIResponse>;
        DelAlternativeUnit(ITNO: string, AUTP: string,ALUN: string): ng.IPromise<M3.IMIResponse>;
        UpdAlternativeUnit(ITNO: string, AUTP: string,ALUN: string,DCCD: string, COFA: string,DMCF: string,PCOF: string, AUS1: string,AUS2: string,AUS3: string, AUS4: string,AUS5: string,AUS6: string, AUS9: string,UNMU: string,FMID: string, RESI: string,PACT: string,AUSC: string,AUSB: string, LGUN: string,CWPU: string): ng.IPromise<M3.IMIResponse>;
        
        
       AddProductFea(CONO: string, FTID: string,FTTP: string,TX30: string,TX10: string,FGRP: string, FICR: string,VAOP: string,ADDF: string, POMO: string,PRED: string,DCOO: string, UNMS: string,DCCD: string,NRMU: string, NUVF: string,NUVT: string,GRPF: string,ITGF: string, ITGT: string,ITCF: string,PRFI: string,PRII: string,PRNL: string,ATID: string): ng.IPromise<M3.IMIResponse>;
       DelProductFea(CONO: string, FTID: string,FTTP: string): ng.IPromise<M3.IMIResponse>;
       UpdateProductFea(CONO: string, FTID: string,FTTP: string,TX30: string,TX10: string,FGRP: string, FICR: string,VAOP: string,ADDF: string, POMO: string,PRED: string,DCOO: string, UNMS: string,DCCD: string,NRMU: string, NUVF: string,NUVT: string,GRPF: string,ITGF: string, ITGT: string,ITCF: string,PRFI: string,PRII: string,PRNL: string,ATID: string): ng.IPromise<M3.IMIResponse>;
       
        
        AddProductOption(CONO: string, OOPT: string,TX30: string,TX15: string,SQNU: string, XCOC: string,OGRP: string,MTCT: string, OPTN: string): ng.IPromise<M3.IMIResponse>;
        DelProductOption(CONO: string, OOPT: string,OPTN: string): ng.IPromise<M3.IMIResponse>;
        UpdateProductOption(CONO: string, OOPT: string,TX30: string,TX15: string,SQNU: string, XCOC: string,OGRP: string,MTCT: string, OPTN: string): ng.IPromise<M3.IMIResponse>;
        
        
        AddBasePrice(PRRF: string, CUCD: string,CUNO: string,FVDT: string,ITNO: string, SAPR: string,SACD: string,SPUN: string, NTCD: string, CMNO: string, FMID: string, RESI: string, MXID: string, SGGU: string, OBV1: string, OBV2: string, OBV3: string, VFDT: string, LVDT: string): ng.IPromise<M3.IMIResponse>;
        DelBasePrice(PRRF: string, CUCD: string,CUNO: string,FVDT: string,ITNO: string, OBV1: string, OBV2: string, OBV3: string, VFDT: string): ng.IPromise<M3.IMIResponse>;
        UpdBasePrice(PRRF: string, CUCD: string,CUNO: string,FVDT: string,ITNO: string, SAPR: string,SACD: string,SPUN: string, NTCD: string, CMNO: string, FMID: string, RESI: string, MXID: string, SGGU: string, OBV1: string, OBV2: string, OBV3: string, VFDT: string, LVDT: string): ng.IPromise<M3.IMIResponse>;
        
        
        AddEntityMap(FLDI: string, PGNM: string,VFLD: string,VFVA: string,SQNR: string, ISEC: string): ng.IPromise<M3.IMIResponse>;
        DelEntityMap(FLDI: string, PGNM: string,VFLD: string,VFVA: string,SQNR: string, ISEC: string): ng.IPromise<M3.IMIResponse>;
        UpdateEntityMap(FLDI: string, PGNM: string,VFLD: string,VFVA: string,SQNR: string, ISEC: string): ng.IPromise<M3.IMIResponse>;
        
        UpdLineChrgRate(CRID: string, VFDT: string,OBV1: string,OBV2: string,OBV3: string, CRAM: string,CRFA: string,CHPD: string, CUCD: string, LVDT: string, ACR9: string, FRLC: string): ng.IPromise<M3.IMIResponse>;
        AddLineChrgRate(CRID: string, VFDT: string,OBV1: string,OBV2: string,OBV3: string, CRAM: string,CRFA: string,CHPD: string, CUCD: string, LVDT: string, ACR9: string, FRLC: string): ng.IPromise<M3.IMIResponse>;
        DltLineChrgRate (CRID: string,OBV1: string,OBV2: string,OBV3: string, VFDT: string): ng.IPromise<M3.IMIResponse>;
        
        //getPDS001(FACI: string, PRNO: string,STRT: string): ng.IPromise<M3.IMIResponse>;
        getPDS001Sync(FACI: string, PRNO: string,STRT: string): ng.IPromise<M3.IMIResponse>;
        getPDS001(CONO: string,DIVI: string,W1FACI: string, W1ITNO: string,W1PCDT: string, W1STRT: string, W1PCTP: string,W1RORN: string,W1VASE: string,WWCSU1: string,WWMAUM: string): ng.IPromise<any>;
       exportData(queryStatement: string, removePrefix: boolean): ng.IPromise<M3.IMIResponse>;
    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

         public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let queryStatement = "KPALO from CMNPUS where KPUSID = '" + m3User + "' and KPPGNM = '" + programName + "' and KPDIVI = '" + division + "'";
            return this.exportData(queryStatement, false).then((val: M3.IMIResponse) => {
                if (angular.isUndefined(val.item)) {
                    queryStatement = "KPALO from CMNPUS where KPUSID = '" + m3User + "' and KPPGNM = '" + programName + "' and KPDIVI = ''";
                    return this.exportData(queryStatement, false).then((val: M3.IMIResponse) => {
                        if (angular.isUndefined(val.item)) {
                            return false;
                        } else {
                            let test = val.item.KPALO;
                            if (charAt < test.length && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }, (err: M3.IMIResponse) => {
                        return false;
                    });
                } else {
                    let test = val.item.KPALO;
                    if (charAt < test.length && '1' == test.charAt(charAt)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }, (err: M3.IMIResponse) => {
                return false;
            });
        }
        
        public exportData(queryStatement: string, removePrefix: boolean): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SEPC: "#",
                HDRS: "1",
                QERY: queryStatement
            };
            return this.restService.executeM3MIRestService("EXPORTMI", "Select", requestData, 1000).then((val: M3.IMIResponse) => {
                let responses = [];
                val.items.forEach((item, index) => {
                    if (index > 0) {
                        let response = {};
                        let replyField: string = item.REPL;
                        let fields = replyField.split("#");
                        fields.forEach((field) => {
                            let firstIndex = field.indexOf(" ");
                            let key = field.slice(0, firstIndex);
                            let value = field.slice(firstIndex).trim();
                            let newKey = removePrefix ? key.substring(2) : key;
                            response[newKey] = value;
                        });
                        responses.push(response);
                    }
                });
                val.items = responses;
                val.item = responses[0];
                return val;
            });
        }
        
        public AddProductGroup(ITCL: string, TX40: string,TX15: string, SECU: string, CONF: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITCL: ITCL,
                TX40: TX40,
                TX15: TX15,
                SECU: SECU,
                CONF: CONF
            };
            return this.restService.executeM3MIRestService("CRS035MI", "AddProductGroup", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        
         public UpdProductGroup(ITCL: string, TX40: string,TX15: string, SECU: string, CONF: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITCL: ITCL,
                TX40: TX40,
                TX15: TX15,
                SECU: SECU,
                CONF: CONF
            };
            return this.restService.executeM3MIRestService("CRS035MI", "UpdProductGroup", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelProductGroup(ITCL: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITCL: ITCL
            };
            return this.restService.executeM3MIRestService("CRS035MI", "DelProductGroup", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddItemGroup(ITGR: string, TX40: string,TX15: string, SECU: string, TECU: string, TCWP: string, TCWQ: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITGR: ITGR,
                TX40: TX40,
                TX15: TX15,
                SECU: SECU,
                TECU: TECU,
                TCWP: TCWP,
                TCWQ: TCWQ
            };
            return this.restService.executeM3MIRestService("CRS025MI", "AddItemGroup", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public UpdItemGroup(ITGR: string, TX40: string,TX15: string, SECU: string, TECU: string, TCWP: string, TCWQ: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITGR: ITGR,
                TX40: TX40,
                TX15: TX15,
                SECU: SECU,
                TECU: TECU,
                TCWP: TCWP,
                TCWQ: TCWQ
            };
            return this.restService.executeM3MIRestService("CRS025MI", "UpdItemGroup", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelItemGroup(ITGR: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITGR: ITGR
            };
            return this.restService.executeM3MIRestService("CRS025MI", "DelItemGroup", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddUserGroup(ACRF: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ACRF: ACRF,
                TX40: TX40,
                TX15: TX15
            };
            return this.restService.executeM3MIRestService("CRS335MI", "AddCtrlObj", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public UpdUserGroup(ACRF: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ACRF: ACRF,
                TX40: TX40,
                TX15: TX15
            };
            return this.restService.executeM3MIRestService("CRS335MI", "UpdCtrlObj", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelUserGroup(ACRF: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ACRF: ACRF
            };
            return this.restService.executeM3MIRestService("CRS335MI", "DltCtrlObj", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddProductLine(PDLN: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PDLN: PDLN,
                TX40: TX40,
                TX15: TX15
            };
            return this.restService.executeM3MIRestService("CRS099MI", "AddProductLine", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public UpdProductLine(PDLN: string, TX40: string,TX15: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PDLN: PDLN,
                TX40: TX40,
                TX15: TX15
            };
            return this.restService.executeM3MIRestService("CRS099MI", "UpdProductLine", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelProductLine(PDLN: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PDLN: PDLN
            };
            return this.restService.executeM3MIRestService("CRS099MI", "DltProductLine", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddProductOption(CONO: string, OOPT: string,TX30: string,TX15: string,SQNU: string, XCOC: string,OGRP: string,MTCT: string, OPTN: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                OOPT: OOPT,
                TX30: TX30,
                TX15: TX15,
                SQNU: SQNU,
                XCOC: XCOC,
                OGRP: OGRP,
                MTCT: MTCT,
                OPTN: OPTN
            };
            return this.restService.executeM3MIRestService("PDS050MI", "Add", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public UpdateProductOption(CONO: string, OOPT: string,TX30: string,TX15: string,SQNU: string, XCOC: string,OGRP: string,MTCT: string, OPTN: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                OOPT: OOPT,
                TX30: TX30,
                TX15: TX15,
                SQNU: SQNU,
                XCOC: XCOC,
                OGRP: OGRP,
                MTCT: MTCT,
                OPTN: OPTN
            };
            return this.restService.executeM3MIRestService("PDS050MI", "Update", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelProductOption(CONO: string, OOPT: string,OPTN: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                OOPT: OOPT,
                OPTN: OPTN
            };
            return this.restService.executeM3MIRestService("PDS050MI", "Delete", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddAlternativeUnit(ITNO: string, AUTP: string,ALUN: string,DCCD: string, COFA: string,DMCF: string,PCOF: string, AUS1: string,AUS2: string,AUS3: string, AUS4: string,AUS5: string,AUS6: string, AUS9: string,UNMU: string,FMID: string, RESI: string,PACT: string,AUSC: string,AUSB: string, LGUN: string,CWPU: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITNO: ITNO,
                AUTP: AUTP,
                ALUN: ALUN,
                DCCD: DCCD,
                COFA: COFA,
                DMCF: DMCF,
                PCOF: PCOF,
                AUS1: AUS1,
                AUS2: AUS2,
                AUS3: AUS3,
                AUS4: AUS4,
                AUS5: AUS5,
                AUS6: AUS6,
                AUS9: AUS9,
                UNMU: UNMU,
                FMID: FMID,
                RESI: RESI,
                PACT: PACT,
                AUSC: AUSC,
                AUSB: AUSB,
                LGUN: LGUN,
                CWPU: CWPU
                
            };
            return this.restService.executeM3MIRestService("MMS015MI", "Add", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public UpdAlternativeUnit(ITNO: string, AUTP: string,ALUN: string,DCCD: string, COFA: string,DMCF: string,PCOF: string, AUS1: string,AUS2: string,AUS3: string, AUS4: string,AUS5: string,AUS6: string, AUS9: string,UNMU: string,FMID: string, RESI: string,PACT: string,AUSC: string,AUSB: string, LGUN: string,CWPU: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITNO: ITNO,
                AUTP: AUTP,
                ALUN: ALUN,
                DCCD: DCCD,
                COFA: COFA,
                DMCF: DMCF,
                PCOF: PCOF,
                AUS1: AUS1,
                AUS2: AUS2,
                AUS3: AUS3,
                AUS4: AUS4,
                AUS5: AUS5,
                AUS6: AUS6,
                AUS9: AUS9,
                UNMU: UNMU,
                FMID: FMID,
                RESI: RESI,
                PACT: PACT,
                AUSC: AUSC,
                AUSB: AUSB,
                LGUN: LGUN,
                CWPU: CWPU
                
            };
            return this.restService.executeM3MIRestService("MMS015MI", "Upd", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelAlternativeUnit(ITNO: string, AUTP: string,ALUN: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
               ITNO: ITNO,
                AUTP: AUTP,
                ALUN: ALUN
            };
            return this.restService.executeM3MIRestService("MMS015MI", "Dlt", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddProductFea(CONO: string, FTID: string,FTTP: string,TX30: string,TX10: string,FGRP: string, FICR: string,VAOP: string,ADDF: string, POMO: string,PRED: string,DCOO: string, UNMS: string,DCCD: string,NRMU: string, NUVF: string,NUVT: string,GRPF: string,ITGF: string, ITGT: string,ITCF: string,PRFI: string,PRII: string,PRNL: string,ATID: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                FTID: FTID,
                FTTP: FTTP,
                TX30: TX30,
                TX10: TX10,
                FGRP: FGRP,
                FICR: FICR,
                VAOP: VAOP,
                ADDF: ADDF,
                POMO: POMO,
                DCOO: DCOO,
                UNMS: UNMS,
                DCCD: DCCD,
                NRMU: NRMU,
                NUVF: NUVF,
                NUVT: NUVT,
                GRPF: GRPF,
                ITGF: ITGF,
                ITGT: ITGT,
                ITCF: ITCF,
                PRFI: PRFI,
                PRII: PRII,
                PRNL: PRNL,
                ATID: ATID
            };
            return this.restService.executeM3MIRestService("PDS055MI", "Add", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public UpdateProductFea(CONO: string, FTID: string,FTTP: string,TX30: string,TX10: string,FGRP: string, FICR: string,VAOP: string,ADDF: string, POMO: string,PRED: string,DCOO: string, UNMS: string,DCCD: string,NRMU: string, NUVF: string,NUVT: string,GRPF: string,ITGF: string, ITGT: string,ITCF: string,PRFI: string,PRII: string,PRNL: string,ATID: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                FTID: FTID,
                FTTP: FTTP,
                TX30: TX30,
                TX10: TX10,
                FGRP: FGRP,
                FICR: FICR,
                VAOP: VAOP,
                ADDF: ADDF,
                POMO: POMO,
                DCOO: DCOO,
                UNMS: UNMS,
                DCCD: DCCD,
                NRMU: NRMU,
                NUVF: NUVF,
                NUVT: NUVT,
                GRPF: GRPF,
                ITGF: ITGF,
                ITGT: ITGT,
                ITCF: ITCF,
                PRFI: PRFI,
                PRII: PRII,
                PRNL: PRNL,
                ATID: ATID
            };
            return this.restService.executeM3MIRestService("PDS055MI", "Update", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelProductFea(CONO: string, FTID: string,FTTP: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
               CONO: CONO,
                FTID: FTID,
                FTTP: FTTP
            };
            return this.restService.executeM3MIRestService("PDS055MI", "Delete", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getPDS001Sync(FACI: string, PRNO: string,STRT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                FACI: FACI,
                PRNO: PRNO,
                STRT: STRT
            };
            return this.restService.executeM3MIRestService("PDS001MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getPDS001(CONO: string,DIVI: string,W1FACI: string, W1ITNO: string,W1PCDT: string, W1STRT: string, W1PCTP: string,W1RORN: string,W1VASE: string,WWCSU1: string,WWMAUM: string): ng.IPromise<any>{
            let requestData = {
                FACI: W1FACI,
                PRNO: W1ITNO,
                STRT: W1STRT
            };
            return this.restService.executeM3MIRestService("PDS001MI", "Get", requestData).then((val: M3.IMIResponse) => { 
                
                let STRT = "";
                let totalCost = 0;
                let gpPercentage = 0;
                val.items.forEach((item) => {
                    STRT = item.STRT;
                });
                let response = {
                    CONO: CONO,
                    DIVI: DIVI,
                    W1FACI: W1FACI,
                    W1ITNO: W1ITNO,
                    W1PCDT: W1PCDT,
                    W1STRT: STRT,
                    W1PCTP: W1PCTP,
                    W1RORN: W1RORN,
                    W1VASE: W1VASE,
                    WWCSU1: WWCSU1,
                    WWMAUM: WWMAUM
                };

                return response; 
            
            }, (err: M3.IMIResponse) => {

                let response = {
                    CONO: CONO,
                    DIVI: DIVI,
                    W1FACI: W1FACI,
                    W1ITNO: W1ITNO,
                    W1PCDT: W1PCDT,
                    W1STRT: "",
                    W1PCTP: W1PCTP,
                    W1RORN: W1RORN,
                    W1VASE: W1VASE,
                    WWCSU1: WWCSU1,
                    WWMAUM: WWMAUM
                };
                return response;   
            
            });
        }


       public AddBasePrice(PRRF: string, CUCD: string,CUNO: string,FVDT: string,ITNO: string, SAPR: string,SACD: string,SPUN: string, NTCD: string, CMNO: string, FMID: string, RESI: string, MXID: string, SGGU: string, OBV1: string, OBV2: string, OBV3: string, VFDT: string, LVDT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PRRF: PRRF,
                CUCD: CUCD,
                CUNO: CUNO,
                FVDT: FVDT,
                ITNO: ITNO,
                SAPR: SAPR,
                SACD: SACD,
                SPUN: SPUN,
                NTCD: NTCD,
                CMNO: CMNO,
                FMID: FMID,
                RESI: RESI,
                MXID: MXID,
                SGGU: SGGU,
                OBV1: OBV1,
                OBV2: OBV2,
                OBV3: OBV3,
                VFDT: VFDT,
                LVDT: LVDT
            };
            return this.restService.executeM3MIRestService("OIS017MI", "AddBasePrice", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelBasePrice(PRRF: string, CUCD: string,CUNO: string,FVDT: string,ITNO: string, OBV1: string, OBV2: string, OBV3: string, VFDT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
               PRRF: PRRF,
                CUCD: CUCD,
                CUNO: CUNO,
                FVDT: FVDT,
                ITNO: ITNO,
                OBV1: OBV1,
                OBV2: OBV2,
                OBV3: OBV3,
                VFDT: VFDT
            };
            return this.restService.executeM3MIRestService("OIS017MI", "DelBasePrice", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
       public UpdBasePrice(PRRF: string, CUCD: string,CUNO: string,FVDT: string,ITNO: string, SAPR: string,SACD: string,SPUN: string, NTCD: string, CMNO: string, FMID: string, RESI: string, MXID: string, SGGU: string, OBV1: string, OBV2: string, OBV3: string, VFDT: string, LVDT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PRRF: PRRF,
                CUCD: CUCD,
                CUNO: CUNO,
                FVDT: FVDT,
                ITNO: ITNO,
                SAPR: SAPR,
                SACD: SACD,
                SPUN: SPUN,
                NTCD: NTCD,
                CMNO: CMNO,
                FMID: FMID,
                RESI: RESI,
                MXID: MXID,
                SGGU: SGGU,
                OBV1: OBV1,
                OBV2: OBV2,
                OBV3: OBV3,
                VFDT: VFDT,
                LVDT: LVDT
            };
            return this.restService.executeM3MIRestService("OIS017MI", "UpdBasePrice", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public UpdLineChrgRate(CRID: string, VFDT: string,OBV1: string,OBV2: string,OBV3: string, CRAM: string,CRFA: string,CHPD: string, CUCD: string, LVDT: string, ACR9: string, FRLC: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CRID: CRID,
                VFDT: VFDT,
                OBV1: OBV1,
                OBV2: OBV2,
                OBV3: OBV3,
                CRAM: CRAM,
                CRFA: CRFA,
                CHPD: CHPD,
                CUCD: CUCD,
                LVDT: LVDT,
                ACR9: ACR9,
                FRLC: FRLC
            };
            return this.restService.executeM3MIRestService("CRS275MI", "UpdLineChrgRate", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddLineChrgRate(CRID: string, VFDT: string,OBV1: string,OBV2: string,OBV3: string, CRAM: string,CRFA: string,CHPD: string, CUCD: string, LVDT: string, ACR9: string, FRLC: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CRID: CRID,
                VFDT: VFDT,
                OBV1: OBV1,
                OBV2: OBV2,
                OBV3: OBV3,
                CRAM: CRAM,
                CRFA: CRFA,
                CHPD: CHPD,
                CUCD: CUCD,
                LVDT: LVDT,
                ACR9: ACR9,
                FRLC: FRLC
            };
            return this.restService.executeM3MIRestService("CRS275MI", "AddLineChrgRate", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public DltLineChrgRate(CRID: string,OBV1: string,OBV2: string,OBV3: string, VFDT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CRID: CRID,
                OBV1: OBV1,
                OBV2: OBV2,
                OBV3: OBV3,
                VFDT: VFDT
            };
            return this.restService.executeM3MIRestService("CRS275MI", "DltLineChrgRate", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        

        public getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then((val: M3.IMIResponse) => { return val; });
        }

       
        
        public getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
    public startOnDisturbance(terminalNumber: string, cardNumber: string, reportingNumber: string, disturbanceType: string, clockDate: string, clockTime: string, resource: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                TENR: terminalNumber,
                CANO: cardNumber,
                WOSQ: reportingNumber,
                DICE: disturbanceType,
                SDAT: clockDate,
                STTE: clockTime,
                MSNO: resource
            };
            return this.restService.executeM3MIRestService("PMS420MI", "StartDisturb", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public stopOnDisturbance(terminalNumber: string, cardNumber: string, reportingNumber: string, disturbanceType: string, clockDate: string, clockTime: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                TENR: terminalNumber,
                CANO: cardNumber,
                WOSQ: reportingNumber,
                DICE: disturbanceType,
                SDAT: clockDate,
                STTE: clockTime
            };
            return this.restService.executeM3MIRestService("PMS420MI", "StopDisturb", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public startWorkOnOperation(terminalNumber: string, cardNumber: string, reportingNumber: string, workGroup: string, clockDate: string, clockTime: string, productionLotNumber: string, resource: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                TENR: terminalNumber,
                CANO: cardNumber,
                WOSQ: reportingNumber,
                TMNO: workGroup,
                SDAT: clockDate,
                STTE: clockTime,
                PLNO: productionLotNumber,
                MSNO: resource
            };
            return this.restService.executeM3MIRestService("PMS420MI", "StartWorkOp", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public stopWorkOnOperation(terminalNumber: string, cardNumber: string, reportingNumber: string, manufacturedQuantity: string, scrapQuantityAltUnit: string, rejectedReason: string, workGroup: string, manualCompletionFlag: string, clockDate: string, clockTime: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                TENR: terminalNumber,
                CANO: cardNumber,
                WOSQ: reportingNumber,
                MAQA: manufacturedQuantity,
                SCQA: scrapQuantityAltUnit,
                SCRE: rejectedReason,
                TMNO: workGroup,
                REND: manualCompletionFlag,
                SDAT: clockDate,
                STTE: clockTime
            };
            return this.restService.executeM3MIRestService("PMS420MI", "StopWorkOp", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public startWorkOnSetup(terminalNumber: string, cardNumber: string, reportingNumber: string, workGroup: string, clockDate: string, clockTime: string, productionLotNumber: string, resource: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                TENR: terminalNumber,
                CANO: cardNumber,
                WOSQ: reportingNumber,
                TMNO: workGroup,
                SDAT: clockDate,
                STTE: clockTime,
                PLNO: productionLotNumber,
                MSNO: resource
            };
            return this.restService.executeM3MIRestService("PMS420MI", "StartWorkSetup", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public stopWorkSetup(terminalNumber: string, cardNumber: string, reportingNumber: string, workGroup: string, clockDate: string, clockTime: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                TENR: terminalNumber,
                CANO: cardNumber,
                WOSQ: reportingNumber,
                TMNO: workGroup,
                SDAT: clockDate,
                STTE: clockTime
            };
            return this.restService.executeM3MIRestService("PMS420MI", "StopWorkSetup", requestData).then((val: M3.IMIResponse) => { return val; });
        }
    
    public getLines(company: string, FACI: string, PLGR: string, FRDT: string, TODT: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                FACI: FACI,
                PLGR: PLGR,
                 FRDT: FRDT,
                TODT: TODT
            };
            return this.restService.executeM3MIRestService("PMS230MI", "Select", requestData).then((val: M3.IMIResponse) => { return val; });
        }
    
    public getMOReceivedQty(FACI: string, PRNO: string, MFNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FACI: FACI,
                PRNO: PRNO,
                MFNO: MFNO
            };
            return this.restService.executeM3MIRestService("PMS100MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }
   public getReview(FACI: string, PRNO: string, MFNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FACI: FACI,
                PRNO: PRNO,
                MFNO: MFNO
            };
            return this.restService.executeM3MIRestService("PMS100MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getOperation(FACI: string, PRNO: string, MFNO: string,OPN1: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FACI: FACI,
                PRNO: PRNO,
                MFNO: MFNO,
                OPN1: OPN1
            };
            return this.restService.executeM3MIRestService("PMS100MI", "GetOperation", requestData).then((val: M3.IMIResponse) => { return val; });
        }
    public getUPC(company: string, ALWT: string, ITNO: string, ALWQ: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                ALWT: ALWT,
                ITNO: ITNO,
                ALWQ: ALWQ
            };
            return this.restService.executeM3MIRestService("MMS025MI", "GetAlias", requestData).then((val: M3.IMIResponse) => { return val; });
        }
     public getGTIN(company: string, ALWT: string, ITNO: string, ALWQ: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                ALWT: ALWT,
                ITNO: ITNO,
                ALWQ: ALWQ
            };
            return this.restService.executeM3MIRestService("MMS025MI", "GetAlias", requestData).then((val: M3.IMIResponse) => { return val; });
        }
    
     public RptOperation(company: string, FACI: string, WOSQ: string, UMAT: string, UMAS: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                FACI: FACI,
                WOSQ: WOSQ,
                UMAT: UMAT,
                UMAS: UMAS
            };
            return this.restService.executeM3MIRestService("PMS070MI", "RptOperation", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public updOperation(company: string, FACI: string, PRNO: string, MFNO: string, OPN1: string, KIWG: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                FACI: FACI,
                PRNO: PRNO,
                MFNO: MFNO,
                OPN1: OPN1,
                KIWG: KIWG
            };
            return this.restService.executeM3MIRestService("PMS100MI", "UpdOperation", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public AddEntityMap(FLDI: string, PGNM: string,VFLD: string,VFVA: string,SQNR: string, ISEC: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                FLDI: FLDI,
                PGNM: PGNM,
                VFLD: VFLD,
                VFVA: VFVA,
                SQNR: SQNR,
                ISEC: ISEC
            };
            return this.restService.executeM3MIRestService("MNS035MI", "AddEntityMap", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public UpdateEntityMap(FLDI: string, PGNM: string,VFLD: string,VFVA: string,SQNR: string, ISEC: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                FLDI: FLDI,
                PGNM: PGNM,
                VFLD: VFLD,
                VFVA: VFVA,
                SQNR: SQNR,
                ISEC: ISEC
            };
            return this.restService.executeM3MIRestService("MNS035MI", "UpdEntityMap", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public DelEntityMap(FLDI: string, PGNM: string,VFLD: string,VFVA: string,SQNR: string, ISEC: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                FLDI: FLDI,
                PGNM: PGNM,
                VFLD: VFLD,
                VFVA: VFVA,
                SQNR: SQNR,
                ISEC: ISEC
            };
            return this.restService.executeM3MIRestService("MNS035MI", "DelEntityMap", requestData).then((val: M3.IMIResponse) => { return val; });
        }
    
    }
}