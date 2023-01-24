/**
 * Service class to implement functions to retrieve, push data via Rest API with generic business logics if required. Will be used by the controller.
 */
var h5;
(function (h5) {
    var application;
    (function (application) {
        var AppService = /** @class */ (function () {
            function AppService(restService, $filter, $q) {
                this.restService = restService;
                this.$filter = $filter;
                this.$q = $q;
            }
            AppService.prototype.getAuthority = function (company, division, m3User, programName, charAt) {
                var _this = this;
                var queryStatement = "KPALO from CMNPUS where KPUSID = '" + m3User + "' and KPPGNM = '" + programName + "' and KPDIVI = '" + division + "'";
                return this.exportData(queryStatement, false).then(function (val) {
                    if (angular.isUndefined(val.item)) {
                        queryStatement = "KPALO from CMNPUS where KPUSID = '" + m3User + "' and KPPGNM = '" + programName + "' and KPDIVI = ''";
                        return _this.exportData(queryStatement, false).then(function (val) {
                            if (angular.isUndefined(val.item)) {
                                return false;
                            }
                            else {
                                var test = val.item.KPALO;
                                if (charAt < test.length && '1' == test.charAt(charAt)) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }, function (err) {
                            return false;
                        });
                    }
                    else {
                        var test = val.item.KPALO;
                        if (charAt < test.length && '1' == test.charAt(charAt)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }, function (err) {
                    return false;
                });
            };
            AppService.prototype.exportData = function (queryStatement, removePrefix) {
                var requestData = {
                    SEPC: "#",
                    HDRS: "1",
                    QERY: queryStatement
                };
                return this.restService.executeM3MIRestService("EXPORTMI", "Select", requestData, 1000).then(function (val) {
                    var responses = [];
                    val.items.forEach(function (item, index) {
                        if (index > 0) {
                            var response_1 = {};
                            var replyField = item.REPL;
                            var fields = replyField.split("#");
                            fields.forEach(function (field) {
                                var firstIndex = field.indexOf(" ");
                                var key = field.slice(0, firstIndex);
                                var value = field.slice(firstIndex).trim();
                                var newKey = removePrefix ? key.substring(2) : key;
                                response_1[newKey] = value;
                            });
                            responses.push(response_1);
                        }
                    });
                    val.items = responses;
                    val.item = responses[0];
                    return val;
                });
            };
            AppService.prototype.AddProductGroup = function (ITCL, TX40, TX15, SECU, CONF) {
                var requestData = {
                    ITCL: ITCL,
                    TX40: TX40,
                    TX15: TX15,
                    SECU: SECU,
                    CONF: CONF
                };
                return this.restService.executeM3MIRestService("CRS035MI", "AddProductGroup", requestData, 10000).then(function (val) { return val; });
            };
            AppService.prototype.UpdProductGroup = function (ITCL, TX40, TX15, SECU, CONF) {
                var requestData = {
                    ITCL: ITCL,
                    TX40: TX40,
                    TX15: TX15,
                    SECU: SECU,
                    CONF: CONF
                };
                return this.restService.executeM3MIRestService("CRS035MI", "UpdProductGroup", requestData, 10000).then(function (val) { return val; });
            };
            AppService.prototype.DelProductGroup = function (ITCL) {
                var requestData = {
                    ITCL: ITCL
                };
                return this.restService.executeM3MIRestService("CRS035MI", "DelProductGroup", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddItemGroup = function (ITGR, TX40, TX15, SECU, TECU, TCWP, TCWQ) {
                var requestData = {
                    ITGR: ITGR,
                    TX40: TX40,
                    TX15: TX15,
                    SECU: SECU,
                    TECU: TECU,
                    TCWP: TCWP,
                    TCWQ: TCWQ
                };
                return this.restService.executeM3MIRestService("CRS025MI", "AddItemGroup", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdItemGroup = function (ITGR, TX40, TX15, SECU, TECU, TCWP, TCWQ) {
                var requestData = {
                    ITGR: ITGR,
                    TX40: TX40,
                    TX15: TX15,
                    SECU: SECU,
                    TECU: TECU,
                    TCWP: TCWP,
                    TCWQ: TCWQ
                };
                return this.restService.executeM3MIRestService("CRS025MI", "UpdItemGroup", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelItemGroup = function (ITGR) {
                var requestData = {
                    ITGR: ITGR
                };
                return this.restService.executeM3MIRestService("CRS025MI", "DelItemGroup", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddUserGroup = function (ACRF, TX40, TX15) {
                var requestData = {
                    ACRF: ACRF,
                    TX40: TX40,
                    TX15: TX15
                };
                return this.restService.executeM3MIRestService("CRS335MI", "AddCtrlObj", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdUserGroup = function (ACRF, TX40, TX15) {
                var requestData = {
                    ACRF: ACRF,
                    TX40: TX40,
                    TX15: TX15
                };
                return this.restService.executeM3MIRestService("CRS335MI", "UpdCtrlObj", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelUserGroup = function (ACRF) {
                var requestData = {
                    ACRF: ACRF
                };
                return this.restService.executeM3MIRestService("CRS335MI", "DltCtrlObj", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddProductLine = function (PDLN, TX40, TX15) {
                var requestData = {
                    PDLN: PDLN,
                    TX40: TX40,
                    TX15: TX15
                };
                return this.restService.executeM3MIRestService("CRS099MI", "AddProductLine", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdProductLine = function (PDLN, TX40, TX15) {
                var requestData = {
                    PDLN: PDLN,
                    TX40: TX40,
                    TX15: TX15
                };
                return this.restService.executeM3MIRestService("CRS099MI", "UpdProductLine", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelProductLine = function (PDLN) {
                var requestData = {
                    PDLN: PDLN
                };
                return this.restService.executeM3MIRestService("CRS099MI", "DltProductLine", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddProductOption = function (CONO, OOPT, TX30, TX15, SQNU, XCOC, OGRP, MTCT, OPTN) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("PDS050MI", "Add", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdateProductOption = function (CONO, OOPT, TX30, TX15, SQNU, XCOC, OGRP, MTCT, OPTN) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("PDS050MI", "Update", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelProductOption = function (CONO, OOPT, OPTN) {
                var requestData = {
                    CONO: CONO,
                    OOPT: OOPT,
                    OPTN: OPTN
                };
                return this.restService.executeM3MIRestService("PDS050MI", "Delete", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddAlternativeUnit = function (ITNO, AUTP, ALUN, DCCD, COFA, DMCF, PCOF, AUS1, AUS2, AUS3, AUS4, AUS5, AUS6, AUS9, UNMU, FMID, RESI, PACT, AUSC, AUSB, LGUN, CWPU) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("MMS015MI", "Add", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdAlternativeUnit = function (ITNO, AUTP, ALUN, DCCD, COFA, DMCF, PCOF, AUS1, AUS2, AUS3, AUS4, AUS5, AUS6, AUS9, UNMU, FMID, RESI, PACT, AUSC, AUSB, LGUN, CWPU) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("MMS015MI", "Upd", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelAlternativeUnit = function (ITNO, AUTP, ALUN) {
                var requestData = {
                    ITNO: ITNO,
                    AUTP: AUTP,
                    ALUN: ALUN
                };
                return this.restService.executeM3MIRestService("MMS015MI", "Dlt", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddProductFea = function (CONO, FTID, FTTP, TX30, TX10, FGRP, FICR, VAOP, ADDF, POMO, PRED, DCOO, UNMS, DCCD, NRMU, NUVF, NUVT, GRPF, ITGF, ITGT, ITCF, PRFI, PRII, PRNL, ATID) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("PDS055MI", "Add", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdateProductFea = function (CONO, FTID, FTTP, TX30, TX10, FGRP, FICR, VAOP, ADDF, POMO, PRED, DCOO, UNMS, DCCD, NRMU, NUVF, NUVT, GRPF, ITGF, ITGT, ITCF, PRFI, PRII, PRNL, ATID) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("PDS055MI", "Update", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelProductFea = function (CONO, FTID, FTTP) {
                var requestData = {
                    CONO: CONO,
                    FTID: FTID,
                    FTTP: FTTP
                };
                return this.restService.executeM3MIRestService("PDS055MI", "Delete", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPDS001Sync = function (FACI, PRNO, STRT) {
                var requestData = {
                    FACI: FACI,
                    PRNO: PRNO,
                    STRT: STRT
                };
                return this.restService.executeM3MIRestService("PDS001MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPDS001 = function (CONO, DIVI, W1FACI, W1ITNO, W1PCDT, W1STRT, W1PCTP, W1RORN, W1VASE, WWCSU1, WWMAUM) {
                var requestData = {
                    FACI: W1FACI,
                    PRNO: W1ITNO,
                    STRT: W1STRT
                };
                return this.restService.executeM3MIRestService("PDS001MI", "Get", requestData).then(function (val) {
                    var STRT = "";
                    var totalCost = 0;
                    var gpPercentage = 0;
                    val.items.forEach(function (item) {
                        STRT = item.STRT;
                    });
                    var response = {
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
                }, function (err) {
                    var response = {
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
            };
            AppService.prototype.AddBasePrice = function (PRRF, CUCD, CUNO, FVDT, ITNO, SAPR, SACD, SPUN, NTCD, CMNO, FMID, RESI, MXID, SGGU, OBV1, OBV2, OBV3, VFDT, LVDT) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("OIS017MI", "AddBasePrice", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelBasePrice = function (PRRF, CUCD, CUNO, FVDT, ITNO, OBV1, OBV2, OBV3, VFDT) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("OIS017MI", "DelBasePrice", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdBasePrice = function (PRRF, CUCD, CUNO, FVDT, ITNO, SAPR, SACD, SPUN, NTCD, CMNO, FMID, RESI, MXID, SGGU, OBV1, OBV2, OBV3, VFDT, LVDT) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("OIS017MI", "UpdBasePrice", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdLineChrgRate = function (CRID, VFDT, OBV1, OBV2, OBV3, CRAM, CRFA, CHPD, CUCD, LVDT, ACR9, FRLC) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("CRS275MI", "UpdLineChrgRate", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddLineChrgRate = function (CRID, VFDT, OBV1, OBV2, OBV3, CRAM, CRFA, CHPD, CUCD, LVDT, ACR9, FRLC) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("CRS275MI", "AddLineChrgRate", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DltLineChrgRate = function (CRID, OBV1, OBV2, OBV3, VFDT) {
                var requestData = {
                    CRID: CRID,
                    OBV1: OBV1,
                    OBV2: OBV2,
                    OBV3: OBV3,
                    VFDT: VFDT
                };
                return this.restService.executeM3MIRestService("CRS275MI", "DltLineChrgRate", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getDivisionList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getFacilityList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then(function (val) { return val; });
            };
            AppService.prototype.startOnDisturbance = function (terminalNumber, cardNumber, reportingNumber, disturbanceType, clockDate, clockTime, resource) {
                var requestData = {
                    TENR: terminalNumber,
                    CANO: cardNumber,
                    WOSQ: reportingNumber,
                    DICE: disturbanceType,
                    SDAT: clockDate,
                    STTE: clockTime,
                    MSNO: resource
                };
                return this.restService.executeM3MIRestService("PMS420MI", "StartDisturb", requestData).then(function (val) { return val; });
            };
            AppService.prototype.stopOnDisturbance = function (terminalNumber, cardNumber, reportingNumber, disturbanceType, clockDate, clockTime) {
                var requestData = {
                    TENR: terminalNumber,
                    CANO: cardNumber,
                    WOSQ: reportingNumber,
                    DICE: disturbanceType,
                    SDAT: clockDate,
                    STTE: clockTime
                };
                return this.restService.executeM3MIRestService("PMS420MI", "StopDisturb", requestData).then(function (val) { return val; });
            };
            AppService.prototype.startWorkOnOperation = function (terminalNumber, cardNumber, reportingNumber, workGroup, clockDate, clockTime, productionLotNumber, resource) {
                var requestData = {
                    TENR: terminalNumber,
                    CANO: cardNumber,
                    WOSQ: reportingNumber,
                    TMNO: workGroup,
                    SDAT: clockDate,
                    STTE: clockTime,
                    PLNO: productionLotNumber,
                    MSNO: resource
                };
                return this.restService.executeM3MIRestService("PMS420MI", "StartWorkOp", requestData).then(function (val) { return val; });
            };
            AppService.prototype.stopWorkOnOperation = function (terminalNumber, cardNumber, reportingNumber, manufacturedQuantity, scrapQuantityAltUnit, rejectedReason, workGroup, manualCompletionFlag, clockDate, clockTime) {
                var requestData = {
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
                return this.restService.executeM3MIRestService("PMS420MI", "StopWorkOp", requestData).then(function (val) { return val; });
            };
            AppService.prototype.startWorkOnSetup = function (terminalNumber, cardNumber, reportingNumber, workGroup, clockDate, clockTime, productionLotNumber, resource) {
                var requestData = {
                    TENR: terminalNumber,
                    CANO: cardNumber,
                    WOSQ: reportingNumber,
                    TMNO: workGroup,
                    SDAT: clockDate,
                    STTE: clockTime,
                    PLNO: productionLotNumber,
                    MSNO: resource
                };
                return this.restService.executeM3MIRestService("PMS420MI", "StartWorkSetup", requestData).then(function (val) { return val; });
            };
            AppService.prototype.stopWorkSetup = function (terminalNumber, cardNumber, reportingNumber, workGroup, clockDate, clockTime) {
                var requestData = {
                    TENR: terminalNumber,
                    CANO: cardNumber,
                    WOSQ: reportingNumber,
                    TMNO: workGroup,
                    SDAT: clockDate,
                    STTE: clockTime
                };
                return this.restService.executeM3MIRestService("PMS420MI", "StopWorkSetup", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getLines = function (company, FACI, PLGR, FRDT, TODT) {
                var requestData = {
                    CONO: company,
                    FACI: FACI,
                    PLGR: PLGR,
                    FRDT: FRDT,
                    TODT: TODT
                };
                return this.restService.executeM3MIRestService("PMS230MI", "Select", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getMOReceivedQty = function (FACI, PRNO, MFNO) {
                var requestData = {
                    FACI: FACI,
                    PRNO: PRNO,
                    MFNO: MFNO
                };
                return this.restService.executeM3MIRestService("PMS100MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getReview = function (FACI, PRNO, MFNO) {
                var requestData = {
                    FACI: FACI,
                    PRNO: PRNO,
                    MFNO: MFNO
                };
                return this.restService.executeM3MIRestService("PMS100MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getOperation = function (FACI, PRNO, MFNO, OPN1) {
                var requestData = {
                    FACI: FACI,
                    PRNO: PRNO,
                    MFNO: MFNO,
                    OPN1: OPN1
                };
                return this.restService.executeM3MIRestService("PMS100MI", "GetOperation", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getUPC = function (company, ALWT, ITNO, ALWQ) {
                var requestData = {
                    CONO: company,
                    ALWT: ALWT,
                    ITNO: ITNO,
                    ALWQ: ALWQ
                };
                return this.restService.executeM3MIRestService("MMS025MI", "GetAlias", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getGTIN = function (company, ALWT, ITNO, ALWQ) {
                var requestData = {
                    CONO: company,
                    ALWT: ALWT,
                    ITNO: ITNO,
                    ALWQ: ALWQ
                };
                return this.restService.executeM3MIRestService("MMS025MI", "GetAlias", requestData).then(function (val) { return val; });
            };
            AppService.prototype.RptOperation = function (company, FACI, WOSQ, UMAT, UMAS) {
                var requestData = {
                    CONO: company,
                    FACI: FACI,
                    WOSQ: WOSQ,
                    UMAT: UMAT,
                    UMAS: UMAS
                };
                return this.restService.executeM3MIRestService("PMS070MI", "RptOperation", requestData).then(function (val) { return val; });
            };
            AppService.prototype.updOperation = function (company, FACI, PRNO, MFNO, OPN1, KIWG) {
                var requestData = {
                    CONO: company,
                    FACI: FACI,
                    PRNO: PRNO,
                    MFNO: MFNO,
                    OPN1: OPN1,
                    KIWG: KIWG
                };
                return this.restService.executeM3MIRestService("PMS100MI", "UpdOperation", requestData).then(function (val) { return val; });
            };
            AppService.prototype.AddEntityMap = function (FLDI, PGNM, VFLD, VFVA, SQNR, ISEC) {
                var requestData = {
                    FLDI: FLDI,
                    PGNM: PGNM,
                    VFLD: VFLD,
                    VFVA: VFVA,
                    SQNR: SQNR,
                    ISEC: ISEC
                };
                return this.restService.executeM3MIRestService("MNS035MI", "AddEntityMap", requestData).then(function (val) { return val; });
            };
            AppService.prototype.UpdateEntityMap = function (FLDI, PGNM, VFLD, VFVA, SQNR, ISEC) {
                var requestData = {
                    FLDI: FLDI,
                    PGNM: PGNM,
                    VFLD: VFLD,
                    VFVA: VFVA,
                    SQNR: SQNR,
                    ISEC: ISEC
                };
                return this.restService.executeM3MIRestService("MNS035MI", "UpdEntityMap", requestData).then(function (val) { return val; });
            };
            AppService.prototype.DelEntityMap = function (FLDI, PGNM, VFLD, VFVA, SQNR, ISEC) {
                var requestData = {
                    FLDI: FLDI,
                    PGNM: PGNM,
                    VFLD: VFLD,
                    VFVA: VFVA,
                    SQNR: SQNR,
                    ISEC: ISEC
                };
                return this.restService.executeM3MIRestService("MNS035MI", "DelEntityMap", requestData).then(function (val) { return val; });
            };
            AppService.$inject = ["RestService", "$filter", "$q"];
            return AppService;
        }());
        application.AppService = AppService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
