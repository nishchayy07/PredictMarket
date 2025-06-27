import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Award, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Portfolio as PortfolioType } from '../types';

const DEMO_PORTFOLIO: PortfolioType[] = [
  {
    eventId: '1',
    eventTitle: 'Will Bitcoin cross $100,000 by December 2024?',
    yesShares: 50,
    noShares: 0,
    avgYesPrice: 0.65,
    avgNoPrice: 0,
    currentValue: 34,
    pnl: 1.5,
    pnlPercentage: 4.6
  },
  {
    eventId: '2',
    eventTitle: 'Will India win the Cricket World Cup 2024?',
    yesShares: 0,
    noShares: 30,
    avgYesPrice: 0,
    avgNoPrice: 0.58,
    currentValue: 16.5,
    pnl: -0.9,
    pnlPercentage: -5.2
  },
  {
    eventId: '3',
    eventTitle: 'Will Tesla stock price exceed $300 by year-end?',
    yesShares: 25,
    noShares: 0,
    avgYesPrice: 0.68,
    avgNoPrice: 0,
    currentValue: 18,
    pnl: 1.0,
    pnlPercentage: 5.9
  }
];

export const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const portfolio = DEMO_PORTFOLIO;

  const totalInvested = portfolio.reduce((sum, item) => 
    sum + (item.yesShares * item.avgYesPrice) + (item.noShares * item.avgNoPrice), 0
  );
  const totalCurrentValue = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const totalPnL = portfolio.reduce((sum, item) => sum + item.pnl, 0);
  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-slate-400">Track your positions and performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Invested</p>
              <p className="text-2xl font-bold text-white">₹{totalInvested.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Current Value</p>
              <p className="text-2xl font-bold text-white">₹{totalCurrentValue.toFixed(2)}</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toFixed(2)}
              </p>
            </div>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500" />
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">P&L %</p>
              <p className={`text-2xl font-bold ${totalPnLPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(1)}%
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* User Rank */}
      {user && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your Rank</h2>
              <p className="text-blue-100">You're currently ranked #{user.rank} among all traders</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">#{user.rank}</div>
              <div className="text-blue-100 text-sm">Global Rank</div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Your Positions</h2>
        </div>

        {portfolio.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-slate-400 text-lg mb-2">No positions yet</div>
            <div className="text-slate-500">Start trading to see your portfolio here</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Avg Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {portfolio.map((item) => (
                  <tr key={item.eventId} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium line-clamp-2">{item.eventTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {item.yesShares > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-600 bg-opacity-20 text-emerald-400 border border-emerald-500">
                            YES: {item.yesShares}
                          </span>
                        )}
                        {item.noShares > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-600 bg-opacity-20 text-red-400 border border-red-500">
                            NO: {item.noShares}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">
                        {item.yesShares > 0 && `₹${item.avgYesPrice.toFixed(2)}`}
                        {item.noShares > 0 && `₹${item.avgNoPrice.toFixed(2)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">₹{item.currentValue.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-medium ${item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.pnl >= 0 ? '+' : ''}₹{item.pnl.toFixed(2)}
                        </span>
                        <span className={`text-xs ${item.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.pnlPercentage >= 0 ? '+' : ''}{item.pnlPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};