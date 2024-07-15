export interface TimeSeriesProps {
  year: number;
  value: number;
  data?: object;
}

export interface VerticalBarGraphDataType {
  label: string;
  height: number;
  color?: string;
  data?: object;
}

export interface VerticalGroupedBarGraphDataType {
  label: string;
  height: number[];
  data?: object;
}

export interface HorizontalBarGraphDataType {
  width: number;
  label: string;
  color?: string;
  data?: object;
}

export interface HorizontalGroupedBarGraphDataType {
  width: number[];
  label: string;
  data?: object;
}

export interface DumbbellChartDataType {
  x: number[];
  label: string;
  data?: object;
}

export interface DonutChartDataType {
  value: number;
  label: string;
  data?: object;
}

export interface ChoroplethMapDataType {
  x: number;
  iso: string;
  data?: {
    country: string;
    all_programmes?: any;
    public?: any;
    private?: any;
    frameworks?: any;
    biofin?: any;
    [key: string]: any;
  };
}

export interface Programme {
  label: string;
  short: string;
  value: string;
  color: string;
  icon: any;
  subprogrammes?: Programme[];
}

export interface CountryDataType {
  iso: string;
  country: string;
  public_tax?: number;
  public_debt?: number;
  public_budget?: number;
  public_insurance?: number;
  private_pipelines?: number;
  private_impact?: number;
  private_environment?: number;
  frameworks?: number;
  biofin?: number;
  [key: string]: any; // For any additional dynamic properties
}

export interface BivariateMapDataType {
  x: number;
  y: number;
  countryCode: string;
  data?: object;
}

export interface LineChartDataType {
  date: number | string;
  y: number;
  data?: object;
}

export interface MultiLineChartDataType {
  date: number | string;
  y: (number | undefined)[];
  data?: object;
}

export interface AreaChartDataType {
  date: number | string;
  y: number[];
  data?: object;
}

export interface ScatterPlotDataType {
  x: number;
  y: number;
  radius?: number;
  color?: string;
  label: string;
  data?: object;
}
