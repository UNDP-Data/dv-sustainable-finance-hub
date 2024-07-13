import { PROGRAMMES } from './Constants';

export interface ProgrammeCount {
  value: string;
  label: string;
  count: number;
  subprogrammes?: ProgrammeCount[];
}

const calculateCount = (data: any[], value: string): number => {
  return data.reduce((sum, item) => sum + (item[value] || 0), 0);
};

const calculateSubprogrammeCounts = (
  data: any[],
  subprogrammes: any[] = [],
): ProgrammeCount[] => {
  return subprogrammes.map(subProg => {
    const subprogrammeCounts = subProg.subprogrammes
      ? calculateSubprogrammeCounts(data, subProg.subprogrammes)
      : undefined;

    const subProgrammeCount = subprogrammeCounts
      ? subprogrammeCounts.reduce((acc, sub) => acc + sub.count, 0)
      : calculateCount(data, subProg.value);

    return {
      value: subProg.value,
      label: subProg.short,
      count: subProgrammeCount,
      subprogrammes: subprogrammeCounts,
    };
  });
};

export const calculateProgrammeCounts = (data: any[]): ProgrammeCount[] => {
  const mainProgrammes = PROGRAMMES[0].subprogrammes || [];

  const programmeCounts: ProgrammeCount[] = mainProgrammes.map(prog => {
    const subprogrammeCounts = calculateSubprogrammeCounts(
      data,
      prog.subprogrammes,
    );
    const mainProgrammeCount =
      subprogrammeCounts.reduce((acc, sub) => acc + sub.count, 0) +
      calculateCount(data, prog.value);

    return {
      value: prog.value,
      label: prog.short,
      count: mainProgrammeCount,
      subprogrammes: subprogrammeCounts,
    };
  });

  const allProgrammesCount = programmeCounts.reduce(
    (acc, programme) => acc + programme.count,
    0,
  );

  return [
    {
      value: 'all_programmes',
      label: 'All Programmes',
      count: allProgrammesCount,
      subprogrammes: programmeCounts,
    },
  ];
};
