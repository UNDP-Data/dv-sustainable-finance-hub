import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Input, Tag } from 'antd';
import styled from 'styled-components';
import { SPECIFIED_PROGRAMMES, PROGRAMMES } from './Constants';
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

  const subProgrammes = useMemo(() => {
    if (currentProgramme.value === 'public') {
      return SPECIFIED_PROGRAMMES.filter(program =>
        [
          'public_budget',
          'public_tax',
          'public_debt',
          'public_insurance',
        ].includes(program.value),
      );
    }
    if (currentProgramme.value === 'private') {
      return SPECIFIED_PROGRAMMES.filter(program =>
        ['private_pipelines', 'private_impact', 'private_environment'].includes(
          program.value,
        ),
      );
    }
    if (currentProgramme.value === 'all_programmes') {
      return PROGRAMMES.filter(program =>
        ['public', 'private', 'frameworks', 'biofin'].includes(program.value),
      );
    }
    return [];
  }, [currentProgramme.value]);

  const getCountryName = (iso: string) => {
    const country = taxonomy.find(item => item['Alpha-3 code'] === iso);
    return country ? country['Country or Area'] : iso;
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
          const subProgrammesForCountry =
            currentProgramme.value === 'all_programmes'
              ? subProgrammes.filter(
                  program =>
                    item[program.value] === '1' &&
                    selectedCheckboxes.includes(program.value),
                )
              : subProgrammes.length > 0
              ? subProgrammes.filter(
                  program =>
                    item[program.value] === '1' &&
                    selectedCheckboxes.includes(program.value),
                )
              : [
                  {
                    value: currentProgramme.value,
                    short: currentProgramme.short,
                    color: currentProgramme.color,
                  },
                ];

          const showCard =
            currentProgramme.value === 'all_programmes'
              ? subProgrammesForCountry.length > 0
              : item[currentProgramme.value] === '1' ||
                subProgrammesForCountry.length > 0;

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
                {subProgrammesForCountry.map(program => (
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
