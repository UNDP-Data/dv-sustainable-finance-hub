// Country type definition
export interface Country {
  name: string;
  iso: string; // 3-letter ISO code
  programs: string[]; // List of programs
  type: 'SIDS' | 'LDC' | 'Fragile and Affected';
  filtered: boolean;
  initialFilter: boolean;
}

// FilterFunction type
export type FilterFunction = (country: Country) => boolean;

export function filterCountries(
  countries: Country[],
  filters: FilterFunction[],
): Country[] {
  return countries.map(country => {
    // Create a shallow copy of the country object to avoid mutating the function parameter
    const updatedCountry = { ...country };

    // Set initialFilter to true if there is at least one program in the programs array
    updatedCountry.initialFilter = updatedCountry.programs.length > 0;

    // Set the filtered property based on the current filters
    updatedCountry.filtered = filters.some(filterFunc =>
      filterFunc(updatedCountry),
    );

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
