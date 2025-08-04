import { useState, useEffect } from "react"
import StatsModal from "./StatsModal"
import { useAuth } from "../contexts/AuthContext"
import { 
  saveUserProfile, 
  getUserProfile, 
  saveMeal, 
  getUserMeals, 
  deleteMeal,
  saveWorkout, 
  getUserWorkouts,
  saveWaterLog, 
  getUserWaterLogs 
} from "../services/dataService"
import {
  Plus,
  Target,
  Camera,
  Clock,
  Star,
  Moon,
  Sun,
  Activity,
  Heart,
  Dumbbell,
  Apple,
  Droplets,
  Award,
  BarChart3,
  Timer,
  X,
  Search,
  Utensils,
  Edit,
  Trash2,
  User,
  Scale,
  Ruler,
  TrendingUp,
  TrendingDown,
  Zap,
  Calculator,
  ChevronRight,
  Move,
  Trophy,
  Coffee,
  Milk,
  FlaskConical,
  Info,
  ChevronDown
} from "lucide-react"

// Dark mode context
function useDarkMode() {
  const [isDark, setIsDark] = useState(false)
  const toggleDarkMode = () => setIsDark(!isDark)
  return { isDark, toggleDarkMode }
}

// Circular Progress Ring Component
function CircularProgress({ value, max, size = 120, strokeWidth = 8, label, unit, isDark = false }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = (animatedValue / max) * 100
  
  // Calculate progress for display (cap at 100% for visual, but show actual percentage in text)
  const displayPercentage = Math.min(percentage, 100)
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference

  // Determine color based on progress
  const getProgressColor = () => {
    if (percentage > 115) {
      return '#ef4444' // Red when over 115% of goal
    } else if (percentage >= 85 && percentage <= 115) {
      return '#22c55e' // Green when within ±15% of goal (85-115%)
    } else if (percentage >= 40 && percentage < 85) {
      return '#eab308' // Yellow when between 40% and 85% of goal
    } else {
      return isDark ? 'white' : 'black' // Default color
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div style={{ textAlign: 'left', margin: '32px' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg style={{ transform: 'rotate(-90deg)' }} width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? "#333333" : "#e5e7eb"}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
          />
        </svg>

        {/* Center content */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            {Math.round(animatedValue)}
          </div>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isDark ? '#cccccc' : '#6b7280',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {unit}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'left' }}>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: isDark ? 'white' : 'black',
          fontFamily: 'Georgia, "Times New Roman", Times, serif'
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: '12px',
          marginTop: '4px',
          color: isDark ? '#cccccc' : '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {Math.round(percentage)}% of goal • {Math.round(max - animatedValue)} remaining
        </div>
      </div>
    </div>
  )
}

// Enhanced Daily Summary
function EnhancedDailySummary({ isDark = false, totalIntake = 0, remaining = 0, optimizationScore = 0, avgProgress = 0, mealsLogged = 0 }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: isDark ? 'white' : 'black',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}>
            <Award style={{ width: '32px', height: '32px', color: isDark ? 'black' : 'white' }} />
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '32px',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            Daily Summary
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isDark ? '#ffffff' : '#374151',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Total Intake
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}>
              {totalIntake} cal
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isDark ? '#ffffff' : '#374151',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Remaining
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}>
              {remaining} cal
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isDark ? '#d1d5db' : '#374151',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Optimization Score
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}>
              {optimizationScore}/100
            </span>
          </div>

          <div style={{ 
            borderTop: `2px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
            paddingTop: '24px',
            marginTop: '32px'
          }}>
            <p style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '32px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              "Learn, Burn, Earn, and Fun"
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif'
                }}>
                  {avgProgress}%
                </div>
                <div style={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 'bold',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Avg Progress
                </div>
              </div>
              <div style={{ 
                borderLeft: `2px solid ${isDark ? '#4b5563' : '#d1d5db'}`
              }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif'
                }}>
                  {mealsLogged}
                </div>
                <div style={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 'bold',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Meals Logged
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
function StatsCard({ icon: Icon, title, value, change, isDark = false, userData = null, loggedMeals = [], loggedWorkouts = [], currentStreak = 0, netCalories = 0, weeklyProgress = 0 }) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate real data based on user inputs
  const getDetailedInfo = () => {
    const today = new Date().toDateString()
    const todayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === today)
    const todayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === today)
    
    switch (title) {
            case "Daily Deficit Goal":
        if (!userData?.dailyDeficit) {
        return {
            target: "Set Goals",
            remaining: "Complete setup",
            description: "Complete onboarding to set your deficit goals",
            breakdown: "Click 'Set up goals' to get started"
          }
        }
        
        // Check if there's activity today
        const hasActivity = todayMeals.length > 0 || todayWorkouts.length > 0
        
        if (!hasActivity) {
        return {
            target: `${userData.dailyDeficit} cal`,
            remaining: `${userData.dailyDeficit} cal`,
            description: `Daily calorie deficit goal (${((userData.dailyDeficit * 7) / 7700).toFixed(1)}kg/week)`,
            breakdown: "Start tracking to see your progress"
          }
        }
        
        const recommendedCalories = userData.recommendedCalories || 2200
        const caloriesConsumed = todayMeals.reduce((total, meal) => total + meal.calories, 0)
        const caloriesBurned = todayWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0)
        const currentDeficit = (recommendedCalories + caloriesBurned) - caloriesConsumed
        const targetDeficit = userData.dailyDeficit
        const deficitProgress = Math.max(0, Math.round((currentDeficit / targetDeficit) * 100))
        const remainingDeficit = Math.max(0, targetDeficit - currentDeficit)
        
        return {
          target: `${targetDeficit} cal`,
          remaining: `${remainingDeficit} cal`,
          description: `Daily calorie deficit goal (${((targetDeficit * 7) / 7700).toFixed(1)}kg/week)`,
          breakdown: `Eaten: ${caloriesConsumed} • Burned: ${caloriesBurned} • Target: ${recommendedCalories}`
        }
            case "Weekly Deficit Progress":
        if (!userData?.weeklyDeficit) {
        return {
            target: "Set Goals",
            remaining: "Complete setup",
            description: "Complete onboarding to set your weekly deficit goals",
            breakdown: "Weekly deficit tracking will appear here"
          }
        }
        
        // Check if there's any activity in the last 7 days
        let hasWeeklyActivity = false
        for (let i = 0; i < 7; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateString = date.toDateString()
          const dayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === dateString)
          const dayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === dateString)
          if (dayMeals.length > 0 || dayWorkouts.length > 0) {
            hasWeeklyActivity = true
            break
          }
        }
        
        if (!hasWeeklyActivity) {
          return {
            target: `${userData.weeklyDeficit} cal`,
            remaining: `${userData.weeklyDeficit} cal`,
            description: `Weekly calorie deficit progress (${((userData.weeklyDeficit) / 7700).toFixed(1)}kg target)`,
            breakdown: "Start tracking to see weekly progress"
          }
        }
        
        const weeklyRemaining = Math.max(0, 100 - weeklyProgress)
        const targetWeeklyDeficit = userData.weeklyDeficit
        const achievedWeeklyDeficit = Math.round((weeklyProgress / 100) * targetWeeklyDeficit)
        const remainingWeeklyDeficit = Math.max(0, targetWeeklyDeficit - achievedWeeklyDeficit)
        
        // Calculate daily deficit for the last 3 days
        const todayDate = new Date()
        const getDayDeficit = (daysAgo) => {
          const targetDate = new Date(todayDate.getTime() - daysAgo * 24 * 60 * 60 * 1000)
          const dayString = targetDate.toDateString()
          
          const dayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === dayString)
          const dayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === dayString)
          
          // Only calculate deficit if there's actual activity
          const hasActivity = dayMeals.length > 0 || dayWorkouts.length > 0
          
          if (!hasActivity) {
            return 0 // No activity = no deficit
          }
          
          const dayConsumed = dayMeals.reduce((total, meal) => total + meal.calories, 0)
          const dayBurned = dayWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0)
          const dayDeficit = Math.max(0, (userData.recommendedCalories + dayBurned) - dayConsumed)
          
          return Math.round(dayDeficit)
        }
        
        const getDayName = (daysAgo) => {
          const targetDate = new Date(todayDate.getTime() - daysAgo * 24 * 60 * 60 * 1000)
          return targetDate.toLocaleDateString('en-US', { weekday: 'short' })
        }
        
        const day3Deficit = getDayDeficit(3)
        const day2Deficit = getDayDeficit(2)
        const day1Deficit = getDayDeficit(1)
        
        const day3Name = getDayName(3)
        const day2Name = getDayName(2)
        const day1Name = getDayName(1)
        
        return {
          target: `${targetWeeklyDeficit} cal`,
          remaining: `${remainingWeeklyDeficit} cal`,
          description: `Weekly calorie deficit progress (${((targetWeeklyDeficit) / 7700).toFixed(1)}kg target)`,
          breakdown: `${day3Name}: ${day3Deficit} • ${day2Name}: ${day2Deficit} • ${day1Name}: ${day1Deficit}`
        }
      case "Workout Progress":
        if (!userData?.workoutCalories) {
          return {
            target: "Set Goals",
            remaining: "Complete setup",
            description: "Complete onboarding to set your workout goals",
            breakdown: "Workout targets will appear here"
          }
        }
        
        // Check if there are workouts today
        const hasWorkouts = todayWorkouts.length > 0
        
        if (!hasWorkouts) {
          return {
            target: `${userData.workoutCalories} cal`,
            remaining: `${userData.workoutCalories} cal`,
            description: `Daily workout calorie target (${userData.workoutSplit}% of deficit goal)`,
            breakdown: "Start logging workouts to see progress"
          }
        }
        
        const totalBurned = todayWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0)
        const targetWorkoutCalories = userData.workoutCalories
        const remainingWorkoutCalories = Math.max(0, targetWorkoutCalories - totalBurned)
        const workoutProgress = Math.round((totalBurned / targetWorkoutCalories) * 100)
        
        // Calculate breakdown by workout type
        const cardioWorkouts = todayWorkouts.filter(w => w.type === 'cardio')
        const strengthWorkouts = todayWorkouts.filter(w => w.type === 'strength')
        const otherWorkouts = todayWorkouts.filter(w => !['cardio', 'strength'].includes(w.type))
        
        const cardioBurned = cardioWorkouts.reduce((total, w) => total + w.caloriesBurned, 0)
        const strengthBurned = strengthWorkouts.reduce((total, w) => total + w.caloriesBurned, 0)
        const otherBurned = otherWorkouts.reduce((total, w) => total + w.caloriesBurned, 0)
        
        return {
          target: `${targetWorkoutCalories} cal`,
          remaining: `${remainingWorkoutCalories} cal`,
          description: `Daily workout calorie target (${userData.workoutSplit}% of deficit goal)`,
          breakdown: `Cardio: ${cardioBurned} • Strength: ${strengthBurned} • Other: ${otherBurned}`
        }
              case "Calorie Deficit":
        if (!userData?.recommendedCalories) {
          return {
            target: "Set Goals",
            remaining: "Complete setup",
            description: "Complete onboarding to set your calorie targets",
            breakdown: "Calorie tracking will appear here"
          }
        }
        
        const recommendedCals = userData.recommendedCalories
        const consumedCals = todayMeals.reduce((total, meal) => total + meal.calories, 0)
        const burnedCals = todayWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0)
        const remainingCals = Math.round(recommendedCals + burnedCals - consumedCals)
        
        const status = remainingCals > 0 ? "Can eat" : "Over limit"
        const absRemaining = Math.abs(remainingCals)
        
        return {
          target: `${recommendedCals} cal`,
          remaining: remainingCals >= 0 ? `${remainingCals} cal` : `${absRemaining} over`,
          description: `Daily calorie allowance (${((userData.dailyDeficit || 0) * 7 / 7700).toFixed(1)}kg/week goal)`,
          breakdown: `Base: ${recommendedCals} • Eaten: ${consumedCals} • Burned: ${burnedCals}`
        }
      default:
        return { target: "100%", remaining: "0%", description: "", breakdown: "" }
    }
  }

  const detailedInfo = getDetailedInfo()

  return (
    <div 
      style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: '24px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: isDark ? 'white' : 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}>
          <Icon style={{ width: '24px', height: '24px', color: isDark ? 'black' : 'white' }} strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{
          fontSize: '30px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: isDark ? 'white' : 'black',
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease'
        }}>
          {value}
        </h3>
        <p style={{
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: isDark ? '#cccccc' : '#6b7280',
          marginBottom: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {title}
        </p>
        <p style={{
          fontSize: '12px',
          color: isDark ? '#cccccc' : '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          TARGET: {detailedInfo.target} • {detailedInfo.remaining} TO GO
        </p>
      </div>

      {/* Hover overlay with detailed info */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 10,
          backdropFilter: 'blur(4px)'
        }}>
          <h4 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            {title}
          </h4>
          <p style={{
            fontSize: '14px',
            marginBottom: '16px',
            color: isDark ? '#d1d5db' : '#374151',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {detailedInfo.description}
          </p>
          <div style={{
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.5'
          }}>
            {detailedInfo.breakdown}
          </div>
        </div>
      )}
    </div>
  )
}

// Dark Mode Toggle
function DarkModeToggle({ isDark, toggleDarkMode }) {
  return (
    <button
      onClick={toggleDarkMode}
      style={{
        padding: '12px',
        backgroundColor: isDark ? 'white' : 'black',
        color: isDark ? 'black' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ transition: 'transform 0.3s ease', transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        {isDark ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
      </div>
    </button>
  )
}

// Floating Action Button
function FloatingActionButton({ isDark = false }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
      <button 
        style={{
          width: '64px',
          height: '64px',
          backgroundColor: isDark ? 'white' : 'black',
          border: `2px solid ${isDark ? 'white' : 'black'}`,
          color: isDark ? 'black' : 'white',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1) rotate(90deg)' : 'scale(1) rotate(0deg)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Plus style={{ width: '32px', height: '32px' }} strokeWidth={3} />
      </button>
    </div>
  )
}

// Meal Card Component
function MealCard({ meal, isDark = false, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)

  // Nutrition facts for each meal
  const getNutritionFacts = () => {
    // Use actual meal data if available
    if (meal.calories !== undefined) {
      return {
        protein: `${(meal.protein || 0).toFixed(1)}g`,
        carbs: `${(meal.carbs || 0).toFixed(1)}g`,
        fat: `${(meal.fat || 0).toFixed(1)}g`,
        fiber: `${(meal.fiber || 0).toFixed(1)}g`,
        totalCalories: `${Math.round(meal.calories || 0)}`
      }
    }
    
    // Fallback for legacy hardcoded meals
    switch (meal.meal) {
      case "Avocado Toast":
        return {
          protein: "12g",
          carbs: "28g", 
          fat: "18g",
          fiber: "10g",
          totalCalories: "320"
        }
      case "Grilled Salmon":
        return {
          protein: "45g",
          carbs: "8g",
          fat: "22g", 
          fiber: "3g",
          totalCalories: "450"
        }
      case "Protein Smoothie":
        return {
          protein: "25g",
          carbs: "35g",
          fat: "8g",
          fiber: "5g", 
          totalCalories: "280"
        }
      default:
        return { protein: "0g", carbs: "0g", fat: "0g", fiber: "0g", totalCalories: "0" }
    }
  }

  // Function to get appropriate food image based on meal name
  const getFoodImage = (mealName) => {
    const lowerMeal = mealName.toLowerCase()
    
    // Verified Unsplash URLs with correct food images
    const foodImageMap = {
      // Exact matches first (most specific)
      'multigrain rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=200&fit=crop&crop=center',
      'sweet potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=200&fit=crop&crop=center',
      'sweet potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=200&fit=crop&crop=center',
      
      // Rice dishes
      'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=200&fit=crop&crop=center',
      'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=200&fit=crop&crop=center',
      'brown rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=200&fit=crop&crop=center',
      'white rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=200&fit=crop&crop=center',
      
      // Vegetables
      'broccoli': 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&h=200&fit=crop&crop=center',
      'carrots': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=200&fit=crop&crop=center',
      'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=200&fit=crop&crop=center',
      'kale': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=200&fit=crop&crop=center',
      
      // Salads
      'caesar salad': 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=200&fit=crop&crop=center',
      'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop&crop=center',
      'green salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop&crop=center',
      'chicken salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=200&fit=crop&crop=center',
      
      // Protein dishes
      'grilled salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=200&fit=crop&crop=center',
      'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=200&fit=crop&crop=center',
      'grilled chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=200&fit=crop&crop=center',
      'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=200&fit=crop&crop=center',
      'beef': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop&crop=center',
      'turkey': 'https://images.unsplash.com/photo-1549388604-817d15aa0968?w=400&h=200&fit=crop&crop=center',
      
      // Sandwiches & Wraps
      'turkey sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=200&fit=crop&crop=center',
      'sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=200&fit=crop&crop=center',
      'quesadilla': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center',
      'wrap': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center',
      
      // Bowls
      'salmon bowl': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop&crop=center',
      'quinoa bowl': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop&crop=center',
      'power bowl': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop&crop=center',
      'bowl': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop&crop=center',
      'quinoa': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=200&fit=crop&crop=center',
      
      // Pasta
      'pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=200&fit=crop&crop=center',
      'spaghetti': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=200&fit=crop&crop=center',
      
      // Breakfast
      'avocado toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=200&fit=crop&crop=center',
      'toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=200&fit=crop&crop=center',
      'oatmeal': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=200&fit=crop&crop=center',
      'eggs': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=200&fit=crop&crop=center',
      
      // Beverages & Snacks
      'mixed berries smoothies': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=200&fit=crop&crop=center',
      'protein smoothie': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=200&fit=crop&crop=center',
      'smoothie': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=200&fit=crop&crop=center',
      'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=200&fit=crop&crop=center',
      'fruit': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=200&fit=crop&crop=center',
      
      // Specific protein preparations
      'minced beef': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop&crop=center',
      'ribeye': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop&crop=center',
      'chicken breast': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=200&fit=crop&crop=center',
      'omelette': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=200&fit=crop&crop=center',
      'kebab': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=200&fit=crop&crop=center',
      'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=200&fit=crop&crop=center'
    }
    
    // Find the most specific match first
    const sortedKeys = Object.keys(foodImageMap).sort((a, b) => b.length - a.length)
    
    for (const key of sortedKeys) {
      if (lowerMeal.includes(key)) {
        return foodImageMap[key]
      }
    }
    
    // Default healthy food image if no match found
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=200&fit=crop&crop=center'
  }

  const nutritionFacts = getNutritionFacts()

  return (
    <div 
      style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.01) translateY(-4px)' : 'scale(1) translateY(0)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: 'relative', height: '128px', overflow: 'hidden' }}>
        <div style={{
          width: '100%',
          height: '100%',
           backgroundImage: `url("${getFoodImage(meal.meal)}")`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
                      
        </div>
         <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: isDark ? '#000000' : 'white',
          color: isDark ? 'white' : 'black',
          border: `2px solid ${isDark ? 'white' : 'black'}`,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Clock style={{ width: '12px', height: '12px' }} />
          {meal.time}
        </div>


      </div>

      <div style={{ padding: '16px' }}>
        <h4 style={{
          fontWeight: 'bold',
          marginBottom: '8px',
          color: isDark ? 'white' : 'black',
          fontFamily: 'Georgia, "Times New Roman", Times, serif'
        }}>
          {meal.meal}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isDark ? '#cccccc' : '#6b7280',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {meal.calories} CAL
          </span>
                    <button 
            onClick={(e) => {
              e.stopPropagation()
              if (onDelete) onDelete(meal)
            }}
            style={{
              color: '#ef4444',
              border: '2px solid #ef4444',
            backgroundColor: isDark ? '#000000' : 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 12px',
              fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ef4444'
              e.target.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? '#000000' : 'white'
              e.target.style.color = '#ef4444'
            }}
          >
            <Trash2 style={{ width: '12px', height: '12px' }} />
            Delete
          </button>
        </div>
      </div>

      {/* Hover overlay with nutrition facts */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '48px', // Adjusted to leave exact space for button area
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.98)' : 'rgba(255, 255, 255, 0.98)',
          borderRadius: '8px 8px 0 0',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 15,
          pointerEvents: 'none',
          backdropFilter: 'blur(4px)' // Increased blur for better coverage
        }}>

          
          {/* Calories - Featured */}
          <div style={{
            textAlign: 'center',
            padding: '12px',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            borderRadius: '6px',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
              lineHeight: '1'
            }}>
              {nutritionFacts.totalCalories}
            </div>
            <div style={{
              fontSize: '11px',
              color: isDark ? '#cccccc' : '#666666',
              fontWeight: '500',
                textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '4px'
            }}>
              Calories
            </div>
          </div>

          {/* Macros Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6px'
          }}>
            {/* Protein */}
            <div style={{
              textAlign: 'center',
              padding: '6px',
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                lineHeight: '1'
              }}>
                {nutritionFacts.protein}
            </div>
              <div style={{
                fontSize: '10px',
                color: isDark ? '#cccccc' : '#666666',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '2px'
              }}>
                Protein
              </div>
            </div>

            {/* Carbs */}
            <div style={{
              textAlign: 'center',
              padding: '6px',
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                lineHeight: '1'
              }}>
                {nutritionFacts.carbs}
            </div>
              <div style={{
                fontSize: '10px',
                color: isDark ? '#cccccc' : '#666666',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '2px'
              }}>
                Carbs
              </div>
            </div>

            {/* Fat */}
            <div style={{
              textAlign: 'center',
              padding: '6px',
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                lineHeight: '1'
              }}>
                {nutritionFacts.fat}
            </div>
              <div style={{
                fontSize: '10px',
                color: isDark ? '#cccccc' : '#666666',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '2px'
              }}>
                Fat
              </div>
            </div>

            {/* Fiber */}
            <div style={{
              textAlign: 'center',
              padding: '6px',
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                lineHeight: '1'
              }}>
                {nutritionFacts.fiber}
            </div>
            <div style={{
                fontSize: '10px',
                color: isDark ? '#cccccc' : '#666666',
                fontWeight: '500',
                  textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '2px'
              }}>
                Fiber
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({ action, isDark = false, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      style={{
        padding: '24px',
        backgroundColor: isHovered ? (isDark ? 'white' : 'black') : (isDark ? '#000000' : 'white'),
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        color: isHovered ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '4px',
        transform: isHovered ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <action.icon
        style={{ width: '32px', height: '32px', margin: '0 auto 12px', display: 'block' }}
        strokeWidth={2.5}
      />
      <p style={{
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {action.label}
      </p>
    </button>
  )
}

// Workout Recording Modal Component
function WorkoutRecordingModal({ isOpen, onClose, isDark = false, userProfile, onWorkoutRecorded }) {
  const [workoutType, setWorkoutType] = useState("strength")
  const [duration, setDuration] = useState(30)
  const [intensity, setIntensity] = useState("moderate")
  const [notes, setNotes] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]) // YYYY-MM-DD format

  const workoutTypes = [
    { id: "strength", name: "Strength Training", icon: Dumbbell },
    { id: "cardio", name: "Cardio", icon: Heart },
    { id: "flexibility", name: "Flexibility", icon: Move },
    { id: "sports", name: "Sports", icon: Trophy },
    { id: "hiit", name: "HIIT", icon: Zap },
    { id: "yoga", name: "Yoga", icon: User }
  ]

  const intensityLevels = [
    { id: "light", name: "Light", description: "Easy pace, can talk easily" },
    { id: "moderate", name: "Moderate", description: "Steady pace, can talk but not sing" },
    { id: "vigorous", name: "Vigorous", description: "Fast pace, hard to talk" },
    { id: "maximum", name: "Maximum", description: "All-out effort, can't talk" }
  ]

  const calculateCaloriesBurned = () => {
    if (!userProfile?.weight) return 0
    
    const weightKg = parseFloat(userProfile.weight) // Already in kg
    const durationHours = duration / 60
    
    // MET values for different workout types and intensities
    const metValues = {
      strength: { light: 3.5, moderate: 5.0, vigorous: 6.0, maximum: 8.0 },
      cardio: { light: 4.5, moderate: 7.0, vigorous: 10.0, maximum: 12.0 },
      flexibility: { light: 2.5, moderate: 3.0, vigorous: 4.0, maximum: 5.0 },
      sports: { light: 4.0, moderate: 6.0, vigorous: 8.0, maximum: 10.0 },
      hiit: { light: 6.0, moderate: 8.0, vigorous: 12.0, maximum: 15.0 },
      yoga: { light: 2.5, moderate: 3.5, vigorous: 4.5, maximum: 6.0 }
    }
    
    const met = metValues[workoutType]?.[intensity] || 5.0
    const caloriesBurned = weightKg * met * durationHours
    
    return Math.round(caloriesBurned)
  }

  const handleRecordWorkout = () => {
    const caloriesBurned = calculateCaloriesBurned()
    
    // Create timestamp from selected date (set to current time on that date)
    const selectedDateTime = new Date(selectedDate)
    selectedDateTime.setHours(new Date().getHours())
    selectedDateTime.setMinutes(new Date().getMinutes())
    
    const workoutData = {
      type: workoutType,
      duration,
      intensity,
      notes,
      caloriesBurned,
      timestamp: selectedDateTime.toISOString()
    }
    
    // Call the callback to update the dashboard
    if (onWorkoutRecorded) {
      onWorkoutRecorded(workoutData)
    }
    
    onClose()
    setWorkoutType("strength")
    setDuration(30)
    setIntensity("moderate")
    setNotes("")
    setSelectedDate(new Date().toISOString().split('T')[0]) // Reset to today
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            Record Your Workout
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              color: isDark ? 'white' : 'black'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Date Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Workout Date
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              backgroundColor: isDark ? '#000000' : 'white',
              color: isDark ? 'white' : 'black',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          />
        </div>

        {/* Workout Type */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black'
          }}>
            Workout Type
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {workoutTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setWorkoutType(type.id)}
                style={{
                  padding: '16px',
                  border: `2px solid ${workoutType === type.id ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb')}`,
                  backgroundColor: workoutType === type.id ? (isDark ? 'white' : 'black') : 'transparent',
                  color: workoutType === type.id ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <type.icon size={24} />
                <span style={{ fontSize: '14px' }}>{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black'
          }}>
            Duration (minutes)
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => setDuration(Math.max(5, duration - 5))}
              style={{
                padding: '8px 16px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                backgroundColor: isDark ? '#000000' : 'white',
                color: isDark ? 'white' : 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              -
            </button>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              minWidth: '80px',
              textAlign: 'center'
            }}>
              {duration}
            </span>
            <button
              onClick={() => setDuration(duration + 5)}
              style={{
                padding: '8px 16px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                backgroundColor: isDark ? '#000000' : 'white',
                color: isDark ? 'white' : 'black',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              +
            </button>
            <span style={{
              fontSize: '14px',
              color: isDark ? '#cccccc' : '#6b7280'
            }}>
              minutes
            </span>
          </div>
          
          {/* Calorie Estimate */}
          <div style={{
            marginTop: '12px',
            padding: '12px',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '8px',
            backgroundColor: isDark ? '#111111' : '#f9f9f9',
            textAlign: 'center'
          }}>
            {userProfile?.weight ? (
              <>
                <div style={{
                  fontSize: '14px',
                  color: isDark ? '#cccccc' : '#666666',
                  marginBottom: '4px'
                }}>
                  Estimated Calories Burned
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black'
                }}>
                  {calculateCaloriesBurned()} cal
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: '14px',
                  color: isDark ? '#cccccc' : '#666666',
                  marginBottom: '4px'
                }}>
                  Complete Onboarding First
                </div>
                <div style={{
                  fontSize: '16px',
                  color: isDark ? '#a3a3a3' : '#6b7280',
                  fontStyle: 'italic'
                }}>
                  Add your weight to get calorie estimates
                </div>
              </>
            )}
          </div>
        </div>

        {/* Intensity */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black'
          }}>
            Intensity Level
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {intensityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setIntensity(level.id)}
                style={{
                  padding: '12px',
                  border: `2px solid ${intensity === level.id ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb')}`,
                  backgroundColor: intensity === level.id ? (isDark ? 'white' : 'black') : 'transparent',
                  color: intensity === level.id ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {level.name}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black'
          }}>
            Notes (Optional)
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did your workout feel? Any notes..."
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              backgroundColor: isDark ? '#000000' : 'white',
              color: isDark ? 'white' : 'black',
              fontSize: '16px',
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Record Button */}
        <button
          onClick={handleRecordWorkout}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isDark ? 'white' : 'black',
            color: isDark ? 'black' : 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Record Workout
        </button>
      </div>
    </div>
  )
}

// Food Logging Modal Component
function FoodLoggingModal({ isOpen, onClose, isDark = false, onMealLogged }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFood, setSelectedFood] = useState(null)
  const [servingSize, setServingSize] = useState(1)
  const [mealType, setMealType] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]) // YYYY-MM-DD format
  const [selectedDay, setSelectedDay] = useState("")
  const [showMealTypeSelection, setShowMealTypeSelection] = useState(true)
  const [showDaySelection, setShowDaySelection] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]) // For multiple item selection
  const [multiSelectMode, setMultiSelectMode] = useState(false) // Toggle for multi-select mode
  const [selectedForBatch, setSelectedForBatch] = useState([]) // Items selected for batch add

  // Effect to reset modal when opening for new meal
  useEffect(() => {
    if (isOpen) {
      // Reset to initial state when opening for new meal
      setMealType("")
      setSelectedDate(new Date().toISOString().split('T')[0]) // Reset to today
      setShowMealTypeSelection(true)
      setShowDaySelection(false)
      setSelectedFood(null)
      setServingSize(1)
      setSearchQuery("")
      setSelectedItems([])
      setMultiSelectMode(false)
      setSelectedForBatch([])
    }
  }, [isOpen])

  // Cafe food database (from your provided data)
  const cafeFoodDatabase = [
    { id: 1, name: "Caesar Salad", calories: 345.7, protein: 44.1, carbs: 2.4, fat: 17.7, fiber: 0.4, serving: "1 serving" },
    { id: 2, name: "Quesadilla with Mixed Green - Smoked Salmon", calories: 659.2, protein: 36.2, carbs: 41.1, fat: 38.3, fiber: 5.3, serving: "1 serving" },
    { id: 3, name: "Quesadilla with Mixed Green - Minced Beef", calories: 673.2, protein: 40.4, carbs: 41.1, fat: 38.0, fiber: 5.3, serving: "1 serving" },
    { id: 4, name: "Quesadilla with Mixed Green - Ribeye", calories: 761.9, protein: 50.4, carbs: 41.1, fat: 43.4, fiber: 5.3, serving: "1 serving" },
    { id: 5, name: "Quesadilla with Mixed Green - Chicken Breast", calories: 642.6, protein: 51.5, carbs: 41.1, fat: 29.5, fiber: 5.3, serving: "1 serving" },
    { id: 6, name: "Spinach Omelette on Toast - Mushroom", calories: 496.7, protein: 24.5, carbs: 15.0, fat: 37.7, fiber: 2.1, serving: "1 serving" },
    { id: 7, name: "Spinach Omelette on Toast - Chicken breast", calories: 619.2, protein: 51.2, carbs: 14.3, fat: 39.6, fiber: 2.0, serving: "1 serving" },
    { id: 8, name: "Avocado Toast with Eggs", calories: 936.6, protein: 32.8, carbs: 99.3, fat: 47.6, fiber: 15.6, serving: "1 serving" },
    { id: 9, name: "NS Breakfast Plate", calories: 681.0, protein: 44.4, carbs: 9.1, fat: 53.2, fiber: 6.6, serving: "1 serving" },
    { id: 10, name: "Buddha Bowl", calories: 705.2, protein: 26.7, carbs: 92.9, fat: 27.7, fiber: 25.3, serving: "1 serving" },
    { id: 11, name: "Mexican Burrito Bowl", calories: 539.8, protein: 49.0, carbs: 62.9, fat: 11.1, fiber: 18.2, serving: "1 serving" },
    { id: 12, name: "Prawn Mustard Salad", calories: 278.9, protein: 27.9, carbs: 10.8, fat: 14.9, fiber: 8.2, serving: "1 serving" },
    { id: 13, name: "Steak Salad Bowl", calories: 506.7, protein: 39.3, carbs: 16.6, fat: 31.3, fiber: 2.6, serving: "1 serving" },
    { id: 14, name: "Steak Sandwich", calories: 829.0, protein: 52.4, carbs: 70.2, fat: 38.3, fiber: 5.0, serving: "1 serving" },
    { id: 15, name: "Naked Steak Sandwich", calories: 409.2, protein: 31.6, carbs: 7.6, fat: 28.6, fiber: 2.3, serving: "1 serving" },
    { id: 16, name: "Yogurt Parfait", calories: 345.1, protein: 10.0, carbs: 30.3, fat: 20.5, fiber: 4.2, serving: "1 serving" },
    { id: 17, name: "Mixed Berries Smoothies", calories: 180.9, protein: 18.2, carbs: 16.1, fat: 5.5, fiber: 4.8, serving: "1 serving" },
    { id: 18, name: "Matcha Avo", calories: 297.5, protein: 20.7, carbs: 20.2, fat: 16.2, fiber: 6.8, serving: "1 serving" },
    { id: 19, name: "Espresso Cauli", calories: 352.7, protein: 26.1, carbs: 15.6, fat: 21.4, fiber: 14.3, serving: "1 serving" },
    { id: 20, name: "Green Power 2.0", calories: 212.6, protein: 20.1, carbs: 9.9, fat: 10.8, fiber: 4.6, serving: "1 serving" },
    { id: 21, name: "Almond Butter Avocado", calories: 363.7, protein: 23.1, carbs: 13.4, fat: 26.5, fiber: 7.4, serving: "1 serving" },
  ]

  // Lunch food database (organized by day)
  const lunchFoodDatabase = {
    monday: [
      { id: 101, name: "Quinoa", calories: 171.9, protein: 6.6, carbs: 30.0, fat: 2.8, fiber: 3.3, serving: "130g" },
      { id: 102, name: "Parsley and Green Chili Baked Chicken Breast", calories: 164.5, protein: 25.8, carbs: 1.0, fat: 6.2, fiber: 0.2, serving: "100g" },
      { id: 103, name: "Parsley and Green Chili Baked Minced Beef", calories: 247.3, protein: 23.3, carbs: 1.0, fat: 16.8, fiber: 0.2, serving: "100g" },
      { id: 104, name: "Sticky Sesame Chickpeas, Potato and Tofu", calories: 196.6, protein: 10.6, carbs: 25.6, fat: 5.8, fiber: 4.9, serving: "150g" },
      { id: 105, name: "Sticky Sesame 3-Bean & Potato", calories: 211.3, protein: 10.7, carbs: 30.0, fat: 4.3, fiber: 12.3, serving: "150g" },
      { id: 106, name: "Roasted Broccoli and Red Onion", calories: 69.9, protein: 2.5, carbs: 11.1, fat: 1.4, fiber: 3.1, serving: "100g" },
      { id: 107, name: "Pumpkin Seeds", calories: 57.0, protein: 1.5, carbs: 3.0, fat: 4.6, fiber: 0.3, serving: "1 tbsp" },
      { id: 108, name: "Greek Yogurt", calories: 73.2, protein: 2.5, carbs: 2.9, fat: 5.6, fiber: 0.0, serving: "60ml" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ],
    tuesday: [
      { id: 201, name: "Mexican Tomato Rice", calories: 163.4, protein: 3.9, carbs: 40.3, fat: 0.7, fiber: 0.5, serving: "130g" },
      { id: 202, name: "Mexican Spiced Chicken Thigh", calories: 326.0, protein: 24.1, carbs: 0.9, fat: 25.2, fiber: 0.4, serving: "100g" },
      { id: 203, name: "Beef Bulgogi", calories: 203.0, protein: 20.4, carbs: 2.5, fat: 12.3, fiber: 0.9, serving: "100g" },
      { id: 204, name: "Mexican Scrambled Tofu with Beans", calories: 121.9, protein: 10.5, carbs: 10.3, fat: 4.1, fiber: 3.5, serving: "150g" },
      { id: 205, name: "Mexican 3-Bean Chili", calories: 165.5, protein: 8.7, carbs: 21.4, fat: 3.8, fiber: 8.1, serving: "150g" },
      { id: 206, name: "Tomato Avocado Salsa & Roasted Bell Pepper", calories: 70.2, protein: 1.6, carbs: 5.1, fat: 4.7, fiber: 3.5, serving: "100g" },
      { id: 207, name: "Pumpkin Seeds", calories: 57.0, protein: 1.5, carbs: 3.0, fat: 4.6, fiber: 0.3, serving: "1 tbsp" },
      { id: 208, name: "Greek Yogurt", calories: 73.2, protein: 2.5, carbs: 2.9, fat: 5.6, fiber: 0.0, serving: "60ml" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ],
    wednesday: [
      { id: 301, name: "Whole Wheat Pasta", calories: 201.0, protein: 7.2, carbs: 32.5, fat: 5.5, fiber: 4.8, serving: "130g" },
      { id: 302, name: "Multigrain Rice", calories: 144.0, protein: 3.3, carbs: 29.9, fat: 1.2, fiber: 2.3, serving: "130g" },
      { id: 303, name: "Mixed Herbs Baked Chicken Breast", calories: 141.3, protein: 26.8, carbs: 1.2, fat: 3.2, fiber: 0.3, serving: "100g" },
      { id: 304, name: "Mixed Herbs Beef Minced", calories: 246.7, protein: 24.7, carbs: 3.5, fat: 16.0, fiber: 0.8, serving: "100g" },
      { id: 305, name: "Mixed Herbs Pesto Paneer", calories: 296.6, protein: 16.0, carbs: 4.7, fat: 23.1, fiber: 1.2, serving: "100g" },
      { id: 306, name: "Mixed Herbs Baked 3-Bean", calories: 302.7, protein: 14.5, carbs: 30.8, fat: 11.1, fiber: 12.7, serving: "150g" },
      { id: 307, name: "Roasted Broccoli and Shiitake Mushroom", calories: 69.0, protein: 3.5, carbs: 11.5, fat: 2.2, fiber: 3.8, serving: "100g" },
      { id: 308, name: "Sunflower Seeds", calories: 68.8, protein: 2.7, carbs: 0.3, fat: 6.1, fiber: 1.3, serving: "1 tbsp" },
      { id: 309, name: "Pesto Sauce", calories: 135.1, protein: 4.0, carbs: 10.0, fat: 9.1, fiber: 3.6, serving: "60ml" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ],
    thursday: [
      { id: 401, name: "Lentils", calories: 128.8, protein: 7.8, carbs: 19.5, fat: 0.7, fiber: 6.9, serving: "130g" },
      { id: 402, name: "Tomato Curry Chicken Breast", calories: 156.4, protein: 27.6, carbs: 2.9, fat: 3.7, fiber: 0.7, serving: "100g" },
      { id: 403, name: "Tomato Curry Beef", calories: 247.2, protein: 24.8, carbs: 6.2, fat: 13.3, fiber: 1.0, serving: "100g" },
      { id: 404, name: "Tomato Curry Tofu & Tempeh", calories: 258.2, protein: 17.4, carbs: 8.5, fat: 17.0, fiber: 4.1, serving: "150g" },
      { id: 405, name: "3-Bean Tomato Curry", calories: 253.5, protein: 14.0, carbs: 34.0, fat: 4.2, fiber: 12.6, serving: "150g" },
      { id: 406, name: "Indian Curry Eggplant", calories: 46.5, protein: 1.8, carbs: 6.0, fat: 1.6, fiber: 1.2, serving: "100g" },
      { id: 407, name: "Pumpkin Seeds", calories: 57.0, protein: 1.5, carbs: 3.0, fat: 4.6, fiber: 0.3, serving: "1 tbsp" },
      { id: 408, name: "Lemon Wedge", calories: 4.2, protein: 0.2, carbs: 1.3, fat: 0.1, fiber: 0.4, serving: "1 wedge" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ],
    friday: [
      { id: 501, name: "Buckwheat Noodles", calories: 169.0, protein: 6.5, carbs: 27.3, fat: 4.6, fiber: 2.0, serving: "130g" },
      { id: 502, name: "Multigrain Rice", calories: 144.0, protein: 3.3, carbs: 29.9, fat: 1.2, fiber: 2.3, serving: "130g" },
      { id: 503, name: "Paprika Chicken Breast", calories: 153.4, protein: 25.1, carbs: 1.4, fat: 5.3, fiber: 0.5, serving: "100g" },
      { id: 504, name: "Paprika Beef", calories: 332.6, protein: 24.7, carbs: 6.5, fat: 23.5, fiber: 0.7, serving: "100g" },
      { id: 505, name: "Teriyaki Tofu", calories: 213.0, protein: 14.9, carbs: 7.0, fat: 14.0, fiber: 0.7, serving: "150g" },
      { id: 506, name: "Paprika Tomato Paneer", calories: 258.7, protein: 16.6, carbs: 12.3, fat: 15.0, fiber: 1.9, serving: "100g" },
      { id: 507, name: "Shredded Cabbage with Capsicum", calories: 91.4, protein: 1.6, carbs: 3.5, fat: 7.7, fiber: 1.8, serving: "80g" },
      { id: 508, name: "Flaxseeds", calories: 18.2, protein: 0.6, carbs: 1.0, fat: 1.4, fiber: 0.9, serving: "1 tsp" },
      { id: 509, name: "Green Chili", calories: 40.0, protein: 0.9, carbs: 2.8, fat: 2.7, fiber: 0.9, serving: "60ml" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ],
    saturday: [
      { id: 601, name: "Lentils", calories: 128.8, protein: 7.8, carbs: 19.5, fat: 0.7, fiber: 6.9, serving: "130g" },
      { id: 602, name: "Garlic & Herbs Baked Chicken Thigh", calories: 326.1, protein: 23.9, carbs: 0.3, fat: 25.5, fiber: 0.2, serving: "100g" },
      { id: 603, name: "Garlic & Herbs Minced Beef", calories: 358.8, protein: 26.3, carbs: 6.4, fat: 24.9, fiber: 1.1, serving: "100g" },
      { id: 604, name: "Pesto Tofu with Edamame", calories: 189.6, protein: 15.1, carbs: 4.8, fat: 11.0, fiber: 3.5, serving: "150g" },
      { id: 605, name: "Pesto 3-Bean Salsa", calories: 341.9, protein: 15.5, carbs: 28.8, fat: 15.7, fiber: 12.9, serving: "150g" },
      { id: 606, name: "Tahini Salad", calories: 52.9, protein: 2.2, carbs: 4.4, fat: 2.7, fiber: 2.0, serving: "100g" },
      { id: 607, name: "Sunflower Seeds", calories: 68.8, protein: 2.7, carbs: 0.3, fat: 6.1, fiber: 1.3, serving: "1 tbsp" },
      { id: 608, name: "Sweet Basil Vinaigrette", calories: 120.0, protein: 0.3, carbs: 4.4, fat: 11.4, fiber: 0.3, serving: "60ml" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ],
    sunday: [
      { id: 701, name: "Sweet Potatoes", calories: 118.5, protein: 1.6, carbs: 28.4, fat: 0.4, fiber: 3.1, serving: "130g" },
      { id: 702, name: "Chickpeas Curry with Chicken Breast", calories: 145.7, protein: 25.4, carbs: 2.4, fat: 3.7, fiber: 0.7, serving: "100g" },
      { id: 703, name: "Curry Minced Beef", calories: 215.0, protein: 23.3, carbs: 0.7, fat: 13.3, fiber: 0.2, serving: "100g" },
      { id: 704, name: "Chickpeas Curry with Tofu & Tempeh", calories: 224.0, protein: 17.5, carbs: 8.7, fat: 13.1, fiber: 4.4, serving: "150g" },
      { id: 705, name: "3-Bean Curry", calories: 244.4, protein: 13.8, carbs: 33.3, fat: 3.6, fiber: 12.7, serving: "150g" },
      { id: 706, name: "Roasted Cauliflower & Purple Cabbage", calories: 64.8, protein: 3.3, carbs: 5.2, fat: 3.2, fiber: 3.5, serving: "100g" },
      { id: 707, name: "Jalapenos", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, serving: "topping" },
      { id: 708, name: "Lime Wedge", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, serving: "topping" },
      // Desserts (available daily)
      { id: 901, name: "Banana Yogurt Crunch", calories: 179.0, protein: 7.6, carbs: 11.9, fat: 12.2, fiber: 2.0, serving: "1 serving" },
      { id: 902, name: "Nutty Pudding", calories: 157.2, protein: 3.7, carbs: 11.6, fat: 13.1, fiber: 4.5, serving: "1 serving" }
    ]
  }
  
  // Dinner food database (organized by day - buffet style)
  const dinnerFoodDatabase = {
    monday: [
      { id: 801, name: "Lemon Rice", calories: 217.2, protein: 5.6, carbs: 31.2, fat: 7.7, fiber: 3.9, serving: "100g" },
      { id: 802, name: "Tandoori Chicken Thigh", calories: 328.1, protein: 22.9, carbs: 0.9, fat: 26.0, fiber: 0.4, serving: "100g" },
      { id: 803, name: "Curry Beef", calories: 249.2, protein: 24.9, carbs: 3.0, fat: 15.2, fiber: 0.5, serving: "100g" },
      { id: 804, name: "Spinach Tofu", calories: 136.9, protein: 6.6, carbs: 13.9, fat: 6.5, fiber: 0.6, serving: "100g" },
      { id: 805, name: "Spinach Dhal", calories: 112.7, protein: 8.6, carbs: 8.1, fat: 5.2, fiber: 0.5, serving: "100g" },
      { id: 806, name: "Roasted Cauliflower and Pumpkin", calories: 68.0, protein: 2.5, carbs: 11.4, fat: 1.3, fiber: 1.7, serving: "100g" },
      { id: 807, name: "Indian Chickpeas Salad", calories: 80.4, protein: 3.5, carbs: 10.8, fat: 2.6, fiber: 2.7, serving: "100g" },
      { id: 808, name: "Fresh Coriander", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, serving: "topping" },
      { id: 809, name: "Mint Yogurt", calories: 40.3, protein: 1.5, carbs: 1.7, fat: 3.1, fiber: 0.0, serving: "30ml" },
      { id: 810, name: "Lime Wedge", calories: 64.0, protein: 1.4, carbs: 12.0, fat: 1.1, fiber: 4.1, serving: "1/8" }
    ],
    tuesday: [
      { id: 811, name: "Quinoa", calories: 120.0, protein: 4.4, carbs: 21.2, fat: 1.9, fiber: 2.8, serving: "100g" },
      { id: 812, name: "Curry Dhal", calories: 153.1, protein: 11.0, carbs: 20.2, fat: 1.6, fiber: 6.7, serving: "100g" },
      { id: 813, name: "Chicken Breast Kebab", calories: 171.7, protein: 31.6, carbs: 1.6, fat: 4.3, fiber: 0.5, serving: "100g" },
      { id: 814, name: "Lemon and Herbs Baked Salmon", calories: 242.0, protein: 22.8, carbs: 0.2, fat: 16.8, fiber: 0.1, serving: "100g" },
      { id: 815, name: "Paneer Jalfrezi", calories: 144.0, protein: 5.7, carbs: 8.4, fat: 9.9, fiber: 2.7, serving: "100g" },
      { id: 816, name: "Roasted Red Pepper Hummus", calories: 99.8, protein: 5.0, carbs: 16.4, fat: 1.6, fiber: 4.4, serving: "100g" },
      { id: 817, name: "Roasted Zucchini & Red Onions", calories: 58.1, protein: 1.8, carbs: 7.4, fat: 1.9, fiber: 2.3, serving: "100g" },
      { id: 818, name: "Greek Salad", calories: 34.8, protein: 0.9, carbs: 2.7, fat: 2.2, fiber: 1.2, serving: "100g" },
      { id: 819, name: "Sunflower Seeds", calories: 57.0, protein: 2.3, carbs: 0.0, fat: 5.1, fiber: 1.0, serving: "1 tbsp" },
      { id: 820, name: "Cucumber & Lime Raita", calories: 30.5, protein: 1.1, carbs: 1.3, fat: 2.4, fiber: 0.0, serving: "30ml" },
      { id: 821, name: "Lemon Wedge", calories: 20.0, protein: 1.2, carbs: 10.7, fat: 0.3, fiber: 4.7, serving: "1/8" }
    ],
    wednesday: [
      { id: 822, name: "Mexican Rice", calories: 178.1, protein: 5.8, carbs: 33.1, fat: 2.6, fiber: 4.0, serving: "100g" },
      { id: 823, name: "Baked Sweet Potato", calories: 95.3, protein: 1.9, carbs: 18.5, fat: 1.5, fiber: 2.2, serving: "100g" },
      { id: 824, name: "Tomato Curry Dhal", calories: 133.1, protein: 10.4, carbs: 17.0, fat: 1.2, fiber: 6.3, serving: "100g" },
      { id: 825, name: "Spiced Baked Chicken Thigh", calories: 263.8, protein: 19.4, carbs: 1.3, fat: 20.3, fiber: 0.4, serving: "100g" },
      { id: 826, name: "Mexican Ground Beef", calories: 281.8, protein: 24.2, carbs: 5.2, fat: 18.3, fiber: 1.0, serving: "100g" },
      { id: 827, name: "Cajun Tofu", calories: 112.8, protein: 11.1, carbs: 5.6, fat: 5.1, fiber: 0.5, serving: "100g" },
      { id: 828, name: "Chickpeas and Corn Shashuka", calories: 83.7, protein: 4.4, carbs: 15.5, fat: 0.5, fiber: 3.5, serving: "100g" },
      { id: 829, name: "Baked Rainbow Capsicum with Shredded Cabbage", calories: 46.4, protein: 1.3, carbs: 6.3, fat: 1.4, fiber: 2.5, serving: "100g" },
      { id: 830, name: "Tomato Salsa with Avocado", calories: 88.6, protein: 1.7, carbs: 8.5, fat: 8.0, fiber: 4.3, serving: "100g" },
      { id: 831, name: "Green Chili Lime", calories: 19.6, protein: 0.4, carbs: 1.4, fat: 1.3, fiber: 0.4, serving: "30ml" },
      { id: 832, name: "Fresh Herbs Yogurt", calories: 36.8, protein: 1.3, carbs: 1.5, fat: 2.9, fiber: 0.0, serving: "30ml" }
    ],
    thursday: [
      { id: 833, name: "Pandan Multigrain Rice", calories: 167.8, protein: 5.4, carbs: 30.6, fat: 2.6, fiber: 3.7, serving: "100g" },
      { id: 834, name: "Curry Dhal", calories: 153.1, protein: 11.0, carbs: 20.2, fat: 1.6, fiber: 6.7, serving: "100g" },
      { id: 835, name: "Hainanese Chicken Thigh", calories: 326.1, protein: 23.9, carbs: 0.3, fat: 25.5, fiber: 0.1, serving: "100g" },
      { id: 836, name: "Baked Barramundi with Garlic & Ginger", calories: 112.8, protein: 24.5, carbs: 1.5, fat: 1.0, fiber: 0.0, serving: "100g" },
      { id: 837, name: "Garlic Tofu", calories: 112.7, protein: 11.1, carbs: 6.5, fat: 4.7, fiber: 0.5, serving: "100g" },
      { id: 838, name: "Garlic and Ginger Cabbage with Shiitake Mushroom", calories: 52.0, protein: 2.1, carbs: 5.4, fat: 2.5, fiber: 2.3, serving: "100g" },
      { id: 839, name: "Chinese Style Cucumber and Tomato Salad", calories: 29.4, protein: 1.0, carbs: 3.5, fat: 1.2, fiber: 0.6, serving: "100g" },
      { id: 840, name: "Fresh Coriander", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, serving: "topping" },
      { id: 841, name: "Red Chili Sauce", calories: 21.3, protein: 0.9, carbs: 4.0, fat: 0.2, fiber: 1.4, serving: "30ml" },
      { id: 842, name: "Fresh Herbs Yogurt", calories: 36.8, protein: 1.3, carbs: 1.5, fat: 2.9, fiber: 0.0, serving: "30ml" },
      { id: 843, name: "Hard Boiled Egg", calories: 73.0, protein: 6.4, carbs: 0.2, fat: 5.3, fiber: 0.0, serving: "1 nos" }
    ],
    friday: [
      { id: 844, name: "Quinoa", calories: 120.0, protein: 4.4, carbs: 21.2, fat: 1.9, fiber: 2.8, serving: "100g" },
      { id: 845, name: "Mashed Potato and Sweet Potato", calories: 90.7, protein: 1.8, carbs: 17.1, fat: 1.3, fiber: 2.0, serving: "100g" },
      { id: 846, name: "Curry Baked Chicken Thigh", calories: 332.2, protein: 24.1, carbs: 1.3, fat: 25.7, fiber: 0.4, serving: "100g" },
      { id: 847, name: "Miso Baked Salmon", calories: 261.6, protein: 23.9, carbs: 0.7, fat: 18.0, fiber: 0.3, serving: "100g" },
      { id: 848, name: "Teriyaki Tofu", calories: 89.2, protein: 8.6, carbs: 5.6, fat: 3.7, fiber: 0.4, serving: "100g" },
      { id: 849, name: "Green Peas Curry Dahl", calories: 134.0, protein: 10.7, carbs: 16.9, fat: 1.2, fiber: 6.6, serving: "100g" },
      { id: 850, name: "Baked Pumpkin and White Onion", calories: 106.2, protein: 1.4, carbs: 15.7, fat: 4.1, fiber: 0.9, serving: "100g" },
      { id: 851, name: "Japanese Wafu Salad", calories: 47.7, protein: 4.4, carbs: 4.7, fat: 1.5, fiber: 2.1, serving: "100g" },
      { id: 852, name: "Spring Onion", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, serving: "topping" },
      { id: 853, name: "Citrus Vinaigrette", calories: 110.2, protein: 0.1, carbs: 1.7, fat: 11.3, fiber: 0.0, serving: "30ml" },
      { id: 854, name: "Fresh Herbs Yogurt", calories: 36.8, protein: 1.3, carbs: 1.5, fat: 2.9, fiber: 0.0, serving: "30ml" },
      { id: 855, name: "Daikon Miso Soup", calories: 12.1, protein: 0.7, carbs: 1.9, fat: 0.2, fiber: 0.7, serving: "100ml" }
    ],
    saturday: [
      { id: 856, name: "Lemongrass and Ginger Multigrain Rice", calories: 172.8, protein: 5.6, carbs: 31.6, fat: 2.7, fiber: 3.8, serving: "100g" },
      { id: 857, name: "Tomato Curry Dhal", calories: 133.1, protein: 10.4, carbs: 17.0, fat: 1.2, fiber: 6.3, serving: "100g" },
      { id: 858, name: "Spicy Lemongrass Curry Chicken Breast", calories: 151.5, protein: 27.7, carbs: 1.3, fat: 3.8, fiber: 0.4, serving: "100g" },
      { id: 859, name: "Salt Baked Barramundi", calories: 112.8, protein: 24.5, carbs: 1.5, fat: 1.0, fiber: 0.0, serving: "100g" },
      { id: 860, name: "Garlic Soy Tofu and Tempeh", calories: 151.2, protein: 13.6, carbs: 7.5, fat: 7.8, fiber: 0.5, serving: "100g" },
      { id: 861, name: "Roasted Chili Broccoli", calories: 54.8, protein: 5.6, carbs: 3.8, fat: 1.9, fiber: 5.3, serving: "100g" },
      { id: 862, name: "Asam Kerabu Salad with Chili Lime Dressing", calories: 41.5, protein: 1.3, carbs: 8.7, fat: 0.2, fiber: 0.9, serving: "100g" },
      { id: 863, name: "Baked Anchovies", calories: 280.7, protein: 56.5, carbs: 0.9, fat: 5.7, fiber: 0.0, serving: "100g" },
      { id: 864, name: "Roasted Peanuts", calories: 58.8, protein: 2.5, carbs: 1.3, fat: 4.7, fiber: 0.9, serving: "1 tbsp" },
      { id: 865, name: "Sambal Chili Sauce", calories: 16.4, protein: 0.8, carbs: 2.9, fat: 0.2, fiber: 0.9, serving: "30ml" },
      { id: 866, name: "Fresh Herbs Yogurt", calories: 36.8, protein: 1.3, carbs: 1.5, fat: 2.9, fiber: 0.0, serving: "30ml" },
      { id: 867, name: "Hard Boiled Egg", calories: 73.0, protein: 6.4, carbs: 0.2, fat: 5.3, fiber: 0.0, serving: "1 nos" }
    ],
    sunday: [
      { id: 868, name: "Multigrain Rice", calories: 172.8, protein: 5.6, carbs: 31.6, fat: 2.7, fiber: 3.8, serving: "100g" },
      { id: 869, name: "Whole Wheat Pasta", calories: 130.5, protein: 5.8, carbs: 24.6, fat: 0.8, fiber: 5.7, serving: "100g" },
      { id: 870, name: "Thai Basil Beef", calories: 218.6, protein: 23.7, carbs: 3.0, fat: 12.4, fiber: 0.8, serving: "100g" },
      { id: 871, name: "Sze Chuan Chicken Breast", calories: 224.9, protein: 28.4, carbs: 2.4, fat: 11.1, fiber: 0.4, serving: "100g" },
      { id: 872, name: "Thai Basil Tofu", calories: 207.9, protein: 20.2, carbs: 12.4, fat: 8.7, fiber: 1.8, serving: "100g" },
      { id: 873, name: "Green Peas Curry Dahl", calories: 134.0, protein: 10.7, carbs: 16.9, fat: 1.2, fiber: 6.6, serving: "100g" },
      { id: 874, name: "Baked Mixed Mushroom & Broccoli", calories: 67.0, protein: 4.3, carbs: 4.9, fat: 3.3, fiber: 3.7, serving: "100g" },
      { id: 875, name: "Young Papaya Salad", calories: 34.7, protein: 0.4, carbs: 7.1, fat: 0.1, fiber: 2.3, serving: "100g" },
      { id: 876, name: "Pumpkin Seeds or Sunflower Seeds", calories: 57.0, protein: 2.3, carbs: 0.0, fat: 5.1, fiber: 1.0, serving: "1 tbsp" },
      { id: 877, name: "Mushroom and Black Pepper Sauce", calories: 21.6, protein: 0.3, carbs: 3.2, fat: 0.8, fiber: 0.3, serving: "30ml" },
      { id: 878, name: "Fresh Herbs Yogurt", calories: 36.8, protein: 1.3, carbs: 1.5, fat: 2.9, fiber: 0.0, serving: "30ml" }
    ]
  }

  const getCurrentFoodDatabase = () => {
    switch (mealType) {
      case "cafe":
        return cafeFoodDatabase
      case "lunch":
        return selectedDay ? (lunchFoodDatabase[selectedDay] || []) : []
      case "dinner":
        return selectedDay ? (dinnerFoodDatabase[selectedDay] || []) : []
      default:
        return []
    }
  }

  const foodDatabase = getCurrentFoodDatabase()

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLogMeal = () => {
    if (selectedFood) {
      // Create timestamp from selected date (set to current time on that date)
      const selectedDateTime = new Date(selectedDate)
      selectedDateTime.setHours(new Date().getHours())
      selectedDateTime.setMinutes(new Date().getMinutes())
      
      const mealData = {
        food: selectedFood.name,
        servingSize,
        mealType,
        calories: Math.round(selectedFood.calories * servingSize),
        protein: Math.round(selectedFood.protein * servingSize * 10) / 10,
        carbs: Math.round(selectedFood.carbs * servingSize * 10) / 10,
        fat: Math.round(selectedFood.fat * servingSize * 10) / 10,
        fiber: Math.round((selectedFood.fiber || 0) * servingSize * 10) / 10,
        timestamp: selectedDateTime.toISOString()
      }
      
      // Call the callback to update the dashboard
      if (onMealLogged) {
        onMealLogged(mealData)
      }
      
      onClose()
      setSelectedFood(null)
      setServingSize(1)
      setSearchQuery("")
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            Log Your Meal
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              color: isDark ? 'white' : 'black'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Date Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Meal Date
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              backgroundColor: isDark ? '#000000' : 'white',
              color: isDark ? 'white' : 'black',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          />
        </div>

        {/* Meal Type Selection */}
        {showMealTypeSelection && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: isDark ? 'white' : 'black',
              textAlign: 'center'
            }}>
              Choose Your Meal Type
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {[
                { id: 'cafe', name: 'Cafe', icon: Utensils },
                { id: 'lunch', name: 'Lunch', icon: Apple },
                { id: 'dinner', name: 'Dinner', icon: Moon }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setMealType(type.id)
                    if (type.id === 'cafe') {
                      setShowMealTypeSelection(false)
                    } else {
                      setShowDaySelection(true)
                      setShowMealTypeSelection(false)
                    }
                  }}
                  style={{
                    padding: '24px 16px',
                    border: `3px solid ${isDark ? 'white' : 'black'}`,
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    transform: 'scale(1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) translateY(-4px)'
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                    e.target.style.backgroundColor = isDark ? 'white' : 'black'
                    e.target.style.color = isDark ? 'black' : 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) translateY(0)'
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    e.target.style.backgroundColor = isDark ? '#000000' : 'white'
                    e.target.style.color = isDark ? 'white' : 'black'
                  }}
                >
                  <div style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <type.icon size={32} />
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {type.name}
                  </div>

                </button>
              ))}
            </div>
          </div>
        )}

        {/* Day Selection (for lunch and dinner) */}
        {showDaySelection && (
          <>
            {/* Back Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => {
                  setShowMealTypeSelection(true)
                  setShowDaySelection(false)
                  setMealType("")
                  setSelectedDay("")
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  color: isDark ? 'white' : 'black',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ← Back to Meal Types
              </button>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: isDark ? 'white' : 'black',
                textAlign: 'left'
              }}>
                Select Day for {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '12px'
            }}>
              {[
                { id: 'monday', name: 'Mon', fullName: 'Monday' },
                { id: 'tuesday', name: 'Tue', fullName: 'Tuesday' },
                { id: 'wednesday', name: 'Wed', fullName: 'Wednesday' },
                { id: 'thursday', name: 'Thu', fullName: 'Thursday' },
                { id: 'friday', name: 'Fri', fullName: 'Friday' },
                { id: 'saturday', name: 'Sat', fullName: 'Saturday' },
                { id: 'sunday', name: 'Sun', fullName: 'Sunday' }
              ].map((day) => (
                <button
                  key={day.id}
                  onClick={() => {
                    setSelectedDay(day.id)
                    setShowDaySelection(false)
                  }}
                  style={{
                    padding: '16px 8px',
                    border: `3px solid ${isDark ? 'white' : 'black'}`,
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transform: 'scale(1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05) translateY(-2px)'
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                    e.target.style.backgroundColor = isDark ? 'white' : 'black'
                    e.target.style.color = isDark ? 'black' : 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) translateY(0)'
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    e.target.style.backgroundColor = isDark ? '#000000' : 'white'
                    e.target.style.color = isDark ? 'white' : 'black'
                  }}
                >
                  <div style={{
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {day.name}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    textAlign: 'center',
                    opacity: 0.8,
                    lineHeight: '1.2'
                  }}>
                    {day.fullName}
                  </div>
                </button>
              ))}
            </div>
          </div>
          </>
        )}

        {/* Food Selection (only show after meal type is selected) */}
        {!showMealTypeSelection && !showDaySelection && mealType && (
          <>
            {/* Back Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => {
                  if (mealType === 'cafe') {
                    setShowMealTypeSelection(true)
                    setMealType("")
                  } else {
                    setShowDaySelection(true)
                  }
                  setSelectedFood(null)
                  setSearchQuery("")
                  setSelectedDay("")
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  color: isDark ? 'white' : 'black',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                ← Back to {mealType === 'cafe' ? 'Meal Types' : 'Day Selection'}
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            position: 'relative',
            marginBottom: '16px'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: isDark ? '#cccccc' : '#6b7280'
            }} />
            <input
              type="text"
                    placeholder={`Search ${mealType} menu${selectedDay ? ` for ${selectedDay}` : ''}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                borderRadius: '8px',
                backgroundColor: isDark ? '#000000' : 'white',
                color: isDark ? 'white' : 'black',
                fontSize: '16px'
              }}
            />
          </div>
        </div>
          </>
        )}

        {/* Food List */}
        {!showMealTypeSelection && mealType && (
          <>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              textAlign: 'left',
              margin: 0
          }}>
              Select {mealType.charAt(0).toUpperCase() + mealType.slice(1)} Item{multiSelectMode ? 's' : ''}
              {selectedDay && ` - ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`}
          </h3>
            <button
              onClick={() => {
                setMultiSelectMode(!multiSelectMode)
                setSelectedFood(null)
                setSelectedForBatch([])
              }}
              style={{
                padding: '6px 12px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                backgroundColor: multiSelectMode ? (isDark ? 'white' : 'black') : (isDark ? '#000000' : 'white'),
                color: multiSelectMode ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease'
              }}
            >
              {multiSelectMode ? 'Single Select' : 'Multi Select'}
            </button>
          </div>
          <div style={{
                maxHeight: '300px',
            overflow: 'auto',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '8px'
          }}>
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => {
                  if (multiSelectMode) {
                    const isSelected = selectedForBatch.some(item => item.id === food.id)
                    if (isSelected) {
                      setSelectedForBatch(prev => prev.filter(item => item.id !== food.id))
                    } else {
                      setSelectedForBatch(prev => [...prev, food])
                    }
                  } else {
                    setSelectedFood(food)
                  }
                }}
                style={{
                  padding: '16px',
                  borderBottom: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  backgroundColor: multiSelectMode 
                    ? (selectedForBatch.some(item => item.id === food.id) ? (isDark ? '#333333' : '#f3f4f6') : 'transparent')
                    : (selectedFood?.id === food.id ? (isDark ? '#333333' : '#f3f4f6') : 'transparent'),
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        width: '100%'
                }}>
                  {/* Checkbox for multi-select mode */}
                  {multiSelectMode && (
                    <div style={{
                      marginRight: '12px',
                      marginTop: '2px'
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: `2px solid ${isDark ? 'white' : 'black'}`,
                        borderRadius: '3px',
                        backgroundColor: selectedForBatch.some(item => item.id === food.id) 
                          ? (isDark ? 'white' : 'black') 
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}>
                        {selectedForBatch.some(item => item.id === food.id) && (
                          <div style={{
                            color: isDark ? 'black' : 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                        <div style={{
                          flex: 1,
                          textAlign: 'left'
                        }}>
                    <div style={{
                      fontWeight: 'bold',
                      color: isDark ? 'white' : 'black',
                            marginBottom: '4px',
                            textAlign: 'left'
                    }}>
                      {food.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                            color: isDark ? '#cccccc' : '#6b7280',
                            textAlign: 'left'
                    }}>
                            {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat{food.fiber ? ` • ${food.fiber}g fiber` : ''}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                          color: isDark ? '#cccccc' : '#6b7280',
                          textAlign: 'right',
                          minWidth: '80px',
                          marginLeft: '16px'
                  }}>
                    per {food.serving}
                  </div>
                </div>
              </div>
                  ))
                ) : (
                  <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: isDark ? '#cccccc' : '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    No items found matching your search.
                  </div>
                )}
          </div>
        </div>

        {/* Multi-Select Add Button */}
        {multiSelectMode && selectedForBatch.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => {
                // Add all selected items to the order with default serving size of 1
                const newItems = selectedForBatch.map(food => ({
                  ...food,
                  quantity: 1,
                  totalCalories: Math.round(food.calories),
                  totalProtein: Math.round(food.protein * 10) / 10,
                  totalCarbs: Math.round(food.carbs * 10) / 10,
                  totalFat: Math.round(food.fat * 10) / 10,
                  totalFiber: Math.round((food.fiber || 0) * 10) / 10,
                }))
                setSelectedItems(prev => [...prev, ...newItems])
                setSelectedForBatch([])
              }}
              style={{
                width: '100%',
                padding: '16px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                backgroundColor: isDark ? 'white' : 'black',
                color: isDark ? 'black' : 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#cccccc' : '#333333'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? 'white' : 'black'
              }}
            >
              Add {selectedForBatch.length} Selected Item{selectedForBatch.length > 1 ? 's' : ''} to Order
            </button>
          </div>
        )}

        {/* Serving Size */}
        {selectedFood && !multiSelectMode && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: isDark ? 'white' : 'black'
            }}>
                   {mealType === 'lunch' ? 'Quantity (Orders)' : mealType === 'dinner' ? 'Portion Size (Buffet)' : 'Serving Size'}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <button
                     onClick={() => {
                       if (mealType === 'lunch') {
                         setServingSize(Math.max(1, servingSize - 1))
                       } else if (mealType === 'dinner') {
                         setServingSize(Math.max(0.25, servingSize - 0.25))
                       } else {
                         setServingSize(Math.max(0.5, servingSize - 0.5))
                       }
                     }}
                style={{
                  padding: '8px 16px',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: isDark ? '#000000' : 'white',
                  color: isDark ? 'white' : 'black',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                -
              </button>
              <span style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                     {mealType === 'lunch' ? servingSize : `${servingSize}x`}
              </span>
              <button
                     onClick={() => {
                       if (mealType === 'lunch') {
                         setServingSize(servingSize + 1)
                       } else if (mealType === 'dinner') {
                         setServingSize(servingSize + 0.25)
                       } else {
                         setServingSize(servingSize + 0.5)
                       }
                     }}
                style={{
                  padding: '8px 16px',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: isDark ? '#000000' : 'white',
                  color: isDark ? 'white' : 'black',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
              <span style={{
                fontSize: '14px',
                color: isDark ? '#cccccc' : '#6b7280'
              }}>
                = {Math.round(selectedFood.calories * servingSize)} calories
              </span>
            </div>
          </div>
        )}

                        {/* Add to Cart Button */}
            {selectedFood && (
              <div style={{ marginBottom: '16px' }}>
                <button
                  onClick={() => {
                    const newItem = {
                      ...selectedFood,
                      quantity: servingSize,
                      totalCalories: Math.round(selectedFood.calories * servingSize),
                      totalProtein: Math.round(selectedFood.protein * servingSize * 10) / 10,
                      totalCarbs: Math.round(selectedFood.carbs * servingSize * 10) / 10,
                      totalFat: Math.round(selectedFood.fat * servingSize * 10) / 10,
                      totalFiber: selectedFood.fiber ? Math.round(selectedFood.fiber * servingSize * 10) / 10 : 0
                    }
                    setSelectedItems(prev => [...prev, newItem])
                    setSelectedFood(null)
                    setServingSize(1)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: isDark ? '#333333' : '#f3f4f6',
                    color: isDark ? 'white' : 'black',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Add to Order ({Math.round(selectedFood.calories * servingSize)} cal)
                </button>
              </div>
            )}

            {/* Selected Items Cart */}
            {selectedItems.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
                  color: isDark ? 'white' : 'black',
                  textAlign: 'left'
          }}>
                  Your Order ({selectedItems.length} items)
          </h3>
          <div style={{
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  borderRadius: '8px',
                  maxHeight: '200px',
                  overflow: 'auto'
                }}>
                  {selectedItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px 16px',
                        borderBottom: index < selectedItems.length - 1 ? `1px solid ${isDark ? '#333333' : '#e5e7eb'}` : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{
                          fontWeight: 'bold',
                          color: isDark ? 'white' : 'black',
                          marginBottom: '4px'
                        }}>
                          {item.name} {mealType === 'lunch' ? `(${item.quantity})` : `(${item.quantity}x)`}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: isDark ? '#cccccc' : '#6b7280'
                        }}>
                          {item.totalCalories} cal • {item.totalProtein}g protein • {item.totalCarbs}g carbs • {item.totalFat}g fat
                        </div>
                      </div>
              <button
                        onClick={() => {
                          setSelectedItems(prev => prev.filter((_, i) => i !== index))
                        }}
                style={{
                          background: 'none',
                          border: 'none',
                  cursor: 'pointer',
                          color: isDark ? '#ff6b6b' : '#dc2626',
                          fontSize: '18px',
                          padding: '4px'
                        }}
                      >
                        ×
              </button>
                    </div>
            ))}
          </div>
                
                {/* Order Summary */}
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: isDark ? '#111111' : '#f9f9f9',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    Order Summary
        </div>

                  {/* Items Count */}
                  <div style={{
                    fontSize: '14px',
                    color: isDark ? '#cccccc' : '#666666',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                  </div>

                  {/* Nutrition Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    {/* Calories */}
                    <div style={{
                      gridColumn: 'span 2',
                      textAlign: 'center',
                      padding: '16px',
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: isDark ? 'white' : 'black',
                        lineHeight: '1'
                      }}>
                        {selectedItems.reduce((sum, item) => sum + item.totalCalories, 0)}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: isDark ? '#cccccc' : '#666666',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginTop: '4px'
                      }}>
                        Calories
                      </div>
                    </div>

                    {/* Protein */}
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: isDark ? 'white' : 'black',
                        lineHeight: '1'
                      }}>
                        {(selectedItems.reduce((sum, item) => sum + item.totalProtein, 0)).toFixed(1)}g
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDark ? '#cccccc' : '#666666',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '4px'
                      }}>
                        Protein
                      </div>
                    </div>

                    {/* Carbs */}
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: isDark ? 'white' : 'black',
                        lineHeight: '1'
                      }}>
                        {(selectedItems.reduce((sum, item) => sum + item.totalCarbs, 0)).toFixed(1)}g
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDark ? '#cccccc' : '#666666',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '4px'
                      }}>
                        Carbs
                      </div>
                    </div>

                    {/* Fat */}
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: isDark ? 'white' : 'black',
                        lineHeight: '1'
                      }}>
                        {(selectedItems.reduce((sum, item) => sum + item.totalFat, 0)).toFixed(1)}g
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDark ? '#cccccc' : '#666666',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '4px'
                      }}>
                        Fat
                      </div>
                    </div>

                    {/* Fiber */}
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: isDark ? 'white' : 'black',
                        lineHeight: '1'
                      }}>
                        {(selectedItems.reduce((sum, item) => sum + (item.totalFiber || 0), 0)).toFixed(1)}g
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDark ? '#cccccc' : '#666666',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '4px'
                      }}>
                        Fiber
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Log Order Button */}
        <button
              onClick={() => {
                if (selectedItems.length > 0) {
                  // Log all items as a single meal
                  const totalCalories = selectedItems.reduce((sum, item) => sum + item.totalCalories, 0)
                  const totalProtein = selectedItems.reduce((sum, item) => sum + item.totalProtein, 0)
                  const totalCarbs = selectedItems.reduce((sum, item) => sum + item.totalCarbs, 0)
                  const totalFat = selectedItems.reduce((sum, item) => sum + item.totalFat, 0)
                  const totalFiber = selectedItems.reduce((sum, item) => sum + (item.totalFiber || 0), 0)
                  
                  // Create timestamp from selected date (set to current time on that date)
                  const selectedDateTime = new Date(selectedDate)
                  selectedDateTime.setHours(new Date().getHours())
                  selectedDateTime.setMinutes(new Date().getMinutes())
                  
                  const mealData = {
                    food: selectedItems.map(item => `${item.name} ${mealType === 'lunch' ? `(${item.quantity})` : `(${item.quantity}x)`}`).join(', '),
                    servingSize: 1,
                    mealType: mealType,
                    calories: totalCalories,
                    protein: Math.round(totalProtein * 10) / 10,
                    carbs: Math.round(totalCarbs * 10) / 10,
                    fat: Math.round(totalFat * 10) / 10,
                    fiber: Math.round(totalFiber * 10) / 10,
                    timestamp: selectedDateTime.toISOString(),
                    items: selectedItems // Store individual items for reference
                  }
                  
                  if (onMealLogged) {
                    onMealLogged(mealData)
                  }
                  
                  onClose()
                  setSelectedItems([])
                  setSelectedFood(null)
                  setServingSize(1)
                  setSearchQuery("")
                } else if (selectedFood) {
                  handleLogMeal()
                }
              }}
              disabled={selectedItems.length === 0 && !selectedFood}
          style={{
            width: '100%',
            padding: '16px',
                backgroundColor: (selectedItems.length > 0 || selectedFood) ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb'),
                color: (selectedItems.length > 0 || selectedFood) ? (isDark ? 'black' : 'white') : (isDark ? '#666666' : '#9ca3af'),
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
                cursor: (selectedItems.length > 0 || selectedFood) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
              {selectedItems.length > 0 ? 
                `Log Order (${selectedItems.length} items - ${selectedItems.reduce((sum, item) => sum + item.totalCalories, 0)} cal)` :
                `Log ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal${selectedDay ? ` - ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}` : ''}`
              }
        </button>
          </>
        )}
      </div>
    </div>
  )
}

// Onboarding Modal Component
function OnboardingModal({ isOpen, onClose, isDark = false, onComplete }) {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    age: '',
    weight: '',
    height: '',
    sex: '',
    activityLevel: '',
    goal: '',
    currentWeight: '',
    targetWeight: ''
  })

  const activityLevels = [
    { id: "sedentary", name: "Sedentary", description: "Little or no exercise" },
    { id: "light", name: "Lightly Active", description: "Light exercise 1-3 days/week" },
    { id: "moderate", name: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
    { id: "active", name: "Very Active", description: "Hard exercise 6-7 days/week" },
    { id: "very_active", name: "Extremely Active", description: "Very hard exercise, physical job" }
  ]

  const goals = [
    { id: "lose", name: "Lose Weight", icon: "📉", description: "Create a calorie deficit" },
    { id: "maintain", name: "Maintain Weight", icon: "⚖️", description: "Maintain current weight" },
    { id: "gain", name: "Gain Weight", icon: "📈", description: "Create a calorie surplus" }
  ]

  const calculateCalories = () => {
    const { age, weight, height, sex, activityLevel, goal } = userData
    
    // Convert to numbers
    const ageNum = parseInt(age)
    const weightKg = parseFloat(weight) // Already in kg
    const heightCm = parseFloat(height) // Already in cm
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (sex === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) - 161
    }
    
    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const tdee = bmr * activityMultipliers[activityLevel]
    
    // Apply goal adjustment
    let dailyCalories
    switch (goal) {
      case 'lose':
        dailyCalories = tdee - 500 // 500 calorie deficit
        break
      case 'maintain':
        dailyCalories = tdee
        break
      case 'gain':
        dailyCalories = tdee + 300 // 300 calorie surplus
        break
      default:
        dailyCalories = tdee
    }
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(dailyCalories * 0.3 / 4), // 30% of calories from protein
      carbs: Math.round(dailyCalories * 0.45 / 4), // 45% of calories from carbs
      fat: Math.round(dailyCalories * 0.25 / 9) // 25% of calories from fat
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      const calories = calculateCalories()
      onComplete({ ...userData, calories })
      onClose()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userData.age && userData.weight && userData.height && userData.sex
      case 2:
        return userData.activityLevel
      case 3:
        return userData.goal
      case 4:
        return userData.currentWeight && userData.targetWeight
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            The Network School
          </h2>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isDark ? '#a3a3a3' : '#4b5563',
            marginTop: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Fitness & Longevity Program
          </p>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              color: isDark ? 'white' : 'black'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px'
        }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                backgroundColor: s <= step ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb'),
                borderRadius: '2px',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: isDark ? 'white' : 'black'
            }}>
              Tell us about yourself
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black'
                }}>
                  Age
                </label>
                <input
                  type="number"
                  min="0"
                  value={userData.age}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserData({...userData, age: value === '' ? '' : Math.max(0, value)});
                  }}
                  placeholder="Enter your age"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black'
                }}>
                  Weight in kg
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={userData.weight}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserData({...userData, weight: value === '' ? '' : Math.max(0, value)});
                  }}
                  placeholder="Weight in kg"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black'
                }}>
                  Height in cm
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={userData.height}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserData({...userData, height: value === '' ? '' : Math.max(0, value)});
                  }}
                  placeholder="Height in cm"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black'
                }}>
                  Sex
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  {['male', 'female'].map((sex) => (
                    <button
                      key={sex}
                      onClick={() => setUserData({...userData, sex})}
                      style={{
                        padding: '12px',
                        border: `2px solid ${userData.sex === sex ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb')}`,
                        backgroundColor: userData.sex === sex ? (isDark ? 'white' : 'black') : 'transparent',
                        color: userData.sex === sex ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    >
                      {sex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Activity Level */}
        {step === 2 && (
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: isDark ? 'white' : 'black'
            }}>
              How active are you?
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {activityLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setUserData({...userData, activityLevel: level.id})}
                  style={{
                    padding: '16px',
                    border: `2px solid ${userData.activityLevel === level.id ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb')}`,
                    backgroundColor: userData.activityLevel === level.id ? (isDark ? 'white' : 'black') : 'transparent',
                    color: userData.activityLevel === level.id ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {level.name}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {level.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Goal */}
        {step === 3 && (
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: isDark ? 'white' : 'black'
            }}>
              What's your goal?
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setUserData({...userData, goal: goal.id})}
                  style={{
                    padding: '16px',
                    border: `2px solid ${userData.goal === goal.id ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb')}`,
                    backgroundColor: userData.goal === goal.id ? (isDark ? 'white' : 'black') : 'transparent',
                    color: userData.goal === goal.id ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{goal.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {goal.name}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      {goal.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Weight Goals */}
        {step === 4 && (
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: isDark ? 'white' : 'black'
            }}>
              Set your weight goals
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black'
                  }}>
                    Current Weight in kg
                  </label>
                                  <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={userData.currentWeight}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserData({...userData, currentWeight: value === '' ? '' : Math.max(0, value)});
                  }}
                  placeholder="Current weight in kg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#000000' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black'
                  }}>
                    Target Weight in kg
                  </label>
                                  <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={userData.targetWeight}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserData({...userData, targetWeight: value === '' ? '' : Math.max(0, value)});
                  }}
                  placeholder="Target weight in kg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      borderRadius: '8px',
                      backgroundColor: isDark ? '#000000' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                </div>
              </div>

              {/* Preview of calculated calories */}
              {userData.age && userData.weight && userData.height && userData.sex && userData.activityLevel && userData.goal && (
                <div style={{
                  padding: '16px',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  borderRadius: '8px',
                  backgroundColor: isDark ? '#111111' : '#f9f9f9'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: isDark ? 'white' : 'black'
                  }}>
                    Your Daily Targets
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
                    <div style={{ color: isDark ? '#cccccc' : '#666666' }}>
                      Daily Calories: <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>
                        {calculateCalories().dailyCalories}
                      </span>
                    </div>
                    <div style={{ color: isDark ? '#cccccc' : '#666666' }}>
                      Protein: <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>
                        {calculateCalories().protein}g
                      </span>
                    </div>
                    <div style={{ color: isDark ? '#cccccc' : '#666666' }}>
                      Carbs: <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>
                        {calculateCalories().carbs}g
                      </span>
                    </div>
                    <div style={{ color: isDark ? '#cccccc' : '#666666' }}>
                      Fat: <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>
                        {calculateCalories().fat}g
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px'
        }}>
          {step > 1 && (
            <button
              onClick={handleBack}
              style={{
                padding: '12px 24px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                backgroundColor: 'transparent',
                color: isDark ? 'white' : 'black',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            style={{
              padding: '12px 24px',
              backgroundColor: isStepValid() ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb'),
              color: isStepValid() ? (isDark ? 'black' : 'white') : (isDark ? '#666666' : '#9ca3af'),
              border: 'none',
              borderRadius: '8px',
              cursor: isStepValid() ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              marginLeft: 'auto'
            }}
          >
            {step === 4 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Water Tracking Modal Component
function WaterTrackingModal({ isOpen, onClose, onWaterLogged, isDark, totalWaterToday, waterStreak, dailyGoal, userProfile }) {
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]) // YYYY-MM-DD format
  const [isAnimating, setIsAnimating] = useState(false)
  const [ripples, setRipples] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const progressPercentage = Math.min((totalWaterToday / dailyGoal) * 100, 100)
  
  // Generate personalized hydration suggestions
  const getHydrationSuggestions = () => {
    const suggestions = []
    
    if (userProfile?.weight) {
      const weightInLbs = Math.round(userProfile.weight * 2.2)
      suggestions.push(`Your baseline: ${weightInLbs}lbs × 67% = ${Math.round(weightInLbs * 2/3)}oz daily`)
    }
    
    if (userProfile?.activityLevel) {
      const activityTips = {
        sedentary: "Sedentary lifestyle: Set hourly water reminders",
        light: "Light activity: Extra water during exercise days",
        moderate: "Moderate activity: +20% more water on workout days",
        active: "Very active: +30% more water, especially post-workout",
        veryActive: "Extremely active: +40% more water, monitor urine color"
      }
      suggestions.push(activityTips[userProfile.activityLevel])
    }
    
    if (userProfile?.workoutCalories && userProfile.workoutCalories > 0) {
      const extraOz = Math.round((userProfile.workoutCalories / 100) * 15 / 30 * 12)
      suggestions.push(`Workout bonus: +${extraOz}oz (${Math.round(extraOz * 29.5735)}ml) for your ${userProfile.workoutCalories} cal target`)
    }
    
    // General tips
    suggestions.push("Hot weather? Add 12-16oz extra per day")
    suggestions.push("Foods count too: watermelon, cucumbers, berries")
    suggestions.push("Don't wait for thirst - drink throughout the day")
    suggestions.push("Aim for pale yellow urine as a hydration indicator")
    
    return suggestions
  }
  
  const waterSizes = [
    { label: "Cup", amount: 250, icon: Coffee },
    { label: "Bottle", amount: 500, icon: Milk },
    { label: "Large", amount: 750, icon: FlaskConical }
  ]

  const handleAddWater = (amount) => {
    setSelectedAmount(amount)
    setIsAnimating(true)
    
    // Create ripple effect
    const newRipple = {
      id: Date.now(),
      x: Math.random() * 200,
      y: Math.random() * 200
    }
    setRipples(prev => [...prev, newRipple])
    
    // Create timestamp from selected date (set to current time on that date)
    const selectedDateTime = new Date(selectedDate)
    selectedDateTime.setHours(new Date().getHours())
    selectedDateTime.setMinutes(new Date().getMinutes())
    
    // Log the water
    onWaterLogged({
      amount,
      type: waterSizes.find(size => size.amount === amount)?.label || 'Custom',
      timestamp: selectedDateTime.toISOString()
    })
    
    // Reset animation after delay
    setTimeout(() => {
      setIsAnimating(false)
      setSelectedAmount(null)
      // Remove ripple
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '450px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Ripple Effects */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              animation: 'ripple 1s ease-out forwards',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: isDark ? 'white' : 'black',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Droplets style={{ 
            width: '48px', 
            height: '48px', 
            color: isDark ? 'white' : 'black',
            marginBottom: '16px'
          }} />
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            marginBottom: '8px',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            Track Water
          </h2>
          <p style={{
            color: isDark ? '#cccccc' : '#666666',
            fontSize: '16px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Stay hydrated and reach your daily goal
          </p>
        </div>

        {/* Date Selection */}
        <div style={{ marginBottom: '24px', maxWidth: '300px', margin: '0 auto 32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: isDark ? 'white' : 'black',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center'
          }}>
            Water Date
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              backgroundColor: isDark ? '#000000' : 'white',
              color: isDark ? 'white' : 'black',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textAlign: 'center'
            }}
          />
        </div>

        {/* Water Bottle Animation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <div style={{
            width: '80px',
            height: '120px',
            border: `3px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '8px 8px 12px 12px',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: isDark ? '#111111' : '#f9f9f9',
            transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            {/* Water Fill */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${progressPercentage}%`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
              transition: 'height 0.5s ease',
              borderRadius: '0 0 8px 8px'
            }}>
              {/* Water Surface Animation */}
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: isDark ? 'white' : 'black',
                opacity: 0.6,
                animation: isAnimating ? 'wave 0.5s ease-in-out' : 'none'
              }} />
            </div>
            
            {/* Bottle Cap */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '8px',
              backgroundColor: isDark ? 'white' : 'black',
              borderRadius: '4px 4px 0 0'
            }} />
          </div>
        </div>

        {/* Progress Ring */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={isDark ? '#333333' : '#e5e7eb'}
                strokeWidth="8"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={isDark ? 'white' : 'black'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {Math.round(progressPercentage)}%
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#cccccc' : '#666666',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {totalWaterToday}ml
              </div>
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: isDark ? '#111111' : '#f9f9f9',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`
        }}>
          <div style={{
            fontSize: '14px',
            color: isDark ? '#cccccc' : '#666666',
            marginBottom: '4px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Daily Goal: {dailyGoal}ml
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {Math.max(0, dailyGoal - totalWaterToday)}ml to go
          </div>
          {waterStreak > 0 && (
            <div style={{
              fontSize: '12px',
              color: isDark ? '#cccccc' : '#666666',
              marginTop: '8px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              🔥 {waterStreak} day streak!
            </div>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {waterSizes.map(size => (
            <button
              key={size.amount}
              onClick={() => handleAddWater(size.amount)}
              disabled={isAnimating}
              style={{
                padding: '16px 12px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                borderRadius: '8px',
                backgroundColor: selectedAmount === size.amount 
                  ? (isDark ? 'white' : 'black')
                  : (isDark ? '#000000' : 'white'),
                color: selectedAmount === size.amount 
                  ? (isDark ? 'black' : 'white')
                  : (isDark ? 'white' : 'black'),
                cursor: isAnimating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
                transform: selectedAmount === size.amount ? 'scale(0.95)' : 'scale(1)',
                opacity: isAnimating ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isAnimating) {
                  e.target.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isAnimating) {
                  e.target.style.transform = 'scale(1)'
                }
              }}
            >
              <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                <size.icon size={20} />
              </div>
              <div>{size.label}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{size.amount}ml</div>
            </button>
          ))}
        </div>

        {/* Achievement Message */}
        {progressPercentage >= 100 && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '8px',
            animation: 'pulse 2s infinite',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              marginBottom: '4px',
              fontFamily: 'Georgia, serif'
            }}>
              Daily Goal Achieved!
            </div>
            <div style={{
              fontSize: '14px',
              color: isDark ? '#cccccc' : '#666666',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Great job staying hydrated today!
            </div>
          </div>
        )}

        {/* Hydration Suggestions */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
              borderRadius: '8px',
              backgroundColor: isDark ? '#111111' : '#f9f9f9',
              color: isDark ? 'white' : 'black',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDark ? '#1a1a1a' : '#f0f0f0'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isDark ? '#111111' : '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} />
              <span>Personalized Hydration Tips</span>
            </div>
            <ChevronDown 
              size={16} 
              style={{ 
                transform: showSuggestions ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.2s ease' 
              }} 
            />
          </button>
          
          {showSuggestions && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
              border: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
              borderRadius: '8px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {getHydrationSuggestions().slice(0, 4).map((suggestion, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '12px',
                    lineHeight: '1.3',
                    color: isDark ? '#cccccc' : '#666666',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginBottom: index < 3 ? '6px' : '0'
                  }}
                >
                  • {suggestion}
                </div>
              ))}
              
              {userProfile?.weight && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                  borderRadius: '4px',
                  border: `1px solid ${isDark ? '#444444' : '#e5e7eb'}`
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    marginBottom: '2px',
                    fontFamily: 'Georgia, serif'
                  }}>
                    Your Calculation:
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isDark ? '#cccccc' : '#666666',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.2'
                  }}>
                    {Math.round(userProfile.weight * 2.2)}lbs × 67% = {Math.round(userProfile.weight * 2.2 * 2/3)}oz base
                    {userProfile.activityLevel && <><br/>+ Activity adjustment</>}
                    {userProfile.workoutCalories > 0 && <><br/>+ Workout bonus</>}
                    <br/><strong>= {Math.round(dailyGoal / 29.5735)}oz ({dailyGoal}ml) daily</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          @keyframes wave {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-2px);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

// Comprehensive Onboarding Component
function DeficitOnboarding({ isOpen, onComplete, isDark }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic info
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    
    // Goals
    dailyDeficit: 500, // Default to 500 calories
    workoutSplit: 50, // Default to 50% workout, 50% diet
    
    // Calculated values
    bmr: 0,
    tdee: 0,
    recommendedCalories: 0
  })

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender) return 0
    
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseInt(formData.age)
    
    if (formData.gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161
    }
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }
    return bmr * (multipliers[formData.activityLevel] || 1.2)
  }

  // Update calculations when relevant data changes
  useEffect(() => {
    const bmr = calculateBMR()
    const tdee = calculateTDEE()
    const recommendedCalories = tdee - formData.dailyDeficit
    
    setFormData(prev => ({
      ...prev,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      recommendedCalories: Math.round(recommendedCalories)
    }))
  }, [formData.weight, formData.height, formData.age, formData.gender, formData.activityLevel, formData.dailyDeficit])

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    const workoutCalories = Math.round((formData.dailyDeficit * formData.workoutSplit) / 100)
    const dietCalories = formData.dailyDeficit - workoutCalories
    
    const userData = {
      ...formData,
      workoutCalories,
      dietCalories,
      weeklyDeficit: formData.dailyDeficit * 7,
      targetWeightLoss: (formData.dailyDeficit * 7) / 7700 // kg per week (7700 cal = 1kg fat)
    }
    
    onComplete(userData)
  }

  if (!isOpen) return null

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ textAlign: 'center' }}>
            <User style={{ width: '64px', height: '64px', color: isDark ? 'white' : 'black', margin: '0 auto 24px' }} />
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              letterSpacing: '-0.025em'
            }}>
              Tell us about yourself
            </h2>
            <p style={{ 
              color: isDark ? '#cccccc' : '#666666', 
              marginBottom: '32px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              We need some basic information to calculate your personalized goals
            </p>
            
            <div style={{ display: 'grid', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Age
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, age: value === '' ? '' : Math.max(0, value) }));
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  placeholder="Enter your age"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Gender
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['male', 'female'].map(gender => (
                    <button
                      key={gender}
                      onClick={() => setFormData(prev => ({ ...prev, gender }))}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: `2px solid ${isDark ? 'white' : 'black'}`,
                        borderRadius: '8px',
                        backgroundColor: formData.gender === gender ? (isDark ? 'white' : 'black') : (isDark ? '#000000' : 'white'),
                        color: formData.gender === gender ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                        fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, weight: value === '' ? '' : Math.max(0, value) }));
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  placeholder="Enter your weight"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, height: value === '' ? '' : Math.max(0, value) }));
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#000000' : 'white',
                    color: isDark ? 'white' : 'black',
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  placeholder="Enter your height"
                />
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div style={{ textAlign: 'center' }}>
            <Activity style={{ width: '64px', height: '64px', color: isDark ? 'white' : 'black', margin: '0 auto 24px' }} />
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              letterSpacing: '-0.025em'
            }}>
              Activity Level
            </h2>
            <p style={{ 
              color: isDark ? '#cccccc' : '#666666', 
              marginBottom: '32px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              How active are you on a typical day?
            </p>
            
            <div style={{ display: 'grid', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
              {[
                { key: 'sedentary', title: 'Sedentary', desc: 'Little or no exercise, desk job' },
                { key: 'light', title: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                { key: 'moderate', title: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                { key: 'active', title: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                { key: 'veryActive', title: 'Extremely Active', desc: 'Very hard exercise, physical job' }
              ].map(activity => (
                <button
                  key={activity.key}
                  onClick={() => setFormData(prev => ({ ...prev, activityLevel: activity.key }))}
                  style={{
                    padding: '16px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    borderRadius: '8px',
                    backgroundColor: formData.activityLevel === activity.key ? (isDark ? 'white' : 'black') : (isDark ? '#000000' : 'white'),
                    color: formData.activityLevel === activity.key ? (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{activity.title}</div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>{activity.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )
      
      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            <Target style={{ width: '64px', height: '64px', color: isDark ? 'white' : 'black', margin: '0 auto 24px' }} />
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              letterSpacing: '-0.025em'
            }}>
              Daily Calorie Deficit Goal
            </h2>
            <p style={{ 
              color: isDark ? '#cccccc' : '#666666', 
              marginBottom: '32px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              How many calories do you want to be in deficit each day?
            </p>
            
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>
                    Daily Deficit: {formData.dailyDeficit} calories
                  </span>
                  <span style={{ 
                    color: isDark ? '#cccccc' : '#666666',
                    fontSize: '14px'
                  }}>
                    ~{((formData.dailyDeficit * 7) / 7700).toFixed(1)}kg/week
                  </span>
                </div>
                
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="50"
                  value={formData.dailyDeficit}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyDeficit: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: isDark ? '#333333' : '#e5e7eb',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: isDark ? '#cccccc' : '#666666'
                }}>
                  <span>200 cal</span>
                  <span>1000 cal</span>
                </div>
              </div>
              
              <div style={{
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                border: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ color: isDark ? 'white' : 'black', marginBottom: '12px' }}>Recommendations:</h4>
                <div style={{ fontSize: '14px', color: isDark ? '#cccccc' : '#666666', lineHeight: '1.5' }}>
                  • <strong>300-500 cal:</strong> Sustainable fat loss (0.3-0.5kg/week)<br/>
                  • <strong>500-750 cal:</strong> Moderate fat loss (0.5-0.8kg/week)<br/>
                  • <strong>750+ cal:</strong> Aggressive fat loss (consult professional)
                </div>
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div style={{ textAlign: 'center' }}>
            <Calculator style={{ width: '64px', height: '64px', color: isDark ? 'white' : 'black', margin: '0 auto 24px' }} />
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              letterSpacing: '-0.025em'
            }}>
              Workout vs Diet Split
            </h2>
            <p style={{ 
              color: isDark ? '#cccccc' : '#666666', 
              marginBottom: '32px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              How do you want to achieve your {formData.dailyDeficit} calorie deficit?
            </p>
            
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} /> Workout: {Math.round((formData.dailyDeficit * formData.workoutSplit) / 100)} cal
                    </div>
                    <div style={{ fontSize: '14px', color: isDark ? '#cccccc' : '#666666' }}>
                      Burn through exercise
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <Utensils size={16} /> Diet: {formData.dailyDeficit - Math.round((formData.dailyDeficit * formData.workoutSplit) / 100)} cal
                    </div>
                    <div style={{ fontSize: '14px', color: isDark ? '#cccccc' : '#666666' }}>
                      Reduce through eating less
                    </div>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={formData.workoutSplit}
                  onChange={(e) => setFormData(prev => ({ ...prev, workoutSplit: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: isDark ? '#333333' : '#e5e7eb',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: isDark ? '#cccccc' : '#666666'
                }}>
                  <span>100% Diet</span>
                  <span>50/50</span>
                  <span>100% Workout</span>
                </div>
              </div>
              
              {/* Summary */}
              <div style={{
                backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{ color: isDark ? 'white' : 'black', marginBottom: '16px', textAlign: 'center' }}>Your Personalized Plan</h4>
                <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDark ? '#cccccc' : '#666666' }}>Daily Calories to Eat:</span>
                    <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>{formData.recommendedCalories} cal</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDark ? '#cccccc' : '#666666' }}>Daily Calories to Burn:</span>
                    <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>{Math.round((formData.dailyDeficit * formData.workoutSplit) / 100)} cal</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDark ? '#cccccc' : '#666666' }}>Weekly Deficit Goal:</span>
                    <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>{formData.dailyDeficit * 7} cal</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: isDark ? '#cccccc' : '#666666' }}>Expected Weight Loss:</span>
                    <span style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold' }}>{((formData.dailyDeficit * 7) / 7700).toFixed(1)} kg/week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Progress indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: i <= step ? (isDark ? 'white' : 'black') : (isDark ? '#333333' : '#e5e7eb'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: i <= step ? (isDark ? 'black' : 'white') : (isDark ? '#666666' : '#999999')
                }}
              >
                {i}
              </div>
            ))}
          </div>
          <div style={{
            height: '4px',
            backgroundColor: isDark ? '#333333' : '#e5e7eb',
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: isDark ? 'white' : 'black',
              borderRadius: '2px',
              width: `${(step / 4) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {renderStep()}

        {/* Navigation buttons */}
        <div style={{ 
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              padding: '12px 24px',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              backgroundColor: isDark ? '#000000' : 'white',
              color: isDark ? 'white' : 'black',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              opacity: step === 1 ? 0.5 : 1
            }}
          >
            Back
          </button>

          <span style={{ 
            color: isDark ? '#cccccc' : '#666666',
            fontSize: '14px'
          }}>
            Step {step} of 4
          </span>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.age || !formData.gender || !formData.weight || !formData.height)) ||
                (step === 2 && !formData.activityLevel)
              }
              style={{
                padding: '12px 24px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                borderRadius: '8px',
                backgroundColor: isDark ? 'white' : 'black',
                color: isDark ? 'black' : 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Next <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                padding: '12px 24px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                borderRadius: '8px',
                backgroundColor: isDark ? 'white' : 'black',
                color: isDark ? 'black' : 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Quick Access Overlay Component
function QuickAccessOverlay({ isOpen, onClose, isDark, onActionSelect }) {
  const quickActions = [
    { label: "Log Meal", icon: Apple, action: "meal" },
    { label: "Record Workout", icon: Dumbbell, action: "workout" },
    { label: "Track Water", icon: Droplets, action: "water" },
    { label: "View Stats", icon: BarChart3, action: "stats" }
  ]

  const handleActionClick = (action) => {
    onActionSelect(action)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: isDark ? '#000000' : 'white',
          border: `2px solid ${isDark ? 'white' : 'black'}`,
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '320px',
          width: '100%',
          animation: 'quickAccessSlideIn 0.3s ease-out',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: isDark ? 'white' : 'black',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, serif',
            margin: 0
          }}>
            Quick Actions
          </h2>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {quickActions.map((action) => (
            <button
              key={action.action}
              onClick={() => handleActionClick(action.action)}
              style={{
                padding: '28px',
                border: `2px solid ${isDark ? 'white' : 'black'}`,
                borderRadius: '16px',
                backgroundColor: isDark ? '#000000' : 'white',
                color: isDark ? 'white' : 'black',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'white' : 'black'
                e.target.style.color = isDark ? 'black' : 'white'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDark ? '#000000' : 'white'
                e.target.style.color = isDark ? 'white' : 'black'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <action.icon size={24} strokeWidth={2} />
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '1.2'
              }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          @keyframes quickAccessSlideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default function FitnessDashboard({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false)
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false)
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false)
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null) // Store user profile data
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false) // New state for onboarding

  
  // User activity data
  const [loggedMeals, setLoggedMeals] = useState([])
  const [loggedWorkouts, setLoggedWorkouts] = useState([])
  const [loggedWater, setLoggedWater] = useState([])
  const [lastActivityDate, setLastActivityDate] = useState(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  
  const { isDark, toggleDarkMode } = useDarkMode()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load user data when component mounts
  // Track user ID to prevent unnecessary reloads
  const [loadedUserId, setLoadedUserId] = useState(null)

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        console.log('No user found, skipping data load')
        setLoadedUserId(null)
        return
      }

      // Only load data if user actually changed (prevent duplicate loads)
      if (loadedUserId === user.id) {
        console.log('Data already loaded for this user, skipping reload')
        return
      }

      console.log('Loading data for user:', user.email, 'ID:', user.id)
      setLoadedUserId(user.id)

      try {
        // Load user profile with better error handling
        let profile = null
        try {
          profile = await getUserProfile()
          console.log('Profile loaded successfully')
        } catch (profileError) {
          console.error('Error loading profile:', profileError)
          // If profile loading fails, treat as new user
          profile = null
        }

        if (profile) {
          console.log('✅ Profile found:', profile)
          console.log('Profile has required fields?', {
            age: profile.age,
            weight: profile.weight,
            height: profile.height,
            bmr: profile.bmr,
            tdee: profile.tdee,
            daily_calories: profile.daily_calories
          })
          
          // Map database fields to UI field names
          const mappedProfile = {
            ...profile,
            gender: profile.sex, // map sex -> gender for UI
            activityLevel: profile.activity_level, // map activity_level -> activityLevel for UI
            recommendedCalories: profile.daily_calories, // map daily_calories -> recommendedCalories for UI
            dailyDeficit: profile.daily_deficit || 500, // default deficit
            weeklyDeficit: (profile.daily_deficit || 500) * 7, // calculate from daily deficit
            workoutSplit: profile.workout_split || 50, // default split
            targetWeightLoss: ((profile.daily_deficit || 500) * 7) / 7700, // kg per week (7700 cal = 1kg fat)
            workoutCalories: Math.round(((profile.workout_split || 50) / 100) * (profile.daily_deficit || 500)),
            dietCalories: Math.round(((100 - (profile.workout_split || 50)) / 100) * (profile.daily_deficit || 500))
          }
          
          console.log('🔄 Mapped profile for UI:', mappedProfile)
          setUserProfile(mappedProfile)
          setIsOnboardingOpen(false)
        } else {
          console.log('❌ No profile found in database, showing onboarding')
          setIsOnboardingOpen(true)
        }

        // Load additional data (meals, workouts, water) separately
        // This way if profile fails, we can still load other data
        try {
          const [meals, workouts, waterLogs] = await Promise.all([
            getUserMeals().catch(err => { console.error('Error loading meals:', err); return [] }),
            getUserWorkouts().catch(err => { console.error('Error loading workouts:', err); return [] }),
            getUserWaterLogs().catch(err => { console.error('Error loading water logs:', err); return [] })
          ])

          console.log('Loaded data - Meals:', meals.length, 'Workouts:', workouts.length, 'Water logs:', waterLogs.length)

          setLoggedMeals(meals.map(meal => ({
            id: meal.id, // Include database ID
            food: meal.food,
            calories: meal.calories,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            fiber: meal.fiber || 0,
            timestamp: meal.timestamp
          })))

          setLoggedWorkouts(workouts.map(workout => ({
            type: workout.exercise_type,
            duration: workout.duration_minutes,
            intensity: workout.intensity,
            caloriesBurned: workout.calories_burned,
            timestamp: workout.timestamp
          })))

          setLoggedWater(waterLogs.map(log => ({
            amount: log.amount_ml,
            timestamp: log.timestamp
          })))

        } catch (dataError) {
          console.error('Error loading additional data:', dataError)
          // Don't prevent the app from working if additional data fails to load
        }

      } catch (error) {
        console.error('Critical error in loadUserData:', error)
        // Fallback: show onboarding if everything fails
        setIsOnboardingOpen(true)
      }
    }

    loadUserData()
  }, [user])

  const handleOnboardingComplete = async (userData) => {
    console.log('🚀 Onboarding completion started')
    console.log('📊 Form data received:', userData)
    console.log('📋 Key fields:', {
      age: userData.age,
      gender: userData.gender,
      weight: userData.weight,
      height: userData.height,
      activityLevel: userData.activityLevel,
      bmr: userData.bmr,
      tdee: userData.tdee,
      recommendedCalories: userData.recommendedCalories
    })
    
    // Force close the onboarding modal immediately
    setIsOnboardingOpen(false)
    
    try {
      // Save user profile to database
      console.log('💾 Saving profile to database...')
      const savedProfile = await saveUserProfile(userData)
      console.log("✅ Profile saved to database:", savedProfile)
      console.log('🔍 Saved profile fields:', {
        id: savedProfile.id,
        email: savedProfile.email,
        age: savedProfile.age,
        sex: savedProfile.sex,
        weight: savedProfile.weight,
        height: savedProfile.height,
        activity_level: savedProfile.activity_level,
        bmr: savedProfile.bmr,
        tdee: savedProfile.tdee,
        daily_calories: savedProfile.daily_calories
      })
      
      setUserProfile(savedProfile)
      console.log('🎉 Onboarding completed successfully - profile set in state')
    } catch (error) {
      console.error("❌ Error saving profile:", error)
      console.error('Error details:', error.message)
      
      // Fallback to local state if database save fails
      console.log('⚠️ Falling back to local state')
      setUserProfile(userData)
      
      // Show user that there was an issue but they can continue
      alert('Profile saved locally. You can continue using the app, but data may not sync across devices.')
    }
  }

  // Calculate total calories consumed today
  const getTotalCaloriesConsumed = () => {
    const today = new Date().toDateString()
    return Math.round(loggedMeals
      .filter(meal => new Date(meal.timestamp).toDateString() === today)
      .reduce((total, meal) => total + meal.calories, 0))
  }

  // Calculate total calories burned today
  const getTotalCaloriesBurned = () => {
    const today = new Date().toDateString()
    return Math.round(loggedWorkouts
      .filter(workout => new Date(workout.timestamp).toDateString() === today)
      .reduce((total, workout) => total + workout.caloriesBurned, 0))
  }

  // Calculate calorie deficit based on deficit goals
  const getRemainingCalories = () => {
    if (!userProfile?.recommendedCalories) return 0
    const recommendedCalories = userProfile.recommendedCalories
    const caloriesConsumed = getTotalCaloriesConsumed()
    const caloriesBurned = getTotalCaloriesBurned()
    
    // Formula: remaining = recommended + burned - consumed
    return Math.round(recommendedCalories + caloriesBurned - caloriesConsumed)
  }

  // Calculate net calories (consumed - burned)
  const getNetCalories = () => {
    return Math.round(getTotalCaloriesConsumed() - getTotalCaloriesBurned())
  }

  // Calculate daily deficit progress (how close to deficit goal)
  const getDailyDeficitProgress = () => {
    if (!userProfile?.dailyDeficit) return 0
    const recommendedCalories = userProfile.recommendedCalories || 0
    const caloriesConsumed = getTotalCaloriesConsumed()
    const caloriesBurned = getTotalCaloriesBurned()
    
    // Only calculate deficit if there's actual activity (meals or workouts logged today)
    const today = new Date().toDateString()
    const todayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === today)
    const todayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === today)
    const hasActivity = todayMeals.length > 0 || todayWorkouts.length > 0
    
    if (!hasActivity) {
      return 0 // No activity = no progress toward deficit goal
    }
    
    // Current deficit = (recommended + burned) - consumed
    const currentDeficit = (recommendedCalories + caloriesBurned) - caloriesConsumed
    const targetDeficit = userProfile.dailyDeficit
    
    return Math.max(0, Math.round((currentDeficit / targetDeficit) * 100))
  }

  // Calculate daily goal progress (legacy function for compatibility)
  const getDailyGoalProgress = () => {
    return getDailyDeficitProgress()
  }

  // Calculate workout goal progress
  const getWorkoutProgress = () => {
    if (!userProfile?.workoutCalories) return 0
    const caloriesBurned = getTotalCaloriesBurned()
    const targetWorkoutCalories = userProfile.workoutCalories
    return Math.max(0, Math.round((caloriesBurned / targetWorkoutCalories) * 100))
  }

  // Calculate weekly deficit progress
  const getWeeklyDeficitProgress = () => {
    if (!userProfile?.weeklyDeficit || !userProfile?.recommendedCalories) return 0
    
    // Get last 7 days of data
    const last7Days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toDateString()
      
      const dayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === dateString)
      const dayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === dateString)
      
      // Only calculate deficit if there's actual activity (meals or workouts logged)
      const hasActivity = dayMeals.length > 0 || dayWorkouts.length > 0
      
      if (hasActivity) {
        const dayConsumed = dayMeals.reduce((total, meal) => total + meal.calories, 0)
        const dayBurned = dayWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0)
        const dayDeficit = (userProfile.recommendedCalories + dayBurned) - dayConsumed
        last7Days.push(Math.max(0, dayDeficit))
      } else {
        // No activity = no deficit achieved
        last7Days.push(0)
      }
    }
    
    const weeklyDeficitAchieved = last7Days.reduce((total, deficit) => total + deficit, 0)
    const targetWeeklyDeficit = userProfile.weeklyDeficit
    
    return Math.max(0, Math.round((weeklyDeficitAchieved / targetWeeklyDeficit) * 100))
  }

  // Calculate streak
  const updateStreak = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    if (lastActivityDate === today) {
      // Already logged today, streak continues
      return
    } else if (lastActivityDate === yesterday) {
      // Logged yesterday, increment streak
      setCurrentStreak(prev => prev + 1)
    } else {
      // Missed a day, reset streak
      setCurrentStreak(1)
    }
    setLastActivityDate(today)
  }

  // Calculate macros from logged meals
  const getMacros = () => {
    const today = new Date().toDateString()
    const todayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === today)
    
    const totalCalories = Math.round(todayMeals.reduce((total, meal) => total + (meal.calories || 0), 0))
    const totalProtein = Math.round(todayMeals.reduce((total, meal) => total + (meal.protein || 0), 0))
    const totalCarbs = Math.round(todayMeals.reduce((total, meal) => total + (meal.carbs || 0), 0))
    const totalFat = Math.round(todayMeals.reduce((total, meal) => total + (meal.fat || 0), 0))
    const totalFiber = Math.round(todayMeals.reduce((total, meal) => total + (meal.fiber || 0), 0))
    
    return { calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat, fiber: totalFiber }
  }

  // Calculate weekly progress
  const getWeeklyProgress = () => {
    const today = new Date()
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    
    const weekMeals = loggedMeals.filter(meal => {
      const mealDate = new Date(meal.timestamp)
      return mealDate >= weekStart && mealDate <= weekEnd
    })
    
    const weekWorkouts = loggedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.timestamp)
      return workoutDate >= weekStart && workoutDate <= weekEnd
    })
    
    const totalWeekCalories = Math.round(weekMeals.reduce((total, meal) => total + meal.calories, 0))
    const totalWeekBurned = Math.round(weekWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0))
    const netWeekCalories = totalWeekCalories - totalWeekBurned
    
    if (!userProfile?.calories?.dailyCalories) return 0
    
    const weeklyTarget = userProfile.calories.dailyCalories * 7
    return Math.max(0, Math.round((netWeekCalories / weeklyTarget) * 100))
  }

  // Calculate weekly change percentage
  const getWeeklyChange = () => {
    const currentWeek = getWeeklyProgress()
    // For now, we'll use a simple calculation - in a real app, you'd compare to previous weeks
    const previousWeek = 85 // This would come from stored historical data
    const change = currentWeek - previousWeek
    return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`
  }

  // Calculate calories burned change
  const getCaloriesBurnedChange = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    const todayBurned = loggedWorkouts
      .filter(workout => new Date(workout.timestamp).toDateString() === today)
      .reduce((total, workout) => total + workout.caloriesBurned, 0)
    
    const yesterdayBurned = loggedWorkouts
      .filter(workout => new Date(workout.timestamp).toDateString() === yesterday)
      .reduce((total, workout) => total + workout.caloriesBurned, 0)
    
    if (yesterdayBurned === 0) return todayBurned > 0 ? "+100%" : "0%"
    
    const change = ((todayBurned - yesterdayBurned) / yesterdayBurned) * 100
    return change > 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`
  }

  // Calculate meals logged today
  const getMealsLoggedToday = () => {
    const today = new Date().toDateString()
    return loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === today).length
  }

  // Calculate average progress (based on goal achievement)
  const getAverageProgress = () => {
    const dailyGoalProgress = getDailyGoalProgress()
    const weeklyProgress = getWeeklyProgress()
    const streakBonus = Math.min(currentStreak * 5, 20) // Bonus for maintaining streak
    
    return Math.min(100, Math.round((dailyGoalProgress + weeklyProgress + streakBonus) / 3))
  }

  // AI-based optimization score (0-100)
  const getOptimizationScore = () => {
    if (!userProfile) return 0
    
    let score = 0
    const today = new Date().toDateString()
    
    // Diet Quality (30 points)
    const todayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === today)
    const totalProtein = todayMeals.reduce((total, meal) => total + (meal.protein || 0), 0)
    const totalCarbs = todayMeals.reduce((total, meal) => total + (meal.carbs || 0), 0)
    const totalFat = todayMeals.reduce((total, meal) => total + (meal.fat || 0), 0)
    
    // Protein adequacy (10 points)
    const targetProtein = userProfile.calories?.protein || 120
    const proteinScore = Math.min(10, Math.round((totalProtein / targetProtein) * 10))
    score += proteinScore
    
    // Macro balance (10 points)
    const totalCalories = todayMeals.reduce((total, meal) => total + meal.calories, 0)
    if (totalCalories > 0) {
      const proteinRatio = (totalProtein * 4) / totalCalories
      const carbsRatio = (totalCarbs * 4) / totalCalories
      const fatRatio = (totalFat * 9) / totalCalories
      
      // Ideal ratios: 30% protein, 45% carbs, 25% fat
      const macroBalance = 10 - Math.abs(proteinRatio - 0.3) * 20 - Math.abs(carbsRatio - 0.45) * 10 - Math.abs(fatRatio - 0.25) * 10
      score += Math.max(0, Math.round(macroBalance))
    }
    
    // Meal frequency (10 points)
    const mealFrequency = Math.min(10, Math.round(todayMeals.length * 2.5)) // 4 meals = 10 points
    score += mealFrequency
    
    // Exercise Quality (30 points)
    const todayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === today)
    const totalWorkoutTime = todayWorkouts.reduce((total, workout) => total + workout.duration, 0)
    const totalCaloriesBurned = todayWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0)
    
    // Workout duration (15 points)
    const durationScore = Math.min(15, Math.round((totalWorkoutTime / 60) * 15)) // 1 hour = 15 points
    score += durationScore
    
    // Workout intensity (15 points)
    const highIntensityWorkouts = todayWorkouts.filter(w => w.intensity === 'vigorous' || w.intensity === 'maximum').length
    const intensityScore = Math.min(15, highIntensityWorkouts * 7.5) // 2 high intensity = 15 points
    score += intensityScore
    
    // Goal Achievement (25 points)
    const dailyGoalProgress = getDailyGoalProgress()
    const goalScore = Math.min(25, (dailyGoalProgress / 100) * 25)
    score += goalScore
    
    // Consistency (15 points)
    const streakScore = Math.min(15, currentStreak * 1.5) // 10 day streak = 15 points
    score += streakScore
    
    return Math.round(score)
  }

  const meals = [
    { meal: "Avocado Toast", calories: 320, time: "8:30 AM" },
    { meal: "Grilled Salmon", calories: 450, time: "12:45 PM" },
    { meal: "Protein Smoothie", calories: 280, time: "3:15 PM" }
  ]

  const quickActions = [
    { label: "Log Meal", icon: Apple },
    { label: "Record Workout", icon: Dumbbell },
    { label: "Track Water", icon: Droplets },
    { label: "View Stats", icon: BarChart3 }
  ]

  const handleQuickAction = (action) => {
    if (action.label === "Log Meal") {
      setIsFoodModalOpen(true)
    } else if (action.label === "Record Workout") {
      setIsWorkoutModalOpen(true)
    } else if (action.label === "Track Water") {
      setIsWaterModalOpen(true)
    }
    // Add other action handlers here as needed
  }

  // Handle overlay quick actions
  const handleOverlayAction = (action) => {
    switch (action) {
      case "meal":
        setIsFoodModalOpen(true)
        break
      case "workout":
        setIsWorkoutModalOpen(true)
        break
      case "water":
        setIsWaterModalOpen(true)
        break
      case "stats":
        setIsStatsModalOpen(true)
        break
      default:
        break
    }
  }

  // Handle meal logging with streak tracking
  const handleMealLogged = async (mealData) => {
    // Use the timestamp from mealData (from date picker) or current time
    const timestamp = mealData.timestamp || new Date().toISOString()
    const newMeal = {
      ...mealData,
      timestamp
    }
    
    // Save to database first
    try {
      const savedMeal = await saveMeal({
        food: mealData.food,
        calories: mealData.calories,
        protein: mealData.protein || 0,
        carbs: mealData.carbs || 0,
        fat: mealData.fat || 0,
        fiber: mealData.fiber || 0,
        meal_type: mealData.mealType,
        timestamp
      })
      
      // Update local state with the saved meal (including database ID)
      const mealWithId = {
        id: savedMeal.id,
        food: mealData.food,
        calories: mealData.calories,
        protein: mealData.protein || 0,
        carbs: mealData.carbs || 0,
        fat: mealData.fat || 0,
        fiber: mealData.fiber || 0,
        mealType: mealData.mealType,
        timestamp
      }
      
      setLoggedMeals(prev => [...prev, mealWithId])
      updateStreak()
      
      console.log('Meal saved to database and local state updated')
    } catch (error) {
      console.error('Error saving meal:', error)
      // Still update local state for offline functionality
      setLoggedMeals(prev => [...prev, newMeal])
      updateStreak()
    }
  }

  // Handle workout recording with streak tracking
  const handleWorkoutRecorded = async (workoutData) => {
    const newWorkout = {
      ...workoutData,
      timestamp: new Date().toISOString()
    }
    
    // Update local state immediately for UI responsiveness
    setLoggedWorkouts(prev => [...prev, newWorkout])
    updateStreak()
    
    // Save to database
    try {
      await saveWorkout({
        exercise_type: workoutData.type,
        duration_minutes: workoutData.duration,
        intensity: workoutData.intensity,
        calories_burned: workoutData.caloriesBurned,
        notes: workoutData.notes,
        timestamp: newWorkout.timestamp
      })
      console.log('Workout saved to database')
    } catch (error) {
      console.error('Error saving workout:', error)
    }
  }

  // Handle water logging
  const handleWaterLogged = async (waterData) => {
    const newWaterEntry = {
      ...waterData,
      timestamp: new Date().toISOString()
    }
    
    // Update local state immediately for UI responsiveness
    setLoggedWater(prev => [...prev, newWaterEntry])
    
    // Save to database
    try {
      await saveWaterLog({
        amount_ml: waterData.amount,
        timestamp: newWaterEntry.timestamp
      })
      console.log('Water log saved to database')
    } catch (error) {
      console.error('Error saving water log:', error)
    }
  }

  // Calculate total water intake today
  const getTotalWaterToday = () => {
    const today = new Date().toDateString()
    return loggedWater
      .filter(entry => new Date(entry.timestamp).toDateString() === today)
      .reduce((total, entry) => total + entry.amount, 0)
  }

  // Calculate personalized daily water goal in ml
  const getDailyWaterGoal = () => {
    if (!userProfile?.weight) {
      return 2000 // Default 2L if no profile
    }
    
    // Convert kg to lbs if needed, then calculate baseline
    const weightInLbs = userProfile.weight * 2.2 // Convert kg to lbs
    let baselineOz = weightInLbs * (2/3) // 67% of body weight in ounces
    
    // Adjust for activity level
    const activityMultipliers = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.2,
      active: 1.3,
      veryActive: 1.4
    }
    
    const activityMultiplier = activityMultipliers[userProfile.activityLevel] || 1.0
    baselineOz *= activityMultiplier
    
    // Add extra for workout calories (approximate 12oz per 30min of exercise)
    if (userProfile.workoutCalories) {
      // Rough estimate: 100 calories burned = ~15 minutes exercise
      const estimatedExerciseMinutes = (userProfile.workoutCalories / 100) * 15
      const extraOzForWorkout = (estimatedExerciseMinutes / 30) * 12
      baselineOz += extraOzForWorkout
    }
    
    // Convert ounces to ml (1 oz = 29.5735 ml)
    const dailyGoalMl = Math.round(baselineOz * 29.5735)
    
    // Ensure reasonable bounds (1.5L - 4L)
    return Math.max(1500, Math.min(4000, dailyGoalMl))
  }

  // Calculate water streak
  const getWaterStreak = () => {
    if (loggedWater.length === 0) return 0
    
    const dailyGoal = getDailyWaterGoal()
    let streak = 0
    let currentDate = new Date()
    
    while (streak < 30) { // Check up to 30 days back
      const dateString = currentDate.toDateString()
      const dayWater = loggedWater
        .filter(entry => new Date(entry.timestamp).toDateString() === dateString)
        .reduce((total, entry) => total + entry.amount, 0)
      
      if (dayWater >= dailyGoal) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  // Handle meal deletion
  const handleMealDelete = async (mealToDelete) => {
    console.log('🗑️ handleMealDelete called with:', mealToDelete)
    console.log('🔍 Meal to delete details:', {
      id: mealToDelete.id,
      food: mealToDelete.food || mealToDelete.meal,
      timestamp: mealToDelete.timestamp,
      originalTimestamp: mealToDelete.originalTimestamp
    })
    
    // For meals loaded from database, use the ID
    if (mealToDelete.id) {
      console.log('💾 Deleting meal with database ID:', mealToDelete.id)
      try {
        await deleteMeal(mealToDelete.id)
        const beforeCount = loggedMeals.length
        setLoggedMeals(prev => prev.filter(meal => meal.id !== mealToDelete.id))
        console.log(`✅ Local state updated: ${beforeCount} meals → ${beforeCount - 1} meals`)
        console.log('Meal deleted from database and local state')
      } catch (error) {
        console.error('❌ Error deleting meal:', error)
        return // Don't update local state if database deletion failed
      }
    } else {
      console.log('⚠️ No database ID found, using fallback deletion method')
      // Fallback for meals not yet saved to database (legacy support)
      setLoggedMeals(prev => prev.filter((meal) => {
        const mealId = `${meal.food}-${meal.timestamp}`
        const deleteId = `${mealToDelete.meal}-${mealToDelete.originalTimestamp || ''}`
        return mealId !== deleteId
      }))
    }
    updateStreak()
  }



  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px',
      transition: 'all 0.5s',
      backgroundColor: isDark ? 'black' : 'white',
      color: isDark ? 'white' : 'black'
    }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h1 style={{
                fontSize: '3.75rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                letterSpacing: '-0.025em',
                lineHeight: '1',
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                color: isDark ? 'white' : 'black'
              }}>
                The Network School
              </h1>
              <p style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '1.125rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: isDark ? '#a3a3a3' : '#4b5563',
                textAlign: 'left'
              }}>
                Fitness & Wellness Tracking
              </p>
              <p style={{
                fontSize: '0.75rem',
                marginTop: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: isDark ? '#737373' : '#9ca3af',
                textAlign: 'left'
              }}>
                built by{' '}
                <a 
                  href="https://twitter.com/harryzhangs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: isDark ? '#a3a3a3' : '#6b7280',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = 'underline'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = 'none'
                  }}
                >
                  @harryzhangs
                </a>
              </p>
              <p style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.875rem',
                marginTop: '4px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: isDark ? '#737373' : '#6b7280',
                textAlign: 'left'
              }}>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: isDark ? 'white' : 'black',
                  border: `1px solid ${isDark ? 'white' : 'black'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? 'white' : 'black'
                  e.target.style.color = isDark ? 'black' : 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = isDark ? 'white' : 'black'
                }}
              >
                logout
              </button>
              <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '2.25rem',
                  fontWeight: 'bold',
                  letterSpacing: '-0.025em',
                  marginBottom: '4px',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  color: isDark ? 'white' : 'black'
                }}>
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: isDark ? '#a3a3a3' : '#4b5563'
                }}>
                  Current Time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '64px'
        }}>
                        <StatsCard 
                icon={Target} 
                title="Daily Deficit Goal" 
                value={userProfile ? ((() => {
                  const today = new Date().toDateString()
                  const todayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === today)
                  const todayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === today)
                  const hasActivity = todayMeals.length > 0 || todayWorkouts.length > 0
                  return hasActivity ? `${Math.round(getDailyDeficitProgress())}%` : "—"
                })()) : "—"} 
                isDark={isDark} 
                userData={userProfile}
                loggedMeals={loggedMeals}
                loggedWorkouts={loggedWorkouts}
                currentStreak={currentStreak}
                netCalories={getNetCalories()}
                weeklyProgress={getWeeklyDeficitProgress()}
              />
              <StatsCard 
                icon={Activity} 
                title="Weekly Deficit Progress" 
                value={userProfile ? ((() => {
                  // Check if there's any activity in the last 7 days
                  let hasWeeklyActivity = false
                  for (let i = 0; i < 7; i++) {
                    const date = new Date()
                    date.setDate(date.getDate() - i)
                    const dateString = date.toDateString()
                    const dayMeals = loggedMeals.filter(meal => new Date(meal.timestamp).toDateString() === dateString)
                    const dayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === dateString)
                    if (dayMeals.length > 0 || dayWorkouts.length > 0) {
                      hasWeeklyActivity = true
                      break
                    }
                  }
                  return hasWeeklyActivity ? `${Math.round(getWeeklyDeficitProgress())}%` : "—"
                })()) : "—"}
                isDark={isDark} 
                userData={userProfile}
                loggedMeals={loggedMeals}
                loggedWorkouts={loggedWorkouts}
                currentStreak={currentStreak}
                netCalories={getNetCalories()}
                weeklyProgress={getWeeklyDeficitProgress()}
              />
              <StatsCard 
                icon={Heart} 
                title="Workout Progress" 
                value={userProfile ? ((() => {
                  const today = new Date().toDateString()
                  const todayWorkouts = loggedWorkouts.filter(workout => new Date(workout.timestamp).toDateString() === today)
                  return todayWorkouts.length > 0 ? `${Math.round(getWorkoutProgress())}%` : "—"
                })()) : "—"} 
                isDark={isDark} 
                userData={userProfile}
                loggedMeals={loggedMeals}
                loggedWorkouts={loggedWorkouts}
                currentStreak={currentStreak}
                netCalories={getNetCalories()}
                weeklyProgress={getWeeklyDeficitProgress()}
              />
              <StatsCard 
                icon={Award} 
                title="Calorie Deficit" 
                value={userProfile ? getRemainingCalories().toString() : "—"} 
                isDark={isDark} 
                userData={userProfile}
                loggedMeals={loggedMeals}
                loggedWorkouts={loggedWorkouts}
                currentStreak={currentStreak}
                netCalories={getNetCalories()}
                weeklyProgress={getWeeklyDeficitProgress()}
              />
        </div>

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {/* Progress Rings */}
          <div>
            <div style={{
              backgroundColor: isDark ? '#000000' : 'white',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: isDark ? 'white' : 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}>
                  <BarChart3 style={{ width: '20px', height: '20px', color: isDark ? 'black' : 'white' }} strokeWidth={2.5} />
                </div>
                Macros
              </h2>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '48px'
              }}>
                <CircularProgress 
                  value={getMacros().calories} 
                  max={userProfile?.recommendedCalories || 2000} 
                  label="Calories" 
                  unit="cal" 
                  isDark={isDark} 
                />
                <CircularProgress 
                  value={getMacros().protein} 
                  max={userProfile?.calories?.protein || 120} 
                  label="Protein" 
                  unit="g" 
                  isDark={isDark} 
                />
                <CircularProgress 
                  value={getMacros().carbs} 
                  max={userProfile?.calories?.carbs || 200} 
                  label="Carbs" 
                  unit="g" 
                  isDark={isDark} 
                />
                <CircularProgress 
                  value={getMacros().fat} 
                  max={userProfile?.calories?.fat || 65} 
                  label="Fat" 
                  unit="g" 
                isDark={isDark} 
                />
                <CircularProgress 
                  value={getMacros().fiber} 
                  max={userProfile?.calories?.fiber || 25} 
                  label="Fiber" 
                  unit="g" 
                  isDark={isDark} 
                />
              </div>
            </div>
          </div>

          {/* Today's Meals */}
          <div>
            <div style={{
              backgroundColor: isDark ? '#000000' : 'white',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              borderRadius: '8px',
              padding: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
                marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: isDark ? 'white' : 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}>
                <Camera style={{ width: '20px', height: '20px', color: isDark ? 'black' : 'white' }} strokeWidth={2.5} />
              </div>
              Today's Meals
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {loggedMeals.length > 0 ? (
                loggedMeals
                  .filter(meal => new Date(meal.timestamp).toDateString() === new Date().toDateString())
                  .map((meal, index) => (
                    <MealCard 
                      key={`${meal.food}-${index}`} 
                      meal={{
                        meal: meal.food,
                        calories: meal.calories,
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat,
                        fiber: meal.fiber,
                        originalTimestamp: meal.timestamp,
                        time: meal.mealType ? meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1) : 'Meal',

                      }} 
                      isDark={isDark} 
                      onDelete={handleMealDelete}
                    />
                  ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '48px',
                  color: isDark ? '#a3a3a3' : '#6b7280',
                  fontStyle: 'italic'
                }}>
                  No meals logged today. Log your first meal to get started!
                </div>
              )}
            </div>
            </div>
          </div>
        </div>


      </div>


      
      {/* Food Logging Modal */}
      <FoodLoggingModal 
        isOpen={isFoodModalOpen} 
        onClose={() => setIsFoodModalOpen(false)} 
        isDark={isDark} 
        onMealLogged={handleMealLogged}
      />
      
      {/* Workout Recording Modal */}
      <WorkoutRecordingModal 
        isOpen={isWorkoutModalOpen} 
        onClose={() => setIsWorkoutModalOpen(false)} 
        isDark={isDark}
        userProfile={userProfile}
        onWorkoutRecorded={handleWorkoutRecorded}
      />

      {/* Water Tracking Modal */}
      <WaterTrackingModal
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        onWaterLogged={handleWaterLogged}
        isDark={isDark}
        totalWaterToday={getTotalWaterToday()}
        waterStreak={getWaterStreak()}
        dailyGoal={getDailyWaterGoal()}
        userProfile={userProfile}
      />

      {/* Deficit Onboarding Modal */}
      <DeficitOnboarding
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        isDark={isDark}
      />

      {/* Floating Plus Button */}
      <button
        onClick={() => setIsQuickAccessOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          backgroundColor: isDark ? 'white' : 'black',
          color: isDark ? 'black' : 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDark 
            ? '0 4px 12px rgba(255, 255, 255, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          transform: isQuickAccessOpen ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
        onMouseEnter={(e) => {
          if (!isQuickAccessOpen) {
            e.target.style.transform = 'scale(1.1) rotate(0deg)'
            e.target.style.boxShadow = isDark 
              ? '0 6px 16px rgba(255, 255, 255, 0.4)' 
              : '0 6px 16px rgba(0, 0, 0, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isQuickAccessOpen) {
            e.target.style.transform = 'scale(1) rotate(0deg)'
            e.target.style.boxShadow = isDark 
              ? '0 4px 12px rgba(255, 255, 255, 0.3)' 
              : '0 4px 12px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* Quick Access Overlay */}
      <QuickAccessOverlay
        isOpen={isQuickAccessOpen}
        onClose={() => setIsQuickAccessOpen(false)}
        isDark={isDark}
        onActionSelect={handleOverlayAction}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        isDark={isDark}
        userProfile={userProfile}
        loggedMeals={loggedMeals}
        loggedWorkouts={loggedWorkouts}
        loggedWater={loggedWater}
      />


    </div>
  )
}