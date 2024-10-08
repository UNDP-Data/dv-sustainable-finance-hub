// Country type definition
export interface Country {
  name: string;
  iso: string; // 3-letter ISO code
  programs: string[]; // List of programs
  type: string[];
  filtered: boolean;
  initialFilter: boolean;
}

// FilterFunction type
export type FilterFunction = (country: Country) => boolean;

export interface ProgramCounts {
  [program: string]: number;
}

const belongsToProgramClass = (
  country: Country,
  programClass: string[],
): boolean => {
  return (
    programClass.length > 0 &&
    country.programs.filter(p => programClass.includes(p)).length > 0
  );
};

export const countCountriesByPrograms = (
  countries: Country[],
  selectedPrograms: string[],
): ProgramCounts => {
  const counts: ProgramCounts = {};

  // Initialize counts for 'public', 'private', and totals
  if (!counts.public) counts.public = 0;
  if (!counts.private) counts.private = 0;

  // Count occurrences of each program
  countries.forEach(country => {
    country.programs.forEach(program => {
      if (!counts[program]) {
        counts[program] = 0;
      }

      // Only count the program if it is in the selectedPrograms list
      if (selectedPrograms.includes(program)) {
        counts[program] += 1;
      }
    });

    // Count countries with 'public' or 'private' programs if the country belongs to any selected 'public' or 'private' program
    if (
      belongsToProgramClass(
        country,
        selectedPrograms.filter(p => p.startsWith('public')),
      )
    ) {
      counts.public += 1;
    }
    if (
      belongsToProgramClass(
        country,
        selectedPrograms.filter(p => p.startsWith('private')),
      )
    ) {
      counts.private += 1;
    }
  });

  counts.all = countries.reduce((sum, country) => {
    const hasSpecificProgram = country.programs.some(program =>
      selectedPrograms.includes(program),
    );

    if (hasSpecificProgram) {
      // eslint-disable-next-line no-param-reassign
      sum += 1;
    }

    return sum;
  }, 0);

  return counts;
};

export const countCountriesByType = (countries: Country[]): ProgramCounts => {
  const counts: ProgramCounts = {};

  countries.forEach(country => {
    country.type.forEach(t => {
      if (!counts[t]) {
        counts[t] = 0;
      }
      counts[t] += 1;
    });
  });

  return counts;
};

export const filterByType = (country: Country, shownType: string): boolean => {
  switch (shownType) {
    case 'all':
      return true;
    default:
      return country.type.includes(shownType);
  }
};

export function filterCountries(
  countries: Country[],
  filters: FilterFunction[],
  shownType: string,
): Country[] {
  return countries.map(country => {
    // Create a shallow copy of the country object to avoid mutating the function parameter
    const updatedCountry = { ...country };

    // Set initialFilter to true if there is at least one program in the programs array
    updatedCountry.initialFilter = updatedCountry.programs.length > 0;

    // Set the filtered property based on the current filters
    updatedCountry.filtered =
      filters.some(filterFunc => filterFunc(updatedCountry)) &&
      filterByType(updatedCountry, shownType);

    return updatedCountry;
  });
}

// Filter to include countries that have a specific program
export const programIncludesFilter = (program: string): FilterFunction => {
  return (country: Country) => country.programs.includes(program);
};

// Filter to include countries that have any program starting with a specific substring
export const programStartsWithFilter = (substring: string): FilterFunction => {
  return (country: Country) =>
    country.programs.some(program => program.startsWith(substring));
};
