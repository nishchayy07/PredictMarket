import { useState, useEffect } from 'react';
import { Event } from '../types';

const DEMO_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Will Bitcoin cross $100,000 by December 2024?',
    description: 'Will the price of Bitcoin reach or exceed $100,000 USD by December 31st, 2024?',
    category: 'Cryptocurrency',
    endDate: new Date('2024-12-31'),
    totalVolume: 85420,
    yesPrice: 0.68,
    noPrice: 0.32,
    yesShares: 58000,
    noShares: 27420,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400&h=250',
    tags: ['crypto', 'bitcoin', 'finance']
  },
  {
    id: '2',
    title: 'Will India win the Cricket World Cup 2024?',
    description: 'Will Team India be crowned champions of the ICC Cricket World Cup 2024?',
    category: 'Sports',
    endDate: new Date('2024-11-15'),
    totalVolume: 124350,
    yesPrice: 0.45,
    noPrice: 0.55,
    yesShares: 55958,
    noShares: 68392,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=400&h=250',
    tags: ['cricket', 'sports', 'india']
  },
  {
    id: '3',
    title: 'Will Tesla stock price exceed $300 by year-end?',
    description: 'Will Tesla (TSLA) stock price close above $300 on the last trading day of 2024?',
    category: 'Stocks',
    endDate: new Date('2024-12-31'),
    totalVolume: 67890,
    yesPrice: 0.72,
    noPrice: 0.28,
    yesShares: 48880,
    noShares: 19010,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/258083/pexels-photo-258083.jpeg?auto=compress&cs=tinysrgb&w=400&h=250',
    tags: ['tesla', 'stocks', 'ev']
  },
  {
    id: '4',
    title: 'Will it rain in Mumbai on Diwali 2024?',
    description: 'Will there be recorded rainfall in Mumbai on Diwali day (November 1st, 2024)?',
    category: 'Weather',
    endDate: new Date('2024-11-01'),
    totalVolume: 23450,
    yesPrice: 0.15,
    noPrice: 0.85,
    yesShares: 3518,
    noShares: 19932,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=400&h=250',
    tags: ['weather', 'mumbai', 'diwali']
  },
  {
    id: '5',
    title: 'Will OpenAI release GPT-5 in 2024?',
    description: 'Will OpenAI officially announce and release GPT-5 model before December 31st, 2024?',
    category: 'Technology',
    endDate: new Date('2024-12-31'),
    totalVolume: 156780,
    yesPrice: 0.38,
    noPrice: 0.62,
    yesShares: 59576,
    noShares: 97204,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=250',
    tags: ['ai', 'openai', 'gpt']
  },
  {
    id: '6',
    title: 'Will Nifty 50 cross 25,000 by March 2025?',
    description: 'Will the Nifty 50 index close above 25,000 points by March 31st, 2025?',
    category: 'Markets',
    endDate: new Date('2025-03-31'),
    totalVolume: 98750,
    yesPrice: 0.58,
    noPrice: 0.42,
    yesShares: 57275,
    noShares: 41475,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=400&h=250',
    tags: ['nifty', 'stocks', 'india']
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setEvents(DEMO_EVENTS);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prevEvents => 
        prevEvents.map(event => ({
          ...event,
          yesPrice: Math.max(0.01, Math.min(0.99, event.yesPrice + (Math.random() - 0.5) * 0.02)),
          noPrice: Math.max(0.01, Math.min(0.99, event.noPrice + (Math.random() - 0.5) * 0.02)),
          totalVolume: event.totalVolume + Math.floor(Math.random() * 100)
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { events, isLoading };
};