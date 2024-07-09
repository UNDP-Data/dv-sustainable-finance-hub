import styled from 'styled-components';
import { useProgramme } from './ProgrammeContext';

const TableContainer = styled.div`
  .programme-totals-table-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.06rem solid var(--gray-400);
  }
`;

interface ProgrammeTotalsTableProps {
  totals: {
    programmeTotal: number;
    subcategoryTotals: { label: string; total: number }[];
  };
}
function Summary(props: ProgrammeTotalsTableProps): JSX.Element {
  const { totals } = props;
  const { currentProgramme } = useProgramme();
  const { programmeTotal, subcategoryTotals } = totals;
  return (
    <div className='programme-totals-table'>
      <TableContainer>
        <div>
          <div className='label'>{currentProgramme.label}</div>
          <h3
            className='undp-typograhy total margin-00 padding-bottom-04'
            style={{ fontWeight: '600' }}
          >
            {programmeTotal}
          </h3>
        </div>
        {subcategoryTotals.length > 0 && (
          <>
            {subcategoryTotals.map(({ label, total }) => (
              <div
                key={label}
                className='programme-totals-table-row padding-bottom-03 padding-top-03'
              >
                <div className='label margin-bottom-00'>{label}</div>
                <div className='total bold label margin-bottom-00'>{total}</div>
              </div>
            ))}
          </>
        )}
      </TableContainer>
    </div>
  );
}

export default Summary;
