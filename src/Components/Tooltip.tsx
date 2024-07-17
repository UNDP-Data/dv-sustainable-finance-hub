import CardComponent from './Card';
import { generateTags } from '../Utils/generateTags';
import { useProgramme } from './ProgrammeContext';

export const tooltip = (d: any) => {
  const { currentProgramme } = useProgramme();
  const tags = generateTags(d.data, currentProgramme.value);

  if (!tags || tags.length === 0) {
    return (
      <div className='padding-04' style={{ backgroundColor: 'white' }}>
        <h6 style={{ fontSize: '12px' }} className='undp-typography margin-00'>
          {d.data.country}
        </h6>
      </div>
    );
  }

  return <CardComponent countryName={d.data.country} tags={tags} />;
};
