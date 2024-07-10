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
    value: 'all_programmes',
    color: '#006EB5',
    icon: Leaf,
  },
  {
    label: 'Public finance for the SDGs',
    value: 'public',
    color: '#5DD4F0',
    icon: School,
  },
  {
    label: 'Unlocking private capital and aligning for the SDGs',
    value: 'private',
    color: '#02A38A',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Integrated National Financing Frameworks',
    value: 'frameworks',
    color: '#E78625',
    icon: Flag,
  },
  {
    label: 'Biofin',
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
    value: 'public_budget',
    color: '#006EB5',
    icon: Leaf,
  },
  {
    label: 'Tax for the SDGs',
    value: 'public_tax',
    color: '#5DD4F0',
    icon: School,
  },
  {
    label: 'Debt for the SDGs',
    value: 'public_debt',
    color: '#02A38A',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Insurance and Risk Finance',
    value: 'public_insurance',
    color: '#E78625',
    icon: Flag,
  },
  {
    label: 'Originating pipelines',
    value: 'private_pipelines',
    color: '#E0529E',
    icon: Shell,
  },
  {
    label: 'Managing for Impact',
    value: 'private_impact',
    color: '#00A651',
    icon: Leaf,
  },
  {
    label: 'Enabling environment',
    value: 'private_environment',
    color: '#FF6F61',
    icon: School,
  },
  {
    label: 'Integrated National Financing Frameworks',
    value: 'frameworks',
    color: '#6A1B9A',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Biofin',
    value: 'biofin',
    color: '#00ACC1',
    icon: Flag,
  },
];
