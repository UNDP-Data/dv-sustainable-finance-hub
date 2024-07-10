import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input, Tag } from 'antd';
import styled from 'styled-components';
import { PROGRAMMES } from './Constants';

interface Props {
  data: any[]; // Use any[] to accommodate the raw data structure
}

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

const Card = styled.div`
  flex: 1 1 calc(25% - 0.75rem); // Four columns
  max-width: calc(25% - 0.75rem);
  background-color: var(--gray-200);
  display: flex;
  flex-direction: column;
  &:last-of-type {
    margin-right: auto;
  }
`;

const CountryDiv = styled.div`
  padding: 16px;
  border-bottom: 0.07rem solid var(--gray-400);
`;

const ProgramsDiv = styled.div`
  padding: 16px;
`;

const NoProgrammes = styled.div`
  font-size: 12px;
  color: var(--gray-500);
`;

function Cards(props: Props) {
  const { data } = props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    item.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={{ width: '100%' }} className='margin-top-03'>
      <Input
        placeholder='Search by country'
        className='undp-input'
        prefix={<Search size={18} strokeWidth={2.5} color='var(--black)' />}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%' }}
      />
      <CardContainer
        className='margin-top-04 undp-scrollbar'
        style={{ height: '500px' }}
      >
        {filteredData.map((item, index) => {
          const programmes = PROGRAMMES.filter(
            field => item[field.value] === '1',
          );
          return (
            <Card key={index}>
              <CountryDiv>
                <h6
                  style={{ fontSize: '12px' }}
                  className='undp-typography margin-00'
                >
                  {item.country}
                </h6>
              </CountryDiv>
              <ProgramsDiv>
                {programmes.length > 0 ? (
                  programmes.map(field => (
                    <Tag key={field.value} color={field.color}>
                      {field.short}
                    </Tag>
                  ))
                ) : (
                  <NoProgrammes>No programmes available</NoProgrammes>
                )}
              </ProgramsDiv>
            </Card>
          );
        })}
      </CardContainer>
    </div>
  );
}

export default Cards;
