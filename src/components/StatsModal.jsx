import React, { useState, useEffect } from 'react'
import {
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import {
  X,
  Flame,
  Target,
  Droplets,
  Dumbbell,
  Apple,
  Calendar,
  TrendingUp
} from 'lucide-react'

// Custom tooltip components
const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: isDark ? '#000000' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '8px',
        padding: '12px',
        color: isDark ? 'white' : 'black',
        fontSize: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '2px 0' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value) || 0
    if (start === end) return

    const increment = end / (duration / 50)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 50)

    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

export default function StatsModal({ isOpen, onClose, isDark = true, userProfile, loggedMeals = [], loggedWorkouts = [], loggedWater = [] }) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Calculate real data from logged activities
  const calculateWeeklyData = () => {
    const today = new Date()
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dayName = weekDays[date.getDay()]
      const dateString = date.toDateString()

      // Calculate meals for this day
      const dayMeals = loggedMeals.filter(meal => 
        new Date(meal.timestamp).toDateString() === dateString
      )
      const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)

      // Calculate workouts for this day
      const dayWorkouts = loggedWorkouts.filter(workout => 
        new Date(workout.timestamp).toDateString() === dateString
      )
      const totalBurned = dayWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0)

      // Calculate water for this day
      const dayWater = loggedWater.filter(water => 
        new Date(water.timestamp).toDateString() === dateString
      )
      const totalWater = dayWater.reduce((sum, water) => sum + (water.amount || 0), 0) / 1000 // Convert to liters

      weeklyData.push({
        day: dayName,
        date: dateString,
        calories: totalCalories,
        burned: totalBurned,
        water: totalWater,
        workouts: dayWorkouts.length
      })
    }

    return weeklyData
  }

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateString = date.toDateString()
      
      const hasActivity = loggedMeals.some(meal => new Date(meal.timestamp).toDateString() === dateString) ||
                         loggedWorkouts.some(workout => new Date(workout.timestamp).toDateString() === dateString) ||
                         loggedWater.some(water => new Date(water.timestamp).toDateString() === dateString)
      
      if (hasActivity) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  // Calculate weekly totals
  const calculateWeeklyTotals = () => {
    const weekData = calculateWeeklyData()
    return {
      totalCalories: weekData.reduce((sum, day) => sum + day.calories, 0),
      totalBurned: weekData.reduce((sum, day) => sum + day.burned, 0),
      totalWater: weekData.reduce((sum, day) => sum + day.water, 0),
      totalWorkouts: weekData.reduce((sum, day) => sum + day.workouts, 0)
    }
  }

  if (!isOpen) return null

  const weeklyData = calculateWeeklyData()
  const currentStreak = calculateStreak()
  const weeklyTotals = calculateWeeklyTotals()
  const goalCalories = userProfile?.recommendedCalories || 2000

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#000000' : 'white',
      zIndex: 3000,
      overflow: 'auto',
      animation: isAnimating ? 'slideInRight 0.3s ease-out' : 'none'
    }}>
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: `2px solid ${isDark ? 'white' : 'black'}`
        }}>
          <h1 style={{
            color: isDark ? 'white' : 'black',
            fontSize: '32px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            margin: 0
          }}>
            Your Analytics
          </h1>
          
          <button
            onClick={onClose}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isDark ? 'white' : 'black',
              color: isDark ? 'black' : 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Weekly Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Streak Card */}
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Flame size={24} color={isDark ? 'white' : 'black'} />
              <span style={{ color: isDark ? 'white' : 'black', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                <AnimatedCounter value={currentStreak} />
              </span>
            </div>
            <p style={{ color: isDark ? '#cccccc' : '#666666', fontSize: '14px', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Day Streak
            </p>
          </div>

          {/* Calories Consumed */}
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Apple size={24} color={isDark ? 'white' : 'black'} />
              <span style={{ color: isDark ? 'white' : 'black', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                <AnimatedCounter value={weeklyTotals.totalCalories} />
              </span>
            </div>
            <p style={{ color: isDark ? '#cccccc' : '#666666', fontSize: '14px', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Calories This Week
            </p>
          </div>

          {/* Calories Burned */}
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Dumbbell size={24} color={isDark ? 'white' : 'black'} />
              <span style={{ color: isDark ? 'white' : 'black', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                <AnimatedCounter value={weeklyTotals.totalBurned} />
              </span>
            </div>
            <p style={{ color: isDark ? '#cccccc' : '#666666', fontSize: '14px', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Calories Burned
            </p>
          </div>

          {/* Water Intake */}
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Droplets size={24} color={isDark ? 'white' : 'black'} />
              <span style={{ color: isDark ? 'white' : 'black', fontSize: '28px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
                {weeklyTotals.totalWater.toFixed(1)}L
              </span>
            </div>
            <p style={{ color: isDark ? '#cccccc' : '#666666', fontSize: '14px', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Water This Week
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Daily Calories Chart */}
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            minHeight: '350px'
          }}>
            <h3 style={{ 
              color: isDark ? 'white' : 'black', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontFamily: 'Georgia, serif'
            }}>
              <Target size={20} />
              Daily Calories
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? 'white' : 'black'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isDark ? 'white' : 'black'} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} />
                <XAxis dataKey="day" stroke={isDark ? 'white' : 'black'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} />
                <YAxis stroke={isDark ? 'white' : 'black'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Line type="monotone" dataKey={goalCalories} stroke={isDark ? '#666666' : '#999999'} strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="calories" stroke={isDark ? 'white' : 'black'} fillOpacity={1} fill="url(#caloriesGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Water Chart */}
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            minHeight: '350px'
          }}>
            <h3 style={{ 
              color: isDark ? 'white' : 'black', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontFamily: 'Georgia, serif'
            }}>
              <Droplets size={20} />
              Daily Hydration
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'} />
                <XAxis dataKey="day" stroke={isDark ? 'white' : 'black'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} />
                <YAxis stroke={isDark ? 'white' : 'black'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Bar dataKey="water" fill={isDark ? 'white' : 'black'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Section */}
        {weeklyTotals.totalCalories === 0 && weeklyTotals.totalBurned === 0 && weeklyTotals.totalWater === 0 ? (
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <Calendar size={48} color={isDark ? 'white' : 'black'} style={{ marginBottom: '16px' }} />
            <h3 style={{
              color: isDark ? 'white' : 'black',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '12px',
              fontFamily: 'Georgia, serif'
            }}>
              Start Your Journey
            </h3>
            <p style={{
              color: isDark ? '#cccccc' : '#666666',
              fontSize: '16px',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Log your first meal, workout, or water intake to see your analytics here.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: isDark ? '#000000' : 'white',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <TrendingUp size={32} color={isDark ? 'white' : 'black'} style={{ marginBottom: '12px' }} />
            <h3 style={{
              color: isDark ? 'white' : 'black',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '8px',
              fontFamily: 'Georgia, serif'
            }}>
              Keep Going!
            </h3>
            <p style={{
              color: isDark ? '#cccccc' : '#666666',
              fontSize: '14px',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              You're making great progress. Stay consistent to reach your goals.
            </p>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}