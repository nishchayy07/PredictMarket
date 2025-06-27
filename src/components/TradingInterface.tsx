import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Users, Info } from 'lucide-react';
import { Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { PriceChart } from './PriceChart';
import { MarketDepth } from './MarketDepth';

interface TradingInterfaceProps {
  event: Event;
  onBack: () => void;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ event, onBack }) => {
  const { user, updateUser } = useAuth();
  const [selectedType, setSelectedType] = useState<'yes' | 'no'>('yes');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedType === 'yes' ? event.yesPrice : event.noPrice);
  const [isTrading, setIsTrading] = useState(false);

  const currentPrice = selectedType === 'yes' ? event.yesPrice : event.noPrice;
  const effectivePrice = orderType === 'market' ? currentPrice : limitPrice;
  const total = quantity * effectivePrice;
  const potentialPayout = quantity * 1; // Each share pays ₹1 if correct
  const potentialProfit = potentialPayout - total;

  const canAfford = user && user.walletBalance >= total;
  const timeLeft = formatDistanceToNow(event.endDate, { addSuffix: true });

  const handleTrade = async () => {
    if (!user || !canAfford) return;

    setIsTrading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user balance
    updateUser({
      walletBalance: user.walletBalance - total
    });

    // Show success message (you could add a toast here)
    alert(`Successfully placed ${selectedType.toUpperCase()} order for ${quantity} shares!`);
    
    setIsTrading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-white transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </button>
        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {event.category}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Event Details & Charts */}
        <div className="xl:col-span-3 space-y-6">
          {/* Event Info */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-slate-300 mb-4">{event.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-slate-400">
                <Clock className="h-4 w-4 mr-2" />
                Ends {timeLeft}
              </div>
              <div className="flex items-center text-slate-400">
                <TrendingUp className="h-4 w-4 mr-2" />
                Volume: ₹{event.totalVolume.toLocaleString()}
              </div>
              <div className="flex items-center text-slate-400">
                <Users className="h-4 w-4 mr-2" />
                Traders: {((event.yesShares + event.noShares) / 1000).toFixed(0)}K
              </div>
            </div>
          </div>

          {/* Live Price Chart */}
          <PriceChart 
            eventId={event.id}
            currentYesPrice={event.yesPrice}
            currentNoPrice={event.noPrice}
          />

          {/* Market Depth */}
          <MarketDepth 
            yesPrice={event.yesPrice}
            noPrice={event.noPrice}
          />

          {/* Market Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-600 bg-opacity-20 border border-emerald-500 rounded-lg p-4">
              <div className="text-emerald-400 font-semibold mb-2">YES Position</div>
              <div className="text-2xl font-bold text-white">₹{event.yesPrice.toFixed(3)}</div>
              <div className="text-emerald-400 text-sm">{Math.round(event.yesPrice * 100)}% implied probability</div>
              <div className="text-slate-400 text-xs mt-2">{event.yesShares.toLocaleString()} shares</div>
            </div>
            <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4">
              <div className="text-red-400 font-semibold mb-2">NO Position</div>
              <div className="text-2xl font-bold text-white">₹{event.noPrice.toFixed(3)}</div>
              <div className="text-red-400 text-sm">{Math.round(event.noPrice * 100)}% implied probability</div>
              <div className="text-slate-400 text-xs mt-2">{event.noShares.toLocaleString()} shares</div>
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Position Selector */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Place Order</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setSelectedType('yes')}
                className={`p-3 rounded-lg border transition-all ${
                  selectedType === 'yes'
                    ? 'bg-emerald-600 bg-opacity-20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold">YES</div>
                <div className="text-sm">₹{event.yesPrice.toFixed(3)}</div>
              </button>
              <button
                onClick={() => setSelectedType('no')}
                className={`p-3 rounded-lg border transition-all ${
                  selectedType === 'no'
                    ? 'bg-red-600 bg-opacity-20 border-red-500 text-red-400'
                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold">NO</div>
                <div className="text-sm">₹{event.noPrice.toFixed(3)}</div>
              </button>
            </div>

            {/* Order Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Order Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType('market')}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    orderType === 'market'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Market
                </button>
                <button
                  onClick={() => setOrderType('limit')}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    orderType === 'limit'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  Limit
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            {/* Limit Price */}
            {orderType === 'limit' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Limit Price</label>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Math.max(0.001, Math.min(0.999, parseFloat(e.target.value) || 0.001)))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0.001"
                  max="0.999"
                  step="0.001"
                />
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-slate-700 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Price per share:</span>
                  <span className="text-white">₹{effectivePrice.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="text-white">{quantity}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Total Cost:</span>
                  <span className="text-white">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Payout:</span>
                  <span className="text-green-400">₹{potentialPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Profit:</span>
                  <span className={potentialProfit > 0 ? 'text-green-400' : 'text-red-400'}>
                    ₹{potentialProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trade Button */}
            <button
              onClick={handleTrade}
              disabled={!canAfford || isTrading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                canAfford && !isTrading
                  ? `${selectedType === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white`
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isTrading ? 'Placing Order...' : `Buy ${selectedType.toUpperCase()}`}
            </button>

            {!canAfford && (
              <div className="mt-2 text-red-400 text-sm flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Insufficient balance. Add funds to your wallet.
              </div>
            )}
          </div>

          {/* Wallet Info */}
          {user && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Wallet</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Balance:</span>
                  <span className="text-green-400 font-semibold">₹{user.walletBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total P&L:</span>
                  <span className={`font-semibold ${user.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {user.totalPnL >= 0 ? '+' : ''}₹{user.totalPnL.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};