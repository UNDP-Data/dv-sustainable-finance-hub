import { Radio } from 'antd';
import styled from 'styled-components';

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  width: 100%;

  .ant-radio-wrapper {
    padding: 4px 0;
    border-bottom: 0.07rem solid var(--gray-300);
    width: 100%;
    &:last-child {
      border-bottom: none;
    }
    span:first-child {
      width: 18px !important;
    }
    span:last-child {
      font-size: 14px !important;
      line-height: 1.8;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
`;
const StyledTag = styled.div`
  border-radius: 2px;
  border: 1px solid var(--gray-400);
  background-color: var(--gray-100);
  padding: 0px 8px;
  margin: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  }
`;

interface CountryGroupProps {
  onRadioChange: (value: string) => void;
  selectedRadio: string;
  groups: { label: string; value: string; count?: number }[];
}

function FilterCountryGroup(props: CountryGroupProps): JSX.Element {
  const { onRadioChange, selectedRadio, groups } = props;

  return (
    <StyledRadioGroup
      value={selectedRadio}
      onChange={(e: any) => onRadioChange(e.target.value)}
      className='undp-radio margin-top-04'
    >
      {groups.map(group => (
        <Radio key={group.value} value={group.value}>
          <div
            className='flex-div flex-space-between'
            style={{ width: '100%' }}
          >
            <div>{group.label}</div>
            {group.count !== undefined ? (
              <StyledTag>{group.count}</StyledTag>
            ) : (
              ''
            )}
          </div>
        </Radio>
      ))}
    </StyledRadioGroup>
  );
}

export default FilterCountryGroup;
