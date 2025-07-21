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
        {/* PopUp Ads */}
        <script
          type="text/javascript"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){var f=window,b="e0f2982eed45d6c44c4f8c8d72066201",y=[["siteId",926+612+476+5217370],["minBid",0.5],["popundersPerIP","2,2"],["delayBetween",300],["default",false],["defaultPerDay",5],["topmostLayer","auto"]],u=["d3d3LmJldHRlcmFkc3lzdGVtLmNvbS9janNncmlkLm1pbi5jc3M=","ZDJrazBvM2ZyN2VkMDEuY2xvdWRmcm9udC5uZXQvWWh6L2xqc2ZpbGUubWluLmpz"],h=-1,m,t,v=function(){clearTimeout(t);h++;if(u[h]&&!(1779002401000<(new Date).getTime()&&1<h)){m=f.document.createElement("script");m.type="text/javascript";m.async=!0;var k=f.document.getElementsByTagName("script")[0];m.src="https://"+atob(u[h]);m.crossOrigin="anonymous";m.onerror=v;m.onload=function(){clearTimeout(t);f[b.slice(0,16)+b.slice(0,16)]||v()};t=setTimeout(v,5E3);k.parentNode.insertBefore(m,k)}};if(!f[b]){try{Object.freeze(f[b]=y)}catch(e){}v()}})();
            `
          }}
        />
        {/* PopUp Ads */}
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
