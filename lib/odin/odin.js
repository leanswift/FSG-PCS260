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
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
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
//# sourceMappingURL=odin.js.map