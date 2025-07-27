'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function About() {
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
            About Fluentyx
          </h1>
          <p className="text-lg text-[var(--secondary)] max-w-2xl mx-auto">
            Fluentyx is your gateway to mastering new languages through interactive, engaging, and personalized learning experiences.
          </p>
        </motion.section>

        {/* Mission Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto bg-[var(--primary)] text-white rounded-3xl shadow-[0_0_20px_#00000055] p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-md">
              At Fluentyx, we believe language is the key to connecting cultures and unlocking opportunities. Our mission is to make language learning accessible, fun, and effective for everyone, whether you're a beginner or an advanced learner. We combine cutting-edge technology with proven learning methodologies to create a platform that adapts to your unique needs, helping you achieve fluency faster.
            </p>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6 text-center">What We Offer</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]"
              >
                <h3 className="text-xl font-medium text-[var(--secondary)] mb-2">Interactive Lessons</h3>
                <p className="text-[var(--text-theme)]">
                  Engage with dynamic lessons designed to improve your speaking, listening, reading, and writing skills through real-world scenarios.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border rounded-3xl p-6 bg-gray-100/90 shadow-[0_0_12px_#00000055]"
              >
                <h3 className="text-lg font-medium text-[var(--secondary)] mb-2">Daily Challenges</h3>
                <p className="text-[var(--text-theme)]">
                  Stay motivated with daily exercises that track your progress and keep you on the path to fluency.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12 px-4">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-theme)] mb-6 text-center">Our Team</h2>
            <p className="text-lg text-[var(--secondary)] text-center">
              Fluentyx was founded by a passionate team of educators, developers, and language enthusiasts dedicated to breaking down language barriers. Based in Karach Pakistan, we work tirelessly to bring you the best learning experience possible. Contact us at <a href="mailto:fluentyx@gmail.com" className="underline text-[var(--primary)]">fluentyx@gmail.com</a> for any inquiries.
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
            Start Your Learning Journey
          </motion.button>
        </motion.section>
      </main>
    </>
  );
}