# Code Examples and Learning Guide

This document provides detailed code examples and explanations to help you understand and extend the Beautify Me application.

## Table of Contents

- [Project Architecture](#project-architecture)
- [React Hooks Deep Dive](#react-hooks-deep-dive)
- [WebRTC Implementation](#webrtc-implementation)
- [Canvas API Usage](#canvas-api-usage)
- [Creating Custom Filters](#creating-custom-filters)
- [State Management Patterns](#state-management-patterns)
- [Performance Optimization](#performance-optimization)
- [Common Issues and Solutions](#common-issues-and-solutions)

## Project Architecture

### Component Structure

Beautify Me uses a single-component architecture for simplicity. Here's how it's organized:

```
App Component
├── State Management (useState)
├── Ref Management (useRef)
├── Effect Management (useEffect)
├── Helper Functions
│   ├── applyFilter()
│   ├── capturePhoto()
│   ├── downloadPhoto()
│   ├── renderFrame()
│   ├── startWebcam()
│   └── stopWebcam()
└── JSX Rendering
    ├── Hero Section
    ├── Stats Section
    ├── Features Section
    ├── App Section (Webcam)
    └── Footer
```

### Data Flow

```
User Action → Event Handler → State Update → Re-render → Effect Trigger → DOM Update
```

Example:
```
Click "Start Webcam" 
  → startWebcam() 
  → setIsWebcamActive(true) 
  → Component re-renders 
  → useEffect triggers 
  → renderFrame() starts
```

## React Hooks Deep Dive

### useState - Managing Component State

**Basic Usage:**
```javascript
const [value, setValue] = useState(initialValue);
```

**Example from Beautify Me:**
```javascript
// Boolean state for webcam status
const [isWebcamActive, setIsWebcamActive] = useState(false);

// Usage:
setIsWebcamActive(true);  // Start webcam
setIsWebcamActive(false); // Stop webcam

// In render:
{isWebcamActive && <canvas ref={canvasRef} />}
```

**Multiple State Variables:**
```javascript
// Each state is independent
const [filter, setFilter] = useState('none');
const [intensity, setIntensity] = useState(100);
const [beautyMode, setBeautyMode] = useState(false);

// Update one doesn't affect others
setFilter('grayscale');  // Only filter changes
```

**State with Objects (Advanced):**
```javascript
// If you needed complex state:
const [settings, setSettings] = useState({
  filter: 'none',
  intensity: 100,
  beautyMode: false
});

// Update entire object:
setSettings({
  ...settings,
  filter: 'grayscale'  // Spread existing, update one property
});
```

### useRef - Persisting Values Without Re-renders

**Why use useRef?**
- Access DOM elements directly
- Store mutable values that persist across renders
- Avoid triggering re-renders

**Example from Beautify Me:**
```javascript
// Create a ref
const videoRef = useRef(null);

// Attach to JSX element
<video ref={videoRef} />

// Access the actual DOM element
videoRef.current.play();
videoRef.current.srcObject = stream;

// Why not useState? Because updating a ref doesn't trigger re-render!
```

**Common Ref Use Cases:**
```javascript
// 1. DOM Elements
const canvasRef = useRef(null);
const ctx = canvasRef.current.getContext('2d');

// 2. Store values across renders
const animationFrameRef = useRef(null);
animationFrameRef.current = requestAnimationFrame(renderFrame);

// 3. Previous values
const prevValueRef = useRef();
useEffect(() => {
  prevValueRef.current = value;
}, [value]);
```

### useEffect - Side Effects and Lifecycle

**Basic Pattern:**
```javascript
useEffect(() => {
  // Effect code runs after render
  
  return () => {
    // Cleanup runs before next effect or unmount
  };
}, [dependencies]);
```

**Example from Beautify Me:**
```javascript
useEffect(() => {
  // Only run when isWebcamActive changes
  if (isWebcamActive) {
    renderFrame();  // Start rendering loop
  }

  // Cleanup when component unmounts or dependencies change
  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
}, [isWebcamActive, selectedFilter, beautyMode, filterIntensity]);
```

**Common useEffect Patterns:**

1. **Run Once (Component Mount):**
```javascript
useEffect(() => {
  console.log('Component mounted');
}, []); // Empty dependency array
```

2. **Run on Every Render:**
```javascript
useEffect(() => {
  console.log('Component rendered');
}); // No dependency array
```

3. **Run When Specific Values Change:**
```javascript
useEffect(() => {
  console.log('Filter changed to:', selectedFilter);
}, [selectedFilter]);
```

4. **Cleanup:**
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
```

## WebRTC Implementation

### Understanding getUserMedia

**What it does:**
- Requests access to media devices (camera, microphone)
- Returns a Promise that resolves to a MediaStream
- Prompts user for permission

**Basic Usage:**
```javascript
navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    // Success - got the stream
  })
  .catch(error => {
    // Error - permission denied or no device
  });
```

**Our Implementation (async/await):**
```javascript
const startWebcam = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 1280,    // Preferred width
        height: 720     // Preferred height
      },
      audio: false      // We don't need audio
    });
    
    // Attach stream to video element
    videoRef.current.srcObject = stream;
    
  } catch (err) {
    console.error('Camera access error:', err);
  }
};
```

**Advanced Constraints:**
```javascript
const constraints = {
  video: {
    width: { ideal: 1920 },      // Prefer 1920, but flexible
    height: { ideal: 1080 },
    facingMode: 'user',           // Front camera (for selfies)
    frameRate: { ideal: 60 },     // Prefer 60fps
  }
};

// Or for back camera:
const backCamera = {
  video: {
    facingMode: { exact: 'environment' }
  }
};
```

**Stopping the Stream:**
```javascript
const stopWebcam = () => {
  // Get all tracks from the stream
  const tracks = stream.getTracks();
  
  // Stop each track (releases hardware)
  tracks.forEach(track => track.stop());
  
  // Clean up
  videoRef.current.srcObject = null;
};
```

## Canvas API Usage

### Getting Started with Canvas

**Basic Setup:**
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set size
canvas.width = 640;
canvas.height = 480;

// Draw something
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);
```

### Drawing Video to Canvas

**Our Implementation:**
```javascript
const renderFrame = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  // Match canvas size to video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Keep looping
  requestAnimationFrame(renderFrame);
};
```

### Applying Transformations

**Mirror Effect:**
```javascript
ctx.save();                      // Save current state
ctx.scale(-1, 1);               // Flip horizontally
ctx.translate(-canvas.width, 0); // Move back into view
ctx.drawImage(video, 0, 0);     // Draw
ctx.restore();                  // Restore original state
```

**Rotation:**
```javascript
ctx.save();
ctx.translate(canvas.width/2, canvas.height/2);  // Move to center
ctx.rotate(Math.PI / 4);                         // Rotate 45 degrees
ctx.drawImage(video, -video.width/2, -video.height/2);
ctx.restore();
```

### CSS Filters on Canvas

**Available Filters:**
```javascript
// Grayscale
ctx.filter = 'grayscale(100%)';

// Sepia
ctx.filter = 'sepia(60%)';

// Blur
ctx.filter = 'blur(5px)';

// Brightness
ctx.filter = 'brightness(1.5)';

// Contrast
ctx.filter = 'contrast(200%)';

// Saturation
ctx.filter = 'saturate(200%)';

// Hue rotation
ctx.filter = 'hue-rotate(180deg)';

// Invert colors
ctx.filter = 'invert(100%)';

// Combine multiple
ctx.filter = 'grayscale(50%) contrast(150%) brightness(1.2)';
```

## Creating Custom Filters

### Step-by-Step: Adding a New Filter

**1. Add to filters array:**
```javascript
const filters = [
  // ... existing filters
  { id: 'mystic', name: 'Mystic', icon: '🌟' },
];
```

**2. Add filter logic in applyFilter function:**
```javascript
const applyFilter = (ctx, filterType) => {
  const intensity = filterIntensity / 100;
  let filterString = '';
  
  switch (filterType) {
    // ... other cases
    
    case 'mystic':
      // Purple/blue ethereal look
      filterString = `
        hue-rotate(${250 * intensity}deg) 
        saturate(${1 + 0.5 * intensity}) 
        brightness(${1 + 0.15 * intensity})
        contrast(${1 + 0.2 * intensity})
      `;
      break;
  }
  
  ctx.filter = filterString;
};
```

**3. Test your filter:**
- Start the app
- Enable webcam
- Select your new filter
- Adjust intensity to fine-tune

### Advanced: Pixel Manipulation

For effects that CSS filters can't achieve, manipulate pixels directly:

```javascript
const applyPixelEffect = (ctx, canvas) => {
  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;  // RGBA array
  
  // Loop through each pixel
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];      // Red
    const g = data[i + 1];  // Green
    const b = data[i + 2];  // Blue
    const a = data[i + 3];  // Alpha
    
    // Example: Convert to grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
  
  // Put modified data back
  ctx.putImageData(imageData, 0, 0);
};
```

**Note:** Pixel manipulation is slower than CSS filters. Use only when necessary.

## State Management Patterns

### Local Component State

For simple apps like ours, useState is perfect:

```javascript
// Good for:
const [isWebcamActive, setIsWebcamActive] = useState(false);
const [selectedFilter, setSelectedFilter] = useState('none');
```

### Computed Values

Don't store derived data in state:

```javascript
// Bad ❌
const [filterIntensity, setFilterIntensity] = useState(100);
const [normalizedIntensity, setNormalizedIntensity] = useState(1);

// Good ✅
const [filterIntensity, setFilterIntensity] = useState(100);
const normalizedIntensity = filterIntensity / 100;  // Compute on the fly
```

### State Updates are Asynchronous

```javascript
// Bad ❌
setCount(count + 1);
console.log(count);  // Still shows old value!

// Good ✅
setCount(prevCount => {
  const newCount = prevCount + 1;
  console.log(newCount);  // Shows new value
  return newCount;
});
```

## Performance Optimization

### requestAnimationFrame Best Practices

**Always clean up:**
```javascript
useEffect(() => {
  let frameId;
  
  const animate = () => {
    // Do animation work
    frameId = requestAnimationFrame(animate);
  };
  
  animate();
  
  return () => cancelAnimationFrame(frameId);  // Cleanup!
}, []);
```

### Avoid Unnecessary Re-renders

**Use React.memo for components:**
```javascript
const FilterButton = React.memo(({ filter, onClick }) => {
  return (
    <button onClick={onClick}>
      {filter.name}
    </button>
  );
});
```

**Memoize expensive calculations:**
```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);  // Only recompute when data changes
```

### Canvas Performance Tips

1. **Resize canvas only when needed:**
```javascript
if (canvas.width !== video.videoWidth) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}
```

2. **Use CSS filters instead of pixel manipulation when possible**

3. **Clear only what changed:**
```javascript
// Instead of:
ctx.clearRect(0, 0, canvas.width, canvas.height);

// If possible:
ctx.clearRect(x, y, width, height);  // Only changed area
```

## Common Issues and Solutions

### Issue: Camera Not Working

**Possible Causes:**
1. Permissions denied
2. HTTPS required (not on localhost)
3. Camera in use by another app
4. Browser doesn't support getUserMedia

**Solution:**
```javascript
const startWebcam = async () => {
  try {
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser does not support camera access');
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    
    // Success
  } catch (err) {
    // Detailed error handling
    if (err.name === 'NotAllowedError') {
      setError('Camera permission denied');
    } else if (err.name === 'NotFoundError') {
      setError('No camera found');
    } else if (err.name === 'NotReadableError') {
      setError('Camera is already in use');
    } else {
      setError('Camera error: ' + err.message);
    }
  }
};
```

### Issue: Memory Leaks

**Problem:** Not cleaning up resources

**Solution:**
```javascript
useEffect(() => {
  const stream = /* ... */;
  
  return () => {
    // Clean up stream
    stream.getTracks().forEach(track => track.stop());
    
    // Cancel animations
    cancelAnimationFrame(frameId);
    
    // Clear timers
    clearInterval(timerId);
  };
}, []);
```

### Issue: Filters Not Applying

**Check:**
1. ctx.filter set before drawImage
2. Filter string is valid CSS
3. Canvas state saved/restored correctly

```javascript
// Correct order:
ctx.save();
ctx.filter = 'grayscale(100%)';  // Set filter first
ctx.drawImage(video, 0, 0);       // Then draw
ctx.restore();
```

## Next Steps

Ready to extend the app? Try these challenges:

1. **Add More Filters:** Create Instagram-style filters
2. **Face Detection:** Use face-api.js to detect faces
3. **Video Recording:** Implement MediaRecorder API
4. **Multiple Effects:** Allow combining filters
5. **Presets:** Save favorite filter combinations
6. **Social Sharing:** Add share to social media
7. **AR Filters:** Add virtual effects over video

## Resources

- [React Documentation](https://react.dev)
- [Canvas API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [WebRTC Examples](https://webrtc.github.io/samples/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

Happy coding! 🎨✨
