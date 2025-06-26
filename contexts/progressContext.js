"use client";

import { createContext, useContext, useState } from "react";

// Create the ProgressMemo Context
const ProgressContext = createContext();

// ProgressMemo Provider Component
export const ProgressProvider = ({ children }) => {
  const [progressMemo, setProgressMemo] = useState([]);

  // Context value
  const value = {
    progressMemo,
    setProgressMemo,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook to use ProgressMemo Context
export const useProgressMemo = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error(
      "useProgressMemo must be used within a ProgressMemoProvider"
    );
  }
  return context;
};
