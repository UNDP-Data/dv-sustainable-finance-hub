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

export const countCountriesByPrograms = (
  countries: Country[],
): ProgramCounts => {
  const counts: ProgramCounts = {};

  // Initialize counts for 'public' and 'private'
  if (!counts.public) {
    counts.public = 0;
  }
  if (!counts.private) {
    counts.private = 0;
  }

  // Count occurrences of each program
  countries.forEach(country => {
    country.programs.forEach(program => {
      if (!counts[program]) {
        counts[program] = 0;
      }
      counts[program] += 1;
    });

    // Count countries with 'public' or 'private' programs
    if (country.programs.some(p => p.startsWith('public'))) {
      counts.public += 1;
    }
    if (country.programs.some(p => p.startsWith('private'))) {
      counts.private += 1;
    }
  });

  // Calculate the sum of all program counts
  counts.all = Object.keys(counts).reduce((sum, program) => {
    // Exclude 'public', 'private', and 'all' from the sum
    if (program !== 'public' && program !== 'private') {
      // eslint-disable-next-line no-param-reassign
      sum += counts[program];
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
