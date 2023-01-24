/// <reference path="../jquery/jquery.d.ts" />
/// <reference path="../angularjs/angular.d.ts" />
/// <reference path="../angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
declare module Odin {
    class Version {
        major: number;
        minor: number;
        patch: number;
        full: any;
        constructor(major?: number, minor?: number, patch?: number);
    }
    class ArrayUtil {
        static remove(array: any[], item: any): void;
        static removeByProperty(array: any[], name: string, value: any): boolean;
        static indexByProperty(array: any[], name: string, value: any): number;
        static itemByProperty(array: any[], name: string, value: any): any;
        static containsByProperty(array: any[], name: string, value: any): boolean;
        static contains(array: any[], value: any): boolean;
        static last(array: any[]): any;
    }
    interface ILogAppender {
        (level: number, text: string, ex?: any): any;
    }
    class Log {
        static levelFatal: number;
        static levelError: number;
        static levelWarning: number;
        static levelInfo: number;
        static levelDebug: number;
        static levelTrace: number;
        static level: number;
        static isConsoleLogEnabled: boolean;
        private static prefixes;
        private static appenders;
        static addAppender(appender: ILogAppender): void;
        static removeAppender(appender: ILogAppender): void;
        private static getTime();
        static getLogEntry(level: number, text: string, ex?: any): string;
        private static log(currentLevel, level, text, ex?);
        static setDefault(): void;
        static fatal(text: string, ex?: any): void;
        static error(text: string, ex?: any): void;
        static warning(text: string, ex?: any): void;
        static info(text: string, ex?: any): void;
        static isDebug(): boolean;
        static setDebug(): void;
        static debug(text: string, ex?: any): void;
        static isTrace(): boolean;
        static setTrace(): void;
        static trace(text: string, ex?: any): void;
    }
    interface INumberFormatOptions {
        separator?: string;
    }
    class NumUtil {
        private static getLocaleSeparator();
        private static defaultSeparator;
        private static defaultOptions;
        static getDefaultOptions(): INumberFormatOptions;
        static setDefaultOptions(options: INumberFormatOptions): void;
        static isNumber(n: any): boolean;
        static getInt(s: string, defaultValue?: number): number;
        static format(value: any, options?: INumberFormatOptions): string;
        static pad(num: number, length: number): string;
        static hasOnlyIntegers(s: string): boolean;
    }
    class StringUtil {
        static isNullOrEmpty(value: string): boolean;
        static startsWith(value: string, prefix: string): boolean;
        static endsWith(value: string, suffix: string): boolean;
        static trimEnd(value: string): string;
        static format(...args: any[]): string;
    }
    class DateUtil {
        static isDate(date: any): boolean;
    }
    class Util {
        private static chars;
        static getBoolean(s: string, defaultValue?: boolean): boolean;
        static getUuid(prefix: string): string;
        static hasValue(anyObject: any): boolean;
        static isUndefined(anyObject: any): boolean;
        static random(stringLength?: number): string;
        static isIframe(): boolean;
    }
    class ErrorTypes {
        static http: string;
        static parse: string;
    }
    interface IErrorState {
        error?: any;
        errorMessage?: string;
        errorCode?: string;
        hasError(): boolean;
    }
    class ErrorState implements IErrorState {
        hasError(): boolean;
    }
    interface ILanguage extends IErrorState {
        get(id: string): string;
        format(...args: any[]): string;
    }
    class Language extends ErrorState implements ILanguage {
        constructor();
        get(id: string): string;
        format(...args: any[]): string;
    }
    interface IUrlOverride {
        host: string;
        url: string;
    }
    interface IInstanceEvent<T> {
        on(handler: {
            (data?: T): void;
        }): any;
        off(handler: {
            (data?: T): void;
        }): any;
    }
    class InstanceEvent<T> implements IInstanceEvent<T> {
        private handlers;
        on(handler: {
            (data?: T): void;
        }): void;
        off(handler: {
            (data?: T): void;
        }): void;
        raise(data?: T): void;
    }
    interface IEventInfo {
        eventName: string;
        onEvent: Function;
        sourceName?: string;
        targetName?: string;
        alwaysReceive?: boolean;
    }
    interface IEvent {
        eventName?: string;
        sourceName?: string;
        targetName?: string;
        parameter?: any;
    }
    enum ComponentState {
        Busy = 1,
        Active = 2,
    }
    interface IComponentOptions {
        scope?: ng.IScope;
        name?: string;
        events?: IEventInfo[];
        isVisualState?: boolean;
        visualState?: IVisualState;
    }
    interface IComponentContext {
        raise(event: IEvent): any;
        raiseEvent(eventName: string, eventParameter?: any): any;
        getState(name?: string): ComponentState;
        setState(state: ComponentState, name?: string): any;
        setActiveState(name?: string): any;
        setBusyState(name?: string): any;
        stateChanged(): IInstanceEvent<ComponentState>;
        isBusy(name?: string): boolean;
        isActive(name?: string): boolean;
        activeChanged(): IInstanceEvent<boolean>;
        isVisible(name?: string): boolean;
        setVisible(isVisible: boolean, name?: string): any;
        visibleChanged(): IInstanceEvent<boolean>;
        getPendingEvent(): IEvent;
        setPendingEvent(e: IEvent): any;
    }
    interface ILanguageOptions {
        language?: string;
        useClientLanguage?: boolean;
        supportedLanguages?: string[];
        defaultLanguage?: string;
        standard?: boolean;
        application?: boolean;
        applicationFilename?: string;
    }
    interface IApplicationInfo {
        name: string;
        description?: string;
        version?: string;
        id?: string;
    }
    interface IApplication extends IApplicationInfo {
    }
    interface IStartupOptions {
        application?: IApplicationInfo;
        frameworkPath?: string;
        languageOptions?: ILanguageOptions;
        urlOverrides?: {
            [id: string]: Odin.IUrlOverride;
        };
    }
    interface IStartupError extends IMessage {
    }
    interface IStartupState {
        setReady(): void;
        setError(error: IStartupError): void;
        getError(): IStartupError;
        hasError(): boolean;
        showErrorMessage(header?: string, message?: string): void;
    }
    interface IVisualState {
        isActive: boolean;
        activate(): void;
        deactivate(): void;
        activeChanged(): IInstanceEvent<boolean>;
    }
    class Framework {
        private static path;
        private static app;
        static version: Version;
        static getApplication(rootScope: ng.IRootScopeService): IApplication;
        static setApplication(rootScope: ng.IRootScopeService, application: IApplication): void;
        static getPath(): string;
        static setPath(path: string): void;
    }
    class ApplicationBase {
        module: ng.IModule;
        startupServiceName: string;
        startupService: IStartupService;
        name: string;
        description: string;
        version: string;
        id: string;
        frameworkPath: string;
        languageOptions: ILanguageOptions;
        urlOverrides: {
            [key: string]: IUrlOverride;
        };
        constructor();
        onStart(): void;
        onReady(state: IStartupState): void;
        onError(state: IStartupState): void;
        addUrlOverride(key: string, host: string, url: string): void;
        getStartupOptions(): IStartupOptions;
        validate(): void;
        startService(startupService: IStartupService): void;
        onRun(): void;
        start(): void;
    }
    interface IFormatSevice {
        parseDate(date: string, format?: string): Date;
        getDateFormat(): string;
        setDateFormat(format: string): void;
        getDecimalSeparator(): string;
        setDecimalSeparator(separator: string): void;
    }
    class FormatService implements IFormatSevice {
        private $locale;
        static $inject: string[];
        private datetimeFormats;
        private monthNames;
        private dayNames;
        private dateFormat;
        constructor($locale: ng.ILocaleService);
        static add(m: ng.IModule): void;
        getDecimalSeparator(): string;
        setDecimalSeparator(separator: string): void;
        setDateFormat(format: string): void;
        getDateFormat(): string;
        parseDate(val: string, format: string): Date;
        private getInteger(s, startPoint, minLength, maxLength);
    }
    interface IDataProviderService {
        register(key: string, provider: IDataProvider): void;
        get(key: string, options?: any): ng.IPromise<any>;
    }
    class DataProviderService implements IDataProviderService {
        private q;
        static $inject: string[];
        private resultCache;
        private providerDictionary;
        private awaitingProviderDictionary;
        constructor(q: ng.IQService);
        static add(m: ng.IModule): void;
        register(key: string, provider: IDataProvider): void;
        get(key: string, options?: any): ng.IPromise<any>;
    }
    interface IDataProvider {
        get(options?: any): ng.IPromise<any>;
    }
    class DataProviderDirective {
        static add(m: ng.IModule): void;
        private static create(rootScope, dataProviderService);
    }
}
declare module Odin {
    class Templates {
        static cacheTemplatesInModule(): void;
    }
}
declare module Odin {
    interface IFocus {
        focusById(id: string): void;
        focusByName(name: string): void;
    }
    class FocusDirective implements IFocus {
        private $rootScope;
        private $timeout;
        constructor($rootScope: ng.IScope, $timeout: ng.ITimeoutService);
        focusById(id: string): void;
        focusByName(name: string): void;
        static add(m: ng.IModule): void;
    }
}
declare module Odin {
    enum MessageType {
        Information = 0,
        Warning = 1,
        Error = 2,
    }
    enum DialogButtons {
        Ok = 1,
        OkCancel = 2,
        YesNo = 3,
        YesNoCancel = 4,
    }
    enum DialogResult {
        Ok = 1,
        Cancel = 2,
        Yes = 3,
        No = 4,
    }
    interface IMessage {
        message?: string;
        header?: string;
        type?: MessageType;
        messageCode?: string;
    }
    class Message implements IMessage {
        message: string;
        header: string;
        messageType: MessageType;
        messageCode: any;
    }
    interface IMessageServiceOptions {
        statusBarName: string;
        defaultHeader: string;
    }
    interface IDialogOptions extends IMessage {
        header?: string;
        message?: string;
        buttons?: DialogButtons;
        type?: MessageType;
        primaryText?: string;
        secondaryText?: string;
        cancelText?: string;
        modalSettings?: ng.ui.bootstrap.IModalSettings;
    }
    interface IMessageService {
        show(messageOptions: IMessage): ng.IPromise<any>;
        showStatus(message: string, type?: MessageType): any;
        showDialog(dialogOptions: IDialogOptions): ng.IPromise<any>;
        showInfo(message: string, header?: string): ng.IPromise<any>;
        showWarning(message: string, header?: string): ng.IPromise<any>;
        showError(message: string, header?: string): ng.IPromise<any>;
        messageAdded(): IInstanceEvent<IMessage>;
        configure(options: IMessageServiceOptions): any;
    }
    class MessageService implements IMessageService {
        private rootScope;
        private modal;
        private q;
        private languageService;
        private options;
        private defaultServiceOptions;
        private messageEvent;
        private defaultSettings;
        private defaultOptions;
        static $inject: string[];
        constructor(rootScope: ng.IRootScopeService, modal: ng.ui.bootstrap.IModalService, q: ng.IQService, languageService: Odin.ILanguageService);
        static add(m: ng.IModule): void;
        private getDefaultHeader();
        show(message: IMessage): ng.IPromise<any>;
        private configureButtons(options);
        showStatus(message: string, type?: MessageType): void;
        showInfo(message: string, header?: string): ng.IPromise<any>;
        showWarning(message: string, header?: string): ng.IPromise<any>;
        showError(message: string, header?: string): ng.IPromise<any>;
        configure(options: IMessageServiceOptions): void;
        messageAdded(): IInstanceEvent<IMessage>;
        private raiseMessageAdded(message);
        showDialog(options: IDialogOptions): ng.IPromise<any>;
    }
    class GridDoubleClickPlugin {
        private scope;
        private grid;
        constructor();
        init(scope: any, grid: any): void;
        private addEvents();
        private onDoubleClick();
    }
    class FilterGridPlugin {
        private scope;
        private grid;
        constructor();
        init(scope: any, grid: any): void;
        private filterListner(searchQuery);
    }
}
declare module Odin {
    class KeyboardDirective {
        private static keysByCode;
        private static capitaliseFirstLetter(s);
        private static onKeyEvent($parse, mode, scope, elm, attrs);
        private static onKeyEventToUpper(scope, elm, attrs);
        private static doGetCaretPosition(inputElement);
        private static doSetCaretPosition(inputElement, caretPos);
        private static forceUpper(event, o);
        static add(m: ng.IModule): void;
    }
    class MouseDirective {
        static add(m: ng.IModule): void;
    }
    class NumberDirective {
        static add(m: ng.IModule): void;
        private static getCaretPosition(element);
        private static setCaretPosition(element, position);
    }
}
declare module Odin.Mashup {
    interface IEvent {
        sourceName?: string;
        targetName?: string;
        eventName?: string;
        parameters?: IEventParameter[];
        conditions?: any[];
        key?: string;
        sourceEventName?: string;
        targetEventName?: string;
        tag?: any;
        debug?: boolean;
        alwaysLoad?: boolean;
        activate?: any;
        visibilityVisible?: any;
        visibilityHidden?: any;
        visibilityCollapsed?: any;
        linkBaseUri?: any;
        linkUri?: any;
        linkIsExternal?: boolean;
        supportsRefresh?: boolean;
    }
    interface IEventMessage {
        data: IEvent;
        type: string;
        id?: string;
    }
    interface IEventParameter {
        sourceKey?: string;
        targetKey?: string;
        value?: any;
        defaultValue?: any;
        enableSubstitution?: boolean;
        trim?: boolean;
        trimOption?: any;
        type?: any;
    }
    interface IInstance {
        send(msg: IEvent): any;
        receive(): any;
    }
    interface ICtrl extends ng.IScope {
        odinMashupInstance: IInstance;
        sendEvent(value: string): void;
    }
    class InstanceCtrl {
        private scope;
        static $inject: string[];
        constructor(scope: ICtrl);
        sendEvent(target: string, sourceEvent: string, parameters: Array<IEventParameter>): void;
    }
    class Instance {
        send(msg: IEvent): void;
        receive: InstanceEvent<IEvent>;
    }
    class Directive {
        private name;
        static add(m: ng.IModule): void;
        private create();
    }
    class ControlDirective {
        private name;
        private static createIFrame();
        static add(m: ng.IModule): void;
    }
    interface IEventInfo {
        sourceEventName: string;
        parameters?: IEventParameter[];
        onEvent?: (event: IEvent) => void;
    }
    interface IInitialize {
        type?: string;
        data?: IInitializeData;
    }
    interface IInitializeData {
        url?: string;
        isDebug?: boolean;
        webControl?: IWebControl;
    }
    interface IWebControl {
        id?: string;
        url?: string;
        application?: string;
        control?: string;
        parameters?: IWebControlParameter[];
    }
    interface IWebControlParameter {
        key?: string;
        value?: string;
        isReadOnly?: boolean;
        tag?: any;
        koDataBindPath?: any;
    }
    interface IControlOptions {
        webControl: IWebControl;
        url?: string;
        initializeOptions?: IInitialize;
    }
    interface IControlFrameOptions {
        onFrame(iframe: HTMLIFrameElement): void;
        getOptions(): IControlOptions;
    }
    enum ControlStatus {
        Pending = 0,
        Initializing = 1,
        Initialized = 2,
        Running = 3,
        Busy = 4,
        Failed = 5,
    }
    class ControlCtrl {
        private registeredEvents;
        private iframe;
        private status;
        private controlId;
        private isInitialized;
        private controlOptions;
        options: IControlFrameOptions;
        static $inject: string[];
        constructor(scope: ng.IScope);
        getOptions(): IControlFrameOptions;
        private onFrame(iframe);
        onGetOptions(): IControlOptions;
        registerEvents(events: IEventInfo[]): void;
        onInitialized(): void;
        private postMessage(event);
        raiseEvent(event: IEvent): boolean;
        private raiseGetValuesEvent(eventRegistration);
        private getEventInfo(name);
        private receiveMessage(message);
    }
}
declare module Odin {
    class StartupState implements IStartupState {
        private rootScope;
        private applicationService;
        private messageService;
        static ready: string;
        private logPrefix;
        private isReady;
        private error;
        constructor(rootScope: ng.IRootScopeService, applicationService: IApplicationService, messageService: IMessageService);
        setReady(): void;
        setError(error: IStartupError): void;
        getError(): IStartupError;
        hasError(): boolean;
        showErrorMessage(header?: string, message?: string): void;
    }
    interface IEventEx extends IEvent {
        eventInfo?: IEventInfo;
    }
    interface IEventInfoEx extends IEventInfo {
        context?: IComponentContext;
        options?: IComponentOptions;
        isVisualState?: boolean;
    }
    interface ILanguageService {
        get(): ng.IPromise<ILanguage>;
        tryGet(): ILanguage;
        load(options: ILanguageOptions): ng.IPromise<ILanguage>;
    }
    interface IStorageService {
        getLocal<T>(key: string, defaultValue?: T): T;
        setLocal<T>(key: string, value: T): any;
        getSession<T>(key: string, defaultValue?: T): T;
        setSession<T>(key: string, value: T): any;
        getApplication<T>(key: string, defaultValue?: T): T;
        setApplication<T>(key: string, value: T): any;
        clearLocalStorage(): void;
        clearApplicationStorage(): void;
        clearSessionStorage(): void;
        deleteKeyLocalStorage(key: string): void;
        deleteKeyApplicationStorage(key: string): void;
        deleteKeySessionStorage(key: string): void;
    }
    interface IBrowseOptions {
        header?: string;
        message?: string;
        gridOptions?: any;
        items?: any[];
        templateUrl?: any;
    }
    class BrowseConstants {
        static browseGridTemplateName: string;
        static browseGenericTemplateName: string;
        static modalMessageTemplate: string;
    }
    interface IBrowseService {
        browse(options: IBrowseOptions): ng.IPromise<any>;
    }
    class BrowseService implements IBrowseService {
        private modal;
        q: ng.IQService;
        static $inject: string[];
        constructor(modal: ng.ui.bootstrap.IModalService, q: ng.IQService);
        static add(m: ng.IModule): void;
        browse(options: IBrowseOptions): ng.IPromise<any>;
    }
    class BrowseUtil {
        static selectedItemKeyInternal: string;
        static setSelectedItem(scope: ng.IScope, item: any): void;
        static close(scope: ng.IScope, item: any): void;
        private static setSelectedItemInternal(scope, item);
    }
    interface IBrowseResult {
        selectedItem: any;
        close(item: any): void;
    }
    interface IDefaultBrowseScope extends ng.IScope {
        options: IBrowseOptions;
        items?: any[];
        gridOptions: any;
        templateUrl?: any;
        odinBrowseResult?: IBrowseResult;
        ok(): void;
        cancel(): void;
        close(item: any): void;
    }
    enum ApplicationState {
        Pending = 0,
        Active = 1,
        Busy = 2,
        Error = 3,
    }
    interface IApplicationService {
        setState(state: ApplicationState): void;
        getState(): ApplicationState;
        setActive(): void;
        isActive(): boolean;
        setBusy(): void;
        isBusy(): boolean;
    }
    interface IComponentService {
        rootScope: ng.IScope;
        raise(event: IEvent): void;
        raiseEvent(eventName: string, eventParameter?: any): void;
        register(options: IComponentOptions): IComponentContext;
        setComponentState(state: ComponentState, name: string): void;
        getContext(name: string): IComponentContext;
        setBusyIndicator(scope: ng.IScope, isBusy: boolean): void;
    }
    class VisualState implements IVisualState {
        private scope;
        static scopeName: string;
        private static counter;
        isActive: boolean;
        isActivated: boolean;
        private children;
        private id;
        private activeEvent;
        constructor(scope: ng.IScope);
        activeChanged(): IInstanceEvent<boolean>;
        private updateScope();
        private addChild(child);
        private isActiveInScope(scope);
        private attachToParent(scope);
        activate(): void;
        deactivate(): void;
        private activateChild();
        private deactivateChild();
    }
    class VisualStateCtrl {
        private scope;
        static $inject: string[];
        private visualState;
        constructor(scope: ng.IScope);
        static add(m: ng.IModule): void;
        activate(): void;
        deactivate(): void;
    }
    class TabCtrl {
        private scope;
        static $inject: string[];
        private visualState;
        constructor(scope: ng.IScope);
        static add(m: ng.IModule): void;
        select(): void;
        deselect(): void;
    }
    class NavbarDirective {
        static add(m: ng.IModule): void;
    }
    interface IBaseCtrlOptions {
    }
    interface IListCtrlOptions extends IBaseCtrlOptions {
        scopeNameGridOptions?: string;
        scopeNameGridData?: string;
        gridOptions?: any;
    }
    class DefaultListCtrlOptions implements IListCtrlOptions {
        scopeNameGridOptions: string;
        scopeNameGridData: string;
        configureGrid: boolean;
        static get(options?: IListCtrlOptions): IListCtrlOptions;
    }
    class BaseCtrl {
        private baseCtrlOptions;
        rootScope: ng.IScope;
        baseScope: ng.IScope;
        componentService: Odin.IComponentService;
        odinService: IService;
        private prefixBaseCtrl;
        private componentContext;
        private isInitialized;
        constructor(scope: ng.IScope, odinService: IService, baseCtrlOptions?: IBaseCtrlOptions);
        ctrlInit(): void;
        registerComponent(options?: Odin.IComponentOptions): IComponentContext;
        getComponentContext(): IComponentContext;
        onActive(isActive: boolean): void;
        setBusy(): void;
        isBusy(): boolean;
        setActive(): void;
        onReady(): void;
    }
    class DefaultBrowseCtrl extends BaseCtrl {
        scope: IDefaultBrowseScope;
        private modalInstance;
        private service;
        private browseOptions;
        static $inject: string[];
        private gridApi;
        constructor(scope: IDefaultBrowseScope, modalInstance: any, service: Odin.IService, browseOptions: Odin.IBrowseOptions);
        private closeWithSelected();
        onReady(): void;
        afterSelectionChange(rowItem: any): void;
        static add(m: ng.IModule): void;
    }
    class ExpanderDirective {
        private name;
        private scopeName;
        static add(m: ng.IModule): void;
        private create($compile);
    }
    class FormElementDirective {
        static add(m: ng.IModule): void;
    }
    class CheckboxDirective {
        static add(m: ng.IModule): void;
    }
    class RadioDirective {
        static add(m: ng.IModule): void;
    }
    class SwitchDirective {
        static add(m: ng.IModule): void;
    }
    class InputDirective {
        static add(m: ng.IModule): void;
    }
    class ExpandableFooterDirective {
        static add(m: ng.IModule): void;
    }
    interface IExpandableFooterParameters {
        isExpanded: boolean;
        useOverlay: boolean;
        headerTemplateUrl: string;
        contentTemplateUrl: string;
    }
    class SplashScreenDirective {
        static add(m: ng.IModule): void;
    }
    class BusyIndicatorDirective {
        static add(m: ng.IModule): void;
    }
    class CircularTileDirective {
        static add(m: ng.IModule): void;
    }
    interface IService {
        rootScope: ng.IScope;
        componentService: IComponentService;
        applicationService: IApplicationService;
        messageService: IMessageService;
        languageService: ILanguageService;
        storageService: IStorageService;
        browseService: IBrowseService;
        formatService: IFormatSevice;
    }
    interface IStartupService {
        service: Odin.IService;
        setReady(): any;
        start(options?: IStartupOptions): ng.IPromise<IStartupState>;
        getUrlOverride(key: string): string;
        isLocalhost(): boolean;
    }
    class StartupService implements IStartupService {
        rootScope: ng.IRootScopeService;
        q: ng.IQService;
        private location;
        service: Odin.IService;
        static $inject: string[];
        logPrefix: string;
        options: IStartupOptions;
        private _isReady;
        constructor(rootScope: ng.IRootScopeService, q: ng.IQService, location: ng.ILocationService, service: Odin.IService);
        static add(m: ng.IModule): void;
        isLocalhost(): boolean;
        getUrlOverride(key: string): string;
        isReady(): boolean;
        raiseReady(): string;
        setReady(): void;
        resolveReady(defered: ng.IDeferred<Odin.IStartupState>): void;
        rejectReady(defered: ng.IDeferred<Odin.IStartupState>, errorState: Odin.IErrorState): void;
        initialize(options: IStartupOptions): void;
        start(options?: IStartupOptions): ng.IPromise<Odin.IStartupState>;
    }
    class ToUpperDirective {
        static add(m: ng.IModule): void;
        private static addCustomConverters(ngModel);
        private static parse(text);
        private static format(text);
    }
}
declare module M3 {
    interface ITask {
        name?: string;
        link?: string;
    }
    interface IUserResponse {
        m3User?: string;
        principalUser?: string;
        sessionId: string;
        userContext?: any;
    }
    interface IMessage {
        m3Command?: string;
        m3Parameter?: any;
        m3Source?: string;
        m3MessageId?: string;
        m3Response?: any;
    }
    class Constants {
        static scopeNameFormCtrl: string;
        static dateFormat: string;
    }
    class M3ErrorTypes {
        static MI: string;
        static FORM: string;
    }
    enum BrowseServiceType {
        MI = 1,
    }
    interface IBrowseConfiguration {
        name: string;
        header?: string;
        message?: string;
        gridOptions?: any;
        serviceType: BrowseServiceType;
        data?: any;
        serviceConfigration?: any;
    }
    class BrowseConfiguration implements IBrowseConfiguration {
        name: string;
        header: string;
        message: string;
        gridOptions: any;
        serviceType: BrowseServiceType;
        data: any;
        serviceConfigration: any;
    }
    interface IBrowseService {
        register(configuration: IBrowseConfiguration): void;
        browse(name: string, data: any): ng.IPromise<any>;
    }
    class Configuration {
        private static url;
        static languageMap: {
            CS: string;
            CZ: string;
            DE: string;
            DK: string;
            ES: string;
            FI: string;
            FR: string;
            GB: string;
            HU: string;
            IT: string;
            JP: string;
            NL: string;
            NO: string;
            PL: string;
            PT: string;
            SE: string;
            TR: string;
        };
        static overrideUrl(url: string): void;
        static getUrl(): string;
        static getLanguageTag(m3Language: string): string;
        static getDateFormat(m3Format: string): string;
    }
}
declare module M3 {
    interface IMIMetadataMap {
        [name: string]: IMIMetadataInfo;
    }
    interface IMIOptions {
        company?: string;
        division?: string;
        excludeEmptyValues?: boolean;
        maxReturnedRecords?: number;
        tag?: any;
        includeMetadata?: boolean;
        typedOutput?: boolean;
    }
    interface IMIRequest extends IMIOptions {
        program?: string;
        transaction?: string;
        record?: any;
        outputFields?: string[];
        csrfToken?: string;
    }
    interface IMIResponse extends Odin.IErrorState {
        program?: string;
        transaction?: string;
        item?: any;
        items?: any[];
        errorField?: string;
        errorType?: string;
        metadata: IMIMetadataMap;
        tag?: any;
        requestData?: any;
    }
    class MIResponse extends Odin.ErrorState implements IMIResponse {
        program: string;
        transaction: string;
        tag: any;
        item: MIRecord;
        items: MIRecord[];
        errorField: string;
        errorType: string;
        error: any;
        errorMessage: string;
        errorCode: string;
        metadata: IMIMetadataMap;
    }
    class MIAccess {
        static logPrefix: string;
        static createUrl(baseUrl: string, request: IMIRequest): string;
        private static parseMessage(response, content);
        static parseResponse(request: IMIRequest, content: any): IMIResponse;
        private static getTypedValue(name, value, metadata);
        private static parseValue(value, metadataInfo);
        private static getMetadata(content);
    }
    class MIRecord {
        metadata: IMIMetadataMap;
        setNumberString(name: string, value: number): void;
        setNumber(name: string, value: string): void;
        setDateString(name: string, value: Date): void;
        setDate(name: string, value: Date): void;
        setString(name: string, value: string): void;
    }
    class MIUtil {
        static toMIFormat(value: any): string;
        static createUpdateRecord(originalValues: MIRecord, newRecord: any, fieldNames: string[], mandatoryFields: string[]): MIRecord;
        static getDateFormatted(date: Date): string;
        static getDate(yyyymmdd: string): Date;
        static metadataToArray(metadataMap: IMIMetadataMap): IMIMetadataInfo[];
    }
    class MIConstants {
        static datePattern: string;
        static decimalSeparator: string;
    }
    interface IMIMetadataInfo {
        name: string;
        type: MIDataType;
        length: number;
        description: string;
        isNumeric(): boolean;
        isDate(): boolean;
        isString(): boolean;
    }
    class MIMetadataInfo implements IMIMetadataInfo {
        name: string;
        type: MIDataType;
        length: number;
        description: string;
        constructor(name: string, length: number, typeString: string, description: string);
        isNumeric(): boolean;
        isDate(): boolean;
        isString(): boolean;
        private setType(value);
    }
    enum MIDataType {
        String = 0,
        Numeric = 1,
        Date = 2,
    }
    interface INameValue {
        name: string;
        value: string;
    }
    enum MIOptionsType {
        Array = 0,
        Dictionary = 1,
    }
    interface IMIDataProviderOptions extends IMIRequest {
        type?: MIOptionsType;
        dictionaryKey?: string;
        outputMap?: {};
    }
    class MIDataProvider implements Odin.IDataProvider {
        private miService;
        private miOptions;
        static $inject: string[];
        constructor(miService: IMIService, miOptions: IMIDataProviderOptions);
        get(options?: any): ng.IPromise<any>;
        private onResponseDoMappings(response);
        private onResponseCreateDirectory(response);
    }
}
declare module M3 {
    interface IMIService {
        overrideUrl(url: string): void;
        executeRequest(request: IMIRequest): ng.IPromise<IMIResponse>;
        execute(program: string, transaction: string, record?: any, outputfields?: string[]): ng.IPromise<IMIResponse>;
        odinService: Odin.IService;
        q: ng.IQService;
        timeout: ng.ITimeoutService;
    }
    interface IMIDetailScope extends ng.IScope {
        item?: any;
    }
    class MICtrl extends Odin.BaseCtrl {
        miService: IMIService;
        private prefixCtrl;
        isUpdate: boolean;
        static injectDefault: string[];
        outputFields: string[];
        defaultOptions: IMIOptions;
        constructor(scope: ng.IScope, miService: IMIService, options?: Odin.IBaseCtrlOptions);
        onResponse(response: IMIResponse): void;
        onError(response: IMIResponse): void;
        execute(program: string, transaction: string, record?: any, outputFields?: string[]): ng.IPromise<IMIResponse>;
        executeUpdate(program: string, transaction: string, record?: any, outputFields?: string[]): ng.IPromise<IMIResponse>;
        executeRequest(request: IMIRequest): ng.IPromise<IMIResponse>;
        executeUpdateRequest(request: IMIRequest): ng.IPromise<IMIResponse>;
    }
    class MIDetailCtrl extends MICtrl {
        scope: IMIDetailScope;
        miService: IMIService;
        private prefixDetailCtrl;
        detailScope: IMIDetailScope;
        constructor(scope: IMIDetailScope, miService: IMIService, options?: Odin.IBaseCtrlOptions);
        clear(): void;
        onResponse(response: IMIResponse): void;
    }
    interface IMIListCtrlOptions extends Odin.IListCtrlOptions {
        enableGridInfiniteScroll?: boolean;
    }
    class MIListCtrl extends MICtrl {
        scope: ng.IScope;
        miService: IMIService;
        private prefixListCtrl;
        listScope: ng.IScope;
        private pendingItem;
        private isPaging;
        private isEndOfList;
        private pendingEvent;
        private listOptions;
        private gridApi;
        constructor(scope: ng.IScope, miService: IMIService);
        initialize(options: IMIListCtrlOptions): void;
        private getItems();
        private setItems(items);
        getGridApi(): any;
        setGridApi(gridApi: any): void;
        executeRequest(request: IMIRequest): ng.IPromise<IMIResponse>;
        notifyScroll(): void;
        onGridScroll(lastRecord: MIRecord): IMIRequest;
        onActive(isActive: boolean): void;
        onSelectedItemChanged(item?: any): void;
        rowSelectionChanged(row: any, event?: any): void;
        clear(): void;
        onResponse(response: IMIResponse): void;
        onError(response: IMIResponse): void;
        private updateListRows(response);
        resize(): void;
    }
}
declare module M3.Form {
    class BEConstants {
        static fieldInformationCategory: string;
        static fieldNumberOfFilters: string;
        static fieldHideCommandBar: string;
    }
    class Constraint {
        isNumeric: boolean;
        isUpper: boolean;
        maxLength: number;
        maxDecimals: number;
    }
    class Position {
        top: number;
        left: number;
        width: number;
        height: number;
    }
    class ControlType {
        static label: number;
        static textBox: number;
        static checkBox: number;
        static comboBox: number;
        static datePicker: number;
        static groupBox: number;
        static button: number;
        static list: number;
        static listColumn: number;
        static getName(type: number): string;
    }
    class FormControl {
        type: number;
        name: string;
        originalName: string;
        value: string;
        fieldHelp: string;
        referenceFile: string;
        referenceField: string;
        isEnabled: boolean;
        isVisible: boolean;
        isReadDisabled: boolean;
        tabIndex: number;
        masterColumn: number;
        isSlave: boolean;
        isSpecial: boolean;
        position: Position;
        constraint: Constraint;
        constructor(type: number);
        getTypeName(): string;
        getLeft(): number;
        getTop(): number;
        getWidth(): number;
    }
    class ListColumn extends FormControl {
        index: number;
        constructor();
        fullName: string;
        columnType: string;
        category: string;
        isNumeric(): boolean;
        isDate(): boolean;
        isBool(): boolean;
        header: string;
        toolTip: string;
        positionField: FormControl;
        width: number;
        isRight: boolean;
        maxLength: number;
        maxDecimals: number;
        isUpperCase: boolean;
        aggregate: number;
        aggregateDisplayRule: number;
        aggregateUpdateRule: number;
    }
    class ListRow {
        name: string;
        columnCount: number;
        isSelected: boolean;
        isProtected: boolean;
        index: number;
        items: any[];
        subItems: any[];
    }
    class ListCell {
        name: string;
        text: string;
        isEnabled: boolean;
        isEditable: boolean;
        isHidden: boolean;
        isChecked: boolean;
        isBool: boolean;
        isUpper: boolean;
        isRight: boolean;
        isReverse: boolean;
        isHighIntensity: boolean;
        maxLength: number;
        minWidth: number;
        span: number;
    }
    class List extends FormControl {
        columns: ListColumn[];
        subColumns: ListColumn[];
        items: ListRow[];
        hasSubRows: boolean;
        isCleared: boolean;
        isScrollToEnd: boolean;
        isEnd: boolean;
        scroll: number;
        isAggregate: boolean;
        aggregateDepth: number;
        constructor();
    }
    class TextBox extends FormControl {
        isReverse: boolean;
        isHighIntensity: boolean;
        isRightAligned: boolean;
        isBrowsable: boolean;
        isFixedFont: boolean;
        isPosition: boolean;
        constructor(type?: number);
    }
    class Label extends FormControl {
        id: string;
        toolTip: string;
        isFixed: boolean;
        isAdditionalInfo: boolean;
        isEmphasized: boolean;
        isColon: boolean;
        constructor();
    }
    class Button extends FormControl {
        command: string;
        commandValue: string;
        progId: string;
        arguments: string;
        constructor();
    }
    class GroupBox extends FormControl {
        isLine: boolean;
        constructor();
    }
    class CheckBox extends FormControl {
        isChecked: boolean;
        constructor();
    }
    class ComboBoxItem {
        name: string;
        value: string;
        text: string;
        isSelected: boolean;
    }
    class ComboBox extends FormControl {
        selected: ComboBoxItem;
        command: string;
        commandValue: string;
        isEditable: boolean;
        isPosition: boolean;
        items: ComboBoxItem[];
        constructor();
    }
    class DatePicker extends TextBox {
        dateFormat: string;
        hideDateFormat: boolean;
        constructor(dateFormat: string, hideDateFormat: boolean);
    }
    class FunctionKey {
        key: string;
        text: string;
        isReverse: boolean;
    }
    class Option {
        value: string;
        text: string;
    }
    class Panel {
        name: string;
        header: string;
        description: string;
        informationCategory: string;
        hideCommandBar: boolean;
        sortingOrderComboBox: ComboBox;
        sortingOrderTextBox: TextBox;
        viewComboBox: ComboBox;
        viewTextBox: TextBox;
        controls: any;
        controlList: FormControl[];
        basicOptions: Option[];
        relatedOptions: Option[];
        list: List;
    }
    class Protocol {
        static valueTrue: string;
        static valueFalse: string;
    }
    interface IBookmark {
        program?: string;
        table?: string;
        panel?: string;
        panelSequence?: string;
        startPanel?: string;
        includeStartPanel?: boolean;
        option?: string;
        sortingOrder?: string;
        view?: string;
        focusFieldName?: string;
        keyNames?: string;
        keys?: string;
        parameters?: string;
        parameterNames?: string;
        fieldNames?: string;
        fields?: string;
        isStateless?: boolean;
        source?: string;
        automation?: string;
        automationTemplate?: string;
        requirePanel?: boolean;
        suppressConfirm?: boolean;
        values?: any;
        informationCategory?: string;
        numberOfFilters?: string;
        params?: any;
    }
    class Bookmark {
        private static nameMap;
        private static getSource(bookmark);
        private static add(params, name, value);
        private static addBool(params, name, value);
        private static addValue(str, key, value);
        private static addInformationCategory(str, bookmark);
        private static createValues(userContext, keyString, values, isKeys);
        static toUri(bookmark: IBookmark, userContext?: IUserContext): string;
        static toParams(bookmark: IBookmark, userContext: IUserContext): any;
    }
}
declare module M3.Form {
    class XmlNames {
        static elementRoot: string;
        static elementResult: string;
        static elementControlData: string;
        static elementSessionData: string;
        static elementSessionId: string;
        static elementInstanceId: string;
        static elementJobId: string;
        static elementHelpUrl: string;
        static elementMomUrl: string;
        static elementUser: string;
        static elementCompany: string;
        static elementDivision: string;
        static elementVersion: string;
        static elementLanguage: string;
        static elementPanels: string;
        static elementPanel: string;
        static elementObjects: string;
        static elementPanelHeader: string;
        static elementPanelDescription: string;
        static elementEntryField: string;
        static elementCheckBox: string;
        static elementCaption: string;
        static elementComboBox: string;
        static elementButton: string;
        static elementGroupBox: string;
        static elementPluggable: string;
        static elementTextArea: string;
        static elementBarChart: string;
        static elementJGanttData: string;
        static elementList: string;
        static elementRunDialog: string;
        static elementOpenDialog: string;
        static elementCloseDialog: string;
        static elementOpenModal: string;
        static elementStateless: string;
        static elementFocus: string;
        static elementFocusOriginal: string;
        static elementFocusType: string;
        static elementBookmark: string;
        static elementSearch: string;
        static elementChangedBy: string;
        static elementModifiedDate: string;
        static elementRegisteredDate: string;
        static elementMessage: string;
        static elementMessageId: string;
        static elementMessageLevel: string;
        static elementListCell: string;
        static elementDateFormat: string;
        static elementDecimalSeparator: string;
        static elementComboBoxValue: string;
        static elementPosition: string;
        static elementConstraints: string;
        static elementFunctionKeys: string;
        static elementFunctionKey: string;
        static elementBasicOptions: string;
        static elementBasicOption: string;
        static elementRelatedOptions: string;
        static elementRelatedOption: string;
        static elementSortingOrderComboBox: string;
        static elementSortingOrderEntryField: string;
        static elementViewComboBox: string;
        static elementViewEntryField: string;
        static elementVPanels: string;
        static elementP: string;
        static elementPanelSequence: string;
        static elementProgramInfo: string;
        static elementCustomization: string;
        static elementDocumentLinks: string;
        static elementDocumentLink: string;
        static attributeType: string;
        static attributeName: string;
        static attributeOriginalName: string;
        static attributeValue: string;
        static attributeHelp: string;
        static attributeCommand: string;
        static attributeAccess: string;
        static attributeStyle: string;
        static attributeJustification: string;
        static attributeProtected: string;
        static attributeSelected: string;
        static attributeScrollToEnd: string;
        static attributeEnd: string;
        static attributeTab: string;
        static attributeTop: string;
        static attributeLeft: string;
        static attributeWidth: string;
        static attributeHeight: string;
        static attributeClear: string;
        static attributeAdditionalInfo: string;
        static attributeMaxLength: string;
        static attributeMaxDecimals: string;
        static attributeUpperCase: string;
        static attributeStartPanel: string;
        static attributePanelIndex: string;
        static attributeDescription: string;
        static attributeList: string;
        static attributeSupportsSearch: string;
        static attributeSupportsBookmarks: string;
        static attributeReferenceFile: string;
        static attributeReferenceField: string;
        static attributeArgument: string;
        static attributeProgId: string;
        static attributeMasterColumn: string;
        static attributeCategory: string;
        static valueWriteDisabled: string;
        static valueWriteEnabled: string;
        static valueHidden: string;
        static valueReadDisabled: string;
        static valueStyleReverse: string;
        static valueStyleReverseIntensity: string;
        static valueStyleHighIntensity: string;
        static valueDecimal: string;
        static valueChecked: string;
        static valueFocusTypeListCell: string;
        static valueFocusTypeListRow: string;
        static categoryBool: string;
        static categoryDate: string;
    }
    class XmlUtil {
        static getAttribute(node: Node, name: string): string;
        static hasAttribute(node: Node, name: string): boolean;
        static getBoolAttribute(node: Node, name: string, defaultValue: boolean): boolean;
        static getIntAttribute(node: Node, name: string, defaultValue: number): number;
        static selectNodes(parent: Node, path: string): Node[];
        private static select(parent, path, nodes);
        static selectNode(parent: Node, name: string): Node;
        static getElementInt(parent: Node, name: string, defaultValue: number): number;
        static getElement(parent: Node, name: string): string;
        static getText(parent: Node): string;
    }
    class ParserInfo {
        parseLayout: boolean;
        parseConstraint: boolean;
    }
    class Parser {
        private static domParser;
        private static counter;
        private uniqueNames;
        static parseXml(content: string): Document;
        private parseName(node);
        private generateName(prefix, left, top);
        private parseSession(node, element);
        static selectRoot(document: Document): Node;
        private parseReponse(content);
        private parsePosition(parentNode);
        private parseAccess(node, element);
        private parseConstraints(parentNode);
        private parseStyle(node, element);
        private parseElement(node, element);
        private parseInputElement(node, element);
        private parseButton(node);
        private parseGroupBox(node);
        private parseLabel(node);
        private parseCheckBox(node);
        private parseComboBox(node, isPosition);
        private parseTextBox(node, isPosition, panelElement);
        private getStringTrimEnd(node);
        private getRowIndex(rowName);
        private parseListRow(rowNode, listElement);
        private parseSubRows(rowNode, listElement, row);
        private parseListRows(listNode, listElement);
        private parseSubColumns(listNode, listElement);
        private parseColumnName(columnNode, columnElement);
        private parseHeader(columnNode, column);
        private parseColumn(columnNode, index);
        private parseColumns(listNode, listElement);
        private parseList(responseElement, listNode);
        private parseObjects(nodes, response, panelElement);
        private parsePanel(node, response);
        private parseBasicOptions(node, element);
        private parseRelatedOptions(node, element);
        private parseOptions(node, optionNodeName);
        static parse(content: string): Response;
    }
}
declare module M3.Form {
    interface IRequest {
        commandType?: string;
        commandValue?: string;
        sessionId?: string;
        instanceId?: string;
        params?: any;
    }
    interface IResponse extends Odin.IErrorState {
        request?: IRequest;
        result?: number;
        sessionId?: string;
        instanceId?: string;
        message?: string;
        language?: string;
        counter?: number;
        panel?: Panel;
        panels?: Panel[];
        hasPanel(): boolean;
    }
    class Response extends Odin.ErrorState implements IResponse {
        request: IRequest;
        result: number;
        sessionId: string;
        instanceId: string;
        message: string;
        language: string;
        counter: number;
        panel: Panel;
        panels: Panel[];
        hasPanel(): boolean;
    }
    interface ITranslationItem {
        file?: string;
        key: string;
        text?: string;
        language?: string;
        target?: string;
        targetName?: string;
    }
    class TranslationItem implements ITranslationItem {
        key: string;
        file: string;
        constructor(key: string, file?: string);
    }
    interface ITranslationRequest {
        language?: string;
        items?: ITranslationItem[];
    }
    interface ITranslationResponse {
        language?: string;
        items?: ITranslationItem[];
    }
    interface IFormControlInfo {
        control?: FormControl;
        label?: Label;
        additionalInfo: Label;
    }
    class FormUtil {
        static getInputId(response: IResponse, name: string): string;
        static findControlLabel(elements: FormControl[], control: FormControl): Label;
        static findAdditionalInfo(elements: FormControl[], control: FormControl): Label;
        static findControlAndLabels(response: Response, name: any): IFormControlInfo;
    }
}
declare module M3.Form {
    interface IRenderOptions {
        isGrid?: boolean;
    }
    class RenderOptions {
        static gridOptions: IRenderOptions;
        static defaultOptions: IRenderOptions;
    }
    class ControlFactory {
        static current: ControlFactory;
        cellWidth: number;
        cellHeight: number;
        private defaultOptions;
        gridWidth(x: number): number;
        setSize(element: JQuery, x?: number, y?: number): void;
        private addOptions(select, comboBox);
        span(text: string, classes?: string): JQuery;
        div(classes?: string): JQuery;
        row(): JQuery;
        form(): JQuery;
        formGroup(): JQuery;
        label(text?: string, forId?: string): JQuery;
        expander(header: string): JQuery;
        getPath(control: FormControl): string;
        private getPathCombo(control);
        addBinding(element: ng.IAugmentedJQuery, control: FormControl): void;
        create(response: IResponse, control: FormControl, isEnabled?: boolean, options?: IRenderOptions): any;
    }
    class FormGenerator extends ControlFactory {
        private gridRows;
        private fieldsToSkip;
        private maxX;
        private maxY;
        constructor();
        private reset();
        private getX(x);
        private getY(y);
        private setAbsoluteLayout(control, element);
        private setGridSize(element, x?, y?);
        private generateControl(response, control);
        private gridRow();
        private addElement(control, element, rowDivs);
        private addGridRows(parent, rowDivs);
        private isIncluded(control);
        private setRelative(element);
        private listViewRow(response);
        private createListHeader(response);
        generateList(response: IResponse, scope: ng.IScope): JQuery;
        genereateListHeader(response: IResponse): JQuery;
    }
    interface IFormScope extends ng.IScope {
        response: IResponse;
        controls: any;
        hasSession: boolean;
        isProgramOpen: boolean;
    }
    interface IDetailScope extends IFormScope {
        panel: Panel;
    }
    interface IFormCtrlOptions extends Odin.IBaseCtrlOptions {
    }
    interface IListCtrlOptions extends Odin.IListCtrlOptions {
    }
    class FormCtrl extends Odin.BaseCtrl {
        formService: M3.IFormService;
        private prefixFormCtrl;
        static injectDefault: string[];
        instanceId: string;
        userContext: IUserContext;
        formScope: IFormScope;
        pendingEvent: any;
        constructor(scope: IFormScope, formService: M3.IFormService, options?: IFormCtrlOptions);
        ctrlInit(): void;
        beginExecute(): void;
        endExecute(): void;
        hasUserContext(): boolean;
        onUserContext(userContext: IUserContext): void;
        onSession(): void;
        onError(response: M3.Form.IResponse): void;
        onResponse(response: M3.Form.IResponse): void;
        error(response: M3.Form.IResponse): void;
        close(): void;
        logoff(): void;
        private verifyContext();
        private verifyInstance();
        pressKey(key: string): void;
        private addValue(control, params);
        private getValue(control);
        private addEditable(panel, params);
        private createParams();
        executeCommand(commandType: string, commandValue: string): void;
        executeBookmark(bookmark: IBookmark): void;
    }
    class DetailCtrl extends FormCtrl {
        private detailScope;
        constructor(scope: IDetailScope, formService: M3.IFormService, options?: IFormCtrlOptions);
        openBookmark(bookmark: IBookmark): void;
        onResponse(response: Form.IResponse): void;
    }
    class ListCtrl extends FormCtrl {
        private prefixListCtrl;
        isHeaderVisible: boolean;
        isHeaderExpanded: boolean;
        private programInstance;
        private isPaging;
        private isEndOfList;
        private pendingItem;
        private listOptions;
        private gridApi;
        private panelListDictionary;
        private deregisters;
        private contextMenuOptions;
        private contextMenuRelatedOptions;
        private contextMenuStyle;
        contextMenu: {};
        private selectedListItem;
        private baseBookmark;
        private pendingBookmark;
        private isFirst;
        constructor(scope: IFormScope, formService: M3.IFormService);
        initialize(options: IListCtrlOptions, panel: any): void;
        private destroyList();
        private getItems(listName);
        private setItems(items, listName?);
        private initializeList(panel);
        private loadMoreRows();
        private onClickOption(option);
        private executeOption(option, row);
        onSelectedItemChanged(item?: any): void;
        rowSelectionChanged(row: any, event?: any): void;
        onActive(isActive: boolean): void;
        openBookmark(bookmark: IBookmark): void;
        onResponse(response: Form.IResponse): void;
        private onProgramClosed();
        private updateListRows(list);
        private createColumns(columns);
    }
    class FieldLabelDirective {
        static add(m: ng.IModule): void;
        private static update(response, $compile, scope, label, attributes);
    }
    class FieldInfoDirective {
        static add(m: ng.IModule): void;
        private static update(response, $compile, scope, label, attributes);
    }
    class FieldPresenterDirective {
        static add(m: ng.IModule): void;
        private static update(response, $compile, scope, div, attributes);
    }
    interface IDetailLayoutField {
        name: string;
        isEnabled?: boolean;
    }
    interface IDetailLayoutOptions {
        fields: IDetailLayoutField[];
        columns?: number;
        isAdditional?: boolean;
        isAllEnabled?: boolean;
    }
    class ListDirective {
        static add(m: ng.IModule): void;
        private static update(response, $compile, scope, div, attributes);
    }
    class DetailLayoutDirective {
        static add(m: ng.IModule): void;
        private static update(response, $compile, scope, div, attributes);
    }
    interface IMIBrowseScope extends ng.IScope {
        ok(): any;
        cancel(): any;
        options: any;
        gridOptions: any;
    }
    class MIBrowseCtrl extends M3.MIListCtrl {
        scope: IMIBrowseScope;
        private modalInstance;
        miService: M3.IMIService;
        private languageService;
        private browseConfiguration;
        private selectedItem;
        static $inject: string[];
        constructor(scope: IMIBrowseScope, modalInstance: any, miService: M3.IMIService, languageService: Odin.ILanguageService, browseConfiguration: IBrowseConfiguration);
        static add(m: ng.IModule): void;
        onSelectedItemChanged(item: any): void;
        onReady(): void;
        ok(): void;
        cancel(): void;
    }
    class BrowseService implements IBrowseService {
        private $modal;
        private $q;
        private miService;
        private configurations;
        private defaultSettings;
        static $inject: string[];
        constructor($modal: ng.ui.bootstrap.IModalService, $q: ng.IQService, miService: IMIService);
        static add(m: ng.IModule): void;
        register(configuration: IBrowseConfiguration): void;
        browse(name: string, data: any): ng.IPromise<any>;
    }
}
declare module M3.Form {
    interface ITranslationJob extends IRequest {
        items: ITranslationItem[];
        language: string;
        constants?: string;
    }
    interface ICommand {
        execute(type: string, value: string, params: any, onComplete: Function): any;
    }
    class Translator {
        static defaultFile: string;
        private static languages;
        private command;
        translate(request: ITranslationRequest): ITranslationJob;
        parseResponse(job: ITranslationJob, content: string): void;
        private getKey(item);
        private addToCache(language, item);
        private getLanguage(name);
        private updateItem(items, language, file, key, text);
    }
}
declare module M3 {
    interface IUserContext extends Odin.IErrorState {
        m3User?: string;
        principalUser?: string;
        company?: string;
        currentCompany?: string;
        division?: string;
        currentDivision?: string;
        language?: string;
        currentLanguage?: string;
        languageTag?: string;
        CONO?: string;
        DIVI?: string;
        LANC?: string;
        DTFM?: string;
        dateFormat?: string;
        DCFM?: string;
        TIZO?: string;
        FACI?: string;
        WHLO?: string;
        TX40?: string;
        CONM?: string;
        DFMN?: string;
        USID?: string;
        NAME?: string;
        USTA?: string;
        USTP?: string;
        EQAL?: string;
        EMAL?: string;
        numberFormatOptions?: Odin.INumberFormatOptions;
    }
    interface IUserService {
        getUserContext(): ng.IPromise<IUserContext>;
        isH5(): boolean;
        getSesssionId(): string;
        sendMessage(message: IMessage): void;
    }
    class UserContext extends Odin.ErrorState implements IUserContext {
        constructor();
        static current: IUserContext;
    }
    class UserService implements IUserService {
        private $http;
        private $q;
        private $timeout;
        private miService;
        static $inject: string[];
        private static logPrefix;
        private isUserContextAvailable;
        private m3User;
        private principalUser;
        private userContext;
        private queue;
        private isExecuting;
        private isH5Host;
        private isMessagePending;
        private sessionId;
        constructor($http: ng.IHttpService, $q: ng.IQService, $timeout: ng.ITimeoutService, miService: M3.IMIService);
        static add(m: ng.IModule): void;
        isH5(): boolean;
        getSesssionId(): string;
        private init();
        private onTimeout();
        private onMessage(data);
        private registerMessage();
        sendMessage(message: IMessage): void;
        private createErrorContext(errorMessage);
        private processQueue(isResolved);
        private rejectQueue(errrorMessage);
        private parseUser(data);
        private onGridUser(httpResponse);
        private loadUserId();
        private addAliases(context);
        private setContext(context);
        private onUserData(item);
        private createUserContext(item);
        private loadUserData();
        getUserContext(): ng.IPromise<IUserContext>;
    }
    interface IProgramInstance {
        pressKey(key: string, params?: any): ng.IPromise<Form.IResponse>;
        close(): ng.IPromise<Form.IResponse>;
        executeCommand(commandType: string, commandValue?: string, params?: any): ng.IPromise<Form.IResponse>;
    }
    class ProgramInstance implements IProgramInstance {
        formService: IFormService;
        private instanceId;
        constructor(formService: IFormService, instanceId: string);
        pressKey(key: string, params?: any): ng.IPromise<Form.IResponse>;
        close(): ng.IPromise<Form.IResponse>;
        executeCommand(commandType: string, commandValue?: string, params?: any): ng.IPromise<Form.IResponse>;
    }
    interface IFormService {
        rootScope: ng.IScope;
        timeout: ng.ITimeoutService;
        userContext: IUserContext;
        userService: IUserService;
        odinService: Odin.IService;
        launch(link: string): any;
        hasSession(): boolean;
        logon(): ng.IPromise<Form.IResponse>;
        logoff(): ng.IPromise<Form.IResponse>;
        ping(): ng.IPromise<Form.IResponse>;
        executeBookmark(bookmark: M3.Form.IBookmark): ng.IPromise<Form.Response>;
        pressKey(key: string, params?: any): ng.IPromise<Form.Response>;
        executeCommand(commandType: string, commandValue?: string, params?: any): ng.IPromise<Form.Response>;
        execute(request: Form.IRequest): ng.IPromise<Form.IResponse>;
        destroyProgram(instanceId: string): ng.IPromise<Form.IResponse>;
        translate(request: Form.ITranslationRequest): ng.IPromise<Form.ITranslationResponse>;
    }
    class FormService implements IFormService {
        rootScope: ng.IScope;
        private http;
        private q;
        timeout: ng.ITimeoutService;
        odinService: Odin.IService;
        userService: IUserService;
        private static logPrefix;
        static $inject: string[];
        userContext: IUserContext;
        private _overrideUrl;
        private sessionId;
        private translator;
        constructor(rootScope: ng.IScope, http: any, q: any, timeout: ng.ITimeoutService, odinService: Odin.IService, userService: IUserService);
        static add(m: ng.IModule): void;
        overrideUrl(url: string): void;
        private getBaseUrl();
        private onUnload();
        private executeSync(url);
        private logoffSync();
        launch(link: string): void;
        hasSession(): boolean;
        private parseResponse(request, content);
        getUserContext(): ng.IPromise<IUserContext>;
        logon(): ng.IPromise<Form.IResponse>;
        logoff(): ng.IPromise<Form.IResponse>;
        ping(): ng.IPromise<Form.IResponse>;
        private command(type, value);
        private addParam(params, name, value);
        private createParams(request);
        private createError(httpResponse);
        private createOptions(request);
        executeBookmark(bookmark: M3.Form.IBookmark): ng.IPromise<Form.IResponse>;
        pressKey(key: string, params?: any): ng.IPromise<Form.IResponse>;
        executeCommand(commandType: string, commandValue?: string, params?: any): ng.IPromise<Form.IResponse>;
        destroyProgram(instanceId: string): ng.IPromise<Form.IResponse>;
        execute(request: Form.IRequest): ng.IPromise<Form.IResponse>;
        executeUrl(url: string): any;
        private onTranslate(job, data);
        translate(request: Form.ITranslationRequest): ng.IPromise<Form.ITranslationResponse>;
    }
    interface IStartupOptions extends Odin.IStartupOptions {
        userContext?: boolean;
        session?: boolean;
        useM3Language?: boolean;
    }
    interface IService {
        miService: IMIService;
        userService: IUserService;
        formService: IFormService;
    }
    class Service implements IService {
        miService: IMIService;
        userService: IUserService;
        formService: IFormService;
        static $inject: string[];
        constructor(miService: IMIService, userService: IUserService, formService: IFormService);
        static add(m: ng.IModule): void;
    }
    interface IStartupService extends Odin.IStartupService {
    }
    class StartupService extends Odin.StartupService implements IStartupService {
        private m3Service;
        static $inject: string[];
        constructor(rootScope: ng.IRootScopeService, q: ng.IQService, location: ng.ILocationService, service: Odin.IService, m3Service: IService);
        static add(m: ng.IModule): void;
        private getResolvedPromise<T>(arg?);
        start(options: IStartupOptions): ng.IPromise<Odin.IStartupState>;
    }
    class ApplicationBase extends Odin.ApplicationBase {
        userContext: boolean;
        session: boolean;
        useM3Language: boolean;
        constructor();
        getStartupOptions(): IStartupOptions;
    }
}
