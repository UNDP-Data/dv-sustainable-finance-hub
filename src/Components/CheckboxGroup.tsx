import { Checkbox } from 'antd';
import styled from 'styled-components';

const StyledCheckboxGroup = styled(Checkbox.Group)`
  .ant-checkbox-wrapper {
    span:last-child {
      font-size: 14px !important;
      line-height: 1.8;
    }
  }
`;

interface CheckboxGroupProps {
  options: { label: string; value: string }[];
  onChange: (checkedValues: string[]) => void;
  value: string[];
}

function CheckboxGroup({ options, onChange, value }: CheckboxGroupProps) {
  return (
    <div
      className='padding-04'
      style={{ border: '0.06rem solid var(--gray-400)' }}
    >
      <p className='undp-typography label'>Filter by subcategories</p>
      <StyledCheckboxGroup
        options={options}
        className='undp-checkbox'
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default CheckboxGroup;
