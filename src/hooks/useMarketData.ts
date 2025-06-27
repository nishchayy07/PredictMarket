import { useState, useEffect } from 'react';

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
}

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
}

export const useMarketData = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch crypto prices from CoinGecko (free API)
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,solana&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();
      
      const prices: CryptoPrice[] = [
        {
          symbol: 'BTC',
          price: data.bitcoin?.usd || 0,
          change24h: data.bitcoin?.usd_24h_change || 0
        },
        {
          symbol: 'ETH',
          price: data.ethereum?.usd || 0,
          change24h: data.ethereum?.usd_24h_change || 0
        },
        {
          symbol: 'ADA',
          price: data.cardano?.usd || 0,
          change24h: data.cardano?.usd_24h_change || 0
        },
        {
          symbol: 'SOL',
          price: data.solana?.usd || 0,
          change24h: data.solana?.usd_24h_change || 0
        }
      ];
      
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Fallback to demo data
      setCryptoPrices([
        { symbol: 'BTC', price: 95420, change24h: 2.5 },
        { symbol: 'ETH', price: 3650, change24h: -1.2 },
        { symbol: 'ADA', price: 0.85, change24h: 4.1 },
        { symbol: 'SOL', price: 185, change24h: 3.8 }
      ]);
    }
  };

  // Simulate stock prices (using demo data as most free APIs have limitations)
  const generateStockPrices = () => {
    const stocks = [
      { symbol: 'TSLA', basePrice: 285 },
      { symbol: 'AAPL', basePrice: 195 },
      { symbol: 'GOOGL', basePrice: 165 },
      { symbol: 'MSFT', basePrice: 420 }
    ];

    const prices: StockPrice[] = stocks.map(stock => ({
      symbol: stock.symbol,
      price: stock.basePrice + (Math.random() - 0.5) * 20,
      change: (Math.random() - 0.5) * 10
    }));

    setStockPrices(prices);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchCryptoPrices();
      generateStockPrices();
      setIsLoading(false);
    };

    fetchData();

    // Update crypto prices every 30 seconds
    const cryptoInterval = setInterval(fetchCryptoPrices, 30000);
    
    // Update stock prices every 10 seconds (simulated)
    const stockInterval = setInterval(generateStockPrices, 10000);

    return () => {
      clearInterval(cryptoInterval);
      clearInterval(stockInterval);
    };
  }, []);

  return { cryptoPrices, stockPrices, isLoading };
};