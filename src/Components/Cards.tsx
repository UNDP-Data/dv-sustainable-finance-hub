import { Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import { PROGRAMMES } from './Constants';
import { useProgramme } from './ProgrammeContext';
import CardComponent from './Card';

interface Props {
  data: any[];
  taxonomy: { [key: string]: any }[];
  selectedCheckboxes: string[];
}

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
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
    const { value, subprogrammes } = currentProgramme;

    if (value === 'all_programmes') {
      const allProgrammes = PROGRAMMES.find(p => p.value === 'all_programmes');

      if (allProgrammes?.subprogrammes) {
        return allProgrammes.subprogrammes
          .filter(sub => {
            if (
              (sub.value === 'public' || sub.value === 'private') &&
              sub.subprogrammes
            ) {
              // Check if any subprogramme has a value > 0
              return sub.subprogrammes.some(subSub => item[subSub.value] > 0);
            }
            return item[sub.value] > 0;
          })
          .map(sub => ({
            value: sub.value,
            short: sub.short,
            color: sub.color,
          }))
          .filter(sub => selectedCheckboxes.includes(sub.value));
      }
    } else {
      if (subprogrammes) {
        const subprogrammeTags = subprogrammes
          .filter(sub => item[sub.value] > 0)
          .map(sub => ({
            value: sub.value,
            short: sub.short,
            color: sub.color,
          }));

        if (subprogrammeTags.length > 0) {
          return subprogrammeTags;
        }
      }

      if (item[value] > 0) {
        return [
          {
            value,
            short: currentProgramme.short,
            color: currentProgramme.color,
          },
        ];
      }
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
