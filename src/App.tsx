/* eslint-disable react/jsx-key */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { Segmented } from 'antd';
import styled from 'styled-components';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import World from './Components/Graphs/Maps/MapData/worldMap.json';
import { ChoroplethMapDataType } from './Types';
import { FIELDS } from './Utils/constants';
import Table from './Components/Graphs/Table';

const StyledSpan = styled.span`
  position: relative;
  line-height: 1.5;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background-color: var(--white);
  padding: 1px 12px 2px 12px;

  &::before {
    content: '';
    position: relative;
    display: inline-block;
    vertical-align: middle; // Vertically aligns the circle with the text
    margin-right: 2px; // Space between the circle and the text
    width: 10px;
    height: 10px;
    background-color: var(--blue-600);
    border-radius: 50%;
  }
`;

const StyledSegmented = styled(Segmented)`
  background-color: var(--gray-200) !important; // Change track background color

  .ant-segmented-item {
    &:hover {
      background-color: var(
        --gray-300
      ) !important; // Change hover background color
    }

    &.ant-segmented-item-selected {
      background-color: var(
        --blue-600
      ) !important; // Change selected item background color
      color: white; // Change text color for selected item
    }
  }
`;

interface ProgrammeDetail {
  column: string;
  note: string;
  key: string;
}

interface Counts {
  countriesTotal: number;
  countriesPublicTotal: number;
  countriesPublicBudget: number;
  countriesPublicTax: number;
  countriesPublicDebt: number;
  countriesPublicRisk: number;
  countriesPrivate: number;
  fragileTotal: number;
}

const initialState: Counts = {
  countriesTotal: 0,
  countriesPublicTotal: 0,
  countriesPublicBudget: 0,
  countriesPublicTax: 0,
  countriesPublicDebt: 0,
  countriesPublicRisk: 0,
  countriesPrivate: 0,
  fragileTotal: 0,
};

interface ColumnDescription {
  [key: string]: {
    text: string;
    count: number;
  };
}

type SegmentedValue = string | number;

function App() {
  const [data, setData] = useState<ChoroplethMapDataType[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<SegmentedValue>(
    'public_finance_budget',
  );
  const [filter, setFilter] = useState<SegmentedValue>('All');
  const [counts, setCounts] = useState<Counts>(initialState);

  useEffect(() => {
    csv(
      `https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv`,
    )
      .then((loadedData: any[]) => {
        const countryFlagsAny = new Set();
        const countryFlagsFinance = new Set();
        const fragileCountries = new Set();
        const newCounts = { ...initialState };

        const transformedData = loadedData.map(d => {
          const budget = +d.public_finance_budget;
          const tax = +d.public_finance_tax;
          const debt = +d.public_finance_debt;
          const insurance = +d.insurance_and_risk_finance;
          const capital = +d.private_capital;
          const programmes: ProgrammeDetail[] = [];

          FIELDS.forEach(field => {
            if (+d[field.key] === 1) {
              // Ensure the value is treated as a number
              programmes.push({
                key: field.key,
                column: field.label,
                note: d[field.noteKey],
              });
            }
          });

          const isFragile =
            !!d.WB_Fragile_and_Crisis_Affected_Countries ||
            !!d.crisis_level ||
            !!d.OECD_Multidimensional_Fragility_Framework;

          if (isFragile) {
            fragileCountries.add(d['Country ISO code']);
          }

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
            programmes,
            isFragile,
          };
        });

        setData(transformedData);
        newCounts.countriesTotal = countryFlagsAny.size;
        newCounts.fragileTotal = fragileCountries.size;
        newCounts.countriesPublicTotal = countryFlagsFinance.size;
        setCounts(newCounts);
      })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error('Error loading the CSV file:', err);
      });
  }, [selectedColumn]);

  const handleSelectColumn = (value: any) => {
    setSelectedColumn(value);
  };

  const handleFilterChange = (value: any) => {
    setFilter(value);
  };

  const programmeOptions = [
    { label: 'Budgeting', value: 'public_finance_budget' },
    { label: 'Taxation', value: 'public_finance_tax' },
    { label: 'Debt', value: 'public_finance_debt' },
    {
      label: 'Insurance and risk',
      value: 'insurance_and_risk_finance',
    },
    { label: 'Private Capital', value: 'private_capital' },
  ];

  const fragilityOptions = [
    { label: 'All Countries', value: 'All' },
    { label: 'Fragile and Crisis Affected', value: 'Fragile' },
  ];

  const tooltip = (d: any) => {
    return (
      <div>
        {d.programmes.length > 0 && (
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
                <div className='flex-div flex-column  margin-bottom-00'>
                  <div
                    style={{ width: '100%' }}
                    className='flex-div flex-column margin-00 gap-03'
                  >
                    <p className='undp-typography margin-bottom-00 bold label padding-bottom-00'>
                      Available programmes
                    </p>
                    {d.programmes.map((p: any) => (
                      <p
                        key={p.column}
                        className='undp-typography margin-bottom-00 padding-bottom-00 label'
                      >
                        • {p.column}{' '}
                        {p.key === selectedColumn && p.note ? '*' : ''}
                      </p>
                    ))}
                  </div>
                  {d.programmes.some(
                    (p: any) => p.key === selectedColumn && p.note,
                  ) && (
                    <div
                      style={{
                        borderTop: '1px var(--gray-400) solid',
                        paddingTop: '1rem',
                      }}
                    >
                      {d.programmes
                        .filter((p: any) => p.key === selectedColumn && p.note)
                        .map((p: any) => (
                          <p
                            key={p.key}
                            style={{
                              color: '#757575',
                              textWrap: 'wrap',
                              textAlign: 'left',
                              width: '100%',
                              overflowWrap: 'break-word',
                            }}
                            className='undp-typography margin-bottom-00 italics padding-bottom-00 label'
                          >
                            * {p.note}
                          </p>
                        ))}
                    </div>
                  )}
                  {/* Access Fragility Columns Directly */}
                  {(d.WB_Fragile_and_Crisis_Affected_Countries ||
                    d.crisis_level ||
                    d.OECD_Multidimensional_Fragility_Framework) && (
                    <div
                      style={{
                        borderTop: '1px var(--gray-400) solid',
                        paddingTop: '1rem',
                      }}
                    >
                      <p className='undp-typography margin-bottom-00 bold label padding-bottom-00'>
                        Fragility Information:
                      </p>
                      {d.OECD_Multidimensional_Fragility_Framework && (
                        <p className='undp-typography margin-bottom-00 label'>
                          • OECD Multidimensional Fragility Framework :{' '}
                          {d.OECD_Multidimensional_Fragility_Framework}
                        </p>
                      )}
                      {d.WB_Fragile_and_Crisis_Affected_Countries && (
                        <p className='undp-typography margin-bottom-00 label'>
                          • World Bank Fragile and Crisis Affected Countries :{' '}
                          {d.WB_Fragile_and_Crisis_Affected_Countries}
                        </p>
                      )}
                      {d.crisis_level && (
                        <p className='undp-typography margin-bottom-00 label'>
                          • Crisis Level: {d.crisis_level}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const columnDescriptions: ColumnDescription = {
    public_finance_budget: {
      text: 'budgeting',
      count: counts.countriesPublicBudget,
    },
    public_finance_tax: {
      text: 'taxation',
      count: counts.countriesPublicTax,
    },
    public_finance_debt: {
      text: 'debt',
      count: counts.countriesPublicDebt,
    },
    insurance_and_risk_finance: {
      text: 'insurance and risk',
      count: counts.countriesPublicRisk,
    },
    private_capital: {
      text: 'private capital',
      count: counts.countriesPrivate,
    },
  };

  const filteredData =
    filter === 'Fragile' ? data.filter(d => d.isFragile) : data;
  console.log(filteredData);
  return (
    <div className='undp-container'>
      <div
        className='flex-div padding-top-06 padding-left-06 padding-bottom-03 margin-00'
        style={{
          backgroundColor: 'var(--gray-300)',
        }}
      >
        <div style={{ zIndex: '4', width: '100%' }}>
          <h2 className='margin-00' style={{ color: 'var(--gray-700)' }}>
            Sustainable Finance Hub Dashboard{' '}
          </h2>
          <div
            className='padding-top-04'
            style={{ marginLeft: '-4px', width: '100%' }}
          >
            <p className='undp-typography label margin-bottom-02 margin-left-02'>
              Countries with programmes related to
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div style={{ flex: 1, marginRight: '10px' }}>
                <StyledSegmented
                  className='undp-segmented-small'
                  onChange={handleSelectColumn}
                  options={programmeOptions}
                />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <StyledSegmented
                  className='undp-segmented-small'
                  onChange={handleFilterChange}
                  options={fragilityOptions}
                  value={filter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className='flex-div flex-wrap gap-00 padding-top-05 padding-bottom-05 margin-bottom-07 padding-right-05'
        style={{
          backgroundColor: 'var(--gray-300)',
        }}
      >
        <div
          style={{
            flexGrow: 1,
            width: 'calc(100% - 340px)',
            minWidth: '30rem',
          }}
        >
          <ChoroplethMap
            data={filteredData.map(d => ({
              ...d,
              x: d[selectedColumn],
            }))}
            backgroundColor='var(--gray-300)'
            centerPoint={[430, 360]}
            scale={240}
            height={600}
            // domain={[0, 1, 2, 3, 4]}
            tooltip={tooltip}
          />
        </div>
        <div
          className='flex-div flex-column'
          style={{ width: '340px', flexDirection: 'column', flexGrow: 1 }}
        >
          <div
            className='stat-card no-hover'
            style={{
              flexBasis: '0',
            }}
          >
            <h3 style={{ margin: '0' }}> {counts.countriesTotal}</h3>
            <p
              style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                lineHeight: '1.3',
              }}
            >
              countries with sustainable
              <br />
              finance programming <b>in total</b>
            </p>
          </div>
          <div
            className='stat-card no-hover'
            style={{
              flexBasis: '0',
            }}
          >
            <h3 style={{ margin: '0' }}>
              {columnDescriptions[selectedColumn].count}
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                lineHeight: '1.3',
              }}
            >
              countries with programmes
              <br />
              related to{' '}
              <StyledSpan>
                {' '}
                <b>{columnDescriptions[selectedColumn].text}</b>
              </StyledSpan>
            </p>
          </div>
          <div
            className='stat-card no-hover'
            style={{
              flexBasis: '0',
            }}
          >
            <h3 style={{ margin: '0' }}>XX</h3>
            <p
              style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                lineHeight: '1.3',
              }}
            >
              any additional number
              <br />
              can be placed here
            </p>
          </div>
        </div>
      </div>
      <Table data={filteredData} />
    </div>
  );
}

export default App;
