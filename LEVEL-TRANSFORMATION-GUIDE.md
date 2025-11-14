# Level-by-Level Transformation Guide

## Overview
This document provides detailed instructions for transforming each remaining level branch (3-8) from complete production code to learning exercises with TODOs.

## Pattern Established (Levels 1-2)

### Success Criteria
1. ✅ App runs without errors (`npm start` works)
2. ✅ Code simplified to focus on level-specific concepts
3. ✅ Clear TODOs with hints (not complete solutions)
4. ✅ Educational comments explaining "why" not just "how"
5. ✅ Progressive - each level builds on previous completed levels
6. ✅ Maintains professional code structure
7. ✅ Comprehensive but focused CSS

### File Structure
Each level needs:
- `src/App.js` - Simplified component with TODOs
- `src/App.css` - Focused styling for that level's features
- Existing `docs/README-LEVEL-N.md` (already exists, no changes needed)

## Level 3: Filters & Effects

### Learning Objectives
- Dynamic CSS filter application
- Filter intensity control with range slider
- Combining multiple CSS filters
- Creating custom filter presets

### What to Keep from Level 2
- ✅ Working webcam with camera toggle
- ✅ Video rendering to canvas
- ✅ Basic filter selection

### New Features to Add (with TODOs)
1. **TODO 1: Add filter intensity state and slider**
   ```javascript
   // TODO 1: Add state for filter intensity (0-100)
   // HINT: const [filterIntensity, setFilterIntensity] = useState(100);
   ```

2. **TODO 2: Apply intensity to filters**
   ```javascript
   // TODO 2: Modify getFilterCSS to accept intensity parameter
   // HINT: Use calc() or template literals to adjust filter values
   // Example: `grayscale(${intensity}%)`
   ```

3. **TODO 3: Add intensity slider UI**
   ```jsx
   // TODO 3: Add range input for intensity control
   // HINT: <input type="range" min="0" max="100" value={filterIntensity} />
   ```

4. **BONUS TODO: Create custom filter**
   ```javascript
   // BONUS: Add your own custom filter to the filters array
   // Example: { id: 'custom', name: 'My Filter', filter: '...' }
   ```

### Key Code Sections
- Filter intensity state management
- Dynamic CSS filter value calculation
- Range slider control
- Real-time filter preview

### Approximate Size
- App.js: ~400-450 lines
- App.css: Similar to Level 2 + slider styles

---

## Level 4: Photo Capture

### Learning Objectives
- Canvas toDataURL() method
- Blob API and file downloads
- Photo state management (array operations)
- Creating download links programmatically

### What to Keep from Level 3
- ✅ Everything from Levels 1-3
- ✅ Working webcam with filters and intensity

### New Features to Add (with TODOs)
1. **TODO 1: Add photos state**
   ```javascript
   // TODO 1: Add state for captured photos array
   // HINT: const [photos, setPhotos] = useState([]);
   ```

2. **TODO 2: Implement capturePhoto**
   ```javascript
   // TODO 2: Capture current canvas as image
   // HINT: Use canvas.toDataURL('image/png')
   // Create photo object: { id, dataURL, filter, timestamp }
   // Add to photos array: setPhotos(prev => [...prev, newPhoto])
   ```

3. **TODO 3: Implement downloadPhoto**
   ```javascript
   // TODO 3: Create download link for photo
   // HINT: Create <a> element with download attribute
   // Set href to photo.dataURL
   // Programmatically click it: link.click()
   ```

4. **TODO 4: Implement deletePhoto**
   ```javascript
   // TODO 4: Remove photo from array
   // HINT: setPhotos(prev => prev.filter(p => p.id !== photoId))
   ```

### UI Components to Add
- Capture button (camera icon)
- Photo gallery grid
- Download button per photo
- Delete button per photo
- Photo counter display

### Approximate Size
- App.js: ~550-600 lines
- App.css: Level 3 + photo gallery styles

---

## Level 5: Stickers & Drag-and-Drop

### Learning Objectives
- Drag and Drop API
- Mouse and touch event handling
- Coordinate transformations
- Array state management for stickers

### What to Keep from Level 4
- ✅ Everything from Levels 1-4
- ✅ Working photo capture

### New Features to Add (with TODOs)
1. **TODO 1: Add stickers state**
   ```javascript
   // TODO 1: Add state for placed stickers
   // HINT: const [placedStickers, setPlacedStickers] = useState([]);
   // Each sticker: { id, emoji, x, y, size, rotation }
   ```

2. **TODO 2: Implement addSticker**
   ```javascript
   // TODO 2: Add new sticker to canvas
   // HINT: Create sticker object with default position (center)
   // Add to placedStickers array
   ```

3. **TODO 3: Draw stickers on canvas**
   ```javascript
   // TODO 3: In renderFrame, draw all stickers after video
   // HINT: Loop through placedStickers
   // Use ctx.fillText(sticker.emoji, x, y)
   // Apply transformations for rotation
   ```

4. **TODO 4: Implement drag handlers**
   ```javascript
   // TODO 4a: onMouseDown - detect which sticker was clicked
   // TODO 4b: onMouseMove - update sticker position
   // TODO 4c: onMouseUp - finish dragging
   // LEARNING: Calculate relative positions, handle touch events
   ```

5. **TODO 5: Implement removeSticker**
   ```javascript
   // TODO 5: Remove sticker from array
   // HINT: Filter out by sticker.id
   ```

### UI Components to Add
- Sticker picker panel
- Sticker categories (animals, accessories, expressions)
- Draggable sticker overlay
- Delete button per sticker

### Approximate Size
- App.js: ~750-800 lines
- App.css: Level 4 + sticker overlay and picker styles

---

## Level 6: AI Integration (Text)

### Learning Objectives
- Environment variables (.env files)
- API key security
- Async/await for API calls
- Google Gemini AI API basics
- Error handling with try/catch

### What to Keep from Level 5
- ✅ Everything from Levels 1-5
- ✅ Full working app

### New Features to Add (with TODOs)
1. **TODO 1: Load API key from environment**
   ```javascript
   // TODO 1: Load Gemini API key from .env
   // HINT: Use useEffect to check process.env.REACT_APP_GEMINI_API_KEY
   // Store in geminiKey state
   ```

2. **TODO 2: Implement getFilterRecommendation**
   ```javascript
   // TODO 2: Get AI recommendation for best filter
   // HINT: Initialize GoogleGenerativeAI with API key
   // const genAI = new GoogleGenerativeAI(geminiKey);
   // Get model: gemini-2.5-flash
   // Build prompt with time of day and available filters
   // await model.generateContent(prompt)
   ```

3. **TODO 3: Create getTimeOfDay helper**
   ```javascript
   // TODO 3: Return time of day based on hour
   // HINT: const hour = new Date().getHours();
   // Return 'morning', 'afternoon', 'evening', or 'night'
   ```

4. **TODO 4: Apply recommended filter**
   ```javascript
   // TODO 4: Parse AI response and set active filter
   // HINT: Extract filter name from response text
   // Find matching filter in filters array
   // Call handleFilterClick with filter ID
   ```

### UI Components to Add
- API key status indicator
- "Get AI Recommendation" button
- Loading state during AI processing
- Recommendation display area
- Setup instructions if no API key

### Dependencies
- `@google/generative-ai` package (already in package.json)

### Approximate Size
- App.js: ~900-950 lines
- App.css: Level 5 + AI panel styles

---

## Level 7: AI Vision

### Learning Objectives
- Multimodal AI (text + image)
- Base64 image encoding
- Canvas image extraction
- Structured AI prompting
- Parsing structured AI responses

### What to Keep from Level 6
- ✅ Everything from Levels 1-6
- ✅ Working AI text integration

### New Features to Add (with TODOs)
1. **TODO 1: Implement captureForAnalysis**
   ```javascript
   // TODO 1: Capture canvas as base64 for AI
   // HINT: canvas.toDataURL('image/jpeg', 0.7)
   // Extract base64 part: dataURL.split(',')[1]
   ```

2. **TODO 2: Implement analyzeSkin**
   ```javascript
   // TODO 2: Send image to Gemini Vision API
   // HINT: Use model.generateContent with both prompt and image
   // Image format: { inlineData: { mimeType: 'image/jpeg', data: base64 } }
   // Ask for: skin type, tone, recommended filters, reasoning
   ```

3. **TODO 3: Implement parseAnalysis**
   ```javascript
   // TODO 3: Parse structured text response
   // HINT: Split by lines, look for "Skin Type:", "Tone:", etc.
   // Extract data into object
   // Return { skinType, tone, recommendedFilters, reasoning }
   ```

4. **TODO 4: Display analysis results**
   ```jsx
   // TODO 4: Show analysis in UI
   // HINT: Display skin type, tone, recommendations
   // Add "Apply Recommendation" button
   ```

### UI Components to Add
- "Analyze Skin" button
- Analysis progress indicator
- Analysis results panel with sections
- Apply recommendation button

### Approximate Size
- App.js: ~1050-1100 lines
- App.css: Level 6 + analysis panel styles

---

## Level 8: Face Detection

### Learning Objectives
- TensorFlow.js basics
- Loading ML models
- Face-API.js library
- Real-time face detection
- Facial landmarks (68 points)
- Expression recognition
- Performance optimization

### What to Keep from Level 7
- ✅ Everything from Levels 1-7
- ✅ Complete working app

### New Features to Add (with TODOs)
1. **TODO 1: Load face detection models**
   ```javascript
   // TODO 1: Load TensorFlow models in useEffect
   // HINT: const MODEL_URL = process.env.PUBLIC_URL + '/models';
   // await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
   // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
   // await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
   ```

2. **TODO 2: Implement face detection loop**
   ```javascript
   // TODO 2: Separate detection loop from rendering
   // HINT: Run detection every 100ms (not every frame)
   // Use faceapi.detectAllFaces(video, options)
   // .withFaceLandmarks()
   // .withFaceExpressions()
   // Store results in state
   ```

3. **TODO 3: Draw face detections**
   ```javascript
   // TODO 3: In renderFrame, draw detection results
   // HINT: Loop through detections
   // Draw bounding box: ctx.strokeRect(x, y, width, height)
   // Draw landmarks: ctx.fillRect(x, y, 2, 2) for each point
   // Display confidence percentage
   ```

4. **TODO 4: Implement getDominantExpression**
   ```javascript
   // TODO 4: Find emotion with highest value
   // HINT: Object.keys(expressions).reduce((a, b) => 
   //         expressions[a] > expressions[b] ? a : b)
   ```

5. **TODO 5: Add expression emoji overlay**
   ```javascript
   // TODO 5: Show emoji for detected emotion
   // HINT: Create emotionEmojis map: { happy: '😊', sad: '😢', ... }
   // Display dominant emotion emoji near face
   ```

### UI Components to Add
- "Enable Face Detection" toggle
- Detection status indicator
- Face count display
- Bounding box toggle
- Landmarks toggle
- Expression overlay toggle
- Performance metrics (FPS, detection time)

### Dependencies
- `@vladmandic/face-api` package (already in package.json)
- Model files in `public/models/` (already exist)

### Approximate Size
- App.js: ~1200-1300 lines (still much smaller than original 1880)
- App.css: Level 7 + face detection controls styles

---

## Implementation Strategy

### Option A: Manual (Current Approach)
1. Checkout each level branch
2. Create simplified App.js with TODOs
3. Create matching CSS
4. Test with npm start
5. Commit and document

**Time:** ~2-3 hours per level × 6 levels = 12-18 hours

### Option B: Scripted Approach
1. Create templates for each level
2. Use script to generate App.js files
3. Manual review and testing
4. Commit in batch

**Time:** ~8-10 hours (faster but less custom)

### Option C: Hybrid (Recommended)
1. Use Levels 1-2 as reference
2. Create Level 3-4 manually (2-3 hours each)
3. Create template script for Levels 5-8
4. Manual testing and refinement

**Time:** ~10-12 hours

## Testing Checklist

For each completed level:
- [ ] `npm install` works
- [ ] `npm start` runs without errors
- [ ] All TODOs are clearly marked
- [ ] Hints are helpful but not complete solutions
- [ ] Educational comments explain concepts
- [ ] Code is simplified from original
- [ ] CSS is focused and clean
- [ ] Level builds on previous levels
- [ ] Matches corresponding documentation in docs/README-LEVEL-N.md

## Pushing Branches

After completing transformations:

```bash
# Push all at once
git push origin level-1-basics level-2-webcam level-3-filters level-4-photos level-5-stickers level-6-ai-text level-7-ai-vision level-8-face-detection

# Or use the helper script
./push-level-branches.sh
```

## Quality Assurance

### Code Review Points
1. Are TODOs actionable and clear?
2. Do hints guide without spoiling?
3. Is complexity appropriate for level?
4. Are imports minimal (only what's needed)?
5. Are comments educational, not just descriptive?
6. Does each level have a clear "aha!" moment?
7. Can students realistically complete in stated time?

### Student Experience
1. Can a beginner follow Level 1?
2. Is progression logical and not too steep?
3. Are error messages helpful?
4. Is there enough scaffolding?
5. Are success states clear (how do they know it works)?

## Success Metrics

When all 8 levels are complete:

1. ✅ All level branches contain learning exercises (not complete code)
2. ✅ Solution branches remain complete (reference implementations)
3. ✅ Main branch remains complete (production code)
4. ✅ Each level is progressively more complex
5. ✅ Documentation in docs/ matches code structure
6. ✅ Repository works as promised in README.md
7. ✅ Students can complete "hands-on learning" path
8. ✅ All branches tested and functional

## Estimated Completion

**Current Status:** 2 of 8 levels complete (25%)

**Remaining Work:**
- Level 3: 2-3 hours
- Level 4: 2-3 hours  
- Level 5: 3-4 hours (drag-drop complexity)
- Level 6: 2-3 hours
- Level 7: 2-3 hours
- Level 8: 3-4 hours (TensorFlow setup)

**Total:** 14-20 hours

**With efficiency improvements:** 10-14 hours

## Next Action

Continue with Level 3 transformation following the detailed guide above.
