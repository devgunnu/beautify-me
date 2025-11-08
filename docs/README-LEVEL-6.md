# Level 6: AI Integration (Text) 🤖

**Duration:** 2-3 hours
**Difficulty:** 🔴 Advanced
**Prerequisites:** Level 1-5 completed + Gemini API key

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Integrate third-party APIs (Google Gemini)
- ✅ Use async/await for asynchronous operations
- ✅ Handle API errors and loading states
- ✅ Work with environment variables securely
- ✅ Parse and display AI-generated text
- ✅ Build conversational AI features
- ✅ Understand API rate limiting and quotas

## 🎓 What You'll Build

In this level, you'll add **AI-powered filter recommendations**:

- Time-based filter suggestions (morning/evening)
- Conversational AI interface
- Loading states and error handling
- API key configuration
- Smart recommendations based on context

## 🏗️ Concepts Covered

### 1. Environment Variables

Environment variables store sensitive data (API keys) outside your code:

**Why use .env files?**
- ✅ Keep secrets out of version control
- ✅ Different values for development/production
- ✅ Easy to change without code modifications
- ✅ Security best practice

#### Creating .env File

```bash
# .env (in project root)
GEMINI_API_KEY=your_actual_api_key_here
```

#### Reading Environment Variables

```javascript
// Access in React
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('API key not found!');
}
```

**Important:**
- `.env` should be in `.gitignore` (never commit it!)
- Create `.env.example` as template for others
- Restart dev server after changing .env

### 2. Async/Await

APIs are asynchronous - they take time to respond:

```javascript
// ❌ Wrong - doesn't wait for response
function getRecommendation() {
  const result = callAPI();  // undefined!
  console.log(result);
}

// ✅ Correct - waits for response
async function getRecommendation() {
  const result = await callAPI();  // Waits here
  console.log(result);  // Has data
}
```

**Key Concepts:**
- `async` keyword marks function as asynchronous
- `await` pauses execution until Promise resolves
- Always use `try/catch` for error handling

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

### 3. Google Gemini API

**Gemini** is Google's AI model for text and vision tasks:

#### Installation

```bash
npm install @google/generative-ai
```

#### Basic Setup

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get model
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```

#### Text Generation

```javascript
async function generateText(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Generate content
    const result = await model.generateContent(prompt);

    // Extract text from response
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

// Usage
const recommendation = await generateText('Suggest a photo filter for sunset');
console.log(recommendation);
```

#### Available Models

| Model | Description | Use Case |
|-------|-------------|----------|
| `gemini-2.5-flash` | Fast, efficient | Quick responses, text generation |
| `gemini-1.5-pro` | More capable | Complex reasoning, longer context |

### 4. API Error Handling

Always handle errors gracefully:

```javascript
async function getAIRecommendation() {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (error) {
    // Different error types
    if (error.status === 429) {
      // Rate limit exceeded
      return 'Too many requests. Please wait a moment.';
    } else if (error.status === 401) {
      // Invalid API key
      return 'Invalid API key. Please check your configuration.';
    } else if (error.message.includes('quota')) {
      // Quota exceeded
      return 'API quota exceeded. Try again later.';
    } else {
      // Generic error
      console.error('AI Error:', error);
      return 'Unable to get recommendation. Please try again.';
    }
  }
}
```

**Common Error Codes:**
- `400` - Bad request (invalid prompt)
- `401` - Unauthorized (invalid API key)
- `429` - Too many requests (rate limit)
- `500` - Server error (try again later)

### 5. Loading States

Show feedback while waiting for API response:

```javascript
const [isLoading, setIsLoading] = useState(false);
const [recommendation, setRecommendation] = useState('');
const [error, setError] = useState(null);

const getRecommendation = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const result = await generateAIText(prompt);
    setRecommendation(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);  // Always runs, even if error
  }
};

// UI
{isLoading && <p>Loading...</p>}
{error && <p className="error">{error}</p>}
{recommendation && <p>{recommendation}</p>}
```

**UI States:**
1. **Idle** - Before request
2. **Loading** - Request in progress
3. **Success** - Data received
4. **Error** - Request failed

### 6. Prompt Engineering

Craft effective prompts for better AI responses:

```javascript
// ❌ Vague prompt
const prompt = 'Give me a filter';

// ✅ Specific prompt
const prompt = `
You are a photography expert. Based on the current time of day,
recommend ONE filter from this list that would look best:

Available filters: ${filters.map(f => f.name).join(', ')}

Current time: ${new Date().toLocaleTimeString()}

Respond with ONLY the filter name, followed by a brief reason (1 sentence).
Format: "FilterName - Reason"
`;
```

**Prompt Best Practices:**
- Be specific about format you want
- Provide context and constraints
- List available options
- Request concise responses
- Give examples if needed

### 7. Time-Based Logic

Get current time for context-aware recommendations:

```javascript
const getTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
};

// Use in prompt
const prompt = `
It's currently ${getTimeOfDay()}.
Recommend a filter that matches the mood and lighting of this time.
`;
```

## 💻 Implementation Guide

### Step 1: Setting Up API Key

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create `.env` file in project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

3. Verify it's loaded:

```javascript
useEffect(() => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    console.log('✅ API key loaded');
    setGeminiKey(apiKey);
  } else {
    console.warn('⚠️ No API key found');
  }
}, []);
```

### Step 2: Installing Gemini SDK

```bash
npm install @google/generative-ai
```

Import in `src/App.js`:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
```

### Step 3: Creating the Recommendation Function

```javascript
const getFilterRecommendation = async () => {
  if (!geminiKey) {
    alert('Please add your Gemini API key to the .env file');
    return;
  }

  setIsLoadingRecommendation(true);

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build prompt
    const timeOfDay = getTimeOfDay();
    const filterNames = filters.map(f => f.name).join(', ');

    const prompt = `
    You are a professional photographer. It's currently ${timeOfDay}.

    From this list of filters: ${filterNames}

    Recommend ONE filter that would work best for a selfie at this time of day.

    Format your response as:
    "FilterName - Reason"

    Keep the reason to one sentence.
    `;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse response
    const [filterName, reason] = text.split(' - ');

    // Apply recommended filter
    if (filterName && filters.find(f => f.name === filterName.trim())) {
      setActiveFilter(filterName.trim());
      setRecommendation(reason || 'Great choice for this time!');
    } else {
      setRecommendation(text);
    }

  } catch (error) {
    console.error('Error getting recommendation:', error);
    setRecommendation('Unable to get recommendation. Please try again.');
  } finally {
    setIsLoadingRecommendation(false);
  }
};
```

**Your Task:**
1. Find the filter recommendation function
2. Test it with your API key
3. Observe how it parses the AI response
4. Try at different times of day

### Step 4: Building the UI

```javascript
<div className="ai-recommendation-section">
  <h3>🤖 AI Filter Recommendation</h3>

  <button
    onClick={getFilterRecommendation}
    disabled={isLoadingRecommendation || !geminiKey}
    className="ai-button"
  >
    {isLoadingRecommendation ? (
      <>
        <span className="spinner">⏳</span>
        Thinking...
      </>
    ) : (
      <>
        ✨ Get Smart Recommendation
      </>
    )}
  </button>

  {recommendation && (
    <div className="recommendation-result">
      <p>{recommendation}</p>
    </div>
  )}

  {!geminiKey && (
    <p className="warning">
      ⚠️ Add your Gemini API key to .env to use AI features
    </p>
  )}
</div>
```

**Your Task:**
1. Create the AI recommendation UI section
2. Add loading state indicator
3. Display recommendations
4. Handle missing API key case

### Step 5: Practice Tasks

#### Task 1: Add Retry Logic

```javascript
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Wait longer each retry (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage
const getRecommendation = async () => {
  try {
    const result = await retryWithBackoff(() =>
      model.generateContent(prompt)
    );
    // Handle result
  } catch (error) {
    console.error('All retries failed:', error);
  }
};
```

#### Task 2: Add Request Caching

```javascript
const [recommendationCache, setRecommendationCache] = useState({});

const getCachedRecommendation = async (timeOfDay) => {
  // Check cache first
  if (recommendationCache[timeOfDay]) {
    console.log('Using cached recommendation');
    return recommendationCache[timeOfDay];
  }

  // Fetch new recommendation
  const recommendation = await getFilterRecommendation();

  // Cache it
  setRecommendationCache(prev => ({
    ...prev,
    [timeOfDay]: recommendation
  }));

  return recommendation;
};
```

#### Task 3: Add Mood-Based Recommendations

```javascript
const [mood, setMood] = useState('happy');

const getMoodRecommendation = async () => {
  const prompt = `
  The user is feeling ${mood}.

  From these filters: ${filterNames}

  Recommend ONE filter that matches this mood.
  Explain why in one sentence.
  `;

  // ... rest of API call
};

// UI
<select value={mood} onChange={(e) => setMood(e.target.value)}>
  <option value="happy">😊 Happy</option>
  <option value="sad">😢 Sad</option>
  <option value="energetic">⚡ Energetic</option>
  <option value="calm">😌 Calm</option>
  <option value="adventurous">🏔️ Adventurous</option>
</select>

<button onClick={getMoodRecommendation}>
  Get Mood-Based Filter
</button>
```

#### Task 4: Add Conversation History

```javascript
const [conversationHistory, setConversationHistory] = useState([]);

const chatWithAI = async (userMessage) => {
  // Add user message to history
  const newHistory = [
    ...conversationHistory,
    { role: 'user', text: userMessage }
  ];

  // Build conversation context
  const context = newHistory
    .map(msg => `${msg.role}: ${msg.text}`)
    .join('\n');

  const prompt = `
  ${context}

  assistant: [Respond as a helpful photography expert]
  `;

  const response = await model.generateContent(prompt);
  const aiMessage = response.text();

  // Add AI response to history
  setConversationHistory([
    ...newHistory,
    { role: 'assistant', text: aiMessage }
  ]);

  return aiMessage;
};
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **Why use environment variables for API keys?**
   <details>
   <summary>Answer</summary>

   - **Security**: Keeps secrets out of code/version control
   - **Flexibility**: Different keys for dev/production
   - **Safety**: Easy to revoke if exposed
   - **Best Practice**: Industry standard for credentials

   Never hardcode API keys in source code!
   </details>

2. **What does `await` do?**
   <details>
   <summary>Answer</summary>

   Pauses async function execution until Promise resolves:
   ```javascript
   // Without await - gets Promise, not data
   const promise = fetch(url);

   // With await - waits for data
   const data = await fetch(url);
   ```

   Only works inside `async` functions!
   </details>

3. **Why use try/catch with async operations?**
   <details>
   <summary>Answer</summary>

   APIs can fail for many reasons:
   - Network issues
   - Invalid API key
   - Rate limits
   - Server errors

   try/catch lets you handle errors gracefully instead of crashing.
   </details>

4. **What's the difference between models?**
   <details>
   <summary>Answer</summary>

   - **gemini-2.5-flash**: Faster, cheaper, good for simple tasks
   - **gemini-1.5-pro**: Slower, more capable, better for complex reasoning

   Use Flash for quick recommendations, Pro for detailed analysis.
   </details>

### Challenges

**Challenge 1: Build a Filter Quiz**

```javascript
const filterQuiz = async () => {
  const questions = [
    'What is your favorite color?',
    'Do you prefer warm or cool tones?',
    'Are you taking photos indoors or outdoors?'
  ];

  const answers = [];

  for (const question of questions) {
    const answer = prompt(question);
    answers.push(answer);
  }

  const prompt = `
  Based on these preferences:
  ${answers.map((a, i) => `${questions[i]}: ${a}`).join('\n')}

  From these filters: ${filterNames}

  Recommend the BEST filter and explain why.
  `;

  const recommendation = await model.generateContent(prompt);
  return recommendation.response.text();
};
```

**Challenge 2: Add Voice Input**

```javascript
const getVoiceRecommendation = () => {
  const recognition = new webkitSpeechRecognition();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('You said:', transcript);

    const prompt = `
    User request: "${transcript}"

    Available filters: ${filterNames}

    Recommend a filter based on their request.
    `;

    const result = await model.generateContent(prompt);
    setRecommendation(result.response.text());

    // Optional: Read response aloud
    const speech = new SpeechSynthesisUtterance(result.response.text());
    window.speechSynthesis.speak(speech);
  };

  recognition.start();
};
```

**Challenge 3: Create Filter Descriptions**

```javascript
const generateFilterDescription = async (filterName) => {
  const prompt = `
  Describe the "${filterName}" photo filter in one sentence.
  Focus on the mood and visual effect it creates.
  Be creative and engaging.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// Generate descriptions for all filters
const generateAllDescriptions = async () => {
  const descriptions = {};

  for (const filter of filters) {
    descriptions[filter.name] = await generateFilterDescription(filter.name);
    // Add delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  setFilterDescriptions(descriptions);
};
```

## 🔗 Additional Resources

### Official Documentation
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Gemini JavaScript SDK](https://ai.google.dev/tutorials/web_quickstart)
- [Async/Await Guide - MDN](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
- [Environment Variables - Create React App](https://create-react-app.dev/docs/adding-custom-environment-variables/)

### Video Tutorials
- [Async JavaScript Tutorial](https://www.youtube.com/watch?v=PoRJizFvM7s)
- [Google Gemini API Tutorial](https://www.youtube.com/watch?v=JEBYwPPKRNE)
- [Promises and Async/Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU)

### Interactive Learning
- [Gemini API Playground](https://aistudio.google.com/)
- [Async JavaScript on freeCodeCamp](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/)

### Articles
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [API Error Handling Best Practices](https://blog.logrocket.com/error-handling-in-javascript/)

## 🎯 Key Takeaways

Before moving to Level 7, make sure you understand:

✅ **Environment Variables** - Storing API keys securely
✅ **Async/Await** - Handling asynchronous operations
✅ **API Integration** - Calling external APIs
✅ **Error Handling** - try/catch and graceful failures
✅ **Loading States** - Providing user feedback
✅ **Prompt Engineering** - Crafting effective AI prompts
✅ **Response Parsing** - Extracting data from AI responses

## 🚀 Ready for Level 7?

Once you're comfortable with these concepts, proceed to **Level 7: AI Vision**, where you'll learn:

- Multimodal AI (text + images)
- Sending images to Gemini API
- AI-powered skin analysis
- Advanced prompt engineering
- Personalized filter recommendations

```bash
git add .
git commit -m "Complete Level 6: AI Integration (Text)"
git checkout level-7-ai-vision
```

---

**Need Help?**
- Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Review the [.env.example](../.env.example) file for setup
- Check [Gemini API docs](https://ai.google.dev/docs) for troubleshooting

Happy AI coding! 🤖
