/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChoroplethMap,
  fetchAndParseCSV,
  transformDataForGraph,
  DataCards,
} from '@undp-data/undp-visualization-library';
import {
  DropdownSelect,
  H2,
  H6,
  P,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
} from '@undp-data/undp-design-system-react';
import '@undp-data/undp-design-system-react/dist/style.css';
import { Cards } from './Cards';
import './customStyles.css';

type OptionType = { label: string; value: string };

function App() {
  const [data, setData] = useState<any[] | null>(null);
  const [taxonomy, setTaxonomy] = useState<any[] | null>(null);
  const [selectedService, setSelectedService] = useState<OptionType | null>(
    null,
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<OptionType | null>(null);
  const [selectedWorkArea, setSelectedWorkArea] = useState<OptionType | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] =
    useState<string>('all_countries');
  const [viewMode, setViewMode] = useState<string>('Map');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const d = (await fetchAndParseCSV(
          'https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repository/refs/heads/main/data.csv',
        )) as any[];

        const processedData = d.map(row => {
          const hasService =
            row.public || row.private || row.inffs || row.academy;

          const hasWorkArea = row.biofin;
          // const hasWorkArea = row.biofin || row.climate_finance;

          const services_total = hasService ? 1 : undefined;
          const work_areas_total = hasWorkArea ? 1 : undefined;
          const services_or_work_areas_total =
            hasService || hasWorkArea ? 1 : undefined;

          return {
            ...row,
            services_total,
            work_areas_total,
            services_or_work_areas_total,
          };
        });

        const prefilteredData = processedData.filter(
          row => row.services_or_work_areas_total === 1,
        );

        setData(prefilteredData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadTaxonomy = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json',
        );
        const taxonomyData = await response.json();
        setTaxonomy(taxonomyData);
      } catch (error) {
        console.error('Error loading taxonomy data:', error);
      }
    };
    loadTaxonomy();
  }, []);
  const filteredData = useMemo(() => {
    if (!data || !taxonomy) return [];

    const sidsCodes = taxonomy
      .filter((country: any) => country.SIDS === true)
      .map((country: any) => country['Alpha-3 code']);
    const ldcCodes = taxonomy
      .filter((country: any) => country.LDC === true)
      .map((country: any) => country['Alpha-3 code']);

    return data.filter(row => {
      const matchesCategory =
        selectedCategory === 'all_countries' ||
        (selectedCategory === 'sids' && sidsCodes.includes(row.iso)) ||
        (selectedCategory === 'ldcs' && ldcCodes.includes(row.iso)) ||
        (selectedCategory === 'fragile' && row.fragile_country === 1);

      const matchesService =
        !selectedService?.value ||
        (selectedService.value === 'public' && row.public) ||
        (selectedService.value === 'private' && row.private) ||
        (selectedService.value === 'inffs' && row.inffs) ||
        (selectedService.value === 'academy' && row.academy);

      const matchesSubcategory =
        !selectedSubcategory || row[selectedSubcategory.value];

      const matchesWorkArea =
        !selectedWorkArea ||
        (selectedWorkArea.value in row && row[selectedWorkArea.value]);

      return (
        matchesCategory &&
        matchesService &&
        matchesSubcategory &&
        matchesWorkArea
      );
    });
  }, [
    data,
    taxonomy,
    selectedCategory,
    selectedService,
    selectedSubcategory,
    selectedWorkArea,
  ]);

  const transformedData = useMemo(
    () =>
      transformDataForGraph(data, 'choroplethMap', [
        { chartConfigId: 'countryCode', columnId: 'iso' },
        { chartConfigId: 'x', columnId: 'services_or_work_areas_total' },
      ]),
    [data],
  );

  const highlightedCountries = useMemo(() => {
    return filteredData.map(row => row.iso?.toUpperCase?.()).filter(Boolean);
  }, [filteredData]);

  if (!data || !taxonomy) {
    return (
      <div className='undp-loader-container undp-container'>
        <div className='undp-loader' />
      </div>
    );
  }

  return (
    <div className='max-w-[1980px]'>
      <div className='p-5 m-5' ref={containerRef}>
        <H2 className='text-lg'>UNDP’s Work on Sustainable Finance</H2>
        <div className='mt-8'>
          <Cards
            dataStatCard={data}
            values={[
              'services_or_work_areas_total',
              'public',
              'private',
              'inffs',
            ]}
            titles={[
              'UNDP support',
              'Public Finance for the SDGs',
              'Private Finance for the SDGs',
              'INFFs',
            ]}
            desc={[
              'Number of countries',
              'Number of Countries',
              'Number of Countries',
              'Number of countries',
            ]}
          />
        </div>
        <div id='vizArea' className='w-full border-2 inline-flex'>
          {/* Left Sidebar */}
          <div className='flex flex-col gap-4 border-r-2 p-4 max-w-[360px]'>
            <div id='selectService'>
              <P size='sm' marginBottom='2xs'>
                Select service
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
                    value: 'inffs',
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
                Select work area
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
                Select country group
              </P>
              <RadioGroup
                value={selectedCategory}
                onValueChange={value => setSelectedCategory(value)}
                variant='normal'
              >
                <RadioGroupItem label='All countries' value='all_countries' />
                <RadioGroupItem label='SIDS' value='sids' />
                <RadioGroupItem label='LDCs' value='ldcs' />
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
                defaultValue='Map'
                size='sm'
                color='black'
                onValueChange={value => setViewMode(value)}
                options={[
                  {
                    label: 'Map',
                    value: 'Map',
                  },
                  {
                    label: 'Cards',
                    value: 'Cards',
                  },
                ]}
              />
            </div>

            {/* Map View */}
            <div
              className='view-container'
              style={{ display: viewMode === 'Map' ? 'block' : 'none' }}
            >
              <ChoroplethMap
                data={transformedData}
                mapNoDataColor='#D4D6D8'
                mapBorderColor='#A9B1B7'
                height={700}
                scale={230}
                detailsOnClick="<div style='padding:24px;'><p class='text-lg mb-2'>{{data.country}}</p><table class='modal-table' style='width:100%;border-collapse:collapse;'><thead><tr><th class='undp-viz-typography' style='text-align:left;'>SERVICES/WORK AREAS</th><th class='undp-viz-typography' style='text-align:left;'>SUBCATEGORIES</th><th class='undp-viz-typography' style='text-align:left;'>NOTES</th></tr></thead><tbody>{{#if data.private}}<tr><td><div class='chip private-chip'>Private</div></td><td>{{#if data.private_impact}}<div class='chip chip-sub private-chip-sub'>Managing for impact</div>{{/if}}{{#if data.private_pipelines}}<div class='chip chip-sub private-chip-sub'>Originating pipelines</div>{{/if}}{{#if data.private_environment}}<div class='chip chip-sub private-chip-sub'>Enabling environment</div>{{/if}}</td><td>{{data.private_note}}</td></tr>{{/if}}{{#if data.public}}<tr><td><div class='chip public-chip'>Public</div></td><td>{{#if data.public_tax}}<div class='chip chip-sub public-chip-sub'>Tax for the SDGs</div>{{/if}}{{#if data.public_debt}}<div class='chip chip-sub public-chip-sub'>Debt for the SDGs</div>{{/if}}{{#if data.public_budget}}<div class='chip chip-sub public-chip-sub'>Budget for the SDGs</div>{{/if}}{{#if data.public_insurance}}<div class='chip chip-sub public-chip-sub'>Insurance and risk finance</div>{{/if}}</td><td>{{data.public_note}}</td></tr>{{/if}}{{#if data.inffs}}<tr><td><div class='chip inffs-chip'>INFFs</div></td><td></td><td>{{data.inffs_note}}</td></tr>{{/if}}{{#if data.biofin}}<tr><td><div class='chip biofin-chip'>Biodiversity</div></td><td></td><td>{{data.biofin_note}}</td></tr>{{/if}}{{#if data.climate_finance}}<tr><td><div class='chip climate-finance-chip'>Climate</div></td><td></td><td>{{data.climate_finance_note}}</td></tr>{{/if}}</tbody></table></div>"
                tooltip="<div class='p-4'><div><h6 class='mt-0 uppercase mb-0' style='font-size:14px;'>{{data.country}}</h6>{{#if data.services_total}}<div><p class='undp-viz-typography mt-2 mb-1'>Services:</p><div class='chips'>{{#if data.public}}<div class='chip public-chip'>Public finance</div>{{/if}}{{#if data.private}}<div class='chip private-chip'>Private finance</div>{{/if}}{{#if data.inffs}}<div class='chip inffs-chip'>INFFs</div>{{/if}}{{#if data.academy}}<div class='chip academy-chip'>SDG Finance Academy</div>{{/if}}</div></div>{{/if}}{{#if data.work_areas_total}}<div><p class='undp-viz-typography'>Work areas:</p><div class='chips'>{{#if data.biofin}}<div class='chip biofin-chip'>Biodiversity finance</div>{{/if}}</div></div>{{/if}}</div><p class='text-sm mb-0 italic text-primary-gray-500'>Click to learn more</p></div>"
                padding='0rem 1.25rem 0 1.25rem'
                centerPoint={[10, 25]}
                showAntarctica={false}
                zoomScaleExtend={[1, 1]}
                domain={[0, 0.5, 0.7]}
                showColorScale={false}
                highlightedCountryCodes={highlightedCountries}
              />
            </div>

            {/* Cards View */}
            <div
              className='view-container h-full undp-scrollbar overflow-y-auto'
              style={{ display: viewMode === 'Cards' ? 'block' : 'none' }}
            >
              <DataCards
                data={filteredData}
                padding='0rem 1.25rem 0 1.25rem'
                uiMode='light'
                height={800}
                cardSearchColumns={['country']}
                cardTemplate="<div class='p-4 flex flex-col h-full justify-between'><div><p class='m-0  text-xl'>{{country}}</p>{{#if services_total}}<div><p class='text-sm mb-1'>Services:</p><div class='chips'>{{#if public}}<div class='chip public-chip'>Public finance</div>{{/if}}{{#if private}}<div class='chip private-chip'>Private finance</div>{{/if}}{{#if inffs}}<div class='chip inffs-chip'>INFFs</div></br>{{/if}}{{#if academy}}<div class='chip academy-chip'>SDG Finance Academy</div>{{/if}}</div></div>{{/if}}{{#if work_areas_total}}<div><p class='text-sm mb-1'>Work areas:</p><div class='chips'>{{#if biofin}}<div class='chip biofin-chip'>Biodiversity finance</div>{{/if}}</div></div>{{/if}}</div><div class='cta-button'>Read more</div></div>"
                cardBackgroundColor='#fff'
                detailsOnClick="<div style='padding:24px;'><p class='mt-0' style='font-size: 20px;'>{{country}}</p><table class='modal-table' style='width:100%;border-collapse:collapse;'><thead><tr><th class='undp-viz-typography' style='text-align:left;'>SERVICES/WORK AREAS</th><th class='undp-viz-typography' style='text-align:left;'>SUBCATEGORIES</th><th class='undp-viz-typography' style='text-align:left;'>NOTES</th></tr></thead><tbody>{{#if private}}<tr><td><div class='chip private-chip'>Private</div></td><td>{{#if private_impact}}<div class='chip chip-sub private-chip-sub'>Managing for impact</div>{{/if}}{{#if private_pipelines}}<div class='chip chip-sub private-chip-sub'>Originating pipelines</div>{{/if}}{{#if private_environment}}<div class='chip chip-sub private-chip-sub'>Enabling environment</div>{{/if}}</td><td>{{private_note}}</td></tr>{{/if}}{{#if public}}<tr><td><div class='chip public-chip'>Public</div></td><td>{{#if public_tax}}<div class='chip chip-sub public-chip-sub'>Tax for the SDGs</div>{{/if}}{{#if public_debt}}<div class='chip chip-sub public-chip-sub'>Debt for the SDGs</div>{{/if}}{{#if public_budget}}<div class='chip chip-sub public-chip-sub'>Budget for the SDGs</div>{{/if}}{{#if public_insurance}}<div class='chip chip-sub public-chip-sub'>Insurance and risk finance</div>{{/if}}</td><td>{{public_note}}</td></tr>{{/if}}{{#if inffs}}<tr><td><div class='chip inffs-chip'>INFFs</div></td><td></td><td>{{inffs_note}}</td></tr>{{/if}}{{#if biofin}}<tr><td><div class='chip biofin-chip'>Biodiversity</div></td><td></td><td>{{biofin_note}}</td></tr>{{/if}}{{#if climate_finance}}<tr><td><div class='chip climate-finance-chip'>Climate</div></td><td></td><td>{{climate_finance_note}}</td></tr>{{/if}}</tbody></table></div>"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
