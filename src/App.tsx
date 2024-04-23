import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    csv(
      `https://raw.githubusercontent.com/UNDP-Data/dv-sustainable-finance-hub-data-repo/main/SFH_data.csv`,
    )
      .then((loadedData: any) => {
        setData(loadedData);
      })
      .catch((err: any) => {
        console.error('Error loading the CSV file:', err);
      });
  }, []);
  console.log(data);
  return (
    <div className='undp-container flex-div flex-wrap flex-hor-align-center margin-top-13 margin-bottom-13'>
      <ChoroplethMap
        data={[
          { countryCode: 'IND', x: 1 },
          { countryCode: 'FIN', x: 2 },
          { countryCode: 'IDN', x: 3 },
          { countryCode: 'ZAF', x: 4 },
          { countryCode: 'PER', x: 5 },
          { countryCode: 'PAK', x: 6 },
          { countryCode: 'USA', x: 7 },
          { countryCode: 'SWE', x: 8 },
        ]}
        graphTitle='Title of the graph'
        width={1200}
        height={900}
        source='Organization ABC'
        sourceLink='www.example.com'
        domain={[2, 4, 6, 8]}
      />
    </div>
  );
}

export default App;
