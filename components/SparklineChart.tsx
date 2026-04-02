'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineChartProps {
  data: { date: Date; close: number }[];
  color: string;
  isPositive: boolean;
}

export default function SparklineChart({ data, color, isPositive }: SparklineChartProps) {
  // If no data, show empty
  if (!data || data.length === 0) {
    return <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>No data</div>;
  }

  // Calculate min/max for domain to make sparkline tight
  const min = Math.min(...data.map(d => d.close));
  const max = Math.max(...data.map(d => d.close));
  
  // slightly buffer domain
  const buffer = (max - min) * 0.1;

  // Use the green/red color if requested by the user's specific palette for trends, 
  // or use the asset's specific brand color. Let's use the asset color for the line itself with a gradient.
  const gradientId = `colorUv-${color.replace('#', '')}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[min - buffer, max + buffer]} hide />
        <Area 
          type="monotone" 
          dataKey="close" 
          stroke={color} 
          strokeWidth={2}
          fillOpacity={1} 
          fill={`url(#${gradientId})`} 
          isAnimationActive={false} // Disable animation for standard sparklines on refresh
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
