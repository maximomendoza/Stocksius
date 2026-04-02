'use client';

import React, { useState } from 'react';
import AssetCard from './AssetCard';
import BenchmarkRow from './BenchmarkRow';
import MainChart from './MainChart';
import AIChat from './AIChat';
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
  const [selectedSymbol, setSelectedSymbol] = useState(ASSETS[0].symbol);

  const selectedAsset = ASSETS.find(a => a.symbol === selectedSymbol) || ASSETS[0];

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
            isSelected={asset.symbol === selectedAsset.symbol}
            onClick={() => setSelectedSymbol(asset.symbol)}
          />
        ))}
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.chartArea}>
          <MainChart 
            symbol={selectedAsset.symbol} 
            name={selectedAsset.name} 
            timeframe={timeframe} 
            colorTheme={selectedAsset.colorTheme} 
          />
        </div>
        <div className={styles.chatArea}>
          <AIChat 
            context={`User is currently looking at ${selectedAsset.name} (${selectedAsset.symbol}). Timeframe is ${timeframe}. Overall watchlist includes AAPL, AMZN, NVDA, TSLA, BTC-USD.`} 
          />
        </div>
      </div>
    </div>
  );
}
