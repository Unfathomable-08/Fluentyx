'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Error - Fluentyx</title>
        <meta name="description" content="Something went wrong on Fluentyx. Please try again or contact support." />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_CLIENT_ID"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <main
        className="bg-[var(--bg-theme)] flex items-center justify-center px-4 py-6"
        style={{ minHeight: 'calc(100vh - 50px)' }}
      >
        <motion.section
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: -60 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center justify-center gap-4 max-w-xl"
        >
          <FaExclamationTriangle className="text-5xl text-red-500 mb-2" />
          <h1 className="text-xl sm:text-2xl font-bold text-red-600">
            Oops! Something Went Wrong
          </h1>
          <p className="text-sm sm:text-base text-[var(--secondary)]">
            An unexpected error occurred. Please try again or contact us for assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--primary)] text-white text-sm sm:text-base px-5 py-1 rounded-3xl shadow-md hover:bg-red-500 transition"
              onClick={() => router.push('/')}
            >
              Return to Homepage
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--primary)] text-white text-sm sm:text-base px-5 py-1 rounded-3xl shadow-md hover:bg-red-500 transition"
              onClick={() => router.refresh()}
            >
              Try Again
            </motion.button>
          </div>

          <div className="mt-6 text-sm text-[var(--secondary)] px-4">
            If the issue persists, contact us at{' '}
            <a href="mailto:fleuntyx@gmail.com" className="underline text-red-500">
              fleuntyx@gmail.com
            </a>{' '}
            or visit our{' '}
            <a href="/contact" className="underline text-red-500">
              Account
            </a>{' '}
            page and fill out the complaint form.
          </div>
        </motion.section>
      </main>
    </>
  );
}
