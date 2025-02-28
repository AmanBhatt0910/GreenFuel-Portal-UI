"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  // Particles effect
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById("particles-container");
      if (!container) return;
      
      // Clear existing particles
      container.innerHTML = "";
      
      // Create new particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full opacity-40 dark:opacity-20";
        
        // Random size
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random color (soft pastels for light, muted colors for dark)
        const hue = Math.floor(Math.random() * 60) + 20; // Warm hues
        const lightness = Math.floor(Math.random() * 20) + 70; // Light mode: bright
        particle.style.backgroundColor = `hsl(${hue}, 30%, ${lightness}%)`;
        particle.classList.add("dark:bg-neutral-300");
        
        // Animation
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s infinite ease-in-out`;
        
        container.appendChild(particle);
      }
    };
    
    createParticles();
    window.addEventListener("resize", createParticles);
    
    return () => {
      window.removeEventListener("resize", createParticles);
    };
  }, []);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#C5B299] to-[#e9ecef] dark:from-[#1E1E2E] dark:to-[#2D2D3A]">
      {/* Particles background */}
      <div id="particles-container" className="absolute inset-0 z-0" />
      
      {/* Glass effect card */}
      <motion.div 
        className="relative z-10 p-8 md:p-12 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-black/20 shadow-xl border border-white/20 dark:border-white/5 max-w-lg w-full mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center text-center">
          {/* 404 Number */}
          <motion.h1 
            className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-200"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100 
            }}
          >
            404
          </motion.h1>
          
          {/* Animated underscore */}
          <motion.div 
            className="h-1 w-16 bg-amber-500 dark:bg-amber-300 rounded-full my-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          
          {/* Text content */}
          <motion.h2 
            className="text-2xl md:text-3xl font-medium mb-4 text-neutral-800 dark:text-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            className="text-neutral-600 dark:text-neutral-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </motion.p>
          
          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/" className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-500 dark:to-amber-400 text-white shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-15px);
          }
          75% {
            transform: translateY(15px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}