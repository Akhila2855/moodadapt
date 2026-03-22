import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getMoodHistory } from '../services/db';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const MoodDashboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getMoodHistory();
      setHistory(data.slice(-10)); // Last 10 entries
    };
    load();
  }, []);

  const data = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      {
        label: 'Initial Mood',
        data: history.map(h => h.initialScore),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
      },
      {
        label: 'Post-Protocol',
        data: history.map(h => h.finalScore || null),
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22d3ee',
        pointBorderColor: '#fff',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: {
            family: 'Times New Roman, serif',
            weight: 'bold',
            size: 10
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'NEURAL RESONANCE HISTORY',
        color: '#fff',
        font: {
          family: 'Times New Roman, serif',
          weight: 'bold',
          size: 14
        },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
        ticks: {
          color: '#64748b',
          font: { size: 10, weight: 'bold' }
        }
      },
      y: {
        min: 0,
        max: 10,
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
        ticks: {
          color: '#64748b',
          font: { size: 10, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div className="w-full bg-black p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      <Line options={options} data={data} />
    </div>
  );
};
