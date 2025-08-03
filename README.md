# Network School Fitness

A modern, comprehensive fitness tracking web application built for the Network School community. Track your meals, workouts, water intake, and monitor your health goals with personalized insights and recommendations.

🚀 **Live Demo**: [https://network-school-fitness.vercel.app/](https://network-school-fitness.vercel.app/)

## ✨ Features

### 🍎 **Comprehensive Food Logging**
- **Multi-step meal logging** with categorized food databases (Cafe, Lunch, Dinner)
- **Day-specific menus** with detailed nutritional information
- **Multi-item ordering system** for complex meals
- **AI-generated food photography** for visual meal tracking
- **Real-time macro tracking** (calories, protein, carbs, fat, fiber)

### 🏋️ **Workout Tracking**
- **Multiple workout types**: Strength, Cardio, Flexibility, Sports, HIIT, Yoga
- **Intensity-based calorie calculation** using MET values
- **Personalized calorie burn** based on user profile (weight, duration, intensity)
- **Workout history and progress tracking**

### 💧 **Smart Water Tracking**
- **Personalized daily water goals** based on body weight and activity level
- **Science-based hydration recommendations** (67% body weight formula)
- **Activity level adjustments** and workout bonuses
- **Animated water bottle visualization** with progress tracking
- **Hydration streak counter** and achievement system

### 📊 **Intelligent Dashboard**
- **Real-time progress monitoring** with color-coded circular progress indicators
- **Deficit-based goal tracking** for sustainable weight management
- **Weekly progress analysis** with last 3 days breakdown
- **Dynamic statistics** that adapt to user activity

### ⚙️ **Personalized Onboarding**
- **Comprehensive user profiling** (age, gender, weight, height, activity level)
- **BMR and TDEE calculations** using Mifflin-St Jeor equation
- **Custom calorie deficit goals** with health recommendations
- **Workout vs diet split customization** for personalized plans

### 🎨 **Modern User Experience**
- **Dark/Light theme support** with consistent branding
- **Floating quick-access button** for instant feature access
- **Smooth animations and transitions** throughout the app
- **Responsive design** optimized for all devices
- **Brand-consistent iconography** using Lucide React

## 🛠️ Tech Stack

### **Frontend**
- **React 19.1.1** - Modern React with latest features
- **JavaScript (ES6+)** - Modern JavaScript syntax and features
- **CSS-in-JS** - Inline styling with dynamic theming
- **Lucide React** - Consistent, beautiful icons

### **Animations & Interactions**
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **Custom CSS animations** - Keyframe animations for water effects
- **Interactive hover states** - Enhanced user feedback

### **Development Tools**
- **Create React App** - Zero-config React development environment
- **React Scripts 5.0.1** - Build tools and development server
- **ESLint** - Code quality and consistency
- **React Testing Library** - Component testing utilities

### **Deployment**
- **Vercel** - Serverless deployment platform
- **Automatic deployments** from GitHub integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/network-school-fitness.git
   cd network-school-fitness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📱 Key Components

### **Dashboard Architecture**
- **FitnessDashboard** - Main application container
- **StatsCard** - Reusable progress tracking components
- **CircularProgress** - Visual progress indicators with color coding

### **Feature Modals**
- **FoodLoggingModal** - Multi-step food selection and logging
- **WorkoutRecordingModal** - Comprehensive workout tracking
- **WaterTrackingModal** - Hydration monitoring with personalized goals
- **DeficitOnboarding** - Initial user setup and goal configuration

### **UI Components**
- **QuickAccessOverlay** - Floating action menu
- **MealCard** - Individual meal display with nutrition facts
- **CircularProgress** - Progress visualization with smart color coding

## 🎯 Core Features Deep Dive

### **Smart Calorie Deficit Tracking**
The app calculates personalized daily and weekly deficit goals based on:
- **BMR calculation** using Mifflin-St Jeor equation
- **TDEE adjustment** for activity level
- **Custom deficit targets** (200-1000 calories/day)
- **Workout vs diet split** customization

### **Personalized Water Goals**
Water recommendations are calculated using:
- **Base formula**: Body weight × 67%
- **Activity multipliers**: 1.0x to 1.4x based on activity level
- **Workout bonuses**: +12oz per 30 minutes of exercise
- **Environmental factors**: Hot weather adjustments

### **Intelligent Progress Tracking**
- **Red indicators**: >115% of goal (over-achievement warning)
- **Green indicators**: 85-115% of goal (optimal range)
- **Yellow indicators**: 40-85% of goal (moderate progress)
- **Default indicators**: <40% of goal (needs attention)

## 🎨 Design Philosophy

### **Brand Consistency**
- **Black and white theme** following Network School branding
- **Georgia serif fonts** for headers, system fonts for body text
- **Consistent iconography** using Lucide React icons
- **Minimal, clean design** with purposeful whitespace

### **User Experience**
- **Progressive disclosure** - Complex features broken into simple steps
- **Immediate feedback** - Real-time updates and visual confirmations
- **Contextual help** - Personalized tips and recommendations
- **Accessibility** - High contrast, proper touch targets, keyboard navigation

## 📈 Future Enhancements

- [ ] **Social features** - Share progress with Network School community
- [ ] **Advanced analytics** - Detailed progress charts and trends
- [ ] **Meal planning** - AI-powered meal suggestions
- [ ] **Integration APIs** - Connect with fitness wearables
- [ ] **Offline support** - Progressive Web App capabilities
- [ ] **Export functionality** - Data export for external analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Network School** - For the inspiration and community
- **Lucide React** - For the beautiful icon system
- **Framer Motion** - For smooth animations
- **Vercel** - For seamless deployment
- **Create React App** - For the solid foundation

---

**Built with ❤️ for the Network School community**

For questions, suggestions, or contributions, please open an issue or reach out to the development team.