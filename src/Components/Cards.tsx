import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from 'antd';
import styled from 'styled-components';
import CardComponent from './Card';
import { useSharedLogic } from './utils';
import { useProgramme } from './ProgrammeContext';

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

interface Props {
  data: any[];
}

function Cards({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const { taxonomy, selectedCheckboxes } = useProgramme();
  const { getCountryName, getProgramTags } = useSharedLogic(
    taxonomy,
    selectedCheckboxes,
  );

  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data.filter(item =>
      item.country.toLowerCase().includes(lowercasedSearchTerm),
    );
  }, [data, searchTerm]);

  return (
    <div className='padding-04' style={{ height: '576px', overflow: 'scroll' }}>
      <Input
        placeholder='Search by country'
        prefix={<Search size={18} strokeWidth={2.5} color='var(--black)' />}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%' }}
      />
      <CardContainer className='margin-top-04 undp-scrollbar'>
        {filteredData.map((item, index) => {
          const programTagsForCountry = getProgramTags(item);

          if (programTagsForCountry.length === 0) return null;

          return (
            <CardComponent
              key={index}
              countryName={getCountryName(item.iso)}
              programTags={programTagsForCountry}
            />
          );
        })}
      </CardContainer>
    </div>
  );
}

export default Cards;
