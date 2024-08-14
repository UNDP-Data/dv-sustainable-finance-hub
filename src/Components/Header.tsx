import { Segmented, Popover } from 'antd';
import styled from 'styled-components';
import { Info } from 'lucide-react';
import { PROGRAMMES } from './Constants';

const StyledSegmented = styled(Segmented).withConfig({
  shouldForwardProp: prop => !['selectedColor'].includes(prop),
})<{ selectedColor: string }>`
  background-color: white !important;
  display: flex;
  width: 60%;

  .ant-segmented-item {
    border-bottom: 0.5rem solid var(--gray-400);
    border-radius: 0;
    width: 120px;
    flex: 1;
    color: var(--gray-700);
    display: flex;
    &:not(:last-child) {
      margin-right: 4px;
    }
  }

  .ant-segmented-item-label {
    white-space: normal;
    display: flex;
    padding: 0 0 8px 0 !important;
  }

  .ant-segmented-item-selected {
    border-bottom: 0.5rem solid ${({ selectedColor }) => selectedColor};
    box-shadow: none;
    font-size: 14px;
  }

  .ant-segmented-item-selected:hover {
    background-color: white;
  }
`;

interface HeaderProps {
  onSegmentChange: (value: string | number) => void;
  currentProgramme: { value: string; color: string };
  countPrograms: { [key: string]: number };
}

function Header(props: HeaderProps): JSX.Element {
  const { onSegmentChange, currentProgramme, countPrograms } = props;

  const options = PROGRAMMES.filter(programme =>
    ['all', 'public', 'private', 'frameworks', 'biofin'].includes(
      programme.value,
    ),
  ).map(programme => ({
    label: (
      <div
        className='flex-div flex-column gap-00'
        style={{ width: '100%', alignItems: 'flex-start' }}
        title={programme.label}
      >
        <h3 className='undp-typography margin-00'>
          {countPrograms[programme.value] || 0}
        </h3>
        <p className='undp-typography label margin-00'>{programme.short}</p>
      </div>
    ),
    value: programme.value,
  }));

  const tooltipContent = (
    <div>
      <p
        className='undp-typography margin-00 padding-03 small-font'
        style={{
          maxWidth: '20rem',
        }}
      >
        This dashboard shows UNDP’s work on sustainable finance across the
        world. You can filter the information by service or topic.
      </p>
    </div>
  );

  return (
    <div
      className='header-container flex-div flex-vert-align-center flex-space-between flex-row margin-00 padding-05'
      style={{ width: '100%', borderBottom: '0.07rem solid var(--gray-400)' }}
    >
      <div
        className='flex-div flex-column gap-00 margin-00 padding-00'
        style={{ width: '25%' }}
      >
        <p
          className='undp-typography margin-00 padding-00 bold'
          style={{ fontSize: '1rem' }}
        >
          UNDP’s work on sustainable finance
        </p>
        <Popover
          overlayClassName='undp-tooltip'
          content={tooltipContent}
          className='undp-tooltip'
          arrow={false}
        >
          <div className='flex-div flex-vert-align-center gap-02'>
            <p
              className='undp-typography margin-00 padding-00 small-font'
              style={{ color: 'var(--gray-500)' }}
            >
              About Dashboard
            </p>
            <Info size={14} style={{ color: 'var(--gray-500' }} />
          </div>
        </Popover>
      </div>
      <StyledSegmented
        selectedColor={currentProgramme.color}
        options={options}
        onChange={onSegmentChange}
        value={currentProgramme.value}
      />
    </div>
  );
}

export default Header;
