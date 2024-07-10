import styled from 'styled-components';
import { useProgramme } from './ProgrammeContext';

const TableContainer = styled.div`
  .programme-totals-table-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.06rem solid var(--gray-400);
    padding: 0.5rem 0;
  }
`;

interface ProgrammeTotalsTableProps {
  totals: number;
}

function Summary(props: ProgrammeTotalsTableProps): JSX.Element {
  const { totals } = props;
  const { currentProgramme } = useProgramme();

  return (
    <div className='programme-totals-table'>
      <TableContainer>
        <div className='programme-totals-table-row'>
          <div className='label'>{currentProgramme.label}</div>
          <h3
            className='undp-typography total margin-00'
            style={{ fontWeight: '600' }}
          >
            {totals}
          </h3>
        </div>
      </TableContainer>
    </div>
  );
}

export default Summary;
