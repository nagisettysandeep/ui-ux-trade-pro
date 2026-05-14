"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function PortfolioSimulator() {
  const [balance, setBalance] = useState(10000); 
  const [holdings, setHoldings] = useState<any>({}); 
  const [history, setHistory] = useState<any[]>([]); 
  const [marketPrice, setMarketPrice] = useState(150);
  const [quantity, setQuantity] = useState(1);
  const transactionCost = 5; 
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrice(prev => prev + (Math.random() - 0.5) * 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const handleTrade = (type: 'BUY' | 'SELL') => {
    const totalCost = (marketPrice * quantity) + (type === 'BUY' ? transactionCost : 0);
    if (type === 'BUY' && balance >= totalCost) {
      setBalance(prev => prev - totalCost);
      setHoldings((prev: any) => ({
        ...prev,
        'STOCK': {
          qty: (prev['STOCK']?.qty || 0) + quantity,
          avgCost: marketPrice
        }
      }));
      setHistory(prev => [{ type: 'BUY', price: marketPrice, qty: quantity, date: new Date().toLocaleTimeString() }, ...prev]);
    } else if (type === 'SELL' && (holdings['STOCK']?.qty || 0) >= quantity) {
      setBalance(prev => prev + (marketPrice * quantity) - transactionCost);
      setHoldings((prev: any) => ({
        ...prev,
        'STOCK': { ...prev['STOCK'], qty: prev['STOCK'].qty - quantity }
      }));
      setHistory(prev => [{ type: 'SELL', price: marketPrice, qty: quantity, date: new Date().toLocaleTimeString() }, ...prev]);
    }
  };
  const currentValuation = (holdings['STOCK']?.qty || 0) * marketPrice;
  const totalPortfolioValue = balance + currentValuation;
  const chartOptions: any = { labels: ['Cash', 'Stock Holdings'], theme: { mode: 'dark' } };
  const series = [balance, currentValuation];
  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#111', padding: '20px', borderRadius: '12px' }}>
        <h2>Portfolio Simulator</h2>
        {/* Real-time Tracking Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: '#222', padding: '15px', borderRadius: '8px' }}>
            <p>Cash Balance: ${balance.toFixed(2)}</p>
            <h3>Total Value: ${totalPortfolioValue.toFixed(2)}</h3>
          </div>
          <Chart options={chartOptions} series={series} type="pie" width="300" />
        </div>
        {/* Trading Panel */}
        <div style={{ background: '#222', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4>Trade "STOCK" at ${marketPrice.toFixed(2)}</h4>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
            style={{ padding: '8px', marginRight: '10px', background: '#333', color: '#fff', border: 'none' }}
          />
          <button onClick={() => handleTrade('BUY')} style={{ padding: '8px 20px', background: 'green', color: 'white', marginRight: '5px' }}>BUY</button>
          <button onClick={() => handleTrade('SELL')} style={{ padding: '8px 20px', background: 'red', color: 'white' }}>SELL</button>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>* $5.00 transaction fee applies per trade</p>
        </div>
        {/* History / Records */}
        <h4>Transaction History</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#0a0a0a', padding: '10px' }}>
          {history.map((h, i) => (
            <div key={i} style={{ borderBottom: '1px solid #333', padding: '5px 0' }}>
              {h.date}: {h.type} {h.qty} shares @ ${h.price.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}