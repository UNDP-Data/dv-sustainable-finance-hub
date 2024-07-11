import { Radio } from 'antd';
import styled from 'styled-components';
import { GROUPS } from './Constants';

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;

  .ant-radio-wrapper {
    span:last-child {
      font-size: 14px !important;
      line-height: 1.8;
    }
  }
`;

interface CountryGroupProps {
  onRadioChange: (value: string) => void; // Callback function prop for Radio Group
  selectedRadio: string; // Selected radio value
}

function FilterCountryGroup(props: CountryGroupProps): JSX.Element {
  const { onRadioChange, selectedRadio } = props;

  return (
    <StyledRadioGroup
      options={GROUPS}
      value={selectedRadio}
      onChange={(e: any) => onRadioChange(e.target.value)}
      className='undp-radio margin-top-04'
    />
  );
}

export default FilterCountryGroup;
