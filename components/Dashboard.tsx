'use client';

import React, { useState } from 'react';
import AssetCard from './AssetCard';
import BenchmarkRow from './BenchmarkRow';
import styles from './Dashboard.module.css';

const ASSETS = [
  { symbol: 'AAPL', name: 'Apple', colorTheme: 'var(--color-aapl)' },
  { symbol: 'AMZN', name: 'Amazon', colorTheme: 'var(--color-amzn)' },
  { symbol: 'NVDA', name: 'Nvidia', colorTheme: 'var(--color-nvda)' },
  { symbol: 'TSLA', name: 'Tesla', colorTheme: 'var(--color-tsla)' },
  { symbol: 'BTC-USD', name: 'Bitcoin', colorTheme: 'var(--color-btc)' },
];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('1D');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.logo}>Ω</div>
          <h1>OMEGA Watchlist</h1>
        </div>
        <div className={styles.timeframeToggle}>
          {['1D', '1M', '12M'].map((tf) => (
            <button
              key={tf}
              className={`${styles.tfButton} ${timeframe === tf ? styles.active : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </header>

      <BenchmarkRow timeframe={timeframe} />

      <div className={styles.grid}>
        {ASSETS.map((asset) => (
          <AssetCard
            key={asset.symbol}
            symbol={asset.symbol}
            name={asset.name}
            timeframe={timeframe}
            colorTheme={asset.colorTheme}
          />
        ))}
      </div>
    </div>
  );
}
