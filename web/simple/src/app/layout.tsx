import { Roboto } from 'next/font/google';
import { twMerge } from 'tailwind-merge';

import type { Metadata } from 'next';

import './globals.css';

const roboto = Roboto({ subsets: ['latin'], weight: '300' });

export const metadata: Metadata = {
  title: 'Alpha AI Avatar Test Client',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={twMerge('min-h-dvh bg-slate-900 text-white', roboto.className)}>{children}</body>
    </html>
  );
}
