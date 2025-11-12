import React from 'react';
import { motion } from 'framer-motion';

export const HeroHighlight = ({ children, className }) => {
  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <BackgroundGradient />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const Highlight = ({ children, className }) => {
  return (
    <motion.span
      initial={{ backgroundSize: '0% 100%' }}
      animate={{ backgroundSize: '100% 100%' }}
      transition={{ duration: 2, ease: 'linear', delay: 0.5 }}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
      }}
      className={`relative inline-block bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent ${
        className || ''
      }`}
    >
      {children}
    </motion.span>
  );
};

const BackgroundGradient = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900" />

      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
    </div>
  );
};
