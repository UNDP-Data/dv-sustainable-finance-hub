/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import World from './Components/Graphs/Maps/MapData/worldMap.json';
import { ChoroplethMapDataType } from './Types';

interface Counts {
  countriesTotal: number;
  countriesPublicTotal: number;
  countriesPublicBudget: number;
  countriesPublicTax: number;
  countriesPublicDebt: number;
  countriesPublicRisk: number;
  countriesPrivate: number;
}

const initialState: Counts = {
  countriesTotal: 0,
  countriesPublicTotal: 0,
  countriesPublicBudget: 0,
  countriesPublicTax: 0,
  countriesPublicDebt: 0,
  countriesPublicRisk: 0,
  countriesPrivate: 0,
};

function App() {
  const [data, setData] = useState<ChoroplethMapDataType[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>(
    'public_finance_budget',
  );
  const [counts, setCounts] = useState<Counts>(initialState);

  useEffect(() => {
    csv(
      `https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv`,
    )
      .then((loadedData: any[]) => {
        const countryFlagsAny = new Set();
        const countryFlagsFinance = new Set();
        const newCounts = { ...initialState };

        const transformedData = loadedData.map(d => {
          const budget = +d.public_finance_budget;
          const tax = +d.public_finance_tax;
          const debt = +d.public_finance_debt;
          const insurance = +d.insurance_and_risk_finance;
          const capital = +d.private_capital;

          if (budget === 1) {
            newCounts.countriesPublicBudget++;
            countryFlagsFinance.add(d['Country ISO code']);
          }
          if (tax === 1) {
            newCounts.countriesPublicTax++;
            countryFlagsFinance.add(d['Country ISO code']);
          }
          if (debt === 1) {
            newCounts.countriesPublicDebt++;
            countryFlagsFinance.add(d['Country ISO code']);
          }
          if (insurance === 1) {
            newCounts.countriesPublicRisk++;
            countryFlagsFinance.add(d['Country ISO code']);
          }
          if (capital === 1) {
            newCounts.countriesPrivate++;
            countryFlagsAny.add(d['Country ISO code']);
          }

          // Check for any true across all columns
          if (
            budget === 1 ||
            tax === 1 ||
            debt === 1 ||
            insurance === 1 ||
            capital === 1
          ) {
            countryFlagsAny.add(d['Country ISO code']);
          }

          const countryInfo = World.features.find(
            feature => feature.properties.ISO3 === d['Country ISO code'],
          );

          return {
            ...d,
            countryCode: d['Country ISO code'],
            countryName: countryInfo ? countryInfo.properties.NAME : 'Unknown', // Fallback to 'Unknown' if not found
            x: +d[selectedColumn],
          };
        });

        setData(transformedData);
        newCounts.countriesTotal = countryFlagsAny.size;
        newCounts.countriesPublicTotal = countryFlagsFinance.size;
        setCounts(newCounts);
      })
      .catch((err: any) => {
        console.error('Error loading the CSV file:', err);
      });
  }, [selectedColumn]);

  const handleSelectColumn = (column: string) => {
    setSelectedColumn(column);
  };

  const tooltip = (d: any) => {
    let note = '';
    switch (selectedColumn) {
      case 'public_finance_budget':
        note = d.public_finance_budget_note;
        break;
      case 'public_finance_tax':
        note = d.public_finance_tax_note;
        break;
      case 'public_finance_debt':
        note = d.public_finance_debt_note;
        break;
      case 'insurance_and_risk_finance':
        note = d.insurance_and_risk_finance_note;
        break;
      case 'private_capital':
        note = d.private_capital_note;
        break;
      default:
        note = '';
    }

    return (
      <div>
        {d.x === '1' ? (
          <>
            <div
              style={{
                borderBottom: '1px solid #D4D6D8',
                padding: '1rem 1.5rem 1rem 1.5rem',
              }}
            >
              <h6 className='undp-typography margin-bottom-00'>
                {d.countryName}
              </h6>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
              <div key={d.countryCode}>
                <div className='flex-div flex-column gap-02 flex-vert-align-center margin-bottom-00'>
                  <div
                    style={{ width: '100%' }}
                    className='flex-div flex-row flex-space-between'
                  >
                    <p
                      className='undp-typography margin-bottom-00'
                      style={{ fontSize: '1rem', padding: 0, margin: 0 }}
                    >
                      {note}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className='undp-container flex-div flex-wrap flex-hor-align-center margin-bottom-13'>
      <div className='flex-div grow'>
        <div
          className='stat-card no-hover'
          style={{ width: '100%', border: '1px solid rgba(5, 5, 5, 0.06)' }}
        >
          <h3 style={{ margin: '0' }}> {counts.countriesTotal}</h3>
          <h4 style={{ marginBottom: '0.5rem' }}>Countries</h4>
          <p style={{ marginBottom: '0.5rem' }}>
            with sustainable finance programming in total
          </p>
        </div>
        <div
          className='stat-card no-hover'
          style={{ width: '100%', border: '1px solid rgba(5, 5, 5, 0.06)' }}
        >
          <h3 style={{ margin: '0' }}> {counts.countriesPublicTotal}</h3>
          <h4 style={{ marginBottom: '0.5rem' }}>Countries</h4>
          <p style={{ marginBottom: '0.5rem' }}>
            with public finance programming
          </p>
        </div>
        <div
          className='stat-card no-hover'
          style={{ width: '100%', border: '1px solid rgba(5, 5, 5, 0.06)' }}
        >
          <h3 style={{ margin: '0' }}> {counts.countriesPrivate}</h3>
          <h4 style={{ marginBottom: '0.5rem' }}>Countries</h4>
          <p style={{ marginBottom: '0.5rem' }}>
            with private capital programming
          </p>
        </div>
        {/* <div>Public finance budget count: {counts.countriesPublicBudget} {counts.countriesPublicBudget}</div>
        <div>Public finance tax count: {counts.countriesPublicTax}</div>
        <div>Public finance debt count: {counts.countriesPublicDebt}</div>
        <div>
          Insurance and risk finance count: {counts.countriesPublicRisk}
        </div> */}
      </div>
      <ChoroplethMap
        data={data}
        selectedColumn={selectedColumn}
        backgroundColor
        onSelectColumn={handleSelectColumn}
        centerPoint={[470, 370]}
        scale={270}
        height={600}
        source='Organization ABC'
        sourceLink='www.example.com'
        // domain={[0, 1, 2, 3, 4]}
        tooltip={tooltip}
      />
    </div>
  );
}

export default App;
