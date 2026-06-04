# FitAI - AI Fitness Motivation App PRD

## Problem Statement
Build a demo mobile app with React Native Expo + NativeWind demonstrating a comprehensive AI fitness motivation platform.

## Architecture
- **Frontend**: React Native Expo SDK 54, Expo Router, StyleSheet.create(), react-native-svg
- **Backend**: FastAPI + MongoDB + emergentintegrations (GPT-4.1-mini via EMERGENT_LLM_KEY)
- **State Management**: Zustand + AsyncStorage persistence
- **Navigation**: Expo Router file-based routing + Bottom Tab Navigator

## Key Features Implemented (June 2026)

### 1. Onboarding Flow (3-step)
- Step 1: Goal selection (Lose Weight, Build Muscle, Endurance, Stay Active)
- Step 2: Fitness level (Beginner, Intermediate, Advanced)
- Step 3: Workout style (Gym, Home, Outdoor, Mixed)
- Full-screen hero images with LinearGradient overlay
- AsyncStorage persistence to skip on return visits

### 2. Home Dashboard
- Animated SVG progress rings (Calories, Week, Minutes) using react-native-reanimated
- Live streak counter with flame badge (🔥12)
- AI Coach motivation card with real GPT-4.1-mini personalized messages
- Today's workout card with real Unsplash background images
- Weekly activity bar chart (SVG)
- Sticky "Start Today's Workout" CTA button
- Pull-to-refresh for new AI motivation

### 3. Workout Plans
- 5 workout categories: Lifting, Running, Yoga, HIIT, Stretching
- Horizontal scrollable category chip filter
- Full-screen workout cards with real background images
- Detail modal with exercise list, sets/reps, rest times
- "Start Workout" triggers workout session logging

### 4. AI Coach Chat
- Real GPT-4.1-mini via emergentintegrations
- Multi-turn conversation with MongoDB session history
- Typing indicator
- Quick prompt chips (Motivate me, Suggest workout, Recovery tips, Nutrition)
- Fallback responses for graceful degradation

### 5. Progress Analytics
- 3-tab interface: Stats | Challenges | Badges
- Weekly calorie chart (SVG bars)
- 6 stat cards (Streak, Workouts, Calories, Time, This Week, Weight)
- Goal progress bar (weight tracker)
- 5 daily/weekly challenges with progress bars
- 8 achievement badges (locked/unlocked states)

### 6. Profile & Settings
- User avatar with name initial
- Stats row (streak, workouts, active days)
- Body stats (weight, target, fitness level)
- Dark/Light mode toggle
- Notification settings (toggles)
- Restart onboarding option

### 7. Dark/Light Mode
- System detection + manual toggle
- Theme stored in AsyncStorage
- Full color system: #22C55E primary, #0F172A dark bg, #3B82F6 accent

## Backend Endpoints
- `GET /api/health` - Health check
- `POST /api/chat` - AI coach chat (GPT-4.1-mini)
- `GET /api/chat/history/{session_id}` - Chat history
- `GET /api/motivation` - Daily motivation message
- `POST /api/user/profile` - Save user profile
- `GET /api/user/profile/{user_id}` - Get user profile

## Demo Data
- 30-day workout history with 75% completion rate
- 5 workout plans with real Unsplash images
- 8 achievement badges
- 5 daily/weekly challenges
- Motivational message fallbacks

## Prioritized Backlog

### P0 - Core functionality ✅ DONE
- Onboarding flow
- Home dashboard with progress rings
- Workout plans with detail modal
- AI coach chat
- Progress analytics
- Profile with theme toggle

### P1 - Next Phase Features
- [ ] Workout session timer (full-screen exercise timer with countdown)
- [ ] Real push notifications for workout reminders
- [ ] Weight/body metrics logging (manual input)
- [ ] Workout calendar view
- [ ] Video exercise demonstrations

### P2 - Enhancement
- [ ] Social challenges (compete with friends)
- [ ] Wearable device integration (Apple Watch, Fitbit)
- [ ] Nutrition tracking with calorie counter
- [ ] AI meal plan generator
- [ ] Personalized workout plan generation via AI

## Test Credentials
No authentication required.
- Onboarding: Click Continue 3 times → home screen
- Demo User: Alex | 12-day streak | 47 workouts | 75kg
- Backend: https://mobile-react-build-4.preview.emergentagent.com/api/health
