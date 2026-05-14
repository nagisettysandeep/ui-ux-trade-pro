"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function PatternRecognitionDashboard() {
  const [dataPoints, setDataPoints] = useState<any[]>([]);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const detectPattern = (data: any[]) => {
    if (data.length < 2) return null;
    const current = data[data.length - 1];
    const [o, h, l, c] = current.y;
    const bodySize = Math.abs(o - c);
    const totalSize = h - l;
    if (bodySize <= totalSize * 0.1) return { text: "DOJI (Indecision)", color: "#feb019" };
    const lowerWick = Math.min(o, c) - l;
    if (lowerWick >= bodySize * 2 && (h - Math.max(o, c)) < bodySize * 0.5) {
      return { text: "HAMMER (Bullish Reversal)", color: "#00e396" };
    }
    return null;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString();
      setDataPoints(prev => {
        const lastPrice = prev.length > 0 ? prev[prev.length - 1].y[3] : 1000;
        const o = lastPrice;
        const c = o + (Math.random() - 0.5) * 40;
        const h = Math.max(o, c) + Math.random() * 10;
        const l = Math.min(o, c) - Math.random() * 10;
        const newNode = { x: newTime, y: [o, h, l, c] };
        const pattern = detectPattern([...prev, newNode]);
        if (pattern) {
          setAnnotations(a => [...a, {
            x: newTime,
            borderColor: pattern.color,
            label: { text: pattern.text, style: { color: "#fff", background: pattern.color } }
          }].slice(-5)); 
        }
      return [...prev, newNode].slice(-20);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
    const chartOptions: any = {
    chart: { type: 'candlestick', theme: 'dark', background: '#111' },
    annotations: { points: annotations }, 
    xaxis: { labels: { style: { colors: '#fff' } } },
    yaxis: { labels: { style: { colors: '#fff' } } }
  };
  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh' }}>
      <h2 style={{ color: '#fff', textAlign: 'center' }}>AI Pattern Recognition Terminal</h2>
      <div style={{ background: '#111', padding: '20px', borderRadius: '15px' }}>
        <Chart options={chartOptions} series={[{ data: dataPoints }]} type="candlestick" height={500} />
      </div>
      <div style={{ color: '#888', marginTop: '20px', textAlign: 'center' }}>
        <p>Currently monitoring for: <strong>Hammer, Doji</strong></p>
      </div>
    </div>
  );
}