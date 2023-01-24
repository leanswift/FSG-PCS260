var xi;
(function (xi) {
    /**
     * Chart Directive.
     *
     * Example:
     * scope["options"] = { type: "pie", dataset: [ {data: [{name: "first", value: 10},{name: "second", value: 4}, {name: "third", value: 15 }]}]}
     * <div xi-chart="options"></div>
     */
    var ChartDirective = (function () {
        function ChartDirective() {
        }
        ChartDirective.add = function (m) {
            var name = "xiChart";
            m.directive(name, function () {
                return {
                    scope: false,
                    link: function (scope, element, attributes) {
                        var originalOptions = attributes[name];
                        var unbindWatcher = scope.$watchCollection(originalOptions, function (newOptions) {
                            if (newOptions) {
                                // Since the control add data to the array we must copy before calling the plugin
                                var options = angular.copy(newOptions);
                                // Clean up and re-add classes if chart type is changed to get correct layout 
                                element.removeClass();
                                element.addClass("chart-container");
                                element.parent().children(".chart-legend").remove();
                                element.chart(options);
                            }
                        });
                        // Tear down
                        element.on("$destroy", function () {
                            unbindWatcher();
                        });
                    }
                };
            });
        };
        return ChartDirective;
    })();
    xi.ChartDirective = ChartDirective;
})(xi || (xi = {}));
var xi;
(function (xi) {
    var m = angular.module("sohoxi", []);
    // Add directives to module
    xi.ChartDirective.add(m);
    /**
     * Util class containing convenience methods related to SohoXi Controls.
     */
    var XiUtil = (function () {
        function XiUtil() {
        }
        XiUtil.getData = function (element, key) {
            return element.data(key);
        };
        return XiUtil;
    })();
    xi.XiUtil = XiUtil;
})(xi || (xi = {}));
