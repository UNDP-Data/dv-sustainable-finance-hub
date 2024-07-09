import { Leaf, School, BriefcaseBusiness, Flag, Shell } from 'lucide-react';

// constants.ts
export interface Programme {
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
    value: 'all_programmes',
    color: '#006EB5',
    icon: Leaf,
  },
  {
    label: 'Public finance for the SDGs',
    value: 'public',
    color: '#5DD4F0',
    icon: School,
    subcategories: [
      { label: 'Sub Programme 1.1', value: 'subProgramme1.1' },
      { label: 'Sub Programme 1.2', value: 'subProgramme1.2' },
    ],
  },
  {
    label: 'Unlocking private capital and aligning for the SDGs',
    value: 'private',
    color: '#02A38A',
    icon: BriefcaseBusiness,
    subcategories: [
      { label: 'Sub Programme 2.1', value: 'subProgramme2.1' },
      { label: 'Sub Programme 2.2', value: 'subProgramme2.2' },
    ],
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
