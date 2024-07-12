import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { ChoroplethMapDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { PROGRAMMES } from '../../../Constants';
import { useProgramme } from '../../../ProgrammeContext';

interface Props {
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  data: ChoroplethMapDataType[];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  padding?: string;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

export function ChoroplethMap(props: Props) {
  const {
    data,
    graphTitle,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    scale,
    centerPoint,
    padding,
    backgroundColor,
    tooltip,
    onSeriesMouseOver,
  } = props;

  const { currentProgramme } = useProgramme();
  const currentProgrammeColor =
    PROGRAMMES.find(prog =>
      prog.subprogrammes?.some(
        subprog => subprog.value === currentProgramme.value,
      ),
    )?.subprogrammes?.find(subprog => subprog.value === currentProgramme.value)
      ?.color || '#006EB5';

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
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
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
              data={data}
              width={width || svgWidth}
              height={height || svgHeight}
              scale={scale || 180}
              centerPoint={centerPoint || [470, 315]}
              colors={[currentProgrammeColor]}
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
