import React, { useState } from 'react';
import { Plus, Minus, CreditCard, Banknote, History, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Transaction } from '../types';

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 5000,
    description: 'Wallet deposit via UPI',
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    type: 'buy',
    amount: -340,
    description: 'Bought YES shares - Bitcoin $100K prediction',
    createdAt: new Date('2024-01-14T15:45:00Z')
  },
  {
    id: '3',
    type: 'sell',
    amount: 450,
    description: 'Sold NO shares - Tesla stock prediction',
    createdAt: new Date('2024-01-13T09:20:00Z')
  },
  {
    id: '4',
    type: 'deposit',
    amount: 2000,
    description: 'Wallet deposit via Bank Transfer',
    createdAt: new Date('2024-01-10T14:15:00Z')
  },
  {
    id: '5',
    type: 'buy',
    amount: -275,
    description: 'Bought YES shares - Cricket World Cup prediction',
    createdAt: new Date('2024-01-08T11:30:00Z')
  }
];

export const Wallet: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const transactions = DEMO_TRANSACTIONS;

  const handleDeposit = async () => {
    if (!user || !amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const depositAmount = parseFloat(amount);
    updateUser({
      walletBalance: user.walletBalance + depositAmount
    });

    alert(`Successfully deposited ₹${depositAmount.toLocaleString()}`);
    setAmount('');
    setIsProcessing(false);
    setActiveTab('overview');
  };

  const handleWithdraw = async () => {
    if (!user || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > user.walletBalance) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const withdrawAmount = parseFloat(amount);
    updateUser({
      walletBalance: user.walletBalance - withdrawAmount
    });

    alert(`Successfully withdrawn ₹${withdrawAmount.toLocaleString()}`);
    setAmount('');
    setIsProcessing(false);
    setActiveTab('overview');
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-slate-400">Manage your funds and view transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-blue-100 text-lg mb-2">Available Balance</h2>
            <p className="text-4xl font-bold text-white">₹{user.walletBalance.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">Total P&L: +₹{user.totalPnL.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <Banknote className="h-16 w-16 text-blue-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: Banknote },
            { id: 'deposit', label: 'Deposit', icon: Plus },
            { id: 'withdraw', label: 'Withdraw', icon: Minus },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Available Balance</div>
                  <div className="text-2xl font-bold text-white">₹{user.walletBalance.toLocaleString()}</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Total Invested</div>
                  <div className="text-2xl font-bold text-white">₹{(Math.abs(user.totalPnL) + 2500).toLocaleString()}</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Net P&L</div>
                  <div className={`text-2xl font-bold ${user.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {user.totalPnL >= 0 ? '+' : ''}₹{user.totalPnL.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Money
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Minus className="h-5 w-5 mr-2" />
                  Withdraw
                </button>
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Add Money to Wallet</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-3" />
                      <div className="flex-1">
                        <div className="text-white font-medium">UPI</div>
                        <div className="text-slate-400 text-sm">Instant deposit</div>
                      </div>
                      <div className="text-green-400 text-sm">Recommended</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    amount && parseFloat(amount) > 0 && !isProcessing
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? 'Processing...' : `Deposit ₹${amount ? parseFloat(amount).toLocaleString() : '0'}`}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Withdraw Money</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max={user.walletBalance}
                  />
                  <div className="text-slate-400 text-sm mt-1">
                    Available: ₹{user.walletBalance.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > user.walletBalance || isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    amount && parseFloat(amount) > 0 && parseFloat(amount) <= user.walletBalance && !isProcessing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? 'Processing...' : `Withdraw ₹${amount ? parseFloat(amount).toLocaleString() : '0'}`}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <div className="text-slate-400">No transactions yet</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'deposit' ? 'bg-green-600 bg-opacity-20' :
                          transaction.type === 'buy' ? 'bg-blue-600 bg-opacity-20' :
                          transaction.type === 'sell' ? 'bg-purple-600 bg-opacity-20' :
                          'bg-red-600 bg-opacity-20'
                        }`}>
                          {transaction.type === 'deposit' ? <Plus className="h-4 w-4 text-green-400" /> :
                           transaction.type === 'buy' ? <TrendingUp className="h-4 w-4 text-blue-400" /> :
                           transaction.type === 'sell' ? <TrendingUp className="h-4 w-4 text-purple-400" /> :
                           <Minus className="h-4 w-4 text-red-400" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">{transaction.description}</div>
                          <div className="text-slate-400 text-sm">
                            {transaction.createdAt.toLocaleDateString()} {transaction.createdAt.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};