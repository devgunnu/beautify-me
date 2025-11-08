# Branch Modification Guide 🌿

This guide explains how to modify each level branch to create learning exercises with TODOs.

## 🎯 General Principles

For each level branch:
1. **Remove** features beyond that level's scope
2. **Add TODOs** for students to implement
3. **Keep boilerplate** code that sets up the environment
4. **Add comments** explaining what students should learn

## 📝 Level-by-Level Modifications

### Level 1: React Basics (level-1-basics)

**What to keep:**
- Basic App component structure
- Mode selector UI (Webcam, Photos, Stickers, AI)
- Filter buttons array (reference data)
- Basic state declarations

**What to remove/add TODOs:**
```javascript
// src/App.js modifications:

// TODO 1: Add state for active filter
// HINT: Use useState with 'normal' as default
// LEARNING: This teaches state management with useState hook
const [activeFilter, setActiveFilter] = useState('normal');

// TODO 2: Implement handleFilterChange function
// HINT: This function should update activeFilter state
// LEARNING: Event handlers and state updates
const handleFilterChange = (filterName) => {
  // Your code here
};

// TODO 3: Connect filter buttons to handleFilterChange
// HINT: Use onClick={} prop on buttons
// LEARNING: Event binding and passing arguments
{filters.map(filter => (
  <button
    key={filter.name}
    // TODO: Add onClick handler here
    className={`filter-button ${activeFilter === filter.name ? 'active' : ''}`}
  >
    {filter.label}
  </button>
))}
```

**Git commands:**
```bash
git checkout level-1-basics
# Make modifications to src/App.js
git add src/App.js
git commit -m "tutorial(level-1): Add React basics learning TODOs"
git push origin level-1-basics
```

---

### Level 2: Webcam & Canvas (level-2-webcam)

**What to keep:**
- Everything from Level 1
- Video and canvas refs declared
- Video and canvas JSX elements

**What to remove/add TODOs:**
```javascript
// TODO 1: Implement toggleCamera function
// HINT: Use navigator.mediaDevices.getUserMedia()
// LEARNING: Async/await, WebRTC API, error handling
const toggleCamera = async () => {
  if (isCameraOn) {
    // TODO: Stop camera
    // HINT: Stop all tracks in the stream
  } else {
    try {
      // TODO: Request camera access
      // HINT: const stream = await navigator.mediaDevices.getUserMedia({...})

      // TODO: Attach stream to video element

      // TODO: Start rendering loop

    } catch (error) {
      console.error('Camera error:', error);
      alert('Unable to access camera');
    }
  }
};

// TODO 2: Implement renderFrame function
// HINT: Use ctx.drawImage(video, 0, 0, width, height)
// LEARNING: Canvas API, requestAnimationFrame, render loops
const renderFrame = () => {
  if (!isCameraOn) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  // TODO: Draw video frame to canvas
  // HINT: Don't forget to mirror the image (ctx.scale(-1, 1))

  // TODO: Request next frame
  // HINT: requestAnimationFrame(renderFrame)
};

// TODO 3: Add cleanup in useEffect
// LEARNING: Cleanup functions prevent memory leaks
useEffect(() => {
  return () => {
    // TODO: Stop camera when component unmounts
  };
}, []);
```

---

### Level 3: Filters & Effects (level-3-filters)

**What to keep:**
- Everything from Levels 1-2
- Filters array with all filter definitions

**What to remove/add TODOs:**
```javascript
// TODO 1: Apply active filter to canvas
// HINT: canvas.style.filter = ...
// LEARNING: CSS filters, dynamic styling
const renderFrame = () => {
  // ... existing video drawing code ...

  // TODO: Apply the active filter to canvas
  // HINT: Find filter in filters array and apply its .filter property
  const currentFilter = filters.find(f => f.name === activeFilter);
  if (currentFilter) {
    // Your code here
  }

  requestAnimationFrame(renderFrame);
};

// TODO 2: Create a custom filter
// LEARNING: CSS filter composition, color theory
// Add your own filter to the filters array:
const filters = [
  // ... existing filters ...

  // TODO: Add your custom filter here
  // EXAMPLE: { name: 'my-filter', label: '✨ My Filter', filter: '...' }
];
```

---

### Level 4: Photo Capture (level-4-photos)

**What to keep:**
- Everything from Levels 1-3
- Photos state array
- Photo gallery UI structure

**What to remove/add TODOs:**
```javascript
// TODO 1: Implement capturePhoto function
// HINT: Use canvas.toDataURL()
// LEARNING: Canvas to image conversion, state management
const capturePhoto = () => {
  const canvas = canvasRef.current;

  // TODO: Convert canvas to data URL
  // HINT: const dataURL = canvas.toDataURL('image/png')

  // TODO: Create photo object with metadata
  const newPhoto = {
    id: Date.now(),
    // TODO: Add dataURL property
    // TODO: Add timestamp property
    // TODO: Add filter property
  };

  // TODO: Add to photos array
  // HINT: setPhotos(prev => [...prev, newPhoto])
};

// TODO 2: Implement downloadPhoto function
// HINT: Create <a> element with download attribute
// LEARNING: Programmatic file downloads
const downloadPhoto = (photo) => {
  // TODO: Create download link
  // TODO: Set filename and href
  // TODO: Trigger click
};

// TODO 3: Implement deletePhoto function
// LEARNING: Array filtering, immutable updates
const deletePhoto = (photoId) => {
  // TODO: Filter out photo with matching ID
  // HINT: setPhotos(prev => prev.filter(p => p.id !== photoId))
};
```

---

### Level 5: Stickers & Drag (level-5-stickers)

**What to keep:**
- Everything from Levels 1-4
- Stickers state array
- Available stickers array
- Sticker UI structure

**What to remove/add TODOs:**
```javascript
// TODO 1: Implement addSticker function
// LEARNING: State management, object creation
const addSticker = (emoji) => {
  const newSticker = {
    id: Date.now(),
    emoji: emoji,
    // TODO: Set initial position (center of canvas)
    // TODO: Set size (48px)
  };

  // TODO: Add to stickers array
};

// TODO 2: Draw stickers on canvas
// LEARNING: Canvas text rendering, loops
const renderFrame = () => {
  // ... existing video and filter code ...

  // TODO: Loop through stickers and draw each one
  // HINT: stickers.forEach(sticker => { ctx.fillText(sticker.emoji, x, y) })
};

// TODO 3: Implement drag-and-drop
// LEARNING: Mouse events, event handling, coordinate systems
const [draggingSticker, setDraggingSticker] = useState(null);
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

const handleCanvasMouseDown = (e) => {
  // TODO: Detect which sticker was clicked
  // TODO: Calculate drag offset
  // TODO: Set draggingSticker state
};

const handleCanvasMouseMove = (e) => {
  if (!draggingSticker) return;

  // TODO: Calculate new position
  // TODO: Update sticker position in state
};

const handleCanvasMouseUp = () => {
  // TODO: Clear dragging state
};

// TODO 4: Add event listeners to canvas
// HINT: <canvas onMouseDown={...} onMouseMove={...} onMouseUp={...} />
```

---

### Level 6: AI Integration (Text) (level-6-ai-text)

**What to keep:**
- Everything from Levels 1-5
- Gemini API key loading from .env
- AI recommendation UI structure

**What to remove/add TODOs:**
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

// TODO 1: Load API key from environment
// LEARNING: Environment variables, useEffect
useEffect(() => {
  // TODO: Get API key from process.env.GEMINI_API_KEY
  // TODO: Set geminiKey state if found
  // TODO: Log success/warning message
}, []);

// TODO 2: Implement getFilterRecommendation
// LEARNING: Async/await, API calls, error handling
const getFilterRecommendation = async () => {
  if (!geminiKey) {
    alert('Please add Gemini API key to .env file');
    return;
  }

  setIsLoadingRecommendation(true);

  try {
    // TODO: Initialize Gemini AI
    // HINT: const genAI = new GoogleGenerativeAI(geminiKey)

    // TODO: Get model
    // HINT: const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // TODO: Build prompt with time of day and available filters

    // TODO: Generate content
    // HINT: const result = await model.generateContent(prompt)

    // TODO: Parse response and apply recommended filter

  } catch (error) {
    console.error('AI Error:', error);
    setRecommendation('Unable to get recommendation');
  } finally {
    setIsLoadingRecommendation(false);
  }
};

// TODO 3: Create getTimeOfDay helper function
// LEARNING: Date API, conditional logic
const getTimeOfDay = () => {
  const hour = new Date().getHours();

  // TODO: Return 'morning', 'afternoon', 'evening', or 'night'
  // based on hour
};
```

---

### Level 7: AI Vision (level-7-ai-vision)

**What to keep:**
- Everything from Levels 1-6
- AI analysis UI structure

**What to remove/add TODOs:**
```javascript
// TODO 1: Implement analyzeSkin function
// LEARNING: Multimodal AI, base64 encoding, structured prompts
const analyzeSkin = async () => {
  if (!geminiKey) {
    alert('Please add Gemini API key');
    return;
  }

  setAnalysisState({
    isAnalyzing: true,
    progress: 'Capturing image...',
    result: null,
    error: null
  });

  try {
    // TODO: Get canvas and convert to data URL
    // HINT: canvas.toDataURL('image/jpeg', 0.7)

    // TODO: Extract base64 part
    // HINT: dataURL.split(',')[1]

    setAnalysisState(prev => ({ ...prev, progress: 'Sending to AI...' }));

    // TODO: Build structured prompt
    // HINT: Ask for skin type, tone, recommended filters, reasoning

    // TODO: Send image and prompt to Gemini
    // HINT: model.generateContent([prompt, { inlineData: {...} }])

    setAnalysisState(prev => ({ ...prev, progress: 'Analyzing...' }));

    // TODO: Parse response
    // HINT: Extract skin type, tone, filters, reasoning from text

    setAnalysisState({
      isAnalyzing: false,
      progress: '',
      result: parsedAnalysis,
      error: null
    });

  } catch (error) {
    console.error('Vision AI Error:', error);
    setAnalysisState({
      isAnalyzing: false,
      progress: '',
      result: null,
      error: error.message
    });
  }
};

// TODO 2: Implement parseAnalysis function
// LEARNING: String manipulation, parsing structured text
const parseAnalysis = (responseText) => {
  // TODO: Extract data from formatted response
  // HINT: Split by lines, look for "Skin Type:", "Tone:", etc.

  return {
    skinType: '',
    tone: '',
    recommendedFilters: [],
    reasoning: ''
  };
};
```

---

### Level 8: Face Detection (level-8-face-detection)

**What to keep:**
- Everything from Levels 1-7
- Face detection models folder reference
- Face detection UI structure

**What to remove/add TODOs:**
```javascript
import * as faceapi from 'face-api.js';

// TODO 1: Load face detection models
// LEARNING: TensorFlow.js, model loading, async initialization
useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';

    try {
      // TODO: Load TinyFaceDetector model
      // HINT: await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)

      // TODO: Load FaceLandmark68Net model

      // TODO: Load FaceExpressionNet model

      console.log('✅ Models loaded');
      setModelsLoaded(true);
    } catch (error) {
      console.error('Model loading error:', error);
    }
  };

  loadModels();
}, []);

// TODO 2: Implement face detection loop
// LEARNING: Separate detection from rendering, performance optimization
useEffect(() => {
  if (!isFaceDetectionOn || !modelsLoaded) return;

  let isRunning = true;

  const detectFaces = async () => {
    if (!isRunning) return;

    const video = videoRef.current;

    if (video && video.readyState === 4) {
      // TODO: Detect faces with landmarks and expressions
      // HINT: faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      //         .withFaceLandmarks()
      //         .withFaceExpressions()

      // TODO: Update detections state
    }

    // TODO: Schedule next detection
    // HINT: setTimeout(detectFaces, 100) for ~10 FPS
  };

  detectFaces();

  return () => {
    isRunning = false;
  };
}, [isFaceDetectionOn, modelsLoaded]);

// TODO 3: Draw face detections on canvas
// LEARNING: Canvas drawing, coordinate transformations, mirroring
const renderFrame = () => {
  // ... existing video rendering code ...

  if (isFaceDetectionOn && detections.length > 0) {
    detections.forEach(detection => {
      const { box, expressions } = detection;

      // TODO: Mirror box coordinates for selfie view
      // HINT: mirroredX = canvas.width - box.x - box.width

      // TODO: Draw bounding box
      // HINT: ctx.strokeRect(x, y, width, height)

      // TODO: Draw confidence percentage

      // TODO: Draw dominant emotion emoji
      // HINT: Get dominant with getDominantExpression(expressions)
    });
  }
};

// TODO 4: Implement getDominantExpression helper
// LEARNING: Object manipulation, reduce/max operations
const getDominantExpression = (expressions) => {
  // TODO: Find emotion with highest value
  // HINT: Object.keys(expressions).reduce((a, b) => ...)

  return 'neutral';
};

// TODO 5: Add emotion emojis mapping
const emotionEmojis = {
  neutral: '😐',
  happy: '😊',
  sad: '😢',
  // TODO: Add remaining emotions (angry, fearful, disgusted, surprised)
};
```

---

## 🔄 Workflow for Each Branch

1. **Checkout branch:**
   ```bash
   git checkout level-N-<topic>
   ```

2. **Make modifications:**
   - Edit `src/App.js`
   - Add TODOs as shown above
   - Remove completed implementations
   - Add educational comments

3. **Test the TODOs:**
   - Make sure the app still runs
   - Verify students have enough guidance
   - Check that boilerplate code is present

4. **Commit:**
   ```bash
   git add src/App.js
   git commit -m "tutorial(level-N): Add learning TODOs for <topic>"
   ```

5. **Push:**
   ```bash
   git push origin level-N-<topic>
   ```

6. **Move to next level**

## 📚 Solution Branches

Solution branches (`level-1-solution` through `level-8-solution`) should contain:
- **Complete working code** for that level
- **All features implemented**
- **Educational comments** explaining how things work
- **NO TODOs** - these are reference implementations

These are already created from main branch and contain complete code.

## ✅ Checklist

For each level branch, ensure:
- [ ] TODOs are clear and actionable
- [ ] Hints guide without giving away answers
- [ ] LEARNING comments explain educational value
- [ ] Boilerplate code is present
- [ ] App runs without errors (even with TODOs incomplete)
- [ ] Level README matches the branch code
- [ ] Comments reference the level README for more info

## 🎯 Testing Student Experience

After creating branches, test as a student would:
1. Checkout level-1-basics
2. Read docs/README-LEVEL-1.md
3. Try to complete TODOs
4. Check if guidance is sufficient
5. Adjust TODOs if needed

## 🚀 Quick Start Command

To create all branches at once:
```bash
./create-learning-branches.sh
```

Then modify each branch individually following this guide.

---

Happy teaching! 🎓
