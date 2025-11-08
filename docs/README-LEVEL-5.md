# Level 5: Stickers & Drag 🎭

**Duration:** 2-3 hours
**Difficulty:** 🟡 Intermediate
**Prerequisites:** Level 1-4 completed (React, Webcam, Filters, Photos)

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Implement drag-and-drop functionality
- ✅ Handle mouse and touch events
- ✅ Track element positions and drag state
- ✅ Composite stickers on canvas
- ✅ Load and render emoji/image stickers
- ✅ Build an interactive sticker selector
- ✅ Understand event coordinates and transformations

## 🎓 What You'll Build

In this level, you'll add **interactive draggable stickers**:

- Sticker library with 20+ emoji options
- Drag-and-drop positioning
- Multiple stickers on canvas simultaneously
- Touch support for mobile devices
- Sticker removal functionality
- Real-time rendering with video

## 🏗️ Concepts Covered

### 1. Mouse Events

JavaScript provides several mouse events for interactivity:

```javascript
<div
  onMouseDown={handleMouseDown}   // Mouse button pressed
  onMouseMove={handleMouseMove}   // Mouse moves (even without clicking)
  onMouseUp={handleMouseUp}       // Mouse button released
  onMouseEnter={handleMouseEnter} // Mouse enters element
  onMouseLeave={handleMouseLeave} // Mouse leaves element
>
  Draggable Element
</div>
```

**Event Flow for Dragging:**
1. `onMouseDown` - Start dragging, record start position
2. `onMouseMove` - Update position while dragging
3. `onMouseUp` - Stop dragging, finalize position

#### Getting Mouse Coordinates

```javascript
const handleMouseDown = (e) => {
  // Coordinates relative to viewport
  const viewportX = e.clientX;
  const viewportY = e.clientY;

  // Coordinates relative to page (includes scroll)
  const pageX = e.pageX;
  const pageY = e.pageY;

  // Coordinates relative to target element
  const rect = e.target.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  const relativeY = e.clientY - rect.top;
};
```

### 2. Touch Events (Mobile Support)

Touch devices use different events:

```javascript
<div
  onTouchStart={handleTouchStart}   // Finger touches screen
  onTouchMove={handleTouchMove}     // Finger moves
  onTouchEnd={handleTouchEnd}       // Finger lifts
>
  Touch-draggable Element
</div>
```

**Touch Event Properties:**
```javascript
const handleTouchStart = (e) => {
  // touches is an array of all active touches
  const touch = e.touches[0];

  const x = touch.clientX;
  const y = touch.clientY;
};
```

**Unified Touch/Mouse Handler:**
```javascript
const getPointerPosition = (e) => {
  // Handle both mouse and touch
  if (e.touches) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
};

const handlePointerDown = (e) => {
  const pos = getPointerPosition(e);
  console.log('Pointer at:', pos.x, pos.y);
};

// Use both events
<div
  onMouseDown={handlePointerDown}
  onTouchStart={handlePointerDown}
>
```

### 3. Drag-and-Drop Implementation

#### Basic Drag State

```javascript
const [isDragging, setIsDragging] = useState(false);
const [draggedSticker, setDraggedSticker] = useState(null);
const [offset, setOffset] = useState({ x: 0, y: 0 });

const handleMouseDown = (sticker, e) => {
  setIsDragging(true);
  setDraggedSticker(sticker);

  // Calculate offset between mouse and sticker position
  const rect = e.target.getBoundingClientRect();
  setOffset({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  });
};

const handleMouseMove = (e) => {
  if (!isDragging || !draggedSticker) return;

  // Update sticker position
  const newX = e.clientX - offset.x;
  const newY = e.clientY - offset.y;

  updateStickerPosition(draggedSticker.id, newX, newY);
};

const handleMouseUp = () => {
  setIsDragging(false);
  setDraggedSticker(null);
};
```

#### Sticker Data Structure

```javascript
const [stickers, setStickers] = useState([
  {
    id: 1,
    emoji: '😎',
    x: 100,
    y: 100,
    size: 48
  },
  {
    id: 2,
    emoji: '🎉',
    x: 200,
    y: 150,
    size: 48
  }
]);
```

### 4. Canvas Coordinate System

When working with canvas, you need to convert screen coordinates to canvas coordinates:

```javascript
const screenToCanvas = (screenX, screenY, canvas) => {
  const rect = canvas.getBoundingClientRect();

  // Canvas might be scaled via CSS
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (screenX - rect.left) * scaleX,
    y: (screenY - rect.top) * scaleY
  };
};

// Usage
const handleCanvasClick = (e) => {
  const canvas = canvasRef.current;
  const canvasPos = screenToCanvas(e.clientX, e.clientY, canvas);

  console.log('Clicked at canvas position:', canvasPos);
};
```

### 5. Drawing Text (Emoji) on Canvas

```javascript
const ctx = canvas.getContext('2d');

// Set font size and family
ctx.font = '48px Arial';

// Set text alignment
ctx.textAlign = 'center';     // 'left', 'center', 'right'
ctx.textBaseline = 'middle';  // 'top', 'middle', 'bottom'

// Draw emoji
ctx.fillText('😎', x, y);

// Measure text width
const metrics = ctx.measureText('😎');
const width = metrics.width;
```

**Drawing Stickers with Rotation:**
```javascript
const drawSticker = (ctx, sticker) => {
  ctx.save();

  // Move to sticker position
  ctx.translate(sticker.x, sticker.y);

  // Rotate if needed
  if (sticker.rotation) {
    ctx.rotate(sticker.rotation * Math.PI / 180);
  }

  // Draw emoji
  ctx.font = `${sticker.size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sticker.emoji, 0, 0);

  ctx.restore();
};
```

### 6. Loading and Drawing Images

For non-emoji stickers (PNG/SVG images):

```javascript
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Usage
const drawImageSticker = async (ctx, sticker) => {
  const img = await loadImage(sticker.src);

  ctx.drawImage(
    img,
    sticker.x - sticker.width / 2,  // Center the image
    sticker.y - sticker.height / 2,
    sticker.width,
    sticker.height
  );
};
```

### 7. Event Listeners on Window

For drag events, attach listeners to window so dragging works even outside the element:

```javascript
useEffect(() => {
  const handleGlobalMouseMove = (e) => {
    if (isDragging) {
      // Update position
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
  };

  // Add listeners to window
  if (isDragging) {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
  }

  // Cleanup
  return () => {
    window.removeEventListener('mousemove', handleGlobalMouseMove);
    window.removeEventListener('mouseup', handleGlobalMouseUp);
  };
}, [isDragging]);
```

**Why window?**
- If you drag fast, mouse might leave the element
- Window listeners ensure drag continues
- Prevents "stuck" drag state

## 💻 Implementation Guide

### Step 1: Understanding the Sticker Data Structure

Open `src/App.js` and locate the sticker state:

```javascript
const [stickers, setStickers] = useState([]);

// Available sticker library
const availableStickers = [
  '😎', '🎉', '🎊', '🎈', '🎁', '🎂', '🎄', '🎃',
  '❤️', '💙', '💚', '💜', '⭐', '✨', '🔥', '💯',
  '👍', '👏', '🙌', '💪', '🦄', '🌈', '☀️', '🌙'
];
```

**Your Task:**
1. Find the stickers state array
2. Locate the available stickers library
3. Understand the sticker object structure (id, emoji, x, y, size)

### Step 2: Adding Stickers

```javascript
const addSticker = (emoji) => {
  const newSticker = {
    id: Date.now(),
    emoji: emoji,
    x: 320, // Center of canvas (640/2)
    y: 240, // Center of canvas (480/2)
    size: 48
  };

  setStickers(prevStickers => [...prevStickers, newSticker]);
};

// TODO: Call this when user clicks a sticker from the library
```

**Your Task:**
1. Complete the addSticker function
2. Connect it to the sticker selector UI
3. Test adding stickers

### Step 3: Drawing Stickers on Canvas

```javascript
const renderFrame = () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;
  const ctx = canvas.getContext('2d');

  // 1. Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. Draw all stickers on top
  stickers.forEach(sticker => {
    // TODO: Draw sticker
    ctx.font = `${sticker.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, sticker.x, sticker.y);
  });

  requestAnimationFrame(renderFrame);
};
```

**Your Task:**
1. Find where stickers are drawn in the render loop
2. Test that stickers appear on canvas
3. Try changing sticker positions manually

### Step 4: Implementing Drag-and-Drop

```javascript
const [draggingSticker, setDraggingSticker] = useState(null);
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

const handleStickerMouseDown = (sticker, e) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();

  // TODO: Calculate offset between mouse and sticker center
  const offsetX = e.clientX - rect.left - sticker.x;
  const offsetY = e.clientY - rect.top - sticker.y;

  setDraggingSticker(sticker.id);
  setDragOffset({ x: offsetX, y: offsetY });
};

const handleCanvasMouseMove = (e) => {
  if (!draggingSticker) return;

  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();

  // TODO: Update sticker position
  const newX = e.clientX - rect.left - dragOffset.x;
  const newY = e.clientY - rect.top - dragOffset.y;

  setStickers(prevStickers =>
    prevStickers.map(s =>
      s.id === draggingSticker
        ? { ...s, x: newX, y: newY }
        : s
    )
  );
};

const handleMouseUp = () => {
  setDraggingSticker(null);
};
```

**Your Task:**
1. Complete the drag handlers
2. Add mouse event listeners to canvas
3. Test dragging stickers

### Step 5: Practice Tasks

#### Task 1: Add Sticker Removal

```javascript
const removeSticker = (stickerId) => {
  setStickers(prevStickers =>
    prevStickers.filter(s => s.id !== stickerId)
  );
};

// Double-click to remove
const handleStickerDoubleClick = (sticker) => {
  removeSticker(sticker.id);
};

// Or add a remove button
<button onClick={() => removeSticker(sticker.id)}>
  Remove
</button>
```

#### Task 2: Add Sticker Resize

```javascript
const [selectedSticker, setSelectedSticker] = useState(null);

const resizeSticker = (stickerId, newSize) => {
  setStickers(prevStickers =>
    prevStickers.map(s =>
      s.id === stickerId ? { ...s, size: newSize } : s
    )
  );
};

// UI for selected sticker
{selectedSticker && (
  <div className="sticker-controls">
    <label>Size:</label>
    <input
      type="range"
      min="24"
      max="120"
      value={selectedSticker.size}
      onChange={(e) => resizeSticker(selectedSticker.id, parseInt(e.target.value))}
    />
  </div>
)}
```

#### Task 3: Add Sticker Rotation

```javascript
// Add rotation to sticker object
const addSticker = (emoji) => {
  const newSticker = {
    id: Date.now(),
    emoji: emoji,
    x: 320,
    y: 240,
    size: 48,
    rotation: 0  // New property
  };
  // ...
};

// Draw with rotation
const drawSticker = (ctx, sticker) => {
  ctx.save();
  ctx.translate(sticker.x, sticker.y);
  ctx.rotate(sticker.rotation * Math.PI / 180);
  ctx.font = `${sticker.size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sticker.emoji, 0, 0);
  ctx.restore();
};

// UI control
<input
  type="range"
  min="0"
  max="360"
  value={selectedSticker.rotation}
  onChange={(e) => rotateSticker(selectedSticker.id, parseInt(e.target.value))}
/>
```

#### Task 4: Sticker Categories

```javascript
const stickerCategories = {
  faces: ['😀', '😎', '😍', '🤩', '😂', '🥳'],
  celebrations: ['🎉', '🎊', '🎈', '🎁', '🎂', '🎄'],
  hearts: ['❤️', '💙', '💚', '💜', '🧡', '💛'],
  symbols: ['⭐', '✨', '🔥', '💯', '👍', '👏']
};

const [activeCategory, setActiveCategory] = useState('faces');

// UI
<div className="sticker-categories">
  {Object.keys(stickerCategories).map(category => (
    <button
      key={category}
      onClick={() => setActiveCategory(category)}
      className={activeCategory === category ? 'active' : ''}
    >
      {category}
    </button>
  ))}
</div>

<div className="sticker-library">
  {stickerCategories[activeCategory].map((emoji, idx) => (
    <button
      key={idx}
      onClick={() => addSticker(emoji)}
      className="sticker-item"
    >
      {emoji}
    </button>
  ))}
</div>
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What's the difference between `clientX` and `pageX`?**
   <details>
   <summary>Answer</summary>

   - **clientX/clientY**: Coordinates relative to viewport (visible browser window)
   - **pageX/pageY**: Coordinates relative to entire page (includes scroll)

   Use `clientX/clientY` for most UI interactions, `pageX/pageY` for scrollable content.
   </details>

2. **Why attach mousemove to window during drag?**
   <details>
   <summary>Answer</summary>

   If the mouse moves quickly or leaves the dragged element:
   - Element's `onMouseMove` won't fire
   - Drag will "break" or feel laggy
   - Window listeners ensure drag continues smoothly

   Always cleanup window listeners in useEffect return function!
   </details>

3. **How do you prevent text selection during drag?**
   <details>
   <summary>Answer</summary>

   ```css
   .draggable {
     user-select: none;
     -webkit-user-select: none;
   }
   ```

   Or in JavaScript:
   ```javascript
   const handleMouseDown = (e) => {
     e.preventDefault();  // Prevents text selection
     // ... drag logic
   };
   ```
   </details>

4. **What's the purpose of ctx.save() and ctx.restore()?**
   <details>
   <summary>Answer</summary>

   - **save()**: Saves current canvas state (transformations, styles)
   - **restore()**: Restores to last saved state

   Useful for isolated transformations:
   ```javascript
   ctx.save();
   ctx.rotate(45);      // Only affects drawing between save/restore
   ctx.drawImage(...);
   ctx.restore();       // Back to normal
   ```
   </details>

### Challenges

**Challenge 1: Implement Snap-to-Grid**

```javascript
const GRID_SIZE = 20;

const snapToGrid = (value) => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

const handleMouseMove = (e) => {
  if (!draggingSticker) return;

  let newX = e.clientX - rect.left - dragOffset.x;
  let newY = e.clientY - rect.top - dragOffset.y;

  // Snap to grid
  newX = snapToGrid(newX);
  newY = snapToGrid(newY);

  // Update sticker position
  updateStickerPosition(draggingSticker, newX, newY);
};

// Draw grid lines for visual feedback
const drawGrid = (ctx, canvas) => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};
```

**Challenge 2: Add Sticker Layering (Z-Index)**

```javascript
const [stickers, setStickers] = useState([]);

// Bring sticker to front when clicked
const bringToFront = (stickerId) => {
  setStickers(prevStickers => {
    const index = prevStickers.findIndex(s => s.id === stickerId);
    const sticker = prevStickers[index];

    // Remove from current position and add to end (top layer)
    const newStickers = [...prevStickers];
    newStickers.splice(index, 1);
    newStickers.push(sticker);

    return newStickers;
  });
};

// Send to back
const sendToBack = (stickerId) => {
  setStickers(prevStickers => {
    const index = prevStickers.findIndex(s => s.id === stickerId);
    const sticker = prevStickers[index];

    // Remove from current position and add to start (bottom layer)
    const newStickers = [...prevStickers];
    newStickers.splice(index, 1);
    newStickers.unshift(sticker);

    return newStickers;
  });
};

// Call bringToFront when user starts dragging
const handleMouseDown = (sticker, e) => {
  bringToFront(sticker.id);
  // ... rest of drag logic
};
```

**Challenge 3: Multi-Select Stickers**

```javascript
const [selectedStickers, setSelectedStickers] = useState([]);

const toggleStickerSelection = (stickerId, e) => {
  if (e.shiftKey) {
    // Multi-select with Shift key
    setSelectedStickers(prev =>
      prev.includes(stickerId)
        ? prev.filter(id => id !== stickerId)
        : [...prev, stickerId]
    );
  } else {
    // Single select
    setSelectedStickers([stickerId]);
  }
};

const moveSelectedStickers = (deltaX, deltaY) => {
  setStickers(prevStickers =>
    prevStickers.map(s =>
      selectedStickers.includes(s.id)
        ? { ...s, x: s.x + deltaX, y: s.y + deltaY }
        : s
    )
  );
};

// Delete all selected
const deleteSelected = () => {
  setStickers(prevStickers =>
    prevStickers.filter(s => !selectedStickers.includes(s.id))
  );
  setSelectedStickers([]);
};

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteSelected();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedStickers]);
```

## 🔗 Additional Resources

### Official Documentation
- [Mouse Events - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
- [Touch Events - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Canvas Text - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text)
- [Canvas Transformations - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations)

### Video Tutorials
- [Drag and Drop Tutorial](https://www.youtube.com/watch?v=C22hQKE_32c)
- [Canvas Drawing Tutorial](https://www.youtube.com/watch?v=83L6B13ixQ0)
- [Touch Events Explained](https://www.youtube.com/watch?v=TaPdgj8mucI)

### Interactive Learning
- [JavaScript Drag and Drop](https://www.w3schools.com/howto/howto_js_draggable.asp)
- [Canvas Examples](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

### Articles
- [Implementing Drag and Drop](https://javascript.info/mouse-drag-and-drop)
- [Touch vs Mouse Events](https://www.html5rocks.com/en/mobile/touchandmouse/)

## 🎯 Key Takeaways

Before moving to Level 6, make sure you understand:

✅ **Mouse Events** - mousedown, mousemove, mouseup
✅ **Touch Events** - touchstart, touchmove, touchend
✅ **Drag State** - Tracking dragging, position, offset
✅ **Canvas Coordinates** - Converting screen to canvas coordinates
✅ **Drawing Text** - Using ctx.fillText() for emoji
✅ **Transformations** - save(), restore(), translate(), rotate()
✅ **Event Listeners** - Adding/removing window listeners

## 🚀 Ready for Level 6?

Once you're comfortable with these concepts, proceed to **Level 6: AI Integration**, where you'll learn:

- Integrating Google Gemini API
- Making API requests with async/await
- Text generation for filter recommendations
- Error handling and loading states
- Environment variables for API keys

```bash
git add .
git commit -m "Complete Level 5: Stickers & Drag"
git checkout level-6-ai-text
```

---

**Need Help?**
- Review [Level 4](./README-LEVEL-4.md) if you need to refresh state management
- Test on both desktop (mouse) and mobile (touch) devices
- Check the [main README](../README.md) for troubleshooting

Happy stickering! 🎭
