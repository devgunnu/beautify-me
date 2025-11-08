# Level 3: Filters & Effects 🎨

**Duration:** 2-3 hours
**Difficulty:** 🟡 Intermediate
**Prerequisites:** Level 1-2 completed (React Basics, Webcam & Canvas)

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Apply CSS filters to canvas elements
- ✅ Understand filter functions and composition
- ✅ Create custom visual effects
- ✅ Build an interactive filter selection UI
- ✅ Combine multiple filters for unique effects
- ✅ Optimize filter performance
- ✅ Understand color theory basics

## 🎓 What You'll Build

In this level, you'll add **20+ visual filters** to the app:

- CSS filter effects (grayscale, sepia, blur, etc.)
- Custom color transformations
- Vintage and retro effects
- Neon and cyberpunk styles
- Interactive filter preview gallery
- Real-time filter switching

## 🏗️ Concepts Covered

### 1. CSS Filters

CSS filters allow you to apply visual effects to elements using simple functions:

```css
/* Basic filters */
.filter-grayscale {
  filter: grayscale(100%);
}

.filter-sepia {
  filter: sepia(80%);
}

.filter-blur {
  filter: blur(5px);
}

/* Combine multiple filters */
.filter-vintage {
  filter: sepia(50%) contrast(120%) brightness(110%);
}
```

**Common CSS Filter Functions:**

| Filter | Description | Example |
|--------|-------------|---------|
| `grayscale(%)` | Remove color | `grayscale(100%)` |
| `sepia(%)` | Brown vintage tone | `sepia(80%)` |
| `blur(px)` | Gaussian blur | `blur(3px)` |
| `brightness(%)` | Lighten/darken | `brightness(120%)` |
| `contrast(%)` | Increase/decrease contrast | `contrast(150%)` |
| `saturate(%)` | Color intensity | `saturate(200%)` |
| `hue-rotate(deg)` | Shift colors | `hue-rotate(90deg)` |
| `invert(%)` | Invert colors | `invert(100%)` |
| `opacity(%)` | Transparency | `opacity(50%)` |

### 2. Applying Filters to Canvas

Two methods to apply filters to canvas:

#### Method 1: CSS Style (Easier)

```javascript
const canvasRef = useRef(null);

// Apply filter via style
canvasRef.current.style.filter = 'grayscale(100%) contrast(120%)';
```

**Pros:**
- Simple and fast
- No JavaScript computation
- GPU-accelerated
- Easy to combine filters

**Cons:**
- Limited to CSS filter functions
- Can't access/modify pixel data
- Less control over custom effects

#### Method 2: Canvas Filter Property (More Control)

```javascript
const ctx = canvas.getContext('2d');

// Set filter before drawing
ctx.filter = 'blur(5px) brightness(120%)';
ctx.drawImage(video, 0, 0);

// Reset filter
ctx.filter = 'none';
```

**Pros:**
- More control over when filters apply
- Can combine with custom pixel manipulation
- Better for complex effects

**Cons:**
- Slower than CSS style method
- Requires more code

### 3. Color Theory Basics

Understanding color helps create better filters:

#### RGB Color Model

Every pixel has three color channels (Red, Green, Blue):

```javascript
const imageData = ctx.getImageData(0, 0, width, height);
const pixels = imageData.data;

// Pixels are stored as [R, G, B, A, R, G, B, A, ...]
for (let i = 0; i < pixels.length; i += 4) {
  const red = pixels[i];       // 0-255
  const green = pixels[i + 1]; // 0-255
  const blue = pixels[i + 2];  // 0-255
  const alpha = pixels[i + 3]; // 0-255 (transparency)
}
```

#### Hue, Saturation, Lightness (HSL)

- **Hue**: Color itself (0-360°) - red, orange, yellow, green, blue, purple
- **Saturation**: Color intensity (0-100%) - gray to vivid
- **Lightness**: Brightness (0-100%) - black to white

```
Hue Wheel:
  0° = Red
 60° = Yellow
120° = Green
180° = Cyan
240° = Blue
300° = Magenta
```

### 4. Custom Filter Effects

#### Grayscale (Luminance Method)

Convert color to grayscale using weighted average:

```javascript
const toGrayscale = (imageData) => {
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Weighted average (matches human eye perception)
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    pixels[i] = gray;     // R
    pixels[i + 1] = gray; // G
    pixels[i + 2] = gray; // B
    // Alpha unchanged
  }

  return imageData;
};
```

**Why weighted?** Human eyes are more sensitive to green light than red or blue.

#### Sepia (Vintage Effect)

Create warm, brown-tinted vintage look:

```javascript
const toSepia = (imageData) => {
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    pixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    pixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    pixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }

  return imageData;
};
```

#### Brightness Adjustment

```javascript
const adjustBrightness = (imageData, amount) => {
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = Math.min(255, Math.max(0, pixels[i] + amount));
    pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + amount));
    pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + amount));
  }

  return imageData;
};
```

#### Contrast Adjustment

```javascript
const adjustContrast = (imageData, contrast) => {
  const pixels = imageData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = Math.min(255, Math.max(0, factor * (pixels[i] - 128) + 128));
    pixels[i + 1] = Math.min(255, Math.max(0, factor * (pixels[i + 1] - 128) + 128));
    pixels[i + 2] = Math.min(255, Math.max(0, factor * (pixels[i + 2] - 128) + 128));
  }

  return imageData;
};
```

### 5. Filter Composition

Combine multiple filters for unique effects:

```javascript
// Vintage effect = sepia + contrast + brightness
const vintageFilter = 'sepia(50%) contrast(120%) brightness(110%)';

// Cyberpunk effect = saturate + hue-rotate + contrast
const cyberpunkFilter = 'saturate(200%) hue-rotate(270deg) contrast(150%)';

// Neon effect = saturate + brightness + blur
const neonFilter = 'saturate(300%) brightness(130%) blur(0.5px)';
```

**Order matters!** Filters apply left to right:

```javascript
// Different results:
'blur(5px) brightness(150%)'  // Blur then brighten
'brightness(150%) blur(5px)'  // Brighten then blur
```

### 6. Filter Data Structure

Organize filters as objects for easy management:

```javascript
const filters = [
  {
    name: 'normal',
    label: '🔆 Normal',
    filter: 'none'
  },
  {
    name: 'grayscale',
    label: '⚫ Grayscale',
    filter: 'grayscale(100%)'
  },
  {
    name: 'sepia',
    label: '🟤 Sepia',
    filter: 'sepia(80%)'
  },
  {
    name: 'vintage',
    label: '📷 Vintage',
    filter: 'sepia(50%) contrast(120%) brightness(110%)'
  },
  {
    name: 'cyberpunk',
    label: '🌆 Cyberpunk',
    filter: 'saturate(200%) hue-rotate(270deg) contrast(150%)'
  }
];
```

## 💻 Implementation Guide

### Step 1: Understanding the Filter Data Structure

Open `src/App.js` and locate the filters array:

```javascript
const filters = [
  { name: 'normal', label: '🔆 Normal', filter: 'none' },
  { name: 'grayscale', label: '⚫ Grayscale', filter: 'grayscale(100%)' },
  { name: 'sepia', label: '🟤 Sepia', filter: 'sepia(80%)' },
  // ... more filters
];
```

**Your Task:**
1. Find all 20+ filters in the array
2. Identify the filter property (CSS filter string)
3. Understand how name, label, and filter relate

### Step 2: Applying Filters to Canvas

Find where filters are applied in the render loop:

```javascript
const renderFrame = () => {
  const canvas = canvasRef.current;
  const video = videoRef.current;
  const ctx = canvas.getContext('2d');

  // TODO: Find the active filter from the filters array
  const currentFilter = filters.find(f => f.name === activeFilter);

  // TODO: Apply the filter to the canvas
  if (currentFilter) {
    canvas.style.filter = currentFilter.filter;
  }

  // Draw video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  requestAnimationFrame(renderFrame);
};
```

**Your Task:**
1. Locate where `canvas.style.filter` is set
2. Test changing filters and see the effect
3. Try modifying filter values (e.g., `grayscale(50%)` instead of `100%`)

### Step 3: Building the Filter Selection UI

Find the filter buttons rendering code:

```javascript
<div className="filter-buttons">
  {filters.map((filter) => (
    <button
      key={filter.name}
      className={`filter-button ${activeFilter === filter.name ? 'active' : ''}`}
      onClick={() => setActiveFilter(filter.name)}
    >
      {filter.label}
    </button>
  ))}
</div>
```

**Your Task:**
1. Understand how the filter list is rendered
2. Find the onClick handler
3. See how `activeFilter` state controls which filter is active

### Step 4: Practice Tasks

#### Task 1: Create Your Own Filter

Add a custom filter to the array:

```javascript
const filters = [
  // ... existing filters
  {
    name: 'my-custom-filter',
    label: '✨ My Filter',
    filter: 'saturate(150%) brightness(110%) contrast(120%)'
  }
];
```

**Experiment with:**
- Different saturation levels
- Brightness adjustments
- Multiple filters combined
- Hue rotation for color shifts

#### Task 2: Add Filter Intensity Control

Create a slider to control filter intensity:

```javascript
const [filterIntensity, setFilterIntensity] = useState(100);

const applyFilter = () => {
  const currentFilter = filters.find(f => f.name === activeFilter);

  if (currentFilter.name === 'grayscale') {
    canvas.style.filter = `grayscale(${filterIntensity}%)`;
  } else if (currentFilter.name === 'sepia') {
    canvas.style.filter = `sepia(${filterIntensity * 0.8}%)`;
  }
  // ... handle other filters
};

// UI
<input
  type="range"
  min="0"
  max="100"
  value={filterIntensity}
  onChange={(e) => setFilterIntensity(e.target.value)}
/>
<span>{filterIntensity}%</span>
```

#### Task 3: Create Filter Presets with Descriptions

Add descriptions to help users understand each filter:

```javascript
const filters = [
  {
    name: 'vintage',
    label: '📷 Vintage',
    filter: 'sepia(50%) contrast(120%) brightness(110%)',
    description: 'Warm, nostalgic 1970s photo look'
  },
  {
    name: 'cyberpunk',
    label: '🌆 Cyberpunk',
    filter: 'saturate(200%) hue-rotate(270deg) contrast(150%)',
    description: 'Neon-soaked futuristic aesthetic'
  }
];

// Show description on hover
<button
  title={filter.description}
  onClick={() => setActiveFilter(filter.name)}
>
  {filter.label}
</button>
```

#### Task 4: Add Filter Categories

Organize filters into categories:

```javascript
const filterCategories = {
  basic: ['normal', 'grayscale', 'sepia', 'invert'],
  artistic: ['vintage', 'polaroid', 'kodachrome'],
  modern: ['cyberpunk', 'neon', 'vaporwave'],
  cool: ['cool', 'arctic', 'ocean']
};

const [activeCategory, setActiveCategory] = useState('basic');

// UI
<div className="filter-categories">
  {Object.keys(filterCategories).map(category => (
    <button
      key={category}
      onClick={() => setActiveCategory(category)}
      className={activeCategory === category ? 'active' : ''}
    >
      {category}
    </button>
  ))}
</div>

<div className="filter-buttons">
  {filters
    .filter(f => filterCategories[activeCategory].includes(f.name))
    .map(filter => (
      <button onClick={() => setActiveFilter(filter.name)}>
        {filter.label}
      </button>
    ))}
</div>
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What's the difference between applying filter via CSS vs Canvas?**
   <details>
   <summary>Answer</summary>

   - **CSS (`canvas.style.filter`)**: GPU-accelerated, applies to entire canvas, easier but less flexible
   - **Canvas (`ctx.filter`)**: More control, can combine with pixel manipulation, applies during drawing
   - Use CSS for simple effects, Canvas API for complex custom filters
   </details>

2. **Why does filter order matter?**
   <details>
   <summary>Answer</summary>

   Filters apply sequentially left to right:
   ```javascript
   'blur(5px) brightness(150%)' // Blur THEN brighten
   'brightness(150%) blur(5px)' // Brighten THEN blur (different result)
   ```

   Each filter operates on the output of the previous filter.
   </details>

3. **How do you create a grayscale effect?**
   <details>
   <summary>Answer</summary>

   Three methods:
   1. **CSS**: `filter: grayscale(100%)`
   2. **Simple average**: `(R + G + B) / 3`
   3. **Weighted (realistic)**: `0.299*R + 0.587*G + 0.114*B`

   Weighted is best because it matches human eye sensitivity.
   </details>

4. **What does `hue-rotate(90deg)` do?**
   <details>
   <summary>Answer</summary>

   Shifts all colors by 90° on the color wheel:
   - Red (0°) → Yellow (90°)
   - Yellow (60°) → Green (150°)
   - Green (120°) → Cyan (210°)
   - Blue (240°) → Red (330°)

   Useful for color theme variations without changing pixel values manually.
   </details>

### Challenges

**Challenge 1: Build a Filter Mixer**

Let users combine and adjust multiple filters:

```javascript
const [mixedFilter, setMixedFilter] = useState({
  grayscale: 0,
  sepia: 0,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100
});

const buildFilterString = () => {
  const parts = [];
  if (mixedFilter.grayscale > 0) parts.push(`grayscale(${mixedFilter.grayscale}%)`);
  if (mixedFilter.sepia > 0) parts.push(`sepia(${mixedFilter.sepia}%)`);
  if (mixedFilter.blur > 0) parts.push(`blur(${mixedFilter.blur}px)`);
  if (mixedFilter.brightness !== 100) parts.push(`brightness(${mixedFilter.brightness}%)`);
  if (mixedFilter.contrast !== 100) parts.push(`contrast(${mixedFilter.contrast}%)`);
  if (mixedFilter.saturate !== 100) parts.push(`saturate(${mixedFilter.saturate}%)`);

  return parts.join(' ');
};

// Apply mixed filter
canvas.style.filter = buildFilterString();

// UI sliders for each property
// TODO: Create range inputs for each filter property
```

**Challenge 2: Create a Pixel Art Effect**

```javascript
const pixelateCanvas = (canvas, pixelSize) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Temporarily reduce size
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, width / pixelSize, height / pixelSize);

  // Scale back up
  ctx.drawImage(
    canvas,
    0, 0, width / pixelSize, height / pixelSize,
    0, 0, width, height
  );
};

// Use in render loop
const [pixelSize, setPixelSize] = useState(1);

const renderFrame = () => {
  ctx.drawImage(video, 0, 0);

  if (pixelSize > 1) {
    pixelateCanvas(canvas, pixelSize);
  }
};

// UI
<input
  type="range"
  min="1"
  max="20"
  value={pixelSize}
  onChange={(e) => setPixelSize(parseInt(e.target.value))}
/>
```

**Challenge 3: Build an Instagram-Style Filter Gallery**

Create thumbnail previews of each filter:

```javascript
const FilterGallery = () => {
  const [selectedFilter, setSelectedFilter] = useState('normal');

  return (
    <div className="filter-gallery">
      {filters.map(filter => (
        <div
          key={filter.name}
          className={`filter-preview ${selectedFilter === filter.name ? 'selected' : ''}`}
          onClick={() => {
            setSelectedFilter(filter.name);
            setActiveFilter(filter.name);
          }}
        >
          <canvas
            className="preview-canvas"
            style={{ filter: filter.filter }}
          />
          <span className="filter-name">{filter.label}</span>
        </div>
      ))}
    </div>
  );
};

// TODO: Capture a still frame and render it to each preview canvas
```

## 🔗 Additional Resources

### Official Documentation
- [CSS filter Property - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [Canvas API Filters - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter)
- [Color Theory Basics](https://www.canva.com/colors/color-wheel/)

### Video Tutorials
- [CSS Filters Explained](https://www.youtube.com/watch?v=8XIYz_Kybx8)
- [Canvas Image Manipulation](https://www.youtube.com/watch?v=UoRZuGt2Kpc)
- [Creating Instagram Filters with JavaScript](https://www.youtube.com/watch?v=rFqF4LSyWEk)

### Interactive Learning
- [CSS Filter Playground](https://css-tricks.com/almanac/properties/f/filter/)
- [Canvas Filters Examples](https://codepen.io/search/pens?q=canvas+filter)

### Articles
- [Understanding Image Filters](https://www.smashingmagazine.com/2021/10/css-filter-effects/)
- [Color Science for Developers](https://www.learnui.design/blog/the-hsb-color-system-practicioners-primer.html)

## 🎯 Key Takeaways

Before moving to Level 4, make sure you understand:

✅ **CSS Filters** - grayscale, sepia, blur, brightness, contrast, saturate, hue-rotate
✅ **Filter Composition** - Combining multiple filters
✅ **Filter Application** - CSS style vs Canvas filter property
✅ **Color Theory** - RGB model and basic color manipulation
✅ **Filter Data Structure** - Organizing filters as objects
✅ **Performance** - CSS filters are GPU-accelerated
✅ **User Experience** - Real-time filter preview and selection

## 🚀 Ready for Level 4?

Once you're comfortable with these concepts, proceed to **Level 4: Photo Capture**, where you'll learn:

- Capturing still frames from video
- Converting canvas to images (base64, blob)
- Creating a photo gallery
- Downloading images to the user's device
- Managing photo state and storage

```bash
git add .
git commit -m "Complete Level 3: Filters & Effects"
git checkout level-4-photos
```

---

**Need Help?**
- Review [Level 2](./README-LEVEL-2.md) if you need to refresh Canvas concepts
- Experiment with filter values to see what works best
- Check the [main README](../README.md) for troubleshooting

Happy filtering! 🎨
