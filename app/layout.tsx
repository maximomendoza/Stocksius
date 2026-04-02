import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OMEGA Watchlist',
  description: 'Personal stock and crypto watchlist dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
