import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';

import { ILayout } from '@/interfaces/ILayout';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EVA | الأمن والحماية | قريباً',
  description: 'EVA متخصصة في حلول الأمن المتقدمة. موقعنا قيد الصيانة حالياً.',
};


export default async function RootLayout({ children }: Readonly<ILayout>) {


  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
              <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}