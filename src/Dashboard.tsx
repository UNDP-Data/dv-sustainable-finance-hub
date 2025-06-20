import '@undp/data-viz/style.css';
import '@undp/design-system-react/style.css';
import { useEffect, useRef, useState } from 'react';
import {
  H2,
  P,
  DropdownSelect,
  RadioGroup,
  RadioGroupItem,
  H6,
  SegmentedControl,
} from '@undp/design-system-react';
import {
  StatCardFromData,
  transformDataForGraph,
  ChoroplethMap,
  DataCards,
} from '@undp/data-viz';
import { Globe, LayoutGrid } from 'lucide-react';

import { DataType } from './types';
import { VALUES, TITLES } from './constants';
import ModalContent from './Modal';

type OptionType = { label: string; value: string };

interface Props {
  data: DataType[];
}

function Dashboard(props: Props) {
  const { data } = props;
  const [filteredData, setFilteredData] = useState(data);
  const [selectedService, setSelectedService] = useState<OptionType | null>(
    null,
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<OptionType | null>(null);
  const [selectedWorkArea, setSelectedWorkArea] = useState<OptionType | null>(
    null,
  );
  const [selectedCountryCategory, setSelectedCountryCategory] =
    useState<string>('all');
  const [viewMode, setViewMode] = useState<string>('Map');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dataFilteredByCountryCategory = data.filter(d =>
      d.country_categories.includes(selectedCountryCategory),
    );
    const dataFilteredByServiceCategory = selectedSubcategory
      ? dataFilteredByCountryCategory.filter(d =>
          d.service_categories.includes(selectedSubcategory.value),
        )
      : selectedService
        ? dataFilteredByCountryCategory.filter(d =>
            d.service_categories.includes(selectedService.value),
          )
        : dataFilteredByCountryCategory;
    const dataFilteredByWorkArea = selectedWorkArea
      ? dataFilteredByServiceCategory.filter(d =>
          d.service_categories.includes(selectedWorkArea.value),
        )
      : dataFilteredByServiceCategory;
    setFilteredData(dataFilteredByWorkArea);
  }, [
    data,
    selectedCountryCategory,
    selectedService,
    selectedSubcategory,
    selectedWorkArea,
  ]);

  return (
    <div>
      <div className='max-w-[1980px]'>
        <div className='p-5 m-5' ref={containerRef}>
          <H2>UNDP’s Work on Sustainable Finance</H2>
          <div className='mt-8'>
            <div className='mb-4 mt-4'>
              <div className='stat-container'>
                {VALUES.map((value, index) => (
                  <div
                    key={index}
                    style={{ display: 'flex', alignItems: 'stretch' }}
                  >
                    <StatCardFromData
                      data={transformDataForGraph(data, 'statCard', [
                        {
                          chartConfigId: 'value',
                          columnId: `${value}`,
                        },
                      ])}
                      backgroundColor
                      graphTitle={TITLES[index]}
                      graphDescription='Number of countries'
                      aggregationMethod='sum'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            id='vizArea'
            className='w-full border-primary-gray-300 border-2 inline-flex'
          >
            {/* Left Sidebar */}
            <div className='flex flex-col gap-4 border-r-2 border-primary-gray-300 p-4 max-w-[360px]'>
              <div id='selectService'>
                <P size='sm' marginBottom='2xs'>
                  Filter by service
                </P>
                <DropdownSelect
                  onChange={value => {
                    setSelectedService(value as OptionType);
                    setSelectedSubcategory(null);
                  }}
                  value={selectedService}
                  isClearable
                  variant='light'
                  options={[
                    {
                      label: 'Public Finance for the SDGs',
                      value: 'public',
                    },
                    {
                      label: 'Private Finance for the SDGs',
                      value: 'private',
                    },
                    {
                      label: 'Integrated National Financing Frameworks',
                      value: 'inff',
                    },
                  ]}
                />
              </div>
              {selectedService?.value === 'public' ||
              selectedService?.value === 'private' ? (
                <div id='selectSubcategory'>
                  <P size='sm' marginBottom='2xs'>
                    Select subcategory
                  </P>
                  {selectedService?.value === 'public' && (
                    <DropdownSelect
                      isClearable
                      onChange={value =>
                        setSelectedSubcategory(value as OptionType)
                      }
                      value={selectedSubcategory}
                      variant='light'
                      options={[
                        {
                          label: 'Tax for the SDGs',
                          value: 'public_tax',
                        },
                        {
                          label: 'Debt for the SDGs',
                          value: 'public_debt',
                        },
                        {
                          label: 'Budget for the SDGs',
                          value: 'public_budget',
                        },
                        {
                          label: 'Insurance and risk finance',
                          value: 'public_insurance',
                        },
                      ]}
                    />
                  )}
                  {selectedService?.value === 'private' && (
                    <DropdownSelect
                      onChange={value =>
                        setSelectedSubcategory(value as OptionType)
                      }
                      value={selectedSubcategory}
                      options={[
                        {
                          label: 'Originating pipelines',
                          value: 'private_pipelines',
                        },
                        {
                          label: 'Managing for impact',
                          value: 'private_impact',
                        },
                        {
                          label: 'Enabling environment',
                          value: 'private_environment',
                        },
                      ]}
                    />
                  )}
                </div>
              ) : null}
              <div id='selectWorkArea'>
                <P size='sm' marginBottom='2xs'>
                  Filter by work area
                </P>
                <DropdownSelect
                  onChange={value => setSelectedWorkArea(value as OptionType)}
                  value={selectedWorkArea}
                  variant='light'
                  isClearable
                  options={[
                    {
                      label: 'Biodiversity finance',
                      value: 'biofin',
                    },
                  ]}
                />
              </div>
              <div id='selectCountryGroup'>
                <P className='m-0 pb-2' size='sm'>
                  Filter by country group
                </P>
                <RadioGroup
                  value={selectedCountryCategory}
                  onValueChange={value => setSelectedCountryCategory(value)}
                  variant='normal'
                >
                  <RadioGroupItem label='All countries' value='all' />
                  <RadioGroupItem label='SIDS' value='SIDS' />
                  <RadioGroupItem label='LDCs' value='LDC' />
                  <RadioGroupItem
                    label='Fragile and conflict-affected'
                    value='fragile'
                  />
                </RadioGroup>
              </div>
            </div>

            {/* Right Content Area */}
            <div className='w-full relative justify-center min-h-[70vh] bg-primary-gray-200'>
              <div className='w-full flex flex-row align-center justify-between p-4'>
                <H6 className='mb-2 text-sm'>
                  {filteredData.length} countries in total
                </H6>
                <SegmentedControl
                  value={viewMode}
                  size='sm'
                  color='black'
                  onValueChange={value => {
                    setViewMode(value);
                  }}
                  options={[
                    {
                      label: (
                        <div className='flex gap-2 h-fit items-center'>
                          <div className='h-fit'>
                            <Globe size={16} strokeWidth={1.5} />
                          </div>
                          <P marginBottom='none' size='sm'>
                            Map
                          </P>
                        </div>
                      ),
                      value: 'Map',
                    },
                    {
                      label: (
                        <div className='flex gap-2 h-fit items-center'>
                          <div className='h-fit'>
                            <LayoutGrid size={16} strokeWidth={1.5} />
                          </div>
                          <P marginBottom='none' size='sm'>
                            Cards
                          </P>
                        </div>
                      ),
                      value: 'Cards',
                    },
                  ]}
                />
              </div>
              {viewMode === 'Map' ? (
                <div className='view-container' style={{ display: 'block' }}>
                  <ChoroplethMap
                    data={transformDataForGraph(data, 'choroplethMap', [
                      { chartConfigId: 'id', columnId: 'iso' },
                      {
                        chartConfigId: 'x',
                        columnId: 'services_or_work_areas_total',
                      },
                    ])}
                    mapNoDataColor='#D4D6D8'
                    mapBorderColor='#A9B1B7'
                    height={700}
                    detailsOnClick={d => {
                      return <ModalContent data={d.data} />;
                    }}
                    tooltip={d => (
                      <div>
                        <div className='font-bold p-2 bg-primary-gray-300 min-w-[240px] uppercase text-xs'>
                          {d.data.country}
                        </div>
                        <div className='p-2'>
                          {d.data.services_total ? (
                            <div>
                              <p className='mt-2 mb-1'>Services</p>
                              <div className='chips'>
                                {d.data.public ? (
                                  <div className='chip public-chip'>
                                    Public finance
                                  </div>
                                ) : null}
                                {d.data.private ? (
                                  <div className='chip private-chip'>
                                    Private finance
                                  </div>
                                ) : null}
                                {d.data.inffs ? (
                                  <div className='chip inffs-chip'>INFFs</div>
                                ) : null}
                                {d.data.academy ? (
                                  <div className='chip academy-chip'>
                                    SDG Finance Academy
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                          {d.data.work_areas_total ? (
                            <div>
                              <p className='mt-2 mb-1'>Work areas</p>
                              <div className='chips'>
                                {d.data.biofin ? (
                                  <div className='chip biofin-chip'>
                                    Biodiversity finance
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                          <p className='text-sm mb-1 mt-2 text-primary-gray-500'>
                            Click to learn more
                          </p>
                        </div>
                      </div>
                    )}
                    styles={{
                      tooltip: {
                        padding: '0',
                        minWidth: '150px',
                      },
                    }}
                    centerPoint={[10, 10]}
                    showAntarctica={false}
                    colorDomain={[0, 0.5, 0.7]}
                    showColorScale={false}
                    highlightedIds={filteredData
                      .map(row => row.iso?.toUpperCase?.())
                      .filter(Boolean)}
                  />
                </div>
              ) : (
                <div
                  className='view-container h-full undp-scrollbar overflow-y-auto'
                  style={{ display: 'block' }}
                >
                  <DataCards
                    data={filteredData}
                    padding='0rem 1.25rem 0 1.25rem'
                    uiMode='light'
                    height={800}
                    cardSearchColumns={['country']}
                    cardTemplate={d => (
                      <div className='p-4 flex flex-col h-full justify-between'>
                        <div>
                          <p className='m-0 text-xl'>{d.country}</p>

                          {d.services_total ? (
                            <div>
                              <p className='text-sm mb-1 pt-4'>Services</p>
                              <div className='chips'>
                                {d.public ? (
                                  <div className='chip public-chip'>
                                    Public finance
                                  </div>
                                ) : null}
                                {d.private ? (
                                  <div className='chip private-chip'>
                                    Private finance
                                  </div>
                                ) : null}
                                {d.inffs ? (
                                  <>
                                    <div className='chip inffs-chip'>INFFs</div>
                                    <br />
                                  </>
                                ) : null}
                                {d.academy && (
                                  <div className='chip academy-chip'>
                                    SDG Finance Academy
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : null}

                          {d.work_areas_total ? (
                            <div>
                              <p className='text-sm mb-1 pt-4'>Work areas</p>
                              <div className='chips'>
                                {d.biofin && (
                                  <div className='chip biofin-chip'>
                                    Biodiversity finance
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className='cta-button'>Read more</div>
                      </div>
                    )}
                    cardBackgroundColor='#fff'
                    detailsOnClick={(d: DataType) => <ModalContent data={d} />}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
