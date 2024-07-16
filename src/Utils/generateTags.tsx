import { Programme } from '../Types';
import { filterProgrammes } from './filterProgrammes';

export interface DataItem {
  [key: string]: any;
}

export const generateTags = (
  item: DataItem,
  currentProgrammeValue: string,
): Programme[] => {
  const relevantProgrammes = filterProgrammes(currentProgrammeValue);

  const tags: Programme[] = relevantProgrammes
    .filter(prog => item[prog.value] === '1' || item[prog.value] > 0)
    .map(prog => ({
      label: prog.label,
      value: prog.value,
      short: prog.short,
      color: prog.color,
      icon: prog.icon,
    }));

  return tags;
};
