import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import Header from './Components/Header';
import FilterCountryGroup from './Components/Filter';
import { PROGRAMMES } from './Components/Constants';
import { ProgrammeProvider, useProgramme } from './Components/ProgrammeContext';
import CheckboxGroup from './Components/CheckboxGroup';
import { ChoroplethMapDataType } from './Types';
import Table from './Components/Table';
import Summary from './Components/Summary';

function AppContent() {
  const [data, setData] = useState<any[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>('allCountries');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const { currentProgramme, setCurrentProgramme } = useProgramme();
  useEffect(() => {
    csv(
      `https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv`,
    )
      .then((loadedData: any) => {
        setData(loadedData);
        console.log(loadedData);
      })
      .catch((err: any) => {
        console.error('Error loading the CSV file:', err);
      });
  }, []);

  useEffect(() => {
    if (currentProgramme.subcategories) {
      setSelectedCheckboxes(
        currentProgramme.subcategories.map(sub => sub.value),
      );
    }
  }, [currentProgramme]);

  const handleSegmentChange = (value: string | number) => {
    const programme = PROGRAMMES.find(p => p.value === value);
    if (programme) {
      setCurrentProgramme(programme);
      if (programme.subcategories) {
        setSelectedCheckboxes(programme.subcategories.map(sub => sub.value));
      } else {
        setSelectedCheckboxes([]);
      }
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
  };

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedCheckboxes(checkedValues);
  };

  const transformData = (
    rawData: any[],
    programme: string,
    countryGroup: string,
  ): ChoroplethMapDataType[] => {
    const filteredData = rawData.filter(item => {
      if (countryGroup === 'allCountries') return true;
      return item[countryGroup] === '1';
    });

    return filteredData.map(item => ({
      x: parseFloat(item[programme]), // Assuming the data in the programme column can be parsed as a number
      countryCode: item.iso,
      data: {
        country: item.country,
        programmeValue: item[programme],
      },
    }));
  };

  const calculateTotals = (rawData: any[], programmes: typeof PROGRAMMES) => {
    const totals: { [key: string]: { label: string; total: number } } = {};
    programmes.forEach(programme => {
      totals[programme.value] = {
        label: programme.short,
        total: rawData.reduce((sum, item) => {
          return sum + (item[programme.value] === '1' ? 1 : 0);
        }, 0),
      };
    });
    return totals;
  };

  const transformedData = transformData(
    data,
    currentProgramme.value,
    selectedRadio,
  );

  const programmeTotals = calculateTotals(data, PROGRAMMES);

  return (
    <div className='undp-container flex-div gap-06 flex-wrap flex-hor-align-center padding-04'>
      <Header onSegmentChange={handleSegmentChange} />
      <div className='flex-div flex-row' style={{ width: '100%' }}>
        <div
          className='flex-div flex-column flex-space-between gap-03 grow'
          style={{
            width: 'calc(20% - 54px)',
          }}
        >
          <FilterCountryGroup
            onRadioChange={handleRadioChange}
            selectedRadio={selectedRadio}
          />
          {currentProgramme?.subcategories && (
            <CheckboxGroup
              options={currentProgramme.subcategories.map(
                (sub: { label: any; value: any }) => ({
                  label: sub.label,
                  value: sub.value,
                }),
              )}
              onChange={handleCheckboxChange}
              value={selectedCheckboxes}
            />
          )}
          <Summary totals={programmeTotals} />
        </div>
        <div
          className='flex-div flex-column grow'
          style={{
            width: 'calc(80% - 54px)',
          }}
        >
          <ChoroplethMap
            data={transformedData}
            width={1000}
            height={550}
            scale={270}
            centerPoint={[470, 380]}
          />
        </div>
      </div>
      <Table data={transformedData} />
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
