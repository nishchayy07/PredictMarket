import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface MarketDepthProps {
  yesPrice: number;
  noPrice: number;
}

export const MarketDepth: React.FC<MarketDepthProps> = ({ yesPrice, noPrice }) => {
  const [yesBids, setYesBids] = useState<OrderBookEntry[]>([]);
  const [yesAsks, setYesAsks] = useState<OrderBookEntry[]>([]);
  const [noBids, setNoBids] = useState<OrderBookEntry[]>([]);
  const [noAsks, setNoAsks] = useState<OrderBookEntry[]>([]);

  // Generate realistic order book data
  useEffect(() => {
    const generateOrderBook = (basePrice: number, isBid: boolean) => {
      const orders: OrderBookEntry[] = [];
      let cumulativeQuantity = 0;
      
      for (let i = 0; i < 8; i++) {
        const priceOffset = isBid ? -0.005 * (i + 1) : 0.005 * (i + 1);
        const price = Math.max(0.01, Math.min(0.99, basePrice + priceOffset));
        const quantity = Math.floor(Math.random() * 500) + 100;
        cumulativeQuantity += quantity;
        
        orders.push({
          price,
          quantity,
          total: cumulativeQuantity
        });
      }
      
      return orders;
    };

    setYesBids(generateOrderBook(yesPrice, true));
    setYesAsks(generateOrderBook(yesPrice, false));
    setNoBids(generateOrderBook(noPrice, true));
    setNoAsks(generateOrderBook(noPrice, false));
  }, [yesPrice, noPrice]);

  // Update order book periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const generateOrderBook = (basePrice: number, isBid: boolean) => {
        const orders: OrderBookEntry[] = [];
        let cumulativeQuantity = 0;
        
        for (let i = 0; i < 8; i++) {
          const priceOffset = isBid ? -0.005 * (i + 1) : 0.005 * (i + 1);
          const price = Math.max(0.01, Math.min(0.99, basePrice + priceOffset));
          const quantity = Math.floor(Math.random() * 500) + 100;
          cumulativeQuantity += quantity;
          
          orders.push({
            price,
            quantity,
            total: cumulativeQuantity
          });
        }
        
        return orders;
      };

      setYesBids(generateOrderBook(yesPrice, true));
      setYesAsks(generateOrderBook(yesPrice, false));
      setNoBids(generateOrderBook(noPrice, true));
      setNoAsks(generateOrderBook(noPrice, false));
    }, 3000);

    return () => clearInterval(interval);
  }, [yesPrice, noPrice]);

  const OrderBookTable = ({ 
    title, 
    bids, 
    asks, 
    color 
  }: { 
    title: string; 
    bids: OrderBookEntry[]; 
    asks: OrderBookEntry[]; 
    color: 'emerald' | 'red' 
  }) => (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Activity className={`h-4 w-4 mr-2 ${color === 'emerald' ? 'text-emerald-400' : 'text-red-400'}`} />
        <h4 className="text-white font-medium">{title} Order Book</h4>
      </div>
      
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 font-medium">
          <div>Price</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks (Sell orders) */}
        <div className="space-y-1">
          {asks.slice().reverse().map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-red-400">₹{ask.price.toFixed(3)}</div>
              <div className="text-right text-slate-300">{ask.quantity}</div>
              <div className="text-right text-slate-300">{ask.total}</div>
            </div>
          ))}
        </div>
        
        {/* Spread */}
        <div className="border-t border-slate-600 pt-2">
          <div className="text-center text-xs text-slate-400">
            Spread: ₹{Math.abs(asks[0]?.price - bids[0]?.price || 0).toFixed(3)}
          </div>
        </div>
        
        {/* Bids (Buy orders) */}
        <div className="space-y-1">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 gap-2 text-xs">
              <div className={color === 'emerald' ? 'text-emerald-400' : 'text-red-400'}>₹{bid.price.toFixed(3)}</div>
              <div className="text-right text-slate-300">{bid.quantity}</div>
              <div className="text-right text-slate-300">{bid.total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-white">Market Depth</h3>
        <div className="ml-auto flex items-center text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live Order Book
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrderBookTable 
          title="YES" 
          bids={yesBids} 
          asks={yesAsks} 
          color="emerald" 
        />
        <OrderBookTable 
          title="NO" 
          bids={noBids} 
          asks={noAsks} 
          color="red" 
        />
      </div>
      
      <div className="mt-4 text-xs text-slate-500 text-center">
        Order book updates every 3 seconds with simulated market data
      </div>
    </div>
  );
};