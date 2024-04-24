/* eslint-disable react/button-has-type */
// import UNDPColorModule from 'undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Radio } from 'antd';
import { Graph } from './Graph';
import { ChoroplethMapDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';

interface Props {
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  // domain: number[];
  // colors?: string[];
  // colorLegendTitle?: string;
  // categorical?: boolean;
  data: ChoroplethMapDataType[];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  padding?: string;
  tooltip?: (_d: any) => JSX.Element | any;
  onSeriesMouseOver?: (_d: any) => void;
  selectedColumn: string;
  onSelectColumn: (column: string) => void;
}

export function ChoroplethMap(props: Props) {
  const {
    data,
    graphTitle,
    // colors,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    // domain,
    // colorLegendTitle,
    // categorical,
    scale,
    centerPoint,
    padding,
    backgroundColor,
    tooltip,
    onSeriesMouseOver,
    onSelectColumn,
    selectedColumn,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current]);

  return (
    <div
      style={{
        display: 'flex',
        border: '1px solid rgba(5, 5, 5, 0.06)',
        flexDirection: 'column',
        width: '100%',
        flexGrow: width ? 0 : 1,
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-100)'
          : backgroundColor,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
          />
        ) : null}
        <div style={{ padding: '10px 10px 32px 10px' }}>
          <Radio.Group
            defaultValue='public_finance_budget'
            onChange={e => {
              // eslint-disable-next-line no-console
              onSelectColumn(e.target.value);
            }}
          >
            <Radio.Button value='public_finance_budget'>Budget</Radio.Button>
            <Radio.Button value='public_finance_tax'>Tax</Radio.Button>
            <Radio.Button value='public_finance_debt'>Debt</Radio.Button>
            <Radio.Button value='insurance_and_risk_finance'>
              Insurance and risk finance
            </Radio.Button>
          </Radio.Group>
        </div>
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            lineHeight: 0,
          }}
          ref={graphDiv}
        >
          {(width || svgWidth) && (height || svgHeight) ? (
            <Graph
              data={data.map(d => ({
                ...d,
                x: d[selectedColumn], // ensure the `selectedColumn` is mapped correctly
              }))}
              // domain={domain}
              width={width || svgWidth}
              height={height || svgHeight}
              scale={scale || 180}
              centerPoint={centerPoint || [470, 315]}
              // colors={
              //   colors ||
              //   (categorical
              //     ? UNDPColorModule.sequentialColors[
              //         `neutralColorsx0${domain.length as 4 | 5 | 6 | 7 | 8 | 9}`
              //       ]
              //     : UNDPColorModule.sequentialColors[
              //         `neutralColorsx0${
              //           (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
              //         }`
              //       ])
              // }
              // colorLegendTitle={colorLegendTitle}
              // categorical={categorical}
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
            />
          ) : null}
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
          />
        ) : null}
      </div>
    </div>
  );
}
