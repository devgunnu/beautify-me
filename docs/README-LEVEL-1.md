# Level 1: React Basics 🎯

**Duration:** 1-2 hours
**Difficulty:** 🟢 Beginner
**Prerequisites:** Basic HTML, CSS, and JavaScript knowledge

## 📚 Learning Objectives

By the end of this level, you will be able to:

- ✅ Understand React components and JSX syntax
- ✅ Use React Hooks (`useState`, `useRef`, `useEffect`)
- ✅ Handle user events (button clicks, input changes)
- ✅ Manage component state and re-rendering
- ✅ Work with React's declarative UI paradigm
- ✅ Understand the virtual DOM and component lifecycle

## 🎓 What You'll Build

In this level, you'll build the **foundation of the LearnLens application**:

- A basic React component structure
- Interactive UI with buttons and controls
- State management for filter selection
- Event handlers for user interactions
- A responsive layout using JSX

## 🏗️ Concepts Covered

### 1. React Components

React applications are built using **components** - reusable, self-contained pieces of UI. Components can be:

- **Functional Components**: Modern approach using JavaScript functions
- **Class Components**: Traditional approach (we'll use functional components)

```javascript
// A simple functional component
function App() {
  return (
    <div className="App">
      <h1>Hello React!</h1>
    </div>
  );
}
```

**Key Concepts:**
- Components return JSX (JavaScript XML)
- Components can be composed (nested)
- Components accept props (properties) for customization

### 2. JSX (JavaScript XML)

JSX is a syntax extension that lets you write HTML-like code in JavaScript:

```javascript
// JSX looks like HTML but is actually JavaScript
const element = <h1 className="title">Hello World</h1>;

// Under the hood, it compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello World');
```

**Important JSX Rules:**
- Use `className` instead of `class` (class is a reserved word in JS)
- Use `htmlFor` instead of `for` in labels
- Self-closing tags must have `/` (e.g., `<img />`, `<input />`)
- JavaScript expressions go inside curly braces: `{variable}`
- Only one root element per component (use fragments `<>...</>` if needed)

### 3. React Hooks

Hooks are functions that let you "hook into" React features. We'll use three essential hooks:

#### `useState` - Managing State

State is data that changes over time. When state changes, React re-renders the component.

```javascript
import { useState } from 'react';

function Counter() {
  // Declare state variable 'count' with initial value 0
  // setCount is the function to update count
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Key Points:**
- Always use the setter function to update state (never mutate directly)
- State updates trigger re-renders
- State is preserved between re-renders
- Each component instance has its own state

#### `useRef` - Referencing DOM Elements

Refs let you access DOM elements directly without causing re-renders:

```javascript
import { useRef } from 'react';

function VideoPlayer() {
  // Create a ref to hold the video element
  const videoRef = useRef(null);

  const playVideo = () => {
    // Access the actual DOM element via .current
    videoRef.current.play();
  };

  return (
    <div>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={playVideo}>Play</button>
    </div>
  );
}
```

**When to use useRef:**
- Accessing DOM elements (video, canvas, input)
- Storing mutable values that don't cause re-renders
- Keeping references between renders

#### `useEffect` - Side Effects and Lifecycle

Effects let you run code after rendering (e.g., fetching data, subscriptions):

```javascript
import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // This runs after every render
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup function runs before component unmounts
    return () => clearInterval(interval);
  }, []); // Empty array = run once on mount

  return <p>Seconds: {seconds}</p>;
}
```

**useEffect Dependency Array:**
- `[]` - Runs once on mount
- `[dep1, dep2]` - Runs when dependencies change
- No array - Runs after every render (usually avoided)

### 4. Event Handling

React uses **camelCase** for event handlers and passes them as functions:

```javascript
function FilterSelector() {
  const handleClick = (filterName) => {
    console.log('Selected filter:', filterName);
  };

  return (
    <div>
      {/* Pass function reference */}
      <button onClick={() => handleClick('vintage')}>
        Vintage
      </button>

      {/* Inline arrow function */}
      <button onClick={(e) => {
        e.preventDefault();
        console.log('Clicked!');
      }}>
        Click Me
      </button>
    </div>
  );
}
```

**Common Events:**
- `onClick` - Mouse clicks
- `onChange` - Input changes
- `onSubmit` - Form submissions
- `onMouseEnter`, `onMouseLeave` - Hover events
- `onKeyDown`, `onKeyPress` - Keyboard events

### 5. Conditional Rendering

Show/hide elements based on state or props:

```javascript
function Greeting({ isLoggedIn }) {
  // Using ternary operator
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in</h1>}
    </div>
  );
}

function Notification({ message }) {
  // Using && for conditional rendering
  return (
    <div>
      {message && <p className="alert">{message}</p>}
    </div>
  );
}
```

### 6. Lists and Keys

Render multiple elements using `.map()`:

```javascript
function FilterList() {
  const filters = ['Normal', 'Vintage', 'Neon', 'Cyberpunk'];

  return (
    <div className="filters">
      {filters.map((filter, index) => (
        // Key helps React identify which items changed
        <button key={index} className="filter-button">
          {filter}
        </button>
      ))}
    </div>
  );
}
```

**Why Keys Matter:**
- Helps React optimize re-renders
- Should be unique and stable (avoid using index if list changes)
- Required for list items to avoid warnings

## 💻 Implementation Guide

### Step 1: Understanding the App Component Structure

Open `src/App.js` and locate the main App component:

```javascript
function App() {
  // 1. State declarations go here
  // 2. Refs go here
  // 3. useEffect hooks go here
  // 4. Event handler functions go here
  // 5. Return JSX
  return (
    <div className="App">
      {/* UI elements */}
    </div>
  );
}
```

**Component Organization Pattern:**
1. **State declarations** - All useState hooks
2. **Refs** - All useRef hooks
3. **Effects** - All useEffect hooks
4. **Helper functions** - Event handlers and utilities
5. **JSX** - The component's UI

### Step 2: Explore State Variables

Find these state declarations in App.js:

```javascript
// Which filter is currently active
const [activeFilter, setActiveFilter] = useState('normal');

// Which mode is active (webcam, photo, stickers, AI)
const [mode, setMode] = useState('webcam');

// Whether webcam is currently running
const [isCameraOn, setIsCameraOn] = useState(false);

// List of captured photos
const [photos, setPhotos] = useState([]);

// Gemini API key for AI features
const [geminiKey, setGeminiKey] = useState('');
```

**Your Task:**
1. Identify what each state variable controls
2. Find where each state is updated (look for `setState` calls)
3. Observe how changing state affects the UI

### Step 3: Explore Event Handlers

Locate these event handler functions:

```javascript
// TODO: Find the handleFilterChange function
// What does it do? What state does it update?
const handleFilterChange = (filterName) => {
  setActiveFilter(filterName);
};

// TODO: Find the toggleCamera function
// How does it start/stop the webcam?
const toggleCamera = () => {
  // Your implementation here
};

// TODO: Find the capturePhoto function
// How does it save the current frame?
const capturePhoto = () => {
  // Your implementation here
};
```

### Step 4: Understand JSX Structure

The App component's JSX is organized into sections:

```javascript
return (
  <div className="App">
    {/* Header section */}
    <header className="App-header">
      <h1>LearnLens 🎨</h1>
    </header>

    {/* Mode selector buttons */}
    <div className="mode-selector">
      {/* TODO: How do these buttons work? */}
    </div>

    {/* Main content area */}
    <main className="main-content">
      {/* TODO: How is conditional rendering used here? */}
    </main>

    {/* Filter buttons */}
    <div className="filter-buttons">
      {/* TODO: How is the filter list rendered? */}
    </div>
  </div>
);
```

### Step 5: Practice Tasks

#### Task 1: Add a New Filter Button

1. Find the `filters` array in App.js
2. Add a new filter object: `{ name: 'my-filter', label: 'My Filter', filter: 'blur(5px)' }`
3. Save and observe it appear in the UI
4. Click it and see the state change

#### Task 2: Create a Counter Component

Create a simple counter to practice useState:

```javascript
// Add this inside App.js or create a new component
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

#### Task 3: Add a Toggle Button

Practice conditional rendering:

```javascript
function ToggleMessage() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Message
      </button>
      {isVisible && <p>Hello! I'm visible now!</p>}
    </div>
  );
}
```

#### Task 4: Style Active Filter

Find the filter buttons and add active state styling:

```javascript
<button
  key={filter.name}
  className={`filter-button ${activeFilter === filter.name ? 'active' : ''}`}
  onClick={() => setActiveFilter(filter.name)}
>
  {filter.label}
</button>
```

Then add CSS in `src/App.css`:

```css
.filter-button.active {
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: white;
  border-color: #a855f7;
}
```

## 🧪 Testing Your Knowledge

### Quiz Questions

1. **What is the difference between `useState` and `useRef`?**
   <details>
   <summary>Answer</summary>

   - `useState` stores state that causes re-renders when updated
   - `useRef` stores mutable values that persist between renders WITHOUT causing re-renders
   - Use useState for UI data, useRef for DOM references or values you don't want to trigger renders
   </details>

2. **Why do we use arrow functions in onClick handlers?**
   <details>
   <summary>Answer</summary>

   ```javascript
   // ❌ Wrong - calls function immediately
   <button onClick={handleClick('value')}>

   // ✅ Correct - passes function reference
   <button onClick={() => handleClick('value')}>
   ```

   Arrow functions create a new function that calls your handler when clicked, allowing you to pass arguments.
   </details>

3. **What happens if you forget the dependency array in useEffect?**
   <details>
   <summary>Answer</summary>

   The effect runs after EVERY render, which can cause:
   - Infinite loops (if the effect updates state)
   - Performance issues
   - Unexpected behavior

   Always specify dependencies or use `[]` for mount-only effects.
   </details>

4. **Why can't you mutate state directly?**
   <details>
   <summary>Answer</summary>

   ```javascript
   // ❌ Wrong - React won't detect the change
   count = count + 1;

   // ✅ Correct - tells React to re-render
   setCount(count + 1);
   ```

   React only re-renders when you call the setter function. Direct mutations don't trigger updates.
   </details>

### Challenges

**Challenge 1: Multi-Step Form**
Create a component with multiple steps that tracks the current step:

```javascript
function MultiStepForm() {
  const [step, setStep] = useState(1);

  return (
    <div>
      <p>Step {step} of 3</p>
      {/* TODO: Show different content based on step */}
      {/* TODO: Add Next/Previous buttons */}
    </div>
  );
}
```

**Challenge 2: Filter Search**
Add a search input that filters the filter list:

```javascript
function FilterSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const filters = ['Normal', 'Vintage', 'Neon', 'Cyberpunk', 'Grayscale'];

  const filteredFilters = filters.filter(f =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search filters..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* TODO: Render filteredFilters */}
    </div>
  );
}
```

**Challenge 3: Theme Switcher**
Add a dark/light mode toggle:

```javascript
function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={isDarkMode ? 'App dark' : 'App light'}>
      <button onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? '☀️' : '🌙'} Toggle Theme
      </button>
      {/* Rest of your app */}
    </div>
  );
}
```

## 🔗 Additional Resources

### Official Documentation
- [React Official Tutorial](https://react.dev/learn) - Interactive tutorial
- [Thinking in React](https://react.dev/learn/thinking-in-react) - Mental model
- [useState Hook](https://react.dev/reference/react/useState) - Complete reference
- [useEffect Hook](https://react.dev/reference/react/useEffect) - Complete reference
- [useRef Hook](https://react.dev/reference/react/useRef) - Complete reference

### Video Tutorials
- [React in 100 Seconds](https://www.youtube.com/watch?v=Tn6-PIqc4UM) - Quick overview
- [React Hooks Crash Course](https://www.youtube.com/watch?v=TNhaISOUy6Q) - Hooks explained
- [Full React Course for Beginners](https://www.youtube.com/watch?v=bMknfKXIFA8) - 5 hours deep dive

### Interactive Learning
- [React Tutorial on Scrimba](https://scrimba.com/learn/learnreact) - Interactive coding
- [React Challenges on Frontend Mentor](https://www.frontendmentor.io/) - Practice projects
- [CodeSandbox React Templates](https://codesandbox.io/s) - Online playground

### Articles
- [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) - Dan Abramov
- [When to useRef vs useState](https://www.robinwieruch.de/react-ref/) - Comparison guide

## 🎯 Key Takeaways

Before moving to Level 2, make sure you understand:

✅ **Components** - Reusable building blocks of React apps
✅ **JSX** - HTML-like syntax in JavaScript
✅ **State** - Data that changes and triggers re-renders
✅ **Props** - Data passed from parent to child components
✅ **Hooks** - Functions that add React features to components
✅ **Events** - Handling user interactions
✅ **Conditional Rendering** - Showing/hiding elements based on conditions
✅ **Lists** - Rendering arrays with .map() and keys

## 🚀 Ready for Level 2?

Once you're comfortable with these concepts, proceed to **Level 2: Webcam & Canvas**, where you'll learn:

- Using the WebRTC API to access the webcam
- Drawing video frames to a Canvas element
- Manipulating pixel data in real-time
- Understanding the browser's media APIs

```bash
git add .
git commit -m "Complete Level 1: React Basics"
git checkout level-2-webcam
```

---

**Need Help?**
- Check the [main README](../README.md) for general guidance
- Review the [FAQ section](../README.md#faq)
- Open an issue on GitHub if you're stuck

Happy coding! 🎉
