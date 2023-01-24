module h5.application {

   export class StorageService {
        static $inject = ["odinStorageService"];

        constructor(private odinStorageService: Odin.IStorageService) {

        }

        getAppData(key: string): any {
            return this.odinStorageService.getApplication(key, undefined);
        }
        setAppData(key: string, value: any): any {
            return this.odinStorageService.setApplication(key, value);
        }
        removeAppData(key: string): void {
            this.odinStorageService.deleteKeyApplicationStorage(key);
        }

        getSessionData(key: string): any {
            return this.odinStorageService.getSession(key, undefined);
        }
        setSessionData(key: string, value: any): any {
            return this.odinStorageService.setSession(key, value);
        }
        removeSessionData(key: string): void {
            this.odinStorageService.deleteKeySessionStorage(key);
        }

        getLocalData(key: string): any {
            return this.odinStorageService.getLocal(key, undefined);
        }
        setLocalData(key: string, value: any): any {
            return this.odinStorageService.setLocal(key, value);
        }
        removeLocalData(key: string): void {
            this.odinStorageService.deleteKeyLocalStorage(key);
        }
    }
    
}