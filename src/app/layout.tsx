import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/Providers';
import StorefrontShell from '@/components/layout/StorefrontShell';
import ToastContainer from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Voltech — Premium Electronics',
    template: '%s | Voltech',
  },
  description:
    'Premium consumer electronics, thoughtfully curated for people who care about quality, design, and performance.',
  keywords: ['electronics', 'headphones', 'laptops', 'smartphones', 'premium', 'tech'],
  openGraph: {
    title: 'Voltech — Premium Electronics',
    description: 'Premium consumer electronics, curated for modern life.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7F6F1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          <StorefrontShell />
          <ToastContainer />
          <main className="w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
