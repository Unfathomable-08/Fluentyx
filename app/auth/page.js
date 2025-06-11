"use client"

import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import Cloud from "../../components/Cloud";
import { motion } from "framer-motion";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showSignup, setShowSignup] = useState(false);

  const onSubmit = async (data) => {
    try {
        const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log(result);
    } catch (error) {
        console.error('Login failed:', error);
    }
    };

  return (
    <div className="flex items-center justify-center px-6" style={{height: 'calc(100vh - 80px)'}}>
      {/* Background Blobs */}
      <div className="opacity-40 sm:opacity-60 md:opacity-80">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-58 h-58 md:w-60 md:h-60 lg:w-100 lg:h-100 left-4 -top-12 filter blur-xs">
            <path fill="#64D832" d="M27.4,-10.8C39.5,5.1,56,23.5,52.2,38.3C48.3,53.1,24.2,64.3,2.5,62.8C-19.2,61.4,-38.4,47.3,-51.4,27.3C-64.3,7.2,-71.1,-18.9,-61.5,-33.3C-51.9,-47.7,-25.9,-50.6,-9.1,-45.3C7.7,-40,15.4,-26.7,27.4,-10.8Z" transform="translate(100 100)" />
        </svg>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-52 h-52 md:w-60 md:h-60 lg:w-80 lg:h-80 right-6 -top-16 filter blur-xs">
            <path fill="#64D832" d="M49.2,-49.7C64.5,-45.8,78,-31,73.9,-18.3C69.9,-5.6,48.3,4.9,36.5,17.1C24.8,29.3,22.8,43.3,12.9,55.7C2.9,68.2,-15,79.2,-28.7,75.6C-42.5,72.1,-52.2,53.9,-60.2,36.5C-68.2,19.1,-74.5,2.4,-71.7,-12.6C-69,-27.5,-57.2,-40.8,-43.7,-45C-30.3,-49.1,-15.1,-44.1,0.9,-45.2C17,-46.3,34,-53.5,49.2,-49.7Z" transform="translate(100 100)" />
        </svg>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-58 h-58 md:w-60 md:h-60 lg:w-100 lg:h-100 right-0 lg:right-36 bottom-0 filter blur-xs">
            <path fill="#64D832" d="M38,-57.9C48.6,-52.3,56.3,-40.7,54.7,-29.3C53.1,-17.9,42.4,-6.7,34.9,0.9C27.5,8.6,23.4,12.6,19.9,18C16.4,23.5,13.7,30.3,7.6,37.2C1.6,44.1,-7.7,51.1,-18.5,52.6C-29.2,54.2,-41.4,50.3,-53.6,42.8C-65.8,35.3,-78,24.1,-77.1,12.7C-76.2,1.3,-62.2,-10.3,-54,-23.1C-45.7,-35.9,-43.3,-49.7,-35.3,-56.5C-27.3,-63.3,-13.6,-63.1,0,-63.1C13.7,-63.2,27.3,-63.5,38,-57.9Z" transform="translate(100 100)" />
        </svg>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-52 h-52 md:w-60 md:h-60 left-6 bottom-0 filter blur-xs">
            <path fill="#64D832" d="M36.5,-59.5C47.6,-49.7,57,-40,61.9,-28.5C66.9,-17,67.4,-3.6,65,9C62.7,21.6,57.5,33.5,50.1,45.1C42.7,56.8,33,68.2,19.8,76.1C6.5,84.1,-10.4,88.4,-26,85.3C-41.6,82.2,-56,71.6,-63,57.8C-70.1,44,-69.9,27,-66.3,13.1C-62.7,-0.7,-55.7,-11.5,-49.7,-22C-43.8,-32.5,-38.9,-42.7,-30.8,-53.8C-22.7,-64.9,-11.3,-77,0.7,-78.1C12.7,-79.2,25.4,-69.3,36.5,-59.5Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className={`relative bg-white shadow-[0_0_15px_#000000aa] rounded-2xl p-8 w-full lg:max-w-2xl md:max-w-xl sm:max-w-md max-w-sm flex overflow-hidden transform ${showSignup ? "rotate-y-180" : ""}`}>
        
        {/* Cloud positioned at bottom-right */}
        <motion.div 
          key={showSignup ? "signup" : "login"}
          className="absolute bottom-[-20px] right-[-20px] z-5 opacity-80"
          initial={{bottom: "-160px", right: "-140px"}}
          animate={{bottom: "-20px", right: "-20px"}}
          transition={{duration: 1.5, ease: "easeInOut"}}
          >
          <Cloud />
        </motion.div>

        {/* Cloud positioned at top-left */}
        <motion.div
          key={showSignup ? "signup2" : "login2"}
          className="absolute top-[-20px] left-[-120px] z-5 rotate-x-180 opacity-80"
          initial={{top: "-120px", left: "-220px"}}
          animate={{top: "-20px", left: "-120px"}}
          transition={{duration: 1.5, ease: "easeInOut"}}
        >
          <Cloud />
        </motion.div>

        <div className={`relative z-10 w-full md:w-1/2 py-6 text-center transform ${showSignup ? "rotate-y-180" : ""}`}>
          <h1 className="text-2xl font-bold text-gray-800">{showSignup ? "Create Account" : "Hello!"}</h1>
          <p className="text-black mb-6">{showSignup ? "Sign up to get started" : "Sign in to your account"}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {showSignup && (
              <>
                {/* Full Name Field */}
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-[var(--secondary)]" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register("fullName", { required: "Full Name is required" })}
                    className="pl-10 pr-4 py-2 w-full border border-gray-500 rounded-md focus:ring focus:ring-[var(--primary)]"
                  />
                  {errors.fullName && <p className="text-red-600 text-start text-sm">{errors.fullName.message}</p>}
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-[var(--secondary)]" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { 
                  required: "Email is required", 
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format"
                  }
                })}
                className="pl-10 pr-4 py-2 w-full border border-gray-500 rounded-md focus:ring focus:ring-[var(--primary)]"
              />
              {errors.email && <p className="text-red-600 text-start text-sm">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-[var(--secondary)]" />
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="pl-10 pr-4 py-2 w-full border border-gray-500 rounded-md focus:ring focus:ring-[var(--primary)]"
              />
              {errors.password && <p className="text-red-600 text-start text-sm">{errors.password.message}</p>}
            </div>

            {!showSignup && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded-[4px] bg-white checked:bg-[var(--primary)] checked:border-[var(--primary)] accent-[var(--primary)]"
                  />
                  <span>Remember me</span>
                </label>

                <a href="#" className="text-[var(--secondary)] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[var(--primary)] shadow-[5px_5px_10px_#00000055] text-white rounded-md hover:bg-[var(--secondary)]"
            >
              {showSignup ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            {showSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              className="text-[var(--secondary)] hover:underline"
              onClick={() => setShowSignup(!showSignup)}
            >
              {showSignup ? "Sign In" : "Create New"}
            </button>
          </p>
        </div>

        {/* Right Section: Info */}
        <div className={`max-md:hidden relative -translate-y-4 z-10 w-1/2 flex flex-col justify-center items-center p-6 rounded-2xl transform ${showSignup ? "rotate-y-180" : ""}`}>
          <h2 className="text-xl font-bold">{showSignup ? "Welcome!" : "Welcome Back!"}</h2>
          <p className="text-center text-sm mt-2">
            {showSignup 
                ? "Join us and start your journey to mastering Arabic!"
                : "Already learning? Sign in and continue exploring Arabic!"
            }
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;