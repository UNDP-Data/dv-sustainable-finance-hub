import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { PROGRAMMES } from './Constants';
import { Programme } from '../Types';
import { filterProgrammes } from '../Utils/filterProgrammes';

interface ProgrammeContextProps {
  currentProgramme: Programme;
  setCurrentProgramme: (programme: Programme) => void;
  selectedCheckboxes: string[];
  setSelectedCheckboxes: (checkboxes: string[]) => void;
}

const ProgrammeContext = createContext<ProgrammeContextProps | undefined>(
  undefined,
);

export function ProgrammeProvider({ children }: { children: ReactNode }) {
  const [currentProgramme, setCurrentProgramme] = useState<Programme>(
    PROGRAMMES[0],
  );
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>(
    filterProgrammes(PROGRAMMES[0].value).map(prog => prog.value),
  );

  useEffect(() => {
    setSelectedCheckboxes(
      filterProgrammes(currentProgramme.value).map(prog => prog.value),
    );
  }, [currentProgramme]);

  const contextValue = useMemo(
    () => ({
      currentProgramme,
      setCurrentProgramme,
      selectedCheckboxes,
      setSelectedCheckboxes,
    }),
    [currentProgramme, selectedCheckboxes],
  );

  return (
    <ProgrammeContext.Provider value={contextValue}>
      {children}
    </ProgrammeContext.Provider>
  );
}

export const useProgramme = () => {
  const context = useContext(ProgrammeContext);
  if (!context) {
    throw new Error('useProgramme must be used within a ProgrammeProvider');
  }
  return context;
};
