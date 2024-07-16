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
import { GROUPS, PROGRAMMES } from './Components/Constants';
import { ProgrammeProvider, useProgramme } from './Components/ProgrammeContext';
import CheckboxGroup from './Components/CheckboxGroup';
import Cards from './Components/Cards';
import { tooltip } from './Components/Tooltip';
import { filterProgrammes } from './Utils/filterProgrammes';

function AppContent() {
  const [data, setData] = useState<any[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>('all');
  const {
    currentProgramme,
    setCurrentProgramme,
    selectedCheckboxes,
    setSelectedCheckboxes,
  } = useProgramme();
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

        const countryMapping = countryTaxonomy.reduce(
          (acc: any, country: any) => {
            acc[country['Alpha-3 code']] = country['Country or Area'];
            return acc;
          },
          {},
        );

        // Add sids, ldc, public, and private columns
        const transformedData = loadedData.map((item: any) => {
          return {
            ...item,
            country: countryMapping[item.iso] || item.country,
            sids: sids.includes(item.iso) ? '1' : '',
            ldc: ldc.includes(item.iso) ? '1' : '',
            all: [
              'public_tax',
              'public_budget',
              'public_debt',
              'public_insurance',
              'public_tax',
              'public_budget',
              'public_debt',
              'public_insurance',
              'biofin',
              'frameworks',
            ].some(key => item[key] === '1')
              ? '1'
              : '',
            public: [
              'public_tax',
              'public_budget',
              'public_debt',
              'public_insurance',
            ].some(key => item[key] === '1')
              ? '1'
              : '',
            private: [
              'private_pipelines',
              'private_impact',
              'private_environment',
            ].some(key => item[key] === '1')
              ? '1'
              : '',
          };
        });

        setData(transformedData);
      });
  }, []);

  const handleSegmentChange = useCallback(
    (value: string | number) => {
      const programme = PROGRAMMES.find(p => p.value === value);

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
    [setSelectedCheckboxes],
  );

  const filterData = useCallback(
    (rawData: any[], programmes: string | string[]) => {
      // Ensure programmes is always an array
      const programmesArray = Array.isArray(programmes)
        ? programmes
        : [programmes];

      return rawData.map(item => {
        // Check if any of the programme columns match '1' or have a value greater than 0
        const isFiltered = programmesArray.some(
          programme => item[programme] === '1' || item[programme] > 0,
        );

        return {
          ...item,
          filtered: isFiltered ? '1' : '0',
        };
      });
    },
    [],
  );

  const filteredByCountryGroup = filterData(data, selectedRadio);

  const filteredByCurrentProgramme = filterData(
    filteredByCountryGroup,
    currentProgramme.value,
  );

  const filteredByProgramme = filterData(
    filteredByCurrentProgramme,
    selectedCheckboxes,
  );

  console.log(selectedCheckboxes, filteredByProgramme);

  const relevantProgrammes = filterProgrammes(currentProgramme.value);

  // calculate counts
  const calculateCounts = (
    datum: any[],
    relevantProg: { value: string; short: string; color: string }[],
  ) => {
    const counts: {
      countryGroups: {
        all: number;
        sids: number;
        ldc: number;
        fragile: number;
      };
      programmes: Record<string, number>;
    } = {
      countryGroups: {
        all: 0,
        sids: 0,
        ldc: 0,
        fragile: 0,
      },
      programmes: {},
    };

    // Initialize counts.programmes based on relevantProgrammes
    relevantProg.forEach(prog => {
      counts.programmes[prog.value] = 0;
    });

    datum.forEach(item => {
      if (item.filtered === '1') {
        // Count country groups
        counts.countryGroups.all += 1;
        if (item.sids === '1') counts.countryGroups.sids += 1;
        if (item.ldc === '1') counts.countryGroups.ldc += 1;
        if (item.fragile === '1') counts.countryGroups.fragile += 1;

        // Count relevant programmes
        relevantProg.forEach(prog => {
          if (item[prog.value] === '1') {
            counts.programmes[prog.value] += 1;
          }
        });
      }
    });

    return counts;
  };

  const counts = calculateCounts(
    filteredByCurrentProgramme,
    relevantProgrammes,
  );

  const transformCounts = (countsData: any) => {
    const programmeOptions = relevantProgrammes.map(programme => ({
      label: programme.label,
      short: programme.short,
      value: programme.value,
      count: countsData.programmes[programme.value],
    }));

    const countryGroupOptions = GROUPS.map(group => ({
      label: group.label,
      value: group.value,
      count: countsData.countryGroups[group.value] || 0,
    }));

    return { programmeOptions, countryGroupOptions };
  };

  const transformedCounts = transformCounts(counts);

  const transformData = useCallback(
    (filteredData: any[]) => {
      return filteredData.map(item => {
        return {
          x: item[currentProgramme.value],
          iso: item.iso,
          filtered: item.filtered,
        };
      });
    },
    [currentProgramme.value],
  );

  const transformedData = transformData(filteredByProgramme);
  console.log(transformedData);
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
                groups={transformedCounts.countryGroupOptions}
              />
            </div>
          </div>
          {currentProgramme.value !== 'biofin' &&
            currentProgramme.value !== 'frameworks' && (
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
                  className='settings-sections-options-container'
                  style={{ display: filterTwoExpanded ? 'flex' : 'none' }}
                >
                  <CheckboxGroup
                    options={transformedCounts.programmeOptions}
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
                data={transformedData}
                width={1000}
                height={600}
                scale={250}
                centerPoint={[450, 370]}
                tooltip={tooltip}
              />
            </div>
          ) : (
            <Cards data={data} relevantProgrammes={relevantProgrammes} />
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
