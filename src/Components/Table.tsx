import { Check, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from 'antd';
import { ChoroplethMapDataType } from '../Types';
import { PROGRAMMES } from './Constants';

interface Props {
  data: ChoroplethMapDataType[];
}

function Table(props: Props) {
  const { data } = props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((rowData: ChoroplethMapDataType) =>
    rowData.data.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='margin-top-03'>
      <Input
        placeholder='Search by country'
        className='undp-input'
        prefix={<Search size={18} strokeWidth={2.5} color='var(--black)' />}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%' }}
      />
      <div
        className='undp-container margin-top-04 undp-scrollbar'
        style={{
          width: '100%',
          height: '500px',
        }}
      >
        <div
          className='undp-table-head-small'
          style={{
            position: 'sticky',
            top: '0',
            zIndex: '1',
          }}
        >
          <div
            style={{ width: '25%' }}
            className='undp-table-head-cell undp-sticky-head-column'
          >
            <div className='padding-left-05 padding-right-05'>Country Name</div>
          </div>
          {PROGRAMMES.map(field => (
            <div
              key={field.label}
              style={{ width: '15%' }}
              className='undp-table-head-cell undp-sticky-head-column'
            >
              <div className='padding-left-05 padding-right-05 flex-div flex-hor-align-center'>
                {field.label}
              </div>
            </div>
          ))}
        </div>
        {filteredData.map((rowData, index) => (
          <div key={index} className='undp-table-row'>
            <div style={{ width: '25%' }} className='undp-table-row-cell-small'>
              <div className='padding-left-05 padding-right-05'>
                {rowData.data.country}
              </div>
            </div>
            {PROGRAMMES.map(field => (
              <div
                key={field.value}
                style={{ width: '15%' }}
                className='undp-table-row-cell-small'
              >
                <div className='padding-left-05 padding-right-05 padding-top-02 flex-div flex-vert-align-center flex-hor-align-center'>
                  {rowData.data[field.value] === '1' ? (
                    <Check size={18} strokeWidth={3} color='var(--blue-600)' />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Table;
