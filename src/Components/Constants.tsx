import { Leaf, School, BriefcaseBusiness, Flag, Shell } from 'lucide-react';
import { Programme } from '../Types';

export const PROGRAMMES: Programme[] = [
  {
    label: 'Countries with programmes',
    short: 'Total number of countries',
    value: 'all',
    color: '#006EB5',
    icon: Leaf,
  },
  {
    label: 'Public Finance for the SDGs',
    short: 'with public finance',
    value: 'public',
    color: '#5DD4F0',
    icon: School,
  },
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
    label: 'Public Finance for the SDGs',
    short: 'with private finance',
    value: 'private',
    color: '#02A38A',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Originating pipelines',
    short: 'Originating pipelines',
    value: 'private_pipelines',
    color: '#02A38A',
    icon: Shell,
  },
  {
    label: 'Managing for impact',
    short: 'Managing for impact',
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
    short: 'with INFFs',
    value: 'frameworks',
    color: '#E78625',
    icon: Flag,
  },
  {
    label: 'Biodiversity finance',
    short: 'with biodiversity finance',
    value: 'biofin',
    color: '#E0529E',
    icon: Shell,
  },
];
