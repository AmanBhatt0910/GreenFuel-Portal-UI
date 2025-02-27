"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const ProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      speed: 500,
      trickleSpeed: 100,
      easing: "ease-out",
    });

    // Create and apply custom styling
    const style = document.createElement("style");
    style.textContent = `
      #nprogress {
        pointer-events: none;
      }
      
      #nprogress .bar {
        background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
        position: fixed;
        z-index: 2000;
        top: 0;
        left: 0;
        width: 100%;
        height: 3.5px;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.7);
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 15px #6366f1, 0 0 8px #8b5cf6;
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }
      
      /* Add a subtle glow effect at the bottom */
      #nprogress::after {
        content: '';
        position: fixed;
        top: 3.5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, rgba(99, 102, 241, 0), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0));
        z-index: 1999;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let timeoutId: NodeJS.Timeout;

    const startProgress = () => {
      clearTimeout(timeoutId);
      NProgress.set(0.1);
      NProgress.start();
    };

    const stopProgress = () => {
      timeoutId = setTimeout(() => {
        NProgress.done();
      }, 500);
    };

    startProgress();
    stopProgress();

    return () => {
      clearTimeout(timeoutId);
      NProgress.remove();
    };
  }, [pathname, searchParams, isClient]);

  return null;
};

export default ProgressBar;