import React, { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Activity, Target, Calendar, Award, Share2 } from 'lucide-react'
import ShareModal from './ShareModal'

function TrendReport({ 
  loggedMeals = [], 
  loggedWorkouts = [], 
  userProfile = null, 
  isDark = false,
  selectedDate = new Date()
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const reportData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })
    
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })

    // Calculate nutrition trends
    const weeklyNutrition = {
      totalCalories: 0,
      avgCalories: 0,
      totalProtein: 0,
      avgProtein: 0,
      daysLogged: 0
    }

    const monthlyNutrition = {
      totalCalories: 0,
      avgCalories: 0,
      totalProtein: 0,
      avgProtein: 0,
      daysLogged: 0
    }

    // Calculate workout trends
    const weeklyWorkouts = {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCaloriesBurned: 0,
      avgDuration: 0,
      mostCommonType: 'None'
    }

    const monthlyWorkouts = {
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCaloriesBurned: 0,
      avgDuration: 0,
      mostCommonType: 'None'
    }

    // Process weekly data
    const weeklyMealDays = new Set()
    last7Days.forEach(dateString => {
      const dayMeals = loggedMeals.filter(meal => 
        new Date(meal.timestamp).toDateString() === dateString
      )
      const dayWorkouts = loggedWorkouts.filter(workout => 
        new Date(workout.timestamp).toDateString() === dateString
      )

      if (dayMeals.length > 0) {
        weeklyMealDays.add(dateString)
        const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0)
        const dayProtein = dayMeals.reduce((sum, meal) => sum + meal.protein, 0)
        weeklyNutrition.totalCalories += dayCalories
        weeklyNutrition.totalProtein += dayProtein
      }

      weeklyWorkouts.totalWorkouts += dayWorkouts.length
      weeklyWorkouts.totalMinutes += dayWorkouts.reduce((sum, w) => sum + (w.totalDuration || w.duration || 0), 0)
      weeklyWorkouts.totalCaloriesBurned += dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
    })

    weeklyNutrition.daysLogged = weeklyMealDays.size
    weeklyNutrition.avgCalories = weeklyNutrition.daysLogged > 0 ? Math.round(weeklyNutrition.totalCalories / weeklyNutrition.daysLogged) : 0
    weeklyNutrition.avgProtein = weeklyNutrition.daysLogged > 0 ? Math.round(weeklyNutrition.totalProtein / weeklyNutrition.daysLogged) : 0
    weeklyWorkouts.avgDuration = weeklyWorkouts.totalWorkouts > 0 ? Math.round(weeklyWorkouts.totalMinutes / weeklyWorkouts.totalWorkouts) : 0

    // Process monthly data
    const monthlyMealDays = new Set()
    last30Days.forEach(dateString => {
      const dayMeals = loggedMeals.filter(meal => 
        new Date(meal.timestamp).toDateString() === dateString
      )
      const dayWorkouts = loggedWorkouts.filter(workout => 
        new Date(workout.timestamp).toDateString() === dateString
      )

      if (dayMeals.length > 0) {
        monthlyMealDays.add(dateString)
        const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0)
        const dayProtein = dayMeals.reduce((sum, meal) => sum + meal.protein, 0)
        monthlyNutrition.totalCalories += dayCalories
        monthlyNutrition.totalProtein += dayProtein
      }

      monthlyWorkouts.totalWorkouts += dayWorkouts.length
      monthlyWorkouts.totalMinutes += dayWorkouts.reduce((sum, w) => sum + (w.totalDuration || w.duration || 0), 0)
      monthlyWorkouts.totalCaloriesBurned += dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
    })

    monthlyNutrition.daysLogged = monthlyMealDays.size
    monthlyNutrition.avgCalories = monthlyNutrition.daysLogged > 0 ? Math.round(monthlyNutrition.totalCalories / monthlyNutrition.daysLogged) : 0
    monthlyNutrition.avgProtein = monthlyNutrition.daysLogged > 0 ? Math.round(monthlyNutrition.totalProtein / monthlyNutrition.daysLogged) : 0
    monthlyWorkouts.avgDuration = monthlyWorkouts.totalWorkouts > 0 ? Math.round(monthlyWorkouts.totalMinutes / monthlyWorkouts.totalWorkouts) : 0

    // Find most common workout type
    const workoutTypes = {}
    loggedWorkouts.forEach(workout => {
      if (last7Days.includes(new Date(workout.timestamp).toDateString())) {
        const type = workout.type || 'General'
        workoutTypes[type] = (workoutTypes[type] || 0) + 1
      }
    })
    weeklyWorkouts.mostCommonType = Object.keys(workoutTypes).reduce((a, b) => 
      workoutTypes[a] > workoutTypes[b] ? a : b, 'None'
    )

    const monthlyWorkoutTypes = {}
    loggedWorkouts.forEach(workout => {
      if (last30Days.includes(new Date(workout.timestamp).toDateString())) {
        const type = workout.type || 'General'
        monthlyWorkoutTypes[type] = (monthlyWorkoutTypes[type] || 0) + 1
      }
    })
    monthlyWorkouts.mostCommonType = Object.keys(monthlyWorkoutTypes).reduce((a, b) => 
      monthlyWorkoutTypes[a] > monthlyWorkoutTypes[b] ? a : b, 'None'
    )

    // Calculate progress insights
    const insights = []
    
    if (weeklyWorkouts.totalWorkouts >= 3) {
      insights.push({
        type: 'success',
        icon: Award,
        title: 'Great Consistency!',
        description: `You've completed ${weeklyWorkouts.totalWorkouts} workouts this week. Keep it up!`
      })
    } else if (weeklyWorkouts.totalWorkouts >= 1) {
      insights.push({
        type: 'warning',
        icon: Target,
        title: 'Room for Improvement',
        description: `Only ${weeklyWorkouts.totalWorkouts} workout${weeklyWorkouts.totalWorkouts !== 1 ? 's' : ''} this week. Try to aim for 3+ per week.`
      })
    } else {
      insights.push({
        type: 'info',
        icon: Activity,
        title: 'Get Moving!',
        description: 'No workouts logged this week. Start with just 20 minutes today!'
      })
    }

    if (weeklyNutrition.daysLogged >= 5) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Excellent Tracking!',
        description: `You've logged meals for ${weeklyNutrition.daysLogged} days this week.`
      })
    } else if (weeklyNutrition.daysLogged >= 3) {
      insights.push({
        type: 'warning',
        icon: Calendar,
        title: 'Good Progress',
        description: `${weeklyNutrition.daysLogged} days of meal tracking. Try to log every day for better insights.`
      })
    }

    // Compare with goals
    if (userProfile?.dailyDeficit && weeklyNutrition.avgCalories > 0) {
      const recommendedCalories = userProfile.recommendedCalories || 2200
      const avgDeficit = recommendedCalories - weeklyNutrition.avgCalories

      if (avgDeficit >= userProfile.dailyDeficit * 0.8) {
        insights.push({
          type: 'success',
          icon: TrendingUp,
          title: 'On Track with Goals!',
          description: `Your average deficit of ${Math.round(avgDeficit)} calories is close to your ${userProfile.dailyDeficit} calorie target.`
        })
      } else {
        insights.push({
          type: 'info',
          icon: TrendingDown,
          title: 'Adjust Your Approach',
          description: `Current deficit: ${Math.round(avgDeficit)} cal. Target: ${userProfile.dailyDeficit} cal. Consider reducing portions or increasing activity.`
        })
      }
    }

    return {
      weekly: {
        nutrition: weeklyNutrition,
        workouts: weeklyWorkouts
      },
      monthly: {
        nutrition: monthlyNutrition,
        workouts: monthlyWorkouts
      },
      insights,
      generatedAt: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }, [loggedMeals, loggedWorkouts, userProfile])

  if (!reportData.weekly.nutrition.daysLogged && !reportData.weekly.workouts.totalWorkouts) {
    return (
      <div style={{
        backgroundColor: isDark ? 'black' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        padding: '32px',
        textAlign: 'center'
      }}>
        <Activity style={{ 
          width: '48px', 
          height: '48px', 
          color: isDark ? '#666' : '#ccc',
          marginBottom: '16px'
        }} />
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black',
          marginBottom: '8px',
          fontFamily: 'Georgia, "Times New Roman", Times, serif'
        }}>
          No Data Available
        </h3>
        <p style={{
          fontSize: '16px',
          color: isDark ? '#a3a3a3' : '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Start logging meals and workouts to see your personalized trend report!
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: isDark ? 'black' : 'white',
      border: `2px solid ${isDark ? 'white' : 'black'}`,
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            margin: 0,
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            Fitness Trend Report
          </h3>
          <div style={{
            fontSize: '14px',
            color: isDark ? '#a3a3a3' : '#6b7280',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginTop: '4px'
          }}>
            Generated: {reportData.generatedAt}
          </div>
        </div>
        <button
          onClick={() => setIsShareModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            border: `2px solid ${isDark ? 'white' : 'black'}`,
            backgroundColor: isDark ? 'black' : 'white',
            color: isDark ? 'white' : 'black',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <Share2 size={16} />
          Share Progress
        </button>
      </div>

      {/* Key Insights */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black',
          marginBottom: '16px',
          fontFamily: 'Georgia, "Times New Roman", Times, serif'
        }}>
          Key Insights
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {reportData.insights.map((insight, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`
            }}>
              <insight.icon style={{
                width: '20px',
                height: '20px',
                color: insight.type === 'success' 
                  ? '#22c55e' 
                  : insight.type === 'warning' 
                  ? '#f59e0b' 
                  : isDark ? 'white' : 'black',
                marginTop: '2px'
              }} />
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black',
                  marginBottom: '4px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {insight.title}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: isDark ? '#a3a3a3' : '#6b7280',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {insight.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly vs Monthly Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Weekly Summary */}
        <div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            marginBottom: '16px',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            This Week
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.weekly.nutrition.avgCalories}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Avg Calories/Day
              </div>
            </div>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.weekly.workouts.totalWorkouts}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Workouts
              </div>
            </div>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.weekly.workouts.totalMinutes}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Exercise Minutes
              </div>
            </div>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.weekly.nutrition.daysLogged}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Days Tracked
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            marginBottom: '16px',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            This Month
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.monthly.nutrition.avgCalories}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Avg Calories/Day
              </div>
            </div>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.monthly.workouts.totalWorkouts}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Workouts
              </div>
            </div>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.monthly.workouts.totalMinutes}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Exercise Minutes
              </div>
            </div>
            <div style={{
              padding: '16px',
              border: `1px solid ${isDark ? '#333' : '#e5e5e5'}`,
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                {reportData.monthly.nutrition.daysLogged}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Days Tracked
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isDark={isDark}
        reportData={reportData}
      />
    </div>
  )
}

export default TrendReport
