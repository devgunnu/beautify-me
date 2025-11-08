# Level 4: Photo Capture 📸

**Duration:** 1-2 hours
**Difficulty:** 🟡 Intermediate
**Prerequisites:** Level 1-3 completed (React Basics, Webcam & Canvas, Filters)

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Capture still frames from canvas
- ✅ Convert canvas to image formats (data URL, blob)
- ✅ Manage an array of photos in state
- ✅ Create a photo gallery UI
- ✅ Download images to the user's device
- ✅ Delete photos from the gallery
- ✅ Understand base64 encoding and data URLs

## 🎓 What You'll Build

In this level, you'll add **photo capture functionality**:

- Capture button to take snapshots
- Photo gallery displaying captured images
- Download individual photos
- Delete unwanted photos
- Photo counter and gallery management
- Thumbnail previews with filters applied

## 🏗️ Concepts Covered

### 1. Canvas to Image Conversion

The canvas element can be converted to images in two formats:

#### Data URL (Base64)

A **data URL** is a string representation of an image:

```javascript
const canvas = canvasRef.current;

// Convert canvas to data URL (PNG by default)
const dataURL = canvas.toDataURL();
// Result: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

// Specify format and quality
const jpegURL = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
const pngURL = canvas.toDataURL('image/png');
```

**Data URL Structure:**
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
│    │         │       │
│    │         │       └─ Base64-encoded image data
│    │         └───────── Encoding type
│    └─────────────────── MIME type
└──────────────────────── Protocol
```

**Pros:**
- Easy to store in state/localStorage
- Can be used directly in `<img src="...">`
- Simple to work with

**Cons:**
- Larger file size (~33% bigger than binary)
- Not ideal for large images
- Takes up memory when stored

#### Blob (Binary Large Object)

A **Blob** is binary image data, more efficient for large files:

```javascript
canvas.toBlob((blob) => {
  // blob is a File-like object
  const url = URL.createObjectURL(blob);

  // Use the URL
  img.src = url;

  // Clean up when done (important!)
  URL.revokeObjectURL(url);
}, 'image/png', 1.0);
```

**Pros:**
- Smaller size (no base64 overhead)
- Better for large images
- Can be uploaded to servers easily

**Cons:**
- More complex to work with
- Requires cleanup (revokeObjectURL)
- Can't be stored in localStorage directly

### 2. Downloading Files

To download an image to the user's device:

```javascript
const downloadImage = (dataURL, filename) => {
  // Create a temporary link element
  const link = document.createElement('a');

  // Set download attribute and URL
  link.download = filename;
  link.href = dataURL;

  // Programmatically click the link
  link.click();

  // Clean up (optional, browser handles it)
  link.remove();
};

// Usage
const dataURL = canvas.toDataURL('image/png');
downloadImage(dataURL, `photo-${Date.now()}.png`);
```

**How it works:**
1. Create an `<a>` element with `download` attribute
2. Set `href` to the image data URL
3. Programmatically click it to trigger download
4. Browser saves the file to Downloads folder

### 3. Managing Photo State

Store photos in an array using React state:

```javascript
const [photos, setPhotos] = useState([]);

// Capture a new photo
const capturePhoto = () => {
  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL('image/png');

  // Create photo object
  const newPhoto = {
    id: Date.now(), // Unique ID
    dataURL: dataURL,
    timestamp: new Date().toISOString(),
    filter: activeFilter
  };

  // Add to photos array (immutable update)
  setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
};

// Delete a photo
const deletePhoto = (photoId) => {
  setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
};
```

**Key Principles:**
- Each photo needs a **unique ID** (timestamp works well)
- Use **immutable updates** (`[...prevPhotos, newPhoto]` not `photos.push()`)
- Store metadata (timestamp, filter name) for reference

### 4. Photo Gallery UI

Display photos in a grid:

```javascript
function PhotoGallery({ photos, onDelete, onDownload }) {
  if (photos.length === 0) {
    return <p className="empty-message">No photos yet. Start capturing!</p>;
  }

  return (
    <div className="photo-gallery">
      {photos.map(photo => (
        <div key={photo.id} className="photo-item">
          <img
            src={photo.dataURL}
            alt={`Captured at ${photo.timestamp}`}
            className="photo-thumbnail"
          />

          <div className="photo-actions">
            <button onClick={() => onDownload(photo)}>
              ⬇️ Download
            </button>
            <button onClick={() => onDelete(photo.id)}>
              🗑️ Delete
            </button>
          </div>

          <span className="photo-filter">{photo.filter}</span>
        </div>
      ))}
    </div>
  );
}
```

**CSS Grid Layout:**
```css
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.photo-item {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
```

### 5. Image Formats and Quality

Choose the right format for your needs:

#### PNG (Portable Network Graphics)
```javascript
canvas.toDataURL('image/png');
```

**Pros:**
- Lossless compression (no quality loss)
- Supports transparency
- Best for graphics, screenshots

**Cons:**
- Larger file sizes
- Slower to encode

#### JPEG (Joint Photographic Experts Group)
```javascript
canvas.toDataURL('image/jpeg', 0.9); // 90% quality
```

**Pros:**
- Smaller file sizes
- Faster to encode
- Best for photos

**Cons:**
- Lossy compression (quality loss)
- No transparency support
- Quality parameter: 0.0 (worst) to 1.0 (best)

#### WebP (Modern Format)
```javascript
canvas.toDataURL('image/webp', 0.9);
```

**Pros:**
- Best compression (smallest files)
- Supports transparency
- Lossy or lossless

**Cons:**
- Limited browser support (older browsers)

### 6. Timestamps and Formatting

Format timestamps for better UX:

```javascript
const formatTimestamp = (isoString) => {
  const date = new Date(isoString);

  // Locale-aware formatting
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Usage
const photo = {
  timestamp: new Date().toISOString(),
  // ...
};

console.log(formatTimestamp(photo.timestamp));
// Output: "Jan 15, 02:30 PM"
```

**Filename with timestamp:**
```javascript
const filename = `beautify-me-${Date.now()}.png`;
// Result: "beautify-me-1705345678901.png"
```

## 💻 Implementation Guide

### Step 1: Understanding the Capture Function

Open `src/App.js` and locate the `capturePhoto` function:

```javascript
const capturePhoto = () => {
  // TODO: Get canvas reference
  const canvas = canvasRef.current;

  if (!canvas) {
    console.error('Canvas not available');
    return;
  }

  // TODO: Convert canvas to data URL
  const dataURL = canvas.toDataURL('image/png');

  // TODO: Create photo object with metadata
  const newPhoto = {
    id: Date.now(),
    dataURL: dataURL,
    timestamp: new Date().toISOString(),
    filter: activeFilter
  };

  // TODO: Add to photos array
  setPhotos(prevPhotos => [...prevPhotos, newPhoto]);

  // TODO: Show success feedback
  console.log('Photo captured!');
};
```

**Your Task:**
1. Find the capturePhoto function
2. Understand how it converts canvas to data URL
3. See how the photo object is structured
4. Test capturing photos with different filters

### Step 2: Building the Photo Gallery

Find the photo gallery rendering code:

```javascript
{mode === 'photos' && (
  <div className="photos-section">
    <h2>Captured Photos ({photos.length})</h2>

    {photos.length === 0 ? (
      <p className="empty-state">
        No photos yet. Switch to Webcam mode and capture some!
      </p>
    ) : (
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-card">
            {/* TODO: Render photo thumbnail */}
            {/* TODO: Add download button */}
            {/* TODO: Add delete button */}
          </div>
        ))}
      </div>
    )}
  </div>
)}
```

**Your Task:**
1. Locate the photo gallery section
2. Implement the photo card rendering
3. Add download and delete buttons
4. Style the grid layout

### Step 3: Implementing Download Function

```javascript
const downloadPhoto = (photo) => {
  // TODO: Create download link
  const link = document.createElement('a');

  // TODO: Set filename with timestamp
  const filename = `beautify-me-${photo.id}.png`;
  link.download = filename;

  // TODO: Set image data
  link.href = photo.dataURL;

  // TODO: Trigger download
  link.click();

  // TODO: Show success message
  console.log(`Downloaded: ${filename}`);
};
```

**Your Task:**
1. Complete the download function
2. Add it to the download button's onClick
3. Test downloading photos

### Step 4: Implementing Delete Function

```javascript
const deletePhoto = (photoId) => {
  // TODO: Filter out the photo with matching ID
  setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));

  // TODO: Show confirmation (optional)
  console.log(`Deleted photo ${photoId}`);
};
```

**Your Task:**
1. Complete the delete function
2. Add confirmation dialog (optional)
3. Test deleting photos

### Step 5: Practice Tasks

#### Task 1: Add "Delete All" Button

```javascript
const deleteAllPhotos = () => {
  // Confirm before deleting
  const confirmed = window.confirm(
    `Delete all ${photos.length} photos? This cannot be undone.`
  );

  if (confirmed) {
    setPhotos([]);
    console.log('All photos deleted');
  }
};

// UI
<button
  onClick={deleteAllPhotos}
  className="delete-all-button"
  disabled={photos.length === 0}
>
  🗑️ Delete All ({photos.length})
</button>
```

#### Task 2: Add Photo Counter Badge

```javascript
// Show photo count in header
<button
  onClick={() => setMode('photos')}
  className={`mode-button ${mode === 'photos' ? 'active' : ''}`}
>
  📸 Photos
  {photos.length > 0 && (
    <span className="photo-count-badge">
      {photos.length}
    </span>
  )}
</button>

// CSS
.photo-count-badge {
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.75rem;
  margin-left: 8px;
}
```

#### Task 3: Add Photo Preview Modal

```javascript
const [previewPhoto, setPreviewPhoto] = useState(null);

const PhotoPreviewModal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <img src={photo.dataURL} alt="Preview" className="preview-image" />

        <div className="photo-info">
          <p>Filter: {photo.filter}</p>
          <p>Captured: {formatTimestamp(photo.timestamp)}</p>
        </div>

        <div className="modal-actions">
          <button onClick={() => downloadPhoto(photo)}>Download</button>
          <button onClick={() => {
            deletePhoto(photo.id);
            onClose();
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Usage
<PhotoPreviewModal
  photo={previewPhoto}
  onClose={() => setPreviewPhoto(null)}
/>
```

#### Task 4: Add Format Selection

```javascript
const [imageFormat, setImageFormat] = useState('png');
const [imageQuality, setImageQuality] = useState(0.9);

const capturePhoto = () => {
  const canvas = canvasRef.current;

  let dataURL;
  if (imageFormat === 'jpeg') {
    dataURL = canvas.toDataURL('image/jpeg', imageQuality);
  } else if (imageFormat === 'webp') {
    dataURL = canvas.toDataURL('image/webp', imageQuality);
  } else {
    dataURL = canvas.toDataURL('image/png');
  }

  // ... rest of capture logic
};

// UI
<select value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}>
  <option value="png">PNG (Lossless)</option>
  <option value="jpeg">JPEG (Smaller)</option>
  <option value="webp">WebP (Modern)</option>
</select>

{imageFormat !== 'png' && (
  <input
    type="range"
    min="0.1"
    max="1.0"
    step="0.1"
    value={imageQuality}
    onChange={(e) => setImageQuality(parseFloat(e.target.value))}
  />
)}
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What's the difference between a data URL and a blob?**
   <details>
   <summary>Answer</summary>

   - **Data URL**: Base64-encoded string, larger size, easy to store, can be used directly in `<img src>`
   - **Blob**: Binary data, smaller size, requires `URL.createObjectURL()`, needs cleanup with `revokeObjectURL()`

   Use data URLs for convenience, blobs for efficiency with large images.
   </details>

2. **Why use `Date.now()` for photo IDs?**
   <details>
   <summary>Answer</summary>

   - Generates unique IDs (milliseconds since 1970)
   - Simple and fast (no libraries needed)
   - Can be used in filenames
   - Sortable chronologically

   Alternative: `crypto.randomUUID()` for truly unique IDs.
   </details>

3. **What does the quality parameter in `toDataURL` do?**
   <details>
   <summary>Answer</summary>

   Controls compression quality for lossy formats (JPEG, WebP):
   - `0.0` = Maximum compression, lowest quality, smallest file
   - `1.0` = Minimum compression, best quality, largest file
   - Default: `0.92` (good balance)

   **Doesn't affect PNG** (lossless format).
   </details>

4. **Why use immutable updates for the photos array?**
   <details>
   <summary>Answer</summary>

   ```javascript
   // ❌ Wrong - mutates state directly
   photos.push(newPhoto);
   setPhotos(photos);

   // ✅ Correct - creates new array
   setPhotos([...prevPhotos, newPhoto]);
   ```

   React only re-renders when it detects a new object. Mutating the existing array doesn't trigger re-render.
   </details>

### Challenges

**Challenge 1: Add Photo Editing**

Allow users to apply different filters to captured photos:

```javascript
const [editingPhoto, setEditingPhoto] = useState(null);

const EditPhotoModal = ({ photo, onSave, onClose }) => {
  const [editFilter, setEditFilter] = useState(photo.filter);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Draw photo to canvas with new filter
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.style.filter = filters.find(f => f.name === editFilter).filter;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = photo.dataURL;
  }, [editFilter, photo]);

  const handleSave = () => {
    const newDataURL = canvasRef.current.toDataURL('image/png');
    onSave(photo.id, newDataURL, editFilter);
    onClose();
  };

  return (
    <div className="edit-modal">
      <canvas ref={canvasRef} width={640} height={480} />

      <div className="filter-selector">
        {filters.map(filter => (
          <button
            key={filter.name}
            onClick={() => setEditFilter(filter.name)}
            className={editFilter === filter.name ? 'active' : ''}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <button onClick={handleSave}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
```

**Challenge 2: Add Photo Comparison Slider**

Compare original vs filtered photo:

```javascript
const PhotoComparison = ({ photo }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="comparison-container">
      <div className="before-image" style={{ width: `${sliderPosition}%` }}>
        <img src={photo.originalDataURL} alt="Before" />
      </div>

      <div className="after-image">
        <img src={photo.dataURL} alt="After" />
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(e.target.value)}
        className="comparison-slider"
      />
    </div>
  );
};
```

**Challenge 3: Add Photo Grid Export**

Create a collage of multiple photos:

```javascript
const exportPhotoGrid = (selectedPhotos) => {
  const gridCanvas = document.createElement('canvas');
  const ctx = gridCanvas.getContext('2d');

  // Calculate grid dimensions
  const cols = Math.ceil(Math.sqrt(selectedPhotos.length));
  const rows = Math.ceil(selectedPhotos.length / cols);

  const photoWidth = 640;
  const photoHeight = 480;

  gridCanvas.width = photoWidth * cols;
  gridCanvas.height = photoHeight * rows;

  // Draw each photo
  selectedPhotos.forEach((photo, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        col * photoWidth,
        row * photoHeight,
        photoWidth,
        photoHeight
      );

      // If last photo, export the grid
      if (index === selectedPhotos.length - 1) {
        const dataURL = gridCanvas.toDataURL('image/png');
        downloadImage(dataURL, `photo-grid-${Date.now()}.png`);
      }
    };
    img.src = photo.dataURL;
  });
};
```

## 🔗 Additional Resources

### Official Documentation
- [HTMLCanvasElement.toDataURL() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)
- [HTMLCanvasElement.toBlob() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [Data URLs - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)
- [File Download in JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement/download)

### Video Tutorials
- [Canvas to Image Conversion](https://www.youtube.com/watch?v=YMfvOu5VhP0)
- [Image Download in JavaScript](https://www.youtube.com/watch?v=eSj1DTSM_OA)

### Articles
- [Base64 Encoding Explained](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
- [Image Formats Comparison](https://web.dev/choose-the-right-image-format/)

## 🎯 Key Takeaways

Before moving to Level 5, make sure you understand:

✅ **Canvas to Image** - `toDataURL()` and `toBlob()` methods
✅ **Data URLs** - Base64-encoded image strings
✅ **Photo State** - Managing array of photos with unique IDs
✅ **Immutable Updates** - Using spread operator for state updates
✅ **File Download** - Programmatic download with `<a download>`
✅ **Image Formats** - PNG vs JPEG vs WebP
✅ **Gallery UI** - Grid layout and photo cards

## 🚀 Ready for Level 5?

Once you're comfortable with these concepts, proceed to **Level 5: Stickers & Drag**, where you'll learn:

- Adding draggable sticker overlays
- Handling mouse/touch events
- Implementing drag-and-drop
- Compositing stickers on canvas
- Creating interactive UI elements

```bash
git add .
git commit -m "Complete Level 4: Photo Capture"
git checkout level-5-stickers
```

---

**Need Help?**
- Review [Level 3](./README-LEVEL-3.md) if you need to refresh Filter concepts
- Experiment with different image formats and quality settings
- Check the [main README](../README.md) for troubleshooting

Happy capturing! 📸
