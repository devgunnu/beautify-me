import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import * as faceapi from '@vladmandic/face-api';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const streamRef = useRef(null);
  const appSectionRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [beautyMode, setBeautyMode] = useState(false);

  // Face detection state
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const faceDetectorRef = useRef(null);

  // Draggable stickers state
  const [placedStickers, setPlacedStickers] = useState([]);
  const [draggingSticker, setDraggingSticker] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // AI state
  const [geminiKey, setGeminiKey] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const filters = [
    { id: 'none', name: 'Original', icon: '✨' },
    { id: 'grayscale', name: 'Grayscale', icon: '⚫' },
    { id: 'sepia', name: 'Sepia', icon: '🟤' },
    { id: 'invert', name: 'Invert', icon: '🔄' },
    { id: 'brightness', name: 'Bright', icon: '☀️' },
    { id: 'contrast', name: 'Contrast', icon: '⚡' },
    { id: 'saturate', name: 'Vibrant', icon: '🌈' },
    { id: 'blur', name: 'Blur', icon: '💫' },
    { id: 'vintage', name: 'Vintage', icon: '📷' },
    { id: 'cool', name: 'Cool', icon: '❄️' },
    { id: 'warm', name: 'Warm', icon: '🔥' },
    { id: 'dramatic', name: 'Dramatic', icon: '🎭' },
    { id: 'moonlight', name: 'Moonlight', icon: '🌙' },
    { id: 'sunset', name: 'Sunset', icon: '🌅' },
    { id: 'ocean', name: 'Ocean', icon: '🌊' },
    { id: 'rose', name: 'Rose', icon: '🌹' },
    { id: 'noir', name: 'Noir', icon: '🎬' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖' },
    { id: 'pastel', name: 'Pastel', icon: '🎨' },
    { id: 'neon', name: 'Neon', icon: '💡' },
  ];

  // Stickers Definition (simplified - no landmarks needed)
  const stickers = [
    // Animals
    { id: 'dog', name: 'Dog', icon: '🐶', category: 'animals' },
    { id: 'cat', name: 'Cat', icon: '🐱', category: 'animals' },
    { id: 'bunny', name: 'Bunny', icon: '🐰', category: 'animals' },
    { id: 'bear', name: 'Bear', icon: '🐻', category: 'animals' },
    { id: 'panda', name: 'Panda', icon: '🐼', category: 'animals' },

    // Accessories
    { id: 'glasses', name: 'Glasses', icon: '🕶️', category: 'accessories' },
    { id: 'crown', name: 'Crown', icon: '👑', category: 'accessories' },
    { id: 'hat', name: 'Hat', icon: '🎩', category: 'accessories' },
    { id: 'party-hat', name: 'Party Hat', icon: '🎉', category: 'accessories' },

    // Fun
    { id: 'hearts', name: 'Hearts', icon: '💕', category: 'fun' },
    { id: 'stars', name: 'Stars', icon: '⭐', category: 'fun' },
    { id: 'sparkles', name: 'Sparkles', icon: '✨', category: 'fun' },
    { id: 'flowers', name: 'Flowers', icon: '🌸', category: 'fun' },

    // Expressions
    { id: 'laugh', name: 'LOL', icon: '😂', category: 'expressions' },
    { id: 'cool', name: 'Cool', icon: '😎', category: 'expressions' },
    { id: 'fire', name: 'Fire', icon: '🔥', category: 'expressions' },

    // Seasonal
    { id: 'santa', name: 'Santa', icon: '🎅', category: 'seasonal' },
    { id: 'snowflake', name: 'Snowflake', icon: '❄️', category: 'seasonal' },
    { id: 'pumpkin', name: 'Pumpkin', icon: '🎃', category: 'seasonal' },
  ];

  // Load face-api.js models
  const loadFaceApiModels = async () => {
    try {
      console.log('Loading face-api.js models...');
      const MODEL_URL = '/models';

      // Load Tiny Face Detector and Face Landmark models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

      console.log('Face-api.js models loaded successfully!');
      faceDetectorRef.current = true; // Mark as loaded
      return true;
    } catch (err) {
      console.error('Error loading face-api models:', err);
      setError('Failed to load face detection models: ' + err.message);
      return false;
    }
  };

  // Detect faces in the video using face-api.js
  const detectFaces = async () => {
    if (!faceDetectorRef.current) {
      return [];
    }

    if (!videoRef.current) {
      return [];
    }

    if (!faceDetectionEnabled) {
      return [];
    }

    try {
      const video = videoRef.current;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        return [];
      }

      // Detect faces with landmarks using face-api.js
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      });

      const detections = await faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks();

      return detections;
    } catch (err) {
      console.error('Error detecting faces:', err);
      return [];
    }
  };

  // Draw facial landmarks (for debugging)
  const drawLandmarks = (ctx, detections) => {
    if (!showLandmarks || detections.length === 0) return;

    detections.forEach((detection) => {
      const landmarks = detection.landmarks.positions;

      // Draw all 68 landmarks
      landmarks.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
      });
    });
  };

  // Add a new sticker to the canvas
  const addSticker = (stickerTemplate) => {
    const newSticker = {
      id: `${stickerTemplate.id}-${Date.now()}`,
      icon: stickerTemplate.icon,
      name: stickerTemplate.name,
      x: 50, // Percentage from left
      y: 50, // Percentage from top
      size: 60, // px
      rotation: 0,
    };
    setPlacedStickers([...placedStickers, newSticker]);
  };

  // Remove a sticker
  const removeSticker = (stickerId) => {
    setPlacedStickers(placedStickers.filter(s => s.id !== stickerId));
  };

  // Handle sticker drag start
  const handleStickerDragStart = (e, sticker) => {
    e.preventDefault();
    setDraggingSticker(sticker.id);

    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    dragOffsetRef.current = {
      x: clientX - rect.left - (sticker.x * rect.width / 100),
      y: clientY - rect.top - (sticker.y * rect.height / 100),
    };
  };

  // Handle sticker drag move
  const handleStickerDragMove = (e) => {
    if (!draggingSticker) return;

    const container = document.querySelector('.video-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left - dragOffsetRef.current.x) / rect.width) * 100;
    const y = ((clientY - rect.top - dragOffsetRef.current.y) / rect.height) * 100;

    setPlacedStickers(placedStickers.map(s =>
      s.id === draggingSticker
        ? { ...s, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
        : s
    ));
  };

  // Handle sticker drag end
  const handleStickerDragEnd = () => {
    setDraggingSticker(null);
  };

  const applyFilter = (ctx, filterType) => {
    const intensity = filterIntensity / 100;
    let filterString = '';

    // Build base filter based on type
    switch (filterType) {
      case 'grayscale':
        filterString = `grayscale(${100 * intensity}%)`;
        break;
      case 'sepia':
        filterString = `sepia(${100 * intensity}%)`;
        break;
      case 'invert':
        filterString = `invert(${100 * intensity}%)`;
        break;
      case 'brightness':
        const brightVal = 1 + (0.3 * intensity);
        filterString = `brightness(${brightVal})`;
        break;
      case 'contrast':
        const contrastVal = 1 + (0.5 * intensity);
        filterString = `contrast(${contrastVal})`;
        break;
      case 'saturate':
        const saturateVal = 1 + (1 * intensity);
        filterString = `saturate(${saturateVal})`;
        break;
      case 'blur':
        const blurVal = 3 * intensity;
        filterString = `blur(${blurVal}px)`;
        break;
      case 'vintage':
        filterString = `sepia(${50 * intensity}%) contrast(${1 + 0.2 * intensity}) brightness(${1 - 0.1 * intensity})`;
        break;
      case 'cool':
        filterString = `hue-rotate(${180 * intensity}deg) saturate(${1 + 0.3 * intensity})`;
        break;
      case 'warm':
        filterString = `sepia(${30 * intensity}%) saturate(${1 + 0.4 * intensity}) brightness(${1 + 0.1 * intensity})`;
        break;
      case 'dramatic':
        filterString = `contrast(${1 + 0.5 * intensity}) brightness(${1 - 0.1 * intensity}) saturate(${1 + 0.3 * intensity})`;
        break;
      case 'moonlight':
        filterString = `brightness(${1 - 0.2 * intensity}) contrast(${1 + 0.2 * intensity}) saturate(${1 - 0.3 * intensity}) hue-rotate(${200 * intensity}deg)`;
        break;
      case 'sunset':
        filterString = `sepia(${40 * intensity}%) saturate(${1 + 0.5 * intensity}) brightness(${1 + 0.1 * intensity}) hue-rotate(${-10 * intensity}deg)`;
        break;
      case 'ocean':
        filterString = `hue-rotate(${180 * intensity}deg) saturate(${1 + 0.4 * intensity}) brightness(${1 + 0.1 * intensity})`;
        break;
      case 'rose':
        filterString = `hue-rotate(${320 * intensity}deg) saturate(${1 + 0.3 * intensity}) brightness(${1 + 0.05 * intensity})`;
        break;
      case 'noir':
        filterString = `grayscale(${100 * intensity}%) contrast(${1 + 0.8 * intensity}) brightness(${1 - 0.1 * intensity})`;
        break;
      case 'cyberpunk':
        filterString = `hue-rotate(${270 * intensity}deg) saturate(${1 + 1 * intensity}) contrast(${1 + 0.3 * intensity})`;
        break;
      case 'pastel':
        filterString = `saturate(${1 - 0.4 * intensity}) brightness(${1 + 0.2 * intensity}) contrast(${1 - 0.1 * intensity})`;
        break;
      case 'neon':
        filterString = `saturate(${1 + 1.5 * intensity}) contrast(${1 + 0.4 * intensity}) brightness(${1 + 0.2 * intensity})`;
        break;
      default:
        filterString = 'none';
    }

    // Apply beauty mode if enabled
    if (beautyMode) {
      if (filterString === 'none') {
        filterString = 'blur(0.5px) brightness(1.05)';
      } else {
        filterString += ' blur(0.5px) brightness(1.05)';
      }
    }

    ctx.filter = filterString;
  };

  const capturePhoto = () => {
    if (canvasRef.current) {
      setShowCaptureFlash(true);

      // Create a composite canvas with stickers
      const originalCanvas = canvasRef.current;
      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = originalCanvas.width;
      compositeCanvas.height = originalCanvas.height;
      const ctx = compositeCanvas.getContext('2d');

      // Draw the original canvas (video + filters + landmarks)
      ctx.drawImage(originalCanvas, 0, 0);

      // Draw placed stickers on top
      if (placedStickers.length > 0) {
        // Apply mirror transformation to match live view
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-compositeCanvas.width, 0);

        placedStickers.forEach((sticker) => {
          const x = (sticker.x / 100) * compositeCanvas.width;
          const y = (sticker.y / 100) * compositeCanvas.height;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((sticker.rotation * Math.PI) / 180);
          ctx.font = `${sticker.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sticker.icon, 0, 0);
          ctx.restore();
        });

        ctx.restore();
      }

      // Create image from composite canvas
      const imageData = compositeCanvas.toDataURL('image/png');
      setCapturedPhoto(imageData);

      // Remove flash after animation
      setTimeout(() => setShowCaptureFlash(false), 200);
    }
  };

  const downloadPhoto = () => {
    if (capturedPhoto) {
      const link = document.createElement('a');
      link.download = `beautify-me-${Date.now()}.png`;
      link.href = capturedPhoto;
      link.click();
    }
  };

  const closeCapturedPhoto = () => {
    setCapturedPhoto(null);
  };

  // Gemini AI Functions
  const getAIRecommendation = async () => {
    if (!geminiKey) {
      setError('Please enter your Gemini API key to use AI features');
      return;
    }

    setIsAiProcessing(true);
    setAiRecommendation('');
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const currentTime = new Date().getHours();
      const timeOfDay = currentTime < 12 ? 'morning' : currentTime < 18 ? 'afternoon' : 'evening';

      const prompt = `You are a photography and filter expert. Suggest ONE of the best filters from this list for a webcam photo during the ${timeOfDay}:

      Available filters: ${filters.map(f => f.name).join(', ')}.

      Respond with ONLY the filter name and one brief sentence explaining why it's good for this time of day. Keep it under 30 words.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setAiRecommendation(text);
      setIsAiProcessing(false);
    } catch (err) {
      console.error('Error getting AI recommendation:', err);
      setError(`Failed to get AI recommendation: ${err.message || 'Check your API key'}`);
      setAiRecommendation('');
      setIsAiProcessing(false);
    }
  };

  const renderFrame = async () => {
    if (videoRef.current && canvasRef.current && isWebcamActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video only if they've changed
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations and filter - keep everything in one context
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        // Draw video with filter
        applyFilter(ctx, selectedFilter);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset filter for overlays but keep same transform context
        ctx.filter = 'none';

        // Draw face landmarks if enabled (for debugging)
        if (faceDetectionEnabled) {
          const detections = await detectFaces();
          if (detections && detections.length > 0) {
            drawLandmarks(ctx, detections);
          }
        }

        // Restore context once at the end
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };

  // Load face-api models on mount
  useEffect(() => {
    loadFaceApiModels();
    // Load API key from environment variable
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    if (apiKey) {
      setGeminiKey(apiKey);
    }
  }, []);

  useEffect(() => {
    if (isWebcamActive) {
      renderFrame();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebcamActive, selectedFilter, beautyMode, filterIntensity, faceDetectionEnabled, showLandmarks]);

  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });

        setIsWebcamActive(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access webcam. Please ensure you have granted camera permissions.');
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setIsWebcamActive(false);
      setSelectedFilter('none');
    }
  };

  const scrollToApp = () => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Real-time AI Filters</span>
          </div>

          <h1 className="hero-title">
            Beautify Me
          </h1>

          <p className="hero-subtitle">
            Transform your appearance with stunning real-time filters.
            <br />
            Express yourself like never before.
          </p>

          <div className="hero-buttons">
            <button className="cta-button primary" onClick={scrollToApp}>
              <span>Try It Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="cta-button secondary" onClick={scrollToApp}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Watch Demo</span>
            </button>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Real-Time Processing</h3>
              <p>Instant filter application with zero lag</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3>Creative Filters</h3>
              <p>Wide variety of stunning effects</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3>Privacy First</h3>
              <p>Everything runs locally in your browser</p>
            </div>
          </div>

          <div className="scroll-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">20+</div>
            <div className="stat-label">Creative Filters</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">60 FPS</div>
            <div className="stat-label">Real-Time Processing</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Private & Secure</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0 MS</div>
            <div className="stat-label">Zero Latency</div>
          </div>
        </div>
      </section>

      {/* Filter Showcase Section */}
      <section className="showcase-section">
        <div className="showcase-content">
          <div className="section-header">
            <h2 className="section-title">Stunning Filter Collection</h2>
            <p className="section-subtitle">Experience the magic of real-time transformation</p>
          </div>

          <div className="filter-showcase-grid">
            <div className="showcase-card">
              <div className="showcase-icon">🌈</div>
              <h3>Vibrant</h3>
              <p>Boost colors and saturation</p>
            </div>
            <div className="showcase-card">
              <div className="showcase-icon">📷</div>
              <h3>Vintage</h3>
              <p>Classic retro camera look</p>
            </div>
            <div className="showcase-card">
              <div className="showcase-icon">❄️</div>
              <h3>Cool</h3>
              <p>Blue and cool tones</p>
            </div>
            <div className="showcase-card">
              <div className="showcase-icon">🔥</div>
              <h3>Warm</h3>
              <p>Orange and warm hues</p>
            </div>
            <div className="showcase-card">
              <div className="showcase-icon">🎭</div>
              <h3>Dramatic</h3>
              <p>High contrast effects</p>
            </div>
            <div className="showcase-card">
              <div className="showcase-icon">⚫</div>
              <h3>Grayscale</h3>
              <p>Classic black and white</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-content">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Enable Camera</h3>
              <p>Click the start button to activate your webcam. We'll ask for permission just once.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3>Choose Your Filter</h3>
              <p>Scroll through our collection of filters and tap to apply them instantly.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3>Capture & Share</h3>
              <p>Take photos with filters applied and download them to share with friends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="enhanced-features-section">
        <div className="enhanced-features-content">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">Everything you need for the perfect shot</p>
          </div>

          <div className="enhanced-features-grid">
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Real-time processing at 60 FPS with zero lag or delay</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">🎨</div>
              <h3>20+ Filters</h3>
              <p>Wide variety of creative filters from vintage to modern</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">🔒</div>
              <h3>100% Private</h3>
              <p>All processing happens locally in your browser</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">📸</div>
              <h3>Capture Photos</h3>
              <p>Take high-quality photos with filters applied</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">💾</div>
              <h3>Download Instantly</h3>
              <p>Save your filtered photos in HD quality</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">🌐</div>
              <h3>No Registration</h3>
              <p>Start using immediately without signing up</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">📱</div>
              <h3>Cross-Platform</h3>
              <p>Works on desktop, tablet, and mobile devices</p>
            </div>
            <div className="enhanced-feature-card">
              <div className="enhanced-feature-icon">✨</div>
              <h3>Beauty Mode</h3>
              <p>Professional-grade skin smoothing and enhancement</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-content">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is my video data stored anywhere?</h3>
              <p>No! All video processing happens locally in your browser. We never store, upload, or access your camera feed.</p>
            </div>
            <div className="faq-item">
              <h3>Which browsers are supported?</h3>
              <p>Beautify Me works on all modern browsers including Chrome, Firefox, Safari, and Edge.</p>
            </div>
            <div className="faq-item">
              <h3>Do I need to install anything?</h3>
              <p>Not at all! It's a web application that works directly in your browser. No downloads or installations required.</p>
            </div>
            <div className="faq-item">
              <h3>Can I use this on mobile?</h3>
              <p>Yes! Beautify Me is fully responsive and works great on smartphones and tablets.</p>
            </div>
            <div className="faq-item">
              <h3>Are the filters free to use?</h3>
              <p>Absolutely! All filters and features are completely free with no hidden charges or subscriptions.</p>
            </div>
            <div className="faq-item">
              <h3>Can I download my filtered photos?</h3>
              <p>Yes! You can capture photos with any filter applied and download them instantly in high quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="app-section" ref={appSectionRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Try It Out</h2>
            <p className="section-subtitle">Start your webcam and experience the magic</p>
          </div>

          <div className="app-layout">
            {/* Left Side - Camera */}
            <div className="camera-section">
              <div className="video-container">
                {!isWebcamActive && (
                  <div className="placeholder">
                    <div className="placeholder-content">
                      <svg className="camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p>Click the button below to start your webcam</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="webcam hidden"
                />
                <canvas
                  ref={canvasRef}
                  className={`webcam-canvas ${!isWebcamActive ? 'hidden' : ''}`}
                />

                {/* Sticker Overlay Layer */}
                {isWebcamActive && (
                  <div
                    className="sticker-overlay"
                    onMouseMove={handleStickerDragMove}
                    onMouseUp={handleStickerDragEnd}
                    onTouchMove={handleStickerDragMove}
                    onTouchEnd={handleStickerDragEnd}
                  >
                    {placedStickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        className="placed-sticker"
                        style={{
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          fontSize: `${sticker.size}px`,
                          transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scaleX(-1)`,
                          cursor: draggingSticker === sticker.id ? 'grabbing' : 'grab',
                        }}
                      >
                        <span
                          className="sticker-emoji"
                          onMouseDown={(e) => handleStickerDragStart(e, sticker)}
                          onTouchStart={(e) => handleStickerDragStart(e, sticker)}
                        >
                          {sticker.icon}
                        </span>
                        <button
                          className="sticker-delete"
                          onClick={() => removeSticker(sticker.id)}
                          title="Remove sticker"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showCaptureFlash && <div className="capture-flash" />}

                {isWebcamActive && (
                  <button className="capture-button" onClick={capturePhoto} title="Capture Photo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filters below camera */}
              {isWebcamActive && (
                <div className="filters-container">
                  <div className="filters-scroll">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
                        onClick={() => setSelectedFilter(filter.id)}
                      >
                        <span className="filter-icon">{filter.icon}</span>
                        <span className="filter-name">{filter.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Controls */}
            {isWebcamActive && (
              <div className="controls-sidebar">
                {/* Basic Controls */}
                <div className="control-panel">
                  <h3 className="panel-title">Basic Controls</h3>
                  <div className="control-group">
                    <label className="control-label">
                      <input
                        type="checkbox"
                        checked={beautyMode}
                        onChange={(e) => setBeautyMode(e.target.checked)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-label">✨ Beauty Mode</span>
                    </label>
                  </div>

                  <div className="control-group">
                    <label className="control-label">
                      <span className="slider-label">Filter Intensity: {filterIntensity}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterIntensity}
                        onChange={(e) => setFilterIntensity(Number(e.target.value))}
                        className="intensity-slider"
                      />
                    </label>
                  </div>
                </div>

                {/* AI Features */}
                <div className="control-panel">
                  <h3 className="panel-title">AI Features</h3>

                  <div className="control-group">
                    <label className="control-label">
                      <input
                        type="checkbox"
                        checked={faceDetectionEnabled}
                        onChange={(e) => setFaceDetectionEnabled(e.target.checked)}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-label">🤖 Face Detection {faceDetectionEnabled ? '(ENABLED)' : '(OFF)'}</span>
                    </label>
                  </div>

                  {faceDetectionEnabled && (
                    <div className="control-group">
                      <label className="control-label">
                        <input
                          type="checkbox"
                          checked={showLandmarks}
                          onChange={(e) => setShowLandmarks(e.target.checked)}
                          className="toggle-checkbox"
                        />
                        <span className="toggle-label">👁️ Show Landmarks</span>
                      </label>
                    </div>
                  )}

                  <div className="control-group">
                    <button
                      className="ai-button"
                      onClick={getAIRecommendation}
                      disabled={isAiProcessing}
                    >
                      {isAiProcessing ? '🤔 Thinking...' : '✨ Get AI Recommendation'}
                    </button>
                    {aiRecommendation && (
                      <div className="ai-recommendation">
                        <p><strong>AI:</strong> {aiRecommendation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Draggable Stickers */}
                <div className="control-panel stickers-panel">
                  <h3 className="panel-title">Stickers</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '15px', marginTop: '-10px' }}>
                    Click to add stickers, then drag to position
                  </p>

                  {['animals', 'accessories', 'fun', 'expressions', 'seasonal'].map(category => (
                    <div key={category} className="sticker-category">
                      <h4 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                      <div className="stickers-grid">
                        {stickers.filter(s => s.category === category).map((sticker) => (
                          <button
                            key={sticker.id}
                            className="sticker-button"
                            onClick={() => addSticker(sticker)}
                            title={sticker.name}
                          >
                            <span className="sticker-icon">{sticker.icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {capturedPhoto && (
            <div className="photo-preview-modal" onClick={closeCapturedPhoto}>
              <div className="photo-preview-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-preview" onClick={closeCapturedPhoto}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img src={capturedPhoto} alt="Captured" className="preview-image" />
                <button className="download-button" onClick={downloadPhoto}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Photo
                </button>
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <div className="controls">
            {!isWebcamActive ? (
              <button className="start-button" onClick={startWebcam}>
                <span className="button-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </span>
                Start Webcam
              </button>
            ) : (
              <button className="stop-button" onClick={stopWebcam}>
                <span className="button-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                </span>
                Stop Webcam
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">Beautify Me</h3>
            <p className="footer-tagline">Transform your look with real-time filters</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#twitter" className="social-icon" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#instagram" className="social-icon" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
              <a href="#github" className="social-icon" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Beautify Me. Made with passion for creativity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
