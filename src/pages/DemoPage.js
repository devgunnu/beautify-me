import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import * as faceapi from '@vladmandic/face-api';
import { GoogleGenerativeAI } from '@google/generative-ai';

function DemoPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const renderingActiveRef = useRef(false);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [beautyMode, setBeautyMode] = useState(false);

  // Face detection state
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const faceDetectorRef = useRef(null);

  // Draggable stickers state
  const [placedStickers, setPlacedStickers] = useState([]);
  const [draggingSticker, setDraggingSticker] = useState(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // AI state
  const [geminiKey, setGeminiKey] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiError, setAiError] = useState('');

  // AI Vision Analysis state
  /** Stores the AI skin analysis results */
  const [skinAnalysisResult, setSkinAnalysisResult] = useState('');
  /** Loading state for vision API analysis */
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skinAnalysisError, setSkinAnalysisError] = useState('');

  // Tabbed interface state
  const [activeTab, setActiveTab] = useState('filters');

  // Face detection data state (separate from rendering)
  /** Stores the most recent face detection results */
  const [faceDetections, setFaceDetections] = useState([]);
  const faceDetectionsRef = useRef([]);
  const faceDetectionIntervalRef = useRef(null);
  const faceDetectionRunningRef = useRef(false);

  // Face analysis feature toggles
  /** Show bounding boxes around detected faces */
  const [showBoundingBox, setShowBoundingBox] = useState(false);

  /** Show expression recognition results */
  const [showExpressions, setShowExpressions] = useState(false);

  /** Enable landmark color groups for educational visualization */
  const [landmarkColorMode, setLandmarkColorMode] = useState('none'); // 'none', 'all', 'groups'

  // Face matching state
  /** Reference face descriptor for comparison */
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);

  /** Show face matching similarity */
  // eslint-disable-next-line no-unused-vars
  const [showFaceMatching, setShowFaceMatching] = useState(false);

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

  /**
   * Load Face-API.js Models
   *
   * Loads all required ML models for face detection features.
   * Educational Note: These models run entirely in the browser using TensorFlow.js
   *
   * Models loaded:
   * - Tiny Face Detector: Fast face detection (190KB)
   * - Face Landmark 68: 68-point facial landmarks (350KB)
   * - Face Expression: Emotion recognition (310KB)
   * - Face Recognition: Face descriptors for matching (6.2MB)
   */
  const loadFaceApiModels = async () => {
    try {
      console.log('Loading face-api.js models...');
      // Use PUBLIC_URL for GitHub Pages compatibility
      const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

      // Load all models in parallel for faster initialization
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      console.log('Face-api.js models loaded successfully!');
      faceDetectorRef.current = true; // Mark as loaded
      return true;
    } catch (err) {
      console.error('Error loading face-api models:', err);
      setError('Failed to load face detection models: ' + err.message);
      return false;
    }
  };

  /**
   * Detect Faces with Full Analysis
   *
   * Detects faces and optionally extracts:
   * - Bounding boxes and confidence scores
   * - 68 facial landmarks
   * - Expression probabilities (7 emotions)
   * - Face descriptors (for recognition)
   *
   * Educational Note: face-api.js uses method chaining to compose features.
   * Each .with* method adds another analysis layer.
   */
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

      // Configure detection options
      // inputSize: Higher = more accurate but slower (128-608)
      // scoreThreshold: Confidence threshold (0-1)
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      });

      // Build detection chain based on enabled features
      // Detect on the original video element (unmirrored)
      let detectionChain = faceapi
        .detectAllFaces(video, options)
        .withFaceLandmarks();

      // Add expression recognition if enabled
      if (showExpressions) {
        detectionChain = detectionChain.withFaceExpressions();
      }

      // Add face descriptors if face matching is enabled
      if (referenceDescriptor) {
        detectionChain = detectionChain.withFaceDescriptors();
      }

      const detections = await detectionChain;

      return detections;
    } catch (err) {
      console.error('Error detecting faces:', err);
      return [];
    }
  };

  /**
   * Draw Facial Landmarks
   *
   * Draws 68 landmark points on detected faces.
   * Educational Note: Supports color-coded groups for learning facial structure.
   */
  const drawLandmarks = (ctx, detections) => {
    if (landmarkColorMode === 'none' || detections.length === 0) return;

    detections.forEach((detection) => {
      const landmarks = detection.landmarks.positions;

      if (landmarkColorMode === 'all') {
        // Draw all landmarks in green
        landmarks.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = '#00FF00';
          ctx.fill();
        });
      } else if (landmarkColorMode === 'groups') {
        // Draw color-coded groups for education
        const drawGroup = (start, end, color) => {
          for (let i = start; i <= end; i++) {
            ctx.beginPath();
            ctx.arc(landmarks[i].x, landmarks[i].y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }
        };

        drawGroup(0, 16, '#FF6B6B');    // Jaw - Red
        drawGroup(17, 21, '#4ECDC4');   // Right Eyebrow - Cyan
        drawGroup(22, 26, '#45B7D1');   // Left Eyebrow - Blue
        drawGroup(27, 35, '#FFA07A');   // Nose - Orange
        drawGroup(36, 41, '#98D8C8');   // Right Eye - Light Green
        drawGroup(42, 47, '#6BCF7F');   // Left Eye - Green
        drawGroup(48, 67, '#F7DC6F');   // Mouth - Yellow
      }
    });
  };

  /**
   * Draw Bounding Boxes
   *
   * Draws rectangles around detected faces with confidence scores.
   * Educational Note: Shows detection confidence as a percentage.
   */
  const drawBoundingBoxes = (ctx, detections) => {
    if (!showBoundingBox || detections.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    detections.forEach((detection) => {
      const box = detection.detection.box;
      const score = detection.detection.score;

      // Canvas is mirrored with scale(-1, 1) and translate(-canvas.width, 0)
      // Drawing operations are automatically mirrored by the transform
      // Draw rectangle
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 5;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw confidence score with un-mirrored text
      const confidence = Math.round(score * 100);
      ctx.save();
      ctx.scale(-1, 1);
      ctx.fillStyle = '#00FF00';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${confidence}%`, -(box.x + box.width), box.y - 10);
      ctx.restore();
    });
  };

  /**
   * Draw Expression Recognition
   *
   * Displays detected emotions with emojis and probability bars.
   * Educational Note: Shows ML model predictions for 7 emotion categories.
   */
  const drawExpressions = (ctx, detections) => {
    if (!showExpressions || detections.length === 0) return;

    detections.forEach((detection) => {
      if (!detection.expressions) return;

      const box = detection.detection.box;
      const expressions = detection.expressions;

      // Get dominant emotion
      const dominant = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      // Emotion to emoji mapping
      const emotionEmojis = {
        neutral: '😐',
        happy: '😊',
        sad: '😢',
        angry: '😠',
        fearful: '😨',
        disgusted: '🤢',
        surprised: '😲'
      };

      // Save context state
      ctx.save();

      // Un-mirror the text by scaling back
      ctx.scale(-1, 1);

      // Position emoji and text ABOVE the bounding box
      // Place them centered above the box
      const emojiY = box.y - 60; // Position above the box
      const textY = box.y - 10; // Text below emoji but still above box
      const centerX = box.x + (box.width / 2); // Center of the box

      // Draw dominant emotion with emoji
      const emoji = emotionEmojis[dominant] || '😐';
      ctx.font = '48px Arial';
      ctx.fillText(emoji, -centerX, emojiY);

      // Draw emotion name and percentage below the emoji
      const percentage = Math.round(expressions[dominant] * 100);
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      const emotionText = `${dominant} ${percentage}%`;
      ctx.strokeText(emotionText, -(centerX + 30), textY);
      ctx.fillText(emotionText, -(centerX + 30), textY);

      // Restore context
      ctx.restore();
    });
  };

  /**
   * Draw Face Matching Similarity
   *
   * Shows similarity percentage when comparing to reference face.
   * Educational Note: Uses euclidean distance between face descriptors.
   */
  const drawFaceMatching = (ctx, detections) => {
    if (!referenceDescriptor || detections.length === 0) return;

    detections.forEach((detection) => {
      if (!detection.descriptor) return;

      const box = detection.detection.box;

      // Calculate euclidean distance
      const distance = faceapi.euclideanDistance(referenceDescriptor, detection.descriptor);

      // Convert distance to similarity percentage (lower distance = higher similarity)
      // Typical match: distance < 0.6, non-match: distance > 0.6
      const similarity = Math.max(0, Math.min(100, (1 - distance) * 100));

      // Draw similarity indicator with un-mirrored text
      const color = similarity > 60 ? '#00FF00' : similarity > 40 ? '#FFA500' : '#FF0000';
      ctx.save();
      ctx.scale(-1, 1);
      ctx.fillStyle = color;
      ctx.font = 'bold 18px Arial';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      const text = `Match: ${Math.round(similarity)}%`;
      ctx.strokeText(text, -(box.x + box.width), box.y + box.height + 25);
      ctx.fillText(text, -(box.x + box.width), box.y + box.height + 25);
      ctx.restore();
    });
  };

  /**
   * Capture Reference Face for Matching
   *
   * Captures the current face descriptor to use as reference for comparison.
   * Educational Note: Face descriptors are 128-dimensional vectors that uniquely identify faces.
   */
  const captureReferenceFace = async () => {
    if (!videoRef.current || !faceDetectorRef.current) {
      setError('Face detection not ready');
      return;
    }

    try {
      const video = videoRef.current;
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      });

      const detection = await faceapi
        .detectSingleFace(video, options)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection && detection.descriptor) {
        setReferenceDescriptor(detection.descriptor);
        setShowFaceMatching(true);
        console.log('Reference face captured successfully!');
      } else {
        setError('No face detected. Please ensure your face is visible.');
      }
    } catch (err) {
      console.error('Error capturing reference face:', err);
      setError('Failed to capture reference face');
    }
  };

  /**
   * Clear Reference Face
   *
   * Removes the stored reference face descriptor.
   */
  const clearReferenceFace = () => {
    setReferenceDescriptor(null);
    setShowFaceMatching(false);
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
        placedStickers.forEach((sticker) => {
          // Canvas is already mirrored, so use positions directly
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
      return;
    }

    setIsAiProcessing(true);
    setAiRecommendation('');
    setAiError('');

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
      // Check if it's an API key error
      if (err.message && err.message.includes('API key')) {
        setAiError('API key invalid');
      } else {
        setAiError('Failed to get recommendation');
      }
      setAiRecommendation('');
      setIsAiProcessing(false);
    }
  };

  /**
   * Analyze Appearance with Gemini Vision API
   *
   * Educational Note: This demonstrates multimodal AI - sending both image and text to an AI model.
   * The function captures the current webcam frame (without stickers), converts it to base64,
   * and sends it to Gemini Vision API for personalized filter recommendations.
   *
   * Key Learning Points:
   * - Canvas to base64 image conversion
   * - Multimodal AI API integration
   * - Async/await error handling
   * - Image data URL format for APIs
   */
  const analyzeWithGeminiVision = async () => {
    // Validate API key exists
    if (!geminiKey) {
      return;
    }

    // Validate webcam is active
    if (!isWebcamActive || !videoRef.current || !canvasRef.current) {
      return;
    }

    setIsAnalyzing(true);
    setSkinAnalysisResult('');
    setSkinAnalysisError('');

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Create a temporary canvas to capture current frame WITHOUT stickers
      // Educational Note: We create a clean capture for better AI analysis
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');

      // Apply mirror transformation to match live view
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-tempCanvas.width, 0);

      // Draw video with current filter (no stickers, no face detection overlays)
      applyFilter(ctx, selectedFilter);
      ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      ctx.restore();

      // Convert canvas to base64 image
      // Educational Note: toDataURL returns format "data:image/png;base64,..."
      // We need to extract just the base64 part for Gemini API
      const imageDataUrl = tempCanvas.toDataURL('image/jpeg', 0.8); // Use JPEG for smaller size
      const base64Image = imageDataUrl.split(',')[1]; // Remove "data:image/jpeg;base64," prefix

      // Initialize Gemini Vision API
      // Educational Note: Using gemini-2.5-flash for multimodal (image + text) analysis
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Create prompt for personalized filter recommendations
      const prompt = `You are an expert in photography, skin tones, and visual aesthetics. Analyze this person's appearance in the webcam photo and provide personalized filter recommendations.

Available filters: ${filters.map(f => f.name).join(', ')}.

Please analyze:
1. Skin tone and undertones (warm/cool/neutral)
2. Current lighting conditions
3. Which 3 filters would look BEST on this person

Respond in this format:
**Skin Analysis:** [Brief 1-sentence analysis of skin tone and lighting]
**Top 3 Recommended Filters:**
1. [Filter Name] - [Why it suits them]
2. [Filter Name] - [Why it suits them]
3. [Filter Name] - [Why it suits them]

Keep recommendations under 80 words total. Be specific and helpful.`;

      // Send image and prompt to Gemini Vision API
      // Educational Note: Multimodal AI accepts both text and images in a single request
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const analysisText = response.text();

      // Update state with results
      setSkinAnalysisResult(analysisText);
      setIsAnalyzing(false);

      console.log('✅ AI Vision Analysis completed successfully!');
    } catch (err) {
      console.error('Error analyzing with Gemini Vision:', err);
      // Check if it's an API key error
      if (err.message && err.message.includes('API key')) {
        setSkinAnalysisError('API key invalid');
      } else {
        setSkinAnalysisError('Analysis failed');
      }
      setSkinAnalysisResult('');
      setIsAnalyzing(false);
    }
  };

  /**
   * Face Detection Loop (Separate from Video Rendering)
   *
   * This runs independently at 30fps for smooth real-time tracking.
   * Educational Note: Separating ML inference from rendering prevents frame drops.
   * The video renders at 60fps while face detection runs at 30fps.
   *
   * Uses a ref-based flag to check if loop should continue, avoiding stale closures.
   */
  const faceDetectionLoop = async () => {
    // Check running flag first - this allows proper stopping
    if (!faceDetectionRunningRef.current) {
      return;
    }

    if (!videoRef.current || !faceDetectionEnabled || !isWebcamActive) {
      // Schedule next detection check
      faceDetectionIntervalRef.current = setTimeout(faceDetectionLoop, 33);
      return;
    }

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      try {
        // Detect faces with landmarks
        const detections = await detectFaces();

        // Update both state and ref with new detections
        // Ref ensures render loop always has latest data without re-rendering
        const newDetections = detections || [];
        faceDetectionsRef.current = newDetections;
        setFaceDetections(newDetections);
      } catch (err) {
        console.error('Face detection error:', err);
      }
    }

    // Schedule next detection (30fps = 33ms interval for smoother tracking)
    // Only if still running
    if (faceDetectionRunningRef.current) {
      faceDetectionIntervalRef.current = setTimeout(faceDetectionLoop, 33);
    }
  };

  /**
   * Video Rendering Loop (60fps)
   *
   * Runs at maximum speed for smooth video display.
   * No longer performs async face detection - just draws from stored state.
   * Educational Note: This demonstrates the importance of separating heavy
   * computational tasks from rendering for optimal performance.
   */
  const renderFrame = () => {
    // Check if rendering should continue
    if (!renderingActiveRef.current) {
      return;
    }

    if (videoRef.current && canvasRef.current && isWebcamActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

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

        // Draw all face analysis features from ref (always has latest data)
        // Face detection runs in separate loop at 30fps
        const currentDetections = faceDetectionsRef.current;
        if (faceDetectionEnabled && currentDetections.length > 0) {
          // Draw bounding boxes with confidence
          drawBoundingBoxes(ctx, currentDetections);

          // Draw facial landmarks (color-coded groups for education)
          drawLandmarks(ctx, currentDetections);

          // Draw expression recognition results
          drawExpressions(ctx, currentDetections);

          // Draw face matching similarity
          drawFaceMatching(ctx, currentDetections);
        }

        // Restore context once at the end
        ctx.restore();
      }

      // Only schedule next frame if still active
      if (renderingActiveRef.current) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    }
  };

  // Load face-api models on mount
  useEffect(() => {
    loadFaceApiModels();
    // Load API key from environment variable
    // Educational Note: GEMINI_API_KEY is loaded from .env file for secure API key management
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    if (apiKey) {
      setGeminiKey(apiKey);
      console.log('✅ Gemini API key loaded successfully from .env');
    } else {
      console.warn('⚠️ REACT_APP_GEMINI_API_KEY not found in .env file. AI features will be disabled.');
      console.log('📚 Tutorial: Add your Gemini API key to .env file (see .env.example)');
    }
  }, []);

  // Effect to control video rendering loop
  useEffect(() => {
    // Stop any existing render loop first
    renderingActiveRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (isWebcamActive) {
      // Start render loop with fresh closure
      renderingActiveRef.current = true;
      renderFrame();
    }

    return () => {
      // Cleanup: stop render loop
      renderingActiveRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebcamActive, selectedFilter, beautyMode, filterIntensity, landmarkColorMode, showBoundingBox, showExpressions, referenceDescriptor]);

  // Effect to control face detection loop (separate from rendering)
  useEffect(() => {
    // Stop any existing loop first
    faceDetectionRunningRef.current = false;
    if (faceDetectionIntervalRef.current) {
      clearTimeout(faceDetectionIntervalRef.current);
      faceDetectionIntervalRef.current = null;
    }

    if (isWebcamActive && faceDetectionEnabled) {
      // Start face detection loop with fresh closure
      faceDetectionRunningRef.current = true;
      faceDetectionLoop();
    } else {
      // Clear detections when disabled
      setFaceDetections([]);
    }

    return () => {
      // Cleanup: stop face detection loop
      faceDetectionRunningRef.current = false;
      if (faceDetectionIntervalRef.current) {
        clearTimeout(faceDetectionIntervalRef.current);
        faceDetectionIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebcamActive, faceDetectionEnabled, showBoundingBox, showExpressions, landmarkColorMode, referenceDescriptor]);

  // Netflix-style seamless infinite scroll
  const scrollTrackRef = useRef(null);
  const isResettingRef = useRef(false);

  useEffect(() => {
    const scrollTrack = scrollTrackRef.current;
    if (!scrollTrack || !isWebcamActive) return;

    // Initialize scroll to middle of duplicated content for seamless loop
    const initScroll = () => {
      if (scrollTrack.scrollLeft === 0) {
        const scrollWidth = scrollTrack.scrollWidth;
        const clientWidth = scrollTrack.clientWidth;
        const middlePosition = (scrollWidth - clientWidth) / 2;
        scrollTrack.scrollLeft = middlePosition;
      }
    };

    // Wait for content to render before initializing
    setTimeout(initScroll, 100);

    const handleScroll = () => {
      // Don't interfere during programmatic resets
      if (isResettingRef.current) return;

      const scrollLeft = scrollTrack.scrollLeft;
      const scrollWidth = scrollTrack.scrollWidth;
      const clientWidth = scrollTrack.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      const singleCopyWidth = maxScroll / 2;

      // Netflix-style: Check boundaries and seamlessly loop
      // Using requestAnimationFrame for smoother transition
      if (scrollLeft <= 5) {
        // Hit left boundary - jump to end of first copy
        isResettingRef.current = true;
        requestAnimationFrame(() => {
          scrollTrack.scrollLeft = singleCopyWidth;
          requestAnimationFrame(() => {
            isResettingRef.current = false;
          });
        });
      } else if (scrollLeft >= maxScroll - 5) {
        // Hit right boundary - jump to start of second copy
        isResettingRef.current = true;
        requestAnimationFrame(() => {
          scrollTrack.scrollLeft = singleCopyWidth;
          requestAnimationFrame(() => {
            isResettingRef.current = false;
          });
        });
      }
    };

    scrollTrack.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollTrack.removeEventListener('scroll', handleScroll);
    };
  }, [isWebcamActive]);

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

  return (
    <div className="App">
      {/* App Section */}
      <section className="app-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🎨 Interactive Demo</span>
            <h2 className="section-title">Try the App or Learn to Build It</h2>
            <p className="section-subtitle">
              Start your webcam and explore 20+ real-time filters, AI recommendations, and face detection.
              <br />
              This is what you'll build through the 8 learning levels!
            </p>
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

              {/* Filters below camera - Netflix-style Infinite Scroll */}
              {isWebcamActive && (
                <div className="filters-container">
                  <div className="filters-scroll-track" ref={scrollTrackRef}>
                    <div className="filters-scroll-wrapper">
                      {/* First copy of filters */}
                      <div className="filters-scroll-content">
                        {filters.map((filter) => (
                          <button
                            key={`${filter.id}-first`}
                            className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedFilter(selectedFilter === filter.id ? 'none' : filter.id);
                            }}
                          >
                            <span className="filter-icon">{filter.icon}</span>
                            <span className="filter-name">{filter.name}</span>
                          </button>
                        ))}
                      </div>
                      {/* Second copy for seamless infinite scroll */}
                      <div className="filters-scroll-content" aria-hidden="true">
                        {filters.map((filter) => (
                          <button
                            key={`${filter.id}-second`}
                            className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedFilter(selectedFilter === filter.id ? 'none' : filter.id);
                            }}
                          >
                            <span className="filter-icon">{filter.icon}</span>
                            <span className="filter-name">{filter.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Controls */}
            {isWebcamActive && (
              <div className="controls-sidebar">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button
                    className={`tab-button ${activeTab === 'filters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('filters')}
                  >
                    ✨ Effects
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'face' ? 'active' : ''}`}
                    onClick={() => setActiveTab('face')}
                  >
                    🤖 Face
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'ai' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ai')}
                  >
                    🧠 AI
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'stickers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stickers')}
                  >
                    😊 Stickers
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Effects Tab */}
                  {activeTab === 'filters' && (
                    <div className="tab-panel">
                      <h3 className="panel-title">Filter Effects</h3>

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

                      <div className="feature-info">
                        <p className="feature-description">
                          💡 Choose a filter from the horizontal scroll below the camera
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Face Analysis Tab */}
                  {activeTab === 'face' && (
                    <div className="tab-panel">
                      <h3 className="panel-title">AI-Powered Face Detection</h3>

                      <div className="control-group">
                        <label className="control-label">
                          <input
                            type="checkbox"
                            checked={faceDetectionEnabled}
                            onChange={(e) => setFaceDetectionEnabled(e.target.checked)}
                            className="toggle-checkbox"
                          />
                          <span className="toggle-label">Enable Face Detection {faceDetectionEnabled ? '✓' : ''}</span>
                        </label>
                      </div>

                      {faceDetectionEnabled && (
                        <>
                          <div className="control-group">
                            <label className="control-label">
                              <input
                                type="checkbox"
                                checked={showBoundingBox}
                                onChange={(e) => setShowBoundingBox(e.target.checked)}
                                className="toggle-checkbox"
                              />
                              <span className="toggle-label">📦 Bounding Box & Confidence</span>
                            </label>
                          </div>

                          <div className="control-group">
                            <label className="control-label">
                              <input
                                type="checkbox"
                                checked={showExpressions}
                                onChange={(e) => setShowExpressions(e.target.checked)}
                                className="toggle-checkbox"
                              />
                              <span className="toggle-label">😊 Expression Recognition</span>
                            </label>
                          </div>

                          <div className="control-group">
                            <label className="control-label">
                              <span className="slider-label">👁️ Landmarks:</span>
                              <select
                                value={landmarkColorMode}
                                onChange={(e) => setLandmarkColorMode(e.target.value)}
                                className="landmarks-select"
                              >
                                <option value="none">Hide Landmarks</option>
                                <option value="all">Show All (Green)</option>
                                <option value="groups">Color Groups (Educational)</option>
                              </select>
                            </label>
                          </div>

                          <div className="control-group face-recognition-section">
                            <label className="section-label">🎯 Face Recognition</label>
                            {!referenceDescriptor ? (
                              <button
                                className="ai-button"
                                onClick={captureReferenceFace}
                              >
                                📸 Capture Reference Face
                              </button>
                            ) : (
                              <div>
                                <p className="success-message">
                                  ✓ Reference captured! Matching enabled.
                                </p>
                                <button
                                  className="ai-button danger"
                                  onClick={clearReferenceFace}
                                >
                                  ✕ Clear Reference
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* AI Features Tab */}
                  {activeTab === 'ai' && (
                    <div className="tab-panel">
                      <h3 className="panel-title">AI-Powered Features</h3>

                      {/* AI Filter Recommendation */}
                      <div className="ai-feature-section">
                        <label className="section-label">✨ Filter Suggestion</label>
                        <button
                          className="ai-button"
                          onClick={getAIRecommendation}
                          disabled={isAiProcessing || !geminiKey}
                        >
                          {isAiProcessing ? '🤔 Thinking...' : 'Get Filter Suggestion'}
                        </button>
                        {!geminiKey && (
                          <p className="inline-error">⚠️ Add your API key</p>
                        )}
                        {aiError && (
                          <p className="inline-error">❌ {aiError}</p>
                        )}
                        {aiRecommendation && (
                          <div className="ai-recommendation">
                            <p><strong>AI:</strong> {aiRecommendation}</p>
                          </div>
                        )}
                      </div>

                      {/* AI Skin Analysis */}
                      <div className="ai-feature-section">
                        <label className="section-label">🔬 Skin Analysis</label>
                        <p className="feature-description">
                          Get personalized filter recommendations based on your appearance
                        </p>
                        <button
                          className="ai-button"
                          onClick={analyzeWithGeminiVision}
                          disabled={isAnalyzing || !geminiKey}
                        >
                          {isAnalyzing ? '🔍 Analyzing...' : '📸 Analyze My Appearance'}
                        </button>
                        {!geminiKey && (
                          <p className="inline-error">⚠️ Add your API key</p>
                        )}
                        {skinAnalysisError && (
                          <p className="inline-error">❌ {skinAnalysisError}</p>
                        )}
                        {skinAnalysisResult && (
                          <div className="ai-recommendation">
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                              {skinAnalysisResult}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stickers Tab */}
                  {activeTab === 'stickers' && (
                    <div className="tab-panel">
                      <h3 className="panel-title">Add Stickers</h3>
                      <p className="feature-description">
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
                  )}
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
    </div>
  );
}

export default DemoPage;
