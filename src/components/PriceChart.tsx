import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PricePoint {
  timestamp: Date;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

interface PriceChartProps {
  eventId: string;
  currentYesPrice: number;
  currentNoPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  eventId, 
  currentYesPrice, 
  currentNoPrice 
}) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '7D' | '30D'>('1D');
  const intervalRef = useRef<NodeJS.Timeout>();

  // Initialize with some historical data
  useEffect(() => {
    const now = new Date();
    const initialData: PricePoint[] = [];
    
    // Generate 50 historical points
    for (let i = 49; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 min intervals
      const baseYes = currentYesPrice + (Math.random() - 0.5) * 0.2;
      const yesPrice = Math.max(0.01, Math.min(0.99, baseYes));
      const noPrice = Math.max(0.01, Math.min(0.99, 1 - yesPrice + (Math.random() - 0.5) * 0.1));
      
      initialData.push({
        timestamp,
        yesPrice,
        noPrice,
        volume: Math.floor(Math.random() * 1000) + 500
      });
    }
    
    setPriceHistory(initialData);
  }, [eventId, currentYesPrice, currentNoPrice]);

  // Add real-time updates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const newPoint: PricePoint = {
        timestamp: new Date(),
        yesPrice: currentYesPrice,
        noPrice: currentNoPrice,
        volume: Math.floor(Math.random() * 200) + 100
      };

      setPriceHistory(prev => {
        const updated = [...prev, newPoint];
        // Keep only last 100 points
        return updated.slice(-100);
      });
    }, 5000); // Update every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentYesPrice, currentNoPrice]);

  const chartData = {
    datasets: [
      {
        label: 'YES Price',
        data: priceHistory.map(point => ({
          x: point.timestamp,
          y: point.yesPrice
        })),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'NO Price',
        data: priceHistory.map(point => ({
          x: point.timestamp,
          y: point.noPrice
        })),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toFixed(3)}`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM dd',
          }
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: false,
        min: 0,
        max: 1,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          },
          callback: function(value) {
            return '₹' + (value as number).toFixed(2);
          }
        }
      },
    },
  };

  const latestPoint = priceHistory[priceHistory.length - 1];
  const previousPoint = priceHistory[priceHistory.length - 2];
  
  const yesChange = latestPoint && previousPoint ? 
    ((latestPoint.yesPrice - previousPoint.yesPrice) / previousPoint.yesPrice) * 100 : 0;
  const noChange = latestPoint && previousPoint ? 
    ((latestPoint.noPrice - previousPoint.noPrice) / previousPoint.noPrice) * 100 : 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Price Chart</h3>
        <div className="flex space-x-2">
          {(['1H', '1D', '7D', '30D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-emerald-400 text-sm font-medium">YES</div>
              <div className="text-white text-lg font-bold">₹{currentYesPrice.toFixed(3)}</div>
            </div>
            <div className={`flex items-center text-sm ${yesChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {yesChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(yesChange).toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-400 text-sm font-medium">NO</div>
              <div className="text-white text-lg font-bold">₹{currentNoPrice.toFixed(3)}</div>
            </div>
            <div className={`flex items-center text-sm ${noChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {noChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(noChange).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {priceHistory.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-full bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-slate-400 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Loading chart data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live updates every 5 seconds
        </div>
        <div>
          Last updated: {latestPoint ? latestPoint.timestamp.toLocaleTimeString() : 'Loading...'}
        </div>
      </div>
    </div>
  );
};