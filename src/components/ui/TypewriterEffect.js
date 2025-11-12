import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TypewriterEffect = ({ words, className, cursorClassName }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(word.substring(0, currentText.length + 1));
          if (currentText === word) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setCurrentText(word.substring(0, currentText.length - 1));
          if (currentText === '') {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 50 : 150
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <div className={`flex items-center space-x-1 ${className || ''}`}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl md:text-2xl lg:text-3xl font-medium"
      >
        {currentText}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className={`inline-block w-[3px] h-6 md:h-8 bg-primary-500 ${cursorClassName || ''}`}
      />
    </div>
  );
};
