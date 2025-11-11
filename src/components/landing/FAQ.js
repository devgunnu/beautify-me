import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is LearnLens free?',
      answer:
        'Yes! LearnLens is completely free and open-source. The only optional cost is if you want to use AI features (Levels 6-7), which require a Google Gemini API key. Google offers a generous free tier for the Gemini API.',
    },
    {
      question: 'Is my data private?',
      answer:
        'Absolutely! All processing happens locally in your browser. Your photos and webcam feed never leave your device. We don\'t collect any data, use cookies, or track your activity. You have complete control over your privacy.',
    },
    {
      question: 'Do I need to install anything?',
      answer:
        'No installation required! Just open the website and start using it. For developers who want to run it locally or follow the learning path, you\'ll need Node.js installed on your computer.',
    },
    {
      question: 'Can I use this offline?',
      answer:
        'Core filters work offline once the page is loaded. However, AI features (recommendations, vision analysis) require an internet connection to communicate with the Gemini API.',
    },
    {
      question: 'What browsers are supported?',
      answer:
        'LearnLens works on all modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, and Opera 76+. You need webcam access and WebRTC support for the full experience.',
    },
    {
      question: 'How does face detection work?',
      answer:
        'We use TensorFlow.js and face-api.js to run machine learning models directly in your browser. The models detect 68 facial landmark points and can recognize 7 different emotions - all processed locally for your privacy.',
    },
    {
      question: 'Can I use this for commercial projects?',
      answer:
        'Yes! LearnLens is licensed under the MIT License, which allows you to use, modify, and distribute it freely - even for commercial purposes. Just keep the license notice in your code.',
    },
    {
      question: 'How long does the learning tutorial take?',
      answer:
        'The complete 8-level tutorial takes approximately 15-20 hours to complete, but you can go at your own pace. Each level is self-contained, so you can learn over a few days or weeks.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know about LearnLens
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-semibold text-white pr-8">
                    {faq.question}
                  </h3>
                  <motion.svg
                    className="w-6 h-6 text-primary-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-400 mt-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-4">
            Feel free to reach out on GitHub Discussions or open an issue
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/devgunnu/LearnLens/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Discussions</span>
            </a>
            <a
              href="https://github.com/devgunnu/LearnLens/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-all duration-300"
            >
              <span>Open an Issue</span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
