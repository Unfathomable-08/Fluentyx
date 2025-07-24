"use client";

import { useEffect } from "react";

const PropellerAa = () => {
  useEffect(() => {
    console.log("PropellerAa component mounted")
    const loadPropellerAa = () => {
      const aaContainer = document.getElementById("aa-container");
      if (!aaContainer) return;

      // Create the script
      const aaScript = document.createElement("script");
      aaScript.src = "https://fpyf8.com/88/tag.min.js";
      aaScript.setAttribute("data-zone", "159065");
      aaScript.setAttribute("async", "true");
      aaScript.setAttribute("data-cfasync", "false");
      aaScript.id = "aa-script"; // So we can remove it later

      aaContainer.appendChild(aaScript);

      // Store current time
      localStorage.setItem("lastAaTime", Date.now().toString());

      // Remove script after 1 second
      setTimeout(() => {
        aaScript.remove();
      }, 1000);
    };

    const lastAaTime = localStorage.getItem("lastAaTime");
    const now = Date.now();
    const fifteenMinutes = 10 * 60 * 1000;

    if (!lastAaTime || now - parseInt(lastAaTime) >= fifteenMinutes) {
      loadPropellerAa();
    } else {
      const timeLeft = fifteenMinutes - (now - parseInt(lastAaTime));
      const timeoutId = setTimeout(loadPropellerAa, timeLeft);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return <div id="aa-container"></div>;
};

export default PropellerAa;