import React from 'react';
import { motion } from 'framer-motion';

const Timeline = () => {
  const levels = [
    {
      level: 1,
      title: 'React Basics',
      description: 'Component structure, JSX syntax, useState, and event handlers',
      tech: ['React', 'JSX', 'Hooks'],
      difficulty: '🟢 Beginner',
      time: '1-2 hours',
      color: 'from-green-500 to-emerald-500',
    },
    {
      level: 2,
      title: 'Webcam & Canvas',
      description: 'useRef, WebRTC getUserMedia, Canvas 2D rendering, requestAnimationFrame',
      tech: ['WebRTC', 'Canvas API', 'useRef'],
      difficulty: '🟢 Beginner',
      time: '2-3 hours',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      level: 3,
      title: 'Filters & Effects',
      description: 'CSS filters, canvas transformations, dynamic filter switching',
      tech: ['CSS Filters', 'Transformations'],
      difficulty: '🟡 Intermediate',
      time: '1-2 hours',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      level: 4,
      title: 'Photo Capture',
      description: 'Canvas toDataURL(), Blob API, file downloads, modal components',
      tech: ['Canvas API', 'Blob', 'Download'],
      difficulty: '🟡 Intermediate',
      time: '1-2 hours',
      color: 'from-orange-500 to-red-500',
    },
    {
      level: 5,
      title: 'Stickers & Drag',
      description: 'Drag & Drop API, mouse events, coordinate transformations',
      tech: ['Drag & Drop', 'Events'],
      difficulty: '🟡 Intermediate',
      time: '2-3 hours',
      color: 'from-pink-500 to-rose-500',
    },
    {
      level: 6,
      title: 'AI Integration',
      description: 'Environment variables, API security, async/await, Gemini AI API',
      tech: ['Gemini API', 'Async/Await'],
      difficulty: '🔴 Advanced',
      time: '2-3 hours',
      color: 'from-purple-500 to-violet-500',
    },
    {
      level: 7,
      title: 'AI Vision',
      description: 'Base64 encoding, multimodal AI (text + image), vision API prompting',
      tech: ['Multimodal AI', 'Vision API'],
      difficulty: '🔴 Advanced',
      time: '2-3 hours',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      level: 8,
      title: 'Face Detection',
      description: 'TensorFlow.js, ML models, facial landmarks, expression recognition',
      tech: ['TensorFlow.js', 'Face-API', 'ML'],
      difficulty: '🔴 Advanced',
      time: '3-4 hours',
      color: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black/20 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Want to <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Build This Yourself?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Follow our comprehensive 8-level tutorial to build LearnLens from scratch.
            Learn React, WebRTC, Canvas, AI, and Machine Learning.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
            <span>Total Learning Time: 15-20 hours</span>
            <span>•</span>
            <span>8 Progressive Levels</span>
            <span>•</span>
            <span>Hands-On Building</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-500/50 via-accent-500/50 to-primary-500/50" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Level Number Circle */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-primary-500/50 z-10 border-4 border-gray-900">
                  {level.level}
                </div>

                {/* Content Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`ml-28 md:ml-0 md:w-[calc(50%-4rem)] ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'
                  }`}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm p-6 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${level.color} transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Title & Difficulty */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-white">
                          Level {level.level}: {level.title}
                        </h3>
                        <span className="text-sm whitespace-nowrap ml-2">
                          {level.difficulty}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 mb-4">{level.description}</p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {level.tech.map((tech) => (
                          <span
                            key={tech}
                            className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${level.color} bg-opacity-10 text-white border border-white/20`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Time & Link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{level.time}</span>
                        </div>

                        <a
                          href={`https://github.com/devgunnu/LearnLens/blob/main/docs/README-LEVEL-${level.level}.md`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 group"
                        >
                          <span>View Tutorial</span>
                          <motion.svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            whileHover={{ x: 3 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </motion.svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/devgunnu/LearnLens/tree/main/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300"
          >
            <span>Start Learning Journey</span>
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
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;
