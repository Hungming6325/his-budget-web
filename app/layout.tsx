import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HIS 研究計畫預算建檔',
  description: '研究計畫案號產生、基本資料與經費預算建檔工作台',
  icons: {
    icon: '/cgust-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
