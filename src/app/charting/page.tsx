"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function MultiAssetDashboard() {
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [assets, setAssets] = useState({
    stocks: { visible: true, type: 'line' as any },
    bonds: { visible: true, type: 'area' as any },
    crypto: { visible: true, type: 'candlestick' as any },
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString();
      setDataPoints(prev => {
        const lastPrice = prev.length > 0 ? prev[prev.length - 1].c : 1000;
        const open = lastPrice;
        const close = open + (Math.random() - 0.5) * 40;
        const high = Math.max(open, close) + Math.random() * 10;
        const low = Math.min(open, close) - Math.random() * 10;
        const newData = [...prev, {
          x: newTime,
          y: [open, high, low, close],
          stocks: Math.floor(Math.random() * 100) + 200,
          bonds: Math.floor(Math.random() * 50) + 100,
          c: close
        }];
        return newData.slice(-15); 
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const series = [
    { name: 'Stocks', type: assets.stocks.type, data: dataPoints.map(d => ({ x: d.x, y: d.stocks })), hide: !assets.stocks.visible },
    { name: 'Bonds', type: assets.bonds.type, data: dataPoints.map(d => ({ x: d.x, y: d.bonds })), hide: !assets.bonds.visible },
    { name: 'Crypto', type: assets.crypto.type, data: dataPoints.map(d => ({ x: d.x, y: d.y })), hide: !assets.crypto.visible },
  ].filter(s => !s.hide);
  const chartOptions: any = {
    chart: { id: 'multi-asset', background: 'transparent' },
    xaxis: { type: 'category', labels: { style: { colors: '#fff' } } },
    yaxis: { labels: { style: { colors: '#fff' } } },
    theme: { mode: 'dark' },
    plotOptions: { candlestick: { colors: { upward: '#10b981', downward: '#ef4444' } } }
  };
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Multi-Asset Analytical Environment</h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.keys(assets).map((key) => (
            <div key={key} style={{ background: '#222', padding: '15px', borderRadius: '10px' }}>
              <input 
                type="checkbox" 
                checked={assets[key as keyof typeof assets].visible} 
                onChange={() => setAssets({...assets, [key]: {...assets[key as keyof typeof assets], visible: !assets[key as keyof typeof assets].visible}})}
              />
              <span style={{ margin: '0 10px', textTransform: 'capitalize' }}>{key}</span>
              <select 
                value={assets[key as keyof typeof assets].type}
                onChange={(e) => setAssets({...assets, [key]: {...assets[key as keyof typeof assets], type: e.target.value}})}
                style={{ background: '#333', color: '#fff', border: 'none', padding: '5px' }}
              >
                <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="bar">Bar</option>
                <option value="candlestick">Candlestick</option>
              </select>
            </div>
          ))}
        </div>
        <Chart options={chartOptions} series={series} type="line" height={450} />
      </div>
    </div>
  );
}