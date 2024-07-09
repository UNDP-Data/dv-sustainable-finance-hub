import { Radio } from 'antd';
import styled from 'styled-components';
import { GROUPS } from './Constants';

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column; // Display items in one column
`;

interface CountryGroupProps {
  onRadioChange: (value: string) => void; // Callback function prop for Radio Group
  selectedRadio: string; // Selected radio value
}

function FilterCountryGroup(props: CountryGroupProps): JSX.Element {
  const { onRadioChange, selectedRadio } = props;

  return (
    <div
      className='padding-04'
      style={{ border: '0.06rem solid var(--gray-400)' }}
    >
      <p className='undp-typography label'>Filter by country group</p>
      <StyledRadioGroup
        options={GROUPS}
        value={selectedRadio}
        onChange={(e: any) => onRadioChange(e.target.value)}
        className='undp-radio'
      />
    </div>
  );
}

export default FilterCountryGroup;
