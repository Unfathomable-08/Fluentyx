import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar.js"
import { ThemeProvider } from "../contexts/themeContext";
import { LanguageProvider } from "../contexts/languageContext";
import { ToastContainer } from "react-toastify";
import { ScreenSizeProvider } from "../contexts/screenContext";
import Script from 'next/script';
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fluentyx",
  description:
    'Fluentyx is a smart Arabic learning platform powered by AI build with modern technology for modern world. Practice reading, writing, and speaking Arabic with personalized lessons, interactive exercises, and progress tracking.',
  keywords: [
    'Fluentyx',
    'Arabic learning',
    'Learn Arabic online',
    'AI language tutor',
    'Arabic for beginners',
    'Arabic course',
    'Arabic grammar',
    'Arabic speaking practice',
    'Arabic alphabets',
    'Arabic lessons',
    'Arabic app',
    'Fluentyx Arabic',
    'Arabic with AI',
  ],
  authors: [{ name: 'Muhammad', url: 'https://dev-muhammad.vercel.app' }],
  creator: 'Muhammad',
  publisher: 'Muhammad'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" />
        {/* Google Analytics Scripts */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QZDD1NNBWS"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QZDD1NNBWS', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Script
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9928340261693986"
          crossorigin="anonymous"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider>
            <ScreenSizeProvider>
              <ToastContainer />
              <Navbar />
              {children}
            </ScreenSizeProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
