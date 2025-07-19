import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../contexts/themeContext";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function ReviewModal({ isOpen, onClose, email }) {
  const { theme } = useContext(ThemeContext);
  const [type, setType] = useState("review");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!message.trim()) {
        toast.error("Please provide a message");
        return;
      }

      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          type,
          message,
          rating,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");
      toast.success("Thank you for your feedback!");
      setType("review");
      setMessage("");
      setRating(0);
      onClose(prev => !prev);
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-6 w-full max-w-sm shadow-[0_0_15px_#00000080]`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                Share Your Feedback
              </h2>
              <MdClose
                className="text-2xl cursor-pointer text-gray-500 hover:text-[var(--primary)]"
                onClick={() => onClose(prev => !prev)}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className={`block mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Feedback Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full p-2 rounded-md border ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  <option value="review">Review</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="complaint">Complaint</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className={`block mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl ${
                        star <= rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className={`block mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full p-2 rounded-md border resize-none h-24 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                  placeholder="Enter your feedback here..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 rounded-md bg-[var(--primary)] text-white transition hover:scale-105 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}