export type OptionType = { label: string; value: string };

export type RawDataRow = {
  country: string;
  iso: string;
  fragile_country: number;
  inffs?: number;
  inffs_note?: string;
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
  [key: string]: string | number | undefined;
};

export interface CountryMeta {
  'Alpha-3 code': string;
  SIDS: boolean;
  LDC: boolean;
}
