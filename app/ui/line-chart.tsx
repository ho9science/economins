"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  TimeScale
} from "chart.js";
import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from "react-chartjs-2";
import { getChartData, Rate } from '@/app/lib/json';
import { useEffect, useState } from "react";
import "chartjs-adapter-date-fns";
// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale
);

ChartJS.register(CategoryScale, /* ... */)

export interface Candidate {
  name: string,
  type: string,
  initDate: string,
  start: number,
  end: number
}

export default function MyLineChart({ dataType }: { dataType: Candidate[] }) {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>({});

  useEffect(() => {
    const backgroundColors = ['red', 'blue', 'orange', 'green', 'yellow', 'purple', 'gray'];
    var datasets: any = [];
    const axisPositionSet = new Set<string>();

    getChartData().then((data) => {
      let firstAxis = '';
      dataType.forEach((element, index) => {
        axisPositionSet.add(element.type);
        if (axisPositionSet.size <= 1) {
          firstAxis = element.type;
        }
        datasets.push({
          'label': element.name,
          'data': element.end === 0? data[element.name as keyof Rate].splice(element.start):data[element.name as keyof Rate].splice(element.start, element.end),
          'backgroundColor': backgroundColors[index],
          'yAxisID': firstAxis === element.type ? 'y': 'y2',
        });
      });
      const getCheckedChartData: ChartData <'line'> = {
        datasets: datasets
      };
      setChartData(
          getCheckedChartData
      );
      if (axisPositionSet.size<=1) {
        setChartOptions({
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true
            },
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'yyyy-MM'
                },
                tooltipFormat: 'yyyy-MM' 
              },
              grid: {
                display: false,
                drawTicks: false,
              }
            }
          },
        });  
      } else {
        setChartOptions({
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y2: {
              type: 'linear',
              position: 'right',
              grid: {
                drawOnChartArea: false,
              },
            },
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true
            },
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'yyyy-MM'
                },
                tooltipFormat: 'yyyy-MM' 
              },
              grid: {
                display: false,
                drawTicks: false,
              }
            },
          },
          plugins: {
            tooltip: {
              filter: (item) => item.parsed.y !== null,
            }
          }
        });  
      }
    });
  }, [dataType]);

  return (
    <div className="chart-container" style={{height:'60vh', width:'80vw'}}>
      <Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}