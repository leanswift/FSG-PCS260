/**
 * Custom directives to enable certain features in the application
 */
var h5;
(function (h5) {
    var application;
    (function (application) {
        /**
         * When UI-select is used in UI Grid cell template, the drop-down won’t disappear when we click elsewhere on the page.
         * This will fix this by wrapping the UI-Select directive in a custom directive.
         */
        function uiSelectWrap($document, uiGridEditConstants) {
            return function link($scope, $elm, $attr) {
                $document.on('click', docClick);
                function docClick(evt) {
                    if ($(evt.target).closest('.ui-select-container').length === 0) {
                        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                        $document.off('click', docClick);
                    }
                }
            };
        }
        application.uiSelectWrap = uiSelectWrap;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
