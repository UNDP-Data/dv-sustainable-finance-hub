import styled from 'styled-components';

const TableContainer = styled.div`
  .programme-totals-table-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.06rem solid var(--gray-400);
  }

  .first-data-point {
    border-bottom: 0.06rem solid var(--gray-400);
  }
`;

interface ProgrammeTotalsTableProps {
  totals: {
    [key: string]: {
      label: string;
      total: number;
    };
  };
}

function Summary(props: ProgrammeTotalsTableProps): JSX.Element {
  const { totals } = props;
  const totalEntries = Object.values(totals);
  return (
    <div className='programme-totals-table'>
      <TableContainer>
        <div className='first-data-point'>
          <p className='label padding-bottom-02 margin-bottom-00'>
            {totalEntries[0].label}
          </p>
          <h3
            className='undp-typograhy total margin-00 padding-bottom-04'
            style={{ fontWeight: '600' }}
          >
            {totalEntries[0].total}
          </h3>
        </div>
        <div className='programme-totals-table'>
          {totalEntries.slice(1).map(({ label, total }) => (
            <div
              key={label}
              className='programme-totals-table-row padding-bottom-03 padding-top-03'
            >
              <div className='label margin-bottom-00'>{label}</div>
              <div className='total bold label margin-bottom-00'>{total}</div>
            </div>
          ))}
        </div>
      </TableContainer>
    </div>
  );
}

export default Summary;
