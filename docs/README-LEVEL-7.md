# Level 7: AI Vision 👁️

**Duration:** 2-3 hours
**Difficulty:** 🔴 Advanced
**Prerequisites:** Level 6 completed (AI Integration - Text)

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Send images to AI models
- ✅ Work with multimodal AI (text + vision)
- ✅ Convert canvas to base64 for API transmission
- ✅ Parse structured AI responses
- ✅ Build skin analysis features
- ✅ Create personalized recommendations
- ✅ Handle large data in API requests

## 🎓 What You'll Build

In this level, you'll add **AI-powered image analysis**:

- Skin analysis from webcam selfies
- Personalized filter recommendations
- AI insights about photo composition
- Detailed analysis results display
- Smart suggestions based on appearance

## 🏗️ Concepts Covered

### 1. Multimodal AI

**Multimodal** models can understand both text and images:

```javascript
// Text-only (Level 6)
const result = await model.generateContent('Describe this');

// Text + Image (Level 7)
const result = await model.generateContent([
  'Describe this image',
  { inlineData: { data: base64Image, mimeType: 'image/png' } }
]);
```

**Use Cases:**
- Image description
- Object detection
- Skin/appearance analysis
- Scene understanding
- Visual Q&A

### 2. Image Encoding for APIs

APIs require images in base64 format:

```javascript
// Get image from canvas
const canvas = canvasRef.current;
const dataURL = canvas.toDataURL('image/jpeg', 0.8);

// dataURL format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."

// Extract base64 part (remove prefix)
const base64 = dataURL.split(',')[1];

// Now send to API
const result = await model.generateContent([
  'Analyze this image',
  {
    inlineData: {
      data: base64,
      mimeType: 'image/jpeg'
    }
  }
]);
```

**Image Format Tips:**
- **JPEG** (0.6-0.8 quality): Smaller size, faster upload
- **PNG**: Better quality, larger size
- Resize large images before sending (640x480 is enough)

### 3. Structured Prompts for Vision

Guide the AI to give structured responses:

```javascript
const prompt = `
Analyze this selfie and provide skin analysis.

Respond in this EXACT format:

Skin Type: [oily/dry/combination/normal]
Tone: [fair/medium/tan/deep]
Recommended Filters: [filter1, filter2, filter3]
Reasoning: [1-2 sentences explaining why these filters work]

Available filters: ${filterNames}
`;

const result = await model.generateContent([
  prompt,
  { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
]);
```

**Benefits of structured prompts:**
- Easier to parse responses
- Consistent output format
- Better user experience
- Enables programmatic use

### 4. Parsing AI Vision Responses

Extract structured data from text responses:

```javascript
const parseAnalysis = (responseText) => {
  const lines = responseText.split('\n');

  const analysis = {
    skinType: '',
    tone: '',
    recommendedFilters: [],
    reasoning: ''
  };

  lines.forEach(line => {
    if (line.startsWith('Skin Type:')) {
      analysis.skinType = line.split(':')[1].trim();
    } else if (line.startsWith('Tone:')) {
      analysis.tone = line.split(':')[1].trim();
    } else if (line.startsWith('Recommended Filters:')) {
      const filtersText = line.split(':')[1].trim();
      analysis.recommendedFilters = filtersText
        .split(',')
        .map(f => f.trim());
    } else if (line.startsWith('Reasoning:')) {
      analysis.reasoning = line.split(':')[1].trim();
    }
  });

  return analysis;
};

// Usage
const responseText = result.response.text();
const analysis = parseAnalysis(responseText);

console.log('Skin type:', analysis.skinType);
console.log('Recommended:', analysis.recommendedFilters);
```

### 5. Image Size Optimization

Large images slow down API calls and cost more:

```javascript
const resizeCanvas = (sourceCanvas, maxWidth, maxHeight) => {
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  let { width, height } = sourceCanvas;

  // Calculate new dimensions while maintaining aspect ratio
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;
  }

  tempCanvas.width = width;
  tempCanvas.height = height;

  // Draw scaled image
  ctx.drawImage(sourceCanvas, 0, 0, width, height);

  return tempCanvas;
};

// Usage before API call
const optimizedCanvas = resizeCanvas(canvasRef.current, 640, 480);
const base64 = optimizedCanvas.toDataURL('image/jpeg', 0.7).split(',')[1];
```

**Optimization Tips:**
- Max resolution: 640x480 (sufficient for analysis)
- JPEG quality: 0.6-0.7 (good balance)
- Compress before sending
- Cache results to avoid repeat analysis

### 6. Loading States for Vision

Vision API calls take longer than text:

```javascript
const [analysisState, setAnalysisState] = useState({
  isAnalyzing: false,
  progress: '',
  result: null,
  error: null
});

const analyzeSkin = async () => {
  setAnalysisState({
    isAnalyzing: true,
    progress: 'Capturing image...',
    result: null,
    error: null
  });

  try {
    // Step 1: Capture
    const canvas = canvasRef.current;
    setAnalysisState(prev => ({ ...prev, progress: 'Preparing image...' }));

    // Step 2: Encode
    const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
    setAnalysisState(prev => ({ ...prev, progress: 'Sending to AI...' }));

    // Step 3: Send to API
    const result = await model.generateContent([prompt, imageData]);
    setAnalysisState(prev => ({ ...prev, progress: 'Analyzing...' }));

    // Step 4: Parse
    const analysis = parseAnalysis(result.response.text());

    setAnalysisState({
      isAnalyzing: false,
      progress: '',
      result: analysis,
      error: null
    });

  } catch (error) {
    setAnalysisState({
      isAnalyzing: false,
      progress: '',
      result: null,
      error: error.message
    });
  }
};

// UI
{analysisState.isAnalyzing && (
  <div className="analysis-progress">
    <div className="spinner" />
    <p>{analysisState.progress}</p>
  </div>
)}
```

### 7. Safety and Privacy

Be mindful when analyzing user images:

```javascript
const analyzeSkin = async () => {
  // Ask for consent
  const consent = window.confirm(
    'This will send your photo to Google Gemini AI for analysis. Continue?'
  );

  if (!consent) {
    return;
  }

  // Analyze...
};
```

**Privacy Best Practices:**
- ✅ Get user consent before sending images
- ✅ Don't store images on servers
- ✅ Clear data after analysis
- ✅ Inform users about data usage
- ✅ Use HTTPS for secure transmission

## 💻 Implementation Guide

### Step 1: Understanding the Vision API Flow

```javascript
const analyzeSkin = async () => {
  // 1. Get API key
  if (!geminiKey) {
    alert('Please add your Gemini API key');
    return;
  }

  // 2. Capture current frame
  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL('image/jpeg', 0.7);
  const base64Image = dataURL.split(',')[1];

  // 3. Build prompt
  const prompt = `
  Analyze this selfie for skin characteristics.

  Respond in this format:
  Skin Type: [oily/dry/combination/normal]
  Tone: [fair/medium/tan/deep]
  Recommended Filters: [filter1, filter2, filter3]
  Reasoning: [why these filters work]

  Available filters: ${filters.map(f => f.name).join(', ')}
  `;

  // 4. Send to Gemini
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg'
      }
    }
  ]);

  // 5. Parse response
  const responseText = result.response.text();
  const analysis = parseAnalysis(responseText);

  // 6. Display results
  setAnalysisResult(analysis);
};
```

**Your Task:**
1. Find the skin analysis function in App.js
2. Understand each step of the flow
3. Test with different lighting and poses
4. Observe the AI's recommendations

### Step 2: Building the Analysis UI

```javascript
<div className="ai-vision-section">
  <h3>🔍 AI Skin Analysis</h3>

  <button
    onClick={analyzeSkin}
    disabled={analysisState.isAnalyzing || !isCameraOn}
    className="analyze-button"
  >
    {analysisState.isAnalyzing ? (
      <>⏳ {analysisState.progress}</>
    ) : (
      <>🎯 Analyze & Get Personalized Filters</>
    )}
  </button>

  {analysisState.result && (
    <div className="analysis-results">
      <div className="result-item">
        <strong>Skin Type:</strong>
        <span>{analysisState.result.skinType}</span>
      </div>

      <div className="result-item">
        <strong>Tone:</strong>
        <span>{analysisState.result.tone}</span>
      </div>

      <div className="result-item">
        <strong>Recommended Filters:</strong>
        <div className="recommended-filters">
          {analysisState.result.recommendedFilters.map(filterName => (
            <button
              key={filterName}
              onClick={() => setActiveFilter(filterName)}
              className="recommended-filter-button"
            >
              {filterName}
            </button>
          ))}
        </div>
      </div>

      <div className="result-item">
        <strong>Why:</strong>
        <p>{analysisState.result.reasoning}</p>
      </div>
    </div>
  )}

  {analysisState.error && (
    <div className="error-message">
      ⚠️ {analysisState.error}
    </div>
  )}
</div>
```

### Step 3: Practice Tasks

#### Task 1: Add Composition Analysis

```javascript
const analyzeComposition = async () => {
  const prompt = `
  Analyze this photo's composition and provide feedback.

  Evaluate:
  1. Lighting (good/poor)
  2. Framing (well-framed/needs adjustment)
  3. Background (clean/cluttered)
  4. Suggested improvement (1 tip)

  Format:
  Lighting: [rating]
  Framing: [rating]
  Background: [rating]
  Tip: [improvement suggestion]
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
  ]);

  return result.response.text();
};
```

#### Task 2: Add Object Detection

```javascript
const detectObjects = async () => {
  const prompt = `
  List all objects visible in this image.

  Format as comma-separated list.
  Example: "person, laptop, coffee mug, window"

  Only list objects, no descriptions.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
  ]);

  const objects = result.response.text().split(',').map(o => o.trim());
  return objects;
};

// Use for automatic sticker suggestions
const suggestStickers = (objects) => {
  const stickerMap = {
    'coffee': '☕',
    'laptop': '💻',
    'book': '📚',
    'plant': '🌱',
    'sunset': '🌅'
  };

  return objects
    .map(obj => stickerMap[obj.toLowerCase()])
    .filter(Boolean);
};
```

#### Task 3: Add Comparison Mode

```javascript
const [beforeImage, setBeforeImage] = useState(null);

const captureBeforeImage = () => {
  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL('image/jpeg', 0.7);
  setBeforeImage(dataURL);
};

const compareBeforeAfter = async () => {
  if (!beforeImage) {
    alert('Capture a "before" image first');
    return;
  }

  const afterCanvas = canvasRef.current;
  const afterImage = afterCanvas.toDataURL('image/jpeg', 0.7);

  const prompt = `
  Compare these two selfies (before and after).

  Identify what changed:
  - Lighting differences
  - Filter applied
  - Composition changes
  - Overall improvement

  Provide brief comparison (2-3 sentences).
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: beforeImage.split(',')[1], mimeType: 'image/jpeg' } },
    'After:',
    { inlineData: { data: afterImage.split(',')[1], mimeType: 'image/jpeg' } }
  ]);

  return result.response.text();
};
```

#### Task 4: Add Accessibility Descriptions

```javascript
const generateAltText = async () => {
  const prompt = `
  Generate a concise accessibility description (alt text) for this image.

  Include:
  - Main subject
  - Actions/expressions
  - Setting/background
  - Colors/lighting

  Keep it under 125 characters.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
  ]);

  return result.response.text();
};

// Auto-add to photos
const capturePhoto = async () => {
  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL('image/png');

  // Generate alt text
  const altText = await generateAltText();

  const newPhoto = {
    id: Date.now(),
    dataURL,
    altText,  // For accessibility
    timestamp: new Date().toISOString()
  };

  setPhotos(prev => [...prev, newPhoto]);
};
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What's the difference between text and vision AI models?**
   <details>
   <summary>Answer</summary>

   - **Text models**: Process only text input/output
   - **Vision models (multimodal)**: Process text + images together

   Vision models can:
   - Describe images
   - Answer questions about images
   - Detect objects/people
   - Analyze visual characteristics

   Use vision when you need image understanding.
   </details>

2. **Why convert images to base64?**
   <details>
   <summary>Answer</summary>

   - Base64 is text representation of binary data
   - APIs expect JSON (text format)
   - Base64 allows embedding images in JSON
   - Easy to transmit over HTTP

   Format: `data:image/jpeg;base64,/9j/4AAQ...`
   </details>

3. **How do you optimize image size for API calls?**
   <details>
   <summary>Answer</summary>

   1. **Resize**: Max 640x480 (enough for analysis)
   2. **Compress**: JPEG quality 0.6-0.7
   3. **Format**: JPEG instead of PNG (smaller)
   4. **Remove unnecessary data**: Just send base64, not full data URL

   Smaller images = faster upload + lower cost!
   </details>

4. **Why use structured prompts for vision?**
   <details>
   <summary>Answer</summary>

   Structured prompts ensure:
   - Consistent response format
   - Easy parsing with code
   - Predictable output
   - Better UX

   Example: "Skin Type: oily" is easier to parse than "The user has oily skin."
   </details>

### Challenges

**Challenge 1: Build a Photo Critic**

```javascript
const critiquePhoto = async () => {
  const prompt = `
  You are a professional photographer critiquing this photo.

  Rate (1-10):
  - Composition: [score]/10
  - Lighting: [score]/10
  - Colors: [score]/10
  - Overall: [score]/10

  Strengths: [2-3 bullet points]
  Improvements: [2-3 bullet points]

  Be constructive and specific.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
  ]);

  return result.response.text();
};
```

**Challenge 2: Mood Detection**

```javascript
const detectMood = async () => {
  const prompt = `
  Analyze the mood/emotion in this photo.

  Detected Mood: [emotion]
  Confidence: [high/medium/low]
  Supporting Details: [what you see]

  Emotions: happy, sad, neutral, excited, calm, energetic, etc.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
  ]);

  const mood = parseMoodResponse(result.response.text());

  // Auto-apply mood-matching filter
  const moodFilters = {
    'happy': 'vintage',
    'energetic': 'neon',
    'calm': 'cool',
    'sad': 'grayscale'
  };

  if (moodFilters[mood]) {
    setActiveFilter(moodFilters[mood]);
  }
};
```

**Challenge 3: Multi-Face Analysis**

```javascript
const analyzeMultipleFaces = async () => {
  const prompt = `
  Analyze all faces in this image.

  For each person, provide:
  - Position (left/center/right)
  - Approximate age range
  - Suggested filter for their skin tone

  Format:
  Person 1: [position], [age], recommended: [filter]
  Person 2: [position], [age], recommended: [filter]
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
  ]);

  return result.response.text();
};
```

## 🔗 Additional Resources

### Official Documentation
- [Gemini Vision API](https://ai.google.dev/tutorials/python_quickstart#use_vision)
- [Multimodal Prompting Guide](https://ai.google.dev/docs/multimodal_concepts)
- [Base64 Encoding - MDN](https://developer.mozilla.org/en-US/docs/Glossary/Base64)

### Video Tutorials
- [Gemini Vision API Tutorial](https://www.youtube.com/watch?v=JEBYwPPKRNE)
- [Working with Base64 Images](https://www.youtube.com/watch?v=EvJz0tYz5X4)

### Articles
- [Vision AI Best Practices](https://ai.google.dev/docs/vision_best_practices)
- [Prompt Engineering for Vision Models](https://www.promptingguide.ai/models/vision)

## 🎯 Key Takeaways

Before moving to Level 8, make sure you understand:

✅ **Multimodal AI** - Combining text and image inputs
✅ **Base64 Encoding** - Converting images for API transmission
✅ **Image Optimization** - Resizing and compressing
✅ **Structured Parsing** - Extracting data from responses
✅ **Privacy** - Getting consent before sending images
✅ **Progress States** - Multi-step loading feedback
✅ **Vision Prompting** - Effective prompts for image analysis

## 🚀 Ready for Level 8?

Once you're comfortable with these concepts, proceed to **Level 8: Face Detection**, where you'll learn:

- Using Face-API.js with TensorFlow
- Real-time face detection
- Facial landmark detection (68 points)
- Expression recognition
- Overlaying data on detected faces

```bash
git add .
git commit -m "Complete Level 7: AI Vision"
git checkout level-8-face-detection
```

---

**Need Help?**
- Test with good lighting for better analysis
- Try different poses and expressions
- Review [Level 6](./README-LEVEL-6.md) for API basics

Happy vision coding! 👁️
