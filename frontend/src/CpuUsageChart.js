import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const CpuUsageChart= ({ timestamps, values }) => {
  //Defines the data of the chart.
  const chartData = {
    labels: timestamps.map((t) => new Date(t).toLocaleTimeString()),
    datasets: [
      {
        label: "CPU Usage",
        data: values,
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
      },
    ],
  };
  //Defines the setting of the chart.
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Percentage",
        },
        min: 0.5,
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default CpuUsageChart;