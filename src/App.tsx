/* eslint-disable react/jsx-key */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { Radio } from 'antd';
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

interface ColumnDescription {
  [key: string]: {
    text: string;
    count: number;
  };
}

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
                <div className='flex-div flex-column flex-vert-align-center margin-bottom-00'>
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
                            style={{ color: '#757575' }}
                            className='undp-typography margin-bottom-00 italics padding-bottom-00 label'
                          >
                            * {p.note}
                          </p>
                        ))}
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

  return (
    <div className='undp-container flex-div flex-column flex-wrap flex-hor-align-center'>
      <div
        className='flex-div flex-column gap-02 padding-07'
        style={{
          backgroundColor: 'var(--gray-300)',
          padding: '1rem',
        }}
      >
        <h6
          style={{
            fontSize: '0.75rem',
            marginTop: '0',
            letterSpacing: '.48px',
            fontWeight: '700',
          }}
        >
          DASHBOARD
        </h6>
        <h2
          className='undp-typography'
          style={{
            fontFamily: 'var(--fontFamilyHeadings) !important',
            textTransform: 'uppercase',
            color: 'var(--gray-700)',
            marginBottom: '0.5rem',
          }}
        >
          Sustainable Finance Programmes
        </h2>

        <p style={{ margin: '0' }} className='undp-typography label'>
          Programme areas
        </p>
        <Radio.Group
          defaultValue='public_finance_budget'
          size='small'
          className='undp-button-radio'
          buttonStyle='solid'
          onChange={e => {
            // eslint-disable-next-line no-console
            handleSelectColumn(e.target.value);
          }}
        >
          <Radio.Button value='public_finance_budget'>Budgeting</Radio.Button>
          <Radio.Button value='public_finance_tax'>Taxation</Radio.Button>
          <Radio.Button value='public_finance_debt'>Debt</Radio.Button>
          <Radio.Button value='insurance_and_risk_finance'>
            Insurance and risk finance
          </Radio.Button>
          <Radio.Button value='private_capital'>Private Capital</Radio.Button>
        </Radio.Group>
      </div>
      <div className='flex-div flex-wrap'>
        <div className='flex-div' style={{ flexGrow: 2 }}>
          <ChoroplethMap
            data={data.map(d => ({
              ...d,
              x: d[selectedColumn],
            }))}
            backgroundColor
            centerPoint={[470, 370]}
            scale={270}
            // domain={[0, 1, 2, 3, 4]}
            tooltip={tooltip}
          />
        </div>
        <div
          className='flex-div flex-column'
          style={{ flexGrow: 1, minWidth: '370px' }}
        >
          <div
            className='stat-card no-hover'
            style={{
              backgroundColor: 'var(--gray-100)',
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
              finance programming <b>in total</b>
            </p>
          </div>
          <div
            className='stat-card no-hover'
            style={{
              backgroundColor: 'var(--gray-100)',
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
              backgroundColor: 'var(--gray-100)',
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
      <Table data={data} />
    </div>
  );
}

export default App;
