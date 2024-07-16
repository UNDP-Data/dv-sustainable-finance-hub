import { PROGRAMMES } from '../Components/Constants';

export const filterProgrammes = (current: string) => {
  if (current === 'all') {
    return PROGRAMMES.filter(prog =>
      ['public', 'private', 'frameworks', 'biofin'].includes(prog.value),
    );
  }
  if (current === 'public') {
    return PROGRAMMES.filter(prog =>
      [
        'public_tax',
        'public_debt',
        'public_budget',
        'public_insurance',
      ].includes(prog.value),
    );
  }
  if (current === 'private') {
    return PROGRAMMES.filter(prog =>
      ['private_pipelines', 'private_impact', 'private_environment'].includes(
        prog.value,
      ),
    );
  }
  if (current === 'frameworks') {
    return PROGRAMMES.filter(prog => ['frameworks'].includes(prog.value));
  }
  if (current === 'biofin') {
    return PROGRAMMES.filter(prog => ['biofin'].includes(prog.value));
  }
  return [];
};
