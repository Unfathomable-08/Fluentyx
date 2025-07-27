'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TermsAndConditions() {
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
          <h1 className="text-xl sm:text-xl font-bold text-[var(--text-theme)] mb-4">
            Terms and Conditions
          </h1>
          <p className="text-base text-[var(--secondary)] max-w-xl mx-auto">
            Welcome to Fluentyx. These Terms and Conditions govern your use of our website, mobile app, and services.
          </p>
        </motion.section>

        {/* Introduction Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto bg-[var(--primary)] text-white rounded-3xl shadow-[0_0_20px_#00000055] p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-base">
              These Terms and Conditions ("Terms") apply to your use of Fluentyx ("we," "us," or "our"), including our website, mobile app, and services ("Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
            </p>
          </div>
        </section>

        {/* Acceptance of Terms Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Acceptance of Terms</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-base text-[var(--text-theme)]">
                By creating an account, accessing our platform, or participating in our lessons and challenges, you confirm that you are at least 13 years old (or the age of majority in your jurisdiction) and agree to comply with these Terms. We may update these Terms periodically, and continued use of our Services constitutes acceptance of the updated Terms.
              </p>
            </div>
          </div>
        </section>

        {/* User Responsibilities Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">User Responsibilities</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <div className="text-base text-[var(--text-theme)]">
                As a user, you agree to:
                <ul className="list-disc pl-6">
                  <li>Provide accurate and complete information during registration.</li>
                  <li>Keep your account credentials confidential and notify us of any unauthorized access.</li>
                  <li>Use our Services for personal, non-commercial purposes only.</li>
                  <li>Not engage in activities that violate laws, harm others, or disrupt our platform (e.g., hacking, spamming).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Intellectual Property Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Intellectual Property</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-base text-[var(--text-theme)]">
                All content on Fluentyx, including lessons, challenges, and software, is owned by or licensed to us and protected by intellectual property laws. You may not copy, distribute, or modify our content without prior written consent, except for personal use as permitted by law.
              </p>
            </div>
          </div>
        </section>

        {/* Termination Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Termination</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-base text-[var(--text-theme)]">
                We reserve the right to suspend or terminate your account if you violate these Terms, engage in prohibited activities, or for any other reason at our discretion. You may terminate your account at any time by contacting us at <a href="mailto:fluentyx@gmail.com" className="underline text-[var(--primary)]">fluentyx@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Limitation of Liability Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Limitation of Liability</h2>
            <div className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]">
              <p className="text-base text-[var(--text-theme)]">
                Fluentyx provides its Services "as is" without warranties of any kind. We are not liable for any damages arising from your use of our Services, including but not limited to data loss, service interruptions, or inaccuracies in content, to the fullest extent permitted by law.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6">Contact Us</h2>
            <p className="text-base text-[var(--secondary)]">
              If you have questions about these Terms and Conditions, please contact us at <a href="mailto:fluentyx@gmail.com" className="underline text-[var(--primary)]">fluentyx@gmail.com</a> or through our <a href="/account" className="underline text-[var(--primary)]">Feedback tab</a> on account page.
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
            className="bg-[var(--primary)] text-white font-medium text-md px-6 py-2 rounded-3xl shadow-[0_0_12px_#00000055] hover:bg-[var(--secondary)]"
            onClick={() => router.push('/dailyExercise')}
          >
            Continue Learning
          </motion.button>
        </motion.section>
      </main>
    </>
  );
}