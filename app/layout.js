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

        {/* PopUpAds */}
        <Script
          id="popads-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var k=window,
                s="e0f2982eed45d6c44c4f8c8d72066201",
                r=[["siteId",957-904*112+5319675],["minBid",0.002],["popundersPerIP","2,2"],["delayBetween",300],["default",false],["defaultPerDay",5],["topmostLayer","auto"]],
                e=["d3d3LmJldHRlcmFkc3lzdGVtLmNvbS90anNncmlkLm1pbi5jc3M=","ZDJrazBvM2ZyN2VkMDEuY2xvdWRmcm9udC5uZXQvWVVYL2hqc2ZpbGUubWluLmpz"],
                l=-1,c,o,
                h=function(){
                  clearTimeout(o);
                  l++;
                  if(e[l] && !(1779094021000 < (new Date).getTime() && 1 < l)){
                    c=k.document.createElement("script");
                    c.type="text/javascript";
                    c.async=!0;
                    var t=k.document.getElementsByTagName("script")[0];
                    c.src="https://"+atob(e[l]);
                    c.crossOrigin="anonymous";
                    c.onerror=h;
                    c.onload=function(){
                      clearTimeout(o);
                      k[s.slice(0,16)+s.slice(0,16)] || h();
                    };
                    o=setTimeout(h,5000);
                    t.parentNode.insertBefore(c,t);
                  }
                };
                if(!k[s]){
                  try{Object.freeze(k[s]=r)}catch(e){}
                  h();
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
