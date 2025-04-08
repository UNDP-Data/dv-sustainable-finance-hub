import styled from 'styled-components';
import {
  StatCardFromData,
  transformDataForGraph,
} from '@undp-data/undp-visualization-library';

const WrapperEl = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

interface Props {
  dataStatCard: any;
  values: string[];
  titles: string[];
  desc: string[];
}

export function Cards(props: Props) {
  const { dataStatCard, values, titles, desc } = props;

  return (
    <div className='mb-4 mt-4'>
      <WrapperEl className='stat-container'>
        {values.map((value, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'stretch' }}>
            <StatCardFromData
              data={transformDataForGraph(dataStatCard, 'statCard', [
                {
                  chartConfigId: 'value',
                  columnId: `${value}`,
                },
              ])}
              backgroundColor
              graphTitle={titles[index]}
              graphDescription={desc[index]}
              aggregationMethod='sum'
            />
          </div>
        ))}
      </WrapperEl>
    </div>
  );
}
