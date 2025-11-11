# LearnLens - Learn JavaScript by Building 🎓

> **Master Modern JavaScript through 8 Progressive Levels**
> Build a production-ready webcam filter app while learning React, WebRTC, AI APIs, and Machine Learning

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![Learning Path](https://img.shields.io/badge/Levels-8-purple.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

---

## 🎯 What You'll Learn

This isn't just another webcam filter app - it's a **comprehensive JavaScript learning platform** that takes you from React basics to advanced ML integration through hands-on building.

### 📚 **Complete Learning Path:**

| Level | Topic | Technologies | Difficulty | Time |
|-------|-------|-------------|------------|------|
| 1️⃣ | [React Basics](./docs/README-LEVEL-1.md) | React, JSX, Hooks | 🟢 Beginner | 1-2 hours |
| 2️⃣ | [Webcam & Canvas](./docs/README-LEVEL-2.md) | WebRTC, Canvas API, useRef | 🟢 Beginner | 2-3 hours |
| 3️⃣ | [Filters & Effects](./docs/README-LEVEL-3.md) | CSS Filters, Transformations | 🟡 Intermediate | 1-2 hours |
| 4️⃣ | [Photo Capture](./docs/README-LEVEL-4.md) | Canvas toDataURL, File Download | 🟡 Intermediate | 1-2 hours |
| 5️⃣ | [Stickers & Drag](./docs/README-LEVEL-5.md) | Drag & Drop API, Coordinates | 🟡 Intermediate | 2-3 hours |
| 6️⃣ | [AI Integration](./docs/README-LEVEL-6.md) | Gemini API, Async/Await, Env Vars | 🔴 Advanced | 2-3 hours |
| 7️⃣ | [AI Vision](./docs/README-LEVEL-7.md) | Gemini Vision, Multimodal AI | 🔴 Advanced | 2-3 hours |
| 8️⃣ | [Face Detection](./docs/README-LEVEL-8.md) | TensorFlow.js, Face-API, ML | 🔴 Advanced | 3-4 hours |

**Total Learning Time:** ~15-20 hours

---

## 🚀 Quick Start for Learners

### **Step 1: Fork & Clone**

```bash
# Fork this repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/LearnLens.git
cd LearnLens
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Setup Environment (for AI features)**

```bash
# Copy the example env file
cp .env.example .env

# Add your Gemini API key (get it from https://aistudio.google.com/app/apikey)
# Edit .env and replace 'your_gemini_api_key_here' with your actual key
```

### **Step 4: Start Learning!**

```bash
# Checkout Level 1 branch
git checkout level-1-basics

# Read the tutorial
cat docs/README-LEVEL-1.md

# Start the dev server
npm start

# Open http://localhost:3000 and start building!
```

### **Step 5: Complete Level & Merge**

```bash
# When you complete Level 1, merge to your main branch
git checkout main
git merge level-1-basics

# Move to Level 2
git checkout level-2-webcam

# Repeat the process!
```

---

## 🎓 Learning Approach

### **How This Tutorial Works:**

1. **Progressive Complexity** - Each level builds on the previous one
2. **Hands-On Learning** - You write the code, not just read it
3. **Boilerplate Provided** - Focus on core concepts, not setup
4. **TODOs & Hints** - Clear guidance on what to implement
5. **Educational Comments** - Learn WHY, not just HOW
6. **Real-World Project** - Build something you can actually use

### **What's Provided in Each Level:**

✅ **Boilerplate Code** - All setup, imports, and structure
✅ **Step-by-Step Guide** - Detailed implementation instructions
✅ **Code Examples** - Commented snippets showing how it works
✅ **Key Concepts** - Deep dives into important topics
✅ **Knowledge Checks** - Exercises to test your understanding
✅ **Solution Branch** - Reference implementation if you get stuck

### **What You'll Build:**

🎯 **Working Code** - Implement features yourself with guidance
🎯 **Understanding** - Learn concepts through practical application
🎯 **Portfolio Project** - Production-ready app you can showcase

---

## ✨ Features You'll Build

### **Level 1-2: Foundation**
- ⚛️ React components and state management
- 📹 Webcam access with WebRTC
- 🖼️ Real-time video rendering on canvas
- 🪞 Mirror effect for selfie mode

### **Level 3-4: Visual Effects**
- 🎨 20+ CSS filters (Grayscale, Sepia, Vintage, Neon, etc.)
- 🎚️ Filter intensity control (0-100%)
- ✨ Beauty mode with skin smoothing
- 📸 Photo capture with filters
- 💾 Download captured images

### **Level 5: Interactivity**
- 🦄 20+ draggable emoji stickers
- 🎯 Drag and drop positioning
- 🗑️ Add/remove stickers
- 📐 Coordinate transformations

### **Level 6-7: AI Features**
- 🤖 Gemini API integration
- 💡 AI filter recommendations
- 👁️ Vision AI for skin analysis
- 🎯 Personalized suggestions
- 🔐 Secure API key management

### **Level 8: Machine Learning**
- 🧠 Face detection with TensorFlow.js
- 📊 68-point facial landmarks
- 😊 Expression recognition (7 emotions)
- 👤 Face matching and similarity
- ⚡ Real-time ML inference

---

## 🛠️ Technologies & Tools

### **Core Technologies:**
- **React 19.2** - Modern UI framework
- **WebRTC** - Real-time media streaming
- **Canvas API** - 2D graphics rendering
- **CSS3** - Advanced styling and filters

### **AI & Machine Learning:**
- **Google Gemini API** - Text and vision AI
- **TensorFlow.js** - Browser-based ML
- **Face-API.js** - Face detection library

### **Development Tools:**
- **Create React App** - Build tooling
- **Git Branches** - Level-based workflow
- **Environment Variables** - Secure config

---

## 📂 Project Structure

```
LearnLens/
├── public/
│   ├── models/              # Pre-trained ML models for face detection
│   │   ├── tiny_face_detector_model/
│   │   ├── face_landmark_68_model/
│   │   ├── face_expression_model/
│   │   └── face_recognition_model/
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── App.js              # Main component (1800+ lines of learning material)
│   ├── App.css             # Complete styling (1500+ lines)
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
│
├── docs/                   # Learning documentation
│   ├── README-LEVEL-1.md   # Level 1: React Basics
│   ├── README-LEVEL-2.md   # Level 2: Webcam & Canvas
│   ├── README-LEVEL-3.md   # Level 3: Filters & Effects
│   ├── README-LEVEL-4.md   # Level 4: Photo Capture
│   ├── README-LEVEL-5.md   # Level 5: Stickers & Drag
│   ├── README-LEVEL-6.md   # Level 6: AI Integration
│   ├── README-LEVEL-7.md   # Level 7: AI Vision
│   └── README-LEVEL-8.md   # Level 8: Face Detection
│
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── README.md               # This file
├── CONTRIBUTING.md         # Contributor guidelines
└── CODE_EXAMPLES.md        # Additional code examples

Git Branches:
├── main                    # Complete production code
├── level-1-basics          # Starting point for Level 1
├── level-2-webcam          # Starting point for Level 2
├── ... (all 8 levels)
├── level-1-solution        # Reference solution for Level 1
└── ... (all 8 solutions)
```

---

## 🎓 For Instructors & Teachers

### **Using This in Your Classroom:**

✅ **Self-Paced Learning** - Students work at their own speed
✅ **Clear Milestones** - 8 distinct achievement points
✅ **Assessment Ready** - Knowledge checks in each level
✅ **Portfolio Building** - Students create real projects
✅ **No Setup Hassle** - Everything pre-configured

### **Recommended Teaching Flow:**

1. **Week 1-2:** Levels 1-2 (React & WebRTC Fundamentals)
2. **Week 3-4:** Levels 3-4 (Canvas & Image Processing)
3. **Week 5-6:** Level 5 (Event Handling & Drag-Drop)
4. **Week 7-8:** Levels 6-7 (API Integration & AI)
5. **Week 9-10:** Level 8 (Machine Learning)

---

## 📖 Detailed Level Breakdown

### **🟢 Level 1: React Basics** (Beginner)

**What You'll Learn:**
- Component structure and JSX syntax
- `useState` for managing state
- Event handlers and user input
- Basic button interactions

**Build:** Simple interactive button with state changes

**Prerequisites:** Basic HTML, CSS, JavaScript knowledge

**[📚 Full Tutorial →](./docs/README-LEVEL-1.md)**

---

### **🟢 Level 2: Webcam & Canvas** (Beginner)

**What You'll Learn:**
- `useRef` hook for DOM access
- WebRTC `getUserMedia` API
- Canvas 2D rendering context
- `requestAnimationFrame` loop
- `useEffect` for lifecycle management

**Build:** Live webcam feed on canvas

**Prerequisites:** Level 1 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-2.md)**

---

### **🟡 Level 3: Filters & Effects** (Intermediate)

**What You'll Learn:**
- CSS `filter` property (20+ effects)
- Canvas transformations (mirror, scale)
- Dynamic filter switching
- Range slider controls
- Conditional rendering

**Build:** Selectable filters with intensity control

**Prerequisites:** Level 2 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-3.md)**

---

### **🟡 Level 4: Photo Capture** (Intermediate)

**What You'll Learn:**
- Canvas `toDataURL()` method
- Blob API and file downloads
- Modal component patterns
- Composite canvas rendering
- CSS animations (flash effect)

**Build:** Photo capture and download system

**Prerequisites:** Level 3 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-4.md)**

---

### **🟡 Level 5: Stickers & Drag** (Intermediate)

**What You'll Learn:**
- Drag and Drop API
- Mouse/touch event handling
- Coordinate transformations
- Array state management
- Event delegation patterns

**Build:** Draggable emoji stickers with categories

**Prerequisites:** Level 4 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-5.md)**

---

### **🔴 Level 6: AI Integration** (Advanced)

**What You'll Learn:**
- Environment variables (`.env` files)
- API key security best practices
- Async/await for API calls
- Error handling patterns
- Gemini AI API basics

**Build:** AI-powered filter recommendations

**Prerequisites:** Level 5 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-6.md)**

---

### **🔴 Level 7: AI Vision** (Advanced)

**What You'll Learn:**
- Base64 image encoding
- Multimodal AI (text + image)
- Canvas image extraction
- Vision API prompting
- Personalized AI recommendations

**Build:** AI skin analysis with custom suggestions

**Prerequisites:** Level 6 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-7.md)**

---

### **🔴 Level 8: Face Detection** (Advanced)

**What You'll Learn:**
- TensorFlow.js basics
- Loading ML models
- Face-API.js library
- Real-time face detection
- Facial landmarks (68 points)
- Expression recognition
- Face matching algorithms
- Performance optimization

**Build:** Complete face analysis system

**Prerequisites:** Level 7 completed

**[📚 Full Tutorial →](./docs/README-LEVEL-8.md)**

---

## 💻 Available Scripts

### **Development**

```bash
# Start development server (http://localhost:3000)
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (not recommended for learners)
npm run eject
```

### **Git Workflow**

```bash
# List all learning branches
git branch -a

# Switch to a specific level
git checkout level-3-filters

# See your progress
git log --oneline

# Merge completed level to main
git checkout main
git merge level-3-filters
```

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Opera | 76+ | ✅ Full Support |

**Requirements:**
- WebRTC support (for webcam access)
- Canvas API support (for rendering)
- ES6+ JavaScript support

---

## 🤝 Contributing

We welcome contributions from learners, educators, and developers!

### **Ways to Contribute:**

#### **For Learners:**
- 📝 Report unclear documentation
- 💡 Suggest improvements to tutorials
- 🐛 Report bugs you encounter
- ⭐ Share your learning experience

#### **For Educators:**
- 📚 Share how you used this in teaching
- 🎓 Suggest additional exercises
- 📖 Create supplementary materials
- 🌍 Translate to other languages

#### **For Developers:**
- 🔧 Fix bugs in any branch
- ✨ Add new features
- ⚡ Improve performance
- 🧪 Write tests
- 📄 Improve documentation

**[📖 Full Contribution Guidelines →](./CONTRIBUTING.md)**

---

## 📚 Additional Resources

### **Official Documentation:**
- [React Docs](https://react.dev/) - Learn React fundamentals
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) - WebRTC, Canvas, and more
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning in the browser
- [Gemini API](https://ai.google.dev/) - Google's AI platform

### **Recommended Learning:**
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [React Beta Docs](https://react.dev/learn) - Interactive React course
- [Web.dev](https://web.dev/) - Web development best practices

### **Community:**
- [Discord Server](#) - Join our learning community
- [GitHub Discussions](https://github.com/devgunnu/LearnLens/discussions) - Ask questions

---

## 🎯 Learning Paths by Experience Level

### **👶 Complete Beginner**
- Start with Level 1
- Take your time with Levels 2-3
- Consider pausing at Level 5
- Return to Levels 6-8 after more practice

### **💼 Some JavaScript Experience**
- Skim Level 1 for React refresh
- Start building from Level 2
- Complete through Level 6
- Challenge yourself with Levels 7-8

### **🚀 Experienced Developer**
- Review Levels 1-5 for React patterns
- Focus on Levels 6-8 for AI/ML integration
- Explore the production code on main branch
- Consider contributing new levels!

---

## ❓ FAQ

### **Do I need prior React experience?**
No! Level 1 teaches React basics from scratch. However, basic HTML, CSS, and JavaScript knowledge is recommended.

### **Is this free?**
Yes, completely free! The only cost is if you want to use the AI features (Levels 6-7), which require a Google Gemini API key (free tier available).

### **Can I skip levels?**
While each level builds on the previous one, you can checkout any branch to see the code. However, we recommend following the order for the best learning experience.

### **What if I get stuck?**
1. Re-read the level's README
2. Check the solution branch (e.g., `level-3-solution`)
3. Ask in GitHub Discussions
4. Review the complete code on main branch

### **Can I use this for my portfolio?**
Absolutely! Once you complete the levels, you'll have a production-ready app you can showcase. Just remember to credit the original project.

### **How long does it take to complete?**
Most learners complete all 8 levels in 15-20 hours spread over 2-4 weeks. Go at your own pace!

### **Do I need a powerful computer?**
No. Any modern computer (Windows, Mac, Linux) with a webcam and web browser can run this project.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **What This Means:**
✅ Free to use for learning
✅ Free to modify and extend
✅ Free to use in your portfolio
✅ Free to use commercially
📝 Just keep the license notice

---

## 🙏 Acknowledgments

**Built with love by learners, for learners.**

Special thanks to:
- **React Team** - For the amazing framework
- **TensorFlow.js Team** - For bringing ML to the browser
- **Vladimir Mandic** - For the excellent face-api.js library
- **Google** - For the Gemini API
- **All Contributors** - For making this better

---

## 🌟 Show Your Support

If this project helped you learn:
- ⭐ Star this repo
- 🍴 Fork it to your account
- 📢 Share with fellow learners
- 💬 Leave feedback in Discussions
- 🐛 Report issues
- 🤝 Contribute improvements

---

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/devgunnu/LearnLens/issues)
- **Discussions:** [Ask questions or share your project](https://github.com/devgunnu/LearnLens/discussions)
- **Twitter:** [@devgunnu](https://twitter.com/devgunnu)

---

<div align="center">

**Ready to start your learning journey?**

[🚀 Get Started](#-quick-start-for-learners) | [📚 View Tutorials](./docs/) | [🤝 Contribute](./CONTRIBUTING.md)

Made with ❤️ for the JavaScript learning community

</div>
