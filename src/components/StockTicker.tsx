"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
}

const StockTicker = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stock data - in production, fetch from real API
  const mockStockData: StockData[] = [
    {
      symbol: "NIFTY",
      price: 19674.55,
      change: 112.35,
      changePercent: 0.57,
      name: "Nifty 50"
    },
    {
      symbol: "SENSEX",
      price: 66023.24,
      change: 289.64,
      changePercent: 0.44,
      name: "BSE Sensex"
    },
    {
      symbol: "RELIANCE",
      price: 2456.75,
      change: -18.25,
      changePercent: -0.74,
      name: "Reliance Industries"
    },
    {
      symbol: "TCS",
      price: 3824.60,
      change: 42.80,
      changePercent: 1.13,
      name: "Tata Consultancy Services"
    },
    {
      symbol: "INFY",
      price: 1567.95,
      change: 15.20,
      changePercent: 0.98,
      name: "Infosys Limited"
    },
    {
      symbol: "HDFC",
      price: 1678.40,
      change: -12.60,
      changePercent: -0.74,
      name: "HDFC Bank"
    },
    {
      symbol: "ITC",
      price: 445.30,
      change: 3.85,
      changePercent: 0.87,
      name: "ITC Limited"
    },
    {
      symbol: "BHARTIARTL",
      price: 924.15,
      change: -8.45,
      changePercent: -0.91,
      name: "Bharti Airtel"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchStocks = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStocks(mockStockData);
      setIsLoading(false);
    };

    fetchStocks();

    // Update stocks every 30 seconds
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(Math.abs(change))}`;
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-card border-y border-border overflow-hidden">
        <div className="flex items-center h-12 px-4">
          <div className="flex space-x-6 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-y border-border overflow-hidden relative">
      {/* Desktop/Tablet View */}
      <div className="hidden md:block">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 60,
              ease: "linear",
            },
          }}
          className="flex items-center h-12 whitespace-nowrap"
        >
          {stocks.concat(stocks).map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="flex items-center px-6 text-sm"
            >
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-foreground">
                  {stock.symbol}
                </span>
                <span className="text-muted-foreground">
                  ₹{formatPrice(stock.price)}
                </span>
                <div className={`flex items-center space-x-1 ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="font-medium">
                    {formatChange(stock.change)}
                  </span>
                  <span className="text-xs">
                    ({formatPercent(stock.changePercent)})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile View - Swipeable cards */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto scrollbar-hide py-3 px-4 space-x-4">
          {stocks.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 bg-muted/30 rounded-lg p-3 min-w-[140px]"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">
                    {stock.symbol}
                  </span>
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                </div>
                <div className="text-sm font-medium text-foreground">
                  ₹{formatPrice(stock.price)}
                </div>
                <div className={`text-xs ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-muted-foreground font-medium">LIVE</span>
      </div>
    </div>
  );
};

export default StockTicker;