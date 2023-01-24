var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Odin;
(function (Odin) {
    var Version = (function () {
        function Version(major, minor, patch) {
            if (major === void 0) { major = 0; }
            if (minor === void 0) { minor = 0; }
            if (patch === void 0) { patch = 0; }
            this.major = 0;
            this.minor = 0;
            this.patch = 0;
            this.major = major;
            this.minor = minor;
            this.patch = patch;
            this.full = major + "." + minor + "." + patch;
        }
        return Version;
    }());
    Odin.Version = Version;
    var ArrayUtil = (function () {
        function ArrayUtil() {
        }
        ArrayUtil.remove = function (array, item) {
            var index = $.inArray(item, array);
            if (index >= 0) {
                array.splice(index, 1);
            }
        };
        ArrayUtil.removeByProperty = function (array, name, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][name] == value) {
                    array.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        ArrayUtil.indexByProperty = function (array, name, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][name] == value) {
                    return i;
                }
            }
            return -1;
        };
        ArrayUtil.itemByProperty = function (array, name, value) {
            var index = this.indexByProperty(array, name, value);
            return index >= 0 ? array[index] : null;
        };
        ArrayUtil.containsByProperty = function (array, name, value) {
            return this.indexByProperty(array, name, value) >= 0;
        };
        ArrayUtil.contains = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
            return false;
        };
        ArrayUtil.last = function (array) {
            if (array && array.length > 0) {
                return array[array.length - 1];
            }
            return null;
        };
        return ArrayUtil;
    }());
    Odin.ArrayUtil = ArrayUtil;
    var Log = (function () {
        function Log() {
        }
        Log.addAppender = function (appender) {
            Log.appenders.push(appender);
        };
        Log.removeAppender = function (appender) {
            ArrayUtil.remove(Log.appenders, appender);
        };
        Log.getTime = function () {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ms = date.getMilliseconds();
            var time = (hours < 10 ? "0" : "") + hours + ":" +
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (seconds < 10 ? "0" : "") + seconds + "," +
                (ms < 10 ? "00" : (ms < 100 ? "0" : "") + ms);
            return time;
        };
        Log.getLogEntry = function (level, text, ex) {
            var logText = "[" + Log.getTime() + "] " + this.prefixes[level] + " " + text;
            if (ex) {
                logText += " " + ex.message;
                if (ex.stack) {
                    logText += " " + ex.stack;
                }
            }
            return logText;
        };
        Log.log = function (currentLevel, level, text, ex) {
            if (level <= currentLevel) {
                if (Log.isConsoleLogEnabled && window.console) {
                    var logText = Log.getLogEntry(level, text, ex);
                    if (level <= 1) {
                        console.error(logText);
                    }
                    else if (level == 2) {
                        console.warn(logText);
                    }
                    else if (level == 3) {
                        console.info(logText);
                    }
                    else {
                        console.log(logText);
                    }
                }
                if (Log.appenders) {
                    for (var i = 0; i < Log.appenders.length; i++) {
                        try {
                            Log.appenders[i](level, text, ex);
                        }
                        catch (e) {
                        }
                    }
                }
            }
        };
        Log.setDefault = function () {
            this.level = this.levelInfo;
        };
        Log.fatal = function (text, ex) {
            this.log(this.level, this.levelFatal, text, ex);
        };
        Log.error = function (text, ex) {
            this.log(this.level, this.levelError, text, ex);
        };
        Log.warning = function (text, ex) {
            this.log(this.level, this.levelWarning, text, ex);
        };
        Log.info = function (text, ex) {
            this.log(this.level, this.levelInfo, text, ex);
        };
        Log.isDebug = function () {
            return this.level >= this.levelDebug;
        };
        Log.setDebug = function () {
            this.level = this.levelDebug;
        };
        Log.debug = function (text, ex) {
            this.log(this.level, this.levelDebug, text, ex);
        };
        Log.isTrace = function () {
            return this.level >= this.levelTrace;
        };
        Log.setTrace = function () {
            this.level = this.levelTrace;
        };
        Log.trace = function (text, ex) {
            this.log(this.level, this.levelTrace, text, ex);
        };
        Log.levelFatal = 0;
        Log.levelError = 1;
        Log.levelWarning = 2;
        Log.levelInfo = 3;
        Log.levelDebug = 4;
        Log.levelTrace = 5;
        Log.level = Log.levelInfo;
        Log.isConsoleLogEnabled = true;
        Log.prefixes = ["[FATAL]", "[ERROR]", "[WARNING]", "[INFO]", "[DEBUG]", "[TRACE]"];
        Log.appenders = [];
        return Log;
    }());
    Odin.Log = Log;
    var NumUtil = (function () {
        function NumUtil() {
        }
        NumUtil.getLocaleSeparator = function () {
            var n = 1.1;
            var s = n.toLocaleString().substring(1, 2);
            return s;
        };
        NumUtil.getDefaultOptions = function () {
            return NumUtil.defaultOptions;
        };
        NumUtil.setDefaultOptions = function (options) {
            NumUtil.defaultOptions = options;
            if (options.separator) {
                NumUtil.defaultSeparator = options.separator;
            }
        };
        NumUtil.isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        NumUtil.getInt = function (s, defaultValue) {
            if (defaultValue === void 0) { defaultValue = 0; }
            if (s) {
                try {
                    return parseInt(s);
                }
                catch (e) {
                }
            }
            return defaultValue;
        };
        NumUtil.format = function (value, options) {
            var s = value.toString();
            if ("" === s) {
                return s;
            }
            var separator = options ? options.separator : NumUtil.defaultOptions.separator;
            if (!separator) {
                separator = NumUtil.defaultSeparator;
            }
            s = s.replace(".", separator);
            return s;
        };
        NumUtil.pad = function (num, length) {
            var s = num + "";
            while (s.length < length) {
                s = "0" + s;
            }
            return s;
        };
        NumUtil.hasOnlyIntegers = function (s) {
            if (!s) {
                return false;
            }
            var digits = "1234567890";
            for (var i = 0; i < s.length; i++) {
                if (digits.indexOf(s.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        };
        NumUtil.defaultSeparator = NumUtil.getLocaleSeparator();
        NumUtil.defaultOptions = {
            separator: NumUtil.defaultSeparator
        };
        return NumUtil;
    }());
    Odin.NumUtil = NumUtil;
    var StringUtil = (function () {
        function StringUtil() {
        }
        StringUtil.isNullOrEmpty = function (value) {
            return !value ? true : false;
        };
        StringUtil.startsWith = function (value, prefix) {
            if (Util.hasValue(value)) {
                return value.indexOf(prefix) == 0;
            }
            return false;
        };
        StringUtil.endsWith = function (value, suffix) {
            if (value == null) {
                return false;
            }
            return value.indexOf(suffix, value.length - suffix.length) !== -1;
        };
        StringUtil.trimEnd = function (value) {
            return value.replace(/\s+$/, "");
        };
        StringUtil.format = function () {
            var args = [];
            /**for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }**/
            args = arguments[0];
            var stringValue = "missing";
            try {
                stringValue = args[0];
                var params = Array.prototype.slice.call(args, 1);
                stringValue = stringValue.replace(/{(\d+)}/g, function () {
                    var value = params[arguments[1]];
                    return (typeof value != 'undefined' ? value : arguments[0]);
                });
            }
            catch (ex) {
                Log.error("Failed to format string. Args: " + args);
            }
            return stringValue;
        };
        return StringUtil;
    }());
    Odin.StringUtil = StringUtil;
    var DateUtil = (function () {
        function DateUtil() {
        }
        DateUtil.isDate = function (date) {
            return date instanceof Date && !isNaN(date.valueOf());
        };
        return DateUtil;
    }());
    Odin.DateUtil = DateUtil;
    var Util = (function () {
        function Util() {
        }
        Util.getBoolean = function (s, defaultValue) {
            if (defaultValue === void 0) { defaultValue = false; }
            if (s && s.length > 0) {
                return s[0].toLowerCase() === "t";
            }
            return defaultValue;
        };
        Util.getUuid = function (prefix) {
            return prefix + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        Util.hasValue = function (anyObject) {
            if (typeof anyObject != "undefined") {
                return anyObject != null;
            }
            return false;
        };
        Util.isUndefined = function (anyObject) {
            return typeof anyObject === "undefined";
        };
        Util.random = function (stringLength) {
            if (stringLength === void 0) { stringLength = 16; }
            var chars = Util.chars;
            var randomstring = "";
            for (var i = 0; i < stringLength; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }
            return randomstring;
        };
        Util.isIframe = function () {
            try {
                return window.self !== window.top;
            }
            catch (e) {
                return true;
            }
        };
        Util.chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return Util;
    }());
    Odin.Util = Util;
    var ErrorTypes = (function () {
        function ErrorTypes() {
        }
        ErrorTypes.http = "HTTP";
        ErrorTypes.parse = "PARSE";
        return ErrorTypes;
    }());
    Odin.ErrorTypes = ErrorTypes;
    var ErrorState = (function () {
        function ErrorState() {
        }
        ErrorState.prototype.hasError = function () {
            var state = this;
            return !!(state.errorMessage || state.errorCode || state.error);
        };
        return ErrorState;
    }());
    Odin.ErrorState = ErrorState;
    var Language = (function (_super) {
        __extends(Language, _super);
        function Language() {
            _super.call(this);
        }
        Language.prototype.get = function (id) {
            var text = this[id];
            return text ? text : id;
        };
        Language.prototype.format = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (args.length < 2) {
                throw "At least two parameters are required";
            }
            var text = this.get(args[0]);
            args[0] = text;
            return StringUtil.format(args);
        };
        return Language;
    }(ErrorState));
    Odin.Language = Language;
    var InstanceEvent = (function () {
        function InstanceEvent() {
            this.handlers = [];
        }
        InstanceEvent.prototype.on = function (handler) {
            this.handlers.push(handler);
        };
        InstanceEvent.prototype.off = function (handler) {
            this.handlers = this.handlers.filter(function (h) { return h !== handler; });
        };
        InstanceEvent.prototype.raise = function (data) {
            if (this.handlers) {
                this.handlers.slice(0).forEach(function (h) { return h(data); });
            }
        };
        return InstanceEvent;
    }());
    Odin.InstanceEvent = InstanceEvent;
    (function (ComponentState) {
        ComponentState[ComponentState["Busy"] = 1] = "Busy";
        ComponentState[ComponentState["Active"] = 2] = "Active";
    })(Odin.ComponentState || (Odin.ComponentState = {}));
    var ComponentState = Odin.ComponentState;
    var Framework = (function () {
        function Framework() {
        }
        Framework.getApplication = function (rootScope) {
            return rootScope[Framework.app];
        };
        Framework.setApplication = function (rootScope, application) {
            rootScope[Framework.app] = application;
        };
        Framework.getPath = function () {
            return Framework.path;
        };
        Framework.setPath = function (path) {
            Framework.path = path;
            Log.info("[Odin.Framework] Path changed to: " + path);
        };
        Framework.path = "odin";
        Framework.app = "odinApp";
        Framework.version = new Version(1, 1, 1);
        return Framework;
    }());
    Odin.Framework = Framework;
    var ApplicationBase = (function () {
        function ApplicationBase() {
            this.startupServiceName = "odinStartupService";
        }
        ApplicationBase.prototype.onStart = function () {
        };
        ApplicationBase.prototype.onReady = function (state) {
            state.setReady();
        };
        ApplicationBase.prototype.onError = function (state) {
            state.showErrorMessage(this.name);
        };
        ApplicationBase.prototype.addUrlOverride = function (key, host, url) {
            var override = {
                host: host,
                url: url
            };
            var overrides = this.urlOverrides;
            if (!overrides) {
                this.urlOverrides = overrides = {};
            }
            overrides[key] = override;
        };
        ApplicationBase.prototype.getStartupOptions = function () {
            var application = {
                name: this.name,
                description: this.description,
                version: this.version,
                id: this.id
            };
            var options = {
                application: application,
                frameworkPath: this.frameworkPath,
                languageOptions: this.languageOptions,
                urlOverrides: this.urlOverrides
            };
            return options;
        };
        ApplicationBase.prototype.validate = function () {
            if (!this.module) {
                throw "The module property is not set";
            }
            if (!this.name) {
                throw "The name property is not set";
            }
        };
        ApplicationBase.prototype.startService = function (startupService) {
            var _this = this;
            this.startupService = startupService;
            var options = this.getStartupOptions();
            startupService.start(options).then(function (state) {
                _this.onReady(state);
            }, function (state) {
                _this.onError(state);
            });
        };
        ApplicationBase.prototype.onRun = function () {
            var _this = this;
            this.module.run([
                this.startupServiceName, function (startupService) {
                    _this.startService(startupService);
                }
            ]);
        };
        ApplicationBase.prototype.start = function () {
            this.onStart();
            this.validate();
            this.onRun();
        };
        return ApplicationBase;
    }());
    Odin.ApplicationBase = ApplicationBase;
    var FormatService = (function () {
        function FormatService($locale) {
            this.$locale = $locale;
            this.dateFormat = "yyyy-MM-dd";
            this.datetimeFormats = $locale.DATETIME_FORMATS;
            this.monthNames = this.datetimeFormats.MONTH.concat(this.datetimeFormats.SHORTMONTH);
            this.dayNames = this.datetimeFormats.DAY.concat(this.datetimeFormats.SHORTDAY);
        }
        FormatService.add = function (m) {
            m.service("odinFormatService", FormatService);
        };
        FormatService.prototype.getDecimalSeparator = function () {
            return NumUtil.getDefaultOptions().separator;
        };
        FormatService.prototype.setDecimalSeparator = function (separator) {
            var options = NumUtil.getDefaultOptions();
            options.separator = separator;
            NumUtil.setDefaultOptions(options);
        };
        FormatService.prototype.setDateFormat = function (format) {
            this.dateFormat = format;
        };
        FormatService.prototype.getDateFormat = function () {
            return this.dateFormat;
        };
        FormatService.prototype.parseDate = function (val, format) {
            try {
                val = val + '';
                if (!format) {
                    format = this.dateFormat;
                }
                if (!format.length) {
                    return new Date(val);
                }
                if (this.datetimeFormats[format]) {
                    format = this.datetimeFormats[format];
                }
                var now = new Date(), i_val = 0, i_format = 0, format_token = '', year = now.getFullYear(), month = now.getMonth() + 1, date = now.getDate(), hh = 0, mm = 0, ss = 0, sss = 0, ampm = 'am', z = 0, parsedZ = false;
                while (i_format < format.length) {
                    format_token = format.charAt(i_format);
                    var token = '';
                    if (format.charAt(i_format) == "'") {
                        var _i_format = i_format;
                        while ((format.charAt(++i_format) != "'") && (i_format < format.length)) {
                            token += format.charAt(i_format);
                        }
                        if (val.substring(i_val, i_val + token.length) != token) {
                            throw 'Pattern value mismatch';
                        }
                        i_val += token.length;
                        i_format++;
                        continue;
                    }
                    while ((format.charAt(i_format) == format_token) && (i_format < format.length)) {
                        token += format.charAt(i_format++);
                    }
                    if (token == 'yyyy' || token == 'yy' || token == 'y') {
                        var minLength, maxLength;
                        if (token == 'yyyy') {
                            minLength = 4;
                            maxLength = 4;
                        }
                        if (token == 'yy') {
                            minLength = 2;
                            maxLength = 2;
                        }
                        if (token == 'y') {
                            minLength = 2;
                            maxLength = 4;
                        }
                        var yearString = this.getInteger(val, i_val, minLength, maxLength);
                        year = parseInt(yearString);
                        if (isNaN(year)) {
                            throw 'Invalid year';
                        }
                        i_val += yearString.length;
                        if (yearString.length == 2) {
                            if (year > 70) {
                                year = 1900 + (year - 0);
                            }
                            else {
                                year = 2000 + (year - 0);
                            }
                        }
                    }
                    else if (token === 'MMMM' || token == 'MMM') {
                        month = 0;
                        for (var i = 0; i < this.monthNames.length; i++) {
                            var month_name = this.monthNames[i];
                            if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                                month = i + 1;
                                if (month > 12) {
                                    month -= 12;
                                }
                                i_val += month_name.length;
                                break;
                            }
                        }
                        if ((month < 1) || (month > 12)) {
                            throw 'Invalid month';
                        }
                    }
                    else if (token == 'EEEE' || token == 'EEE') {
                        for (var j = 0; j < this.dayNames.length; j++) {
                            var day_name = this.dayNames[j];
                            if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                                i_val += day_name.length;
                                break;
                            }
                        }
                    }
                    else if (token == 'MM' || token == 'M') {
                        var monthString = this.getInteger(val, i_val, token.length, 2);
                        month = parseInt(monthString);
                        if (isNaN(month) || (month < 1) || (month > 12)) {
                            throw 'Invalid month';
                        }
                        i_val += monthString.length;
                    }
                    else if (token == 'dd' || token == 'd') {
                        var dateString = this.getInteger(val, i_val, token.length, 2);
                        date = parseInt(dateString);
                        if (isNaN(date) || (date < 1) || (date > 31)) {
                            throw 'Invalid date';
                        }
                        i_val += dateString.length;
                    }
                    else if (token == 'HH' || token == 'H') {
                        var hHString = this.getInteger(val, i_val, token.length, 2);
                        if (hh === null || (hh < 0) || (hh > 23)) {
                            throw 'Invalid hours';
                        }
                        i_val += hHString.length;
                    }
                    else if (token == 'hh' || token == 'h') {
                        var hhString = this.getInteger(val, i_val, token.length, 2);
                        if (hh === null || (hh < 1) || (hh > 12)) {
                            throw 'Invalid hours';
                        }
                        i_val += hhString.length;
                    }
                    else if (token == 'mm' || token == 'm') {
                        var mmString = this.getInteger(val, i_val, token.length, 2);
                        if (mm === null || (mm < 0) || (mm > 59)) {
                            throw 'Invalid minutes';
                        }
                        i_val += mmString.length;
                    }
                    else if (token == 'ss' || token == 's') {
                        var ssString = this.getInteger(val, i_val, token.length, 2);
                        ss = parseInt(ssString);
                        if (isNaN(ss) || (ss < 0) || (ss > 59)) {
                            throw 'Invalid seconds';
                        }
                        i_val += ssString.length;
                    }
                    else if (token === 'sss') {
                        var sss = parseInt(this.getInteger(val, i_val, 3, 3));
                        if (isNaN(sss) || (sss < 0) || (sss > 999)) {
                            throw 'Invalid milliseconds';
                        }
                        i_val += 3;
                    }
                    else if (token == 'a') {
                        if (val.substring(i_val, i_val + 2).toLowerCase() == 'am') {
                            ampm = 'AM';
                        }
                        else if (val.substring(i_val, i_val + 2).toLowerCase() == 'pm') {
                            ampm = 'PM';
                        }
                        else {
                            throw 'Invalid AM/PM';
                        }
                        i_val += 2;
                    }
                    else if (token == 'Z') {
                        parsedZ = true;
                        if (val[i_val] === 'Z') {
                            z = 0;
                            i_val += 1;
                        }
                        else {
                            if (val[i_val + 3] === ':') {
                                var tzStr = val.substring(i_val, i_val + 6);
                                z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(4, 2), 10);
                                i_val += 6;
                            }
                            else {
                                var tzStr = val.substring(i_val, i_val + 5);
                                z = (parseInt(tzStr.substr(0, 3), 10) * 60) + parseInt(tzStr.substr(3, 2), 10);
                                i_val += 5;
                            }
                        }
                        if (z > 720 || z < -720) {
                            throw 'Invalid timezone';
                        }
                    }
                    else {
                        if (val.substring(i_val, i_val + token.length) != token) {
                            throw 'Pattern value mismatch';
                        }
                        else {
                            i_val += token.length;
                        }
                    }
                }
                if (i_val != val.length) {
                    throw 'Pattern value mismatch';
                }
                if (month == 2) {
                    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
                        if (date > 29) {
                            throw 'Invalid date';
                        }
                    }
                    else {
                        if (date > 28) {
                            throw 'Invalid date';
                        }
                    }
                }
                if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                    if (date > 30) {
                        throw 'Invalid date';
                    }
                }
                if (hh < 12 && ampm == 'PM') {
                    hh += 12;
                }
                else if (hh > 11 && ampm == 'AM') {
                    hh -= 12;
                }
                var localDate = new Date(year, month - 1, date, hh, mm, ss, sss);
                if (parsedZ) {
                    return new Date(localDate.getTime() - (z + localDate.getTimezoneOffset()) * 60000);
                }
                return localDate;
            }
            catch (e) {
                return undefined;
            }
        };
        FormatService.prototype.getInteger = function (s, startPoint, minLength, maxLength) {
            for (var i = maxLength; i >= minLength; i--) {
                var extracted = s.substring(startPoint, startPoint + i);
                if (NumUtil.hasOnlyIntegers(extracted)) {
                    return extracted;
                }
            }
            return null;
        };
        FormatService.$inject = ["$locale"];
        return FormatService;
    }());
    Odin.FormatService = FormatService;
    var DataProviderService = (function () {
        function DataProviderService(q) {
            this.q = q;
            this.resultCache = {};
            this.providerDictionary = {};
            this.awaitingProviderDictionary = {};
        }
        DataProviderService.add = function (m) {
            m.service("odinDataProviderService", DataProviderService);
        };
        DataProviderService.prototype.register = function (key, provider) {
            if (this.providerDictionary[key] == null) {
                this.providerDictionary[key] = provider;
                Odin.Log.debug("Registered provider for key: " + key);
                if (this.awaitingProviderDictionary[key]) {
                    this.get(key, this.awaitingProviderDictionary[key].options);
                }
            }
            else {
                throw "The key must be unique. Key " + key + " already exists.";
            }
        };
        DataProviderService.prototype.get = function (key, options) {
            var _this = this;
            var awaiting = this.awaitingProviderDictionary[key];
            var deferred = awaiting ? awaiting.deferred : this.q.defer();
            var cacheResult = this.resultCache[key];
            if (cacheResult == null) {
                try {
                    var provider = this.providerDictionary[key];
                    if (provider != null) {
                        Odin.Log.debug("Start fetching data for key: " + key);
                        provider.get(options).then(function (response) {
                            if (response.hasError()) {
                                Odin.Log.debug("Response for key: " + key + " has errors: " + response.errorMessage);
                            }
                            _this.resultCache[key] = response;
                            deferred.resolve(response);
                        }, function (response) {
                            if (response.hasError()) {
                                Odin.Log.debug("Response for key " + key + " has errors: " + response.errorMessage);
                            }
                        });
                    }
                    else {
                        Odin.Log.debug("Key " + key + " not yet registered, awaiting registration.");
                        this.awaitingProviderDictionary[key] = { options: options, deferred: deferred };
                    }
                }
                catch (e) {
                    Odin.Log.warning("Something went wrong when fetching data for key: " + key);
                }
            }
            else {
                deferred.resolve(cacheResult);
            }
            return deferred.promise;
        };
        DataProviderService.$inject = ["$q"];
        return DataProviderService;
    }());
    Odin.DataProviderService = DataProviderService;
    var DataProviderDirective = (function () {
        function DataProviderDirective() {
        }
        DataProviderDirective.add = function (m) {
            var _this = this;
            m.directive('odinDataProvider', [
                "$rootScope", "odinDataProviderService", function (rootScope, dataProviderService) {
                    return _this.create(rootScope, dataProviderService);
                }
            ]);
        };
        DataProviderDirective.create = function (rootScope, dataProviderService) {
            return {
                restrict: "E",
                link: function (scope, element, attrs) {
                    var key = attrs["key"];
                    var propertyName = attrs["propertyName"] || key;
                    dataProviderService.get(key).then(function (response) {
                        if (!response.hasError()) {
                            scope[propertyName] = response.items;
                        }
                    });
                }
            };
        };
        return DataProviderDirective;
    }());
    Odin.DataProviderDirective = DataProviderDirective;
})(Odin || (Odin = {}));
var Odin;
(function (Odin) {
    var Templates = (function () {
        function Templates() {
        }
        Templates.cacheTemplatesInModule = function () {
            angular.module("odin").run(["$templateCache", function ($templateCache) {
                    $templateCache.put("odin/partials/filterHeader.html", "<div class=\"ngHeaderSortColumn{{col.headerClass}}\" ng-syle=\"{\\&quot;cursor\\&quot;: col.cursor}\" ng-class=\"{\\&quot;ngSorted\\&quot;: !noSortVisible}\"><div ng-click=\"col.sort($event)\" ng-class=\"\\&quot;colt\\&quot; + col.index\" class=\"ngHeaderText\">{{col.displayName}}</div><div class=\"ngSortButtonDown\" ng-show=\"col.showSortButtonDown()\"></div><div class=\"ngSortButtonUp\" ng-show=\"col.showSortButtonUp()\"></div><div class=\"ngSortPriority\">{{col.sortPriority}}</div><div ng-class=\"{ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned}\" ng-click=\"togglePin(col)\" ng-show=\"col.pinnable\"></div></div><input type=\"text\" ng-click=\"stopClickProp($event)\" placeholder=\"Filter...\" ng-model=\"col.filterText\" ng-style=\"{\\&quot;width\\&quot; : col.width - 14 + \\&quot;px\\&quot;}\"><div ng-show=\"col.resizable\" class=\"ngHeaderGrip\" ng-click=\"col.gripClick($event)\" ng-mousedown=\"col.gripOnMouseDown($event)\"></div>");
                    $templateCache.put("odin/partials/genericBrowse.html", "<div class=\"modal-header\"><button class=\"close\" type=\"button\" ng-click=\"cancel()\">×</button><h3>{{options.header}}</h3></div><div class=\"modal-body\"><p>{{options.message}}</p><div ng-include=\"options.templateUrl\"></div></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\">{{lang.OK}}</button> <button class=\"btn\" ng-click=\"cancel()\">{{lang.Cancel}}</button></div>");
                    $templateCache.put("odin/partials/gridBrowse.html", "<div class=\"modal-header\"><button class=\"close\" type=\"button\" ng-click=\"cancel()\">×</button><h3>{{options.header}}</h3></div><div class=\"modal-body\"><div class=\"odin-position-r\"><odin-busy-indicator ng-show=\"odinBusy\"></odin-busy-indicator><div class=\"container-fluid\"><div>{{options.message}}</div><div style=\"width: 480px\" ui-grid=\"gridOptions\" ui-grid-selection ui-grid-resize-columns></div></div></div></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\">{{lang.OK}}</button> <button class=\"btn\" ng-click=\"cancel()\">{{lang.Cancel}}</button></div>");
                    $templateCache.put("odin/partials/modalMessage.html", "<div class=\"modal-header\"><button class=\"close\" type=\"button\" ng-click=\"options.close()\">×</button><h3>{{options.header}}</h3></div><div class=\"modal-body\"><p>{{options.message}}</p></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"options.primary()\">{{options.primaryText}}</button> <button class=\"btn\" ng-click=\"options.secondary()\" ng-show=\"options.showSecondary\">{{options.secondaryText}}</button> <button class=\"btn\" ng-click=\"options.cancel()\" ng-show=\"options.showCancel\">{{options.cancelText}}</button></div>");
                }]);
        };
        return Templates;
    }());
    Odin.Templates = Templates;
})(Odin || (Odin = {}));
var Odin;
(function (Odin) {
    var FocusDirective = (function () {
        function FocusDirective($rootScope, $timeout) {
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
        }
        FocusDirective.prototype.focusById = function (id) {
            angular.element("#" + id).trigger("focus");
        };
        FocusDirective.prototype.focusByName = function (name) {
            var _this = this;
            this.$timeout(function () {
                _this.$rootScope.$broadcast("odinFocusOn", name);
            });
        };
        FocusDirective.add = function (m) {
            m.factory("odinFocus", ["$rootScope", "$timeout", function ($rootScope, $timeout) {
                    return new FocusDirective($rootScope, $timeout);
                }]);
            m.directive("odinFocusAuto", function ($timeout) {
                return {
                    restrict: "AC",
                    link: function (scope, element) {
                        $timeout(function () {
                            element[0].focus();
                        }, 0);
                    }
                };
            });
            m.directive("odinFocusOn", function () { return function (scope, elem, attr) {
                scope.$on("odinFocusOn", function (e, name) {
                    if (name === attr.odinFocusOn) {
                        elem[0].focus();
                    }
                });
            }; });
            m.directive("odinFocus", function ($timeout, $parse) {
                return {
                    restrict: "A",
                    link: function (scope, element, attrs) {
                        scope.$watch(attrs.odinFocus, function (newValue, oldValue) {
                            if (newValue) {
                                element[0].focus();
                            }
                        });
                        element.bind("blur", function (e) {
                            $timeout(function () {
                                scope.$apply(attrs.odinFocus + "=false");
                            }, 0);
                        });
                        element.bind("focus", function (e) {
                            $timeout(function () {
                                scope.$apply(attrs.odinFocus + "=true");
                            }, 0);
                        });
                    }
                };
            });
        };
        return FocusDirective;
    }());
    Odin.FocusDirective = FocusDirective;
})(Odin || (Odin = {}));
var Odin;
(function (Odin) {
    (function (MessageType) {
        MessageType[MessageType["Information"] = 0] = "Information";
        MessageType[MessageType["Warning"] = 1] = "Warning";
        MessageType[MessageType["Error"] = 2] = "Error";
    })(Odin.MessageType || (Odin.MessageType = {}));
    var MessageType = Odin.MessageType;
    (function (DialogButtons) {
        DialogButtons[DialogButtons["Ok"] = 1] = "Ok";
        DialogButtons[DialogButtons["OkCancel"] = 2] = "OkCancel";
        DialogButtons[DialogButtons["YesNo"] = 3] = "YesNo";
        DialogButtons[DialogButtons["YesNoCancel"] = 4] = "YesNoCancel";
    })(Odin.DialogButtons || (Odin.DialogButtons = {}));
    var DialogButtons = Odin.DialogButtons;
    (function (DialogResult) {
        DialogResult[DialogResult["Ok"] = 1] = "Ok";
        DialogResult[DialogResult["Cancel"] = 2] = "Cancel";
        DialogResult[DialogResult["Yes"] = 3] = "Yes";
        DialogResult[DialogResult["No"] = 4] = "No";
    })(Odin.DialogResult || (Odin.DialogResult = {}));
    var DialogResult = Odin.DialogResult;
    var Message = (function () {
        function Message() {
            this.message = null;
            this.header = null;
            this.messageType = MessageType.Information;
            this.messageCode = null;
        }
        return Message;
    }());
    Odin.Message = Message;
    var MessageServiceOptions = (function () {
        function MessageServiceOptions() {
            this.statusBarName = "odinStatusBar";
            this.defaultHeader = null;
        }
        return MessageServiceOptions;
    }());
    var StatusBarItem = (function () {
        function StatusBarItem(message) {
            angular.copy(message, this);
            this.timestamp = new Date();
            if (!this.type) {
                this.type = MessageType.Information;
            }
        }
        StatusBarItem.prototype.formatTime = function () {
            return this.timestamp.getHours() + ':' + Odin.NumUtil.pad(this.timestamp.getMinutes(), 2);
        };
        return StatusBarItem;
    }());
    var StatusBarCtrl = (function () {
        function StatusBarCtrl(scope, messageService, timeoutService) {
            var _this = this;
            this.scope = scope;
            this.messageService = messageService;
            this.timeoutService = timeoutService;
            this.items = [];
            this.lastMessage = null;
            this.isStatusVisible = true;
            this.isCollapsed = true;
            this.clearMessageInterval = 5000;
            messageService.messageAdded().on(function (m) { return _this.addMessageInternal(m); });
        }
        StatusBarCtrl.prototype.addMessageInternal = function (message) {
            var _this = this;
            var item = new StatusBarItem(message);
            if (this.clearMessageInterval > 0 && message.type != MessageType.Error) {
                if (this.clearPromise) {
                    this.timeoutService.cancel(this.clearPromise);
                }
                this.clearPromise = this.timeoutService(function () { return _this.onTimeout(); }, this.clearMessageInterval);
            }
            else if (this.clearMessageInterval > 0 && message.type == MessageType.Error && this.clearPromise) {
                this.timeoutService.cancel(this.clearPromise);
            }
            this.lastMessage = item;
            this.items.push(item);
        };
        StatusBarCtrl.prototype.removeAt = function (index) {
            if (index || index == 0) {
                var removedItem = this.items.splice(this.items.length - 1 - index, 1);
                if (removedItem[0] == this.lastMessage) {
                    this.lastMessage = null;
                }
            }
            this.isCollapsed = this.items.length == 0;
        };
        StatusBarCtrl.prototype.onTimeout = function () {
            this.lastMessage = null;
            this.clearPromise = null;
        };
        StatusBarCtrl.prototype.addMessage = function (message) {
            this.addMessageInternal({ message: message });
        };
        StatusBarCtrl.prototype.clear = function () {
            this.isCollapsed = true;
            this.items = [];
            this.lastMessage = null;
        };
        StatusBarCtrl.$inject = ["$scope", "odinMessageService", "$timeout"];
        return StatusBarCtrl;
    }());
    var MessageService = (function () {
        function MessageService(rootScope, modal, q, languageService) {
            this.rootScope = rootScope;
            this.modal = modal;
            this.q = q;
            this.languageService = languageService;
            this.defaultServiceOptions = new MessageServiceOptions();
            this.messageEvent = new Odin.InstanceEvent();
            this.defaultSettings = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: Odin.BrowseConstants.modalMessageTemplate
            };
            this.defaultOptions = {
                type: MessageType.Information,
                buttons: DialogButtons.Ok,
                primaryText: "OK",
                cancelText: "Cancel"
            };
        }
        MessageService.add = function (m) {
            m.service("odinMessageService", MessageService);
            m.controller("odinStatusBarCtrl", StatusBarCtrl);
            m.directive("odinStatusbar", function () {
                return {
                    restrict: "E",
                    replace: true,
                    template: "<div ng-controller='odinStatusBarCtrl as ctrl' id='odin-statusbar' class='odin-statusbar' uib-collapse='!ctrl.isStatusVisible'><table class='table odin-statusbar-header' ng-disabled='ctrl.items.length==0' ng-click='(ctrl.items.length > 0) && (ctrl.isCollapsed=!ctrl.isCollapsed)' ng-model='ctrl.isCollapsed'><tbody><tr><td><span class='odin-statusbar-message' ng-class='{\"0\": \"information\", \"1\": \"warning\", \"2\":\"error\"}[ctrl.lastMessage.type]'>{{ctrl.lastMessage.message}}</span></td><td class='odin-width-xs'><button type='button' ng-disabled='ctrl.items.length==0' class='close'><span class='btn-xs glyphicon' ng-class='{\"true\": \"glyphicon-chevron-up\", \"false\": \"glyphicon-chevron-down\", \"undefined\":\"glyphicon-chevron-down\"}[ctrl.isCollapsed]'></span></button></td></tr></tbody></table><div uib-collapse='ctrl.isCollapsed'><div class='odin-statusbar-content'><table class='table'><tbody><tr ng-repeat='item in ctrl.items | orderBy:\"timestamp\":true'><td><span class='odin-statusbar-message' ng-class='{\"0\": \"information\", \"1\": \"warning\", \"2\":\"error\"}[item.type]'>{{item.message}}</span></td><td class='odin-width-sm'><span class='odin-statusbar-time'>{{item.formatTime()}}</span></td><td class='odin-width-xs'><button type='button' class='close' ng-click='ctrl.removeAt($index)'><span class='btn-xs glyphicon glyphicon-remove'></span></button></td></tr></tbody></table></div><div class='odin-block odin-statusbar-clear'><button type='button' class='btn' ng-click='ctrl.clear()'>Clear All</button></div></div></div>"
                };
            });
        };
        MessageService.prototype.getDefaultHeader = function () {
            var application = Odin.Framework.getApplication(this.rootScope);
            if (application && application.name) {
                return application.name;
            }
            return "";
        };
        MessageService.prototype.show = function (message) {
            var _this = this;
            if (!message.type) {
                message.type = MessageType.Information;
            }
            if (!message.header) {
                message.header = this.getDefaultHeader();
            }
            Odin.Log.debug("Show message " + message.header + " " + message.message + ", type: " + message.type);
            var promise = this.showDialog(message);
            promise['finally'](function () { return _this.raiseMessageAdded(message); });
            return promise;
        };
        MessageService.prototype.configureButtons = function (options) {
            options.primaryResult = DialogResult.Ok;
            if (options.buttons == DialogButtons.OkCancel || options.buttons == DialogButtons.YesNoCancel) {
                options.showCancel = true;
                options.secondaryResult = DialogResult.Cancel;
            }
            if (options.buttons == DialogButtons.YesNo || options.buttons == DialogButtons.YesNoCancel) {
                options.showSecondary = true;
                options.primaryResult = DialogResult.Yes;
                options.secondaryResult = DialogResult.No;
            }
        };
        MessageService.prototype.showStatus = function (message, type) {
            this.raiseMessageAdded({ message: message, type: type });
        };
        MessageService.prototype.showInfo = function (message, header) {
            return this.show({ message: message, header: header, type: MessageType.Information });
        };
        MessageService.prototype.showWarning = function (message, header) {
            return this.show({ message: message, header: header, type: MessageType.Warning });
        };
        MessageService.prototype.showError = function (message, header) {
            return this.show({ message: message, header: header, type: MessageType.Error });
        };
        MessageService.prototype.configure = function (options) {
            this.options = options;
        };
        MessageService.prototype.messageAdded = function () {
            return this.messageEvent;
        };
        MessageService.prototype.raiseMessageAdded = function (message) {
            Odin.Log.debug("Send message to statusbar " + message.header + " " + message.message + ", type: " + message.type);
            this.messageEvent.raise(message);
        };
        MessageService.prototype.showDialog = function (options) {
            var currentSettings = {};
            if (options.modalSettings) {
                angular.extend(currentSettings, this.defaultSettings, options.modalSettings, options);
            }
            else {
                angular.extend(currentSettings, this.defaultSettings, options);
            }
            var lang = this.languageService.tryGet();
            var currentOptions = {};
            var ok = lang.get("OK");
            var cancel = lang.get("Cancel");
            var defaultOptions = this.defaultOptions;
            defaultOptions.cancelText = cancel;
            defaultOptions.primaryText = ok;
            angular.extend(currentOptions, defaultOptions);
            if (options.buttons == DialogButtons.YesNo || options.buttons == DialogButtons.YesNoCancel) {
                currentOptions.primaryText = lang.get("Yes");
                currentOptions.secondaryText = lang.get("No");
            }
            angular.extend(currentOptions, options);
            this.configureButtons(currentOptions);
            var escapeIsCancel = options.buttons !== DialogButtons.YesNo;
            currentSettings.keyboard = escapeIsCancel;
            var closeAction = null;
            switch (options.buttons) {
                case DialogButtons.YesNo:
                    closeAction = currentOptions.secondaryResult;
                    break;
                case DialogButtons.OkCancel:
                case DialogButtons.YesNoCancel:
                    closeAction = DialogResult.Cancel;
                    break;
                case DialogButtons.Ok:
                default:
                    closeAction = DialogResult.Ok;
                    break;
            }
            if (!currentSettings.controller) {
                currentSettings.controller = (["$scope", "$uibModalInstance", function ($scope, $modalInstance) {
                        $scope.options = currentOptions;
                        $scope.options.primary = function () {
                            $modalInstance.close(currentOptions.primaryResult);
                        };
                        $scope.options.secondary = function () {
                            $modalInstance.close(currentOptions.secondaryResult);
                        };
                        $scope.options.cancel = function () {
                            $modalInstance.close(DialogResult.Cancel);
                        };
                        $scope.options.close = function () {
                            $modalInstance.close(closeAction);
                        };
                    }
                ]);
            }
            currentSettings.backdrop = "static";
            var deferred = this.q.defer();
            this.modal.open(currentSettings).result.then(function (result) {
                deferred.resolve(result);
            }, function (error) {
                if (escapeIsCancel) {
                    deferred.resolve(currentOptions.buttons == DialogButtons.Ok ? DialogResult.Ok : DialogResult.Cancel);
                }
                else {
                    deferred.reject(error);
                }
            });
            return deferred.promise;
        };
        MessageService.$inject = ["$rootScope", "$uibModal", "$q", "odinLanguageService"];
        return MessageService;
    }());
    Odin.MessageService = MessageService;
    var GridDoubleClickPlugin = (function () {
        function GridDoubleClickPlugin() {
        }
        GridDoubleClickPlugin.prototype.init = function (scope, grid) {
            this.scope = scope;
            this.grid = grid;
            this.addEvents();
        };
        GridDoubleClickPlugin.prototype.addEvents = function () {
            var self = this;
            this.grid.$viewport.on('dblclick', function () { self.onDoubleClick(); });
        };
        GridDoubleClickPlugin.prototype.onDoubleClick = function () {
            if (Odin.Log.isDebug()) {
                Odin.Log.debug("[GridDoubleClickPlugin] double-click on row " + JSON.stringify(this.scope.selectedItems[0]));
            }
            var callback = this.scope["odin.DoubleClick"];
            if (callback && callback.hasOwnProperty("onDoubleClick")) {
                callback.onDoubleClick();
            }
        };
        return GridDoubleClickPlugin;
    }());
    Odin.GridDoubleClickPlugin = GridDoubleClickPlugin;
    var FilterGridPlugin = (function () {
        function FilterGridPlugin() {
        }
        FilterGridPlugin.prototype.init = function (scope, grid) {
            var _this = this;
            this.scope = scope;
            this.grid = grid;
            var self = this;
            this.scope.$watch(function () {
                var searchQuery = "";
                angular.forEach(self.scope.columns, function (col) {
                    if (col.visible && col.filterText) {
                        var filterText = (col.filterText.indexOf('*') == 0 ? col.filterText.replace('*', '') : "^" + col.filterText) + ";";
                        searchQuery += col.displayName + ": " + filterText;
                    }
                });
                return searchQuery;
            }, function (searchQuery) { _this.filterListner(searchQuery); });
        };
        FilterGridPlugin.prototype.filterListner = function (searchQuery) {
            if (Odin.StringUtil.isNullOrEmpty(searchQuery)) {
                return;
            }
            this.scope.$parent["filterText"] = searchQuery;
            this.grid.searchProvider.evalFilter();
        };
        return FilterGridPlugin;
    }());
    Odin.FilterGridPlugin = FilterGridPlugin;
})(Odin || (Odin = {}));
var Odin;
(function (Odin) {
    var KeyboardDirective = (function () {
        function KeyboardDirective() {
        }
        KeyboardDirective.capitaliseFirstLetter = function (s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        };
        KeyboardDirective.onKeyEvent = function ($parse, mode, scope, elm, attrs) {
            var params, combinations = [];
            params = scope.$eval(attrs["odin" + KeyboardDirective.capitaliseFirstLetter(mode)]);
            angular.forEach(params, function (v, k) {
                var combination, expression;
                expression = $parse(v);
                angular.forEach(k.split(" "), function (variation) {
                    combination = {
                        expression: expression,
                        keys: {}
                    };
                    angular.forEach(variation.split("-"), function (value) {
                        combination.keys[value] = true;
                    });
                    combinations.push(combination);
                });
            });
            elm.bind(mode, function (event) {
                var metaPressed = !!(event.metaKey && !event.ctrlKey);
                var altPressed = !!event.altKey;
                var ctrlPressed = !!event.ctrlKey;
                var shiftPressed = !!event.shiftKey;
                var keyCode = event.keyCode;
                if (mode === "keypress" && !shiftPressed && keyCode >= 97 && keyCode <= 122) {
                    keyCode = keyCode - 32;
                }
                angular.forEach(combinations, function (combination) {
                    var mainKeyPressed = combination.keys[KeyboardDirective.keysByCode[keyCode]] || combination.keys[keyCode.toString()];
                    var metaRequired = !!combination.keys.meta;
                    var altRequired = !!combination.keys.alt;
                    var ctrlRequired = !!combination.keys.ctrl;
                    var shiftRequired = !!combination.keys.shift;
                    if (mainKeyPressed &&
                        (metaRequired === metaPressed) &&
                        (altRequired === altPressed) &&
                        (ctrlRequired === ctrlPressed) &&
                        (shiftRequired === shiftPressed)) {
                        scope.$apply(function () {
                            combination.expression(scope, { "$event": event });
                        });
                    }
                });
            });
        };
        KeyboardDirective.onKeyEventToUpper = function (scope, elm, attrs) {
            var _this = this;
            elm.bind("keyup", function (event) {
                _this.forceUpper(event, elm);
            });
        };
        KeyboardDirective.doGetCaretPosition = function (inputElement) {
            var caretPos = 0;
            var selection = document.selection;
            if (selection) {
                inputElement.focus();
                var oSel = selection.createRange();
                oSel.moveStart('character', -inputElement.value.length);
                caretPos = oSel.text.length;
            }
            else {
                if (inputElement.selectionStart || inputElement.selectionStart == 0) {
                    caretPos = inputElement.selectionStart;
                }
            }
            return (caretPos);
        };
        KeyboardDirective.doSetCaretPosition = function (inputElement, caretPos) {
            var selection = document.selection;
            if (selection) {
                inputElement.focus();
                var oSel = selection.createRange();
                oSel.moveStart('character', -inputElement.value.length);
                oSel.moveStart('character', caretPos);
                oSel.moveEnd('character', 0);
                oSel.select();
            }
            else if (inputElement.selectionStart || inputElement.selectionStart == 0) {
                inputElement.selectionStart = caretPos;
                inputElement.selectionEnd = caretPos;
                inputElement.focus();
            }
        };
        KeyboardDirective.forceUpper = function (event, o) {
            if (event.keyCode !== 9) {
                var element = o[0];
                var x = this.doGetCaretPosition(element);
                element.value = element.value.toUpperCase();
                this.doSetCaretPosition(element, x);
            }
        };
        KeyboardDirective.add = function (m) {
            m.directive("odinKeydown", ["$parse", function ($parse) {
                    return {
                        link: function (scope, elm, attrs) {
                            KeyboardDirective.onKeyEvent($parse, "keydown", scope, elm, attrs);
                        }
                    };
                }]);
            m.directive("odinKeypress", ["$parse", function ($parse) {
                    return {
                        link: function (scope, elm, attrs) {
                            KeyboardDirective.onKeyEvent($parse, "keypress", scope, elm, attrs);
                        }
                    };
                }]);
            m.directive("odinKeyup", ["$parse", function ($parse) {
                    return {
                        link: function (scope, elm, attrs) {
                            KeyboardDirective.onKeyEvent($parse, "keyup", scope, elm, attrs);
                        }
                    };
                }]);
            m.directive("odinUppercase", [function () {
                    return {
                        link: function (scope, elm, attrs) {
                            KeyboardDirective.onKeyEventToUpper(scope, elm, attrs);
                        }
                    };
                }]);
        };
        KeyboardDirective.keysByCode = {
            8: "backspace",
            9: "tab",
            13: "enter",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12"
        };
        return KeyboardDirective;
    }());
    Odin.KeyboardDirective = KeyboardDirective;
    var MouseDirective = (function () {
        function MouseDirective() {
        }
        MouseDirective.add = function (m) {
            m.directive("odinRightClick", [
                "$parse", function ($parse) {
                    return {
                        link: function (scope, elm, attrs) {
                            var fn = $parse(attrs.odinRightClick);
                            elm.bind('contextmenu', function (event) {
                                event.preventDefault();
                                fn(scope, { $event: event });
                            });
                        }
                    };
                }]);
        };
        return MouseDirective;
    }());
    Odin.MouseDirective = MouseDirective;
    var NumberDirective = (function () {
        function NumberDirective() {
        }
        NumberDirective.add = function (m) {
            var _this = this;
            m.directive("odinNumber", function () {
                return {
                    require: '?ngModel',
                    link: function (scope, element, attrs, ngModelCtrl) {
                        if (!ngModelCtrl) {
                            return;
                        }
                        var defSep = Odin.NumUtil.getDefaultOptions().separator;
                        var defaults = { digits: "*", decimals: "0", maxValue: "*", separator: defSep, type: "number" };
                        var attrNumeric = attrs["odinNumber"];
                        var attrType;
                        var attrDigits;
                        var attrDecimal;
                        var attrMax;
                        var attrSeparator;
                        var numerics = [];
                        if (!Odin.StringUtil.isNullOrEmpty(attrNumeric)) {
                            numerics = attrNumeric.split(",");
                            numerics.forEach(function (value, index) {
                                if (!value) {
                                    numerics[index] = "*";
                                }
                            });
                        }
                        attrDigits = numerics[0] || attrs["odinDigits"] || defaults["digits"];
                        attrDecimal = numerics[1] || attrs["odinDecimals"] || defaults["decimals"];
                        attrMax = numerics[2] || attrs["odinMaxvalue"] || defaults["maxValue"];
                        attrSeparator = attrs["odinSeparator"] || defaults["separator"];
                        attrType = attrs["odinType"] || defaults["type"];
                        attrType = attrType.toLowerCase();
                        var convertToNumber = attrType === "number";
                        var digitExp = (attrDigits != "*") ? "{0," + (parseInt(attrDigits) - 1).toString() + "}" : "*";
                        var decimalExp = "";
                        if (attrDecimal != "0") {
                            var separatorExp = (attrSeparator != "*") ? attrSeparator.replace(".", "\\.") : "[,\\.]";
                            var decHelpExp = (attrDecimal != "*") ? "{0," + attrDecimal + "}" : "*";
                            decimalExp = "(" + separatorExp + "\\d" + decHelpExp + ")";
                        }
                        var exp = new RegExp("^[-]?([0-9])?\\d" + digitExp + decimalExp + "?$");
                        ngModelCtrl.$formatters.push(function (value) {
                            if (!Odin.Util.hasValue(value)) {
                                return value;
                            }
                            return Odin.NumUtil.format(value, { separator: attrSeparator });
                        });
                        ngModelCtrl.$parsers.push(function (value) {
                            if (Odin.StringUtil.isNullOrEmpty(value)) {
                                return convertToNumber ? 0 : "";
                            }
                            if (typeof value === "number") {
                                return value;
                            }
                            var isValid = exp.test(value);
                            var canCalc = (attrMax != '*') && (value != '-');
                            value = value.replace(',', '.');
                            if (canCalc && isValid) {
                                isValid = (parseFloat(value) <= parseInt(value));
                            }
                            if (isValid) {
                                if (convertToNumber) {
                                    try {
                                        if (!(typeof value === "number")) {
                                            var test = value.replace(',', '.');
                                            if (test.indexOf(".") >= 0) {
                                                var floatVal = parseFloat(test);
                                                return floatVal;
                                            }
                                            else {
                                                var intVal = parseInt(test);
                                                return intVal;
                                            }
                                        }
                                    }
                                    catch (ex) {
                                        Odin.Log.debug("Failed to parse float or int " + value);
                                    }
                                }
                                return value;
                            }
                            var defaultValue = convertToNumber ? 0 : '';
                            var oldValue = ngModelCtrl.$modelValue || defaultValue;
                            var caretPosition = _this.getCaretPosition(element) - 1;
                            if (oldValue === "") {
                                ngModelCtrl.$viewValue = oldValue;
                            }
                            else {
                                var converted = Odin.NumUtil.format(oldValue);
                                ngModelCtrl.$setViewValue(converted);
                            }
                            ngModelCtrl.$render();
                            if (!angular.isUndefined(caretPosition))
                                _this.setCaretPosition(element, caretPosition);
                            return oldValue;
                        });
                        element.bind('keypress', function (event) {
                            if (event.keyCode === 32) {
                                event.preventDefault();
                            }
                        });
                    }
                };
            });
        };
        NumberDirective.getCaretPosition = function (element) {
            var input = element[0];
            var selection = document.selection;
            if (selection) {
                var range = selection.createRange();
                range.moveStart('character', -element.val().length);
                return range.text.length;
            }
            else {
                return input.selectionStart;
            }
        };
        NumberDirective.setCaretPosition = function (element, position) {
            var input = element[0];
            if (input.createTextRange) {
                var textRange = input.createTextRange();
                textRange.collapse(true);
                textRange.moveEnd('character', position);
                textRange.moveStart('character', position);
                textRange.select();
            }
            else {
                input.setSelectionRange(position, position);
            }
        };
        return NumberDirective;
    }());
    Odin.NumberDirective = NumberDirective;
})(Odin || (Odin = {}));
var Odin;
(function (Odin) {
    var Mashup;
    (function (Mashup) {
        var InstanceCtrl = (function () {
            function InstanceCtrl(scope) {
                this.scope = scope;
            }
            InstanceCtrl.prototype.sendEvent = function (target, sourceEvent, parameters) {
                var odinMashupEvent = {
                    "targetName": target,
                    "eventName": sourceEvent,
                    "parameters": parameters
                };
                this.scope.odinMashupInstance.send(odinMashupEvent);
            };
            InstanceCtrl.$inject = ["$scope"];
            return InstanceCtrl;
        }());
        Mashup.InstanceCtrl = InstanceCtrl;
        var Instance = (function () {
            function Instance() {
                this.receive = new Odin.InstanceEvent();
            }
            Instance.prototype.send = function (msg) { };
            return Instance;
        }());
        Mashup.Instance = Instance;
        var Directive = (function () {
            function Directive() {
                this.name = "odinMashup";
            }
            Directive.add = function (m) {
                var directive = new Directive();
                m.directive(directive.name, function () {
                    return directive.create();
                });
            };
            Directive.prototype.create = function () {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: {
                        id: "@",
                        eventCallback: "&",
                        src: "@",
                    },
                    controller: function ($scope) {
                        var mashupInstance = new Instance();
                        $scope.$parent.odinMashupInstance = mashupInstance;
                        mashupInstance.send = function (event) {
                            var msg = {
                                "type": "OdinMashupEvent",
                                "data": event
                            };
                            var iframe = document.getElementById($scope.id).contentWindow;
                            iframe.postMessage(msg, "*");
                        };
                        $scope.receiveMessage = function (e) {
                            if (e.data.type == "OdinMashupEvent") {
                                var params = e.data.data.parameters;
                                var paramDict = {};
                                params.forEach(function (element, index, array) {
                                    paramDict[element.targetKey] = element.value;
                                });
                                e.data.data.parameters = paramDict;
                                $scope.eventCallback({ "e": e.data.data });
                            }
                            else {
                                $scope.eventCallback({ "e": e.data });
                            }
                        };
                        window.addEventListener("message", $scope.receiveMessage, false);
                    },
                    template: '<iframe id="" src=""></iframe>'
                };
            };
            return Directive;
        }());
        Mashup.Directive = Directive;
        var ControlDirective = (function () {
            function ControlDirective() {
                this.name = "odinMashupControl";
            }
            ControlDirective.createIFrame = function () {
                return $("<iframe />").attr("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms").attr("seamless", "seamless").attr("frameborder", "0");
            };
            ControlDirective.add = function (m) {
                m.directive("odinMashupControl", ["$rootScope", function (rootScope) {
                        return {
                            scope: false,
                            link: function (scope, element, attributes, controller, transclude) {
                                var init = function () {
                                    var options = scope.$eval(attributes["options"]);
                                    var controlOptions = options.getOptions();
                                    if (controlOptions && controlOptions.url) {
                                        var iframe = ControlDirective.createIFrame();
                                        iframe.attr("src", controlOptions.url);
                                        var className = attributes["iframeClass"];
                                        if (className) {
                                            iframe.addClass(className);
                                        }
                                        else {
                                            iframe.css({
                                                position: "absolute",
                                                width: "100%",
                                                height: "100%",
                                                left: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                            });
                                        }
                                        var frameElement = iframe[0];
                                        frameElement.onload = function () {
                                            options.onFrame(frameElement);
                                        };
                                        element.append(iframe);
                                    }
                                };
                                var unregister = rootScope.$watch(Odin.StartupState.ready, function (isReady) {
                                    if (isReady) {
                                        unregister();
                                        init();
                                    }
                                });
                            }
                        };
                    }]);
            };
            return ControlDirective;
        }());
        Mashup.ControlDirective = ControlDirective;
        (function (ControlStatus) {
            ControlStatus[ControlStatus["Pending"] = 0] = "Pending";
            ControlStatus[ControlStatus["Initializing"] = 1] = "Initializing";
            ControlStatus[ControlStatus["Initialized"] = 2] = "Initialized";
            ControlStatus[ControlStatus["Running"] = 3] = "Running";
            ControlStatus[ControlStatus["Busy"] = 4] = "Busy";
            ControlStatus[ControlStatus["Failed"] = 5] = "Failed";
        })(Mashup.ControlStatus || (Mashup.ControlStatus = {}));
        var ControlStatus = Mashup.ControlStatus;
        var ControlCtrl = (function () {
            function ControlCtrl(scope) {
                var _this = this;
                this.registeredEvents = [];
                this.isInitialized = false;
                this.status = ControlStatus.Pending;
                window.addEventListener("message", function (m) { return _this.receiveMessage(m); }, false);
            }
            ControlCtrl.prototype.getOptions = function () {
                var _this = this;
                return {
                    onFrame: function (f) { return _this.onFrame(f); },
                    getOptions: function () {
                        var options = _this.onGetOptions();
                        _this.controlOptions = options;
                        _this.controlId = options.webControl.id;
                        return options;
                    }
                };
            };
            ControlCtrl.prototype.onFrame = function (iframe) {
                this.iframe = iframe;
                if (this.controlOptions) {
                    var webControl = this.controlOptions.webControl;
                    if (!webControl.url) {
                        webControl.url = this.controlOptions.url;
                    }
                    var message = {
                        type: "MashupInitialize",
                        data: {
                            webControl: webControl
                        }
                    };
                    this.postMessage(message);
                }
            };
            ControlCtrl.prototype.onGetOptions = function () {
                return null;
            };
            ControlCtrl.prototype.registerEvents = function (events) {
                var _this = this;
                events.forEach(function (element, index, array) {
                    _this.registeredEvents.push(element);
                });
            };
            ControlCtrl.prototype.onInitialized = function () {
            };
            ControlCtrl.prototype.postMessage = function (event) {
                this.iframe.contentWindow.postMessage(event, "*");
            };
            ControlCtrl.prototype.raiseEvent = function (event) {
                if (this.status == ControlStatus.Initialized || this.status == ControlStatus.Running) {
                    var message = {
                        type: "MashupLoad",
                        data: event
                    };
                    this.iframe.contentWindow.postMessage(message, "*");
                    return true;
                }
                return false;
            };
            ControlCtrl.prototype.raiseGetValuesEvent = function (eventRegistration) {
                var message = {
                    type: "MashupGetValues",
                    data: {
                        parameters: eventRegistration.parameters,
                        sourceName: this.controlId,
                        sourceEventName: eventRegistration.sourceEventName,
                        targetName: "MashupFramework"
                    }
                };
                this.postMessage(message);
            };
            ControlCtrl.prototype.getEventInfo = function (name) {
                var events = this.registeredEvents;
                for (var i = 0; i < events.length; i++) {
                    var event = events[i];
                    if (event.sourceEventName === name) {
                        return event;
                    }
                }
                return null;
            };
            ControlCtrl.prototype.receiveMessage = function (message) {
                var eventInfo;
                var eventMessage = JSON.parse(message.data);
                if (eventMessage.id == this.controlId) {
                    if (eventMessage.type == "MashupSetStatus") {
                        var status = eventMessage.data;
                        this.status = status;
                        if (ControlStatus.Initialized == status) {
                            this.isInitialized = true;
                            this.onInitialized();
                        }
                    }
                    else if (eventMessage.type == "MashupEvent") {
                        eventInfo = this.getEventInfo(eventMessage.data);
                        if (eventInfo != null) {
                            this.raiseGetValuesEvent(eventInfo);
                        }
                    }
                    else if (eventMessage.type == "MashupEventValues") {
                        var event = eventMessage.data;
                        eventInfo = this.getEventInfo(event.sourceEventName);
                        if (eventInfo && eventInfo.onEvent) {
                            eventInfo.onEvent(event);
                        }
                    }
                }
            };
            ControlCtrl.$inject = ["$scope"];
            return ControlCtrl;
        }());
        Mashup.ControlCtrl = ControlCtrl;
        ;
    })(Mashup = Odin.Mashup || (Odin.Mashup = {}));
})(Odin || (Odin = {}));
var Odin;
(function (Odin) {
    var StartupState = (function () {
        function StartupState(rootScope, applicationService, messageService) {
            this.rootScope = rootScope;
            this.applicationService = applicationService;
            this.messageService = messageService;
            this.logPrefix = "[Odin.StartupState] ";
            this.isReady = false;
            this.error = null;
        }
        StartupState.prototype.setReady = function () {
            if (this.isReady) {
            }
            this.isReady = true;
            this.rootScope[StartupState.ready] = true;
            this.applicationService.setActive();
            Odin.Log.info(this.logPrefix + "Ready");
        };
        StartupState.prototype.setError = function (error) {
            this.applicationService.setState(ApplicationState.Error);
            this.error = error;
        };
        StartupState.prototype.getError = function () {
            return this.error;
        };
        StartupState.prototype.hasError = function () {
            return this.error ? true : false;
        };
        StartupState.prototype.showErrorMessage = function (header, message) {
            var errorMessage = this.error;
            if (!errorMessage) {
                errorMessage = {};
            }
            if (header) {
                errorMessage.header = header;
            }
            if (message) {
                errorMessage.message = message;
            }
            errorMessage.type = Odin.MessageType.Error;
            this.messageService.show(errorMessage);
        };
        StartupState.ready = "odinReady";
        return StartupState;
    }());
    Odin.StartupState = StartupState;
    var LanguageService = (function () {
        function LanguageService(q, http) {
            this.q = q;
            this.http = http;
            this.logPrefix = "[LanguageService] ";
            this.pending = [];
            this.isReady = false;
            this.language = new Odin.Language();
            angular.extend(this.language, {
                OK: "OK",
                Cancel: "Cancel",
                Yes: "Yes",
                No: "No"
            });
        }
        LanguageService.add = function (m) {
            m.service("odinLanguageService", LanguageService);
        };
        LanguageService.prototype.tryGet = function () {
            return this.language;
        };
        LanguageService.prototype.get = function () {
            var deferred = this.q.defer();
            if (this.isReady) {
                deferred.resolve(this.language);
            }
            else {
                this.pending.push(deferred);
            }
            return deferred.promise;
        };
        LanguageService.prototype.getUrl = function (languageCode, filename) {
            return Odin.Framework.getPath() + "/localization/" + languageCode + "/" + filename;
        };
        LanguageService.prototype.resolve = function (deferred) {
            this.isReady = true;
            deferred.resolve(this.language);
            for (var i = 0; i < this.pending.length; i++) {
                this.pending[i].resolve(this.language);
            }
        };
        LanguageService.prototype.reject = function (deferred, url, response) {
            var message = "Failed to load language. Status: " + response.status + " URL: " + url;
            Odin.Log.error(message);
            var language = new Odin.Language();
            language.errorMessage = message;
            deferred.reject(language);
            for (var i = 0; i < this.pending.length; i++) {
                this.pending[i].reject(language);
            }
        };
        LanguageService.prototype.loadFiles = function (deferred, files) {
            var _this = this;
            var url = files[0];
            files = files.slice(1);
            Odin.Log.debug(this.logPrefix + "Loading file " + url);
            this.http.get(url).then(function (r) {
                var data = r.data;
                angular.extend(_this.language, data);
                if (files.length > 0) {
                    _this.loadFiles(deferred, files);
                }
                else {
                    _this.resolve(deferred);
                }
            }, function (r) {
                _this.reject(deferred, url, r);
            });
        };
        LanguageService.prototype.load = function (options) {
            var deferred = this.q.defer();
            if (options.standard !== false) {
                options.standard = true;
            }
            var languageCode = options.language;
            if (!languageCode) {
                languageCode = "en-US";
            }
            var url;
            var files = [];
            if (options.application) {
                var name = options.applicationFilename;
                if (!name) {
                    name = "application.js";
                }
                url = this.getUrl(languageCode, name);
                files.push(url);
            }
            if (options.standard) {
                url = this.getUrl(languageCode, "standard.js");
                files.push(url);
            }
            if (files.length > 0) {
                this.loadFiles(deferred, files);
            }
            else {
                this.resolve(deferred);
            }
            return deferred.promise;
        };
        LanguageService.$inject = ["$q", "$http"];
        return LanguageService;
    }());
    var StorageService = (function () {
        function StorageService() {
            this.logPrefix = "[StorageService] ";
            this.keyPrefix = "odin-";
            this.nameSessionStorage = "sessionStorage";
            this.nameLocalStorage = "localStorage";
            this.nameApplicationStorage = "applicationStorage";
            this.applicationStorage = {};
        }
        StorageService.prototype.getKey = function (key) {
            if (!key) {
                throw "Missing key";
            }
            return this.keyPrefix + key;
        };
        StorageService.prototype.getLocal = function (key, defaultValue) {
            return this.getValueFromStorage(key, localStorage, this.nameLocalStorage, defaultValue);
        };
        StorageService.prototype.setLocal = function (key, value) {
            this.setValueInStorage(key, value, localStorage, this.nameLocalStorage);
        };
        StorageService.prototype.getSession = function (key, defaultValue) {
            return this.getValueFromStorage(key, sessionStorage, this.nameSessionStorage, defaultValue);
        };
        StorageService.prototype.setSession = function (key, value) {
            this.setValueInStorage(key, value, sessionStorage, this.nameSessionStorage);
        };
        StorageService.prototype.setValueInStorage = function (key, value, storage, storageName) {
            var name = this.getKey(key);
            if (storage) {
                try {
                    if (storageName === this.nameApplicationStorage) {
                        storage[name] = value;
                    }
                    else if (storageName === this.nameSessionStorage) {
                        storage[name] = JSON.stringify(value);
                    }
                    else if (storageName === this.nameLocalStorage) {
                        storage.setItem(name, JSON.stringify(value));
                    }
                    Odin.Log.debug(this.logPrefix + "Saved value: " + value + " in " + storageName);
                }
                catch (e) {
                    Odin.Log.warning(this.logPrefix + "Failed to store " + value + " in " + storageName);
                }
            }
            else {
                Odin.Log.warning(this.logPrefix + "No " + storageName + " available");
            }
        };
        StorageService.prototype.getValueFromStorage = function (key, storage, storageName, defaultValue) {
            var name = this.getKey(key);
            var resultValue = null;
            if (storage) {
                try {
                    resultValue = storageName == this.nameLocalStorage ? storage.getItem(name) : storage[name];
                    if (resultValue) {
                        Odin.Log.debug(this.logPrefix + "Key: " + key + " found in " + storageName + ", value: " + resultValue);
                        if (storageName === this.nameApplicationStorage) {
                            return resultValue;
                        }
                        else {
                            return JSON.parse(resultValue);
                        }
                    }
                    else {
                        Odin.Log.debug(this.logPrefix + "Key: " + key + " does not exist in " + storageName);
                        return defaultValue != null ? defaultValue : null;
                    }
                }
                catch (e) {
                    Odin.Log.warning(this.logPrefix + "Failed to get key: " + key + ", value:" + resultValue + " in " + storageName);
                }
            }
            else {
                Odin.Log.warning(this.logPrefix + "No " + storageName + " available");
            }
            return null;
        };
        StorageService.prototype.getApplication = function (key, defaultValue) {
            return this.getValueFromStorage(key, this.applicationStorage, this.nameApplicationStorage, defaultValue);
        };
        StorageService.prototype.setApplication = function (key, value) {
            this.setValueInStorage(key, value, this.applicationStorage, this.nameApplicationStorage);
        };
        StorageService.prototype.clearLocalStorage = function () {
            var _this = this;
            var length = this.keyPrefix.length;
            Object.keys(localStorage)
                .forEach(function (key) {
                if (key.substring(0, length) == _this.keyPrefix) {
                    localStorage.removeItem(key);
                }
            });
            Odin.Log.debug(this.logPrefix + "Removed all odin- items from Local Storage");
        };
        StorageService.prototype.clearApplicationStorage = function () {
            this.applicationStorage = {};
            Odin.Log.debug(this.logPrefix + "Cleared Application Storage");
        };
        StorageService.prototype.clearSessionStorage = function () {
            var _this = this;
            var length = this.keyPrefix.length;
            Object.keys(sessionStorage)
                .forEach(function (key) {
                var b = _this.keyPrefix;
                if (key.substring(0, length) == _this.keyPrefix) {
                    sessionStorage.removeItem(key);
                }
            });
            Odin.Log.debug(this.logPrefix + "Removed all odin- items from  Session Storage");
        };
        StorageService.prototype.deleteKeyLocalStorage = function (key) {
            localStorage.removeItem(this.getKey(key));
            Odin.Log.debug(this.logPrefix + "Removed key: " + key + "from Local Storage");
        };
        StorageService.prototype.deleteKeyApplicationStorage = function (key) {
            delete this.applicationStorage[this.getKey(key)];
            Odin.Log.debug(this.logPrefix + "Removed key: " + key + "from Application Storage");
        };
        StorageService.prototype.deleteKeySessionStorage = function (key) {
            sessionStorage.removeItem(this.getKey(key));
            Odin.Log.debug(this.logPrefix + "Removed key: " + key + "from Session Storage");
        };
        StorageService.add = function (m) {
            m.service("odinStorageService", StorageService);
        };
        return StorageService;
    }());
    var BrowseConstants = (function () {
        function BrowseConstants() {
        }
        BrowseConstants.browseGridTemplateName = "odin/partials/gridBrowse.html";
        BrowseConstants.browseGenericTemplateName = "odin/partials/genericBrowse.html";
        BrowseConstants.modalMessageTemplate = "odin/partials/modalMessage.html";
        return BrowseConstants;
    }());
    Odin.BrowseConstants = BrowseConstants;
    var BrowseService = (function () {
        function BrowseService(modal, q) {
            this.modal = modal;
            this.q = q;
        }
        BrowseService.add = function (m) {
            m.service("odinBrowseService", BrowseService);
        };
        BrowseService.prototype.browse = function (options) {
            var templateUrl = options.templateUrl ? Odin.BrowseConstants.browseGenericTemplateName : Odin.BrowseConstants.browseGridTemplateName;
            var browseOptions = angular.copy(options);
            var promise = this.modal.open({
                templateUrl: templateUrl,
                controller: DefaultBrowseCtrl,
                backdrop: 'static',
                resolve: {
                    browseOptions: function () {
                        return browseOptions;
                    }
                }
            }).result;
            return promise;
        };
        BrowseService.$inject = ["$uibModal", "$q"];
        return BrowseService;
    }());
    Odin.BrowseService = BrowseService;
    var BrowseUtil = (function () {
        function BrowseUtil() {
        }
        BrowseUtil.setSelectedItem = function (scope, item) {
            this.setSelectedItemInternal(scope, item);
        };
        BrowseUtil.close = function (scope, item) {
            var resultObject = scope[BrowseUtil.selectedItemKeyInternal];
            if (resultObject && resultObject.hasOwnProperty("close")) {
                resultObject.close(item);
            }
            else {
                Odin.Log.debug("Can not find odinBrowseResult");
            }
        };
        BrowseUtil.setSelectedItemInternal = function (scope, item) {
            if (scope) {
                var resultObject = scope[BrowseUtil.selectedItemKeyInternal];
                if (resultObject && resultObject.hasOwnProperty("selectedItem")) {
                    resultObject.selectedItem = item;
                }
                else {
                    var parent = scope.$parent;
                    if (parent) {
                        this.setSelectedItemInternal(parent, item);
                    }
                }
            }
        };
        BrowseUtil.selectedItemKeyInternal = "odinBrowseResult";
        return BrowseUtil;
    }());
    Odin.BrowseUtil = BrowseUtil;
    (function (ApplicationState) {
        ApplicationState[ApplicationState["Pending"] = 0] = "Pending";
        ApplicationState[ApplicationState["Active"] = 1] = "Active";
        ApplicationState[ApplicationState["Busy"] = 2] = "Busy";
        ApplicationState[ApplicationState["Error"] = 3] = "Error";
    })(Odin.ApplicationState || (Odin.ApplicationState = {}));
    var ApplicationState = Odin.ApplicationState;
    var ComponentContext = (function () {
        function ComponentContext(componentService, options) {
            var _this = this;
            this.componentService = componentService;
            this.nameOdinBusy = "odinBusy";
            this.busy = false;
            this.busyEvent = new Odin.InstanceEvent();
            this.activeEvent = new Odin.InstanceEvent();
            this.stateEvent = new Odin.InstanceEvent();
            this.visibleEvent = new Odin.InstanceEvent();
            this.id = 0;
            this.scope = options.scope;
            this._isVisible = true;
            this.state = Odin.ComponentState.Active;
            this.id = ComponentContext.counter++;
            var visualState = options.visualState;
            if (visualState) {
                this.isVisualState = true;
                visualState.activeChanged().on(function (isActive) {
                    _this.setVisible(isActive);
                });
            }
            else {
                this.isVisualState = options.isVisualState;
                if (this.isVisualState) {
                    options.scope.$parent.$watch("odinVisualState.isActive", function (isActive) {
                        if (!Odin.Util.isUndefined(isActive)) {
                            _this.setVisible(isActive);
                        }
                    });
                }
            }
        }
        ComponentContext.prototype.raise = function (event) {
            this.componentService.raise(event);
        };
        ComponentContext.prototype.raiseEvent = function (eventName, eventParameter) {
            this.componentService.raiseEvent(eventName, eventParameter);
        };
        ComponentContext.prototype.getPendingEvent = function () {
            return this.pendingEvent;
        };
        ComponentContext.prototype.setPendingEvent = function (e) {
            this.pendingEvent = e;
        };
        ComponentContext.prototype.stateChanged = function () {
            return this.stateEvent;
        };
        ComponentContext.prototype.setActiveState = function (name) {
            this.setState(Odin.ComponentState.Active, name);
        };
        ComponentContext.prototype.setBusyState = function (name) {
            this.setState(Odin.ComponentState.Busy, name);
        };
        ComponentContext.prototype.getContext = function (name) {
            return this.componentService.getContext(name);
        };
        ComponentContext.prototype.setState = function (state, name) {
            if (name) {
                var context = this.getContext(name);
                if (context) {
                    context.setState(state);
                }
                return;
            }
            if (this.state != state) {
                var wasActive = this.isActive();
                this.state = state;
                this.scope[this.nameOdinBusy] = state == Odin.ComponentState.Busy;
                this.stateEvent.raise(this.state);
                this.raiseActive(wasActive);
            }
        };
        ComponentContext.prototype.getState = function (name) {
            if (name) {
                var context = this.getContext(name);
                if (context) {
                    return context.getState();
                }
                return null;
            }
            return this.state;
        };
        ComponentContext.prototype.isBusy = function (name) {
            return this.getState(name) === Odin.ComponentState.Busy;
        };
        ComponentContext.prototype.activeChanged = function () {
            return this.activeEvent;
        };
        ComponentContext.prototype.isActive = function (name) {
            var context = (name ? this.getContext(name) : this);
            return context ? context.state === Odin.ComponentState.Active && context._isVisible : null;
        };
        ComponentContext.prototype.visibleChanged = function () {
            return this.visibleEvent;
        };
        ComponentContext.prototype.isVisible = function (name) {
            var context = (name ? this.getContext(name) : this);
            return context ? context._isVisible : null;
        };
        ComponentContext.prototype.setVisible = function (isVisible, name) {
            if (name) {
                var context = this.getContext(name);
                if (context) {
                    context.setVisible(isVisible);
                }
                return;
            }
            if (this._isVisible != isVisible) {
                var wasActive = this.isActive();
                this._isVisible = isVisible;
                this.visibleEvent.raise(isVisible);
                this.raiseActive(wasActive);
            }
        };
        ComponentContext.prototype.raiseActive = function (wasActive) {
            var isActive = this.isActive();
            if (wasActive !== isActive) {
                this.activeEvent.raise(isActive);
            }
        };
        ComponentContext.counter = 0;
        return ComponentContext;
    }());
    var ApplicationService = (function () {
        function ApplicationService(rootScope) {
            this.rootScope = rootScope;
            this.logPrefix = "[ApplicationService] ";
            this.nameBusy = "odinApplicationBusy";
            this.state = ApplicationState.Pending;
        }
        ApplicationService.add = function (m) {
            m.service("odinApplicationService", ApplicationService);
        };
        ApplicationService.prototype.setState = function (state) {
            if (this.state != state) {
                this.state = state;
                this.rootScope[this.nameBusy] = state == ApplicationState.Busy;
            }
        };
        ApplicationService.prototype.getState = function () {
            return this.state;
        };
        ApplicationService.prototype.setActive = function () {
            this.setState(ApplicationState.Active);
        };
        ApplicationService.prototype.isActive = function () {
            return this.state == ApplicationState.Active;
        };
        ApplicationService.prototype.setBusy = function () {
            this.setState(ApplicationState.Busy);
        };
        ApplicationService.prototype.isBusy = function () {
            return this.state == ApplicationState.Busy;
        };
        ApplicationService.$inject = ["$rootScope"];
        return ApplicationService;
    }());
    var ComponentService = (function () {
        function ComponentService(rootScope) {
            this.rootScope = rootScope;
            this.logPrefix = "[ComponentService] ";
            this.events = {};
            this.namedComponents = {};
        }
        ComponentService.add = function (m) {
            m.service("odinComponentService", ComponentService);
        };
        ComponentService.prototype.getContext = function (name) {
            return this.namedComponents[name];
        };
        ComponentService.prototype.setComponentState = function (state, name) {
            var context = this.namedComponents[name];
            if (context) {
                context.setState(state);
            }
        };
        ComponentService.prototype.raise = function (event) {
            Odin.Log.debug(this.logPrefix + "Raising event " + event.eventName);
            this.rootScope.$broadcast(event.eventName, event);
        };
        ComponentService.prototype.raiseEvent = function (eventName, eventParameter) {
            this.raise({ eventName: eventName, parameter: eventParameter });
        };
        ComponentService.prototype.canDeliver = function (eventInfo) {
            return eventInfo.alwaysReceive || eventInfo.context.isActive();
        };
        ComponentService.prototype.deliverPending = function (context) {
            var event = context.getPendingEvent();
            if (event && context.isActive()) {
                this.deliverEvent(event.eventInfo, event);
                context.setPendingEvent(null);
            }
        };
        ComponentService.prototype.register = function (options) {
            var _this = this;
            var s = options;
            if (s.isVisualState !== false) {
                s.isVisualState = true;
            }
            var context = new ComponentContext(this, options);
            var name = options.name;
            if (name) {
                if (this.namedComponents[name]) {
                    throw "The component " + name + " has already been registered.";
                }
                this.namedComponents[name] = context;
            }
            if (options.events) {
                for (var i = 0; i < options.events.length; i++) {
                    var event = options.events[i];
                    if (!event.eventName) {
                        throw "Property eventName not set";
                    }
                    if (!event.onEvent) {
                        throw "Property onEvent not set";
                    }
                    this.subscribeEvent(options, context, event);
                }
                context.activeChanged().on(function (isActive) {
                    if (isActive) {
                        _this.deliverPending(context);
                    }
                });
            }
            return context;
        };
        ComponentService.prototype.subscribeEvent = function (options, context, eventInfo) {
            var _this = this;
            eventInfo.context = context;
            eventInfo.isVisualState = options.isVisualState;
            var name = eventInfo.eventName;
            var eventList = this.events[name];
            if (!eventList) {
                eventList = [];
                this.events[name] = eventList;
                this.rootScope.$on(name, function (ae, e) {
                    _this.onEvent(ae, e);
                });
            }
            eventList.push(eventInfo);
        };
        ComponentService.prototype.onEvent = function (ae, event) {
            var name = event.eventName;
            if (Odin.StringUtil.isNullOrEmpty(name)) {
                var wrapper = {
                    eventName: name,
                    parameter: event
                };
                event = wrapper;
            }
            var eventList = this.events[name];
            if (!eventList) {
                return;
            }
            for (var i = 0; i < eventList.length; i++) {
                var eventInfo = eventList[i];
                if (this.canDeliver(eventInfo)) {
                    this.deliverEvent(eventInfo, event);
                }
                else {
                    var pendingEvent = angular.copy(event);
                    pendingEvent.eventInfo = eventInfo;
                    eventInfo.context.setPendingEvent(pendingEvent);
                    Odin.Log.debug(this.logPrefix + "Delayed delivery of event " + pendingEvent.eventName);
                }
            }
        };
        ComponentService.prototype.deliverEvent = function (eventInfo, event) {
            if (eventInfo.onEvent) {
                try {
                    Odin.Log.debug(this.logPrefix + "Delivering event " + event.eventName);
                    eventInfo.onEvent(event);
                }
                catch (ex) {
                    Odin.Log.error(this.logPrefix + "Failed to deliver event " + event.eventName, ex);
                }
            }
        };
        ComponentService.prototype.setBusyIndicator = function (scope, isBusy) {
            scope["odinBusy"] = isBusy;
        };
        ComponentService.$inject = ["$rootScope"];
        return ComponentService;
    }());
    var VisualState = (function () {
        function VisualState(scope) {
            this.scope = scope;
            this.isActive = false;
            this.isActivated = false;
            this.children = [];
            this.id = 0;
            this.activeEvent = new Odin.InstanceEvent();
            this.updateScope();
            this.attachToParent(scope.$parent);
            this.id = VisualState.counter++;
        }
        VisualState.prototype.activeChanged = function () {
            return this.activeEvent;
        };
        VisualState.prototype.updateScope = function () {
            this.scope[VisualState.scopeName] = null;
            this.scope[VisualState.scopeName] = this;
        };
        VisualState.prototype.addChild = function (child) {
            this.children.push(child);
        };
        VisualState.prototype.isActiveInScope = function (scope) {
            if (scope) {
                var tabSelect = scope[VisualState.scopeName];
                if (tabSelect && !tabSelect.isActive) {
                    return false;
                }
                return this.isActiveInScope(scope.$parent);
            }
            return true;
        };
        VisualState.prototype.attachToParent = function (scope) {
            if (scope) {
                var ctrl = scope[VisualState.scopeName];
                if (ctrl) {
                    ctrl.addChild(this);
                    return;
                }
                this.attachToParent(scope.$parent);
            }
        };
        VisualState.prototype.activate = function () {
            this.isActivated = true;
            if (this.isActiveInScope(this.scope.$parent)) {
                this.isActive = true;
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].activateChild();
                }
            }
            this.updateScope();
            this.activeEvent.raise(true);
        };
        VisualState.prototype.deactivate = function () {
            this.isActivated = false;
            this.isActive = false;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].deactivateChild();
            }
            this.updateScope();
            this.activeEvent.raise(false);
        };
        VisualState.prototype.activateChild = function () {
            if (this.isActivated) {
                this.isActive = true;
            }
        };
        VisualState.prototype.deactivateChild = function () {
            if (this.isActive) {
                this.isActive = false;
            }
        };
        VisualState.scopeName = "odinVisualState";
        VisualState.counter = 0;
        return VisualState;
    }());
    Odin.VisualState = VisualState;
    var VisualStateCtrl = (function () {
        function VisualStateCtrl(scope) {
            this.scope = scope;
            this.visualState = new VisualState(scope);
        }
        VisualStateCtrl.add = function (m) {
            m.controller("OdinVisualStateCtrl", VisualStateCtrl);
        };
        VisualStateCtrl.prototype.activate = function () {
            this.visualState.activate();
        };
        VisualStateCtrl.prototype.deactivate = function () {
            this.visualState.deactivate();
        };
        VisualStateCtrl.$inject = ["$scope"];
        return VisualStateCtrl;
    }());
    Odin.VisualStateCtrl = VisualStateCtrl;
    var TabCtrl = (function () {
        function TabCtrl(scope) {
            this.scope = scope;
        }
        TabCtrl.add = function (m) {
            m.controller("OdinTabCtrl", TabCtrl);
        };
        TabCtrl.prototype.select = function () {
            this.visualState.activate();
        };
        TabCtrl.prototype.deselect = function () {
            this.visualState.deactivate();
        };
        TabCtrl.$inject = ["$scope"];
        return TabCtrl;
    }());
    Odin.TabCtrl = TabCtrl;
    var NavbarDirective = (function () {
        function NavbarDirective() {
        }
        NavbarDirective.add = function (m) {
            m.directive('odinNavbar', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: true,
                    scope: {
                        header: "@",
                        theme: "@"
                    },
                    template: "<nav class='navbar navbar-default navbar-static-top' role='navigation'><div class='navbar-header'>" +
                        "<button type='button' class='navbar-toggle' ng-init='navbarCollapsed=true' ng-click='navbarCollapsed=!navbarCollapsed'>" +
                        "<span class='sr-only'>Toggle navigation</span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span></button>" +
                        "<a class='navbar-brand' href='#/'>{{header}}</a></div><div class='collapse navbar-collapse' ng-class='!navbarCollapsed && \"in\"'>" +
                        "<ul class='nav navbar-nav navbar-right' ng-show='{{theme}}'><li class='dropdown' uib-dropdown><a href='#' class='dropdown-toggle' uib-dropdown-toggle>Theme <span class='caret'></span></a>" +
                        "<ul class='dropdown-menu' uib-dropdown-menu role='menu'>" +
                        "<li><a href='javascript:void(0);' onclick='var element=document.querySelector(\"#odin-theme\");element.setAttribute(\"href\", element.getAttribute(\"href\").replace(\"bootstrap\", \"default\"));var xi=document.querySelector(\"#xi-theme\");xi.disabled=true;'>Odin</a></li>" +
                        "<li><a href='javascript:void(0);' onclick='var element=document.querySelector(\"#odin-theme\");element.setAttribute(\"href\", element.getAttribute(\"href\").replace(\"default\", \"bootstrap\"));var xi=document.querySelector(\"#xi-theme\");xi.disabled=true;'>Bootstrap</a></li>" +
                        "<li><a href='javascript:void(0);' onclick='var element=document.querySelector(\"#odin-theme\");element.setAttribute(\"href\", element.getAttribute(\"href\").replace(\"bootstrap\", \"default\"));var xi=document.querySelector(\"#xi-theme\");xi.disabled=false;'>Xi</a></li></ul></li></ul><div ng-transclude></div></div></nav>"
                };
            });
        };
        return NavbarDirective;
    }());
    Odin.NavbarDirective = NavbarDirective;
    var DefaultListCtrlOptions = (function () {
        function DefaultListCtrlOptions() {
            this.scopeNameGridOptions = "gridOptions";
            this.scopeNameGridData = "items";
            this.configureGrid = true;
        }
        DefaultListCtrlOptions.get = function (options) {
            var result = new DefaultListCtrlOptions();
            if (!options) {
                return result;
            }
            angular.extend(result, options);
            return result;
        };
        return DefaultListCtrlOptions;
    }());
    Odin.DefaultListCtrlOptions = DefaultListCtrlOptions;
    var BaseCtrl = (function () {
        function BaseCtrl(scope, odinService, baseCtrlOptions) {
            var _this = this;
            if (baseCtrlOptions === void 0) { baseCtrlOptions = null; }
            this.baseCtrlOptions = baseCtrlOptions;
            this.prefixBaseCtrl = "[Odin.BaseCtrl] ";
            this.baseScope = scope;
            this.odinService = odinService;
            this.rootScope = odinService.rootScope;
            this.componentService = odinService.componentService;
            var unregister = this.rootScope.$watch(StartupState.ready, function (isReady) {
                if (isReady) {
                    unregister();
                    _this.ctrlInit();
                }
            });
        }
        BaseCtrl.prototype.ctrlInit = function () {
            if (this.isInitialized) {
                throw "Already initialized";
            }
            this.isInitialized = true;
            Odin.Log.debug(this.prefixBaseCtrl + "Initialize");
            this.onReady();
        };
        BaseCtrl.prototype.registerComponent = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            if (this.componentContext) {
                throw "A component context has already been registered";
            }
            if (!options.scope) {
                options.scope = this.baseScope;
            }
            var context = this.componentService.register(options);
            context.activeChanged().on(function (a) { return _this.onActive(a); });
            this.componentContext = context;
            return this.componentContext;
        };
        BaseCtrl.prototype.getComponentContext = function () {
            if (!this.componentContext) {
                this.registerComponent();
            }
            return this.componentContext;
        };
        BaseCtrl.prototype.onActive = function (isActive) {
        };
        BaseCtrl.prototype.setBusy = function () {
            this.getComponentContext().setBusyState();
        };
        BaseCtrl.prototype.isBusy = function () {
            return this.getComponentContext().isBusy();
        };
        BaseCtrl.prototype.setActive = function () {
            this.getComponentContext().setActiveState();
        };
        BaseCtrl.prototype.onReady = function () {
        };
        return BaseCtrl;
    }());
    Odin.BaseCtrl = BaseCtrl;
    var DefaultBrowseCtrl = (function (_super) {
        __extends(DefaultBrowseCtrl, _super);
        function DefaultBrowseCtrl(scope, modalInstance, service, browseOptions) {
            var _this = this;
            _super.call(this, scope, service);
            this.scope = scope;
            this.modalInstance = modalInstance;
            this.service = service;
            this.browseOptions = browseOptions;
            if (!browseOptions) {
                Odin.Log.error("Missing mandatory browseOptions");
                return;
            }
            var lang = service.languageService.tryGet();
            scope["lang"] = lang;
            if (browseOptions.gridOptions) {
                var options = this.browseOptions.gridOptions;
                if (this.browseOptions.items) {
                    options.data = this.browseOptions.items;
                }
                else if (!options.data) {
                    options.data = "items";
                }
                if (!options["onRegisterApi"]) {
                    options["onRegisterApi"] = function (gridApi) {
                        _this.gridApi = gridApi;
                        gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                            _this.afterSelectionChange(row);
                        });
                    };
                }
                var callback = {
                    onDoubleClick: function () {
                        _this.closeWithSelected();
                    }
                };
                this.scope["odin.DoubleClick"] = callback;
                scope.gridOptions = browseOptions.gridOptions;
            }
            scope.options = {
                gridOptions: browseOptions.gridOptions,
                header: browseOptions.header,
                message: browseOptions.message,
                templateUrl: browseOptions.templateUrl
            };
            if (browseOptions.items) {
                scope.items = browseOptions.items;
            }
            scope.ok = function () {
                _this.closeWithSelected();
            };
            scope.cancel = function () {
                Odin.Log.debug("Cancel in dialog. Returning null ");
                _this.modalInstance.close(null);
            };
            scope.close = function (item) {
                Odin.Log.debug("Close called on scope. Returning item " + item);
                _this.modalInstance.close(item);
            };
            var browseResult = {
                selectedItem: null, close: function (item) {
                    _this.modalInstance.close(item);
                }
            };
            scope[BrowseUtil.selectedItemKeyInternal] = browseResult;
        }
        DefaultBrowseCtrl.prototype.closeWithSelected = function () {
            var selctedItem = (this.scope.odinBrowseResult) ? this.scope.odinBrowseResult.selectedItem : null;
            Odin.Log.debug("Selected item on scope is " + selctedItem);
            this.modalInstance.close(selctedItem);
        };
        DefaultBrowseCtrl.prototype.onReady = function () {
        };
        DefaultBrowseCtrl.prototype.afterSelectionChange = function (rowItem) {
            if (!rowItem.isSelected) {
                BrowseUtil.setSelectedItem(this.scope, null);
                return;
            }
            BrowseUtil.setSelectedItem(this.scope, rowItem.entity);
        };
        DefaultBrowseCtrl.add = function (m) {
            m.controller("OdinDefaultBrowseCtrl", DefaultBrowseCtrl);
        };
        DefaultBrowseCtrl.$inject = ["$scope", "$uibModalInstance", "odinService", "browseOptions"];
        return DefaultBrowseCtrl;
    }(BaseCtrl));
    Odin.DefaultBrowseCtrl = DefaultBrowseCtrl;
    var ExpanderDirective = (function () {
        function ExpanderDirective() {
            this.name = "odinExpander";
            this.scopeName = "isExpanded";
        }
        ExpanderDirective.add = function (m) {
            var directive = new ExpanderDirective();
            m.directive(directive.name, ["$compile", function ($compile) {
                    return directive.create($compile);
                }]);
        };
        ExpanderDirective.prototype.create = function ($compile) {
            var _this = this;
            return {
                restrict: "E",
                transclude: true,
                compile: function (element, attrs) {
                    if (!attrs[_this.scopeName]) {
                        attrs[_this.scopeName] = Odin.Util.getUuid("expander");
                    }
                    return null;
                },
                scope: {
                    header: "@",
                    isExpanded: "="
                },
                template: "<fieldset class='odin-expander'><legend ng-click='isExpanded = !isExpanded'><span>{{header}}</span></legend><button type='button' class='odin-expander-button' role='button' ng-class='{\"true\": \"open\", \"false\": \"closed\", undefined: \"closed\"}[isExpanded]' ng-click='isExpanded = !isExpanded'></button><div class='content' uib-collapse='!isExpanded' ng-transclude></div></fieldset>"
            };
        };
        return ExpanderDirective;
    }());
    Odin.ExpanderDirective = ExpanderDirective;
    var FormElementDirective = (function () {
        function FormElementDirective() {
        }
        FormElementDirective.add = function (m) {
            m.directive('odinFormElement', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: true,
                    compile: function (element, attrs) {
                        var formGroup = $("<div />").addClass("form-group");
                        element.append(formGroup);
                        var containerSize = 12;
                        if (attrs["label"]) {
                            if (!attrs["labelSize"]) {
                                attrs["labelSize"] = 3;
                            }
                            containerSize -= attrs["labelSize"];
                            var label = $("<label />").addClass("control-label col-md-" + attrs["labelSize"])
                                .text(attrs["label"])
                                .append($("<span />"));
                            if (attrs["forId"]) {
                                label.attr("for", attrs["forId"]);
                            }
                            if (attrs["labelTooltip"]) {
                                label.attr("title", attrs["labelTooltip"]);
                            }
                            formGroup.append(label);
                        }
                        var transcludeContainer = $("<div />").attr("ng-transclude", "");
                        if (attrs["elementOffset"]) {
                            transcludeContainer.addClass("col-md-offset-" + attrs["elementOffset"]);
                            containerSize -= attrs["elementOffset"];
                        }
                        formGroup.append(transcludeContainer);
                        if (attrs["additional"]) {
                            if (!attrs["additionalSize"]) {
                                attrs["additionalSize"] = 3;
                            }
                            containerSize -= attrs["additionalSize"];
                            formGroup.append($("<label />").addClass("odin-additional-label control-label col-md-" + attrs["additionalSize"])
                                .text(attrs["additional"])
                                .append($("<span />"))
                                .attr("title", attrs["additional"]));
                        }
                        transcludeContainer.addClass("col-md-" + containerSize);
                        return null;
                    },
                    template: "<div></div>"
                };
            });
        };
        return FormElementDirective;
    }());
    Odin.FormElementDirective = FormElementDirective;
    var CheckboxDirective = (function () {
        function CheckboxDirective() {
        }
        CheckboxDirective.add = function (m) {
            m.directive('odinCheckbox', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    compile: function (element, attrs) {
                        if (!attrs["checkboxId"]) {
                            attrs["checkboxId"] = Odin.Util.getUuid("checkbox");
                        }
                        var label = $("<label />");
                        element.append(label);
                        var input = $("<input />").attr({ "type": "checkbox", "ng-checked": "value", "ng-click": "value = !value", "id": attrs["checkboxId"] });
                        if (attrs["name"]) {
                            input.attr("name", attrs["name"]);
                        }
                        label.append(input);
                        if (attrs["isDisabled"]) {
                            if (attrs["isDisabled"] == "true") {
                                input.attr("disabled", "");
                            }
                            else if (attrs["isDisabled"] != "false") {
                                input.attr("ng-disabled", "isDisabled");
                            }
                        }
                        var span = $("<span />").attr("for", attrs["checkboxId"]);
                        label.append(span);
                        if (attrs["label"]) {
                            span.html("{{label}}");
                        }
                        return null;
                    },
                    scope: {
                        checkboxId: "@",
                        value: "=",
                        label: "@",
                        isDisabled: "=",
                        name: "@"
                    },
                    template: '<div class="checkbox"></div>'
                };
            });
        };
        return CheckboxDirective;
    }());
    Odin.CheckboxDirective = CheckboxDirective;
    var RadioDirective = (function () {
        function RadioDirective() {
        }
        RadioDirective.add = function (m) {
            m.directive('odinRadio', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    compile: function (element, attrs) {
                        if (!attrs["radioId"]) {
                            attrs["radioId"] = Odin.Util.getUuid("radio");
                        }
                        var label = $("<label />");
                        element.append(label);
                        var input = $("<input />").attr({ "type": "radio", "ng-checked": "model == value", "ng-click": "model = value", "id": attrs["radioId"], "value": "value" });
                        if (attrs["name"]) {
                            input.attr("name", attrs["name"]);
                        }
                        label.append(input);
                        if (attrs["isDisabled"]) {
                            if (attrs["isDisabled"] == "true") {
                                input.attr("disabled", "");
                            }
                            else if (attrs["isDisabled"] != "false") {
                                input.attr("ng-disabled", "isDisabled");
                            }
                        }
                        var span = $("<span />").attr("for", attrs["radioId"]);
                        label.append(span);
                        if (attrs["label"]) {
                            span.html("{{label}}");
                        }
                        return null;
                    },
                    scope: {
                        radioId: "@",
                        value: "@",
                        label: "@",
                        model: "=",
                        isDisabled: "=",
                        name: "@"
                    },
                    template: '<div class="radio"></div>'
                };
            });
        };
        return RadioDirective;
    }());
    Odin.RadioDirective = RadioDirective;
    var SwitchDirective = (function () {
        function SwitchDirective() {
        }
        SwitchDirective.add = function (m) {
            m.directive('odinSwitch', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    compile: function (element, attrs) {
                        if (!attrs["switchId"]) {
                            attrs["switchId"] = Odin.Util.getUuid("switch");
                        }
                        var input = $("<input />").attr({ "type": "checkbox", "id": attrs["switchId"], "value": "value", "ng-checked": "value", "ng-click": "value = !value" });
                        if (attrs["name"]) {
                            input.attr("name", attrs["name"]);
                        }
                        if (attrs["isDisabled"]) {
                            if (attrs["isDisabled"] == "true") {
                                input.attr("disabled", "");
                            }
                            else if (attrs["isDisabled"] != "false") {
                                input.attr("ng-disabled", "isDisabled");
                            }
                        }
                        element.append(input);
                        var label = $("<label />").attr("for", attrs["switchId"]);
                        element.append(label);
                        var spanOuter = $("<span />").addClass("switch-box");
                        spanOuter.append($("<span />").addClass("switch-inner"));
                        spanOuter.append($("<span />").addClass("switch-switch"));
                        label.append(spanOuter);
                        label.append($("<span />").addClass("switch-label").html("{{label}}"));
                        return null;
                    },
                    scope: {
                        switchId: "@",
                        value: "=",
                        label: "@",
                        isDisabled: "@",
                        name: "@"
                    },
                    template: '<div class="switch"></div>'
                };
            });
        };
        return SwitchDirective;
    }());
    Odin.SwitchDirective = SwitchDirective;
    var InputDirective = (function () {
        function InputDirective() {
        }
        InputDirective.add = function (m) {
            m.directive('odinInput', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    compile: function (element, attrs) {
                        if (!attrs["inputId"]) {
                            attrs["inputId"] = Odin.Util.getUuid("input");
                        }
                        var formGroup = $("<div />").addClass("form-group");
                        element.append(formGroup);
                        var inputSize = 12;
                        if (attrs["label"]) {
                            if (!attrs["labelSize"]) {
                                attrs["labelSize"] = 3;
                            }
                            inputSize -= attrs["labelSize"];
                            var label = $("<label />").addClass("control-label col-md-" + attrs["labelSize"])
                                .text(attrs["label"]).attr("for", attrs["inputId"])
                                .append($("<span />"));
                            if (attrs["labelTooltip"]) {
                                label.attr("title", attrs["labelTooltip"]);
                            }
                            formGroup.append(label);
                        }
                        var inputContainer = $("<div />");
                        if (attrs["inputOffset"]) {
                            inputContainer.addClass("col-md-offset-" + attrs["inputOffset"]);
                            inputSize -= attrs["inputOffset"];
                        }
                        formGroup.append(inputContainer);
                        if (!attrs["value"]) {
                            attrs["value"] = Odin.Util.getUuid("input");
                        }
                        var input = $("<input />").attr({ "ng-model": attrs["value"], "id": attrs["inputId"], "type": "text" }).addClass("form-control");
                        if (attrs["size"]) {
                            input.addClass("odin-input-" + attrs["size"]);
                        }
                        if (attrs["placeholder"]) {
                            input.attr("placeholder", attrs["placeholder"]);
                        }
                        if (attrs["isReadonly"] && attrs["isReadonly"] == "true") {
                            input.attr("readonly", "");
                        }
                        if (attrs["isDisabled"]) {
                            if (attrs["isDisabled"] == "true") {
                                input.attr("disabled", "");
                            }
                            else if (attrs["isDisabled"] != "false") {
                                input.attr("ng-disabled", "isDisabled");
                            }
                        }
                        if (attrs["required"]) {
                            input.attr("ng-required", attrs["required"]);
                        }
                        if (attrs["autofocus"] && attrs["autofocus"] == "true") {
                            input.attr("odin-focus-auto", "");
                        }
                        inputContainer.append(input);
                        if (attrs["additional"]) {
                            if (!attrs["additionalSize"]) {
                                attrs["additionalSize"] = 3;
                            }
                            inputSize -= attrs["additionalSize"];
                            formGroup.append($("<label />").addClass("odin-additional-label control-label col-md-" + attrs["additionalSize"])
                                .attr("title", attrs["additional"]).text(attrs["additional"]).append($("<span />")));
                        }
                        inputContainer.addClass("col-md-" + inputSize);
                        return null;
                    },
                    template: "<div class='col-md-12'></div>"
                };
            });
        };
        return InputDirective;
    }());
    Odin.InputDirective = InputDirective;
    var ExpandableFooterDirective = (function () {
        function ExpandableFooterDirective() {
        }
        ExpandableFooterDirective.add = function (m) {
            m.directive('odinExpandableFooter', function () {
                return {
                    restrict: "E",
                    replace: true,
                    template: "<div><div ng-if='odinExpandableFooter.useOverlay' ng-class='{\"true\": \"odin-position-f-fill\"}[odinExpandableFooter.isExpanded && odinExpandableFooter.useOverlay]' class='odin-expandable-footer-overlay' ng-show='odinExpandableFooter.isExpanded' ng-click='odinExpandableFooter.isExpanded=false'></div><div class='odin-expandable-footer navbar-fixed-bottom'><div class='container-fluid'><div class='row'><div class='col-xs-12 odin-expandable-footer-header odin-cursor-pointer' ng-click='odinExpandableFooter.isExpanded = !odinExpandableFooter.isExpanded'><div class='odin-padding-md-r' ng-include='odinExpandableFooter.headerTemplateUrl'></div><span class='glyphicon' ng-class='{\"false\": \"glyphicon-chevron-up\", \"true\": \"glyphicon-chevron-down\", \"undefined\": \"glyphicon-chevron-up\"}[odinExpandableFooter.isExpanded]'></span></div></div><div class='row odin-expandable-footer-content' uib-collapse='!odinExpandableFooter.isExpanded'><div class='col-xs-12' ng-include='odinExpandableFooter.contentTemplateUrl'></div></div></div></div></div>"
                };
            });
        };
        return ExpandableFooterDirective;
    }());
    Odin.ExpandableFooterDirective = ExpandableFooterDirective;
    var SplashScreenDirective = (function () {
        function SplashScreenDirective() {
        }
        SplashScreenDirective.add = function (m) {
            m.directive('odinSplashScreen', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    scope: {
                        value: "@",
                        description: "@"
                    },
                    template: '<div class="odin-splash-screen"><div class="odin-splash-screen-container"><div class="odin-splash-screen-logo"></div><h1>{{value}}<br></h1><p>{{description}}</p><br><span class="odin-busy-indicator-large"></span></div></div>'
                };
            });
        };
        return SplashScreenDirective;
    }());
    Odin.SplashScreenDirective = SplashScreenDirective;
    var BusyIndicatorDirective = (function () {
        function BusyIndicatorDirective() {
        }
        BusyIndicatorDirective.add = function (m) {
            m.directive('odinBusyIndicator', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    template: '<div class="odin-busy-indicator-parent"><div class="odin-busy-indicator-text"></div></div>'
                };
            });
        };
        return BusyIndicatorDirective;
    }());
    Odin.BusyIndicatorDirective = BusyIndicatorDirective;
    var CircularTileDirective = (function () {
        function CircularTileDirective() {
        }
        CircularTileDirective.add = function (m) {
            m.directive('odinCircularTile', function () {
                return {
                    restrict: "E",
                    replace: true,
                    transclude: false,
                    compile: function (element, attrs) {
                        if (!attrs["size"]) {
                            attrs["size"] = "col-md-3 col-sm-4";
                        }
                        return null;
                    },
                    scope: {
                        itemId: "@",
                        name: "@",
                        description: "@",
                        imageUrl: "@",
                        buttonText: "@",
                        onClickButton: "&",
                        model: "=",
                        size: "@"
                    },
                    template: "<div class='{{size}} odin-circular-tile'><a href='javascript:void(0)' ng-click='model=itemId'><div ng-if='!imageUrl' class='odin-tile-circle'><h2>{{itemId}}</h2></div><div ng-if='imageUrl' class='odin-tile-circle image' style='background-image: url(\"{{imageUrl}}\");'></div><h3>{{name}}</h3></a><div class='odin-tile-details row' ng-class='{\"visible\": model===itemId, \"hidden\": model !==itemId}'><button type='button' class='close' ng-click='model=null'>×</button><div class='col-sm-12 odin-tile-content'><div class='row'><div class='col-sm-12'><div ng-if='!imageUrl' class='odin-tile-circle'><h2>{{itemId}}</h2></div><div ng-if='imageUrl' class='odin-tile-circle image' style='background-image: url(\"{{imageUrl}}\");'></div><h2>{{name}}</h2><p class='odin-tile-productId'>{{itemId}}</p><p ng-if='description' class='odin-tile-description'>{{description}}</p><a ng-if='buttonText' class='btn btn-default' ng-click='onClickButton()'>{{buttonText}}</a></div></div></div></div></div>"
                };
            });
        };
        return CircularTileDirective;
    }());
    Odin.CircularTileDirective = CircularTileDirective;
    var StartupService = (function () {
        function StartupService(rootScope, q, location, service) {
            this.rootScope = rootScope;
            this.q = q;
            this.location = location;
            this.service = service;
            this.logPrefix = "[Odin.StartupService] ";
            this._isReady = false;
        }
        StartupService.add = function (m) {
            m.service("odinStartupService", StartupService);
        };
        StartupService.prototype.isLocalhost = function () {
            return this.location.host() == "localhost";
        };
        StartupService.prototype.getUrlOverride = function (key) {
            var options = this.options;
            if (options && options.urlOverrides) {
                var override = options.urlOverrides[key];
                if (override) {
                    var host = this.location.host();
                    if (host === override.host && override.url) {
                        return override.url;
                    }
                }
            }
            return null;
        };
        StartupService.prototype.isReady = function () {
            return this._isReady;
        };
        StartupService.prototype.raiseReady = function () {
            return "Ready state already set";
        };
        StartupService.prototype.setReady = function () {
            if (!this.isReady()) {
                this._isReady = true;
                var state = new StartupState(this.rootScope, this.service.applicationService, this.service.messageService);
                state.setReady();
            }
            else {
                throw this.raiseReady();
            }
        };
        StartupService.prototype.resolveReady = function (defered) {
            var state = new StartupState(this.rootScope, this.service.applicationService, this.service.messageService);
            defered.resolve(state);
        };
        StartupService.prototype.rejectReady = function (defered, errorState) {
            var message = errorState.errorMessage;
            Odin.Log.error(this.logPrefix + "Startup failed: " + message);
            var state = new StartupState(this.rootScope, this.service.applicationService, this.service.messageService);
            state.setError({ message: message, type: Odin.MessageType.Error });
            defered.reject(state);
        };
        StartupService.prototype.initialize = function (options) {
            this.options = options;
            if (options.application) {
                Odin.Framework.setApplication(this.rootScope, options.application);
            }
            if (options.frameworkPath) {
                Odin.Framework.setPath(options.frameworkPath);
            }
        };
        StartupService.prototype.start = function (options) {
            var _this = this;
            if (this.isReady()) {
                throw this.raiseReady();
            }
            var defered = this.q.defer();
            if (options) {
                this.initialize(options);
            }
            if (!this.options) {
                this.options = {};
            }
            var languageOptions = this.options.languageOptions;
            if (languageOptions) {
                var hasLang = !Odin.StringUtil.isNullOrEmpty(languageOptions.language);
                var hasDefaultLang = !Odin.StringUtil.isNullOrEmpty(languageOptions.defaultLanguage);
                var hasSupportedLangs = languageOptions.supportedLanguages && languageOptions.supportedLanguages.length > 0;
                var isLangSupported = Odin.ArrayUtil.contains(languageOptions.supportedLanguages, languageOptions.language);
                if ((hasLang && hasSupportedLangs && !isLangSupported) || (!hasLang && hasDefaultLang)) {
                    languageOptions.language = languageOptions.defaultLanguage;
                }
                this.service.languageService.load(languageOptions).then(function () {
                    _this.resolveReady(defered);
                }, function (l) {
                    _this.rejectReady(defered, l);
                });
            }
            else {
                this.resolveReady(defered);
            }
            return defered.promise;
        };
        StartupService.$inject = ["$rootScope", "$q", "$location", "odinService"];
        return StartupService;
    }());
    Odin.StartupService = StartupService;
    var DateFilter = (function () {
        function DateFilter() {
        }
        DateFilter.add = function (m) {
            m.filter("odinDate", ["$filter", "odinFormatService", function (filter, formatService) {
                    return function (date) {
                        return filter("date")(date, formatService.getDateFormat());
                    };
                }]);
        };
        return DateFilter;
    }());
    var NumberFilter = (function () {
        function NumberFilter() {
        }
        NumberFilter.add = function (m) {
            m.filter("odinNumber", function () { return function (value) {
                return Odin.NumUtil.format(value);
            }; });
        };
        return NumberFilter;
    }());
    var LanguageFilter = (function () {
        function LanguageFilter() {
        }
        LanguageFilter.add = function (m) {
            m.filter("odinLang", ["odinLanguageService", function (languageService) {
                    return function (key) {
                        return languageService.tryGet()[key];
                    };
                }]);
        };
        return LanguageFilter;
    }());
    var LanguageDirective = (function () {
        function LanguageDirective() {
        }
        LanguageDirective.add = function (m) {
            m.directive("odinLang", ["odinLanguageService", function (languageService) {
                    return {
                        scope: false,
                        link: function (scope, element, attributes) {
                            var oldVal;
                            attributes.$observe("odinLang", function (newVal) {
                                if (newVal && newVal != oldVal) {
                                    oldVal = newVal;
                                    languageService.get().then(function (language) {
                                        var text = language[newVal];
                                        if (text) {
                                            element.text(text);
                                        }
                                    });
                                }
                            });
                        }
                    };
                }]);
        };
        return LanguageDirective;
    }());
    var LanguageAttributeDirective = (function () {
        function LanguageAttributeDirective() {
        }
        LanguageAttributeDirective.add = function (m) {
            m.directive("odinLangAttr", ["odinLanguageService", function (languageService) {
                    return {
                        scope: false,
                        link: function (scope, element, attributes) {
                            var oldVal;
                            attributes.$observe("odinLangAttr", function (newVal) {
                                if (newVal && newVal != oldVal) {
                                    oldVal = newVal;
                                    languageService.get().then(function (language) {
                                        var values = scope.$eval(newVal);
                                        for (var key in values) {
                                            var text = language[values[key]];
                                            if (text) {
                                                attributes.$set(key, text);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    };
                }]);
        };
        return LanguageAttributeDirective;
    }());
    var Service = (function () {
        function Service(rootScope, componentService, applicationService, languageService, messageService, storageService, browseService, formatService) {
            this.rootScope = rootScope;
            this.componentService = componentService;
            this.applicationService = applicationService;
            this.languageService = languageService;
            this.messageService = messageService;
            this.storageService = storageService;
            this.browseService = browseService;
            this.formatService = formatService;
        }
        Service.add = function (m) {
            m.service("odinService", Service);
        };
        Service.$inject = ["$rootScope", "odinComponentService", "odinApplicationService", "odinLanguageService", "odinMessageService", "odinStorageService", "odinBrowseService", "odinFormatService"];
        return Service;
    }());
    var ToUpperDirective = (function () {
        function ToUpperDirective() {
        }
        ToUpperDirective.add = function (m) {
            m.directive("odinToUpper", [function () {
                    return {
                        restrict: 'A',
                        require: 'ngModel',
                        link: function (scope, elm, attrs, ngModel) {
                            ToUpperDirective.addCustomConverters(ngModel);
                        }
                    };
                }]);
        };
        ToUpperDirective.addCustomConverters = function (ngModel) {
            ngModel.$parsers.push(function (text) {
                return ToUpperDirective.parse(text);
            });
        };
        ToUpperDirective.parse = function (text) {
            return (text || "").toUpperCase();
        };
        ToUpperDirective.format = function (text) {
            return (text || "").toLowerCase();
        };
        return ToUpperDirective;
    }());
    Odin.ToUpperDirective = ToUpperDirective;
    var OdinModule = (function () {
        function OdinModule() {
        }
        OdinModule.init = function () {
            var ui = angular.module("odin", ["ui.bootstrap"]);
            StorageService.add(ui);
            Odin.MessageService.add(ui);
            ComponentService.add(ui);
            ApplicationService.add(ui);
            Service.add(ui);
            BrowseService.add(ui);
            LanguageService.add(ui);
            StartupService.add(ui);
            Odin.FormatService.add(ui);
            Odin.DataProviderService.add(ui);
            VisualStateCtrl.add(ui);
            DefaultBrowseCtrl.add(ui);
            TabCtrl.add(ui);
            Odin.FocusDirective.add(ui);
            Odin.KeyboardDirective.add(ui);
            Odin.MouseDirective.add(ui);
            Odin.NumberDirective.add(ui);
            BusyIndicatorDirective.add(ui);
            CircularTileDirective.add(ui);
            CheckboxDirective.add(ui);
            SwitchDirective.add(ui);
            RadioDirective.add(ui);
            FormElementDirective.add(ui);
            NavbarDirective.add(ui);
            InputDirective.add(ui);
            ExpanderDirective.add(ui);
            ExpandableFooterDirective.add(ui);
            SplashScreenDirective.add(ui);
            Odin.DataProviderDirective.add(ui);
            ToUpperDirective.add(ui);
            LanguageDirective.add(ui);
            LanguageAttributeDirective.add(ui);
            Odin.Mashup.Directive.add(ui);
            Odin.Mashup.ControlDirective.add(ui);
            LanguageFilter.add(ui);
            DateFilter.add(ui);
            NumberFilter.add(ui);
            Odin.Templates.cacheTemplatesInModule();
            Odin.Log.info("[Odin] Framework version " + Odin.Framework.version.full);
        };
        return OdinModule;
    }());
    OdinModule.init();
})(Odin || (Odin = {}));
var M3;
(function (M3) {
    var Constants = (function () {
        function Constants() {
        }
        Constants.scopeNameFormCtrl = "m3FormCtrl";
        Constants.dateFormat = "yyMMdd";
        return Constants;
    }());
    M3.Constants = Constants;
    var M3ErrorTypes = (function () {
        function M3ErrorTypes() {
        }
        M3ErrorTypes.MI = "MI";
        M3ErrorTypes.FORM = "FORM";
        return M3ErrorTypes;
    }());
    M3.M3ErrorTypes = M3ErrorTypes;
    (function (BrowseServiceType) {
        BrowseServiceType[BrowseServiceType["MI"] = 1] = "MI";
    })(M3.BrowseServiceType || (M3.BrowseServiceType = {}));
    var BrowseServiceType = M3.BrowseServiceType;
    var BrowseConfiguration = (function () {
        function BrowseConfiguration() {
        }
        return BrowseConfiguration;
    }());
    M3.BrowseConfiguration = BrowseConfiguration;
    var Configuration = (function () {
        function Configuration() {
        }
        Configuration.overrideUrl = function (url) {
            Odin.Log.debug("[M3] Overriding base URL with " + url);
            Configuration.url = url;
        };
        Configuration.getUrl = function () {
            return Configuration.url;
        };
        Configuration.getLanguageTag = function (m3Language) {
            var language = this.languageMap[m3Language];
            if (!language) {
                language = "en-US";
                Odin.Log.warning("M3 language " + m3Language + " not found. Fallback to " + language);
            }
            return language;
        };
        Configuration.getDateFormat = function (m3Format) {
            var dateFormat = Constants.dateFormat;
            switch (m3Format) {
                case "YMD":
                case "YYMMDD":
                    dateFormat = "yyMMdd";
                    break;
                case "YYYYMMDD":
                    dateFormat = "yyyyMMdd";
                    break;
                case "MDY":
                case "MMDDYY":
                    dateFormat = "MMddyy";
                    break;
                case "MMDDYYYY":
                    dateFormat = "MMddyyyy";
                    break;
                case "DMY":
                case "DDMMYY":
                    dateFormat = "ddMMyy";
                    break;
                case "DDMMYYYY":
                    dateFormat = "ddMMyyyy";
                    break;
            }
            return dateFormat;
        };
        Configuration.url = "";
        Configuration.languageMap = {
            CS: "zh-CN",
            CZ: "cs-CZ",
            DE: "de-DE",
            DK: "da-DK",
            ES: "es-ES",
            FI: "fi-FI",
            FR: "fr-FR",
            GB: "en-US",
            HU: "hu-HU",
            IT: "it-IT",
            JP: "ja-JP",
            NL: "nl-NL",
            NO: "nb-NO",
            PL: "pl-PL",
            PT: "pt-PT",
            SE: "sv-SE",
            TR: "tr-TR",
        };
        return Configuration;
    }());
    M3.Configuration = Configuration;
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var MIResponse = (function (_super) {
        __extends(MIResponse, _super);
        function MIResponse() {
            _super.apply(this, arguments);
            this.program = null;
            this.transaction = null;
        }
        return MIResponse;
    }(Odin.ErrorState));
    M3.MIResponse = MIResponse;
    var MIAccess = (function () {
        function MIAccess() {
        }
        MIAccess.createUrl = function (baseUrl, request) {
            var url = baseUrl + "/m3api-rest/execute/" + request.program + "/" + request.transaction;
            var maxRecords = 100;
            var excludeEmpty = "true";
            var metadata = "true";
            var returnCols = null;
            if (request.maxReturnedRecords >= 0) {
                maxRecords = request.maxReturnedRecords;
            }
            if (!request.excludeEmptyValues) {
                excludeEmpty = "false";
            }
            if (request.outputFields && request.outputFields.length > 0) {
                returnCols = request.outputFields.join(",");
            }
            if (request.includeMetadata) {
                metadata = "true";
                request.includeMetadata = true;
            }
            else {
                request.includeMetadata = false;
            }
            url += ";metadata=" + metadata + ";maxrecs=" + maxRecords + ";excludempty=" + excludeEmpty;
            var company = request.company;
            var division = request.division;
            var context = M3.UserContext.current;
            if (!company && context) {
                company = context.currentCompany;
                division = context.currentDivision;
            }
            if (company) {
                url += ";cono=" + company;
                if (division || division === "") {
                    url += ";divi=" + division;
                }
            }
            if (returnCols) {
                url += ";returncols=" + returnCols;
            }
            url += "?";
            var record = request.record;
            if (record) {
                for (var field in record) {
                    if (record.hasOwnProperty(field)) {
                        var value = record[field];
                        if (value != null) {
                            url += "&" + field + "=" + encodeURIComponent(value);
                        }
                    }
                }
            }
            url += "&_rid=" + Odin.Util.random();
            return url;
        };
        MIAccess.parseMessage = function (response, content) {
            var code = content["@code"];
            var field = content["@field"];
            var errorType = content["@type"];
            var message = content["Message"];
            if (message) {
                if (code) {
                    message = message.replace(code, "");
                }
                if (field) {
                    message = message.replace(field, "");
                }
                response.errorMessage = message.trim();
            }
            response.errorCode = code ? code : errorType;
            response.errorField = field;
            response.errorType = content["@type"];
        };
        MIAccess.parseResponse = function (request, content) {
            if (Odin.Log.isDebug()) {
                Odin.Log.debug(MIAccess.logPrefix + " Parsing MI call " + request.program + " " + request.transaction + " content: " + content);
            }
            var response = new MIResponse();
            response.tag = request.tag;
            var items = [];
            response.items = items;
            response.program = request.program;
            response.transaction = request.transaction;
            MIAccess.parseMessage(response, content);
            var metadata = null;
            if (request.includeMetadata) {
                metadata = MIAccess.getMetadata(content);
                response.metadata = metadata;
            }
            var records = content.MIRecord;
            if (records == null || records.length < 1) {
                return response;
            }
            var isTypedOutput = request.typedOutput;
            for (var i = 0; i < records.length; i++) {
                var record = records[i];
                if (record != null) {
                    var miRecord = new MIRecord();
                    miRecord.metadata = metadata;
                    if (record.NameValue) {
                        for (var index = 0; index < record.NameValue.length; index++) {
                            var nameValue = record.NameValue[index];
                            var name_1 = nameValue.Name;
                            var value = nameValue.Value;
                            if (value != null) {
                                value = Odin.StringUtil.trimEnd(value);
                            }
                            if (isTypedOutput) {
                                miRecord[name_1] = this.getTypedValue(name_1, value, metadata);
                            }
                            else {
                                miRecord[name_1] = value;
                            }
                        }
                    }
                    items.push(miRecord);
                }
            }
            if (items.length > 0) {
                response.item = items[0];
            }
            Odin.Log.debug(MIAccess.logPrefix + "Received " + items.length + " record(s)");
            return response;
        };
        MIAccess.getTypedValue = function (name, value, metadata) {
            try {
                if (metadata) {
                    var metaDataInfo = metadata[name];
                    if (!metaDataInfo) {
                        return value;
                    }
                    var result = this.parseValue(value, metaDataInfo);
                    return result;
                }
                else {
                    return value;
                }
            }
            catch (e) {
                return value;
            }
        };
        MIAccess.parseValue = function (value, metadataInfo) {
            if (metadataInfo.isString()) {
                return value;
            }
            if (metadataInfo.isNumeric()) {
                if (Odin.StringUtil.isNullOrEmpty(value)) {
                    return 0;
                }
                return +value;
            }
            if (metadataInfo.isDate()) {
                if (Odin.StringUtil.isNullOrEmpty(value)) {
                    return null;
                }
                return MIUtil.getDate(value);
            }
            return value;
        };
        MIAccess.getMetadata = function (content) {
            try {
                var input = content.Metadata;
                if (input && input.Field && input.Field.length > 1) {
                    var metadataMap = {};
                    var fields = input.Field;
                    for (var record in fields) {
                        if (fields.hasOwnProperty(record)) {
                            var entry = input.Field[record];
                            var name_2 = entry["@name"];
                            var metaDataInfo = new MIMetadataInfo(name_2, entry["@length"], entry["@type"], entry["@description"]);
                            metadataMap[name_2] = metaDataInfo;
                        }
                    }
                    return metadataMap;
                }
            }
            catch (e) {
                Odin.Log.error(this.logPrefix + "Failed to check for metadata " + content.Metadata);
            }
            return null;
        };
        MIAccess.logPrefix = "[MIAccess] ";
        return MIAccess;
    }());
    M3.MIAccess = MIAccess;
    var MIRecord = (function () {
        function MIRecord() {
            this.metadata = null;
        }
        MIRecord.prototype.setNumberString = function (name, value) {
            this[name] = value.toString();
        };
        MIRecord.prototype.setNumber = function (name, value) {
            this[name] = value;
        };
        MIRecord.prototype.setDateString = function (name, value) {
            this[name] = MIUtil.getDateFormatted(value);
        };
        MIRecord.prototype.setDate = function (name, value) {
            this[name] = value;
        };
        MIRecord.prototype.setString = function (name, value) {
            this[name] = value;
        };
        return MIRecord;
    }());
    M3.MIRecord = MIRecord;
    var MIUtil = (function () {
        function MIUtil() {
        }
        MIUtil.toMIFormat = function (value) {
            if (!Odin.Util.hasValue(value)) {
                return "";
            }
            if (Odin.DateUtil.isDate(value)) {
                return MIUtil.getDateFormatted(value);
            }
            else {
                return value.toString();
            }
        };
        MIUtil.createUpdateRecord = function (originalValues, newRecord, fieldNames, mandatoryFields) {
            var updateRecord = new MIRecord();
            var allFields = angular.copy(fieldNames);
            if (mandatoryFields != null && mandatoryFields.length > 0) {
                for (var i = 0; i < mandatoryFields.length; i++) {
                    var mandatoryField = mandatoryFields[i];
                    if (!(Odin.ArrayUtil.contains(allFields, mandatoryField))) {
                        allFields.push(mandatoryField);
                    }
                }
            }
            allFields.forEach(function (field, index) {
                var oldValue = originalValues[field];
                var newValue = newRecord[field];
                if (Odin.ArrayUtil.contains(mandatoryFields, field)) {
                    if (Odin.Util.hasValue(newValue)) {
                        updateRecord[field] = MIUtil.toMIFormat(newValue);
                    }
                    else {
                        updateRecord[field] = MIUtil.toMIFormat(oldValue);
                    }
                }
                else if (Odin.Util.hasValue(newValue) && newValue !== oldValue) {
                    updateRecord[field] = newValue;
                }
            });
            Odin.Log.debug("[MIUtil.createUpdateRecord] returns update record: " + updateRecord);
            return updateRecord;
        };
        MIUtil.getDateFormatted = function (date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            return yyyy + (mm.length === 2 ? mm : "0" + mm[0]) + (dd.length === 2 ? dd : "0" + dd[0]);
        };
        MIUtil.getDate = function (yyyymmdd) {
            try {
                var dateString = yyyymmdd;
                var year = +dateString.substring(0, 4);
                var month = +dateString.substring(4, 6);
                var day = +dateString.substring(6, 8);
                return new Date(year, month - 1, day);
            }
            catch (ex) {
                var msg = "MIUtil.getDate failed to parse format yyyyMMdd for: " + yyyymmdd;
                Odin.Log.debug(msg);
                throw msg;
            }
        };
        MIUtil.metadataToArray = function (metadataMap) {
            var array = new Array();
            for (var field in metadataMap) {
                if (metadataMap.hasOwnProperty(field)) {
                    var metadata = metadataMap[field];
                    array.push(metadata);
                }
            }
            return array;
        };
        return MIUtil;
    }());
    M3.MIUtil = MIUtil;
    var MIConstants = (function () {
        function MIConstants() {
        }
        MIConstants.datePattern = "yyyyMMdd";
        MIConstants.decimalSeparator = ".";
        return MIConstants;
    }());
    M3.MIConstants = MIConstants;
    var MIMetadataInfo = (function () {
        function MIMetadataInfo(name, length, typeString, description) {
            this.name = name;
            this.length = length;
            this.description = description;
            this.setType(typeString);
        }
        MIMetadataInfo.prototype.isNumeric = function () {
            return this.type === MIDataType.Numeric;
        };
        MIMetadataInfo.prototype.isDate = function () {
            return this.type === MIDataType.Date;
        };
        MIMetadataInfo.prototype.isString = function () {
            return this.type === MIDataType.String;
        };
        MIMetadataInfo.prototype.setType = function (value) {
            if (value === "D") {
                this.type = MIDataType.Date;
            }
            else if (value === "N") {
                this.type = MIDataType.Numeric;
            }
            else if (value === "A") {
                this.type = MIDataType.String;
            }
        };
        return MIMetadataInfo;
    }());
    M3.MIMetadataInfo = MIMetadataInfo;
    (function (MIDataType) {
        MIDataType[MIDataType["String"] = 0] = "String";
        MIDataType[MIDataType["Numeric"] = 1] = "Numeric";
        MIDataType[MIDataType["Date"] = 2] = "Date";
    })(M3.MIDataType || (M3.MIDataType = {}));
    var MIDataType = M3.MIDataType;
    (function (MIOptionsType) {
        MIOptionsType[MIOptionsType["Array"] = 0] = "Array";
        MIOptionsType[MIOptionsType["Dictionary"] = 1] = "Dictionary";
    })(M3.MIOptionsType || (M3.MIOptionsType = {}));
    var MIOptionsType = M3.MIOptionsType;
    var MIDataProvider = (function () {
        function MIDataProvider(miService, miOptions) {
            this.miService = miService;
            this.miOptions = miOptions;
        }
        MIDataProvider.prototype.get = function (options) {
            var _this = this;
            var deferred = this.miService.q.defer();
            var request = this.miOptions;
            this.miService.executeRequest(request).then(function (response) {
                var r = response;
                r.items = _this.onResponseDoMappings(r);
                if (_this.miOptions.type === MIOptionsType.Dictionary) {
                    r.items = _this.onResponseCreateDirectory(r);
                }
                deferred.resolve(r);
            }, function (response) {
                deferred.reject(response);
            });
            return deferred.promise;
        };
        MIDataProvider.prototype.onResponseDoMappings = function (response) {
            var items = response.items;
            var outputMap = this.miOptions.outputMap;
            for (var key in outputMap) {
                if (outputMap.hasOwnProperty(key)) {
                    items.forEach(function (value, index) {
                        value[outputMap[key]] = value[key];
                        delete value[key];
                    });
                }
            }
            return items;
        };
        MIDataProvider.prototype.onResponseCreateDirectory = function (response) {
            var items = response.items;
            var dictionary = {};
            var key = this.miOptions.dictionaryKey;
            items.forEach(function (item, index) {
                var val = item[key];
                dictionary[val] = item;
            });
            return dictionary;
        };
        MIDataProvider.$inject = ["m3MIService"];
        return MIDataProvider;
    }());
    M3.MIDataProvider = MIDataProvider;
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var MICtrl = (function (_super) {
        __extends(MICtrl, _super);
        function MICtrl(scope, miService, options) {
            if (options === void 0) { options = null; }
            _super.call(this, scope, miService.odinService, options);
            this.miService = miService;
            this.prefixCtrl = "[M3.MICtrl] ";
            this.isUpdate = false;
        }
        MICtrl.prototype.onResponse = function (response) {
            this.isUpdate = false;
        };
        MICtrl.prototype.onError = function (response) {
            this.isUpdate = false;
            var message = response.errorMessage;
            Odin.Log.error(this.prefixCtrl + message);
            this.miService.odinService.messageService.showError(message);
        };
        MICtrl.prototype.execute = function (program, transaction, record, outputFields) {
            if (record === void 0) { record = null; }
            if (outputFields === void 0) { outputFields = null; }
            var request = {
                program: program,
                transaction: transaction,
                record: record,
                outputFields: outputFields
            };
            return this.executeRequest(request);
        };
        MICtrl.prototype.executeUpdate = function (program, transaction, record, outputFields) {
            if (record === void 0) { record = null; }
            if (outputFields === void 0) { outputFields = null; }
            this.isUpdate = true;
            return this.execute(program, transaction, record, outputFields);
        };
        MICtrl.prototype.executeRequest = function (request) {
            var _this = this;
            if (this.isBusy()) {
                throw "Execute is not allowed when the component context is busy";
            }
            var deferred = this.miService.q.defer();
            if (this.defaultOptions) {
                var newRequest = angular.copy(this.defaultOptions);
                angular.extend(newRequest, request);
                request = newRequest;
            }
            if (!request.outputFields && this.outputFields) {
                request.outputFields = this.outputFields;
            }
            this.setBusy();
            this.miService.executeRequest(request).then(function (response) {
                _this.setActive();
                _this.onResponse(response);
                deferred.resolve(response);
            }, function (response) {
                _this.setActive();
                _this.onError(response);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        MICtrl.prototype.executeUpdateRequest = function (request) {
            this.isUpdate = true;
            return this.executeRequest(request);
        };
        MICtrl.injectDefault = ["$scope", "m3MIService"];
        return MICtrl;
    }(Odin.BaseCtrl));
    M3.MICtrl = MICtrl;
    var MIDetailCtrl = (function (_super) {
        __extends(MIDetailCtrl, _super);
        function MIDetailCtrl(scope, miService, options) {
            if (options === void 0) { options = null; }
            _super.call(this, scope, miService, options);
            this.scope = scope;
            this.miService = miService;
            this.prefixDetailCtrl = "[M3.MIDetailCtrl] ";
            this.detailScope = scope;
        }
        MIDetailCtrl.prototype.clear = function () {
            this.scope.item = {};
            Odin.Log.debug(this.prefixDetailCtrl + "Cleared detail item");
        };
        MIDetailCtrl.prototype.onResponse = function (response) {
            if (!this.isUpdate) {
                this.detailScope.item = response.item;
            }
            this.isUpdate = false;
            Odin.Log.debug(this.prefixDetailCtrl + "Received item.");
        };
        return MIDetailCtrl;
    }(MICtrl));
    M3.MIDetailCtrl = MIDetailCtrl;
    var MIListCtrl = (function (_super) {
        __extends(MIListCtrl, _super);
        function MIListCtrl(scope, miService) {
            _super.call(this, scope, miService);
            this.scope = scope;
            this.miService = miService;
            this.prefixListCtrl = "[M3.MIListCtrl] ";
            this.isPaging = false;
            this.isEndOfList = false;
            this.listScope = scope;
        }
        MIListCtrl.prototype.initialize = function (options) {
            var _this = this;
            options = Odin.DefaultListCtrlOptions.get(options);
            this.listOptions = options;
            var gridOptions = options.gridOptions;
            if (!gridOptions) {
                gridOptions = {};
            }
            if (!gridOptions.data) {
                gridOptions.data = options.scopeNameGridData;
            }
            if (gridOptions.multiSelect !== true) {
                gridOptions.multiSelect = false;
            }
            if (gridOptions.enableColumnResize !== false) {
                gridOptions.enableColumnResize = true;
            }
            if (gridOptions.enableSorting !== true) {
                gridOptions.enableSorting = false;
            }
            if (gridOptions.enableColumnMenus !== true) {
                gridOptions.enableColumnMenus = false;
            }
            gridOptions.enableRowSelection = true;
            gridOptions["enableRowHeaderSelection"] = false;
            gridOptions["enableGridMenu"] = false;
            if (!gridOptions["onRegisterApi"]) {
                gridOptions["onRegisterApi"] = function (gridApi) {
                    _this.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.rowSelectionChanged(row);
                    });
                    if (options.enableGridInfiniteScroll) {
                        _this.gridApi.infiniteScroll.on.needLoadMoreData(_this.listScope, function () {
                            _this.gridApi.infiniteScroll.saveScrollPercentage();
                            _this.notifyScroll();
                        });
                    }
                };
            }
            this.listScope[options.scopeNameGridOptions] = gridOptions;
        };
        MIListCtrl.prototype.getItems = function () {
            return this.scope[this.listOptions.scopeNameGridData];
        };
        MIListCtrl.prototype.setItems = function (items) {
            this.scope[this.listOptions.scopeNameGridData] = items;
        };
        MIListCtrl.prototype.getGridApi = function () {
            return this.gridApi;
        };
        MIListCtrl.prototype.setGridApi = function (gridApi) {
            this.gridApi = gridApi;
        };
        MIListCtrl.prototype.executeRequest = function (request) {
            if (this.isPaging === false) {
                this.isEndOfList = false;
            }
            return _super.prototype.executeRequest.call(this, request);
        };
        MIListCtrl.prototype.notifyScroll = function () {
            if (this.isPaging) {
                return;
            }
            if (Odin.Log.isTrace()) {
                Odin.Log.trace(this.prefixListCtrl + "Scroll detected");
            }
            try {
                var items = this.getItems();
                if (items && items.length > 0) {
                    var lastrecord = Odin.ArrayUtil.last(items);
                    var request = this.onGridScroll(lastrecord);
                    if (request) {
                        this.isPaging = true;
                        this.executeRequest(request);
                    }
                    else {
                        Odin.Log.warning("onGridScroll needs to return the MIRequest for the next page.");
                    }
                }
                else {
                    if (Odin.Log.isTrace()) {
                        Odin.Log.trace(this.prefixListCtrl + "No items so it is not possible to get last item - ignoring scroll");
                    }
                }
            }
            catch (e) {
                Odin.Log.error(this.prefixListCtrl + "Automatic scroll failed." + e);
            }
        };
        MIListCtrl.prototype.onGridScroll = function (lastRecord) {
            return null;
        };
        MIListCtrl.prototype.onActive = function (isActive) {
            if (isActive && this.pendingItem) {
                Odin.Log.debug(this.prefixListCtrl + "Delivering delayed selection changed event");
                this.rowSelectionChanged(this.pendingItem, this.pendingEvent);
                this.pendingItem = null;
                this.pendingEvent = null;
            }
        };
        MIListCtrl.prototype.onSelectedItemChanged = function (item) {
        };
        MIListCtrl.prototype.rowSelectionChanged = function (row, event) {
            var item = row.isSelected ? row.entity : null;
            if (!this.getComponentContext().isActive()) {
                Odin.Log.debug(this.prefixListCtrl + "Selection changed event delayed");
                this.pendingItem = row;
                this.pendingEvent = event;
            }
            else {
                this.onSelectedItemChanged(item);
            }
        };
        MIListCtrl.prototype.clear = function () {
            this.isEndOfList = false;
            this.setItems([]);
            Odin.Log.debug(this.prefixListCtrl + "Cleared list items.");
        };
        MIListCtrl.prototype.onResponse = function (response) {
            var items = response.items;
            Odin.Log.trace(this.prefixListCtrl + "Received " + items.length + " records(s).");
            if (this.isPaging) {
                this.updateListRows(response);
                var api = this.gridApi;
                if (api) {
                    api.infiniteScroll.dataLoaded();
                }
            }
            else {
                this.setItems(items);
            }
        };
        MIListCtrl.prototype.onError = function (response) {
            _super.prototype.onError.call(this, response);
            if (this.isPaging) {
                this.isPaging = false;
                this.isEndOfList = true;
                Odin.Log.error(this.prefixListCtrl + "Failed to get new roles after scroll " + response.errorMessage);
            }
        };
        MIListCtrl.prototype.updateListRows = function (response) {
            var items = this.getItems();
            var newItems = response.items;
            var count = newItems.length;
            if (count === 1 || count === 0) {
                this.isEndOfList = true;
                return;
            }
            for (var i = 1; i < count; i++) {
                items.push(newItems[i]);
            }
            Odin.Log.debug(this.prefixListCtrl + "Added " + count + " list rows.");
            this.isPaging = false;
        };
        MIListCtrl.prototype.resize = function () {
            var api = this.gridApi;
            if (api) {
                api.core.handleWindowResize();
            }
        };
        return MIListCtrl;
    }(MICtrl));
    M3.MIListCtrl = MIListCtrl;
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var Form;
    (function (Form) {
        var BEConstants = (function () {
            function BEConstants() {
            }
            BEConstants.fieldInformationCategory = "WWIBCA";
            BEConstants.fieldNumberOfFilters = "WWNFTR";
            BEConstants.fieldHideCommandBar = "WWHICB";
            return BEConstants;
        }());
        Form.BEConstants = BEConstants;
        var Constraint = (function () {
            function Constraint() {
                this.isNumeric = false;
                this.isUpper = false;
                this.maxLength = 0;
                this.maxDecimals = 0;
            }
            return Constraint;
        }());
        Form.Constraint = Constraint;
        var Position = (function () {
            function Position() {
            }
            return Position;
        }());
        Form.Position = Position;
        var ControlType = (function () {
            function ControlType() {
            }
            ControlType.getName = function (type) {
                switch (type) {
                    case ControlType.label:
                        return "Label";
                    case ControlType.textBox:
                        return "TextBox";
                    case ControlType.checkBox:
                        return "CheckBox";
                    case ControlType.comboBox:
                        return "ComboBox";
                    case ControlType.datePicker:
                        return "DatePicker";
                    case ControlType.groupBox:
                        return "GroupBox";
                    case ControlType.button:
                        return "Button";
                    case ControlType.list:
                        return "List";
                    case ControlType.listColumn:
                        return "ListColumn";
                }
                return null;
            };
            ControlType.label = 1;
            ControlType.textBox = 2;
            ControlType.checkBox = 3;
            ControlType.comboBox = 4;
            ControlType.datePicker = 5;
            ControlType.groupBox = 6;
            ControlType.button = 7;
            ControlType.list = 8;
            ControlType.listColumn = 9;
            return ControlType;
        }());
        Form.ControlType = ControlType;
        var FormControl = (function () {
            function FormControl(type) {
                this.type = type;
            }
            FormControl.prototype.getTypeName = function () {
                return ControlType.getName(this.type);
            };
            FormControl.prototype.getLeft = function () {
                return this.position ? this.position.left : -1;
            };
            FormControl.prototype.getTop = function () {
                return this.position ? this.position.top : -1;
            };
            FormControl.prototype.getWidth = function () {
                return this.position ? this.position.width : -1;
            };
            return FormControl;
        }());
        Form.FormControl = FormControl;
        var ListColumn = (function (_super) {
            __extends(ListColumn, _super);
            function ListColumn() {
                _super.call(this, ControlType.listColumn);
            }
            ListColumn.prototype.isNumeric = function () {
                return (this.constraint != null && this.constraint.isNumeric) ||
                    (this.columnType != null && (this.columnType == "S" || this.columnType == "P"));
            };
            ListColumn.prototype.isDate = function () {
                return Form.XmlNames.categoryDate === this.category;
            };
            ListColumn.prototype.isBool = function () {
                return Form.XmlNames.categoryBool === this.category;
            };
            return ListColumn;
        }(FormControl));
        Form.ListColumn = ListColumn;
        var ListRow = (function () {
            function ListRow() {
            }
            return ListRow;
        }());
        Form.ListRow = ListRow;
        var ListCell = (function () {
            function ListCell() {
            }
            return ListCell;
        }());
        Form.ListCell = ListCell;
        var List = (function (_super) {
            __extends(List, _super);
            function List() {
                _super.call(this, ControlType.list);
                this.columns = [];
                this.items = [];
            }
            return List;
        }(FormControl));
        Form.List = List;
        var TextBox = (function (_super) {
            __extends(TextBox, _super);
            function TextBox(type) {
                if (type === void 0) { type = ControlType.textBox; }
                _super.call(this, type);
            }
            return TextBox;
        }(FormControl));
        Form.TextBox = TextBox;
        var Label = (function (_super) {
            __extends(Label, _super);
            function Label() {
                _super.call(this, ControlType.label);
            }
            return Label;
        }(FormControl));
        Form.Label = Label;
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                _super.call(this, ControlType.button);
            }
            return Button;
        }(FormControl));
        Form.Button = Button;
        var GroupBox = (function (_super) {
            __extends(GroupBox, _super);
            function GroupBox() {
                _super.call(this, ControlType.groupBox);
            }
            return GroupBox;
        }(FormControl));
        Form.GroupBox = GroupBox;
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox() {
                _super.call(this, ControlType.checkBox);
            }
            return CheckBox;
        }(FormControl));
        Form.CheckBox = CheckBox;
        var ComboBoxItem = (function () {
            function ComboBoxItem() {
            }
            return ComboBoxItem;
        }());
        Form.ComboBoxItem = ComboBoxItem;
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            function ComboBox() {
                _super.call(this, ControlType.comboBox);
                this.items = [];
            }
            return ComboBox;
        }(FormControl));
        Form.ComboBox = ComboBox;
        var DatePicker = (function (_super) {
            __extends(DatePicker, _super);
            function DatePicker(dateFormat, hideDateFormat) {
                _super.call(this, ControlType.datePicker);
                this.dateFormat = dateFormat;
                this.hideDateFormat = hideDateFormat;
            }
            return DatePicker;
        }(TextBox));
        Form.DatePicker = DatePicker;
        var FunctionKey = (function () {
            function FunctionKey() {
            }
            return FunctionKey;
        }());
        Form.FunctionKey = FunctionKey;
        var Option = (function () {
            function Option() {
            }
            return Option;
        }());
        Form.Option = Option;
        var Panel = (function () {
            function Panel() {
                this.controls = {};
                this.controlList = [];
            }
            return Panel;
        }());
        Form.Panel = Panel;
        var Protocol = (function () {
            function Protocol() {
            }
            Protocol.valueTrue = "1";
            Protocol.valueFalse = "0";
            return Protocol;
        }());
        Form.Protocol = Protocol;
        var Bookmark = (function () {
            function Bookmark() {
            }
            Bookmark.getSource = function (bookmark) {
                return bookmark.source ? bookmark.source : "Web";
            };
            Bookmark.add = function (params, name, value) {
                if (name && value) {
                    params[name] = value;
                }
            };
            Bookmark.addBool = function (params, name, value) {
                if (name) {
                    params[name] = value ? "True" : "False";
                }
            };
            Bookmark.addValue = function (str, key, value) {
                if (str.length > 0) {
                    str += ",";
                }
                return str + key + "," + encodeURIComponent(value);
            };
            Bookmark.addInformationCategory = function (str, bookmark) {
                str = Bookmark.addValue(str, BEConstants.fieldInformationCategory, bookmark.informationCategory);
                var filters = bookmark.numberOfFilters;
                if (!filters) {
                    filters = "0";
                }
                str = Bookmark.addValue(str, BEConstants.fieldNumberOfFilters, filters);
                return str;
            };
            Bookmark.createValues = function (userContext, keyString, values, isKeys) {
                var str = "";
                var keys = keyString.split(",");
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = values[key];
                    if (value === "" || (!value && isKeys)) {
                        if (isKeys && key.length > 4) {
                            var refKey = key.slice(2);
                            var tempValue = values[refKey];
                            if (tempValue && tempValue.length > 0) {
                                value = tempValue;
                            }
                            else {
                                if (userContext) {
                                    if (refKey == "CONO") {
                                        value = userContext.currentCompany;
                                    }
                                    else if (refKey == "DIVI") {
                                        value = userContext.currentDivision;
                                    }
                                }
                            }
                            if (!value) {
                                value = " ";
                            }
                        }
                        else {
                            value = " ";
                        }
                    }
                    if (value) {
                        str = Bookmark.addValue(str, key, value);
                    }
                }
                return str;
            };
            Bookmark.toUri = function (bookmark, userContext) {
                var params = Bookmark.toParams(bookmark, userContext);
                var query = "";
                var nameMap = Bookmark.nameMap;
                for (var param in params) {
                    var name = nameMap[param] || param;
                    if (query) {
                        query += "&";
                    }
                    query += name + "=" + encodeURIComponent(params[param]);
                }
                var uri = "bookmark?" + query;
                return uri;
            };
            Bookmark.toParams = function (bookmark, userContext) {
                var params = bookmark.params || {};
                this.add(params, "BM_PROGRAM", bookmark.program);
                this.add(params, "BM_PANEL_SEQUENCE", bookmark.panelSequence);
                this.add(params, "BM_START_PANEL", bookmark.startPanel);
                this.add(params, "BM_PANEL", bookmark.panel);
                this.add(params, "BM_FOCUS_FIELD_NAME", bookmark.focusFieldName);
                this.add(params, "BM_TABLE_NAME", bookmark.table);
                this.add(params, "BM_OPTION", bookmark.option);
                this.add(params, "BM_INQUIRY_TYPE", bookmark.sortingOrder);
                this.add(params, "BM_SOURCE", this.getSource(bookmark));
                this.add(params, "BM_VIEW", bookmark.view);
                this.add(params, "BM_AUTOMATION", bookmark.automation);
                this.add(params, "BM_AUTOMATION_TEMPLATE", bookmark.automationTemplate);
                this.addBool(params, "BM_INCLUDE_START_PANEL", bookmark.includeStartPanel);
                this.addBool(params, "BM_REQUIRE_PANEL", bookmark.requirePanel);
                this.addBool(params, "BM_SUPPRESS_CONFIRM", bookmark.suppressConfirm);
                if (bookmark.isStateless) {
                    this.addBool(params, "BM_STATELESS", true);
                }
                var values = bookmark.values;
                var keys = bookmark.keys;
                if (bookmark.keyNames && values) {
                    keys = Bookmark.createValues(userContext, bookmark.keyNames, values, true);
                }
                this.add(params, "BM_KEY_FIELDS", keys);
                var parameters = bookmark.parameters;
                if (bookmark.parameterNames && values) {
                    parameters = Bookmark.createValues(userContext, bookmark.parameterNames, values, false);
                }
                this.add(params, "BM_PARAMETERS", parameters);
                var fields = bookmark.fields;
                var hasCategory = bookmark.informationCategory;
                if ((bookmark.fieldNames && values) || hasCategory) {
                    fields = Bookmark.createValues(userContext, bookmark.fieldNames, values, false);
                    if (hasCategory) {
                        fields = Bookmark.addInformationCategory(fields, bookmark);
                    }
                }
                this.add(params, "BM_START_PANEL_FIELDS", fields);
                return params;
            };
            Bookmark.nameMap = {
                BM_PROGRAM: "program",
                BM_TABLE_NAME: "tablename",
                BM_PANEL: "panel",
                BM_KEY_FIELDS: "keys",
                BM_OPTION: "option",
                BM_START_PANEL: "startpanel",
                BM_FOCUS_FIELD_NAME: "focus",
                BM_PANEL_SEQUENCE: "panelsequence",
                BM_INCLUDE_START_PANEL: "includestartpanel",
                BM_INQUIRY_TYPE: "sortingorder",
                BM_VIEW: "view",
                BM_SOURCE: "source",
                BM_STATELESS: "stateless",
                BM_START_PANEL_FIELDS: "fields",
                BM_PARAMETERS: "parameters",
                BM_AUTOMATION: "automation",
                BM_AUTOMATION_TEMPLATE: "automationtemplate",
                BM_SUPPRESS_CONFIRM: "requirepanel",
                BM_REQUIRE_PANEL: "suppressconfirm"
            };
            return Bookmark;
        }());
        Form.Bookmark = Bookmark;
    })(Form = M3.Form || (M3.Form = {}));
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var Form;
    (function (Form) {
        var XmlNames = (function () {
            function XmlNames() {
            }
            XmlNames.elementRoot = "Root";
            XmlNames.elementResult = "Result";
            XmlNames.elementControlData = "ControlData";
            XmlNames.elementSessionData = "SessionData";
            XmlNames.elementSessionId = "SID";
            XmlNames.elementInstanceId = "IID";
            XmlNames.elementJobId = "JobId";
            XmlNames.elementHelpUrl = "HelpURL";
            XmlNames.elementMomUrl = "momUrl";
            XmlNames.elementUser = "User";
            XmlNames.elementCompany = "Cmp";
            XmlNames.elementDivision = "Divi";
            XmlNames.elementVersion = "ERPV";
            XmlNames.elementLanguage = "Lng";
            XmlNames.elementPanels = "Panels";
            XmlNames.elementPanel = "Panel";
            XmlNames.elementObjects = "Objs";
            XmlNames.elementPanelHeader = "PHead";
            XmlNames.elementPanelDescription = "PDesc";
            XmlNames.elementEntryField = "EFld";
            XmlNames.elementCheckBox = "ChkBox";
            XmlNames.elementCaption = "Cap";
            XmlNames.elementComboBox = "CBox";
            XmlNames.elementButton = "Btn";
            XmlNames.elementGroupBox = "GroupBox";
            XmlNames.elementPluggable = "Pluggable";
            XmlNames.elementTextArea = "TextArea";
            XmlNames.elementBarChart = "BarChart";
            XmlNames.elementJGanttData = "JGanttData";
            XmlNames.elementList = "List";
            XmlNames.elementRunDialog = "RunDlg";
            XmlNames.elementOpenDialog = "OpenDlg";
            XmlNames.elementCloseDialog = "CloseDlg";
            XmlNames.elementOpenModal = "OpenModal";
            XmlNames.elementStateless = "Stateless";
            XmlNames.elementFocus = "Focus";
            XmlNames.elementFocusOriginal = "FO";
            XmlNames.elementFocusType = "FT";
            XmlNames.elementBookmark = "Bookmark";
            XmlNames.elementSearch = "Search";
            XmlNames.elementChangedBy = "ChgBy";
            XmlNames.elementModifiedDate = "ModDate";
            XmlNames.elementRegisteredDate = "RegDate";
            XmlNames.elementMessage = "Msg";
            XmlNames.elementMessageId = "MsgID";
            XmlNames.elementMessageLevel = "MsgLvl";
            XmlNames.elementListCell = "LC";
            XmlNames.elementDateFormat = "DF";
            XmlNames.elementDecimalSeparator = "DSep";
            XmlNames.elementComboBoxValue = "CBV";
            XmlNames.elementPosition = "Pos";
            XmlNames.elementConstraints = "Constr";
            XmlNames.elementFunctionKeys = "FKeys";
            XmlNames.elementFunctionKey = "FKey";
            XmlNames.elementBasicOptions = "BasicOpts";
            XmlNames.elementBasicOption = "BO";
            XmlNames.elementRelatedOptions = "MoreOpts";
            XmlNames.elementRelatedOption = "MO";
            XmlNames.elementSortingOrderComboBox = "InqTypeCBox";
            XmlNames.elementSortingOrderEntryField = "InqTypeEFld";
            XmlNames.elementViewComboBox = "PanelVerCBox";
            XmlNames.elementViewEntryField = "PanelVerEFld";
            XmlNames.elementVPanels = "VPanels";
            XmlNames.elementP = "p";
            XmlNames.elementPanelSequence = "PSeq";
            XmlNames.elementProgramInfo = "PgmInfo";
            XmlNames.elementCustomization = "Cust";
            XmlNames.elementDocumentLinks = "DocLinks";
            XmlNames.elementDocumentLink = "DL";
            XmlNames.attributeType = "type";
            XmlNames.attributeName = "name";
            XmlNames.attributeOriginalName = "oname";
            XmlNames.attributeValue = "val";
            XmlNames.attributeHelp = "hlp";
            XmlNames.attributeCommand = "cmd";
            XmlNames.attributeAccess = "acc";
            XmlNames.attributeStyle = "style";
            XmlNames.attributeJustification = "just";
            XmlNames.attributeProtected = "prot";
            XmlNames.attributeSelected = "sel";
            XmlNames.attributeScrollToEnd = "scrollEnd";
            XmlNames.attributeEnd = "end";
            XmlNames.attributeTab = "tab";
            XmlNames.attributeTop = "t";
            XmlNames.attributeLeft = "l";
            XmlNames.attributeWidth = "w";
            XmlNames.attributeHeight = "h";
            XmlNames.attributeClear = "clr";
            XmlNames.attributeAdditionalInfo = "addInfo";
            XmlNames.attributeMaxLength = "maxL";
            XmlNames.attributeMaxDecimals = "maxD";
            XmlNames.attributeUpperCase = "uc";
            XmlNames.attributeStartPanel = "sP";
            XmlNames.attributePanelIndex = "iP";
            XmlNames.attributeDescription = "desc";
            XmlNames.attributeList = "list";
            XmlNames.attributeSupportsSearch = "s";
            XmlNames.attributeSupportsBookmarks = "bm";
            XmlNames.attributeReferenceFile = "rfl";
            XmlNames.attributeReferenceField = "rfd";
            XmlNames.attributeArgument = "arg";
            XmlNames.attributeProgId = "progId";
            XmlNames.attributeMasterColumn = "masterColumn";
            XmlNames.attributeCategory = "cat";
            XmlNames.valueWriteDisabled = "WD";
            XmlNames.valueWriteEnabled = "WE";
            XmlNames.valueHidden = "HN";
            XmlNames.valueReadDisabled = "RD";
            XmlNames.valueStyleReverse = "REV";
            XmlNames.valueStyleReverseIntensity = "REVINT";
            XmlNames.valueStyleHighIntensity = "HIGHINT";
            XmlNames.valueDecimal = "DECIMAL";
            XmlNames.valueChecked = "on";
            XmlNames.valueFocusTypeListCell = "LC";
            XmlNames.valueFocusTypeListRow = "LR";
            XmlNames.categoryBool = "BOOL";
            XmlNames.categoryDate = "DATE";
            return XmlNames;
        }());
        Form.XmlNames = XmlNames;
        var XmlUtil = (function () {
            function XmlUtil() {
            }
            XmlUtil.getAttribute = function (node, name) {
                var a = node.hasAttributes() ? node.attributes.getNamedItem(name) : null;
                return a != null ? a.textContent : null;
            };
            XmlUtil.hasAttribute = function (node, name) {
                return XmlUtil.getAttribute(node, name) != null;
            };
            XmlUtil.getBoolAttribute = function (node, name, defaultValue) {
                var attribute = this.getAttribute(node, name);
                return Odin.Util.getBoolean(attribute, defaultValue);
            };
            XmlUtil.getIntAttribute = function (node, name, defaultValue) {
                var attribute = this.getAttribute(node, name);
                return Odin.NumUtil.getInt(attribute, defaultValue);
            };
            XmlUtil.selectNodes = function (parent, path) {
                var nodes = [];
                XmlUtil.select(parent, path.split("/"), nodes);
                return nodes;
            };
            XmlUtil.select = function (parent, path, nodes) {
                var node;
                var name = path[0];
                if (path.length == 1) {
                    for (var i = 0; i < parent.childNodes.length; i++) {
                        node = parent.childNodes[i];
                        if (node.localName === name) {
                            nodes.push(node);
                        }
                    }
                    return;
                }
                node = XmlUtil.selectNode(parent, name);
                if (!node) {
                    return;
                }
                path.splice(0, 1);
                XmlUtil.select(node, path, nodes);
            };
            XmlUtil.selectNode = function (parent, name) {
                if (parent.hasChildNodes()) {
                    for (var i = 0; i < parent.childNodes.length; i++) {
                        var node = parent.childNodes[i];
                        if (node.localName === name) {
                            return node;
                        }
                    }
                }
                return null;
            };
            XmlUtil.getElementInt = function (parent, name, defaultValue) {
                var s = XmlUtil.getElement(parent, name);
                return s ? parseInt(s) : defaultValue;
            };
            XmlUtil.getElement = function (parent, name) {
                var node = this.selectNode(parent, name);
                return node != null ? node.textContent : null;
            };
            XmlUtil.getText = function (parent) {
                return parent ? parent.textContent : null;
            };
            return XmlUtil;
        }());
        Form.XmlUtil = XmlUtil;
        var ParserInfo = (function () {
            function ParserInfo() {
            }
            return ParserInfo;
        }());
        Form.ParserInfo = ParserInfo;
        var Parser = (function () {
            function Parser() {
            }
            Parser.parseXml = function (content) {
                if (!Parser.domParser) {
                    Parser.domParser = new DOMParser();
                }
                return Parser.domParser.parseFromString(content, "text/xml");
            };
            Parser.prototype.parseName = function (node) {
                return XmlUtil.getAttribute(node, XmlNames.attributeName);
            };
            Parser.prototype.generateName = function (prefix, left, top) {
                return prefix + "_L" + left + "T" + top;
            };
            Parser.prototype.parseSession = function (node, element) {
                element.sessionId = XmlUtil.getElement(node, XmlNames.elementSessionId);
                if (element.sessionId) {
                    element.instanceId = XmlUtil.getElement(node, XmlNames.elementInstanceId);
                }
                element.result = XmlUtil.getElementInt(node, XmlNames.elementResult, 0);
                element.language = XmlUtil.getElement(node, XmlNames.elementLanguage);
            };
            Parser.selectRoot = function (document) {
                return XmlUtil.selectNode(document, XmlNames.elementRoot);
            };
            Parser.prototype.parseReponse = function (content) {
                var document = Parser.parseXml(content);
                var element = new Form.Response();
                element.counter = ++Parser.counter;
                this.uniqueNames = {};
                var root = Parser.selectRoot(document);
                if (root) {
                    var sessionNode = XmlUtil.selectNode(root, XmlNames.elementSessionData);
                    if (sessionNode) {
                        this.parseSession(sessionNode, element);
                    }
                    else {
                        element.result = XmlUtil.getElementInt(root, XmlNames.elementResult, 0);
                        element.message = XmlUtil.getElement(root, XmlNames.elementMessage);
                    }
                    var panels = document.getElementsByTagName(XmlNames.elementPanel);
                    if (panels == null) {
                        return element;
                    }
                    for (var i = 0; i < panels.length; i++) {
                        this.parsePanel(panels[i], element);
                    }
                }
                else {
                }
                return element;
            };
            Parser.prototype.parsePosition = function (parentNode) {
                var node = XmlUtil.selectNode(parentNode, XmlNames.elementPosition);
                if (node == null) {
                    return null;
                }
                var element = new Form.Position();
                element.top = XmlUtil.getIntAttribute(node, XmlNames.attributeTop, 0);
                element.left = XmlUtil.getIntAttribute(node, XmlNames.attributeLeft, 0);
                element.width = XmlUtil.getIntAttribute(node, XmlNames.attributeWidth, 0);
                element.height = XmlUtil.getIntAttribute(node, XmlNames.attributeHeight, 0);
                return element;
            };
            Parser.prototype.parseAccess = function (node, element) {
                var access = XmlUtil.getAttribute(node, XmlNames.attributeAccess);
                var visible = true;
                var enabled = true;
                if (XmlNames.valueWriteDisabled == access) {
                    enabled = false;
                }
                else if (XmlNames.valueHidden == access) {
                    visible = false;
                }
                else if (XmlNames.valueReadDisabled == access) {
                    element.isReadDisabled = true;
                }
                element.isEnabled = enabled;
                element.isVisible = visible;
            };
            Parser.prototype.parseConstraints = function (parentNode) {
                var node = XmlUtil.selectNode(parentNode, XmlNames.elementConstraints);
                if (node == null) {
                    return null;
                }
                var element = new Form.Constraint();
                element.maxLength = XmlUtil.getIntAttribute(node, XmlNames.attributeMaxLength, 0);
                element.isNumeric = XmlUtil.getAttribute(node, XmlNames.attributeType) == XmlNames.valueDecimal;
                if (element.isNumeric) {
                    element.maxDecimals = XmlUtil.getIntAttribute(node, XmlNames.attributeMaxDecimals, 0);
                }
                else {
                    element.isUpper = XmlUtil.hasAttribute(node, XmlNames.attributeUpperCase);
                }
                return element;
            };
            Parser.prototype.parseStyle = function (node, element) {
                var style = XmlUtil.getAttribute(node, XmlNames.attributeStyle);
                if (style == null) {
                    return;
                }
                switch (style) {
                    case XmlNames.valueStyleReverse:
                        element.isReverse = true;
                        break;
                    case XmlNames.valueStyleHighIntensity:
                        element.isHighIntensity = true;
                        break;
                    case XmlNames.valueStyleReverseIntensity:
                        element.isReverse = true;
                        element.isHighIntensity = true;
                        break;
                }
            };
            Parser.prototype.parseElement = function (node, element) {
                this.parseAccess(node, element);
                element.position = this.parsePosition(node);
            };
            Parser.prototype.parseInputElement = function (node, element) {
                this.parseElement(node, element);
                if (!element.name) {
                    element.name = this.parseName(node);
                }
                element.originalName = XmlUtil.getAttribute(node, XmlNames.attributeOriginalName);
                element.tabIndex = XmlUtil.getIntAttribute(node, XmlNames.attributeTab, -1);
                element.fieldHelp = XmlUtil.getAttribute(node, XmlNames.attributeHelp);
                var file = XmlUtil.getAttribute(node, XmlNames.attributeReferenceFile);
                if (file) {
                    element.referenceFile = file;
                    element.referenceField = XmlUtil.getAttribute(node, XmlNames.attributeReferenceField);
                }
                element.constraint = this.parseConstraints(node);
            };
            Parser.prototype.parseButton = function (node) {
                var element = new Form.Button();
                element.name = this.parseName(node);
                element.value = node.textContent;
                this.parseInputElement(node, element);
                var progId = XmlUtil.getAttribute(node, XmlNames.attributeProgId);
                if (progId != null) {
                    element.progId = progId;
                    element.arguments = XmlUtil.getAttribute(node, XmlNames.attributeArgument);
                }
                else {
                    element.command = XmlUtil.getAttribute(node, XmlNames.attributeCommand);
                    element.commandValue = XmlUtil.getAttribute(node, XmlNames.attributeValue);
                }
                return element;
            };
            Parser.prototype.parseGroupBox = function (node) {
                var element = new Form.GroupBox();
                this.parseElement(node, element);
                if (element.position) {
                    element.name = this.generateName("GRP", element.position.left, element.position.top);
                }
                element.isLine = XmlUtil.getBoolAttribute(node, "r", false);
                element.value = node.textContent;
                return element;
            };
            Parser.prototype.parseLabel = function (node) {
                var element = new Form.Label();
                this.parseElement(node, element);
                var name = XmlUtil.getAttribute(node, "id");
                element.id = name;
                element.value = node.textContent;
                var position = element.position;
                if (position) {
                    if (!name || name.length < 2) {
                        name = this.generateName("LBL", position.left, position.top);
                    }
                    else if (this.uniqueNames[name]) {
                        name = this.generateName("LBL", position.left, position.top);
                    }
                    else {
                        this.uniqueNames[name] = name;
                    }
                }
                element.name = name;
                element.toolTip = XmlUtil.getAttribute(node, "tip");
                element.isFixed = XmlUtil.getBoolAttribute(node, "fixFnt", false);
                element.isAdditionalInfo = XmlUtil.getBoolAttribute(node, "addInfo", false);
                element.isEmphasized = XmlUtil.getBoolAttribute(node, "emp", false);
                element.isColon = XmlUtil.getBoolAttribute(node, "cl", false);
                return element;
            };
            Parser.prototype.parseCheckBox = function (node) {
                var element = new Form.CheckBox();
                this.parseInputElement(node, element);
                element.value = node.textContent;
                element.isChecked = "1" === element.value;
                return element;
            };
            Parser.prototype.parseComboBox = function (node, isPosition) {
                var element = new Form.ComboBox();
                element.name = this.parseName(node);
                element.isPosition = isPosition;
                this.parseInputElement(node, element);
                if (XmlUtil.getAttribute(node, "e") != null) {
                    element.isEditable = true;
                    element.value = XmlUtil.getAttribute(node, XmlNames.attributeValue);
                }
                var itemNodes = node.childNodes;
                if (itemNodes) {
                    for (var i = 0; i < itemNodes.length; i++) {
                        var itemNode = itemNodes[i];
                        if (itemNode.localName === XmlNames.elementComboBoxValue) {
                            var item = new Form.ComboBoxItem();
                            item.value = XmlUtil.getAttribute(itemNode, XmlNames.attributeValue);
                            item.text = itemNode.textContent;
                            if (XmlUtil.hasAttribute(itemNode, XmlNames.attributeSelected)) {
                                element.selected = item;
                                item.isSelected = XmlUtil.hasAttribute(itemNode, XmlNames.attributeSelected);
                                if (!element.value) {
                                    element.value = item.value;
                                }
                            }
                            element.items.push(item);
                        }
                    }
                }
                element.command = XmlUtil.getAttribute(node, XmlNames.attributeCommand);
                if (element.command != null) {
                    element.commandValue = XmlUtil.getAttribute(node, XmlNames.attributeValue);
                }
                if (isPosition) {
                    element.isEnabled = true;
                    element.isVisible = true;
                }
                return element;
            };
            Parser.prototype.parseTextBox = function (node, isPosition, panelElement) {
                var element;
                var dateFormat = XmlUtil.getAttribute(node, "df");
                if (dateFormat != null && !isPosition && !(dateFormat.indexOf("YYWWD") >= 0)) {
                    element = new Form.DatePicker(dateFormat, XmlUtil.getBoolAttribute(node, "hDf", false));
                }
                else {
                    element = new Form.TextBox();
                }
                element.name = this.parseName(node);
                element.value = node.textContent;
                this.parseInputElement(node, element);
                this.parseStyle(node, element);
                if (isPosition) {
                    element.isEnabled = true;
                    element.isVisible = true;
                }
                else {
                    element.isBrowsable = XmlUtil.hasAttribute(node, "browse");
                }
                element.isRightAligned = XmlUtil.hasAttribute(node, XmlNames.attributeJustification);
                if (panelElement != null) {
                    if (name == Form.BEConstants.fieldInformationCategory) {
                        panelElement.informationCategory = element.value;
                    }
                    else if (name == Form.BEConstants.fieldHideCommandBar && element.value === "1") {
                        panelElement.hideCommandBar = true;
                    }
                }
                return element;
            };
            Parser.prototype.getStringTrimEnd = function (node) {
                var text = XmlUtil.getText(node);
                return text ? Odin.StringUtil.trimEnd(text) : null;
            };
            Parser.prototype.getRowIndex = function (rowName) {
                try {
                    return parseInt(rowName.substring(1)) - 1;
                }
                catch (ignore) {
                }
                return -1;
            };
            Parser.prototype.parseListRow = function (rowNode, listElement) {
                var nodes = XmlUtil.selectNodes(rowNode, XmlNames.elementListCell);
                if (!nodes) {
                    return null;
                }
                var row = new Form.ListRow();
                row.items = [];
                row.name = XmlUtil.getAttribute(rowNode, XmlNames.attributeName);
                row.columnCount = nodes.length;
                row.isProtected = XmlUtil.hasAttribute(rowNode, XmlNames.attributeProtected);
                row.isSelected = XmlUtil.hasAttribute(rowNode, XmlNames.attributeSelected);
                var isEditableListEnabled = true;
                for (var i = 0; i < nodes.length; i++) {
                    var listColumn = listElement.columns[i];
                    var node = nodes[i];
                    var cell = new Form.ListCell();
                    var text = this.getStringTrimEnd(node);
                    row[listColumn.fullName] = text;
                    cell.text = text;
                    cell.isRight = XmlUtil.hasAttribute(node, XmlNames.attributeJustification);
                    cell.isBool = listColumn.isBool();
                    var access = XmlUtil.getAttribute(node, XmlNames.attributeAccess);
                    if (access) {
                        if (XmlNames.valueWriteEnabled == access) {
                            if (isEditableListEnabled) {
                                cell.isUpper = listColumn.isUpperCase;
                                var maxLength = listColumn.maxLength;
                                if (listColumn.isNumeric) {
                                    if (listColumn.maxDecimals > 0) {
                                        maxLength += 2;
                                    }
                                    else {
                                        maxLength += 1;
                                    }
                                }
                                cell.maxLength = maxLength;
                                cell.isEditable = true;
                                cell.isEnabled = true;
                            }
                        }
                        else if (XmlNames.valueHidden == access) {
                            cell.isHidden = true;
                        }
                    }
                    if (cell.isBool) {
                        cell.isChecked = Form.Protocol.valueTrue === cell.text;
                        if (!cell.isEditable) {
                            if (cell.isChecked) {
                                cell.isEditable = true;
                            }
                            else {
                                cell.isBool = false;
                            }
                        }
                    }
                    var style = XmlUtil.getAttribute(node, XmlNames.attributeStyle);
                    if (style != null) {
                        if (XmlNames.valueStyleReverseIntensity == style) {
                            cell.isReverse = true;
                            cell.isHighIntensity = true;
                        }
                        else if (XmlNames.valueStyleReverse == style) {
                            cell.isReverse = true;
                        }
                        else if (XmlNames.valueStyleHighIntensity == style) {
                            cell.isHighIntensity = true;
                        }
                    }
                    row.items.push(cell);
                }
                this.parseSubRows(rowNode, listElement, row);
                row.index = this.getRowIndex(row.name);
                return row;
            };
            Parser.prototype.parseSubRows = function (rowNode, listElement, row) {
                var subRows = XmlUtil.selectNodes(rowNode, "SR");
                if (!subRows || subRows.length == 0) {
                    return;
                }
                listElement.hasSubRows = true;
                var subRow = subRows[0];
                var subNodes = XmlUtil.selectNodes(subRow, "SC");
                if (subNodes) {
                    row.subItems = [];
                    for (var j = 0; j < subNodes.length; j++) {
                        var subNode = subNodes[j];
                        var cell = new Form.ListCell();
                        cell.text = this.getStringTrimEnd(subNode);
                        cell.span = XmlUtil.getIntAttribute(subNode, "colspan", 0);
                        cell.isRight = XmlUtil.hasAttribute(subNode, XmlNames.attributeJustification);
                        row.subItems.push(cell);
                    }
                }
            };
            Parser.prototype.parseListRows = function (listNode, listElement) {
                listElement.items = [];
                var nodes = XmlUtil.selectNodes(listNode, "LView/LRows/LR");
                if (nodes == null) {
                    return;
                }
                for (var i = 0; i < nodes.length; i++) {
                    var row = this.parseListRow(nodes[i], listElement);
                    if (row && row.index >= 0) {
                        listElement.items.push(row);
                    }
                }
            };
            Parser.prototype.parseSubColumns = function (listNode, listElement) {
                var nodes = XmlUtil.selectNodes(listNode, "LView/LCols/LSubCol");
                if (!nodes || nodes.length == 0) {
                    return;
                }
                listElement.subColumns = [];
                var index = listElement.columns.length;
                for (var i = 0; i < nodes.length; i++) {
                    var column = this.parseColumn(nodes[i], index);
                    listElement.subColumns.push(column);
                    index++;
                }
            };
            Parser.prototype.parseColumnName = function (columnNode, columnElement) {
                var index = columnElement.index;
                var originalColumnName = XmlUtil.getAttribute(columnNode, XmlNames.attributeName);
                if (!originalColumnName) {
                    if (index < 0) {
                        return;
                    }
                    originalColumnName = "_" + index;
                }
                originalColumnName = originalColumnName.replace("&", "");
                var name = originalColumnName;
                if (name.length > 4) {
                    name = name.substring(name.length - 4);
                }
                if (Odin.NumUtil.isNumber(name[0])) {
                    name = "_" + name;
                }
                columnElement.name = name;
                columnElement.fullName = originalColumnName;
            };
            Parser.prototype.parseHeader = function (columnNode, column) {
                var node = XmlUtil.selectNode(columnNode, XmlNames.elementCaption);
                if (node) {
                    column.header = XmlUtil.getText(node);
                    column.toolTip = XmlUtil.getAttribute(node, "tip");
                }
            };
            Parser.prototype.parseColumn = function (columnNode, index) {
                var column = new Form.ListColumn();
                column.index = index;
                this.parseColumnName(columnNode, column);
                this.parseHeader(columnNode, column);
                var constraint = this.parseConstraints(columnNode);
                if (constraint) {
                    column.maxLength = constraint.maxLength;
                    column.maxDecimals = constraint.maxDecimals;
                    column.isUpperCase = constraint.isUpper;
                    column.constraint = constraint;
                }
                column.columnType = XmlUtil.getAttribute(columnNode, XmlNames.attributeType);
                column.category = XmlUtil.getAttribute(columnNode, XmlNames.attributeCategory);
                column.width = XmlUtil.getIntAttribute(columnNode, XmlNames.attributeWidth, 0);
                column.fieldHelp = XmlUtil.getAttribute(columnNode, XmlNames.attributeHelp);
                column.aggregate = XmlUtil.getIntAttribute(columnNode, "agg", 0);
                column.aggregateDisplayRule = XmlUtil.getIntAttribute(columnNode, "adr", 0);
                column.aggregateUpdateRule = XmlUtil.getIntAttribute(columnNode, "aur", 0);
                column.isRight = XmlUtil.hasAttribute(columnNode, XmlNames.attributeJustification);
                return column;
            };
            Parser.prototype.parseColumns = function (listNode, listElement) {
                var nodes = XmlUtil.selectNodes(listNode, "LView/LCols/LCol");
                listElement.columns = [];
                var depth = 0;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var listColumn = this.parseColumn(node, i);
                    var n = XmlUtil.selectNode(node, XmlNames.elementEntryField);
                    if (n != null) {
                        listColumn.positionField = this.parseTextBox(n, true, null);
                    }
                    else {
                        n = XmlUtil.selectNode(node, XmlNames.elementComboBox);
                        if (n != null) {
                            listColumn.positionField = this.parseComboBox(n, true);
                        }
                    }
                    if (listColumn.positionField && listColumn.fieldHelp) {
                        listColumn.positionField.fieldHelp = listColumn.fieldHelp;
                    }
                    if (listColumn.aggregate > 0) {
                        listElement.isAggregate = true;
                    }
                    else {
                        depth++;
                    }
                    listElement.columns.push(listColumn);
                }
                if (listElement.isAggregate) {
                    listElement.aggregateDepth = depth;
                }
            };
            Parser.prototype.parseList = function (responseElement, listNode) {
                var listElement = new Form.List();
                listElement.isCleared = XmlUtil.getBoolAttribute(listNode, "clr", false);
                this.parseInputElement(listNode, listElement);
                this.parseColumns(listNode, listElement);
                this.parseSubColumns(listNode, listElement);
                this.parseListRows(listNode, listElement);
                return listElement;
            };
            Parser.prototype.parseObjects = function (nodes, response, panelElement) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var childElement = null;
                    var name = node.localName;
                    switch (name) {
                        case XmlNames.elementButton:
                            childElement = this.parseButton(node);
                            break;
                        case XmlNames.elementCaption:
                            childElement = this.parseLabel(node);
                            break;
                        case XmlNames.elementCheckBox:
                            childElement = this.parseCheckBox(node);
                            break;
                        case XmlNames.elementComboBox:
                            childElement = this.parseComboBox(node, false);
                            break;
                        case XmlNames.elementSortingOrderComboBox:
                            childElement = this.parseComboBox(node, false);
                            childElement.isSpecial = true;
                            panelElement.sortingOrderComboBox = childElement;
                            break;
                        case XmlNames.elementViewComboBox:
                            childElement = this.parseComboBox(node, false);
                            childElement.isSpecial = true;
                            panelElement.viewComboBox = childElement;
                            break;
                        case XmlNames.elementEntryField:
                            childElement = this.parseTextBox(node, false, panelElement);
                            break;
                        case XmlNames.elementSortingOrderEntryField:
                            childElement = this.parseTextBox(node, false, panelElement);
                            childElement.isSpecial = true;
                            panelElement.sortingOrderTextBox = childElement;
                            break;
                        case XmlNames.elementViewEntryField:
                            childElement = this.parseTextBox(node, false, panelElement);
                            childElement.isSpecial = true;
                            panelElement.viewTextBox = childElement;
                            break;
                        case XmlNames.elementGroupBox:
                            childElement = this.parseGroupBox(node);
                            break;
                        case XmlNames.elementList:
                            panelElement.list = this.parseList(response, node);
                            break;
                        case XmlNames.elementPanelSequence:
                            break;
                        case XmlNames.elementFunctionKeys:
                            break;
                        case XmlNames.elementBasicOptions:
                            this.parseBasicOptions(node, panelElement);
                            break;
                        case XmlNames.elementRelatedOptions:
                            this.parseRelatedOptions(node, panelElement);
                            break;
                        case XmlNames.elementDocumentLinks:
                            break;
                        case XmlNames.elementPluggable:
                            break;
                        case XmlNames.elementTextArea:
                            break;
                        case XmlNames.elementJGanttData:
                            break;
                        case XmlNames.elementBarChart:
                            break;
                    }
                    if (childElement) {
                        panelElement.controlList.push(childElement);
                        if (childElement.name) {
                            panelElement.controls[childElement.name] = childElement;
                        }
                    }
                }
            };
            Parser.prototype.parsePanel = function (node, response) {
                var panelElement = new Form.Panel();
                panelElement.name = this.parseName(node);
                panelElement.header = XmlUtil.getElement(node, XmlNames.elementPanelHeader),
                    panelElement.description = XmlUtil.getElement(node, XmlNames.elementPanelDescription);
                var objectsNode = XmlUtil.selectNode(node, XmlNames.elementObjects);
                if (objectsNode) {
                    this.parseObjects(objectsNode.childNodes, response, panelElement);
                }
                response.panels.push(panelElement);
                if (!response.panel) {
                    response.panel = panelElement;
                }
            };
            Parser.prototype.parseBasicOptions = function (node, element) {
                element.basicOptions = this.parseOptions(node, XmlNames.elementBasicOption);
                var last = element.basicOptions.pop();
                if (last["val"] != 0) {
                    element.basicOptions.push(last);
                }
            };
            Parser.prototype.parseRelatedOptions = function (node, element) {
                element.relatedOptions = this.parseOptions(node, XmlNames.elementRelatedOption);
            };
            Parser.prototype.parseOptions = function (node, optionNodeName) {
                var options = [];
                var nodes = XmlUtil.selectNodes(node, optionNodeName);
                if (nodes == null) {
                    return options;
                }
                nodes.forEach(function (optionNode, index) {
                    options.push({ option: optionNode.textContent, val: optionNode.attributes["val"].nodeValue });
                });
                return options;
            };
            Parser.parse = function (content) {
                return new Parser().parseReponse(content);
            };
            Parser.counter = 0;
            return Parser;
        }());
        Form.Parser = Parser;
    })(Form = M3.Form || (M3.Form = {}));
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var Form;
    (function (Form) {
        var Response = (function (_super) {
            __extends(Response, _super);
            function Response() {
                _super.apply(this, arguments);
                this.result = 0;
                this.panel = null;
                this.panels = [];
            }
            Response.prototype.hasPanel = function () {
                return this.panels && this.panels.length > 0;
            };
            return Response;
        }(Odin.ErrorState));
        Form.Response = Response;
        var TranslationItem = (function () {
            function TranslationItem(key, file) {
                if (file === void 0) { file = null; }
                this.key = key;
                this.file = file;
            }
            return TranslationItem;
        }());
        Form.TranslationItem = TranslationItem;
        var FormUtil = (function () {
            function FormUtil() {
            }
            FormUtil.getInputId = function (response, name) {
                return "input" + name + response.counter;
            };
            FormUtil.findControlLabel = function (elements, control) {
                var left = control.getLeft();
                var top = control.getTop();
                var label;
                var i;
                for (i = 0; i < elements.length; i++) {
                    label = elements[i];
                    if (label.type === Form.ControlType.label && label.getTop() === top) {
                        var labelLeft = label.getLeft();
                        if (labelLeft < left) {
                            var labelWidth = label.getWidth();
                            var distance = left - labelLeft - labelWidth;
                            if (distance < 3) {
                                return label;
                            }
                        }
                    }
                }
                top--;
                if (top <= 0) {
                    return null;
                }
                for (i = 0; i < elements.length; i++) {
                    label = elements[i];
                    if (label.type === Form.ControlType.label && label.getTop() === top) {
                        if (label.getLeft() === left) {
                            if (!label.isAdditionalInfo) {
                                return label;
                            }
                            return null;
                        }
                    }
                }
                return null;
            };
            FormUtil.findAdditionalInfo = function (elements, control) {
                var left = control.getLeft() + control.getWidth();
                var top = control.getTop();
                for (var i = 0; i < elements.length; i++) {
                    var label = elements[i];
                    if (label.isAdditionalInfo) {
                        var labelTop = label.getTop();
                        if (labelTop === top) {
                            var labelLeft = label.getLeft();
                            if (labelLeft >= left && labelLeft <= (left + 2)) {
                                return label;
                            }
                        }
                    }
                }
                return null;
            };
            FormUtil.findControlAndLabels = function (response, name) {
                var panels = response.panels;
                if (panels) {
                    for (var i = 0; i < panels.length; i++) {
                        var panel = panels[i];
                        var elements = panel.controls;
                        var element = elements[name];
                        if (element) {
                            return {
                                control: element,
                                label: FormUtil.findControlLabel(panel.controlList, element),
                                additionalInfo: FormUtil.findAdditionalInfo(panel.controlList, element)
                            };
                        }
                    }
                }
                return null;
            };
            return FormUtil;
        }());
        Form.FormUtil = FormUtil;
    })(Form = M3.Form || (M3.Form = {}));
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var Form;
    (function (Form) {
        var RenderOptions = (function () {
            function RenderOptions() {
            }
            RenderOptions.gridOptions = {
                isGrid: true
            };
            RenderOptions.defaultOptions = {};
            return RenderOptions;
        }());
        Form.RenderOptions = RenderOptions;
        var ControlFactory = (function () {
            function ControlFactory() {
                this.cellWidth = 10;
                this.cellHeight = 25;
                this.defaultOptions = {};
            }
            ControlFactory.prototype.gridWidth = function (x) {
                return x * this.cellWidth;
            };
            ControlFactory.prototype.setSize = function (element, x, y) {
                if (x) {
                    element.css("width", x);
                }
                if (y) {
                    element.css("height", y);
                }
            };
            ControlFactory.prototype.addOptions = function (select, comboBox) {
                var items = comboBox.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var option = $("<option/>").attr("value", item.value).text(item.text);
                    select.append(option);
                }
            };
            ControlFactory.prototype.span = function (text, classes) {
                var span = $("<span/>").text(text);
                if (classes) {
                    span.addClass(classes);
                }
                return span;
            };
            ControlFactory.prototype.div = function (classes) {
                var div = $("<div/>");
                if (classes) {
                    div.addClass(classes);
                }
                return div;
            };
            ControlFactory.prototype.row = function () {
                return this.div("row");
            };
            ControlFactory.prototype.form = function () {
                return $("<form/>").attr("role", "form").addClass("form-horizontal");
            };
            ControlFactory.prototype.formGroup = function () {
                return this.div("form-group");
            };
            ControlFactory.prototype.label = function (text, forId) {
                var label = $("<label/>").addClass("control-label");
                if (text) {
                    label.text(text);
                }
                if (forId) {
                    label.attr("for", forId);
                }
                return label;
            };
            ControlFactory.prototype.expander = function (header) {
                return $("<odin-expander/>").attr("header", header).attr("is-expanded", M3.Constants.scopeNameFormCtrl + ".isHeaderExpanded");
            };
            ControlFactory.prototype.getPath = function (control) {
                return "controls." + control.name + ".value";
            };
            ControlFactory.prototype.getPathCombo = function (control) {
                return "controls." + control.name + ".value";
            };
            ControlFactory.prototype.addBinding = function (element, control) {
                element.attr("ng-model", this.getPath(control));
            };
            ControlFactory.prototype.create = function (response, control, isEnabled, options) {
                if (isEnabled === void 0) { isEnabled = true; }
                if (options === void 0) { options = null; }
                var element = null;
                var name = control.name;
                var type = control.type;
                var isBinding = true;
                var path;
                if (!options) {
                    options = this.defaultOptions;
                }
                if (type == Form.ControlType.comboBox) {
                    element = $("<select/>").addClass("form-control");
                    var selectOptions = "i.value as i.text for i in controls." + name + ".items";
                    path = this.getPathCombo(control);
                    element.attr("ng-model", path);
                    element.attr("ng-options", selectOptions);
                }
                else if (type == Form.ControlType.checkBox) {
                    element = $("<input/>").attr("type", "checkbox").addClass("form-control");
                }
                else if (type == Form.ControlType.datePicker) {
                    element = $("<input/>").attr("type", "text").addClass("form-control");
                }
                else if (type == Form.ControlType.label) {
                    element = this.label(control.value);
                    if (options.isGrid) {
                        element.addClass("m3-grid-label");
                    }
                    isBinding = false;
                }
                else if (type == Form.ControlType.button) {
                    var button = control;
                    element = $("<button/>").addClass("btn btn-sm").text(button.value);
                    if (button.command) {
                        var exp = M3.Constants.scopeNameFormCtrl + ".executeCommand('" + button.command + "', '" + button.commandValue + "')";
                        element.attr("ng-click", exp);
                    }
                    isBinding = false;
                }
                else {
                    element = $("<input/>").attr("type", "text").addClass("form-control");
                }
                if (element) {
                    if (!isEnabled) {
                        element.attr(type == Form.ControlType.textBox ? "readonly" : "disabled", "");
                    }
                    if (isBinding) {
                        this.addBinding(element, control);
                    }
                    var id = Form.FormUtil.getInputId(response, name);
                    element.attr("id", id);
                }
                return element;
            };
            ControlFactory.current = new ControlFactory();
            return ControlFactory;
        }());
        Form.ControlFactory = ControlFactory;
        var FormGenerator = (function (_super) {
            __extends(FormGenerator, _super);
            function FormGenerator() {
                _super.call(this);
                this.gridRows = 23;
                this.fieldsToSkip = "UPVR";
            }
            FormGenerator.prototype.reset = function () {
                this.maxX = -1;
                this.maxY = -1;
            };
            FormGenerator.prototype.getX = function (x) {
                if (x > this.maxX) {
                    this.maxX = x;
                }
                return x * this.cellWidth;
            };
            FormGenerator.prototype.getY = function (y) {
                if (y > this.maxY) {
                    this.maxY = y;
                }
                return y * this.cellHeight;
            };
            FormGenerator.prototype.setAbsoluteLayout = function (control, element) {
                var position = control.position;
                this.setGridSize(element, position.width);
                element.css("left", this.getX(position.left - 1));
                element.css("position", "absolute");
            };
            FormGenerator.prototype.setGridSize = function (element, x, y) {
                if (x) {
                    element.css("width", this.getX(x));
                }
                if (y) {
                    element.css("height", this.getY(y));
                }
            };
            FormGenerator.prototype.generateControl = function (response, control) {
                var element = this.create(response, control, control.isEnabled, RenderOptions.gridOptions);
                this.setAbsoluteLayout(control, element);
                return element;
            };
            FormGenerator.prototype.gridRow = function () {
                return this.div("m3-grid-row");
            };
            FormGenerator.prototype.addElement = function (control, element, rowDivs) {
                var name = (control.position.top - 1).toString();
                var div = rowDivs[name];
                if (!div) {
                    div = this.gridRow();
                    rowDivs[name] = div;
                }
                div.append(element);
            };
            FormGenerator.prototype.addGridRows = function (parent, rowDivs) {
                for (var i = 0; i < this.gridRows; i++) {
                    var div = rowDivs[i.toString()];
                    if (div) {
                        var outer = this.div("col-xs-12");
                        outer.append(div);
                        parent.append(outer);
                    }
                }
            };
            FormGenerator.prototype.isIncluded = function (control) {
                return control.isVisible && !control.isSpecial && control.name.indexOf("UPVR") <= 0;
            };
            FormGenerator.prototype.setRelative = function (element) {
                element.css("position", "relative");
            };
            FormGenerator.prototype.listViewRow = function (response) {
                var panel = response.panel;
                var sortingOrder = panel.sortingOrderComboBox;
                if (!sortingOrder) {
                    sortingOrder = panel.sortingOrderTextBox;
                }
                var view = panel.viewComboBox;
                if (!view) {
                    view = panel.viewTextBox;
                }
                if (!sortingOrder && !view) {
                    return null;
                }
                var div = this.div("col-xs-12");
                var form = this.div("m3-grid-row pull-right");
                div.append(form);
                var element;
                var label;
                var divE;
                var width = 200;
                if (sortingOrder) {
                    label = this.label("Sorting order:");
                    label.addClass("pull-left odin-margin-sm-r m3-grid-label");
                    form.append(label);
                    element = this.create(response, sortingOrder, sortingOrder.isEnabled);
                    this.setSize(element, width);
                    divE = this.div("pull-left odin-margin-md-r");
                    this.setSize(divE, width);
                    divE.append(element);
                    form.append(divE);
                }
                if (view) {
                    label = this.label("View:");
                    label.addClass("pull-left odin-margin-sm-r m3-grid-label");
                    form.append(label);
                    element = this.create(response, view, view.isEnabled);
                    this.setSize(element, width);
                    divE = this.div("pull-left");
                    this.setSize(divE, width);
                    divE.append(element);
                    form.append(divE);
                }
                return div;
            };
            FormGenerator.prototype.createListHeader = function (response) {
                var expander = this.expander("Filter Options");
                var rowDivs = {};
                var controls = response.panel.controlList;
                for (var i = 0; i < controls.length; i++) {
                    var control = controls[i];
                    if (this.isIncluded(control)) {
                        var element = this.generateControl(response, control);
                        this.addElement(control, element, rowDivs);
                    }
                }
                var viewDiv = this.listViewRow(response);
                if (viewDiv) {
                    expander.append(viewDiv);
                }
                this.addGridRows(expander, rowDivs);
                return expander;
            };
            FormGenerator.prototype.generateList = function (response, scope) {
                this.reset();
                var div = this.div();
                var ctrl = scope[M3.Constants.scopeNameFormCtrl];
                if (ctrl.isHeaderVisible) {
                    div.append(this.createListHeader(response));
                }
                var list = this.div("gridStyle");
                list.attr("ng-if", "!m3ListRefresh");
                list.attr("ui-grid", "gridOptions");
                list.attr("ui-grid-selection", "");
                list.attr("ui-grid-resize-columns", "");
                list.attr("ui-grid-infinite-scroll", "");
                div.append(list);
                return div;
            };
            FormGenerator.prototype.genereateListHeader = function (response) {
                this.reset();
                var topDiv = this.div();
                return topDiv;
            };
            return FormGenerator;
        }(ControlFactory));
        Form.FormGenerator = FormGenerator;
        var FormCtrl = (function (_super) {
            __extends(FormCtrl, _super);
            function FormCtrl(scope, formService, options) {
                if (options === void 0) { options = null; }
                _super.call(this, scope, formService.odinService, options);
                this.formService = formService;
                this.prefixFormCtrl = "[M3.FormCtrl] ";
                this.instanceId = null;
                this.formScope = scope;
                scope[M3.Constants.scopeNameFormCtrl] = this;
            }
            FormCtrl.prototype.ctrlInit = function () {
                var _this = this;
                this.setBusy();
                this.formService.userService.getUserContext().then(function (c) {
                    _this.userContext = c;
                    _this.setActive();
                    _this.onUserContext(c);
                    var hasSession = _this.formService.hasSession();
                    _this.formScope.hasSession = hasSession;
                    if (hasSession) {
                        _this.onSession();
                    }
                });
                _super.prototype.ctrlInit.call(this);
            };
            FormCtrl.prototype.beginExecute = function () {
                if (this.isBusy()) {
                    throw "Execute is not allowed when the component context is busy";
                }
                this.setBusy();
            };
            FormCtrl.prototype.endExecute = function () {
                this.setActive();
            };
            FormCtrl.prototype.hasUserContext = function () {
                var context = this.userContext;
                return context && !(context.hasError && context.hasError());
            };
            FormCtrl.prototype.onUserContext = function (userContext) {
            };
            FormCtrl.prototype.onSession = function () {
            };
            FormCtrl.prototype.onError = function (response) {
            };
            FormCtrl.prototype.onResponse = function (response) {
            };
            FormCtrl.prototype.error = function (response) {
                this.setActive();
                this.onError(response);
            };
            FormCtrl.prototype.close = function () {
                this.beginExecute();
                this.pressKey("F3");
            };
            FormCtrl.prototype.logoff = function () {
                var _this = this;
                if (this.formService.hasSession()) {
                    this.beginExecute();
                    this.formService.logoff().then(function (response) { _this.onResponse(response); });
                }
            };
            FormCtrl.prototype.verifyContext = function () {
                if (!this.hasUserContext()) {
                    throw "User context not initialized";
                }
            };
            FormCtrl.prototype.verifyInstance = function () {
                this.verifyContext();
                if (!this.formService.hasSession() || !this.instanceId) {
                    throw "No program instance";
                }
            };
            FormCtrl.prototype.pressKey = function (key) {
                this.executeCommand("KEY", key);
            };
            FormCtrl.prototype.addValue = function (control, params) {
                if (control && control.value) {
                    params[control.name] = control.value;
                }
            };
            FormCtrl.prototype.getValue = function (control) {
                if (control.type == Form.ControlType.comboBox) {
                    return control.selected.value;
                }
                return control.value;
            };
            FormCtrl.prototype.addEditable = function (panel, params) {
                var controls = panel.controlList;
                for (var i = 0; i < controls.length; i++) {
                    var control = controls[i];
                    if (control.isEnabled && control.isVisible && control.type != Form.ControlType.label) {
                        var val = this.getValue(control);
                        if (val) {
                            params[control.name] = control.value;
                        }
                    }
                }
                if (panel.list) {
                    panel.list.columns.forEach(function (column, index) {
                        if (column.positionField != null) {
                            params[column.positionField.name] = column.positionField.value;
                        }
                    });
                    this.addValue(panel.sortingOrderComboBox, params);
                    this.addValue(panel.sortingOrderTextBox, params);
                    this.addValue(panel.viewComboBox, params);
                    this.addValue(panel.viewTextBox, params);
                }
            };
            FormCtrl.prototype.createParams = function () {
                return { IID: this.instanceId };
            };
            FormCtrl.prototype.executeCommand = function (commandType, commandValue) {
                var _this = this;
                this.verifyInstance();
                var params = this.createParams();
                var response = this.formScope.response;
                if (response && response.hasPanel()) {
                    this.addEditable(response.panel, params);
                }
                this.formService.executeCommand(commandType, commandValue, params).then(function (r) { _this.onResponse(r); });
            };
            FormCtrl.prototype.executeBookmark = function (bookmark) {
                var _this = this;
                this.verifyContext();
                this.setBusy();
                var action = function () {
                    _this.formService.executeBookmark(bookmark)
                        .then(function (response) {
                        _this.setActive();
                        _this.onResponse(response);
                    }, function (r) {
                        _this.setActive();
                        _this.onError(r);
                    });
                };
                if (!this.formService.hasSession()) {
                    this.formService.logon().then(function () {
                        action();
                    });
                }
                else {
                    action();
                }
            };
            FormCtrl.injectDefault = ["$scope", "m3FormService"];
            return FormCtrl;
        }(Odin.BaseCtrl));
        Form.FormCtrl = FormCtrl;
        var DetailCtrl = (function (_super) {
            __extends(DetailCtrl, _super);
            function DetailCtrl(scope, formService, options) {
                if (options === void 0) { options = null; }
                _super.call(this, scope, formService, options);
                this.detailScope = scope;
            }
            DetailCtrl.prototype.openBookmark = function (bookmark) {
                var _this = this;
                this.beginExecute();
                bookmark.isStateless = true;
                bookmark.includeStartPanel = false;
                if (!this.formService.hasSession()) {
                    this.formService.logon()
                        .then(function () { return _this.executeBookmark(bookmark); }, function (r) { return _this.onError(r); });
                    return;
                }
                this.executeBookmark(bookmark);
            };
            DetailCtrl.prototype.onResponse = function (response) {
                this.setActive();
                this.detailScope.hasSession = this.formService.hasSession();
                if (!this.instanceId) {
                    this.instanceId = response.instanceId;
                }
                this.detailScope.response = response;
                if (response.hasPanel()) {
                    this.detailScope.isProgramOpen = true;
                    var panel = response.panel;
                    this.detailScope.panel = panel;
                    if (response.panels) {
                        var mergedControls = {};
                        for (var i = 0; i < response.panels.length; i++) {
                            var controls = response.panels[i].controls;
                            angular.extend(mergedControls, controls);
                        }
                        this.detailScope.controls = mergedControls;
                    }
                    else {
                        this.detailScope.controls = panel.controls;
                    }
                    return;
                }
                this.detailScope.isProgramOpen = false;
                this.detailScope.panel = null;
                this.detailScope.controls = null;
                if (response.message) {
                    this.odinService.messageService.showWarning(response.message);
                }
            };
            return DetailCtrl;
        }(FormCtrl));
        Form.DetailCtrl = DetailCtrl;
        var ListCtrl = (function (_super) {
            __extends(ListCtrl, _super);
            function ListCtrl(scope, formService) {
                _super.call(this, scope, formService);
                this.prefixListCtrl = "[M3.ListCtrl] ";
                this.isHeaderVisible = false;
                this.isHeaderExpanded = false;
                this.panelListDictionary = {};
                this.deregisters = [];
                this.contextMenuOptions = [{ option: "ContextMenu" }];
                this.contextMenuRelatedOptions = [];
                this.contextMenuStyle = { left: '0', top: '0', position: 'absolute', 'z-index': '40' };
                this.contextMenu = { isOpen: false };
                this.selectedListItem = {};
                this.baseBookmark = null;
                this.pendingBookmark = null;
                this.isFirst = true;
            }
            ListCtrl.prototype.initialize = function (options, panel) {
                var _this = this;
                options = Odin.DefaultListCtrlOptions.get(options);
                this.listOptions = options;
                var gridOptions = options.gridOptions;
                if (!gridOptions) {
                    gridOptions = {};
                }
                if (!gridOptions.data) {
                    gridOptions.data = options.scopeNameGridData;
                }
                if (gridOptions.multiSelect !== true) {
                    gridOptions.multiSelect = false;
                }
                if (gridOptions.enableColumnResize !== false) {
                    gridOptions.enableColumnResize = true;
                }
                if (gridOptions.enableSorting !== true) {
                    gridOptions.enableSorting = false;
                }
                gridOptions.enableRowSelection = true;
                gridOptions["enableRowHeaderSelection"] = false;
                gridOptions["enableGridMenu"] = false;
                gridOptions["infiniteScroll"] = 10;
                gridOptions["enableFiltering"] = true;
                gridOptions["useExternalFiltering"] = true;
                var enterPlugin = function ($event) {
                    _this.executeCommand("KEY", "ENTER");
                };
                gridOptions["plugins"] = [enterPlugin];
                if (!gridOptions["onRegisterApi"]) {
                    gridOptions["onRegisterApi"] = function (gridApi) {
                        _this.gridApi = gridApi;
                        gridApi.selection.on.rowSelectionChanged(_this.formScope, function (row) {
                            _this.rowSelectionChanged(row);
                        });
                        gridApi.infiniteScroll.on.needLoadMoreData(_this.formScope, function () {
                            _this.loadMoreRows();
                        });
                    };
                }
                this.formScope[options.scopeNameGridOptions] = gridOptions;
            };
            ListCtrl.prototype.destroyList = function () {
            };
            ListCtrl.prototype.getItems = function (listName) {
                return this.panelListDictionary[listName];
            };
            ListCtrl.prototype.setItems = function (items, listName) {
                this.formScope[this.listOptions.scopeNameGridData] = items;
                if (listName) {
                    this.panelListDictionary[listName] = items;
                }
                else {
                    this.panelListDictionary = {};
                }
            };
            ListCtrl.prototype.initializeList = function (panel) {
                var _this = this;
                for (var _i = 0, _a = this.deregisters; _i < _a.length; _i++) {
                    var deregister = _a[_i];
                    deregister();
                }
                var self = this;
                var init = function () {
                    self.formScope["m3ListRefresh"] = false;
                    var list = panel.list;
                    var options = {
                        gridOptions: {
                            enableColumnMenus: false,
                            columnDefs: _this.createColumns(list.columns)
                        }
                    };
                    self.initialize(options, panel);
                    if (list.isCleared) {
                        self.setItems(list.items, list.name);
                    }
                };
                if (this.isFirst) {
                    this.isFirst = false;
                    init();
                    return;
                }
                this.formScope["m3ListRefresh"] = true;
                this.formService.timeout(init, 0);
            };
            ListCtrl.prototype.loadMoreRows = function () {
                var _this = this;
                if (this.isPaging || this.isEndOfList || !this.programInstance || this.isBusy()) {
                    return;
                }
                this.beginExecute();
                this.isPaging = true;
                this.programInstance.executeCommand("PAGE", "DOWN").then(function (r) {
                    _this.onResponse(r);
                });
            };
            ListCtrl.prototype.onClickOption = function (option) {
                this.executeOption(option, this.selectedListItem);
            };
            ListCtrl.prototype.executeOption = function (option, row) {
                var keys = this.baseBookmark.keyNames;
                var keyArr = keys ? keys.split(",") : [];
                var values = this.baseBookmark.values;
                var newVals = {};
                keyArr.forEach(function (key, index) {
                    newVals[key.substring(-1, 4)] = values[key];
                });
            };
            ListCtrl.prototype.onSelectedItemChanged = function (item) {
            };
            ListCtrl.prototype.rowSelectionChanged = function (row, event) {
                var item = row.isSelected ? row.entity : null;
                this.selectedListItem = item;
                if (!this.getComponentContext().isActive()) {
                    Odin.Log.debug(this.prefixListCtrl + "Selection changed event delayed");
                    this.pendingItem = row;
                    this.pendingEvent = event;
                }
                else {
                    this.onSelectedItemChanged(item);
                }
            };
            ListCtrl.prototype.onActive = function (isActive) {
                if (isActive && this.pendingItem) {
                    Odin.Log.debug(this.prefixListCtrl + "Delivering delayed selection changed event");
                    this.rowSelectionChanged(this.pendingItem, this.pendingEvent);
                    this.pendingItem = null;
                    this.pendingEvent = null;
                }
            };
            ListCtrl.prototype.openBookmark = function (bookmark) {
                var _this = this;
                if (this.formScope.isProgramOpen) {
                    this.pendingBookmark = bookmark;
                    this.close();
                    return;
                }
                this.beginExecute();
                if (!this.formService.hasSession()) {
                    this.formService.logon()
                        .then(function () { return _this.executeBookmark(bookmark); }, function (r) { return _this.onError(r); });
                    return;
                }
                this.baseBookmark = bookmark;
                this.executeBookmark(bookmark);
            };
            ListCtrl.prototype.onResponse = function (response) {
                this.setActive();
                this.formScope.hasSession = this.formService.hasSession();
                if (!this.instanceId) {
                    this.instanceId = response.instanceId;
                }
                if (response.hasPanel()) {
                    if (this.formScope.isProgramOpen) {
                        if (response.panel.list) {
                            if (response.request.commandType != "PAGE") {
                                this.initializeList(response.panel);
                            }
                            this.updateListRows(response.panel.list);
                        }
                    }
                    else {
                        this.formScope.isProgramOpen = true;
                        this.programInstance = new M3.ProgramInstance(this.formService, response.instanceId);
                        if (response.panel.list) {
                            this.initializeList(response.panel);
                        }
                    }
                    this.formScope.response = response;
                    this.formScope.controls = response.panel.controls;
                    return;
                }
                this.onProgramClosed();
                if (response.message) {
                    alert(response.message);
                }
                if (this.pendingBookmark) {
                    this.openBookmark(this.pendingBookmark);
                    this.pendingBookmark = null;
                }
            };
            ListCtrl.prototype.onProgramClosed = function () {
                this.formScope.isProgramOpen = false;
                this.programInstance = null;
                this.isEndOfList = false;
                this.isPaging = false;
                this.setItems([]);
            };
            ListCtrl.prototype.updateListRows = function (list) {
                var items = this.getItems(list.name);
                var newItems = list.items;
                var count = newItems.length;
                if (count == 0) {
                    this.isEndOfList = true;
                    return;
                }
                for (var i = 0; i < count; i++) {
                    items.push(newItems[i]);
                }
                Odin.Log.debug(this.prefixListCtrl + "Added " + count + " list rows.");
                if (this.isPaging) {
                    this.gridApi.infiniteScroll.dataLoaded();
                    this.isPaging = false;
                }
            };
            ListCtrl.prototype.createColumns = function (columns) {
                var _this = this;
                var gridColumns = [];
                var enterDiv = "<div odin-keypress=\"{'enter': 'grid.options.plugins[0]($event)'}\" >";
                var myHeaderCellTemplate = enterDiv +
                    "<div ng-class=\"{ 'sortable': sortable }\">" +
                    "<div class=\"ui-grid-vertical-bar\">&nbsp;</div>" +
                    "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">{{ col.displayName CUSTOM_FILTERS }} <span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span></div>" +
                    "<div class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && !col.colDef.disableColumnMenu\" class=\"ui-grid-column-menu-button\" ng-click=\"toggleMenu($event)\"><i class=\"ui-grid-icon-angle-down\">&nbsp;<i></i></i></div>" +
                    "<div ng-if=\"filterable\" class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\"><input type=\"text\" class=\"ui-grid-filter-input\" ng-model=\"colFilter.term\" ng-click=\"$event.stopPropagation()\" ng-attr-placeholder=\"{{colFilter.placeholder || ''}}\" ><div class=\"ui-grid-filter-button\" ng-click=\"colFilter.term = null\"><i class=\"ui-grid-icon-cancel right\" ng-show=\"!!colFilter.term\">&nbsp;</i> <!-- use !! because angular interprets 'f' as false --></div></div></div>" +
                    "</div>";
                columns.forEach(function (column, index) {
                    var width = column.width * 10;
                    if (width < 50) {
                        width = 50;
                    }
                    var isPostionField = column.positionField != null;
                    _this.formScope[column.fullName] = "";
                    var gridColumn = {
                        field: column.fullName,
                        name: column.fullName,
                        enableFiltering: (isPostionField),
                        filter: isPostionField ? { term: column.positionField.value || "" } : null,
                        headerCellTemplate: isPostionField ? myHeaderCellTemplate : null,
                        displayName: column.header,
                        width: width,
                        enableSorting: false,
                        resizable: true
                    };
                    if (column.positionField != null) {
                        var filterTermWatchString = "gridOptions.columnDefs[" + index + "].filter.term";
                        _this.deregisters.push(_this.formScope.$watch(filterTermWatchString, function (newval, oldval) {
                            column.positionField.value = newval;
                        }));
                    }
                    gridColumns.push(gridColumn);
                });
                return gridColumns;
            };
            return ListCtrl;
        }(FormCtrl));
        Form.ListCtrl = ListCtrl;
        var FieldLabelDirective = (function () {
            function FieldLabelDirective() {
            }
            FieldLabelDirective.add = function (m) {
                m.directive("m3FieldLabel", ["$compile", function ($compile) {
                        return {
                            scope: false,
                            link: function (scope, element, attributes, controller, transclude) {
                                scope.$watch("response", function (response) {
                                    FieldLabelDirective.update(response, $compile, scope, element, attributes);
                                });
                            }
                        };
                    }]);
            };
            FieldLabelDirective.update = function (response, $compile, scope, label, attributes) {
                if (!response || !response.panel) {
                    return;
                }
                var field = attributes["m3FieldLabel"];
                if (!field) {
                    return;
                }
                var info = Form.FormUtil.findControlAndLabels(response, field);
                if (info && info.label) {
                    label.text(info.label.value);
                    label.attr("for", Form.FormUtil.getInputId(response, field));
                }
            };
            return FieldLabelDirective;
        }());
        Form.FieldLabelDirective = FieldLabelDirective;
        var FieldInfoDirective = (function () {
            function FieldInfoDirective() {
            }
            FieldInfoDirective.add = function (m) {
                m.directive("m3FieldInfo", ["$compile", function ($compile) {
                        return {
                            scope: false,
                            link: function (scope, element, attributes, controller, transclude) {
                                scope.$watch("response", function (response) {
                                    FieldInfoDirective.update(response, $compile, scope, element, attributes);
                                });
                            }
                        };
                    }]);
            };
            FieldInfoDirective.update = function (response, $compile, scope, label, attributes) {
                if (!response || !response.panel) {
                    return;
                }
                var field = attributes["m3FieldInfo"];
                if (!field) {
                    return;
                }
                var info = Form.FormUtil.findControlAndLabels(response, field);
                if (info && info.additionalInfo) {
                    label.text(info.additionalInfo.value);
                }
            };
            return FieldInfoDirective;
        }());
        Form.FieldInfoDirective = FieldInfoDirective;
        var FieldPresenterDirective = (function () {
            function FieldPresenterDirective() {
            }
            FieldPresenterDirective.add = function (m) {
                m.directive("m3FieldPresenter", ["$compile", function ($compile) {
                        return {
                            scope: false,
                            link: function (scope, element, attributes, controller, transclude) {
                                scope.$watch("response", function (response) {
                                    FieldPresenterDirective.update(response, $compile, scope, element, attributes);
                                });
                            }
                        };
                    }]);
            };
            FieldPresenterDirective.update = function (response, $compile, scope, div, attributes) {
                if (!response || !response.panel) {
                    return;
                }
                var field = attributes["m3FieldPresenter"];
                if (!field) {
                    return;
                }
                var isEnabled = Odin.Util.getBoolean(attributes["m3Enabled"], false);
                var info = Form.FormUtil.findControlAndLabels(response, field);
                if (info && info.control) {
                    var input = ControlFactory.current.create(response, info.control, isEnabled);
                    div.append($compile(input)(scope));
                }
            };
            return FieldPresenterDirective;
        }());
        Form.FieldPresenterDirective = FieldPresenterDirective;
        var ListDirective = (function () {
            function ListDirective() {
            }
            ListDirective.add = function (m) {
                m.directive("m3List", ["$compile", function ($compile) {
                        return {
                            scope: false,
                            restrict: "E",
                            link: function (scope, element, attributes, controller, transclude) {
                                scope.$watch("response", function (response) {
                                    ListDirective.update(response, $compile, scope, element, attributes);
                                });
                            }
                        };
                    }
                ]);
            };
            ListDirective.update = function (response, $compile, scope, div, attributes) {
                if (!response || !response.panel) {
                    return;
                }
                if (response.request.commandType !== "PAGE") {
                    div.empty();
                    var generator = new FormGenerator();
                    var list = generator.generateList(response, scope);
                    div.append($compile(list)(scope));
                }
            };
            return ListDirective;
        }());
        Form.ListDirective = ListDirective;
        var DetailLayoutDirective = (function () {
            function DetailLayoutDirective() {
            }
            DetailLayoutDirective.add = function (m) {
                m.directive("m3DetailLayout", ["$compile", function ($compile) {
                        return {
                            scope: false,
                            restrict: "E",
                            link: function (scope, element, attributes, controller, transclude) {
                                scope.$watch("response", function (response) {
                                    DetailLayoutDirective.update(response, $compile, scope, element, attributes);
                                });
                            }
                        };
                    }]);
            };
            DetailLayoutDirective.update = function (response, $compile, scope, div, attributes) {
                if (!response || !response.panel) {
                    return;
                }
                var fields = null;
                var attr = attributes["fields"];
                if (attr) {
                    fields = attr.split(",");
                }
                if (!fields) {
                    return;
                }
                var columnCount = Odin.NumUtil.getInt(attributes["columns"], 1);
                if (columnCount < 0) {
                    columnCount = 1;
                }
                if (columnCount > 4) {
                    columnCount = 4;
                }
                var enabledFields = attributes["enabledFields"];
                var isFormEnabled = Odin.Util.getBoolean(attributes["enable"], false);
                var isAdditional = Odin.Util.getBoolean(attributes["additional"], true);
                var isAbsolute = Odin.Util.getBoolean(attributes["absolute"], false);
                var isLeft = false;
                var align = attributes["labelAlign"];
                if (align && align.charAt(0) == "l") {
                    isLeft = true;
                }
                var fullWidth = 12;
                var colWidth = fullWidth;
                var labelWidth = 3;
                var fieldWidth = isAdditional && !isAbsolute ? 6 : 9;
                var additionalWidth = 0;
                labelWidth = Odin.NumUtil.getInt(attributes["labelSize"], labelWidth);
                fieldWidth = Odin.NumUtil.getInt(attributes["fieldSize"], fieldWidth);
                if (isAdditional) {
                    additionalWidth = 3;
                    additionalWidth = Odin.NumUtil.getInt(attributes["additionalSize"], additionalWidth);
                }
                var total = labelWidth + fieldWidth + additionalWidth;
                if (total > fullWidth) {
                    Odin.Log.warning("[m3-detail-layout] Invalid total size " + total);
                }
                var colPrefix = "col-md-";
                var factory = ControlFactory.current;
                var form = factory.form();
                div.empty();
                div.append(form);
                if (columnCount == 4) {
                    colWidth = 3;
                }
                else if (columnCount == 3) {
                    colWidth = 4;
                }
                else if (columnCount == 2) {
                    colWidth = 6;
                }
                var row = factory.row();
                form.append(row);
                var currentColumn = 0;
                for (var i = 0; i < fields.length; i++) {
                    var colDiv = factory.div(colPrefix + colWidth);
                    row.append(colDiv);
                    var group = factory.formGroup();
                    colDiv.append(group);
                    var label;
                    var col;
                    var field = fields[i].trim();
                    var isBlank = field == "BLANK";
                    var info = isBlank ? null : Form.FormUtil.findControlAndLabels(response, field);
                    if (info && info.control) {
                        var id = Form.FormUtil.getInputId(response, field);
                        col = colPrefix + labelWidth;
                        if (info.label) {
                            label = factory.label(info.label.value, id);
                            label.addClass(col);
                            if (isLeft) {
                                label.addClass("odin-align-l");
                            }
                            group.append(label);
                        }
                        else {
                            group.append(factory.div(col));
                        }
                        col = colPrefix + fieldWidth;
                        var control = info.control;
                        var isEnabled = isFormEnabled;
                        if (!isEnabled && enabledFields && enabledFields.indexOf(control.name) >= 0) {
                            isEnabled = true;
                        }
                        var input = factory.create(response, control, isEnabled);
                        if (isAbsolute) {
                            factory.setSize(input, factory.gridWidth(control.position.width));
                        }
                        var divInput = factory.div(col);
                        divInput.append($compile(input)(scope));
                        group.append(divInput);
                        var additional = info.additionalInfo;
                        if (isAdditional && additional) {
                            var text = additional.value;
                            if (text) {
                                label = factory.label("{{" + factory.getPath(additional) + "}}");
                                label.addClass("odin-additional-label");
                                if (isAbsolute) {
                                    input.addClass("pull-left");
                                    label.addClass("odin-padding-md-l");
                                    divInput.append($compile(label)(scope));
                                }
                                else {
                                    col = colPrefix + additionalWidth;
                                    label.addClass(col);
                                    group.append($compile(label)(scope));
                                }
                            }
                        }
                    }
                    else {
                        col = colPrefix + fullWidth;
                        colDiv.append(factory.div(col));
                    }
                    currentColumn++;
                    if (currentColumn >= columnCount) {
                        row = factory.row();
                        form.append(row);
                        currentColumn = 0;
                    }
                }
            };
            return DetailLayoutDirective;
        }());
        Form.DetailLayoutDirective = DetailLayoutDirective;
        var MIBrowseCtrl = (function (_super) {
            __extends(MIBrowseCtrl, _super);
            function MIBrowseCtrl(scope, modalInstance, miService, languageService, browseConfiguration) {
                var _this = this;
                _super.call(this, scope, miService);
                this.scope = scope;
                this.modalInstance = modalInstance;
                this.miService = miService;
                this.languageService = languageService;
                this.browseConfiguration = browseConfiguration;
                this.selectedItem = null;
                this.registerComponent({ scope: this.scope });
                var lang = languageService.tryGet();
                scope["lang"] = lang;
                if (this.browseConfiguration) {
                    var options = {
                        header: this.browseConfiguration.header,
                        message: this.browseConfiguration.message
                    };
                    var listOptions = { enableGridInfiniteScroll: false, gridOptions: this.browseConfiguration.gridOptions, scopeNameGridOptions: "gridOptions" };
                    this.initialize(listOptions);
                    this.scope.options = options;
                    this.scope.gridOptions = listOptions.gridOptions;
                }
                else {
                    Odin.Log.error("Missing browseConfiguration");
                }
                this.scope.ok = function () {
                    _this.ok();
                };
                this.scope.cancel = function () {
                    _this.cancel();
                };
            }
            MIBrowseCtrl.add = function (m) {
                m.controller("MIBrowseCtrl", MIBrowseCtrl);
            };
            MIBrowseCtrl.prototype.onSelectedItemChanged = function (item) {
                this.selectedItem = item;
            };
            MIBrowseCtrl.prototype.onReady = function () {
                if (this.browseConfiguration) {
                    var miRequest = this.browseConfiguration.serviceConfigration;
                    miRequest.record = this.browseConfiguration.data;
                    this.executeRequest(miRequest);
                }
            };
            MIBrowseCtrl.prototype.ok = function () {
                this.modalInstance.close(this.selectedItem);
            };
            MIBrowseCtrl.prototype.cancel = function () {
                this.modalInstance.close(null);
            };
            MIBrowseCtrl.$inject = ["$scope", "$uibModalInstance", "m3MIService", "odinLanguageService", "browseConfiguration"];
            return MIBrowseCtrl;
        }(M3.MIListCtrl));
        Form.MIBrowseCtrl = MIBrowseCtrl;
        var BrowseService = (function () {
            function BrowseService($modal, $q, miService) {
                this.$modal = $modal;
                this.$q = $q;
                this.miService = miService;
                this.configurations = {};
                this.defaultSettings = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: "odin/partials/modalMessage.html"
                };
            }
            BrowseService.add = function (m) {
                m.service("m3BrowseService", BrowseService);
            };
            BrowseService.prototype.register = function (configuration) {
                this.configurations[configuration.name] = configuration;
            };
            BrowseService.prototype.browse = function (name, data) {
                var config = this.configurations[name];
                if (config) {
                    var configCopy = new M3.BrowseConfiguration();
                    angular.copy(config, configCopy);
                    configCopy.data = data;
                    var controller;
                    if (config.serviceType !== M3.BrowseServiceType.MI) {
                        var msg = config.serviceType + " is not supported";
                        Odin.Log.error(msg);
                        throw msg;
                    }
                    controller = MIBrowseCtrl;
                    var promise = this.$modal.open({
                        templateUrl: Odin.BrowseConstants.browseGridTemplateName,
                        controller: controller,
                        backdrop: 'static',
                        resolve: {
                            browseConfiguration: function () {
                                return configCopy;
                            }
                        }
                    }).result;
                    return promise;
                }
                else {
                    var deferred = this.$q.defer();
                    deferred.reject("Configuration " + name + " does not exist.");
                    return deferred.promise;
                }
            };
            BrowseService.$inject = ["$uibModal", "$q", "m3MIService"];
            return BrowseService;
        }());
        Form.BrowseService = BrowseService;
    })(Form = M3.Form || (M3.Form = {}));
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var Form;
    (function (Form) {
        var Translator = (function () {
            function Translator() {
            }
            Translator.prototype.translate = function (request) {
                var language = request.language;
                var cache = this.getLanguage(language);
                var constants = "";
                var items = request.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    item.text = null;
                    if (item.key) {
                        item.language = language;
                        var key = this.getKey(item);
                        var text = cache[key];
                        if (text) {
                            item.text = text;
                        }
                        else {
                            if (!item.file) {
                                item.file = Translator.defaultFile;
                            }
                            if (constants.indexOf(key) < 0) {
                                constants += key + ",";
                            }
                        }
                    }
                }
                if (constants.length == 0) {
                    return null;
                }
                var job = {
                    items: items,
                    constants: constants,
                    language: language,
                    params: {
                        LANC: language,
                        CONSTANTS: constants
                    },
                    commandType: "FNC",
                    commandValue: "TRANSLATE"
                };
                return job;
            };
            Translator.prototype.parseResponse = function (job, content) {
                var document = Form.Parser.parseXml(content);
                var root = Form.Parser.selectRoot(document);
                if (!root) {
                    return;
                }
                var nodes = document.getElementsByTagName("Text");
                if (!nodes) {
                    return;
                }
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var file = Form.XmlUtil.getAttribute(node, "file");
                    var key = Form.XmlUtil.getAttribute(node, "key");
                    var text = node.textContent;
                    this.updateItem(job.items, job.language, file, key, text);
                }
            };
            Translator.prototype.getKey = function (item) {
                if (!item.file) {
                    item.file = Translator.defaultFile;
                }
                return item.file + ":" + item.key;
            };
            Translator.prototype.addToCache = function (language, item) {
                var languagCache = this.getLanguage(language);
                languagCache[this.getKey(item)] = item.text;
            };
            Translator.prototype.getLanguage = function (name) {
                var language = Translator.languages[name];
                if (!language) {
                    language = {};
                    Translator.languages[name] = language;
                }
                return language;
            };
            Translator.prototype.updateItem = function (items, language, file, key, text) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (key === item.key && file === item.file) {
                        item.language = language;
                        if (!item.text) {
                            item.text = text;
                            this.addToCache(language, item);
                        }
                    }
                }
            };
            Translator.defaultFile = "MVXCON";
            Translator.languages = {};
            return Translator;
        }());
        Form.Translator = Translator;
    })(Form = M3.Form || (M3.Form = {}));
})(M3 || (M3 = {}));
var M3;
(function (M3) {
    var MIService = (function () {
        function MIService(http, q, timeout, odinService) {
            this.http = http;
            this.q = q;
            this.timeout = timeout;
            this.odinService = odinService;
            this.logPrefix = "[MIService] ";
        }
        MIService.add = function (m) {
            m.service("m3MIService", MIService);
        };
        MIService.prototype.overrideUrl = function (url) {
            this._overrideUrl = url;
        };
        MIService.prototype.getBaseUrl = function () {
            return (this._overrideUrl ? this._overrideUrl : M3.Configuration.getUrl());
        };
        MIService.prototype.createRequest = function (program, transaction, record, outputFields) {
            var request = {
                program: program,
                transaction: transaction,
                record: angular.copy(record)
            };
            if (outputFields != null && outputFields.length > 0) {
                request.outputFields = outputFields;
            }
            return request;
        };
        MIService.prototype.executeRequest = function (request) {
            var _this = this;
            var url = M3.MIAccess.createUrl(this.getBaseUrl(), request);
            var deferred = this.q.defer();
            if (Odin.Log.isDebug()) {
                Odin.Log.debug(this.logPrefix + "Executing MI URL " + url);
            }
            let headers = undefined;
            if(request.csrfToken !=null){
            	headers = { 'fnd-csrf-token' : request.csrfToken}
            }
            this.http({ method: "GET", url: url, cache: false, headers }).then(function (httpResponse) {
                try {
                    var response = M3.MIAccess.parseResponse(request, httpResponse.data);
                    if (response.hasError()) {
                        response.errorType = M3.M3ErrorTypes.MI;
                        deferred.reject(response);
                    }
                    else {
                        deferred.resolve(response);
                    }
                }
                catch (e) {
                    _this.logError("Failed to parse response for " + url);
                    var errorResponse = new M3.MIResponse();
                    errorResponse.error = e;
                    errorResponse.errorType = Odin.ErrorTypes.parse;
                    deferred.reject(errorResponse);
                }
            }, function (httpResponse) {
                var response = new M3.MIResponse();
                var status = httpResponse.status;
                var message = "Failed to call " + request.program + "." + request.transaction + " " + status;
                response.errorMessage = message;
                response.errorCode = status;
                response.errorType = Odin.ErrorTypes.http;
                _this.logError(message);
                deferred.reject(response);
            });
            return deferred.promise;
        };
        MIService.prototype.logError = function (message) {
            Odin.Log.error(this.logPrefix + message);
        };
        MIService.prototype.execute = function (program, transaction, record, outputfields) {
            return this.executeRequest(this.createRequest(program, transaction, record, outputfields));
        };
        MIService.$inject = ["$http", "$q", "$timeout", "odinService"];
        return MIService;
    }());
    var UserContext = (function (_super) {
        __extends(UserContext, _super);
        function UserContext() {
            _super.call(this);
            this.numberFormatOptions = {
                separator: "."
            };
        }
        UserContext.current = new UserContext();
        return UserContext;
    }(Odin.ErrorState));
    M3.UserContext = UserContext;
    var UserService = (function () {
        function UserService($http, $q, $timeout, miService) {
            this.$http = $http;
            this.$q = $q;
            this.$timeout = $timeout;
            this.miService = miService;
            this.isUserContextAvailable = true;
            this.queue = [];
            this.isExecuting = false;
            this.isH5Host = false;
            this.isMessagePending = false;
            this.sessionId = null;
            this.init();
        }
        UserService.add = function (m) {
            m.service("m3UserService", UserService);
        };
        UserService.prototype.isH5 = function () {
            return this.isH5Host;
        };
        UserService.prototype.getSesssionId = function () {
            return this.sessionId;
        };
        UserService.prototype.init = function () {
            var _this = this;
            if (Odin.Util.isIframe()) {
                this.registerMessage();
                var message = {
                    m3Command: "user",
                };
                this.$timeout(function () { return _this.onTimeout(); }, 500);
                this.isMessagePending = true;
                this.isExecuting = true;
                this.sendMessage(message);
            }
        };
        UserService.prototype.onTimeout = function () {
            if (this.isMessagePending) {
                this.isMessagePending = false;
                this.isExecuting = false;
                if (this.queue.length > 0) {
                    this.loadUserId();
                }
            }
        };
        UserService.prototype.onMessage = function (data) {
            var message = angular.fromJson(data);
            if (message.m3Command === "user") {
                var response = message.m3Response;
                this.m3User = response.m3User;
                this.principalUser = response.principalUser;
                this.isMessagePending = false;
                this.isH5Host = true;
                this.sessionId = response.sessionId;
                var userContext = this.createUserContext(response.userContext);
                this.setContext(userContext);
            }
        };
        UserService.prototype.registerMessage = function () {
            var _this = this;
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
            eventer(messageEvent, function (e) {
                var key = e.message ? "message" : "data";
                var data = e[key];
                _this.onMessage(data);
            }, false);
        };
        UserService.prototype.sendMessage = function (message) {
            parent.postMessage(angular.toJson(message), "*");
        };
        UserService.prototype.createErrorContext = function (errorMessage) {
            var context = new UserContext();
            context.errorMessage = errorMessage;
            this.userContext = context;
        };
        UserService.prototype.processQueue = function (isResolved) {
            var queue = this.queue;
            this.queue = [];
            for (var i = 0; i < queue.length; i++) {
                var deferred = queue[i];
                if (isResolved) {
                    deferred.resolve(this.userContext);
                }
                else {
                    deferred.reject(this.userContext);
                }
            }
            this.isExecuting = false;
        };
        UserService.prototype.rejectQueue = function (errrorMessage) {
            this.createErrorContext(errrorMessage);
            this.processQueue(false);
        };
        UserService.prototype.parseUser = function (data) {
            var rows = data.split("\n");
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.indexOf("User:") > 0 && row.indexOf("GridPrincipal") >= 0) {
                    var items = row.split(":");
                    if (items.length > 1) {
                        return items[items.length - 1].trim();
                    }
                    return null;
                }
            }
            return null;
        };
        UserService.prototype.onGridUser = function (httpResponse) {
            var user = this.parseUser(httpResponse.data);
            if (user) {
                this.principalUser = user;
                this.m3User = user.toUpperCase();
                Odin.Log.debug(UserService.logPrefix + "Loaded user " + this.m3User);
                this.loadUserData();
            }
            else {
                this.isUserContextAvailable = false;
                Odin.Log.warning(UserService.logPrefix + "User not found. Status " + httpResponse.status);
                this.rejectQueue("User not available");
            }
        };
        UserService.prototype.loadUserId = function () {
            var _this = this;
            if (this.isExecuting) {
                return;
            }
            this.isExecuting = true;
            var url = M3.Configuration.getUrl() + "/grid/user";
            Odin.Log.debug(UserService.logPrefix + "Loading user from " + url);
            this.$http({ method: "GET", url: url }).then(function (httpResponse) {
                _this.onGridUser(httpResponse);
            }, function (httpResponse) {
                _this.onGridUser(httpResponse);
            });
        };
        UserService.prototype.addAliases = function (context) {
            context.m3User = context.USID;
            context["M3User"] = context.USID;
            context.company = context.CONO;
            context["Company"] = context.CONO;
            context.currentCompany = context.CONO;
            context["CurrentCompany"] = context.CONO;
            context.division = context.DIVI;
            context["Division"] = context.DIVI;
            context.currentDivision = context.DIVI;
            context["CurrentDivision"] = context.DIVI;
            context.language = context.LANC;
            context["Language"] = context.LANC;
            context.currentLanguage = context.LANC;
            context["CurrentLanguage"] = context.LANC;
            context.dateFormat = M3.Configuration.getDateFormat(context.DTFM);
            context.languageTag = M3.Configuration.getLanguageTag(context.LANC);
            context.numberFormatOptions = {
                separator: context.DCFM
            };
        };
        UserService.prototype.setContext = function (context) {
            this.m3User = context.USID;
            context.principalUser = this.principalUser;
            this.addAliases(context);
            this.userContext = context;
            UserContext.current = context;
            this.processQueue(true);
            Odin.Log.info("[UserService] Initialized user context for " + this.m3User + " " + context.currentCompany + "/" + context.currentDivision);
        };
        UserService.prototype.onUserData = function (item) {
            var context = this.createUserContext(item);
            this.setContext(context);
        };
        UserService.prototype.createUserContext = function (item) {
            var context = new UserContext();
            angular.extend(context, item);
            return context;
        };
        UserService.prototype.loadUserData = function () {
            var _this = this;
            var parameters = {};
            var usid = this.m3User;
            if (usid.length <= 10) {
                parameters = { USID: usid };
            }
            this.miService.execute("MNS150MI", "GetUserData", parameters).then(function (response) {
                _this.onUserData(response.item);
            }, function (response) {
                _this.rejectQueue(response.errorMessage);
            });
        };
        UserService.prototype.getUserContext = function () {
            var deferred = this.$q.defer();
            if (!this.isUserContextAvailable) {
                this.createErrorContext("M3 UserContext not available");
                deferred.reject(this.userContext);
            }
            else if (this.userContext) {
                deferred.resolve(this.userContext);
            }
            else {
                this.queue.push(deferred);
                this.loadUserId();
            }
            return deferred.promise;
        };
        UserService.$inject = ["$http", "$q", "$timeout", "m3MIService"];
        UserService.logPrefix = "[M3.UserService] ";
        return UserService;
    }());
    M3.UserService = UserService;
    var ProgramInstance = (function () {
        function ProgramInstance(formService, instanceId) {
            this.formService = formService;
            this.instanceId = instanceId;
        }
        ProgramInstance.prototype.pressKey = function (key, params) {
            return this.executeCommand(key, null, params);
        };
        ProgramInstance.prototype.close = function () {
            return this.pressKey("F3");
        };
        ProgramInstance.prototype.executeCommand = function (commandType, commandValue, params) {
            var request = {
                commandType: commandType,
                commandValue: commandValue,
                params: params,
                instanceId: this.instanceId
            };
            return this.formService.execute(request);
        };
        return ProgramInstance;
    }());
    M3.ProgramInstance = ProgramInstance;
    var FormService = (function () {
        function FormService(rootScope, http, q, timeout, odinService, userService) {
            var _this = this;
            this.rootScope = rootScope;
            this.http = http;
            this.q = q;
            this.timeout = timeout;
            this.odinService = odinService;
            this.userService = userService;
            window.addEventListener("unload", function () { _this.onUnload(); }, false);
        }
        FormService.add = function (m) {
            m.service("m3FormService", FormService);
        };
        FormService.prototype.overrideUrl = function (url) {
            this._overrideUrl = url;
        };
        FormService.prototype.getBaseUrl = function () {
            return (this._overrideUrl ? this._overrideUrl : M3.Configuration.getUrl()) + "/mne/servlet/MvxMCSvt";
        };
        FormService.prototype.onUnload = function () {
            if (!this.userService.isH5() && this.hasSession()) {
                this.logoffSync();
                this.sessionId = null;
            }
        };
        FormService.prototype.executeSync = function (url) {
            try {
                var request = new XMLHttpRequest();
                request.open("GET", url, false);
                request.send(null);
            }
            catch (e) {
            }
        };
        FormService.prototype.logoffSync = function () {
            var url = this.getBaseUrl() + "?CMDTP=QUIT&SID=" + this.sessionId + "&RID=" + Odin.Util.random();
            this.sessionId = null;
            this.executeSync(url);
        };
        FormService.prototype.launch = function (link) {
            var task = {
                link: link
            };
            var message = {
                m3Command: "launch",
                m3Parameter: task
            };
            this.userService.sendMessage(message);
        };
        FormService.prototype.hasSession = function () {
            if (!this.sessionId) {
                this.sessionId = this.userService.getSesssionId();
            }
            return this.sessionId != null;
        };
        FormService.prototype.parseResponse = function (request, content) {
            var response = M3.Form.Parser.parse(content);
            response.request = request;
            if (!this.sessionId) {
                this.sessionId = response.sessionId;
            }
            return response;
        };
        FormService.prototype.getUserContext = function () {
            return this.userService.getUserContext();
        };
        FormService.prototype.logon = function () {
            var _this = this;
            var deferred = this.q.defer();
            if (this.hasSession()) {
                var response = new M3.Form.Response();
                response.sessionId = this.sessionId;
                deferred.resolve(response);
            }
            else {
                this.userService.getUserContext().then(function (userContext) {
                    _this.userContext = userContext;
                    _this.command("LOGON", null).then(function (r) {
                        deferred.resolve(r);
                    }, function (r) {
                        deferred.reject(r);
                    });
                });
            }
            return deferred.promise;
        };
        FormService.prototype.logoff = function () {
            var promise = this.command("QUIT", null);
            this.sessionId = null;
            return promise;
        };
        FormService.prototype.ping = function () {
            return this.command("FNC", "PING");
        };
        FormService.prototype.command = function (type, value) {
            var request = {
                commandType: type,
            };
            if (value) {
                request.commandValue = value;
            }
            if (this.sessionId) {
                request.sessionId = this.sessionId;
            }
            return this.execute(request);
        };
        FormService.prototype.addParam = function (params, name, value) {
            if (value) {
                params[name] = value;
            }
        };
        FormService.prototype.createParams = function (request) {
            var params = {};
            if (request.params) {
                angular.extend(params, request.params);
            }
            this.addParam(params, "CMDTP", request.commandType);
            this.addParam(params, "CMDVAL", request.commandValue);
            this.addParam(params, "SID", request.sessionId);
            this.addParam(params, "IID", request.instanceId);
            this.addParam(params, "RID", Odin.Util.random());
            return params;
        };
        FormService.prototype.createError = function (httpResponse) {
            Odin.Log.error(FormService.logPrefix + "Failed to execute request");
            var response = new M3.Form.Response();
            response.result = -1;
            return response;
        };
        FormService.prototype.createOptions = function (request) {
            return { method: "POST", cache: false, url: this.getBaseUrl(), params: this.createParams(request) };
        };
        FormService.prototype.executeBookmark = function (bookmark) {
            var request = {
                commandType: "RUN",
                commandValue: "BOOKMARK",
                params: M3.Form.Bookmark.toParams(bookmark, this.userContext)
            };
            return this.execute(request);
        };
        FormService.prototype.pressKey = function (key, params) {
            return this.executeCommand(key, null, params);
        };
        FormService.prototype.executeCommand = function (commandType, commandValue, params) {
            var request = {
                commandType: commandType,
                commandValue: commandValue,
                params: params
            };
            return this.execute(request);
        };
        FormService.prototype.destroyProgram = function (instanceId) {
            return this.pressKey("F3");
        };
        FormService.prototype.execute = function (request) {
            var _this = this;
            var deferred = this.q.defer();
            if (!request.sessionId) {
                request.sessionId = this.sessionId;
            }
            Odin.Log.debug(FormService.logPrefix + "Executing request " + request.commandType);
            var options = this.createOptions(request);
            this.http(options).then(function (httpResponse) {
                deferred.resolve(_this.parseResponse(request, httpResponse.data));
            }, function (httpResponse) {
                deferred.reject(_this.createError(httpResponse));
            });
            return deferred.promise;
        };
        FormService.prototype.executeUrl = function (url) {
            var deferred = this.q.defer();
            this.http({ method: "GET", url: url }).then(function (httpResponse) {
                deferred.resolve(httpResponse.data);
            }, function (httpResponse) {
                deferred.resolve(null);
            });
            return deferred.promise;
        };
        FormService.prototype.onTranslate = function (job, data) {
            this.translator.parseResponse(job, data);
            job.params = null;
            return job;
        };
        FormService.prototype.translate = function (request) {
            var _this = this;
            var deferred = this.q.defer();
            if (!this.translator) {
                this.translator = new M3.Form.Translator();
            }
            var job = this.translator.translate(request);
            if (job) {
                job.sessionId = this.sessionId;
                var options = this.createOptions(job);
                this.http(options).then(function (httpResponse) {
                    deferred.resolve(_this.onTranslate(job, httpResponse.data));
                }, function (httpResponse) {
                    deferred.reject(_this.createError(httpResponse));
                });
            }
            else {
                deferred.resolve(request);
            }
            return deferred.promise;
        };
        FormService.logPrefix = "[M3.FormService] ";
        FormService.$inject = ["$rootScope", "$http", "$q", "$timeout", "odinService", "m3UserService"];
        return FormService;
    }());
    M3.FormService = FormService;
    var DateFilter = (function () {
        function DateFilter() {
        }
        DateFilter.add = function (m) {
            m.filter("m3Date", ["$filter", function (filter) {
                    return function (date) {
                        if (date === null) {
                            return null;
                        }
                        if (date === 'undefined') {
                            return null;
                        }
                        var format = UserContext.current.dateFormat;
                        if (!format) {
                            format = M3.Constants.dateFormat;
                        }
                        return filter("date")(date, format);
                    };
                }]);
        };
        return DateFilter;
    }());
    var NumberFilter = (function () {
        function NumberFilter() {
        }
        NumberFilter.add = function (m) {
            m.filter("m3Number", function () { return function (value) {
                return Odin.NumUtil.format(value);
            }; });
        };
        return NumberFilter;
    }());
    var Service = (function () {
        function Service(miService, userService, formService) {
            this.miService = miService;
            this.userService = userService;
            this.formService = formService;
        }
        Service.add = function (m) {
            m.service("m3Service", Service);
        };
        Service.$inject = ["m3MIService", "m3UserService", "m3FormService"];
        return Service;
    }());
    M3.Service = Service;
    var StartupService = (function (_super) {
        __extends(StartupService, _super);
        function StartupService(rootScope, q, location, service, m3Service) {
            _super.call(this, rootScope, q, location, service);
            this.m3Service = m3Service;
            this.logPrefix = "[M3.StartupService] ";
        }
        StartupService.add = function (m) {
            m.service("m3StartupService", StartupService);
        };
        StartupService.prototype.getResolvedPromise = function (arg) {
            var deferred = this.q.defer();
            deferred.resolve(arg);
            return deferred.promise;
        };
        StartupService.prototype.start = function (options) {
            var _this = this;
            if (this.isReady()) {
                throw this.raiseReady();
            }
            if (!options) {
                options = {
                    userContext: true,
                    useM3Language: true
                };
            }
            if (options.session) {
                options.userContext = true;
            }
            var languageOptions;
            if (options.useM3Language) {
                options.userContext = true;
                languageOptions = options.languageOptions;
                if (!languageOptions) {
                    options.languageOptions = languageOptions = {};
                }
            }
            _super.prototype.initialize.call(this, options);
            var url = this.getUrlOverride("M3");
            if (url) {
                M3.Configuration.overrideUrl(url);
            }
            var defered = this.q.defer();
            var loadUserContext = function () {
                if (options.userContext) {
                    return _this.m3Service.userService.getUserContext().then(function (userContext) {
                        return userContext;
                    });
                }
                return _this.getResolvedPromise(null);
            };
            var loadStartup = function (userContext) {
                if (options.useM3Language && !languageOptions.language) {
                    languageOptions.language = userContext.languageTag;
                }
                return _super.prototype.start.call(_this, options);
            };
            var loadSession = function () {
                if (options.session) {
                    return _this.m3Service.formService.logon().then(function (response) {
                        return response;
                    });
                }
                return _this.getResolvedPromise(null);
            };
            loadUserContext()
                .then(loadStartup)
                .then(loadSession)
                .then(function () {
                _this.resolveReady(defered);
            }, function (e) {
                _this.rejectReady(defered, e);
            });
            return defered.promise;
        };
        StartupService.$inject = ["$rootScope", "$q", "$location", "odinService", "m3Service"];
        return StartupService;
    }(Odin.StartupService));
    M3.StartupService = StartupService;
    var ApplicationBase = (function (_super) {
        __extends(ApplicationBase, _super);
        function ApplicationBase() {
            _super.call(this);
            this.startupServiceName = "m3StartupService";
        }
        ApplicationBase.prototype.getStartupOptions = function () {
            var options = _super.prototype.getStartupOptions.call(this);
            options.userContext = this.userContext;
            options.session = this.session;
            options.useM3Language = this.useM3Language;
            return options;
        };
        return ApplicationBase;
    }(Odin.ApplicationBase));
    M3.ApplicationBase = ApplicationBase;
    var M3Module = (function () {
        function M3Module() {
        }
        M3Module.init = function () {
            var m = angular.module("m3", ["odin"]);
            MIService.add(m);
            UserService.add(m);
            FormService.add(m);
            M3.Form.BrowseService.add(m);
            Service.add(m);
            StartupService.add(m);
            M3.Form.MIBrowseCtrl.add(m);
            DateFilter.add(m);
            NumberFilter.add(m);
            M3.Form.DetailLayoutDirective.add(m);
            M3.Form.FieldLabelDirective.add(m);
            M3.Form.FieldInfoDirective.add(m);
            M3.Form.FieldPresenterDirective.add(m);
            M3.Form.ListDirective.add(m);
        };
        return M3Module;
    }());
    M3Module.init();
})(M3 || (M3 = {}));
//# sourceMappingURL=odin-m3.js.map