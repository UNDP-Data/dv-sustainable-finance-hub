import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from 'antd';
import styled from 'styled-components';
import CardComponent from './Card';
import { Programme } from '../Types';

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

interface Props {
  data: any;
  relevantProgrammes: Programme[];
}

function Cards(props: Props) {
  const { data, relevantProgrammes } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data.filter((item: any) =>
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
        {filteredData.map((item: any, index: any) => {
          const tags = relevantProgrammes
            .filter(prog => item[prog.value] === '1')
            .map(prog => ({
              label: prog.label,
              value: prog.value,
              short: prog.short,
              color: prog.color,
            }));

          if (tags.length === 0) return null;

          return (
            <CardComponent key={index} countryName={item.country} tags={tags} />
          );
        })}
      </CardContainer>
    </div>
  );
}

export default Cards;
