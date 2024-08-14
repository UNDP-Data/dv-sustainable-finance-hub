import React, { useEffect, useState, useCallback } from 'react';
import { json, csv } from 'd3-request';
import { queue } from 'd3-queue';
import {
  CircleChevronDown,
  CircleChevronRight,
  Globe,
  LayoutGrid,
} from 'lucide-react';
import { Segmented } from 'antd';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import { ProgrammeProvider } from './Components/ProgrammeContext';
import Cards from './Components/Cards';
import { TooltipContent } from './Components/TooltipContent';
import {
  Country,
  filterCountries,
  FilterFunction,
  programIncludesFilter,
  programStartsWithFilter,
  filterByType,
  countCountriesByPrograms,
  countCountriesByType,
} from './Utils/countryFilters';
import Header from './Components/Header';
import ProgrammeTree from './Components/ProgrammeTree';
import { PROGRAMMES } from './Components/Constants';
import FilterCountryGroup from './Components/Filter';

const baseTreeData = [
  {
    title: 'Public Finance',
    key: 'public',
    children: [
      { title: 'Tax for the SDGs', key: 'public_tax' },
      { title: 'Budget for the SDGs', key: 'public_budget' },
      { title: 'Debt for the SDGs', key: 'public_debt' },
      { title: 'Insurance and risk finance', key: 'public_insurance' },
    ],
  },
  {
    title: 'Private finance',
    key: 'private',
    children: [
      {
        title: 'Originating pipelines',
        key: 'private_pipelines',
      },
      { title: 'Managing for impact', key: 'private_impact' },
      { title: 'Enabling environment', key: 'private_environment' },
    ],
  },
  { title: 'Biodiversity finance', key: 'biofin' },
  {
    title: 'INFFs',
    key: 'frameworks',
  },
];

const ALL_PROGRAMS = [
  'public_tax',
  'public_budget',
  'public_debt',
  'public_insurance',
  'private_pipelines',
  'private_impact',
  'private_environment',
  'biofin',
  'frameworks',
];

const ALL_CHECKED_KEYS = ['public', 'private', 'biofin', 'frameworks'];

function AppContent() {
  const [data, setData] = useState<Country[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(ALL_CHECKED_KEYS);

  // Initialize with the "All Programmes" object
  const allProgrammes = PROGRAMMES.find(programme => programme.value === 'all');

  if (!allProgrammes) {
    throw new Error('The "All Programmes" option is missing in PROGRAMMES');
  }

  const [currentProgramme, setCurrentProgramme] = useState(allProgrammes);
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [filterTwoExpanded, setFilterTwoExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<string>('Map');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    queue()
      .defer(
        csv,
        'https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv',
      )
      .defer(
        json,
        'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json',
      )
      .await((err: any, loadedData: any[], countryTaxonomy: any[]) => {
        if (err) {
          console.error('Error loading data:', err);
          return;
        }

        const sids = countryTaxonomy
          .filter((d: any) => d.SIDS)
          .map((d: any) => d['Alpha-3 code']);
        const ldc = countryTaxonomy
          .filter((d: any) => d.LDC)
          .map((d: any) => d['Alpha-3 code']);

        const countryMapping = countryTaxonomy.reduce(
          (acc: any, country: any) => {
            acc[country['Alpha-3 code']] = country['Country or Area'];
            return acc;
          },
          {},
        );

        const transformedData: Country[] = loadedData.map((d: any) => {
          const programs: string[] = [];

          Object.keys(d).forEach(key => {
            // Check if the key is a recognized program and is active
            if (ALL_PROGRAMS.includes(key) && d[key] === '1') {
              programs.push(key);
            }
          });

          const { iso } = d;
          const name = countryMapping[iso] || d.country;

          // Initialize the type as an array
          const type: string[] = [];

          // Add 'SIDS' if the ISO is in the sids list
          if (sids.includes(iso)) {
            type.push('SIDS');
          }

          // Add 'LDC' if the ISO is in the ldc list
          if (ldc.includes(iso)) {
            type.push('LDC');
          }

          // Add 'Fragile and Affected' if the 'fragile' column is '1'
          if (d.fragile === '1') {
            type.push('Fragile and Affected');
          }

          return {
            name,
            iso,
            programs,
            type, // type is now an array of strings
            filtered: false,
            initialFilter: false,
          };
        });

        setData(transformedData);
      });
  }, []);

  const handleSegmentChange = useCallback(
    (value: string | number) => {
      const selectedProgramme =
        PROGRAMMES.find(p => p.value === value) || allProgrammes;

      // Set the full Programme object
      setCurrentProgramme(selectedProgramme);

      if (selectedProgramme.value === 'all') {
        setCheckedKeys(ALL_CHECKED_KEYS);
      } else if (
        selectedProgramme.value === 'biofin' ||
        selectedProgramme.value === 'frameworks'
      ) {
        // Set the checked keys directly for biofin or frameworks
        setCheckedKeys([selectedProgramme.value]);
      } else {
        const updatedKeys = baseTreeData
          .filter(
            item => item.key === selectedProgramme.value || item.key === 'all',
          )
          .flatMap(item => item.children?.map(child => child.key) || []);
        setCheckedKeys(updatedKeys);
      }
    },
    [allProgrammes],
  );

  const handleRadioChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);
  // Handle checkbox change
  const handleCheckboxChange = useCallback(
    (
      checkedKeysValue: string[] | { checked: string[]; halfChecked: string[] },
    ) => {
      const keys = Array.isArray(checkedKeysValue)
        ? checkedKeysValue
        : checkedKeysValue.checked;
      setCheckedKeys(keys);
    },
    [],
  );

  // Filters
  function generateFilterFunctions(
    anySelectedKeys: string[],
  ): FilterFunction[] {
    const filters: FilterFunction[] = [];

    // Iterate over the selected keys
    anySelectedKeys.forEach(key => {
      if (key === 'public' || key === 'private') {
        // Add a filter function for the whole category
        filters.push(programStartsWithFilter(key));
      } else {
        // Add a filter function for a specific program
        filters.push(programIncludesFilter(key));
      }
    });

    return filters;
  }

  const filters = generateFilterFunctions(checkedKeys);
  const result = filterCountries(data, filters, selectedType);
  const countsByProgram = countCountriesByPrograms(
    result.filter(c => filterByType(c, selectedType)),
  );

  const programCountries = result.filter(c =>
    filters.some(filterFunc => filterFunc(c)),
  );
  const countsByType = countCountriesByType(programCountries);

  countsByType.all = programCountries.length;
  console.log(countsByProgram);
  console.log(countsByType);

  const tooltip = (d: any) => {
    return <TooltipContent iso={d.iso} data={result} />;
  };

  const groups = [
    { label: 'All countries', value: 'all', count: countsByType.all },
    { label: 'SIDS', value: 'SIDS', count: countsByType.SIDS },
    { label: 'LDCs', value: 'LDC', count: countsByType.LDC },
    {
      label: 'Fragile and conflict-affected',
      value: 'Fragile and Affected',
      count: countsByType['Fragile and Affected'],
    },
  ];

  return (
    <div
      className='undp-container flex-div gap-00 flex-wrap flex-hor-align-center'
      style={{ border: '0.07rem solid var(--gray-400)', maxWidth: '1980px' }}
    >
      <Header
        onSegmentChange={handleSegmentChange}
        currentProgramme={currentProgramme}
        countPrograms={countsByProgram}
      />
      <div className='flex-div flex-row gap-00' style={{ width: '100%' }}>
        <div
          className='flex-div flex-column gap-00 grow'
          style={{ width: '25%', borderRight: '0.07rem solid var(--gray-400)' }}
        >
          <div className='settings-sections-container'>
            <button
              type='button'
              aria-label='Expand or collapse filters'
              className='settings-sections-container-title gap-03 margin-bottom-00'
              onClick={() => setFilterTwoExpanded(!filterTwoExpanded)}
            >
              <div>
                {filterTwoExpanded ? (
                  <CircleChevronDown size={16} />
                ) : (
                  <CircleChevronRight size={16} />
                )}
              </div>
              <h6
                className='undp-typography margin-top-00 margin-bottom-02'
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '.03em',
                }}
              >
                Filter By SubProgrammes
              </h6>
            </button>
            <div
              className='settings-sections-options-container padding-top-03'
              style={{ display: filterTwoExpanded ? 'flex' : 'none' }}
            >
              <ProgrammeTree
                checkedKeys={checkedKeys}
                onCheck={handleCheckboxChange}
                currentProgramme={currentProgramme.value}
                baseTreeData={baseTreeData}
                countsByProgram={countsByProgram}
              />
            </div>
          </div>
          <div className='settings-sections-container'>
            <button
              type='button'
              aria-label='Expand or collapse filters'
              className='settings-sections-container-title gap-03 margin-bottom-00'
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <div>
                {filterExpanded ? (
                  <CircleChevronDown size={16} />
                ) : (
                  <CircleChevronRight size={16} />
                )}
              </div>
              <h6
                className='undp-typography margin-top-00 margin-bottom-02'
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '.03em',
                }}
              >
                Filter By Country Group
              </h6>
            </button>
            <div
              className='settings-sections-options-container padding-top-03'
              style={{ display: filterExpanded ? 'flex' : 'none' }}
            >
              <FilterCountryGroup
                selectedRadio={selectedType}
                onRadioChange={handleRadioChange}
                groups={groups}
              />
            </div>
          </div>
        </div>
        <div
          className='flex-div flex-column grow gap-00'
          style={{
            width: 'calc(80% - 54px)',
            overflow: 'hidden',
            backgroundColor: 'var(--gray-100)',
          }}
        >
          <Segmented
            options={[
              {
                label: (
                  <div className='flex-div flex-vert-align-center gap-02'>
                    <Globe strokeWidth={1.7} size={16} /> Map
                  </div>
                ),
                value: 'Map',
              },
              {
                label: (
                  <div className='flex-div flex-vert-align-center gap-02'>
                    <LayoutGrid strokeWidth={1.7} size={16} /> Cards
                  </div>
                ),
                value: 'Cards',
              },
            ]}
            value={viewMode}
            onChange={(value: any) => setViewMode(value)}
            style={{
              margin: '0.5rem 0.5rem 0.5rem auto',
              width: 'fit-content',
            }}
          />
          {viewMode === 'Map' ? (
            <div className='flex-div flex-hor-align-center'>
              <ChoroplethMap
                data={result}
                width={1000}
                height={600}
                scale={250}
                centerPoint={[450, 370]}
                tooltip={tooltip}
                colors={currentProgramme.color}
              />
            </div>
          ) : (
            <Cards data={result} />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ProgrammeProvider>
      <AppContent />
    </ProgrammeProvider>
  );
}

export default App;
