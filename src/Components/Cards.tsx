import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from 'antd';
import styled from 'styled-components';
import CardComponent from './Card';
import { generateTags } from '../Utils/generateTags';
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

function Cards(props: Props) {
  const { data } = props;
  const { currentProgramme } = useProgramme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data
      .filter((item: any) => item.filtered === '1')
      .filter(
        (item: any) =>
          item.data &&
          item.data.country &&
          item.data.country.toLowerCase().includes(lowercasedSearchTerm),
      );
  }, [data, searchTerm]);

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
        {filteredData.map((item: any, index: any) => {
          const tags = generateTags(item.data, currentProgramme.value);
          if (!tags || tags.length === 0) return null;

          return (
            <CardComponent
              key={index}
              countryName={item.data.country}
              tags={tags}
            />
          );
        })}
      </CardContainer>
    </div>
  );
}

export default Cards;
