/**
 * Utility service to load the localization file 'translation.json' for the selected language in the application
 */
module h5.application {

    export class LanguageService {

        static $inject = ["odinLanguageService"];

        public languageConstants: any;

        constructor(private odinLanguageService: Odin.ILanguageService) {
            
        }

        public getAppLanguage() {
            let languagePromise = this.odinLanguageService.get();

            languagePromise.then((val: Odin.ILanguage) => {
                this.languageConstants = val;
            }, (errorResponse: any) => {
                console.log("Error getting language constants " + errorResponse);
            });

            return languagePromise;

        }

        public changeAppLanguage(languageCode: string) {
            let languageOptions: Odin.ILanguageOptions = {
                application: true,
                applicationFilename: "translation.json",
                language: languageCode,
                standard: false
            };
            let languagePromise = this.odinLanguageService.load(languageOptions)
            languagePromise.then((val: Odin.ILanguage) => {
                this.languageConstants = val;
            }, (errorResponse: any) => {
                console.log("Error getting language " + errorResponse);
            });
            return languagePromise;
        }
    }

}