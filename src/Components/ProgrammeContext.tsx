import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PROGRAMMES } from './Constants';
import { Programme } from '../Types';

interface ProgrammeContextProps {
  currentProgramme: Programme;
  setCurrentProgramme: (programme: Programme) => void;
  taxonomy: { [key: string]: any }[];
  setTaxonomy: (taxonomy: { [key: string]: any }[]) => void;
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
  const [taxonomy, setTaxonomy] = useState<{ [key: string]: any }[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  return (
    <ProgrammeContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currentProgramme,
        setCurrentProgramme,
        taxonomy,
        setTaxonomy,
        selectedCheckboxes,
        setSelectedCheckboxes,
      }}
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
