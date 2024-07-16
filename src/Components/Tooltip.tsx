// import CardComponent from './Card';
// import { useProgramme } from './ProgrammeContext';
// import { generateTags } from '../Utils/generateTags';

export const tooltip = (d: any) => {
  // const { selectedCheckboxes } = useProgramme();
  // const programTagsForCountry = generateTags(d.data, selectedCheckboxes);

  return (
    <div>
      {d.iso}
      {/* <CardComponent
        key={d.iso}
        countryName={d.country}
        tags={programTagsForCountry}
      /> */}
    </div>
  );
};
