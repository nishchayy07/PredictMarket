import React, { useState } from 'react';
import { User, Wallet, TrendingUp, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MarketTicker } from './MarketTicker';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'events', label: 'Events', icon: TrendingUp },
    { id: 'portfolio', label: 'Portfolio', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">PredictMarket</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Info */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-green-400">₹{user.walletBalance.toLocaleString()}</div>
                  </div>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
                    alt={user.name}
                  />
                  <button
                    onClick={logout}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
              {user && (
                <div className="px-3 py-2 border-t border-slate-600 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-medium text-white">{user.name}</div>
                      <div className="text-sm text-green-400">₹{user.walletBalance.toLocaleString()}</div>
                    </div>
                    <button
                      onClick={logout}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Market Ticker */}
      <MarketTicker />
    </>
  );
};