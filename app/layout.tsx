import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FindCheck — ابحث، قارن، تحقّق',
  description: 'محرك عالمي للعثور على الخيارات ومقارنتها والتحقق من الأدلة.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
