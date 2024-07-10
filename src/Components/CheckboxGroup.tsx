import { Checkbox, CheckboxOptionType } from 'antd';
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
  options: CheckboxOptionType[];
  value: string[];
  onChange: (checkedValues: string[]) => void;
}

function CheckboxGroup(props: CheckboxGroupProps): JSX.Element {
  const { options, value, onChange } = props;

  return (
    <div
      className='padding-04'
      style={{ border: '0.06rem solid var(--gray-400)' }}
    >
      <p className='undp-typography label'>Filter by subprogrammes</p>
      <StyledCheckboxGroup
        options={options}
        value={value}
        className='undp-checkbox'
        onChange={(checkedValues: any[]) => onChange(checkedValues as string[])}
      />
    </div>
  );
}

export default CheckboxGroup;
