import CardComponent from './Card';
import { useSharedLogic } from './utils';
import { useProgramme } from './ProgrammeContext';

export const tooltip = (d: any) => {
  const { taxonomy, selectedCheckboxes } = useProgramme();
  const { getCountryName, getProgramTags } = useSharedLogic(
    taxonomy,
    selectedCheckboxes,
  );

  const programTagsForCountry = getProgramTags(d.data);

  return (
    <div>
      <CardComponent
        key={d.iso}
        countryName={getCountryName(d.iso)}
        programTags={programTagsForCountry}
      />
    </div>
  );
};
