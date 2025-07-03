"use client";

import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../contexts/themeContext";
import { LanguageContext } from "../../contexts/languageContext";
import { FaEdit, FaSun, FaMoon } from "react-icons/fa";
import { MdEmail, MdPhone, MdPassword, MdClose } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function AccountPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [modalType, setModalType] = useState(null); // "contact" or "password"
  const [currentPassword, setCurrentPassword] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleOpenModal = (type) => {
    setModalType(type);
    setCurrentPassword("");
    setNewContact("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalType === "contact") {
        if (!currentPassword || !newContact) {
          toast.error("Please fill in all fields");
          return;
        }
        const res = await fetch("/api/user/contact", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            contact: newContact,
          }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to update contact");
        toast.success(data.message);
        handleCloseModal();
        
      } else if (modalType === "password") {
        if (!currentPassword || !newPassword || !confirmPassword) {
          toast.error("Please fill in all fields");
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }
        const res = await fetch("/api/user/password", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to update password");
        toast.success(data.message);
        handleCloseModal();
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-[var(--bg-theme)] min-h-[calc(100vh-50px)] py-8 px-4 flex flex-col items-center`}>
      {/* Circle Avatar and Name */}
      <motion.div
        className="flex flex-col items-center gap-2 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold shadow-[0_5px_10px_#00000055] bg-white`}>
          {user?.name[0]?.toUpperCase()}
        </div>
        <h1 className={`text-2xl ${theme === 'dark' ? 'text-[var(--text-theme)]' : 'text-black'} font-semibold`}>{user?.name}</h1>
      </motion.div>

      {/* Details Box */}
      <motion.div
        className={`${theme === 'dark' ? 'bg-white/80' : 'bg-white'} w-full max-w-md rounded-2xl p-6 shadow-[0_0_10px_#00000055] transition-all duration-300`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Email */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MdEmail className="text-xl text-[var(--primary)]" />
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MdPhone className="text-xl text-[var(--primary)]" />
            <p>{user?.contact ? user.contact : 'Add Contact'}</p>
          </div>
          <FaEdit
            className="cursor-pointer text-gray-500 hover:text-[var(--primary)]"
            title="Edit Contact"
            onClick={() => handleOpenModal("contact")}
          />
        </div>

        {/* Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdPassword className="text-xl text-[var(--primary)]" />
            <p>{"*".repeat(8)}</p>
          </div>
          <FaEdit
            className="cursor-pointer text-gray-500 hover:text-[var(--primary)]"
            title="Edit Password"
            onClick={() => handleOpenModal("password")}
          />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm shadow-[0_0_15px_#00000080]`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {modalType === "contact" ? "Update Contact" : "Update Password"}
                </h2>
                <MdClose
                  className="text-2xl cursor-pointer text-gray-500 hover:text-[var(--primary)]"
                  onClick={handleCloseModal}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                    required
                  />
                </div>
                {modalType === "contact" && (
                  <div className="mb-4">
                    <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      New Contact
                    </label>
                    <input
                      type="tel"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                      required
                    />
                  </div>
                )}
                {modalType === "password" && (
                  <>
                    <div className="mb-4">
                      <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
                        required
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full p-2 rounded-md bg-[var(--primary)] text-white transition hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? "Submitting..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Toggle */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => toggleTheme()}
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md bg-[var(--primary)] text-white transition hover:scale-105"
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
          {theme === 'dark' ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Language Toggle */}
      <div className="mt-6 flex flex-col items-center">
        <h2 className={`${theme === 'dark' ? 'text-[var(--text-theme)]' : 'text-black'} text-lg font-semibold mb-2`}>Select Language</h2>
        <div className="flex gap-4">
          {["english", "hindi"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-2 rounded-full transition ${
                language === lang
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-black border border-gray-600"
              }`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}