# Level 8: Face Detection 🎭

**Duration:** 3-4 hours
**Difficulty:** 🔴 Advanced
**Prerequisites:** Level 1-7 completed

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Use TensorFlow.js for machine learning in the browser
- ✅ Implement real-time face detection
- ✅ Detect facial landmarks (68 points)
- ✅ Recognize facial expressions
- ✅ Overlay data on detected faces
- ✅ Optimize ML model performance
- ✅ Understand neural networks basics

## 🎓 What You'll Build

In this level, you'll add **advanced face detection features**:

- Real-time face detection with bounding boxes
- 68-point facial landmark detection
- Expression recognition (happy, sad, angry, etc.)
- Age and gender estimation
- Face tracking across frames
- Performance-optimized ML pipeline

## 🏗️ Concepts Covered

### 1. Machine Learning in the Browser

**TensorFlow.js** brings ML to JavaScript:

```javascript
// Traditional approach: Send image to server for ML
// ❌ Slow, requires internet, privacy concerns

// TensorFlow.js approach: Run ML in browser
// ✅ Fast, works offline, private
import * as faceapi from 'face-api.js';
```

**Benefits:**
- **Privacy**: Data never leaves the device
- **Speed**: No network latency
- **Offline**: Works without internet
- **Cost**: No server processing costs

### 2. Face-API.js

**Face-API.js** is built on TensorFlow.js for face detection:

#### Installation

```bash
npm install face-api.js
```

#### Import

```javascript
import * as faceapi from 'face-api.js';
```

#### Loading Models

```javascript
// Models are neural networks trained to detect faces
const MODEL_URL = '/models'; // Folder with model files

await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
```

**Available Models:**

| Model | Purpose | Speed | Accuracy |
|-------|---------|-------|----------|
| `tinyFaceDetector` | Face detection | Fast | Good |
| `ssdMobilenetv1` | Face detection | Medium | Better |
| `faceLandmark68Net` | 68 facial points | Fast | Excellent |
| `faceExpressionNet` | Emotions | Fast | Good |
| `ageGenderNet` | Age/gender | Medium | Moderate |
| `faceRecognitionNet` | Face matching | Slow | Excellent |

### 3. Face Detection

Detect faces in images or video:

```javascript
const detectFaces = async (input) => {
  // input can be: <img>, <video>, <canvas>

  // Simple detection (just bounding boxes)
  const detections = await faceapi.detectAllFaces(
    input,
    new faceapi.TinyFaceDetectorOptions()
  );

  return detections;
};

// Detection result structure:
{
  box: {
    x: 100,        // Left position
    y: 50,         // Top position
    width: 200,    // Box width
    height: 250    // Box height
  },
  score: 0.94      // Confidence (0-1)
}
```

#### Detection Options

```javascript
// Tiny Face Detector (fastest)
new faceapi.TinyFaceDetectorOptions({
  inputSize: 416,  // 128, 160, 224, 320, 416, 512, 608
  scoreThreshold: 0.5  // Min confidence (0-1)
});

// SSD MobileNet (more accurate)
new faceapi.SsdMobilenetv1Options({
  minConfidence: 0.5
});
```

### 4. Facial Landmarks

Detect 68 points on the face:

```javascript
const detectFacesWithLandmarks = async (input) => {
  const detections = await faceapi
    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();

  return detections;
};

// Landmark groups:
// - jawOutline: 0-16
// - leftEyebrow: 17-21
// - rightEyebrow: 22-26
// - noseBridge: 27-30
// - noseTip: 31-35
// - leftEye: 36-41
// - rightEye: 42-47
// - outerMouth: 48-59
// - innerMouth: 60-67
```

**Landmark Uses:**
- Face filters (Snapchat-style)
- Glasses/mask overlays
- Face mesh rendering
- Expression analysis

### 5. Expression Recognition

Detect emotions:

```javascript
const detectExpressionsAsync = async (input) => {
  const detections = await faceapi
    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  return detections;
};

// Expression result:
{
  neutral: 0.05,
  happy: 0.92,      // Dominant (highest)
  sad: 0.01,
  angry: 0.01,
  fearful: 0.00,
  disgusted: 0.00,
  surprised: 0.01
}
```

**Finding Dominant Expression:**
```javascript
const getDominantExpression = (expressions) => {
  return Object.keys(expressions).reduce((a, b) =>
    expressions[a] > expressions[b] ? a : b
  );
};

const dominant = getDominantExpression(detection.expressions);
// Result: "happy"
```

### 6. Age and Gender Prediction

```javascript
const detectAllFeatures = async (input) => {
  const detections = await faceapi
    .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();

  return detections;
};

// Result adds:
{
  age: 28.5,
  gender: 'female',
  genderProbability: 0.93
}
```

### 7. Drawing Detections

Visualize detections on canvas:

```javascript
const drawDetections = (canvas, detections) => {
  // Create canvas context
  const displaySize = {
    width: canvas.width,
    height: canvas.height
  };

  // Match detection coordinates to canvas size
  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  // Clear previous drawings
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw boxes
  faceapi.draw.drawDetections(canvas, resizedDetections);

  // Draw landmarks
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

  // Draw expressions
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
};
```

### 8. Custom Drawing

Draw your own overlays:

```javascript
const drawCustomOverlay = (ctx, detection) => {
  const { box, landmarks, expressions } = detection;

  // Draw bounding box
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x, box.y, box.width, box.height);

  // Draw confidence score
  ctx.fillStyle = '#00ff00';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(
    `${Math.round(detection.detection.score * 100)}%`,
    box.x,
    box.y - 10
  );

  // Draw dominant emotion
  const dominant = getDominantExpression(expressions);
  const emoji = emotionEmojis[dominant] || '😐';

  ctx.font = '48px Arial';
  ctx.fillText(emoji, box.x + box.width / 2 - 24, box.y - 60);
};
```

### 9. Performance Optimization

ML is computationally expensive:

#### Separate Detection from Rendering

```javascript
// ❌ Slow - runs detection every frame
const renderLoop = async () => {
  const detections = await faceapi.detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceExpressions();

  drawDetections(canvas, detections);

  requestAnimationFrame(renderLoop);
};

// ✅ Fast - separate loops
let latestDetections = [];

// Detection loop (slower, ~10 FPS)
const detectionLoop = async () => {
  latestDetections = await faceapi.detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceExpressions();

  setTimeout(detectionLoop, 100); // Run every 100ms
};

// Render loop (fast, ~60 FPS)
const renderLoop = () => {
  // Draw video
  ctx.drawImage(video, 0, 0);

  // Draw latest detections
  if (latestDetections.length > 0) {
    drawDetections(canvas, latestDetections);
  }

  requestAnimationFrame(renderLoop);
};

// Start both loops
detectionLoop();
renderLoop();
```

#### Use Smaller Input Size

```javascript
// ❌ Slow - process full resolution
new faceapi.TinyFaceDetectorOptions({ inputSize: 608 });

// ✅ Fast - smaller size, still accurate
new faceapi.TinyFaceDetectorOptions({ inputSize: 416 });
```

#### Skip Unnecessary Features

```javascript
// Only detect what you need
// ❌ All features (slow)
await faceapi.detectAllFaces(video)
  .withFaceLandmarks()
  .withFaceExpressions()
  .withAgeAndGender();

// ✅ Just detection and expressions (faster)
await faceapi.detectAllFaces(video)
  .withFaceExpressions();
```

## 💻 Implementation Guide

### Step 1: Installing and Loading Models

```bash
# Install face-api.js
npm install face-api.js
```

Download models to `public/models/` folder:
- https://github.com/justadudewhohacks/face-api.js/tree/master/weights

```javascript
import * as faceapi from 'face-api.js';

useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    console.log('✅ Face detection models loaded');
    setModelsLoaded(true);
  };

  loadModels();
}, []);
```

**Your Task:**
1. Install face-api.js
2. Download model files
3. Load models on component mount
4. Add loading state

### Step 2: Implementing Face Detection

```javascript
const [detections, setDetections] = useState([]);
const [isFaceDetectionOn, setIsFaceDetectionOn] = useState(false);

useEffect(() => {
  if (!isFaceDetectionOn || !modelsLoaded) return;

  let isRunning = true;

  const detectFaces = async () => {
    if (!isRunning) return;

    const video = videoRef.current;

    if (video && video.readyState === 4) {
      // Detect faces
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      setDetections(detections);
    }

    // Run again after delay
    setTimeout(detectFaces, 100);
  };

  detectFaces();

  return () => {
    isRunning = false;
  };
}, [isFaceDetectionOn, modelsLoaded]);
```

**Your Task:**
1. Find the face detection logic
2. Understand the detection loop
3. Test with your face
4. Try different expressions

### Step 3: Drawing Detections

```javascript
const renderFrame = () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;
  const ctx = canvas.getContext('2d');

  // Draw video frame
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-canvas.width, 0);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Draw face detections
  if (isFaceDetectionOn && detections.length > 0) {
    detections.forEach(detection => {
      const { box, expressions } = detection;

      // Mirror box coordinates
      const mirroredBox = {
        x: canvas.width - box.x - box.width,
        y: box.y,
        width: box.width,
        height: box.height
      };

      // Draw bounding box
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        mirroredBox.x,
        mirroredBox.y,
        mirroredBox.width,
        mirroredBox.height
      );

      // Draw confidence
      const confidence = Math.round(detection.detection.score * 100);
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${confidence}%`, mirroredBox.x, mirroredBox.y - 10);

      // Draw expression
      const dominant = getDominantExpression(expressions);
      const emoji = emotionEmojis[dominant];

      ctx.font = '48px Arial';
      ctx.fillText(
        emoji,
        mirroredBox.x + mirroredBox.width / 2 - 24,
        mirroredBox.y - 60
      );
    });
  }

  requestAnimationFrame(renderFrame);
};
```

**Your Task:**
1. Find where detections are drawn
2. Understand mirroring adjustments
3. Customize colors and styles
4. Add your own overlays

### Step 4: Practice Tasks

#### Task 1: Add Face Count Display

```javascript
const [faceCount, setFaceCount] = useState(0);

useEffect(() => {
  setFaceCount(detections.length);
}, [detections]);

// UI
<div className="face-stats">
  <p>Faces Detected: {faceCount}</p>
</div>
```

#### Task 2: Add Expression Breakdown

```javascript
const ExpressionMeter = ({ expressions }) => {
  return (
    <div className="expression-meters">
      {Object.entries(expressions).map(([emotion, value]) => (
        <div key={emotion} className="expression-bar">
          <span className="emotion-label">{emotion}</span>
          <div className="bar-container">
            <div
              className="bar-fill"
              style={{ width: `${value * 100}%` }}
            />
          </div>
          <span className="emotion-value">
            {Math.round(value * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
};

// Show for first detected face
{detections[0] && (
  <ExpressionMeter expressions={detections[0].expressions} />
)}
```

#### Task 3: Add Face Tracking

```javascript
const [trackedFaces, setTrackedFaces] = useState(new Map());

const trackFaces = (detections) => {
  const newTracked = new Map();

  detections.forEach((detection, index) => {
    const { box } = detection.detection;
    const centroid = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    };

    // Find matching tracked face (within 50px)
    let faceId = null;
    for (const [id, data] of trackedFaces.entries()) {
      const dist = Math.sqrt(
        Math.pow(centroid.x - data.lastPos.x, 2) +
        Math.pow(centroid.y - data.lastPos.y, 2)
      );

      if (dist < 50) {
        faceId = id;
        break;
      }
    }

    // New face or update existing
    if (!faceId) {
      faceId = `face-${Date.now()}-${index}`;
    }

    newTracked.set(faceId, {
      detection,
      lastPos: centroid,
      firstSeen: trackedFaces.get(faceId)?.firstSeen || Date.now()
    });
  });

  setTrackedFaces(newTracked);
  return newTracked;
};
```

#### Task 4: Add Snapchat-Style Filter

```javascript
const drawGlasses = (ctx, landmarks) => {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Calculate glasses position and size
  const eyeDistance = Math.sqrt(
    Math.pow(rightEye[0].x - leftEye[0].x, 2) +
    Math.pow(rightEye[0].y - leftEye[0].y, 2)
  );

  const glassesWidth = eyeDistance * 1.5;
  const glassesHeight = eyeDistance * 0.5;

  const centerX = (leftEye[0].x + rightEye[0].x) / 2;
  const centerY = (leftEye[0].y + rightEye[0].y) / 2;

  // Draw cool glasses
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;

  // Left lens
  ctx.beginPath();
  ctx.arc(
    leftEye[0].x,
    leftEye[0].y,
    glassesWidth * 0.2,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  // Right lens
  ctx.beginPath();
  ctx.arc(
    rightEye[0].x,
    rightEye[0].y,
    glassesWidth * 0.2,
    0,
    Math.PI * 2
  );
  ctx.stroke();

  // Bridge
  ctx.beginPath();
  ctx.moveTo(leftEye[0].x + glassesWidth * 0.2, leftEye[0].y);
  ctx.lineTo(rightEye[0].x - glassesWidth * 0.2, rightEye[0].y);
  ctx.stroke();
};
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What's the difference between TinyFaceDetector and SSD MobileNet?**
   <details>
   <summary>Answer</summary>

   - **TinyFaceDetector**: Faster, lighter, good accuracy
     - Best for: Real-time video, mobile devices
     - Input sizes: 128-608px

   - **SSD MobileNet**: Slower, more accurate
     - Best for: Photos, high accuracy needed
     - Better at detecting small/distant faces
   </details>

2. **Why separate detection and rendering loops?**
   <details>
   <summary>Answer</summary>

   - **Detection**: Heavy ML computation (~10 FPS)
   - **Rendering**: Light drawing operation (~60 FPS)

   Separating allows:
   - Smooth video playback
   - Responsive UI
   - Better performance

   Without separation, video would stutter at 10 FPS.
   </details>

3. **What are facial landmarks used for?**
   <details>
   <summary>Answer</summary>

   68 points marking face features:
   - Eyes, eyebrows, nose, mouth, jaw
   - Used for:
     - Face filters (glasses, masks)
     - Expression analysis
     - Face mesh/3D mapping
     - Makeup/effects overlays
   </details>

4. **How does expression recognition work?**
   <details>
   <summary>Answer</summary>

   Neural network trained on thousands of labeled faces:
   1. Extracts facial features
   2. Compares to learned patterns
   3. Outputs probabilities for each emotion

   Returns object with confidence scores:
   ```javascript
   { happy: 0.92, sad: 0.01, neutral: 0.05, ... }
   ```
   </details>

### Challenges

**Challenge 1: Emotion-Based Auto-Capture**

```javascript
const [autoCapture, setAutoCapture] = useState(false);
const [targetEmotion, setTargetEmotion] = useState('happy');

useEffect(() => {
  if (!autoCapture || detections.length === 0) return;

  const detection = detections[0];
  const dominant = getDominantExpression(detection.expressions);

  if (dominant === targetEmotion && detection.expressions[dominant] > 0.8) {
    capturePhoto();
    setAutoCapture(false); // Capture once
  }
}, [detections, autoCapture, targetEmotion]);

// UI
<label>
  <input
    type="checkbox"
    checked={autoCapture}
    onChange={(e) => setAutoCapture(e.target.checked)}
  />
  Auto-capture when {targetEmotion}
</label>
```

**Challenge 2: Expression Chart**

```javascript
import { Line } from 'react-chartjs-2';

const [expressionHistory, setExpressionHistory] = useState([]);

useEffect(() => {
  if (detections.length > 0) {
    const detection = detections[0];
    const dominant = getDominantExpression(detection.expressions);

    setExpressionHistory(prev => [
      ...prev.slice(-100), // Keep last 100 points
      {
        timestamp: Date.now(),
        emotion: dominant,
        confidence: detection.expressions[dominant]
      }
    ]);
  }
}, [detections]);

// Chart component
<Line
  data={{
    labels: expressionHistory.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Happiness',
      data: expressionHistory.map(d => d.emotion === 'happy' ? d.confidence : 0)
    }]
  }}
/>
```

**Challenge 3: Multi-Face Comparison**

```javascript
const compareFaces = () => {
  if (detections.length < 2) {
    alert('Need at least 2 faces');
    return;
  }

  const face1 = detections[0];
  const face2 = detections[1];

  const comparison = {
    expressions: {
      face1: getDominantExpression(face1.expressions),
      face2: getDominantExpression(face2.expressions),
      same: getDominantExpression(face1.expressions) ===
            getDominantExpression(face2.expressions)
    },
    ages: {
      face1: Math.round(face1.age),
      face2: Math.round(face2.age),
      difference: Math.abs(Math.round(face1.age - face2.age))
    }
  };

  console.log('Face Comparison:', comparison);
  return comparison;
};
```

## 🔗 Additional Resources

### Official Documentation
- [Face-API.js Documentation](https://justadudewhohacks.github.io/face-api.js/docs/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Face-API.js GitHub](https://github.com/justadudewhohacks/face-api.js)

### Video Tutorials
- [Face Detection Tutorial](https://www.youtube.com/watch?v=CVClHLwv-4I)
- [TensorFlow.js Crash Course](https://www.youtube.com/watch?v=HEQDRWMK6yY)

### Interactive Learning
- [Face-API.js Examples](https://justadudewhohacks.github.io/face-api.js/face_and_landmark_detection)
- [TensorFlow.js Tutorials](https://www.tensorflow.org/js/tutorials)

### Articles
- [Understanding Face Detection](https://towardsdatascience.com/face-detection-in-2-minutes-using-opencv-python-90f89d7c0f81)
- [ML in the Browser](https://web.dev/ai/)

## 🎯 Key Takeaways

Congratulations on completing all 8 levels! You now understand:

✅ **TensorFlow.js** - Running ML models in the browser
✅ **Face Detection** - Finding faces in images/video
✅ **Facial Landmarks** - 68-point face mapping
✅ **Expression Recognition** - Detecting emotions
✅ **Performance Optimization** - Separating detection and rendering
✅ **Custom Overlays** - Drawing on detected faces
✅ **Real-time Processing** - Handling video streams with ML

## 🎊 Project Complete!

You've built a complete webcam filter application with:
- ⚛️ React UI
- 📹 WebRTC camera access
- 🎨 20+ filters
- 📸 Photo capture
- 🎭 Draggable stickers
- 🤖 AI recommendations
- 👁️ AI vision analysis
- 🎭 Face detection

```bash
git add .
git commit -m "Complete Level 8: Face Detection - Project Complete! 🎉"
git checkout main
git merge level-8-face-detection
```

## 🚀 Next Steps

Continue learning:
1. **Explore TensorFlow.js** - Build custom models
2. **Add more features** - Video recording, GIF export
3. **Optimize performance** - Web Workers, WASM
4. **Deploy** - Share your project (Netlify, Vercel)
5. **Contribute** - Add new filters, improve docs

---

**Congratulations!** 🎉 You've completed the entire LearnLens learning journey!

Check out the [main README](../README.md) for deployment and sharing options.

Happy coding! 🚀
