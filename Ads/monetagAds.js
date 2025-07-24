"use client";

import { useEffect } from "react";

const PropellerAd = () => {
  useEffect(() => {
    const loadPropellerAd = () => {
      // Create the PropellerAds script element
      const adScript = document.createElement("script");
      adScript.src = "https://fpyf8.com/88/tag.min.js";
      adScript.setAttribute("data-zone", "159065");
      adScript.setAttribute("async", "true");
      adScript.setAttribute("data-cfasync", "false");

      // Append script to the ad container
      const adContainer = document.getElementById("aa-container");
      if (adContainer) {
        adContainer.appendChild(adScript);
      }

      // Store the timestamp of ad load
      localStorage.setItem("lastAdTime", Date.now().toString());
    };

    // Check if ad was shown recently
    const lastAdTime = localStorage.getItem("lastAdTime");
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (!lastAdTime || now - parseInt(lastAdTime) >= fifteenMinutes) {
      // Load ad immediately if no ad was shown or 15 minutes have passed
      loadPropellerAd();
    } else {
      // Schedule ad for remaining time
      const timeLeft = fifteenMinutes - (now - parseInt(lastAdTime));
      const timeoutId = setTimeout(loadPropellerAd, timeLeft);
      // Cleanup timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, []); // Empty dependency array to run once on mount

  return <div id="aa-container"></div>;
};

export default PropellerAd;