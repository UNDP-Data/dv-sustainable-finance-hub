import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Input, Tag } from 'antd';
import styled from 'styled-components';
import { PROGRAMMES } from './Constants';
import { useProgramme } from './ProgrammeContext';

interface Props {
  data: any[];
  taxonomy: { [key: string]: any }[];
  selectedCheckboxes: string[];
}

const StyledTag = styled(Tag)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

const Card = styled.div`
  flex: 1 1 calc(25% - 0.9rem);
  max-width: 250px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-300);
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

function Cards(props: Props) {
  const { data, taxonomy, selectedCheckboxes } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const { currentProgramme } = useProgramme();

  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data.filter(item =>
      item.country.toLowerCase().includes(lowercasedSearchTerm),
    );
  }, [data, searchTerm]);

  const getCountryName = (iso: string) => {
    const country = taxonomy.find(item => item['Alpha-3 code'] === iso);
    return country ? country['Country or Area'] : iso;
  };

  const getProgramTags = (item: any) => {
    if (currentProgramme.value === 'all_programmes') {
      const allProgrammes = PROGRAMMES.find(p => p.value === 'all_programmes');

      return (
        allProgrammes?.subprogrammes
          ?.filter(program => {
            if (program.subprogrammes) {
              return program.subprogrammes.some(sub => item[sub.value] > 0);
            }
            return item[program.value] > 0;
          })
          .map(program => ({
            value: program.value,
            short: program.short,
            color: program.color,
          }))
          .filter(program => selectedCheckboxes.includes(program.value)) || []
      );
    }

    // Handle cases for individual programmes
    if (currentProgramme.subprogrammes) {
      const subprogrammeTags = currentProgramme.subprogrammes
        .filter(sub => item[sub.value] > 0)
        .map(sub => sub);

      if (subprogrammeTags.length > 0) {
        return subprogrammeTags;
      }
    }

    if (item[currentProgramme.value] > 0) {
      return [currentProgramme];
    }

    return [];
  };

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

          const showCard = programTagsForCountry.length > 0;

          if (!showCard) return null;

          return (
            <Card key={index}>
              <CountryDiv>
                <h6
                  style={{ fontSize: '12px' }}
                  className='undp-typography margin-00'
                >
                  {getCountryName(item.iso)}
                </h6>
              </CountryDiv>
              <ProgramsDiv>
                {programTagsForCountry.map(program => (
                  <StyledTag key={program.value} color={program.color}>
                    {program.short}
                  </StyledTag>
                ))}
              </ProgramsDiv>
            </Card>
          );
        })}
      </CardContainer>
    </div>
  );
}

export default Cards;
