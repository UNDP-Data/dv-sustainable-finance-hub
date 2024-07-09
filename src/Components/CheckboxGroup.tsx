import { Checkbox, CheckboxOptionType } from 'antd';

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
      <Checkbox.Group
        options={options}
        value={value}
        className='undp-checkbox'
        onChange={checkedValues => onChange(checkedValues as string[])}
      />
    </div>
  );
}

export default CheckboxGroup;
