/**
 * Beautify Me - Main Application Component
 * 
 * This is the main React component that contains all the webcam filter functionality.
 * It demonstrates several key React and Web API concepts:
 * - React Hooks (useState, useRef, useEffect)
 * - WebRTC API for camera access
 * - Canvas API for video manipulation
 * - Real-time rendering with requestAnimationFrame
 * 
 * Educational Notes for Beginners:
 * - Components are the building blocks of React applications
 * - This uses a functional component with hooks (modern React)
 * - State (useState) manages data that changes over time
 * - Refs (useRef) hold references to DOM elements and persist across renders
 * - Effects (useEffect) handle side effects like starting/stopping animations
 */

import React, { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  // ===== REACT REFS =====
  // Refs allow us to directly access DOM elements and store mutable values
  // that persist between renders without causing re-renders
  
  /** Reference to the HTML video element that displays the webcam stream */
  const videoRef = useRef(null);
  
  /** Reference to the HTML canvas element where we draw filtered video */
  const canvasRef = useRef(null);
  
  /** Reference to store the MediaStream object from getUserMedia */
  const streamRef = useRef(null);
  
  /** Reference to the app section for smooth scrolling */
  const appSectionRef = useRef(null);
  
  /** Reference to the animation frame ID for rendering loop */
  const animationFrameRef = useRef(null);

  // ===== REACT STATE =====
  // State variables that trigger re-renders when changed
  // Syntax: const [value, setValue] = useState(initialValue)
  
  /** Tracks whether the webcam is currently active */
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  
  /** Stores error messages to display to the user */
  const [error, setError] = useState(null);
  
  /** Currently selected filter ID (e.g., 'grayscale', 'sepia') */
  const [selectedFilter, setSelectedFilter] = useState('none');
  
  /** Data URL of the captured photo (base64 encoded image) */
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  /** Controls the camera flash animation when capturing photos */
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  
  /** Filter intensity value from 0-100 (percentage) */
  const [filterIntensity, setFilterIntensity] = useState(100);
  
  /** Toggles beauty mode (skin smoothing) on/off */
  const [beautyMode, setBeautyMode] = useState(false);

  // ===== FILTER DEFINITIONS =====
  // Array of all available filters with their metadata
  // Each filter has: id (unique identifier), name (display name), icon (emoji)
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

  /**
   * Applies CSS filters to the canvas context
   * 
   * This function builds a CSS filter string based on the selected filter type
   * and applies it to the canvas 2D context. Filters are applied before drawing
   * each video frame.
   * 
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   * @param {string} filterType - The ID of the filter to apply
   * 
   * Learn more about CSS filters:
   * https://developer.mozilla.org/en-US/docs/Web/CSS/filter
   */
  const applyFilter = (ctx, filterType) => {
    // Convert intensity from 0-100 to 0-1 for calculations
    const intensity = filterIntensity / 100;
    let filterString = '';

    // Build filter string based on selected type
    // Each case uses CSS filter functions with calculated values
    switch (filterType) {
      case 'grayscale':
        // Converts image to grayscale (black and white)
        filterString = `grayscale(${100 * intensity}%)`;
        break;
      case 'sepia':
        // Gives the image a warm, brownish tone (vintage photography effect)
        filterString = `sepia(${100 * intensity}%)`;
        break;
      case 'invert':
        // Inverts all colors (like a photo negative)
        filterString = `invert(${100 * intensity}%)`;
        break;
      case 'brightness':
        // Increases brightness. 1 = normal, >1 = brighter
        const brightVal = 1 + (0.3 * intensity);
        filterString = `brightness(${brightVal})`;
        break;
      case 'contrast':
        // Increases contrast between light and dark areas
        const contrastVal = 1 + (0.5 * intensity);
        filterString = `contrast(${contrastVal})`;
        break;
      case 'saturate':
        // Boosts color saturation (makes colors more vibrant)
        const saturateVal = 1 + (1 * intensity);
        filterString = `saturate(${saturateVal})`;
        break;
      case 'blur':
        // Applies gaussian blur effect
        const blurVal = 3 * intensity;
        filterString = `blur(${blurVal}px)`;
        break;
      case 'vintage':
        // Combines multiple filters for a vintage camera look
        filterString = `sepia(${50 * intensity}%) contrast(${1 + 0.2 * intensity}) brightness(${1 - 0.1 * intensity})`;
        break;
      case 'cool':
        // Shifts colors towards blue/cyan tones
        filterString = `hue-rotate(${180 * intensity}deg) saturate(${1 + 0.3 * intensity})`;
        break;
      case 'warm':
        // Adds warm orange/yellow tones
        filterString = `sepia(${30 * intensity}%) saturate(${1 + 0.4 * intensity}) brightness(${1 + 0.1 * intensity})`;
        break;
      case 'dramatic':
        // High contrast, dark shadows, intense colors
        filterString = `contrast(${1 + 0.5 * intensity}) brightness(${1 - 0.1 * intensity}) saturate(${1 + 0.3 * intensity})`;
        break;
      case 'moonlight':
        // Cool, desaturated look with blue tones
        filterString = `brightness(${1 - 0.2 * intensity}) contrast(${1 + 0.2 * intensity}) saturate(${1 - 0.3 * intensity}) hue-rotate(${200 * intensity}deg)`;
        break;
      case 'sunset':
        // Warm, golden-hour photography look
        filterString = `sepia(${40 * intensity}%) saturate(${1 + 0.5 * intensity}) brightness(${1 + 0.1 * intensity}) hue-rotate(${-10 * intensity}deg)`;
        break;
      case 'ocean':
        // Aqua/teal color shift
        filterString = `hue-rotate(${180 * intensity}deg) saturate(${1 + 0.4 * intensity}) brightness(${1 + 0.1 * intensity})`;
        break;
      case 'rose':
        // Pink/magenta color tones
        filterString = `hue-rotate(${320 * intensity}deg) saturate(${1 + 0.3 * intensity}) brightness(${1 + 0.05 * intensity})`;
        break;
      case 'noir':
        // Film noir style: high contrast black and white
        filterString = `grayscale(${100 * intensity}%) contrast(${1 + 0.8 * intensity}) brightness(${1 - 0.1 * intensity})`;
        break;
      case 'cyberpunk':
        // Neon purple/pink cyberpunk aesthetic
        filterString = `hue-rotate(${270 * intensity}deg) saturate(${1 + 1 * intensity}) contrast(${1 + 0.3 * intensity})`;
        break;
      case 'pastel':
        // Soft, muted pastel colors
        filterString = `saturate(${1 - 0.4 * intensity}) brightness(${1 + 0.2 * intensity}) contrast(${1 - 0.1 * intensity})`;
        break;
      case 'neon':
        // Ultra-saturated, bright neon colors
        filterString = `saturate(${1 + 1.5 * intensity}) contrast(${1 + 0.4 * intensity}) brightness(${1 + 0.2 * intensity})`;
        break;
      default:
        // No filter applied
        filterString = 'none';
    }

    // Apply beauty mode if enabled (adds subtle blur and brightness for smoother skin)
    if (beautyMode) {
      if (filterString === 'none') {
        filterString = 'blur(0.5px) brightness(1.05)';
      } else {
        // Append beauty mode to existing filter
        filterString += ' blur(0.5px) brightness(1.05)';
      }
    }

    // Set the filter on the canvas context
    // This affects all subsequent drawing operations
    ctx.filter = filterString;
  };

  /**
   * Captures the current filtered video frame as a photo
   * 
   * Process:
   * 1. Shows a flash animation
   * 2. Converts the canvas content to a data URL (base64 PNG image)
   * 3. Stores the image data in state
   * 4. Hides the flash after 200ms
   * 
   * Learn more about toDataURL:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
   */
  const capturePhoto = () => {
    if (canvasRef.current) {
      // Show the white flash effect
      setShowCaptureFlash(true);

      // Convert canvas to base64-encoded PNG image
      // toDataURL returns: "data:image/png;base64,iVBORw0KG..."
      const imageData = canvasRef.current.toDataURL('image/png');
      setCapturedPhoto(imageData);

      // Remove flash animation after 200ms
      setTimeout(() => setShowCaptureFlash(false), 200);
    }
  };

  /**
   * Downloads the captured photo to the user's computer
   * 
   * Creates a temporary <a> element with a download attribute,
   * sets the href to the image data URL, and programmatically clicks it.
   */
  const downloadPhoto = () => {
    if (capturedPhoto) {
      // Create a temporary link element
      const link = document.createElement('a');
      
      // Set filename with timestamp for uniqueness
      link.download = `beautify-me-${Date.now()}.png`;
      
      // Set the image data as the link target
      link.href = capturedPhoto;
      
      // Trigger the download
      link.click();
    }
  };

  /**
   * Closes the photo preview modal
   */
  const closeCapturedPhoto = () => {
    setCapturedPhoto(null);
  };

  /**
   * Main rendering loop that draws video frames to canvas with filters
   * 
   * This function is called repeatedly using requestAnimationFrame for smooth
   * 60 FPS rendering. It's the heart of the real-time filter application.
   * 
   * Process for each frame:
   * 1. Check if video has enough data
   * 2. Resize canvas to match video dimensions
   * 3. Clear previous frame
   * 4. Apply transformations (mirror effect)
   * 5. Apply selected filter
   * 6. Draw video frame to canvas
   * 7. Schedule next frame
   * 
   * Learn more about requestAnimationFrame:
   * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
   */
  const renderFrame = () => {
    // Only render if we have valid refs and webcam is active
    if (videoRef.current && canvasRef.current && isWebcamActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // HAVE_ENOUGH_DATA means video has loaded enough to start playing
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Resize canvas to match video dimensions (only when needed)
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        // Clear the previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save the current canvas state before transformations
        ctx.save();
        
        // Mirror the video horizontally for a more natural "selfie" view
        // scale(-1, 1) flips horizontally, then we translate to reposition
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        // Apply the selected filter to the canvas context
        applyFilter(ctx, selectedFilter);
        
        // Draw the current video frame onto the canvas
        // The filter is automatically applied because we set ctx.filter
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Restore the canvas to its previous state (removes transformations)
        ctx.restore();
      }

      // Schedule the next frame to be rendered
      // This creates a smooth 60 FPS animation loop
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };

  /**
   * useEffect hook for managing the rendering loop
   * 
   * - Starts rendering when webcam becomes active
   * - Re-starts when filter settings change
   * - Cleanup function cancels animation frame when component unmounts
   * 
   * Dependencies: isWebcamActive, selectedFilter, beautyMode, filterIntensity
   * When any of these change, the effect re-runs to restart rendering with new settings
   * 
   * Learn more about useEffect:
   * https://react.dev/reference/react/useEffect
   */
  useEffect(() => {
    if (isWebcamActive) {
      renderFrame();
    }

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      if (animationFrameRef.current) {
        // Cancel pending animation frame to prevent memory leaks
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebcamActive, selectedFilter, beautyMode, filterIntensity]);

  /**
   * Starts the webcam and begins video streaming
   * 
   * This async function:
   * 1. Requests camera access using getUserMedia API
   * 2. Attaches the stream to the video element
   * 3. Waits for video metadata to load
   * 4. Starts video playback
   * 5. Updates state to trigger rendering
   * 
   * Error handling catches and displays permission denials or other camera issues
   * 
   * Learn more about getUserMedia:
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
   */
  const startWebcam = async () => {
    try {
      // Clear any previous errors
      setError(null);
      
      // Request camera access from the browser
      // This will prompt the user for permission on first use
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }, // Request HD resolution
        audio: false // We don't need audio
      });

      // Store the stream in a ref so we can stop it later
      streamRef.current = stream;

      if (videoRef.current) {
        // Attach the media stream to the video element
        videoRef.current.srcObject = stream;

        // Wait for video metadata to load before playing
        // This ensures video dimensions are available
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            resolve();
          };
        });

        // Update state to start the rendering loop
        setIsWebcamActive(true);
      }
    } catch (err) {
      // Handle errors (permission denied, no camera, etc.)
      console.error('Error accessing webcam:', err);
      setError('Unable to access webcam. Please ensure you have granted camera permissions.');
      setIsWebcamActive(false);
    }
  };

  /**
   * Stops the webcam and cleans up all resources
   * 
   * This function properly releases the camera by:
   * 1. Canceling the animation frame loop
   * 2. Stopping all media tracks (releases camera hardware)
   * 3. Removing the stream from the video element
   * 4. Resetting state
   * 
   * Important: Always stop tracks when done to free up the camera!
   */
  const stopWebcam = () => {
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      // Get all tracks (video and audio, though we only have video)
      const tracks = streamRef.current.getTracks();
      
      // Stop each track to release the camera
      // This turns off the camera light and frees the hardware
      tracks.forEach(track => track.stop());
      
      // Remove the stream from the video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      // Clear the stream reference
      streamRef.current = null;
      
      // Update state
      setIsWebcamActive(false);
      setSelectedFilter('none');
    }
  };

  /**
   * Smoothly scrolls to the app section
   * 
   * Uses the Scroll API with smooth behavior for a nice user experience
   */
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

          <div className="video-wrapper">
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

            {isWebcamActive && (
              <>
                <div className="advanced-controls">
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
              </>
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
