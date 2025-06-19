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
              {selectedService ? (
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
                    detailsOnClick="<div><p class='text-xl mt-0 pb-4'>{{data.country}}</p><table class='modal-table' style='w-full'><thead><tr><th class='text-sm uppercase font-bold text-left'>SERVICES/WORK AREAS</th><th class='text-sm uppercase font-bold text-left'>SUBCATEGORIES</th><th class='text-sm uppercase font-bold text-left'>NOTES</th></tr></thead><tbody>{{#if data.private}}<tr><td><div class='chip private-chip'>Private</div></td><td>{{#if data.private_impact}}<div class='chip chip-sub private-chip-sub'>Managing for impact</div>{{/if}}{{#if data.private_pipelines}}<div class='chip chip-sub private-chip-sub'>Originating pipelines</div>{{/if}}{{#if data.private_environment}}<div class='chip chip-sub private-chip-sub'>Enabling environment</div>{{/if}}</td><td>{{data.private_note}}</td></tr>{{/if}}{{#if data.public}}<tr><td><div class='chip public-chip'>Public</div></td><td>{{#if data.public_tax}}<div class='chip chip-sub public-chip-sub'>Tax for the SDGs</div>{{/if}}{{#if data.public_debt}}<div class='chip chip-sub public-chip-sub'>Debt for the SDGs</div>{{/if}}{{#if data.public_budget}}<div class='chip chip-sub public-chip-sub'>Budget for the SDGs</div>{{/if}}{{#if data.public_insurance}}<div class='chip chip-sub public-chip-sub'>Insurance and risk finance</div>{{/if}}</td><td>{{data.public_note}}</td></tr>{{/if}}{{#if data.inffs}}<tr><td><div class='chip inffs-chip'>INFFs</div></td><td></td><td>{{data.inffs_note}}</td></tr>{{/if}}{{#if data.biofin}}<tr><td><div class='chip biofin-chip'>Biodiversity</div></td><td></td><td>{{data.biofin_note}}</td></tr>{{/if}}{{#if data.climate_finance}}<tr><td><div class='chip climate-finance-chip'>Climate</div></td><td></td><td>{{data.climate_finance_note}}</td></tr>{{/if}}</tbody></table></div>"
                    tooltip="<div class='font-bold p-2 bg-primary-gray-300 min-w-[240px] uppercase text-xs'>{{row}} {{data.country}}</div><div class='p-2'>{{#if data.services_total}}<div><p class='mt-2 mb-1'>Services</p><div class='chips'>{{#if data.public}}<div class='chip public-chip'>Public finance</div>{{/if}}{{#if data.private}}<div class='chip private-chip'>Private finance</div>{{/if}}{{#if data.inffs}}<div class='chip inffs-chip'>INFFs</div>{{/if}}{{#if data.academy}}<div class='chip academy-chip'>SDG Finance Academy</div>{{/if}}</div></div>{{/if}}{{#if data.work_areas_total}}<div><p class='mt-2 mb-1'>Work areas</p><div class='chips'>{{#if data.biofin}}<div class='chip biofin-chip'>Biodiversity finance</div>{{/if}}</div></div>{{/if}}<p class='text-sm mb-1 mt-2 text-primary-gray-500'>Click to learn more</p></div></div>"
                    styles={{
                      tooltip: {
                        padding: '0',
                        minWidth: '150px',
                      },
                    }}
                    padding='0rem 1.25rem 0 1.25rem'
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
                    cardTemplate="<div class='p-4 flex flex-col h-full justify-between'><div><p class='m-0 text-xl'>{{country}}</p>{{#if services_total}}<div><p class='text-sm mb-1 pt-4'>Services</p><div class='chips'>{{#if public}}<div class='chip public-chip'>Public finance</div>{{/if}}{{#if private}}<div class='chip private-chip'>Private finance</div>{{/if}}{{#if inffs}}<div class='chip inffs-chip'>INFFs</div></br>{{/if}}{{#if academy}}<div class='chip academy-chip'>SDG Finance Academy</div>{{/if}}</div></div>{{/if}}{{#if work_areas_total}}<div><p class='text-sm mb-1 pt-4'>Work areas</p><div class='chips'>{{#if biofin}}<div class='chip biofin-chip'>Biodiversity finance</div>{{/if}}</div></div>{{/if}}</div><div class='cta-button'>Read more</div></div>"
                    cardBackgroundColor='#fff'
                    detailsOnClick="<div><p class='text-xl mt-0 pb-4'>{{country}}</p><table class='modal-table' style='w-full'><thead><tr><th class='text-sm uppercase font-bold text-left'>SERVICES/WORK AREAS</th><th class='text-sm uppercase font-bold text-left'>SUBCATEGORIES</th><th class='text-sm uppercase font-bold text-left'>NOTES</th></tr></thead><tbody>{{#if private}}<tr><td><div class='chip private-chip'>Private</div></td><td>{{#if private_impact}}<div class='chip chip-sub private-chip-sub'>Managing for impact</div>{{/if}}{{#if private_pipelines}}<div class='chip chip-sub private-chip-sub'>Originating pipelines</div>{{/if}}{{#if private_environment}}<div class='chip chip-sub private-chip-sub'>Enabling environment</div>{{/if}}</td><td>{{private_note}}</td></tr>{{/if}}{{#if public}}<tr><td><div class='chip public-chip'>Public</div></td><td>{{#if public_tax}}<div class='chip chip-sub public-chip-sub'>Tax for the SDGs</div>{{/if}}{{#if public_debt}}<div class='chip chip-sub public-chip-sub'>Debt for the SDGs</div>{{/if}}{{#if public_budget}}<div class='chip chip-sub public-chip-sub'>Budget for the SDGs</div>{{/if}}{{#if public_insurance}}<div class='chip chip-sub public-chip-sub'>Insurance and risk finance</div>{{/if}}</td><td>{{public_note}}</td></tr>{{/if}}{{#if inffs}}<tr><td><div class='chip inffs-chip'>INFFs</div></td><td></td><td>{{inffs_note}}</td></tr>{{/if}}{{#if biofin}}<tr><td><div class='chip biofin-chip'>Biodiversity</div></td><td></td><td>{{biofin_note}}</td></tr>{{/if}}{{#if climate_finance}}<tr><td><div class='chip climate-finance-chip'>Climate</div></td><td></td><td>{{climate_finance_note}}</td></tr>{{/if}}</tbody></table></div>"
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
