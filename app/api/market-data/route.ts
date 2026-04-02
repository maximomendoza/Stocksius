import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const timeframe = searchParams.get('timeframe') || '1D';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    let period1: Date;
    let interval: "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo";
    
    const now = new Date();
    if (timeframe === '1D') {
      // 1 day range, 15m intervals
      period1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      interval = '15m';
    } else if (timeframe === '1M') {
      // 1 month range, 1d intervals
      period1 = new Date(now);
      period1.setMonth(now.getMonth() - 1);
      interval = '1d';
    } else if (timeframe === '12M') {
      // 1 year range, 1wk intervals
      period1 = new Date(now);
      period1.setFullYear(now.getFullYear() - 1);
      interval = '1wk';
    } else {
      period1 = new Date(now);
      period1.setMonth(now.getMonth() - 1);
      interval = '1d';
    }

    const [rawChartData, rawQuote] = await Promise.all([
      yahooFinance.chart(symbol, { period1, interval }),
      yahooFinance.quote(symbol)
    ]);

    const quote = rawQuote as any;
    const chartData = rawChartData as any;

    // Use latest quote for more accurate instant data
    const currentPrice = quote.regularMarketPrice;
    
    // Determine the baseline price to calculate the timeframe-specific change percent
    // If quote has a pre/post market, we simply use the chart data's earliest point for the custom timeframe
    let changePercent = quote.regularMarketChangePercent;
    
    if (timeframe !== '1D' && chartData.quotes.length > 0) {
      const startPrice = chartData.quotes[0].close;
      if (startPrice) {
        changePercent = ((currentPrice - startPrice) / startPrice) * 100;
      }
    }

    // Filter out null closes
    const prices = chartData.quotes
      .filter((q: any) => q.close !== null)
      .map((q: any) => ({
        date: q.date,
        close: q.close
      }));

    return NextResponse.json({
      symbol,
      prices,
      currentPrice,
      changePercent,
    });

  } catch (error: any) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
