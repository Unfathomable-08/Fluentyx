'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <>
      <main className="px-4 py-6 pb-20 md:px-20 bg-[var(--bg-theme)]" style={{ minHeight: 'calc(100vh - 50px)' }}>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-theme)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-md font-medium text-[var(--secondary)] max-w-2xl mx-auto">
            At Fluentyx, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
          </p>
        </motion.section>

        {/* Introduction Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto bg-[var(--primary)] text-white rounded-3xl shadow-[0_0_20px_#00000055] p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-md">
              Fluentyx ("we," "us," or "our") operates a platform designed to help users learn languages through interactive tools and challenges. This Privacy Policy outlines how we handle your personal information when you use our website, mobile app, or services ("Services"). By using our Services, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our Services.
            </p>
          </div>
        </section>

        {/* Information We Collect Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Information We Collect</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <h3 className="text-md font-medium text-[var(--secondary)] mb-2">Personal Information</h3>
              <div className="text-[var(--text-theme)] mb-4">
                When you register or use our Services, we may collect:
                <ul className="list-disc pl-6">
                  <li>Name and email address</li>
                  <li>Account credentials (e.g., username, password)</li>
                  <li>Progress data (e.g., completed lessons, streak information)</li>
                  <li>Contact information provided through our support channels</li>
                </ul>
              </div>
              <h3 className="text-md font-medium text-[var(--secondary)] mb-2">Non-Personal Information</h3>
              <p className="text-[var(--text-theme)]">
                We may collect non-identifiable data, such as:
                <ul className="list-disc pl-6">
                  <li>Device information (e.g., browser type, operating system)</li>
                  <li>Usage data (e.g., pages visited, time spent on lessons)</li>
                  <li>Cookies and similar technologies to enhance your experience</li>
                </ul>
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">How We Use Your Information</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-[var(--text-theme)]">
                We use your information to:
                <ul className="list-disc pl-6">
                  <li>Provide and improve our Services, such as personalizing lessons</li>
                  <li>Track your progress and display streaks or achievements</li>
                  <li>Communicate with you, including sending updates or support responses</li>
                  <li>Analyze usage to enhance user experience and platform performance</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </p>
            </div>
          </div>
        </section>

        {/* Data Sharing Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Data Sharing</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-[var(--text-theme)]">
                We do not sell your personal information. We may share data with:
                <ul className="list-disc pl-6">
                  <li>Third-party service providers (e.g., hosting, analytics) who follow strict privacy standards</li>
                  <li>Legal authorities when required by law</li>
                  <li>Partners for aggregated, anonymized data to improve our Services</li>
                </ul>
              </p>
            </div>
          </div>
        </section>

        {/* User Rights Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Your Rights</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-[var(--text-theme)]">
                Depending on your location, you may have the right to:
                <ul className="list-disc pl-6">
                  <li>Access or request a copy of your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your data (subject to legal requirements)</li>
                  <li>Opt out of certain data processing, such as marketing emails</li>
                </ul>
                To exercise these rights, contact us at <a href="mailto:fluentyx@gmail.com" className="underline text-[var(--primary)]">fluentyx@gamil.com</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Cookies Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Cookies</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-[var(--text-theme)]">
                We use cookies to improve your experience, such as remembering your preferences and tracking usage. You can manage cookie settings through your browser. By using our Services, you consent to our use of cookies as described.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Contact Us</h2>
            <p className="text-lg text-[var(--secondary)]">
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@fluentyx.com" className="underline text-[var(--primary)]">fluentyx@gmail.com</a> or through our <a href="/account" className="underline text-[var(--primary)]">Feedback</a> button on account tab.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--primary)] text-white font-medium text-lg px-6 py-3 rounded-3xl shadow-[0_0_12px_#00000055] hover:bg-[var(--secondary)]"
            onClick={() => router.push('/dailyExercise')}
          >
            Continue Learning
          </motion.button>
        </motion.section>
      </main>
    </>
  );
}