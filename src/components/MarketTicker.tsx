import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';

export const MarketTicker: React.FC = () => {
  const { cryptoPrices, stockPrices, isLoading } = useMarketData();

  if (isLoading) {
    return (
      <div className="bg-slate-800 border-b border-slate-700 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-slate-400 text-sm">Loading market data...</div>
        </div>
      </div>
    );
  }

  const allPrices = [
    ...cryptoPrices.map(crypto => ({
      symbol: crypto.symbol,
      price: crypto.price,
      change: crypto.change24h,
      type: 'crypto' as const
    })),
    ...stockPrices.map(stock => ({
      symbol: stock.symbol,
      price: stock.price,
      change: stock.change,
      type: 'stock' as const
    }))
  ];

  return (
    <div className="bg-slate-800 border-b border-slate-700 py-2 overflow-hidden">
      <div className="flex animate-scroll">
        <div className="flex space-x-8 whitespace-nowrap">
          {allPrices.concat(allPrices).map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center space-x-2 text-sm">
              <span className="text-slate-300 font-medium">{item.symbol}</span>
              <span className="text-white">
                ${item.type === 'crypto' && item.price > 1000 
                  ? item.price.toLocaleString() 
                  : item.price.toFixed(2)}
              </span>
              <div className={`flex items-center ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(item.change).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};