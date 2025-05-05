import { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import './App.css';

import Map from './components/Map';
import Charts from './components/Charts';

import fetchUbikePositions from './data/ubikeData.json';
import fetchUbikeChart from './data/chartData.json';

const initPositionData = () =>
  fetchUbikePositions.map(
    ({
      ar,
      available_rent_bikes,
      available_return_bikes,
      latitude,
      longitude,
      sna,
      total,
    }) => ({
      ar,
      available_rent_bikes,
      available_return_bikes,
      latitude,
      longitude,
      total,
      sna: sna.replace('YouBike2.0_', ''),
    })
  );

function App() {
  const [ubikePositions] = useState(initPositionData);

  return (
    <div className='container'>
      <Map positions={ubikePositions} />
      <Charts chartData={fetchUbikeChart} />
    </div>
  );
}

export default App;
