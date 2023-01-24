/**
 * Utility service to execute M3 MI transactions using built in MI service 
 */
module h5.application {

    export interface IOdinMIService {

        callWebService(program: string, transaction: string, requestData: any, maxReturnedRecords: number): ng.IPromise<M3.IMIResponse>;
    }

    export class OdinMIService implements IOdinMIService {

        static $inject = ["m3MIService"];
        constructor(private miService: M3.IMIService) { }

        public callWebService(program: string, transaction: string, requestData: any, maxReturnedRecords = 100, company?: string, division?: string, csrfToken?: string): ng.IPromise<M3.IMIResponse> {

            let request: M3.IMIRequest = {
                program: program,
                transaction: transaction,
                record: requestData,
                maxReturnedRecords: maxReturnedRecords,
                company: company,
                division: division,
                csrfToken: csrfToken
            };

            return this.miService.executeRequest(request).then((val: M3.IMIResponse) => { return val; });
        }
    }
}