import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import TranslationsProvider from '@/i18n/TranslationsProvider';
import i18nConfig from '@/i18n/i18nConfig';
import { ILayout } from '@/interfaces/ILayout';
import initTranslation from '../i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EVA | الأمن والحماية | قريباً',
  description: 'EVA متخصصة في حلول الأمن المتقدمة. موقعنا قيد الصيانة حالياً.',
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params: { locale } }: Readonly<ILayout>) {
    const { resources } = await initTranslation();


  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
                <TranslationsProvider locale={locale} resources={resources}>

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
          </TranslationsProvider>
      </body>
    </html>
  );
}