import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar.js"
import { ThemeProvider } from "../contexts/themeContext";
import { LanguageProvider } from "../contexts/languageContext";
import { ToastContainer } from "react-toastify";
import { ScreenSizeProvider } from "../contexts/screenContext";
import Script from 'next/script';
import ScriptAd from '../Ads/inject.js'
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QZDD1NNBWS"></script>
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QZDD1NNBWS');
            `,
          }}
        />
        {/* Google Adsense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9928340261693986" crossorigin="anonymous"></script>
        
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        {/* PropellerAds */}
        <meta name="monetag" content="28944bee1d3eea24347868a6a9cf8bb6"/>
        {/* PropellerAds */}
        <script src="https://couphaithuph.net/act/files/tag.min.js?z=9579214" data-cfasync="false" async></script>
        {/* PropellerAds */}
        <ScriptAd />
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
