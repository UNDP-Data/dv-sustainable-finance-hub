import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Checkbox } from 'antd';
import styled from 'styled-components';

const StyledCheckboxGroup = styled(Checkbox.Group)`
  display: inline-grid;
  .ant-checkbox-wrapper {
    span:last-child {
      font-size: 14px !important;
      line-height: 1.8;
    }
  }
`;

interface CheckboxGroupProps {
  options: { label: string; value: string }[];
  onChange: (checkedValues: CheckboxValueType[]) => void;
  value: CheckboxValueType[];
}

function CheckboxGroup({ options, onChange, value }: CheckboxGroupProps) {
  return (
    <StyledCheckboxGroup
      options={options}
      className='undp-checkbox margin-top-04'
      onChange={onChange}
      value={value}
    />
  );
}

export default CheckboxGroup;
