import { scaleLinear, scaleBand } from 'd3-scale';
import sum from 'lodash.sum';
import { useState } from 'react';
import styled from 'styled-components';
import { HorizontalGroupedBarGraphDataType } from '../../../../../Types';
import { numberFormattingFunction } from '../../../../../Utils/numberFormattingFunction';
import { Tooltip } from '../../../../Elements/Tooltip';

interface Props {
  data: HorizontalGroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showXTicks: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

const G = styled.g`
  opacity: 0.85;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;

export function Graph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showXTicks,
    leftMargin,
    rightMargin,
    truncateBy,
    width,
    height,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
  } = props;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = Math.max(...data.map(d => sum(d.width) || 0));

  const x = scaleLinear().domain([0, xMaxValue]).range([0, graphWidth]).nice();
  const y = scaleBand()
    .domain(data.map(d => `${d.label}`))
    .range([0, graphHeight])
    .paddingInner(barPadding);
  const xTicks = x.ticks(5);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {showXTicks
            ? xTicks.map((d, i) => (
                <g key={i}>
                  <text
                    x={x(d)}
                    y={-12.5}
                    style={{
                      fill: 'var(--gray-500)',
                      fontFamily: 'var(--fontFamily)',
                    }}
                    textAnchor='middle'
                    fontSize={12}
                  >
                    {numberFormattingFunction(d)}
                  </text>
                  <line
                    x1={x(d)}
                    x2={x(d)}
                    y1={-2.5}
                    y2={graphHeight + margin.bottom}
                    style={{
                      stroke: 'var(--gray-500)',
                    }}
                    strokeWidth={1}
                    strokeDasharray='4,8'
                    opacity={d === 0 ? 0 : 1}
                  />
                </g>
              ))
            : null}
          {data.map((d, i) => {
            return (
              <G
                key={i}
                transform={`translate(${0},${y(`${d.label}`)})`}
                onMouseEnter={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={(event: any) => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onMouseLeave={() => {
                  setMouseOverData(undefined);
                  setEventX(undefined);
                  setEventY(undefined);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(undefined);
                  }
                }}
              >
                {d.width.map((el, j) => (
                  <g key={j}>
                    <rect
                      key={j}
                      x={x(
                        j === 0
                          ? 0
                          : sum(d.width.filter((_element, k) => k < j)),
                      )}
                      y={0}
                      width={x(el)}
                      style={{
                        fill: barColors[j],
                      }}
                      height={y.bandwidth()}
                    />
                  </g>
                ))}
                <text
                  style={{
                    fill: 'var(--gray-700)',
                    fontSize: '0.75rem',
                    textAnchor: 'end',
                    fontFamily: 'var(--fontFamily)',
                  }}
                  x={x(0)}
                  y={y.bandwidth() / 2}
                  dx={-10}
                  dy={8}
                >
                  {d.label.length < truncateBy
                    ? d.label
                    : `${d.label.substring(0, truncateBy)}...`}
                </text>
              </G>
            );
          })}
          <line
            x1={x(0)}
            x2={x(0)}
            y1={-2.5}
            y2={graphHeight + margin.bottom}
            stroke='#212121'
            strokeWidth={1}
          />
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
