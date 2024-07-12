import { useEffect, useState, useCallback } from 'react';
import { json, csv } from 'd3-request';
import { queue } from 'd3-queue';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import {
  CircleChevronDown,
  CircleChevronRight,
  Globe,
  LayoutGrid,
} from 'lucide-react';
import { Segmented } from 'antd';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import Header from './Components/Header';
import FilterCountryGroup from './Components/Filter';
import { PROGRAMMES } from './Components/Constants';
import { ProgrammeProvider, useProgramme } from './Components/ProgrammeContext';
import CheckboxGroup from './Components/CheckboxGroup';
import { ChoroplethMapDataType } from './Types';
import Cards from './Components/Cards';

function AppContent() {
  const [data, setData] = useState<any[]>([]);
  const [taxonomy, setTaxonomy] = useState<any[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>('allCountries');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    CheckboxValueType[]
  >([]);
  const [sidsCountries, setSidsCountries] = useState<string[]>([]);
  const [ldcCountries, setLdcCountries] = useState<string[]>([]);
  const { currentProgramme, setCurrentProgramme } = useProgramme();
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [filterTwoExpanded, setFilterTwoExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<string>('Map');

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
        setSidsCountries(sids);
        setLdcCountries(ldc);

        // Convert string values to numbers
        const numericData = loadedData.map((item: any) => {
          const transformedItem = { ...item };
          Object.keys(transformedItem).forEach(key => {
            const value = parseInt(transformedItem[key], 10);
            // eslint-disable-next-line no-restricted-globals
            transformedItem[key] = isNaN(value) ? transformedItem[key] : value;
          });
          return transformedItem;
        });

        const relevantSubprogrammes = [
          'public_tax',
          'public_debt',
          'public_budget',
          'public_insurance',
          'private_pipelines',
          'private_impact',
          'private_environment',
          'frameworks',
          'biofin',
        ];

        const transformedData = numericData.map((item: any) => {
          const allProgrammesSum = relevantSubprogrammes.reduce(
            (sum, program) => sum + (item[program] || 0),
            0,
          );

          const publicSubprogrammes = [
            'public_tax',
            'public_debt',
            'public_budget',
            'public_insurance',
          ];
          const publicFinanceSum = publicSubprogrammes.reduce(
            (sum, sub) => sum + (item[sub] || 0),
            0,
          );

          const privateSubprogrammes = [
            'private_pipelines',
            'private_impact',
            'private_environment',
          ];
          const privateCapitalSum = privateSubprogrammes.reduce(
            (sum, sub) => sum + (item[sub] || 0),
            0,
          );

          return {
            ...item,
            all_programmes: allProgrammesSum,
            public: publicFinanceSum,
            private: privateCapitalSum,
          };
        });

        console.log('Transformed data:', transformedData);
        setData(transformedData);
        setTaxonomy(countryTaxonomy);
      });
  }, []);

  const handleSegmentChange = useCallback(
    (value: string | number) => {
      const allProgrammesOption = PROGRAMMES.find(
        p => p.value === 'all_programmes',
      );
      const programme =
        allProgrammesOption?.subprogrammes?.find(p => p.value === value) ||
        PROGRAMMES.find(p => p.value === value);

      if (programme) {
        setCurrentProgramme(programme);
      }
    },
    [setCurrentProgramme],
  );

  const handleRadioChange = useCallback((value: string) => {
    setSelectedRadio(value);
  }, []);

  const handleCheckboxChange = useCallback(
    (checkedValues: CheckboxValueType[]) => {
      setSelectedCheckboxes(checkedValues.map(String));
    },
    [],
  );

  const filterData = useCallback(
    (rawData: any[], countryGroup: string) => {
      const filteredByCountry = rawData.filter(item => {
        if (countryGroup === 'allCountries') return true;
        if (countryGroup === 'sids') return sidsCountries.includes(item.iso);
        if (countryGroup === 'ldc') return ldcCountries.includes(item.iso);
        if (countryGroup === 'fragile') return item.fragile > 0;
        return item[countryGroup] > 0;
      });

      console.log('Filtered by country:', filteredByCountry);

      if (selectedCheckboxes.length === 0) return filteredByCountry;

      const filteredByCheckboxes = filteredByCountry.filter(item =>
        selectedCheckboxes.some(
          sub => typeof sub === 'string' && item[sub] > 0,
        ),
      );

      console.log('Filtered by checkboxes:', filteredByCheckboxes);
      return filteredByCheckboxes;
    },
    [sidsCountries, ldcCountries, selectedCheckboxes],
  );

  const transformData = useCallback(
    (
      rawData: any[],
      programme: string,
      countryGroup: string,
    ): ChoroplethMapDataType[] => {
      const filteredData = filterData(rawData, countryGroup);

      return filteredData.map(item => {
        let value = 0;

        if (programme === 'all_programmes') {
          const relevantSubprogrammes = [
            'public_tax',
            'public_debt',
            'public_budget',
            'public_insurance',
            'private_pipelines',
            'private_impact',
            'private_environment',
            'frameworks',
            'biofin',
          ];

          value = relevantSubprogrammes.reduce(
            (sum, sub) => sum + (item[sub] || 0),
            0,
          );
        } else if (currentProgramme.subprogrammes) {
          value = currentProgramme.subprogrammes.reduce(
            (sum, sub) => sum + (item[sub.value] || 0),
            0,
          );
        } else {
          value = item[programme] || 0;
        }

        return {
          x: value,
          iso: item.iso,
          data: { country: item.country, ...item },
        };
      });
    },
    [filterData, selectedCheckboxes, currentProgramme],
  );

  useEffect(() => {
    console.log('Current Programme:', currentProgramme);
  }, [currentProgramme]);

  const filteredAndTransformedData = transformData(
    data,
    currentProgramme.value,
    selectedRadio,
  );

  useEffect(() => {
    console.log('Filtered and Transformed Data:', filteredAndTransformedData);
  }, [filteredAndTransformedData]);

  const filteredDataForCards = filterData(data, selectedRadio);

  const subcategoriesToShow = currentProgramme.subprogrammes || [];

  useEffect(() => {
    const subcategories = subcategoriesToShow.map(sub => sub.value);
    setSelectedCheckboxes(subcategories);
  }, [currentProgramme, subcategoriesToShow]);

  useEffect(() => {
    console.log('Filtered Data for Cards:', filteredDataForCards);
  }, [filteredDataForCards]);

  return (
    <div
      className='undp-container flex-div gap-00 flex-wrap flex-hor-align-center'
      style={{ border: '0.07rem solid var(--gray-400)', maxWidth: '1980px' }}
    >
      <Header onSegmentChange={handleSegmentChange} />
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
              className='settings-sections-options-container'
              style={{ display: filterExpanded ? 'flex' : 'none' }}
            >
              <FilterCountryGroup
                onRadioChange={handleRadioChange}
                selectedRadio={selectedRadio}
              />
            </div>
          </div>
          {subcategoriesToShow.length > 0 && (
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
                  Filter By Programmes
                </h6>
              </button>
              <div
                className='settings-sections-options-container'
                style={{ display: filterTwoExpanded ? 'flex' : 'none' }}
              >
                <CheckboxGroup
                  options={subcategoriesToShow.map(sub => ({
                    label: sub.short,
                    value: sub.value,
                  }))}
                  onChange={handleCheckboxChange}
                  value={selectedCheckboxes}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className='flex-div flex-column grow gap-00'
          style={{
            width: 'calc(80% - 54px)',
            backgroundColor: 'var(--gray-100)',
            overflow: 'hidden',
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
            onChange={value => setViewMode(value as string)}
            style={{
              margin: '0.5rem 0.5rem 0.5rem auto',
              width: 'fit-content',
            }}
          />
          {viewMode === 'Map' ? (
            <div className='flex-div flex-hor-align-center'>
              <ChoroplethMap
                data={filteredAndTransformedData}
                width={1000}
                height={600}
                scale={260}
                centerPoint={[480, 370]}
              />
            </div>
          ) : (
            <Cards
              data={filteredDataForCards}
              taxonomy={taxonomy}
              selectedCheckboxes={selectedCheckboxes.map(String)}
            />
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
