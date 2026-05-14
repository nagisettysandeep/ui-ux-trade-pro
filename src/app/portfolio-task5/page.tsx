"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function StrategyBuilder() {
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState({ qty: 0 });
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [isAutoTrade, setIsAutoTrade] = useState(false);
  const transactionCost = 5;
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const lastPrice = prev.length > 0 ? prev[prev.length - 1] : 150;
        const newPrice = lastPrice + (Math.random() - 0.5) * 5;
        const updatedHistory = [...prev, newPrice].slice(-20);
        if (isAutoTrade && updatedHistory.length > 5) {
          const sma = updatedHistory.slice(-5).reduce((a, b) => a + b) / 5;
          if (newPrice > sma && balance > (newPrice + transactionCost)) {
            executeTrade('BUY', newPrice);
          } else if (newPrice < sma && holdings.qty > 0) {
            executeTrade('SELL', newPrice);
          }
        }
        return updatedHistory;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoTrade, balance, holdings.qty]);
  const executeTrade = (type: 'BUY' | 'SELL', currentPrice: number) => {
    if (type === 'BUY') {
      setBalance(prev => prev - currentPrice - transactionCost);
      setHoldings(prev => ({ qty: prev.qty + 1 }));
    } else {
      setBalance(prev => prev + currentPrice - transactionCost);
      setHoldings(prev => ({ qty: prev.qty - 1 }));
    }
  };
  const currentPrice = priceHistory[priceHistory.length - 1] || 150;
  const smaValue = priceHistory.length >= 5 ? (priceHistory.slice(-5).reduce((a, b) => a + b) / 5) : 0;
  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#111', padding: '20px', borderRadius: '12px' }}>
        <h2>Task 5: Strategy & Indicators</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', background: '#222', padding: '15px' }}>
          <div>
            <p>Cash: ${balance.toFixed(2)}</p>
            <p>Holdings: {holdings.qty} units</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>Market Price: ${currentPrice.toFixed(2)}</p>
            <p style={{ color: '#00e396' }}>SMA (5-period): ${smaValue.toFixed(2)}</p>
          </div>
        </div>
        {/* Strategy Controls */}
        <div style={{ background: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4>Strategy Builder</h4>
          <p style={{ fontSize: '0.9rem' }}>Rule: Buy if Price &gt; SMA, Sell if Price &lt; SMA</p>
          <button 
            onClick={() => setIsAutoTrade(!isAutoTrade)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: isAutoTrade ? '#ef4444' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
            }}
          >
            {isAutoTrade ? "STOP AUTO-TRADE" : "START AUTO-TRADE"}
          </button>
        </div>
        <p>Monitor the portfolio impact in real-time as the strategy executes trades based on the moving average indicator.</p>
      </div>
    </div>
  );
}