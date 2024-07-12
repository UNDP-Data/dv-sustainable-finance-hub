import { Segmented, Tooltip } from 'antd';
import styled from 'styled-components';
import { Info } from 'lucide-react';
import { useProgramme } from './ProgrammeContext';
import { PROGRAMMES } from './Constants';

const StyledSegmented = styled(Segmented)<{ selectedColor: string }>`
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
    justify-content: center; /* Center align text */
    &:not(:last-child) {
      margin-right: 4px; /* Add gap between items except the last one */
    }
  }

  .ant-segmented-item-label {
    white-space: normal;
    display: flex;
    justify-content: center; /* Center align text */
    padding: 0 !important;
  }

  .ant-segmented-item-selected {
    border-bottom: 0.5rem solid ${({ selectedColor }) => selectedColor};
    box-shadow: none;
    font-weight: 600;
    font-size: 14px;
  }
`;

interface HeaderProps {
  onSegmentChange: (value: string | number) => void; // Callback function prop
}

function Header(props: HeaderProps): JSX.Element {
  const { onSegmentChange } = props;
  const { currentProgramme } = useProgramme();

  // Get the "All Programmes" option
  const allProgrammesOption = PROGRAMMES.find(
    programme => programme.value === 'all_programmes',
  );

  // Get all main subprogrammes under 'all_programmes'
  const mainSubprogrammes = allProgrammesOption?.subprogrammes || [];

  // Prepare the options for the Segmented component
  const options = [
    {
      label: (
        <p className='undp-typography label'>{allProgrammesOption?.short}</p>
      ),
      value: allProgrammesOption?.value || 'all_programmes',
    },
    ...mainSubprogrammes.map(programme => ({
      label: <p className='undp-typography label'>{programme.short}</p>,
      value: programme.value,
    })),
  ];

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
          Sustainable Financial Hub Dashboard
        </p>
        <div className='flex-div flex-row flex-vert-align-center gap-02 margin-00 padding-00'>
          <p
            className='undp-typography margin-00 padding-00 small-font'
            style={{ color: 'var(--gray-500)' }}
          >
            About Dashboard
          </p>
          <Tooltip
            title='This is some random text for the tooltip'
            arrow={false}
          >
            <Info size={14} style={{ color: 'var(--gray-500' }} />
          </Tooltip>
        </div>
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
