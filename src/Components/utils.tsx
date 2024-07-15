import { PROGRAMMES } from './Constants';
import { useProgramme } from './ProgrammeContext';

export const useSharedLogic = (
  taxonomy: any[],
  selectedCheckboxes: string | string[],
) => {
  const { currentProgramme } = useProgramme();

  const getCountryName = (iso: any) => {
    const country = taxonomy.find(
      (item: { [x: string]: any }) => item['Alpha-3 code'] === iso,
    );
    return country ? country['Country or Area'] : iso;
  };

  const getProgramTags = (item: any) => {
    const { value, subprogrammes } = currentProgramme;

    if (value === 'all_programmes') {
      const allProgrammes = PROGRAMMES.find(p => p.value === 'all_programmes');

      if (allProgrammes?.subprogrammes) {
        return allProgrammes.subprogrammes
          .filter(sub => {
            if (
              (sub.value === 'public' || sub.value === 'private') &&
              sub.subprogrammes
            ) {
              return sub.subprogrammes.some(subSub => item[subSub.value] > 0);
            }
            return item[sub.value] > 0;
          })
          .map(sub => ({
            value: sub.value,
            short: sub.short,
            color: sub.color,
          }))
          .filter(sub => selectedCheckboxes.includes(sub.value));
      }
    } else {
      if (subprogrammes) {
        const subprogrammeTags = subprogrammes
          .filter(sub => item[sub.value] > 0)
          .map(sub => ({
            value: sub.value,
            short: sub.short,
            color: sub.color,
          }));

        if (subprogrammeTags.length > 0) {
          return subprogrammeTags;
        }
      }

      if (item[value] > 0) {
        return [
          {
            value,
            short: currentProgramme.short,
            color: currentProgramme.color,
          },
        ];
      }
    }

    return [];
  };

  return { getCountryName, getProgramTags };
};
