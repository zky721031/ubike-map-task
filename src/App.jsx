import { useState, useEffect } from 'react';
import '@ant-design/v5-patch-for-react-19';

import './App.css';
// import axios from 'axios';
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
  console.log(999, ubikePositions);

  // const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    // const fetchUbikeChart = async () => {
    //   const { data } = await axios.get(
    //     'https://data.taipei/api/v1/dataset/8f690548-61bc-4bff-8baa-01d465eb672c?scope=resourceAquire'
    //   );
    //   console.log('fetchUbikeChart', data);
    // };
    // fetchUbikeChart();
  }, []);

  // useEffect(() => {
  //   async function fetchCsv() {
  //     const response = await fetch('http://localhost:5173/chart.csv');
  //     const text = await response.text();
  //     const json = csvToJson(text);
  //     setJsonData(json);
  //   }

  //   fetchCsv();
  // }, []);

  return (
    <div className='container'>
      <Map positions={ubikePositions} />

      <Charts chartData={fetchUbikeChart} />
    </div>
  );
}

export default App;
