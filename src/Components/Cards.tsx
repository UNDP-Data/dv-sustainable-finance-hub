import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input, Tag } from 'antd';
import styled from 'styled-components';
import { Programme } from './Constants';

interface Props {
  data: any[]; // Use any[] to accommodate the raw data structure
  programmes: Programme[];
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
  background-color: white;
  display: flex;
  flex-direction: column;
  &:last-of-type {
    margin-right: auto;
  }
`;

const CountryDiv = styled.div`
  padding: 16px;
  border-bottom: 0.07rem solid var(--gray-300);
`;

const ProgramsDiv = styled.div`
  padding: 16px;
`;

const NoProgrammes = styled.div`
  font-size: 12px;
  color: var(--gray-500);
`;

function Cards(props: Props) {
  const { data, programmes } = props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data
    .filter(item =>
      item.country.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(item => programmes.some(program => item[program.value] === '1'));

  return (
    <div className='padding-04' style={{ height: '576px', overflow: 'hidden' }}>
      <Input
        placeholder='Search by country'
        prefix={<Search size={18} strokeWidth={2.5} color='var(--black)' />}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%' }}
      />
      <CardContainer className='margin-top-04 undp-scrollbar'>
        {filteredData.map((item, index) => {
          const programmesForCountry = programmes.filter(
            program => item[program.value] === '1',
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
                {programmesForCountry.length > 0 ? (
                  programmesForCountry.map(program => (
                    <Tag key={program.value} color={program.color}>
                      {program.short}
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
