export interface ChoroplethMapDataType {
  filtered: any;
  x: string;
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
  icon?: any;
}
