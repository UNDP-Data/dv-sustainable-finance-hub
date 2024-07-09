import { Leaf, School, BriefcaseBusiness, Flag, Shell } from 'lucide-react';

// constants.ts
export interface Programme {
  [x: string]: any;
  label: string;
  value: string;
  color: string;
  icon: any;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  label: string;
  value: string;
}

export const PROGRAMMES: Programme[] = [
  {
    label: 'All Sustainable Financial Programmes',
    short: 'All Programmes',
    value: 'all_programmes',
    color: '#006EB5',
    icon: Leaf,
    subcategories: [
      { label: 'Public finance for the SDGs', value: 'public' },
      { label: 'Private Capital', value: 'private' },
      { label: 'Integrated Frameworks', value: 'frameworks' },
      { label: 'Biofin', value: 'biofin' },
    ],
  },
  {
    label: 'Public finance for the SDGs',
    short: 'Public finance for the SDGs',
    value: 'public',
    color: '#5DD4F0',
    icon: School,
    subcategories: [
      { label: 'Budget for the SDGs', value: 'public_budget' },
      { label: 'Tax for the SDGs', value: 'public_tax' },
      { label: 'Debt for the SDGs', value: 'public_debt' },
      { label: 'Insurance and Risk Finance', value: 'insurance_and_risk' },
    ],
  },
  {
    label: 'Unlocking private capital and aligning for the SDGs',
    short: 'Unlocking private capital',
    value: 'private',
    color: '#02A38A',
    icon: BriefcaseBusiness,
    subcategories: [
      { label: 'Originating pipelines', value: 'private_pipelines' },
      { label: 'Managing for Impact', value: 'private_impact' },
      { label: 'Enabling environment', value: 'private_environment' },
    ],
  },
  {
    label: 'Integrated National Financing Frameworks',
    short: 'Integrated National Frameworks',
    value: 'frameworks',
    color: '#E78625',
    icon: Flag,
  },
  {
    label: 'Biofin',
    short: 'Biofin',
    value: 'biofin',
    color: '#E0529E',
    icon: Shell,
  },
];

export const GROUPS = [
  { label: 'All Countries', value: 'allCountries' },
  { label: 'Fragile and Affected', value: 'fragile_affected' },
  { label: 'LDC', value: 'ldc' },
  { label: 'SIDS', value: 'sids' },
];
