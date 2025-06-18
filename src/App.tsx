import '@undp/data-viz/style.css';
import '@undp/design-system-react/style.css';
import '@/styles/fonts.css';
import '@/styles/styles.css';
import '@/styles/customStyles.css';
import { useEffect, useState } from 'react';
import { fetchAndParseCSV, fetchAndParseJSON } from '@undp/data-viz';

import { DataType, CountryDataType, RawDataRow } from './types';
import Dashboard from './Dashboard';

function App() {
  const [data, setData] = useState<DataType[] | null>(null);

  useEffect(() => {
    fetchAndParseJSON(
      'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json',
    )
      .then((countriesData: CountryDataType[]) => {
        fetchAndParseCSV(
          'https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repository/refs/heads/main/data.csv',
        ).then(data => {
          const formattedData = (data as RawDataRow[]).map(row => {
            const hasPublic =
              row.public_tax ||
              row.public_debt ||
              row.public_budget ||
              row.public_insurance
                ? 1
                : 0;
            const hasPrivate =
              row.private_pipelines ||
              row.private_impact ||
              row.private_environment
                ? 1
                : 0;
            const services_total =
              hasPublic || hasPrivate || row.inffs || row.academy
                ? 1
                : undefined;
            const work_areas_total = row.biofin ? 1 : undefined;
            const services_or_work_areas_total =
              services_total || work_areas_total ? 1 : undefined;
            const countryData =
              countriesData[
                countriesData.findIndex(el => el['Alpha-3 code'] === row.iso)
              ];
            return {
              ...row,
              public: hasPublic,
              private: hasPrivate,
              services_total,
              work_areas_total,
              services_or_work_areas_total,
              country_categories: Object.entries({
                all: 1,
                LDC: countryData.LDC,
                SIDS: countryData.SIDS,
                fragile: row.fragile_country,
              })
                .filter(([_, value]) => value === 1 || value === true)
                .map(([key]) => key),
              service_categories: Object.entries({
                public: hasPublic,
                private: hasPrivate,
                inff: row.inffs,
                academy: row.academy,
                public_tax: row.public_tax,
                public_debt: row.public_debt,
                public_budget: row.public_budget,
                public_insurance: row.public_insurance,
                private_pipelines: row.private_pipelines,
                private_impact: row.private_impact,
                private_environment: row.private_environment,
                biofin: row.biofin,
              })
                .filter(([_, value]) => value === 1)
                .map(([key]) => key),
            };
          });
          const finalData = formattedData.filter(
            row => row.services_or_work_areas_total === 1,
          );
          setData(finalData);
        });
      })
      .catch(error => console.error('Error:', error));
  }, []);

  if (!data) {
    return (
      <div className='undp-loader-container undp-container'>
        <div className='undp-loader' />
      </div>
    );
  }

  return <Dashboard data={data} />;
}

export default App;
