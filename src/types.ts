export interface OptionType {
  label: string;
  value: string;
}

export interface RawDataRow {
  country: string;
  iso: string;
  fragile_country?: number;
  inffs?: number;
  inffs_note?: string;
  public_note?: string;
  private_note?: string;
  academy?: number;
  academy_note?: string;
  public_tax?: number;
  public_tax_note?: string;
  public_debt?: number;
  public_debt_note?: string;
  public_budget?: number;
  public_budget_note?: string;
  public_insurance?: number;
  public_insurance_note?: string;
  private_pipelines?: number;
  private_pipelines_note?: string;
  private_impact?: number;
  private_impact_note?: string;
  private_environment?: number;
  private_environment_note?: string;
  biofin?: number;
  biofin_note?: string;
  climate_finance?: number;
  climate_finance_note?: string;
}

export interface DataType extends RawDataRow {
  public?: number;
  private?: number;
  services_total?: number;
  work_areas_total?: number;
  services_or_work_areas_total?: number;
  country_categories: string[];
  service_categories: string[];
}

export interface CountryDataType {
  'Alpha-3 code': string;
  SIDS: boolean;
  LDC: boolean;
}
