import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';

const tooltip = (d: any) => {
  return (
    <div>
      <div
        style={{
          borderBottom: '1px solid #D4D6D8',
          padding: '1rem 1.5rem 1rem 1.5rem',
        }}
      >
        <h6 className='undp-typography margin-bottom-00'>CountryName</h6>
      </div>
      <div style={{ padding: '1rem 1.5rem' }}>
        <div key={d.countryCode}>
          <div className='flex-div flex-column gap-02 flex-vert-align-center margin-bottom-00'>
            {d.x !== undefined ? (
              <div
                style={{ width: '100%' }}
                className='flex-div flex-row flex-space-between'
              >
                <p
                  className='undp-typography margin-bottom-00'
                  style={{ fontSize: '1rem', padding: 0, margin: 0 }}
                >
                  Interviewed households:
                </p>
                <p
                  className='undp-typography margin-bottom-00'
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '1rem',
                    fontWeight: 700,
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {d.x}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    csv(
      `https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv`,
    )
      .then((loadedData: any) => {
        const transformedData = loadedData.map((d: any) => ({
          ...d,
          countryCode: d['Country ISO code'],
          x: d.public_finance_budget,
        }));
        setData(transformedData);
      })
      .catch((err: any) => {
        console.error('Error loading the CSV file:', err);
      });
  }, []);
  return (
    <div className='undp-container flex-div flex-wrap flex-hor-align-center margin-top-13 margin-bottom-13'>
      <ChoroplethMap
        data={data}
        graphTitle='Title of the graph'
        width={1200}
        height={900}
        source='Organization ABC'
        sourceLink='www.example.com'
        domain={[0, 1, 2, 3, 4]}
        tooltip={tooltip}
      />
    </div>
  );
}

export default App;
