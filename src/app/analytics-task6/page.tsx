"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function AnalyticsDashboard() {
  const [prices, setPrices] = useState<number[]>([]);
  const [showRSI, setShowRSI] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const last = prev.length > 0 ? prev[prev.length - 1] : 150;
        const next = last + (Math.random() - 0.5) * 10;
        return [...prev, next].slice(-50); 
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const calculateSMA = (period: number) => {
    if (prices.length < period) return [];
    return prices.map((_, i) => {
      if (i < period) return null;
      const slice = prices.slice(i - period, i);
      return slice.reduce((a, b) => a + b) / period;
    });
  };
  const calculateRSI = (period: number) => {
    if (prices.length < period + 1) return [];
    let gains = 0, losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) gains += diff; else losses -= diff;
    }
    const rsiValues = new Array(period).fill(null);
    for (let i = period; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      const currentGain = diff > 0 ? diff : 0;
      const currentLoss = diff < 0 ? -diff : 0;
      gains = (gains * (period - 1) + currentGain) / period;
      losses = (losses * (period - 1) + currentLoss) / period;
      const rs = losses === 0 ? 100 : gains / losses;
      rsiValues.push(100 - (100 / (1 + rs)));
    }
    return rsiValues;
  };
  const volatility = prices.length > 2 ? 
    Math.sqrt(prices.map(x => Math.pow(x - (prices.reduce((a,b)=>a+b)/prices.length), 2)).reduce((a,b)=>a+b)/prices.length) : 0;
  const mainSeries = [
    { name: 'Price', data: prices },
    showSMA ? { name: 'SMA (14)', data: calculateSMA(14) } : { name: 'SMA (14)', data: [] }
  ];
  return (
    <div style={{ padding: '20px', background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <h2>Task 6: Advanced Analytics</h2>
      {/* Customization Panel */}
      <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <label><input type="checkbox" checked={showSMA} onChange={() => setShowSMA(!showSMA)} /> Show SMA</label>
        <label><input type="checkbox" checked={showRSI} onChange={() => setShowRSI(!showRSI)} /> Show RSI</label>
        <div style={{ marginLeft: 'auto', color: '#ff4560' }}>Current Volatility: {volatility.toFixed(4)}</div>
      </div>
      <div style={{ background: '#111', padding: '20px', borderRadius: '15px' }}>
        <Chart options={{ chart: { theme: 'dark', background: 'transparent' }, stroke: { curve: 'smooth', width: [3, 2] } }} 
               series={mainSeries} type="line" height={350} />
        {showRSI && (
          <div style={{ marginTop: '20px' }}>
            <h4>Momentum (RSI)</h4>
            <Chart options={{ chart: { theme: 'dark' }, yaxis: { min: 0, max: 100 }, annotations: { yaxis: [{ y: 70, borderColor: '#ff4560' }, { y: 30, borderColor: '#00e396' }] } }} 
                   series={[{ name: 'RSI', data: calculateRSI(14) }]} type="area" height={200} />
          </div>
        )}
      </div>
    </div>
  );
}