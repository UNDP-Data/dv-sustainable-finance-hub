import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from 'antd';
import styled from 'styled-components';
import CardComponent from './Card';
import { Programme } from '../Types';
import { Country } from '../Utils/countryFilters';
import { PROGRAMMES } from './Constants';

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

interface Props {
  data: Country[];
}

function Cards({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data
      .filter((country: Country) => country.filtered)
      .filter((country: Country) =>
        country.name.toLowerCase().includes(lowercasedSearchTerm),
      );
  }, [data, searchTerm]);

  const getProgrammeDetails = (progValue: string): Programme | undefined => {
    return PROGRAMMES.find(programme => programme.value === progValue);
  };

  return (
    <div
      className='padding-04 undp-scrollbar'
      style={{ height: '576px', overflowY: 'scroll' }}
    >
      <Input
        placeholder='Search by country'
        prefix={<Search size={18} strokeWidth={2.5} color='var(--black)' />}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%' }}
      />
      <CardContainer className='margin-top-04 undp-scrollbar'>
        {filteredData.map((country: Country, index: number) => {
          // Generate tags by looking up each program in PROGRAMMES
          const tags: Programme[] = country.programs
            .map(getProgrammeDetails)
            .filter((prog): prog is Programme => prog !== undefined);

          // Only render the card if there are tags
          if (tags.length === 0) return null;

          return (
            <CardComponent key={index} countryName={country.name} tags={tags} />
          );
        })}
      </CardContainer>
    </div>
  );
}

export default Cards;
