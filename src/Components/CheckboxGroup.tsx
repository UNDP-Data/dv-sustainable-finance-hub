import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Checkbox } from 'antd';
import styled from 'styled-components';

const StyledCheckboxGroup = styled(Checkbox.Group)`
  display: inline-grid;
  width: 100%;
  .ant-checkbox-wrapper {
    border-bottom: 0.07rem solid var(--gray-300);
    padding: 4px 0;
    &:last-child {
      border-bottom: none;
    }
    span:first-child {
      width: 18px;
    }
    span:last-child {
      font-size: 14px !important;
      line-height: 1.8;
      width: 100%;
    }
  }
`;

interface CheckboxGroupProps {
  options: { label: string; value: string; count: number }[];
  onChange: (checkedValues: CheckboxValueType[]) => void;
  value: CheckboxValueType[];
}

function CheckboxGroup({ options, onChange, value }: CheckboxGroupProps) {
  const optionsWithCounts = options.map(option => ({
    label: (
      <div className='flex-div flex-space-between'>
        <div>{option.label} </div>
        <p
          style={{
            fontSize: '12px',
            lineHeight: '200%',
            backgroundColor: 'var(--gray-300)',
            borderRadius: '100px',
            padding: '0 8px',
            margin: '0',
          }}
        >
          {option.count}
        </p>
      </div>
    ),
    value: option.value,
  }));

  return (
    <StyledCheckboxGroup
      options={optionsWithCounts}
      className='undp-checkbox margin-top-04'
      onChange={onChange}
      value={value}
    />
  );
}

export default CheckboxGroup;
