declare module xi {
    /**
     * Represents the options for the Chart directive.
     */
    interface IChartOptions {
        /**
         * Type of chart. Supported values: "pie", "bar", "donut", "column"
         */
        type: string;
        /**
         * Dataset to show in chart
         */
        dataset: IChartData[];
    }
    interface IChartData {
        /**
         * Data in dataset
         */
        data: IChartDataItem[];
        /**
         * Optional name of dataset
         */
        name?: string;
        /**
         * Optional center label when using Donut chart
         */
        centerLabel?: string;
    }
    interface IChartDataItem {
        /**
         * Name (label) of data entry
         */
        name: string;
        /**
         * Value of data entry
         */
        value: number;
        /**
         * Optional url string
         */
        url?: string;
        /**
         * Optional custom tooltip text
         */
        tooltip?: string;
        /**
         * Optional custom color
         */
        color?: string;
        /**
         * Optional short name
         */
        shortName?: string;
        /**
         * Optional abbreviation name
         */
        abbrName?: string;
    }
    /**
     * Chart Directive.
     *
     * Example:
     * scope["options"] = { type: "pie", dataset: [ {data: [{name: "first", value: 10},{name: "second", value: 4}, {name: "third", value: 15 }]}]}
     * <div xi-chart="options"></div>
     */
    class ChartDirective {
        static add(m: ng.IModule): void;
    }
}
declare module xi {
    /**
     * Util class containing convenience methods related to SohoXi Controls.
     */
    class XiUtil {
        static getData<T extends JQuery>(element: JQuery, key: string): T;
    }
}
