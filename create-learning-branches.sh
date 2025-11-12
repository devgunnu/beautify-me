#!/bin/bash

# LearnLens - Learning Branch Creation Script
# This script creates all learning and solution branches for the 8-level tutorial

set -e  # Exit on error

echo "🎓 Creating Learning Branches for LearnLens"
echo "=============================================="
echo ""

# Make sure we're on main branch and it's clean
echo "📍 Checking current branch..."
git checkout main

echo "🔄 Pulling latest changes..."
git pull origin main || echo "⚠️  Could not pull from origin (might not exist yet)"

echo ""
echo "📦 Current branch status:"
git status --short

echo ""
echo "🌿 Creating level branches..."
echo ""

# Level 1: React Basics
echo "1️⃣  Creating level-1-basics branch..."
git checkout -b level-1-basics main
git push -u origin level-1-basics || echo "⚠️  Could not push (create remote repo first)"

# Level 2: Webcam & Canvas
echo "2️⃣  Creating level-2-webcam branch..."
git checkout main
git checkout -b level-2-webcam main
git push -u origin level-2-webcam || echo "⚠️  Could not push (create remote repo first)"

# Level 3: Filters & Effects
echo "3️⃣  Creating level-3-filters branch..."
git checkout main
git checkout -b level-3-filters main
git push -u origin level-3-filters || echo "⚠️  Could not push (create remote repo first)"

# Level 4: Photo Capture
echo "4️⃣  Creating level-4-photos branch..."
git checkout main
git checkout -b level-4-photos main
git push -u origin level-4-photos || echo "⚠️  Could not push (create remote repo first)"

# Level 5: Stickers & Drag
echo "5️⃣  Creating level-5-stickers branch..."
git checkout main
git checkout -b level-5-stickers main
git push -u origin level-5-stickers || echo "⚠️  Could not push (create remote repo first)"

# Level 6: AI Integration (Text)
echo "6️⃣  Creating level-6-ai-text branch..."
git checkout main
git checkout -b level-6-ai-text main
git push -u origin level-6-ai-text || echo "⚠️  Could not push (create remote repo first)"

# Level 7: AI Vision
echo "7️⃣  Creating level-7-ai-vision branch..."
git checkout main
git checkout -b level-7-ai-vision main
git push -u origin level-7-ai-vision || echo "⚠️  Could not push (create remote repo first)"

# Level 8: Face Detection
echo "8️⃣  Creating level-8-face-detection branch..."
git checkout main
git checkout -b level-8-face-detection main
git push -u origin level-8-face-detection || echo "⚠️  Could not push (create remote repo first)"

echo ""
echo "🎯 Creating solution branches..."
echo ""

# Solution branches (copies of main with complete code)
for level in {1..8}; do
  echo "✅ Creating level-${level}-solution branch..."
  git checkout main
  git checkout -b level-${level}-solution main
  git push -u origin level-${level}-solution || echo "⚠️  Could not push (create remote repo first)"
done

echo ""
echo "✅ Branch creation complete!"
echo ""
echo "📚 Created branches:"
echo "   - level-1-basics"
echo "   - level-2-webcam"
echo "   - level-3-filters"
echo "   - level-4-photos"
echo "   - level-5-stickers"
echo "   - level-6-ai-text"
echo "   - level-7-ai-vision"
echo "   - level-8-face-detection"
echo ""
echo "   - level-1-solution through level-8-solution"
echo ""
echo "🔄 Returning to main branch..."
git checkout main

echo ""
echo "📋 Next Steps:"
echo "1. Checkout each level branch (level-1-basics, level-2-webcam, etc.)"
echo "2. Modify src/App.js to remove completed features and add TODOs"
echo "3. Commit changes with: git commit -m 'Add learning TODOs for Level N'"
echo "4. Push changes: git push origin <branch-name>"
echo ""
echo "📖 Solution branches contain complete working code as reference."
echo ""
echo "🎉 Happy teaching!"
