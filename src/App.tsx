import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import Header from './Components/Header';
import FilterCountryGroup from './Components/Filter';
import { PROGRAMMES, SPECIFIED_PROGRAMMES } from './Components/Constants';
import { ProgrammeProvider, useProgramme } from './Components/ProgrammeContext';
import CheckboxGroup from './Components/CheckboxGroup';
import { ChoroplethMapDataType } from './Types';
import Cards from './Components/Cards';
import Summary from './Components/Summary';

function AppContent() {
  const [data, setData] = useState<any[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>('allCountries');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    CheckboxValueType[]
  >([]);
  const { currentProgramme, setCurrentProgramme } = useProgramme();
  const [programmeTotals, setProgrammeTotals] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    csv(
      `https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv`,
    )
      .then((loadedData: any) => {
        // Transform the loaded data
        const transformedData = loadedData.map((item: any) => {
          const allProgrammesSum = SPECIFIED_PROGRAMMES.reduce(
            (sum, program) => {
              return sum + (parseInt(item[program.value], 10) || 0);
            },
            0,
          );

          const publicFinanceSum = [
            'public_tax',
            'public_debt',
            'public_budget',
            'public_insurance',
          ].reduce((sum, key) => sum + (parseInt(item[key], 10) || 0), 0);

          const privateCapitalSum = [
            'private_pipelines',
            'private_impact',
            'private_environment',
          ].reduce((sum, key) => sum + (parseInt(item[key], 10) || 0), 0);

          return {
            ...item,
            all_programmes: allProgrammesSum,
            public: publicFinanceSum,
            private: privateCapitalSum,
          };
        });
        setData(transformedData);

        // Calculate totals for each programme
        const totals = {
          all_programmes: transformedData.reduce(
            (sum: number, item: { all_programmes: string }) =>
              sum + (parseInt(item.all_programmes, 10) || 0),
            0,
          ),
          public: transformedData.reduce(
            (sum: number, item: { public: string }) =>
              sum + (parseInt(item.public, 10) || 0),
            0,
          ),
          private: transformedData.reduce(
            (sum: number, item: { private: string }) =>
              sum + (parseInt(item.private, 10) || 0),
            0,
          ),
          frameworks: transformedData.reduce(
            (sum: number, item: { frameworks: string }) =>
              sum + (parseInt(item.frameworks, 10) || 0),
            0,
          ),
          biofin: transformedData.reduce(
            (sum: number, item: { biofin: string }) =>
              sum + (parseInt(item.biofin, 10) || 0),
            0,
          ),
          public_budget: transformedData.reduce(
            (sum: number, item: { public_budget: string }) =>
              sum + (parseInt(item.public_budget, 10) || 0),
            0,
          ),
          public_tax: transformedData.reduce(
            (sum: number, item: { public_tax: string }) =>
              sum + (parseInt(item.public_tax, 10) || 0),
            0,
          ),
          public_debt: transformedData.reduce(
            (sum: number, item: { public_debt: string }) =>
              sum + (parseInt(item.public_debt, 10) || 0),
            0,
          ),
          public_insurance: transformedData.reduce(
            (sum: number, item: { public_insurance: string }) =>
              sum + (parseInt(item.public_insurance, 10) || 0),
            0,
          ),
          private_pipelines: transformedData.reduce(
            (sum: number, item: { private_pipelines: string }) =>
              sum + (parseInt(item.private_pipelines, 10) || 0),
            0,
          ),
          private_impact: transformedData.reduce(
            (sum: number, item: { private_impact: string }) =>
              sum + (parseInt(item.private_impact, 10) || 0),
            0,
          ),
          private_environment: transformedData.reduce(
            (sum: number, item: { private_environment: string }) =>
              sum + (parseInt(item.private_environment, 10) || 0),
            0,
          ),
        };

        setProgrammeTotals(totals);
      })
      .catch((err: any) => {
        console.error('Error loading the CSV file:', err);
      });
  }, []);

  const handleSegmentChange = (value: string | number) => {
    const programme = PROGRAMMES.find(p => p.value === value);
    if (programme) {
      setCurrentProgramme(programme);
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
  };

  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
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
      x: parseFloat(item[programme]),
      countryCode: item.iso,
      data: {
        country: item.country,
        ...item,
      },
    }));
  };

  const transformedData = transformData(
    data,
    currentProgramme.value,
    selectedRadio,
  );

  let subcategoriesToShow: { label: string; value: string }[] = [];
  if (currentProgramme.value === 'public') {
    subcategoriesToShow = SPECIFIED_PROGRAMMES.filter(program =>
      [
        'public_budget',
        'public_tax',
        'public_debt',
        'public_insurance',
      ].includes(program.value),
    ).map(program => ({ label: program.label, value: program.value }));
  } else if (currentProgramme.value === 'private') {
    subcategoriesToShow = SPECIFIED_PROGRAMMES.filter(program =>
      ['private_pipelines', 'private_impact', 'private_environment'].includes(
        program.value,
      ),
    ).map(program => ({ label: program.label, value: program.value }));
  }
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
          <div className='flex-div flex-column gap-03'>
            <FilterCountryGroup
              onRadioChange={handleRadioChange}
              selectedRadio={selectedRadio}
            />
            {subcategoriesToShow.length > 0 && (
              <CheckboxGroup
                options={subcategoriesToShow.map(sub => ({
                  label: sub.label,
                  value: sub.value,
                }))}
                onChange={handleCheckboxChange}
                value={selectedCheckboxes}
              />
            )}
          </div>
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
      <Cards data={data} programmes={SPECIFIED_PROGRAMMES} />
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
