import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Programme, PROGRAMMES } from './Constants';

interface ProgrammeContextProps {
  currentProgramme: Programme;
  setCurrentProgramme: (programme: Programme) => void;
}

const ProgrammeContext = createContext<ProgrammeContextProps | undefined>(
  undefined,
);

export function ProgrammeProvider({ children }: { children: ReactNode }) {
  const [currentProgramme, setCurrentProgramme] = useState<Programme>(
    PROGRAMMES[0],
  );

  return (
    <ProgrammeContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ currentProgramme, setCurrentProgramme }}
    >
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
