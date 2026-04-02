'use client';

import React from 'react';
import useSWR from 'swr';
import SparklineChart from './SparklineChart';
import styles from './AssetCard.module.css';

interface AssetCardProps {
  symbol: string;
  name: string;
  timeframe: string;
  colorTheme: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AssetCard({ symbol, name, timeframe, colorTheme }: AssetCardProps) {
  // Pass timeframe and symbol to our API proxy
  // Use SWR to auto-refresh every 60s when on '1D'
  const isIntraday = timeframe === '1D';
  const { data, error, isLoading } = useSWR(
    `/api/market-data?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}`,
    fetcher,
    { refreshInterval: isIntraday ? 60000 : 0 } // Refresh every 60s only for 1D
  );

  const formatPrice = (price?: number) => {
    if (price == null || isNaN(price)) return '--.--';
    if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price.toFixed(2);
  };

  const hasData = data && !data.error && data.currentPrice !== undefined;
  const isPositive = data?.changePercent >= 0;
  // Use the custom colors requested by the user for positive/negative numbers
  const pctClass = isPositive ? 'pill-green' : 'pill-red';
  const pctSign = isPositive ? '+' : '';

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.assetInfo}>
          <div className={styles.iconCircle} style={{ borderColor: colorTheme }}>
           <span style={{ color: colorTheme }}>{symbol.substring(0,1).toUpperCase()}</span>
          </div>
          <div>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.symbol}>{symbol}</p>
          </div>
        </div>
        {isLoading && <div className={styles.loading}>•</div>}
      </div>

      <div className={styles.priceContainer}>
        {hasData ? (
          <>
            <h2 className={styles.price}>${formatPrice(data.currentPrice)}</h2>
            <div className={pctClass}>
              {pctSign}{(data.changePercent || 0).toFixed(2)}%
            </div>
          </>
        ) : (
          <h2 className={styles.price}>--.--</h2>
        )}
      </div>

      <div className={styles.chartContainer}>
        {hasData && data.prices && (
          <SparklineChart 
            data={data.prices} 
            color={colorTheme} 
            isPositive={isPositive} 
          />
        )}
      </div>
    </div>
  );
}
