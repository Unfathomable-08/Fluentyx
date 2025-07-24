"use client";

import { useEffect } from "react";

const PropellerAa = () => {
  useEffect(() => {
    const loadPropellerAa = () => {
      // Create the PropellerAds script element
      const aaScript = document.createElement("script");
      aaScript.src = "https://fpyf8.com/88/tag.min.js";
      aaScript.setAttribute("data-zone", "159065");
      aaScript.setAttribute("async", "true");
      aaScript.setAttribute("data-cfasync", "false");

      // Append script to the aa container
      const aaContainer = document.getElementById("aa-container");
      if (aaContainer) {
        aaContainer.appendChild(aaScript);
      }

      // Store the timestamp of aa load
      localStorage.setItem("lastAaTime", Date.now().toString());
    };

    // Check if aa was shown recently
    const lastAaTime = localStorage.getItem("lastAaTime");
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (!lastAaTime || now - parseInt(lastAaTime) >= fifteenMinutes) {
      // Load aa immediately if no aa was shown or 15 minutes have passed
      loadPropellerAa();
    } else {
      // Schedule aa for remaining time
      const timeLeft = fifteenMinutes - (now - parseInt(lastAaTime));
      const timeoutId = setTimeout(loadPropellerAa, timeLeft);
      // Cleanup timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, []); // Empty dependency array to run once on mount

  return <div id="aa-container"></div>;
};

export default PropellerAa;