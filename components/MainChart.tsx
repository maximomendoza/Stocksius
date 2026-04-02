'use client';

import React from 'react';
import useSWR from 'swr';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './MainChart.module.css';

interface MainChartProps {
  symbol: string;
  name: string;
  timeframe: string;
  colorTheme: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MainChart({ symbol, name, timeframe, colorTheme }: MainChartProps) {
  const isIntraday = timeframe === '1D';
  const { data, error, isLoading } = useSWR(
    `/api/market-data?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}`,
    fetcher,
    { refreshInterval: isIntraday ? 60000 : 0 }
  );

  const hasData = data && !data.error && data.prices && data.prices.length > 0;
  const isPositive = data?.changePercent >= 0;

  let min = 0;
  let max = 0;
  let buffer = 0;
  if (hasData) {
    min = Math.min(...data.prices.map((d: any) => d.close));
    max = Math.max(...data.prices.map((d: any) => d.close));
    buffer = (max - min) * 0.1;
  }

  const gradientId = `colorMain-${symbol.replace(/[^a-zA-Z]/g, '')}`;

  return (
    <div className={`glass-panel ${styles.container}`} style={{ borderColor: `${colorTheme}44` }}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{name} <span className={styles.symbol}>{symbol}</span></h2>
        </div>
        {hasData && (
          <div className={styles.priceInfo}>
            <span className={styles.currentPrice}>${data.currentPrice.toFixed(2)}</span>
            <span className={isPositive ? 'pill-green' : 'pill-red'}>
              {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      <div className={styles.chartWrapper}>
        {isLoading && !hasData ? (
          <div className={styles.loading}>Loading chart data...</div>
        ) : !hasData ? (
          <div className={styles.loading}>No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.prices} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorTheme} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={colorTheme} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return isIntraday 
                    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }} 
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                minTickGap={30}
              />
              <YAxis 
                domain={[min - buffer, max + buffer]} 
                tickFormatter={(val) => `$${val.toFixed(2)}`}
                stroke="rgba(255,255,255,0)"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-card-hover)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  color: 'white'
                }}
                itemStyle={{ color: 'white', fontWeight: 'bold' }}
                labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                labelFormatter={(label) => {
                  const d = new Date(label);
                  return isIntraday 
                    ? d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
                }}
              />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke={colorTheme} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#${gradientId})`} 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
