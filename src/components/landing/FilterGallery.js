import React from 'react';
import { motion } from 'framer-motion';

const FilterGallery = ({ onFilterSelect }) => {
  const filters = [
    { id: 'none', name: 'Original', icon: '✨', description: 'Pure, unfiltered you' },
    { id: 'grayscale', name: 'Grayscale', icon: '⚫', description: 'Classic black & white' },
    { id: 'sepia', name: 'Sepia', icon: '🟤', description: 'Timeless vintage tone' },
    { id: 'vintage', name: 'Vintage', icon: '📷', description: 'Classic film look' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', description: 'Futuristic neon vibes' },
    { id: 'moonlight', name: 'Moonlight', icon: '🌙', description: 'Ethereal blue tones' },
    { id: 'sunset', name: 'Sunset', icon: '🌅', description: 'Golden hour magic' },
    { id: 'warm', name: 'Warm', icon: '🔥', description: 'Cozy, inviting tones' },
    { id: 'cool', name: 'Cool', icon: '❄️', description: 'Fresh, professional look' },
    { id: 'saturate', name: 'Vibrant', icon: '🌈', description: 'Saturated, punchy colors' },
    { id: 'dramatic', name: 'Dramatic', icon: '🎭', description: 'High contrast intensity' },
    { id: 'noir', name: 'Noir', icon: '🎬', description: 'Black & white with grain' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', description: 'Deep blue serenity' },
    { id: 'rose', name: 'Rose', icon: '🌹', description: 'Romantic pink glow' },
    { id: 'pastel', name: 'Pastel', icon: '🎨', description: 'Soft, dreamy colors' },
    { id: 'brightness', name: 'Bright', icon: '☀️', description: 'Enhanced luminosity' },
    { id: 'contrast', name: 'Contrast', icon: '⚡', description: 'Bold definition' },
    { id: 'blur', name: 'Blur', icon: '💫', description: 'Soft focus effect' },
  ];

  // Bento grid layout - different sizes for visual interest
  const gridLayout = [
    'col-span-2 row-span-2', // Large
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-2', // Tall
    'col-span-2 row-span-1', // Wide
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-2 row-span-1', // Wide
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-2', // Tall
    'col-span-1 row-span-1', // Small
    'col-span-2 row-span-1', // Wide
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
    'col-span-1 row-span-1', // Small
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">20+ Stunning Filters</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From vintage classics to futuristic cyberpunk - find the perfect filter for every moment
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]"
        >
          {filters.map((filter, index) => (
            <motion.div
              key={filter.id}
              variants={item}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className={`${
                gridLayout[index % gridLayout.length]
              } group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/20`}
              onClick={() => onFilterSelect && onFilterSelect(filter.id)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
              </div>

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="text-4xl md:text-5xl mb-2">{filter.icon}</div>

                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                    {filter.name}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {filter.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-white"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => onFilterSelect && onFilterSelect(null)}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
          >
            <span>Try All Filters Now</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FilterGallery;
