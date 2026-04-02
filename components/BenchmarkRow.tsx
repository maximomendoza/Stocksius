'use client';

import React from 'react';
import useSWR from 'swr';
import SparklineChart from './SparklineChart';
import styles from './BenchmarkRow.module.css';

interface BenchmarkRowProps {
  timeframe: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BenchmarkRow({ timeframe }: BenchmarkRowProps) {
  const isIntraday = timeframe === '1D';
  const { data, isLoading } = useSWR(
    `/api/market-data?symbol=^GSPC&timeframe=${timeframe}`,
    fetcher,
    { refreshInterval: isIntraday ? 60000 : 0 }
  );

  const formatPrice = (price?: number) => {
    if (price == null || isNaN(price)) return '--.--';
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const hasData = data && !data.error && data.currentPrice !== undefined;
  const isPositive = data?.changePercent >= 0;
  const pctClass = isPositive ? 'pill-green' : 'pill-red';
  const pctSign = isPositive ? '+' : '';

  return (
    <div className={`glass-panel ${styles.benchmarkRow}`}>
      <div className={styles.leftCol}>
        <div className={styles.iconCircle}>
          <span>S&P</span>
        </div>
        <div>
          <h3 className={styles.name}>S&P 500 Benchmark</h3>
          <p className={styles.symbol}>^GSPC</p>
        </div>
      </div>

      <div className={styles.centerCol}>
        {hasData ? (
          <>
            <h2 className={styles.price}>{formatPrice(data.currentPrice)}Pts</h2>
            <div className={pctClass}>
              {pctSign}{(data.changePercent || 0).toFixed(2)}%
            </div>
          </>
        ) : (
          <h2 className={styles.price}>--.--</h2>
        )}
      </div>

      <div className={styles.rightCol}>
        {hasData && data.prices && (
          <SparklineChart 
            data={data.prices} 
            color="#ffffff" 
            isPositive={isPositive} 
          />
        )}
      </div>
    </div>
  );
}
