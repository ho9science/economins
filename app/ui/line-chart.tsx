// components/MyLineChart.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from "react-chartjs-2";
import { getChartData } from '@/app/lib/json';
import { useEffect, useState } from "react";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

ChartJS.register(CategoryScale, /* ... */)

export default function MyLineChart() {
  
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});
  
  useEffect(() => {
    getChartData().then((data) => {
      setChartData({
        labels: data.date,
        datasets: [
          {
            label: '기준금리',
            data: data.rate7,
            backgroundColor: 'red',
          },
        ]
      });  
    });

    setChartOptions({
      responsive: true,
      maintainAspectRatio: true,
      scales: {y: {beginAtZero: true}}
    });
  }, [chartData]);

  return (
    <div className="chart-container" style={{height:'50vh', width:'80vw'}}>
      <Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}