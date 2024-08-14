import React from 'react';
import CardComponent from './Card';
import { PROGRAMMES } from './Constants';
import { Programme } from '../Types';
import { Country } from '../Utils/countryFilters';

interface Props {
  data: Country[]; // Assuming data is an array of Country objects
  iso: string; // ISO code of the country
}

export function TooltipContent(props: Props) {
  const { data, iso } = props;

  // Find the country object with the matching ISO code
  const country = data.find((countryItem: any) => countryItem.iso === iso);

  // If the country is not found, return early
  if (!country) {
    return (
      <div className='padding-04' style={{ backgroundColor: 'white' }}>
        <h6 style={{ fontSize: '12px' }} className='undp-typography margin-00'>
          Country not found
        </h6>
      </div>
    );
  }

  // Generate tags by directly mapping country.programs to PROGRAMMES
  const tags: Programme[] = country.programs
    .map((progValue: string) => {
      const programme = PROGRAMMES.find(p => p.value === progValue);
      return programme
        ? {
            value: programme.value,
            short: programme.short,
            color: programme.color,
          }
        : undefined;
    })
    .filter((prog): prog is Programme => prog !== undefined);

  // Render the CardComponent with the country name and generated tags
  return <CardComponent countryName={country.name} tags={tags} />;
}
