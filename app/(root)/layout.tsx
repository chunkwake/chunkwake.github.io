import { Inter, JetBrains_Mono } from 'next/font/google';
import '../global.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${mono.variable} dark`}
      data-scroll-behavior="smooth"
    >
      <body className="cw-body">{children}</body>
    </html>
  );
}
