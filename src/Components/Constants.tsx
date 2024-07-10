import { Leaf, School, BriefcaseBusiness, Flag, Shell } from 'lucide-react';

// constants.ts
export interface Programme {
  [x: number]: any;
  label: string;
  value: string;
  color: string;
  icon: any;
}

export const PROGRAMMES = [
  {
    label: 'All Programmes',
    short: 'All Programmes',
    value: 'all_programmes',
    color: '#006EB5',
    icon: Leaf,
  },
  {
    label: 'Public finance for the SDGs',
    short: 'Public finance for the SDGs',
    value: 'public',
    color: '#5DD4F0',
    icon: School,
  },
  {
    label: 'Unlocking private capital and aligning for the SDGs',
    short: 'Unlocking private capital',
    value: 'private',
    color: '#02A38A',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Integrated National Financing Frameworks',
    short: 'Integrated Frameworks',
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

export const SPECIFIED_PROGRAMMES = [
  {
    label: 'Budget for the SDGs',
    short: 'Budget for the SDGs',
    value: 'public_budget',
    color: '#5DD4F0',
    icon: Leaf,
  },
  {
    label: 'Tax for the SDGs',
    short: 'Tax for the SDGs',
    value: 'public_tax',
    color: '#5DD4F0',
    icon: School,
  },
  {
    label: 'Debt for the SDGs',
    short: 'Debt for the SDGs',
    value: 'public_debt',
    color: '#5DD4F0',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Insurance and Risk Finance',
    short: 'Insurance and Risk Finance',
    value: 'public_insurance',
    color: '#5DD4F0',
    icon: Flag,
  },
  {
    label: 'Originating pipelines',
    short: 'Originating pipelines',
    value: 'private_pipelines',
    color: '#02A38A',
    icon: Shell,
  },
  {
    label: 'Managing for Impact',
    short: 'Managing for Impact',
    value: 'private_impact',
    color: '#02A38A',
    icon: Leaf,
  },
  {
    label: 'Enabling environment',
    short: 'Enabling environment',
    value: 'private_environment',
    color: '#02A38A',
    icon: School,
  },
  {
    label: 'Integrated National Financing Frameworks',
    short: 'Integrated Frameworks',
    value: 'frameworks',
    color: '#E78625',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Biofin',
    value: 'biofin',
    color: '#E0529E',
    icon: Flag,
  },
];
