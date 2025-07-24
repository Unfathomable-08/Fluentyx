"use client";

import { useEffect, useState } from "react";
import { FaCrown, FaUserAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const medals = ["#FFD700", "#B0B0B0", "#CD7F32"]; // Gold, Silver, Bronze

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (!user) return;
        const res = await fetch(`/api/leaderboard?email=${user.email}`);
        const data = await res.json();
        setLeaders(data || []);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-[var(--bg-theme)] px-4 pt-6 pb-20" style={{minHeight: 'calc(100vh - 50px)'}}>
      <h1 className="text-2xl font-bold text-center text-[var(--text-theme)] mb-8">
        Weekly Leaderboard
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 text-md">Loading...</div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {leaders.length === 0 ? (
            <p className="text-center text-[var(--text-theme)]">Complete a exercise to participate.</p>
          ) : (
            leaders.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between px-5 py-2 rounded-2xl shadow-lg ${
                  index < 3 ? "bg-[var(--primary)]/50" : "bg-white"
                } ${person.email === user.email && "border-2 transform scale-103 border-[var(--primary)]"}`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md ${
                      index === 0
                        ? "bg-yellow-400"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-amber-600"
                        : "bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: medals[index] || "#E5E7EB",
                    }}
                  >
                    {index < 3 ? <FaCrown /> : <FaUserAlt className="text-gray-500" />}
                  </div>
                  <div>
                    <p className="font-semibold text-md text-gray-800 capitalize">
                      {person.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-500">Points: {person.weekly_score || 0}</p>
                  </div>
                </div>
                <div className="text-md font-bold text-gray-900">#{index + 1}</div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
