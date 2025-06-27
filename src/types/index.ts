export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  totalPnL: number;
  rank: number;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: Date;
  totalVolume: number;
  yesPrice: number;
  noPrice: number;
  yesShares: number;
  noShares: number;
  status: 'active' | 'ended' | 'settled';
  imageUrl?: string;
  tags: string[];
}

export interface Order {
  id: string;
  eventId: string;
  userId: string;
  type: 'yes' | 'no';
  orderType: 'market' | 'limit';
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
}

export interface Portfolio {
  eventId: string;
  eventTitle: string;
  yesShares: number;
  noShares: number;
  avgYesPrice: number;
  avgNoPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  createdAt: Date;
}