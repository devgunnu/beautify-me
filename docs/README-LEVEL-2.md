# Level 2: Webcam & Canvas 📹

**Duration:** 2-3 hours
**Difficulty:** 🟢 Beginner
**Prerequisites:** Level 1 completed (React Basics)

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Access user's webcam using WebRTC API
- ✅ Understand browser media permissions and constraints
- ✅ Work with the HTML5 Canvas API
- ✅ Draw video frames to canvas in real-time
- ✅ Understand the rendering loop pattern
- ✅ Handle media streams and cleanup
- ✅ Mirror video output for better UX

## 🎓 What You'll Build

In this level, you'll add **webcam functionality** to the app:

- Request and access the user's webcam
- Display live video feed on a canvas
- Implement a rendering loop for real-time updates
- Add mirror effect for natural selfie view
- Handle camera start/stop with proper cleanup

## 🏗️ Concepts Covered

### 1. WebRTC and getUserMedia

**WebRTC** (Web Real-Time Communication) enables real-time audio/video communication in browsers. We use the `getUserMedia` API to access the webcam.

```javascript
// Request access to the user's camera
navigator.mediaDevices.getUserMedia({
  video: true,  // Request video
  audio: false  // We don't need audio
})
.then(stream => {
  // Success! We have access to the camera
  videoElement.srcObject = stream;
})
.catch(error => {
  // User denied permission or camera not available
  console.error('Camera access denied:', error);
});
```

**Key Concepts:**
- `navigator.mediaDevices` - Browser API for media devices
- `getUserMedia()` - Returns a Promise that resolves to a MediaStream
- **MediaStream** - Represents video/audio stream from the camera
- Requires **HTTPS** in production (localhost is OK for development)
- User must **grant permission** to access camera

#### Media Constraints

You can customize the camera request with constraints:

```javascript
const constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',  // Front camera (use 'environment' for back)
    frameRate: { ideal: 30 }
  },
  audio: false
};

navigator.mediaDevices.getUserMedia(constraints);
```

**Common Constraints:**
- `width` / `height` - Video resolution
- `facingMode` - 'user' (front camera) or 'environment' (back camera)
- `frameRate` - Frames per second
- `aspectRatio` - Video aspect ratio

### 2. HTML5 Canvas API

The **Canvas** element is a drawing surface where you can render graphics using JavaScript.

```javascript
// Get reference to canvas element
const canvas = document.getElementById('myCanvas');

// Get 2D rendering context (the drawing API)
const ctx = canvas.getContext('2d');

// Now you can draw!
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);  // Draw a red rectangle
```

**Canvas Coordinate System:**
- Origin (0, 0) is **top-left corner**
- X increases to the right
- Y increases downward

```
(0,0) ──────► X
  │
  │
  │
  ▼
  Y
```

#### Drawing Images to Canvas

```javascript
// Draw an image (or video frame) to canvas
ctx.drawImage(
  image,     // Source: image, video, or another canvas
  sx, sy,    // Source x, y (where to start cropping)
  sWidth, sHeight,  // Source width/height (crop size)
  dx, dy,    // Destination x, y (where to place on canvas)
  dWidth, dHeight   // Destination width/height (scale)
);

// Simplified version (no cropping or scaling):
ctx.drawImage(image, x, y);

// With scaling:
ctx.drawImage(image, x, y, width, height);
```

#### Canvas Transformations

```javascript
// Save current state
ctx.save();

// Flip horizontally (mirror effect)
ctx.scale(-1, 1);  // Flip X axis, keep Y normal
ctx.translate(-canvas.width, 0);  // Move origin to compensate

// Draw your content here
ctx.drawImage(video, 0, 0);

// Restore previous state
ctx.restore();
```

**Why Mirror the Video?**
When you see yourself in a mirror, raising your right hand appears on the right side. But cameras show the "real" view where your right hand appears on the left (to viewers). Mirroring makes the video feel more natural for selfies.

### 3. Rendering Loop

To show live video, we need to continuously draw frames to the canvas:

```javascript
function renderLoop() {
  // 1. Clear canvas (optional, depends on what you're drawing)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw current video frame
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // 3. Request next frame
  requestAnimationFrame(renderLoop);
}

// Start the loop
renderLoop();
```

**Why `requestAnimationFrame`?**
- Optimized for animations (runs at ~60 FPS)
- Pauses when tab is hidden (saves CPU)
- Syncs with browser's repaint cycle
- Better than `setInterval` for smooth animations

**Stopping the Loop:**
```javascript
let animationId = null;

function startLoop() {
  function loop() {
    ctx.drawImage(videoElement, 0, 0);
    animationId = requestAnimationFrame(loop);
  }
  loop();
}

function stopLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}
```

### 4. Video Element Setup

Although we render to canvas, we still need a `<video>` element to receive the stream:

```javascript
// In JSX:
<video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  style={{ display: 'none' }}  // Hidden - we show the canvas instead
/>

// In JavaScript:
const videoElement = videoRef.current;

// Set the stream
videoElement.srcObject = stream;

// Wait for video to be ready
videoElement.onloadedmetadata = () => {
  videoElement.play();
  startRenderingLoop();
};
```

**Important Attributes:**
- `autoPlay` - Start playing as soon as stream is ready
- `playsInline` - Prevent fullscreen on mobile
- `muted` - Required for autoplay in some browsers
- `style={{ display: 'none' }}` - Hide it since we use canvas

### 5. Stream Cleanup

**CRITICAL:** Always stop the camera stream when done to:
- Free up the camera for other apps
- Turn off the camera indicator light
- Prevent memory leaks

```javascript
function stopCamera() {
  if (stream) {
    // Stop all tracks in the stream
    stream.getTracks().forEach(track => track.stop());
  }

  if (videoElement) {
    videoElement.srcObject = null;
  }

  // Cancel animation frame
  cancelAnimationFrame(animationId);
}

// Use cleanup in useEffect
useEffect(() => {
  // Setup code here...

  return () => {
    // Cleanup when component unmounts
    stopCamera();
  };
}, []);
```

## 💻 Implementation Guide

### Step 1: Understanding the Video and Canvas Setup

Open `src/App.js` and locate the video and canvas elements:

```javascript
function App() {
  // Refs to access DOM elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  return (
    <div className="App">
      {/* Hidden video element receives the stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />

      {/* Canvas displays the video with effects */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="webcam-canvas"
      />
    </div>
  );
}
```

**Your Task:**
1. Find the video and canvas elements in App.js
2. Identify where the refs are used
3. Understand why video is hidden and canvas is shown

### Step 2: Exploring the toggleCamera Function

Find the `toggleCamera` function that starts/stops the webcam:

```javascript
const toggleCamera = async () => {
  if (isCameraOn) {
    // TODO: Stop the camera
    // 1. Stop all tracks in the stream
    // 2. Clear video srcObject
    // 3. Cancel animation frame
    // 4. Update state

    setIsCameraOn(false);
  } else {
    // TODO: Start the camera
    try {
      // 1. Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });

      // 2. Attach stream to video element
      // 3. Wait for video to load
      // 4. Start rendering loop
      // 5. Update state

      setIsCameraOn(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Unable to access camera. Please grant permission.');
    }
  }
};
```

**Your Task:**
1. Complete the TODO sections
2. Add proper error handling
3. Test starting and stopping the camera

### Step 3: Implementing the Render Loop

Find or create the `renderFrame` function:

```javascript
const renderFrame = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas || !isCameraOn) return;

  const ctx = canvas.getContext('2d');

  // TODO: Draw the video frame to canvas
  // 1. Save canvas state
  // 2. Apply mirror transformation
  // 3. Draw video frame
  // 4. Apply filter (if any)
  // 5. Restore canvas state

  // Continue the loop
  requestAnimationFrame(renderFrame);
};
```

**Your Task:**
1. Implement the mirror transformation
2. Draw the video frame
3. Make sure the loop continues

### Step 4: Adding Mirror Effect

Implement the mirroring transformation:

```javascript
const renderFrame = () => {
  const ctx = canvasRef.current.getContext('2d');
  const video = videoRef.current;

  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Save current state
  ctx.save();

  // TODO: Apply mirror transformation
  // Hint: scale(-1, 1) flips horizontally
  // Then translate to move the image back into view
  ctx.scale(-1, 1);
  ctx.translate(-canvas.width, 0);

  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Restore state
  ctx.restore();

  // Continue loop
  requestAnimationFrame(renderFrame);
};
```

### Step 5: Practice Tasks

#### Task 1: Add a Snapshot Feature

Capture the current canvas frame as an image:

```javascript
const takeSnapshot = () => {
  const canvas = canvasRef.current;

  // Convert canvas to data URL (base64 image)
  const imageData = canvas.toDataURL('image/png');

  // Create download link
  const link = document.createElement('a');
  link.href = imageData;
  link.download = `snapshot-${Date.now()}.png`;
  link.click();
};

// Add button in JSX
<button onClick={takeSnapshot}>
  📸 Take Snapshot
</button>
```

#### Task 2: Show FPS Counter

Display the rendering frame rate:

```javascript
const [fps, setFps] = useState(0);
let lastTime = Date.now();
let frameCount = 0;

const renderFrame = () => {
  // Your existing render code...

  // Calculate FPS
  frameCount++;
  const currentTime = Date.now();
  if (currentTime - lastTime >= 1000) {
    setFps(frameCount);
    frameCount = 0;
    lastTime = currentTime;
  }

  requestAnimationFrame(renderFrame);
};

// Display in JSX
<div className="fps-counter">FPS: {fps}</div>
```

#### Task 3: Add Resolution Selector

Let users choose video resolution:

```javascript
const [resolution, setResolution] = useState('640x480');

const resolutions = {
  '640x480': { width: 640, height: 480 },
  '1280x720': { width: 1280, height: 720 },
  '1920x1080': { width: 1920, height: 1080 }
};

const startCamera = async (res) => {
  const { width, height } = resolutions[res];

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width, height, facingMode: 'user' }
  });

  // Update canvas size
  canvasRef.current.width = width;
  canvasRef.current.height = height;

  // Rest of setup...
};

// UI
<select value={resolution} onChange={(e) => setResolution(e.target.value)}>
  <option value="640x480">640 × 480</option>
  <option value="1280x720">1280 × 720 (HD)</option>
  <option value="1920x1080">1920 × 1080 (Full HD)</option>
</select>
```

#### Task 4: Add Camera Switch (Front/Back)

```javascript
const [facingMode, setFacingMode] = useState('user');

const switchCamera = () => {
  // Stop current camera
  stopCamera();

  // Toggle facing mode
  const newMode = facingMode === 'user' ? 'environment' : 'user';
  setFacingMode(newMode);

  // Restart with new facing mode
  startCamera(newMode);
};

// Button
<button onClick={switchCamera}>
  🔄 Switch Camera
</button>
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What's the difference between a video element and a canvas?**
   <details>
   <summary>Answer</summary>

   - **Video element**: Displays media streams/files, controlled by browser
   - **Canvas element**: Drawing surface, you control every pixel with JavaScript
   - We use both: video receives the stream, canvas displays it with effects
   </details>

2. **Why do we need `await` when calling getUserMedia?**
   <details>
   <summary>Answer</summary>

   `getUserMedia()` returns a **Promise** because:
   - It asks the user for permission (takes time)
   - It initializes the camera hardware (takes time)
   - It might fail (user denies, no camera, etc.)

   `await` pauses execution until the Promise resolves or rejects.
   </details>

3. **What happens if you don't stop camera tracks on cleanup?**
   <details>
   <summary>Answer</summary>

   - Camera stays on (indicator light remains on)
   - Camera is locked, other apps can't use it
   - Memory leak (stream keeps running)
   - Poor user experience and privacy concerns
   </details>

4. **Why use `requestAnimationFrame` instead of `setInterval`?**
   <details>
   <summary>Answer</summary>

   - **Optimized**: Syncs with browser refresh rate (60 FPS)
   - **Efficient**: Pauses when tab is hidden
   - **Smooth**: No jitter or timing issues
   - **Better performance**: Batched with browser repaints
   </details>

### Challenges

**Challenge 1: Add Zoom Control**

```javascript
const [zoom, setZoom] = useState(1);

const renderFrame = () => {
  const ctx = canvasRef.current.getContext('2d');
  const video = videoRef.current;

  ctx.save();

  // TODO: Apply zoom transformation
  // Hint: Use ctx.scale(zoom, zoom) and adjust positioning

  ctx.drawImage(video, 0, 0);
  ctx.restore();

  requestAnimationFrame(renderFrame);
};

// UI
<input
  type="range"
  min="1"
  max="3"
  step="0.1"
  value={zoom}
  onChange={(e) => setZoom(parseFloat(e.target.value))}
/>
```

**Challenge 2: Add Brightness Control**

```javascript
const renderFrame = () => {
  // Draw video frame
  ctx.drawImage(video, 0, 0);

  // TODO: Adjust brightness
  // Hint: Get image data, modify pixel values, put it back
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const brightness = 1.2; // 20% brighter

  for (let i = 0; i < data.length; i += 4) {
    data[i] *= brightness;     // Red
    data[i + 1] *= brightness; // Green
    data[i + 2] *= brightness; // Blue
    // data[i + 3] is alpha, don't change
  }

  ctx.putImageData(imageData, 0, 0);
};
```

**Challenge 3: Add Motion Detection**

```javascript
let previousFrame = null;

const detectMotion = (currentFrame) => {
  if (!previousFrame) {
    previousFrame = currentFrame;
    return 0;
  }

  let diffCount = 0;
  const threshold = 30;

  for (let i = 0; i < currentFrame.data.length; i += 4) {
    const diff = Math.abs(currentFrame.data[i] - previousFrame.data[i]);
    if (diff > threshold) diffCount++;
  }

  previousFrame = currentFrame;
  return diffCount / (currentFrame.data.length / 4);
};

const renderFrame = () => {
  ctx.drawImage(video, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const motionLevel = detectMotion(imageData);

  console.log('Motion:', motionLevel);
};
```

## 🔗 Additional Resources

### Official Documentation
- [MediaDevices.getUserMedia() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MediaStream - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
- [requestAnimationFrame - MDN](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### Video Tutorials
- [WebRTC getUserMedia Tutorial](https://www.youtube.com/watch?v=DvlyzDZDEq4)
- [HTML5 Canvas Crash Course](https://www.youtube.com/watch?v=gm1QtePAYTM)
- [JavaScript Animation with requestAnimationFrame](https://www.youtube.com/watch?v=9-6CKCz58A8)

### Interactive Learning
- [Canvas Tutorial - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [WebRTC Samples](https://webrtc.github.io/samples/) - Live examples

### Articles
- [How getUserMedia Works](https://blog.addpipe.com/camera-and-microphone-access/)
- [Canvas Performance Tips](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)

## 🎯 Key Takeaways

Before moving to Level 3, make sure you understand:

✅ **getUserMedia** - How to request camera access
✅ **MediaStream** - How camera data flows through the app
✅ **Canvas API** - Drawing images and transformations
✅ **Rendering Loop** - Using requestAnimationFrame for smooth updates
✅ **Cleanup** - Stopping tracks and preventing memory leaks
✅ **Transformations** - Mirroring and other canvas transformations
✅ **Error Handling** - Dealing with permission denials and missing cameras

## 🚀 Ready for Level 3?

Once you're comfortable with these concepts, proceed to **Level 3: Filters & Effects**, where you'll learn:

- Applying CSS filters to canvas output
- Creating custom visual effects
- Understanding filter composition
- Building a filter selection UI

```bash
git add .
git commit -m "Complete Level 2: Webcam & Canvas"
git checkout level-3-filters
```

---

**Need Help?**
- Review [Level 1](./README-LEVEL-1.md) if you need to refresh React concepts
- Check the [main README](../README.md) for troubleshooting
- Open an issue if you encounter camera access problems

Happy coding! 🎥
