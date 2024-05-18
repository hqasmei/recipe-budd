import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from 'sonner';

import '../styles/globals.css';

import { cn } from '@/lib/utils';

import { Footer } from './_components/footer';
import { Header } from './_components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'RecipeBudd', template: '%s | RecipeBudd' },
  description: 'Capture, Cook, Create',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className,
        )}
      >
        <div className="flex flex-col w-full h-screen flex-1 bg-[#FEFEF1]">
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
          <Toaster position="top-center" richColors />
        </div>
      </body>
    </html>
  );
}
