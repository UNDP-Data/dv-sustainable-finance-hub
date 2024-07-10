import React from 'react';
import styled from 'styled-components';
import { PROGRAMMES, SPECIFIED_PROGRAMMES } from './Constants';
import { useProgramme } from './ProgrammeContext';

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--gray-300);

  &:last-child {
    border-bottom: none;
  }
`;

interface SummaryProps {
  totals: { [key: string]: number };
}

interface SummaryItemType {
  label: string;
  value: string;
  short?: string;
}

function Summary(props: SummaryProps) {
  const { totals } = props;
  const { currentProgramme } = useProgramme();

  const renderSummaryItems = () => {
    let summaryItems: SummaryItemType[] = [];

    if (currentProgramme.value === 'all_programmes') {
      summaryItems = PROGRAMMES;
    } else if (currentProgramme.value === 'public') {
      summaryItems = [
        {
          label: 'Public finance for the SDGs',
          short: 'Public finance for the SDGs',
          value: 'public',
        },
        ...SPECIFIED_PROGRAMMES.filter(prog =>
          [
            'public_budget',
            'public_tax',
            'public_debt',
            'public_insurance',
          ].includes(prog.value),
        ),
      ];
    } else if (currentProgramme.value === 'private') {
      summaryItems = [
        {
          label: 'Unlocking private capital and aligning for the SDGs',
          short: 'Unlocking private capital',
          value: 'private',
        },
        ...SPECIFIED_PROGRAMMES.filter(prog =>
          [
            'private_pipelines',
            'private_impact',
            'private_environment',
          ].includes(prog.value),
        ),
      ];
    } else {
      summaryItems = [currentProgramme];
    }

    return (
      <div>
        {summaryItems.length > 0 && (
          <div className='first-summary-item'>
            <p className='label margin-bottom-01'>{summaryItems[0].short}</p>
            <h3 className='undp-typography total margin-bottom-03'>
              {totals[summaryItems[0].value] || 0}
            </h3>
          </div>
        )}
        {summaryItems.slice(1).map(item => (
          <SummaryItem key={item.value} className='summary-item'>
            <div className='label margin-00'>{item.short}</div>
            <div className='total label bold margin-00'>
              {totals[item.value] || 0}
            </div>
          </SummaryItem>
        ))}
      </div>
    );
  };

  return <div>{renderSummaryItems()}</div>;
}

export default Summary;
