import styled from 'styled-components';
import { useRef, useState } from 'react';
import {
  StatCardFromData,
  transformDataForGraph,
} from '@undp-data/undp-visualization-library';

const WrapperEl = styled.div`
  scroll-snap-type: x proximity;
  scroll-padding: 0;
  scroll-padding-left: 0;
  display: flex;
  overflow-x: auto;
  padding-bottom: 1rem;
  user-select: none;

  h3 {
    margin-bottom: 0 !important;
  }
`;

interface Props {
  dataStatCard: any;
  values: string[];
  titles: string[];
  desc: string[];
}

export function Cards(props: Props) {
  const { dataStatCard, values, titles, desc } = props;
  const WrapperRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(
    'url(https://design.undp.org/static/media/arrow-right.125a0586.svg)',
  );

  return (
    <div
      className='margin-bottom-07 undp-container'
      style={{
        cursor: `${cursor}, auto`,
      }}
      role='button'
      tabIndex={0} // Makes the div focusable
      onClick={e => {
        if (WrapperRef.current) {
          if (e.clientX > window.innerWidth / 2)
            WrapperRef.current.scrollBy(360, 0);
          else WrapperRef.current.scrollBy(-360, 0);
        }
      }}
      onKeyDown={e => {
        if (WrapperRef.current) {
          if (e.key === 'ArrowRight') WrapperRef.current.scrollBy(360, 0);
          else if (e.key === 'ArrowLeft') WrapperRef.current.scrollBy(-360, 0);
        }
      }}
      onMouseMove={e => {
        if (e.clientX > window.innerWidth / 2)
          setCursor(
            'url(https://design.undp.org/static/media/arrow-right.125a0586.svg)',
          );
        else
          setCursor(
            'url(https://design.undp.org/static/media/arrow-left.14de54ea.svg)',
          );
      }}
    >
      <WrapperEl
        className='flex-div stat-container undp-scrollbar'
        ref={WrapperRef}
      >
        {values.map((value, index) => (
          <div
            className='statCardSliderItem'
            key={index}
            style={{
              minWidth: 'calc(25% - 0.25rem)',
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            <StatCardFromData
              data={transformDataForGraph(dataStatCard, 'statCard', [
                {
                  chartConfigId: 'value',
                  columnId: `${value}`,
                },
              ])}
              backgroundColor
              graphTitle={`${titles[index]}`}
              graphDescription={`${desc[index]}`}
              aggregationMethod='sum'
            />
          </div>
        ))}
      </WrapperEl>
    </div>
  );
}
