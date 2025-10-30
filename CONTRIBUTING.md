# Contributing to Beautify Me 🎨

Thank you for your interest in contributing to Beautify Me! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

There are many ways to contribute to this project:

1. **Report bugs** - Found a bug? Let us know!
2. **Suggest features** - Have an idea? Share it with us!
3. **Improve documentation** - Help make our docs better
4. **Write code** - Fix bugs or implement new features
5. **Review code** - Help review pull requests
6. **Share the project** - Spread the word!

## 🐛 Reporting Bugs

Before creating a bug report:
- Check existing issues to avoid duplicates
- Verify the bug exists in the latest version
- Collect information about your environment

When creating a bug report, include:
- **Clear title** describing the issue
- **Detailed description** of the problem
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

Example:
```markdown
**Bug**: Filter intensity slider not working on Safari

**Steps to reproduce**:
1. Open app in Safari
2. Start webcam
3. Select any filter
4. Try to adjust intensity slider

**Expected**: Slider adjusts filter intensity
**Actual**: Slider moves but filter doesn't change

**Environment**:
- Browser: Safari 16.0
- OS: macOS Ventura 13.0
- Device: MacBook Pro 2021
```

## 💡 Suggesting Features

When suggesting a feature:
- Explain the problem your feature solves
- Describe your proposed solution
- Explain why this would be useful
- Consider alternative solutions

Example:
```markdown
**Feature**: Add video recording capability

**Problem**: Users can only capture still images

**Solution**: Add a "Record Video" button that:
- Records webcam feed with applied filter
- Allows 10-60 second recordings
- Downloads as MP4 file

**Why useful**: Users could create short video clips for social media

**Alternatives considered**:
- GIF export (limited quality)
- Integration with third-party recording tools
```

## 🔧 Development Setup

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Git
- Modern web browser
- Webcam (for testing)

### Setup Steps

1. **Fork the repository**
   - Click "Fork" on GitHub
   - Clone your fork locally

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/beautify-me.git
   cd beautify-me
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/devgunnu/beautify-me.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Guidelines

### JavaScript Style

- Use **functional components** with hooks (no class components)
- Use **const** and **let** instead of var
- Use **arrow functions** for callbacks
- Use **async/await** for asynchronous code
- Add **comments** for complex logic

Good:
```javascript
const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  
  const handleClick = async () => {
    try {
      const result = await fetchData();
      setState(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={handleClick}>Click me</button>;
};
```

Bad:
```javascript
var MyComponent = function() {
  var state = initialValue;
  
  function handleClick() {
    fetchData().then(function(result) {
      state = result;
    }).catch(function(error) {
      console.log(error);
    });
  }
  
  return React.createElement('button', {onClick: handleClick}, 'Click me');
}
```

### React Best Practices

1. **Use meaningful names**
   ```javascript
   // Good
   const [isLoading, setIsLoading] = useState(false);
   const [userProfile, setUserProfile] = useState(null);
   
   // Bad
   const [flag, setFlag] = useState(false);
   const [data, setData] = useState(null);
   ```

2. **Clean up effects**
   ```javascript
   useEffect(() => {
     const timer = setInterval(() => {
       // Do something
     }, 1000);
     
     // Cleanup function
     return () => clearInterval(timer);
   }, []);
   ```

3. **Handle errors gracefully**
   ```javascript
   try {
     const stream = await navigator.mediaDevices.getUserMedia({...});
     // Success
   } catch (err) {
     setError('Camera access denied. Please check permissions.');
     console.error('Camera error:', err);
   }
   ```

### CSS Guidelines

- Use **class names** that describe purpose, not appearance
- Follow existing naming conventions
- Keep selectors specific but not overly nested
- Use CSS variables for repeated values

Good:
```css
.filter-button {
  padding: 10px;
  border-radius: 8px;
}

.filter-button.active {
  background-color: var(--primary-color);
}
```

Bad:
```css
.btn-1 {
  padding: 10px;
  border-radius: 8px;
}

.blue-button {
  background-color: #007bff;
}
```

## ✅ Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Test user-facing behavior, not implementation details
- Use descriptive test names
- Test edge cases and error states

Example:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Filter functionality', () => {
  test('applies grayscale filter when selected', () => {
    render(<App />);
    
    const grayscaleButton = screen.getByText(/grayscale/i);
    fireEvent.click(grayscaleButton);
    
    expect(grayscaleButton).toHaveClass('active');
  });
  
  test('shows error message when camera access denied', async () => {
    // Mock getUserMedia to reject
    navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(
      new Error('Permission denied')
    );
    
    render(<App />);
    const startButton = screen.getByText(/start webcam/i);
    fireEvent.click(startButton);
    
    const errorMessage = await screen.findByText(/camera access denied/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
```

## 📤 Submitting Changes

### Commit Guidelines

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add saturation control slider"
git commit -m "Fix camera not stopping when component unmounts"
git commit -m "Update README with installation instructions"

# Bad
git commit -m "fix bug"
git commit -m "update"
git commit -m "changes"
```

### Commit Message Format

```
<type>: <short description>

<optional longer description>

<optional footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat: Add video recording functionality

- Implement MediaRecorder API integration
- Add record/stop buttons to UI
- Support MP4 export format
- Add recording time limit (60 seconds)

Closes #42
```

### Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link related issues
   - Request review

4. **PR Checklist**
   - [ ] Code follows project style guidelines
   - [ ] All tests pass
   - [ ] Documentation updated if needed
   - [ ] No console errors or warnings
   - [ ] Tested in multiple browsers (if UI change)
   - [ ] Screenshots added (if visual change)

### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Related Issues
Closes #issue-number

## Screenshots (if applicable)
Add screenshots here

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tests pass locally

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
```

## 🔍 Code Review

When reviewing code:
- Be respectful and constructive
- Explain the "why" behind suggestions
- Approve changes when they meet standards
- Request changes if issues need addressing

Example reviews:

Good:
> This looks great! One suggestion: Consider extracting this logic into a separate function for better reusability. For example:
> ```javascript
> const calculateFilterValue = (base, intensity) => base + (modifier * intensity);
> ```

Bad:
> This is wrong. Fix it.

## 📚 Documentation

When updating documentation:
- Keep language clear and simple
- Include code examples
- Update table of contents if needed
- Check for broken links
- Verify code examples work

## 🎯 First-Time Contributors

New to open source? Here's how to get started:

1. **Look for "good first issue" labels**
   - These are beginner-friendly issues
   - Ask questions if anything is unclear

2. **Start small**
   - Fix typos in documentation
   - Improve code comments
   - Add tests
   - Fix small bugs

3. **Ask for help**
   - Don't hesitate to ask questions
   - Comment on issues you're interested in
   - Join discussions

## 🏅 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Create an issue
- **Security**: Email maintainers privately

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions
- Follow GitHub's Community Guidelines

## 🎉 Thank You!

Every contribution, no matter how small, helps make this project better. Thank you for being part of the community!

---

Happy coding! 🚀
