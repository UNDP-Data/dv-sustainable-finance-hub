import { Segmented } from 'antd';
import styled from 'styled-components';
import { useProgramme } from './ProgrammeContext';
import { PROGRAMMES } from './Constants';

const StyledSegmented = styled(Segmented)<{ selectedColor: string }>`
  background-color: white !important;
  display: flex;
  width: 100%;

  .ant-segmented-item {
    border: 0.06rem solid var(--gray-400);
    width: 20%;
    flex: 1;
    color: var(--gray-700);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 68px;

    &:not(:last-child) {
      margin-right: 8px; // Add gap between items except the last one
    }
    .ant-segmented-item-label {
      white-space: normal;
      display: flex;
      gap: 16px;
      padding: 0 16px;
      align-items: center;
    }
  }

  .ant-segmented-item-selected {
    background-color: ${({ selectedColor }) => selectedColor} !important;
    border: 0.07rem solid ${({ selectedColor }) => selectedColor};
    color: white !important;

    .ant-segmented-item-label {
      .icon-wrapper {
        color: white !important; 
        background-color: #ffffff33;
        ) !important;  
      }
    }
  }
`;

const IconWrapper = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 100px;
  background-color: ${({ color }) => `${color}33`};
  color: ${({ color }) => color};
  margin-right: 8px; // Space between the icon and the label
  &.ant-segmented-item-label {
    color: white !important; // Change icon color for selected item
    background-color: white !important;
  }
`;

interface HeaderProps {
  onSegmentChange: (value: any) => void; // Callback function prop
}

function Header(props: HeaderProps): JSX.Element {
  const { onSegmentChange } = props;
  const { currentProgramme } = useProgramme();

  return (
    <div className='header-container'>
      <h5
        style={{ fontWeight: '600', marginBottom: '0.5rem' }}
        className='undp-typography'
      >
        Sustainable Financial Hub
      </h5>
      <StyledSegmented
        selectedColor={currentProgramme.color}
        options={PROGRAMMES.map(programme => ({
          label: (
            <>
              <IconWrapper className='icon-wrapper' color={programme.color}>
                <programme.icon />
              </IconWrapper>
              <div
                style={{
                  lineHeight: '1.2',
                  textAlign: 'left',
                }}
              >
                {programme.label}
              </div>
            </>
          ),
          value: programme.value,
        }))}
        onChange={onSegmentChange}
      />
    </div>
  );
}

export default Header;
