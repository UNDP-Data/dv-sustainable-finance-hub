import { Check } from 'lucide-react';
import { ChoroplethMapDataType } from '../../Types';
import { FIELDS } from '../../Utils/constants';

interface Props {
  data: ChoroplethMapDataType[];
}

function Table(props: Props) {
  const { data } = props;
  const filteredData = data.filter(rowData =>
    FIELDS.some(field => rowData[field.key] === '1'),
  );

  return (
    <div
      className='undp-container padding-top-04'
      style={{ width: '100%', height: '500px' }}
    >
      <div
        className='undp-table-head-small'
        style={{
          position: 'sticky',
          top: '0',
          zIndex: '1',
        }}
      >
        {' '}
        <div
          style={{ width: '25%' }}
          className='undp-table-head-cell undp-sticky-head-column'
        >
          <div className='padding-left-05 padding-right-05'>Country Name</div>
        </div>
        {FIELDS.map(field => (
          <div
            key={field.key}
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
              {rowData.countryName}
            </div>
          </div>
          {FIELDS.map(field => (
            <div
              key={field.key}
              style={{ width: '15%' }}
              className='undp-table-row-cell-small'
            >
              <div
                className='padding-left-05 padding-right-05 padding-top-02 flex-div flex-vert-align-center flex-hor-align-center
'
              >
                {rowData[field.key] === '1' ? (
                  <Check size={18} strokeWidth={3} color='var(--blue-600)' />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Table;
