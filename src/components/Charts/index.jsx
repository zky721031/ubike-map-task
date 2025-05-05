import { useState } from 'react';
import { Flex, Radio } from 'antd';
import { LineChartOutlined, BarChartOutlined } from '@ant-design/icons';
import './charts.css';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Charts({ chartData }) {
  const [chartType, setChartType] = useState('line-chart');
  return (
    <div>
      <Flex justify='space-between' align='center' className='mb-30'>
        <h5>UBike 每月使用量圖表</h5>
        <Radio.Group
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <Radio.Button value='line-chart'>
            <LineChartOutlined />
          </Radio.Button>
          <Radio.Button value='bar-chart'>
            <BarChartOutlined />
          </Radio.Button>
        </Radio.Group>
      </Flex>
      <div className='chart-container'>
        <ResponsiveContainer width='100%' height='100%'>
          {/* line chart */}
          {chartType === 'line-chart' && (
            <LineChart data={chartData} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='yearMonth' />
              <YAxis
                type='number'
                domain={['dataMin - 1000000', 'dataMax + 1000000']}
              />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='times' stroke='#82ca9d' />
            </LineChart>
          )}
          {/* bar chart */}
          {chartType === 'bar-chart' && (
            <BarChart data={chartData} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='yearMonth' />
              <YAxis
                type='number'
                domain={['dataMin - 1000000', 'dataMax + 1000000']}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='times'
                fill='#82ca9d'
                activeBar={<Rectangle fill='gold' stroke='purple' />}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
