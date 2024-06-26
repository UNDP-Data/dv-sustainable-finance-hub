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
  x: string;
  countryCode: string;
  data?: object;
  [key: string]: any;
  countryName?: string;
  programmes?: any[];
  public_finance_budget: string;
  insurance_and_risk: string;
  public_finance_tax: string;
  public_finance_debt: string;
  private_capital: string;
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
