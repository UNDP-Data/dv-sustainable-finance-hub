import React from 'react';
import CardComponent from './Card';
import { generateTags } from '../Utils/generateTags';
import { useProgramme } from './ProgrammeContext';

interface TooltipContentProps {
  data: any;
}

export function TooltipContent(props: TooltipContentProps) {
  const { data } = props;
  const { currentProgramme } = useProgramme();
  const tags = generateTags(data, currentProgramme.value);

  if (!tags || tags.length === 0) {
    return (
      <div className='padding-04' style={{ backgroundColor: 'white' }}>
        <h6 style={{ fontSize: '12px' }} className='undp-typography margin-00'>
          {data.country}
        </h6>
      </div>
    );
  }

  return <CardComponent countryName={data.country} tags={tags} />;
}
