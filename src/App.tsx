/* eslint-disable react/jsx-key */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { Segmented, Radio } from 'antd';
import styled from 'styled-components';
import { Leaf, School, BriefcaseBusiness, Flag, Shell } from 'lucide-react';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';
import World from './Components/Graphs/Maps/MapData/worldMap.json';
import { ChoroplethMapDataType } from './Types';
import { FIELDS } from './Utils/constants';
import Table from './Components/Graphs/Table';

const StyledSpan = styled.span`
  position: relative;
  line-height: 1.5;
  border: 1px solid var(--gray-300);
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
  }
`;

const programmeOptions = [
  {
    label: 'All Sustainable Financial Programmes',
    value: 'public_finance_budget',
    color: '#006EB5',
    icon: Leaf,
  },
  {
    label: 'Public finance for the SDGs',
    value: 'public_finance_tax',
    color: '#5DD4F0',
    icon: School,
  },
  {
    label: 'Unlocking private capital and aligning for the SDGs',
    value: 'public_finance_debt',
    color: '#02A38A',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Integrated National Financing Frameworks',
    value: 'insurance_and_risk_finance',
    color: '#E78625',
    icon: Flag,
  },
  {
    label: 'Biofin',
    value: 'private_capital',
    color: '#E0529E',
    icon: Shell,
  },
];

const StyledSegmented = styled(Segmented)<{ selectedValue: string }>`
  background-color: white !important;
  display: flex;
  width: 100%;

  .ant-segmented-item {
    border-radius: 0px !important;
    width: 20%;
    background-color: var(--gray-200) !important;
    flex: 1;
    color: var(--gray-700);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 68px;
    &:hover {
      background-color: var(
        --gray-300
      ) !important; // Change hover background color
    }
    &:not(:last-child) {
      margin-right: 8px; // Add gap between items except the last one
    }
    .ant-segmented-item-label {
      white-space: normal;
      display: flex;
      gap: 16px;
      padding: 0 16px;
      align-items: center;
    }
    &.ant-segmented-item-selected {
      background-color: ${({ selectedValue }) => {
        const selectedOption = programmeOptions.find(
          option => option.value === selectedValue,
        );
        return selectedOption ? selectedOption.color : 'var(--blue-600)';
      }} !important; // Change selected item background color
      color: white !important; // Change text color for selected item
    }
  }
`;

const IconWrapper = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; // Adjust the size as needed
  height: 32px; // Adjust the size as needed
  border-radius: 100px;
  background-color: ${({ color }) => `${color}33`};
  color: ${({ color }) => color};
  margin-right: 8px; // Space between the icon and the label
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

  const handleChange = (value: SegmentedValue) => {
    setSelectedColumn(value);
  };

  const fragilityOptions = [
    { label: 'All Countries', value: 'All' },
    { label: 'Fragile and Crisis Affected', value: 'Fragile' },
    { label: 'LDC', value: 'LDC' },
    { label: 'SIDS', value: 'SIDS' },
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
  return (
    <div
      className='undp-container'
      style={{
        border: '1px solid var(--gray-300)',
      }}
    >
      <div
        className='flex-div padding-top-06 padding-left-06 padding-bottom-03 margin-00'
        style={{
          backgroundColor: 'var(--white)',
        }}
      >
        <div style={{ zIndex: '4', width: '100%' }}>
          <h2
            className='margin-00 undp-typograhy'
            style={{ color: 'var(--gray-700)', fontWeight: '600' }}
          >
            Sustainable Finance Hub{' '}
          </h2>
          <div
            className='padding-top-04 flex-div flex-row'
            style={{ marginLeft: '-4px', width: '100%' }}
          >
            <div style={{ flex: 1, marginRight: '10px' }}>
              <StyledSegmented
                options={programmeOptions.map(option => ({
                  label: (
                    <>
                      <IconWrapper color={option.color}>
                        <option.icon />
                      </IconWrapper>
                      <div
                        style={{
                          lineHeight: '1.2',
                          textAlign: 'left',
                        }}
                      >
                        {option.label}
                      </div>
                    </>
                  ),
                  value: option.value,
                }))}
                value={selectedColumn}
                onChange={handleChange}
                selectedValue={selectedColumn as string}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className='flex-div flex-wrap gap-00 padding-top-05 padding-bottom-05 margin-bottom-07 padding-right-05 padding-left-06'
        style={{
          backgroundColor: 'var(--white)',
        }}
      >
        <div
          className='flex-div flex-column'
          style={{
            width: 'calc(20% - 55px)',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <div
            style={{
              border: '1px solid var(--gray-300)',
            }}
          >
            <div className='padding-04'>
              <p className='undp-typography label'>Filter by country gropup</p>
              <Radio.Group
                onChange={e => setFilter(e.target.value)}
                value={filter}
                className='undp-radio'
              >
                {fragilityOptions.map(option => (
                  <div>
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
          </div>
          <div style={{ border: '1px solid var(--gray-300)' }}>
            <div
              className='no-hover'
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
              className='no-hover'
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
              className='no-hover'
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
        <div
          style={{
            flexGrow: 1,
            width: 'calc(80% - 44px)',
            minWidth: '30rem',
          }}
        >
          <ChoroplethMap
            data={filteredData.map(d => ({
              ...d,
              x: d[selectedColumn],
            }))}
            backgroundColor='var(--white)'
            centerPoint={[430, 360]}
            scale={250}
            height={600}
            // domain={[0, 1, 2, 3, 4]}
            tooltip={tooltip}
          />
        </div>
      </div>
      <Table data={filteredData} />
    </div>
  );
}

export default App;
