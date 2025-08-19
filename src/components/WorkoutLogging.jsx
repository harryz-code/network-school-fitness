import { useState, useEffect } from 'react'
import { 
  Dumbbell, 
  Heart, 
  Zap, 
  Trophy, 
  User, 
  Move, 
  Plus, 
  Minus, 
  X, 
  Search,
  Clock,
  Target,
  Activity,
  ChevronRight,
  Calendar
} from 'lucide-react'

function WorkoutLogging({ 
  isOpen, 
  onClose, 
  isDark = false, 
  onWorkoutLogged, 
  preSelectedDate = new Date() 
}) {
  const [showWorkoutTypeSelection, setShowWorkoutTypeSelection] = useState(true)
  const [workoutType, setWorkoutType] = useState('')
  const [selectedDate, setSelectedDate] = useState(preSelectedDate.toISOString().split('T')[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExercises, setSelectedExercises] = useState([])
  const [workoutName, setWorkoutName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(preSelectedDate.toISOString().split('T')[0])
      setShowWorkoutTypeSelection(true)
      setWorkoutType('')
      setSelectedExercises([])
      setSearchQuery('')
      setWorkoutName('')
      setNotes('')
    }
  }, [isOpen, preSelectedDate])

  // Exercise databases by workout type
  const exerciseDatabase = {
    strength: [
      // Upper Body
      { id: 1001, name: "Push-ups", category: "Upper Body", targetMuscle: "Chest, Triceps", equipment: "Bodyweight", caloriesPerRep: 0.5 },
      { id: 1002, name: "Pull-ups", category: "Upper Body", targetMuscle: "Back, Biceps", equipment: "Pull-up Bar", caloriesPerRep: 0.7 },
      { id: 1003, name: "Bench Press", category: "Upper Body", targetMuscle: "Chest", equipment: "Barbell", caloriesPerRep: 0.8 },
      { id: 1004, name: "Dumbbell Rows", category: "Upper Body", targetMuscle: "Back", equipment: "Dumbbells", caloriesPerRep: 0.6 },
      { id: 1005, name: "Shoulder Press", category: "Upper Body", targetMuscle: "Shoulders", equipment: "Dumbbells", caloriesPerRep: 0.6 },
      { id: 1006, name: "Bicep Curls", category: "Upper Body", targetMuscle: "Biceps", equipment: "Dumbbells", caloriesPerRep: 0.4 },
      { id: 1007, name: "Tricep Dips", category: "Upper Body", targetMuscle: "Triceps", equipment: "Bench", caloriesPerRep: 0.5 },
      
      // Lower Body
      { id: 1010, name: "Squats", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Bodyweight", caloriesPerRep: 0.6 },
      { id: 1011, name: "Deadlifts", category: "Lower Body", targetMuscle: "Hamstrings, Glutes", equipment: "Barbell", caloriesPerRep: 1.0 },
      { id: 1012, name: "Lunges", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Bodyweight", caloriesPerRep: 0.5 },
      { id: 1013, name: "Leg Press", category: "Lower Body", targetMuscle: "Quads", equipment: "Machine", caloriesPerRep: 0.7 },
      { id: 1014, name: "Calf Raises", category: "Lower Body", targetMuscle: "Calves", equipment: "Bodyweight", caloriesPerRep: 0.3 },
      { id: 1015, name: "Bulgarian Split Squats", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Bodyweight", caloriesPerRep: 0.6 },
      
      // Core
      { id: 1020, name: "Plank", category: "Core", targetMuscle: "Core", equipment: "Bodyweight", caloriesPerSecond: 0.1 },
      { id: 1021, name: "Crunches", category: "Core", targetMuscle: "Abs", equipment: "Bodyweight", caloriesPerRep: 0.2 },
      { id: 1022, name: "Russian Twists", category: "Core", targetMuscle: "Obliques", equipment: "Bodyweight", caloriesPerRep: 0.3 },
      { id: 1023, name: "Mountain Climbers", category: "Core", targetMuscle: "Core, Cardio", equipment: "Bodyweight", caloriesPerRep: 0.4 },
      { id: 1024, name: "Dead Bug", category: "Core", targetMuscle: "Core", equipment: "Bodyweight", caloriesPerRep: 0.2 }
    ],
    
    cardio: [
      { id: 2001, name: "Treadmill Running", category: "Cardio", intensity: "Moderate", equipment: "Treadmill", caloriesPerMinute: 10 },
      { id: 2002, name: "Cycling", category: "Cardio", intensity: "Moderate", equipment: "Bike", caloriesPerMinute: 8 },
      { id: 2003, name: "Elliptical", category: "Cardio", intensity: "Moderate", equipment: "Elliptical", caloriesPerMinute: 9 },
      { id: 2004, name: "Rowing Machine", category: "Cardio", intensity: "High", equipment: "Rowing Machine", caloriesPerMinute: 12 },
      { id: 2005, name: "Jump Rope", category: "Cardio", intensity: "High", equipment: "Jump Rope", caloriesPerMinute: 11 },
      { id: 2006, name: "Stair Climber", category: "Cardio", intensity: "High", equipment: "Stair Climber", caloriesPerMinute: 10 },
      { id: 2007, name: "Swimming", category: "Cardio", intensity: "Moderate", equipment: "Pool", caloriesPerMinute: 11 },
      { id: 2008, name: "Walking", category: "Cardio", intensity: "Light", equipment: "None", caloriesPerMinute: 4 }
    ],
    
    hiit: [
      { id: 3001, name: "Burpees", category: "HIIT", targetMuscle: "Full Body", equipment: "Bodyweight", caloriesPerRep: 1.0 },
      { id: 3002, name: "High Knees", category: "HIIT", targetMuscle: "Legs, Cardio", equipment: "Bodyweight", caloriesPerRep: 0.3 },
      { id: 3003, name: "Jump Squats", category: "HIIT", targetMuscle: "Legs", equipment: "Bodyweight", caloriesPerRep: 0.7 },
      { id: 3004, name: "Box Jumps", category: "HIIT", targetMuscle: "Legs", equipment: "Box", caloriesPerRep: 0.8 },
      { id: 3005, name: "Battle Ropes", category: "HIIT", targetMuscle: "Full Body", equipment: "Battle Ropes", caloriesPerMinute: 15 },
      { id: 3006, name: "Kettlebell Swings", category: "HIIT", targetMuscle: "Full Body", equipment: "Kettlebell", caloriesPerRep: 0.6 }
    ],
    
    sports: [
      { id: 4001, name: "Basketball", category: "Sports", intensity: "High", equipment: "Ball, Court", caloriesPerMinute: 8 },
      { id: 4002, name: "Soccer", category: "Sports", intensity: "High", equipment: "Ball, Field", caloriesPerMinute: 9 },
      { id: 4003, name: "Tennis", category: "Sports", intensity: "Moderate", equipment: "Racket, Court", caloriesPerMinute: 7 },
      { id: 4004, name: "Badminton", category: "Sports", intensity: "Moderate", equipment: "Racket, Court", caloriesPerMinute: 6 },
      { id: 4005, name: "Table Tennis", category: "Sports", intensity: "Light", equipment: "Paddle, Table", caloriesPerMinute: 4 },
      { id: 4006, name: "Volleyball", category: "Sports", intensity: "Moderate", equipment: "Ball, Net", caloriesPerMinute: 6 }
    ],
    
    yoga: [
      { id: 5001, name: "Hatha Yoga", category: "Yoga", intensity: "Light", equipment: "Mat", caloriesPerMinute: 3 },
      { id: 5002, name: "Vinyasa Flow", category: "Yoga", intensity: "Moderate", equipment: "Mat", caloriesPerMinute: 4 },
      { id: 5003, name: "Power Yoga", category: "Yoga", intensity: "High", equipment: "Mat", caloriesPerMinute: 6 },
      { id: 5004, name: "Yin Yoga", category: "Yoga", intensity: "Light", equipment: "Mat", caloriesPerMinute: 2 },
      { id: 5005, name: "Hot Yoga", category: "Yoga", intensity: "High", equipment: "Mat", caloriesPerMinute: 7 }
    ],
    
    flexibility: [
      { id: 6001, name: "Static Stretching", category: "Flexibility", intensity: "Light", equipment: "Mat", caloriesPerMinute: 2 },
      { id: 6002, name: "Dynamic Stretching", category: "Flexibility", intensity: "Light", equipment: "None", caloriesPerMinute: 3 },
      { id: 6003, name: "Foam Rolling", category: "Recovery", intensity: "Light", equipment: "Foam Roller", caloriesPerMinute: 2 },
      { id: 6004, name: "Mobility Work", category: "Flexibility", intensity: "Light", equipment: "None", caloriesPerMinute: 3 }
    ]
  }

  const workoutTypes = [
    { id: 'strength', name: 'Strength Training', icon: Dumbbell, description: 'Build muscle and strength' },
    { id: 'cardio', name: 'Cardio', icon: Heart, description: 'Improve cardiovascular health' },
    { id: 'hiit', name: 'HIIT', icon: Zap, description: 'High-intensity interval training' },
    { id: 'sports', name: 'Sports', icon: Trophy, description: 'Recreational and competitive sports' },
    { id: 'yoga', name: 'Yoga', icon: User, description: 'Flexibility and mindfulness' },
    { id: 'flexibility', name: 'Flexibility', icon: Move, description: 'Stretching and mobility' }
  ]

  const getCurrentExercises = () => {
    return exerciseDatabase[workoutType] || []
  }

  const filteredExercises = getCurrentExercises().filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.targetMuscle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      sets: workoutType === 'strength' ? [{ reps: 10, weight: 0, restTime: 60 }] : [],
      duration: workoutType !== 'strength' ? 10 : 0, // minutes for cardio/other
      totalCalories: 0
    }
    setSelectedExercises(prev => [...prev, newExercise])
  }

  const removeExercise = (index) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index))
  }

  const updateExerciseSets = (exerciseIndex, sets) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex ? { ...exercise, sets } : exercise
    ))
  }

  const updateExerciseDuration = (exerciseIndex, duration) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex ? { 
        ...exercise, 
        duration,
        totalCalories: Math.round((exercise.caloriesPerMinute || 0) * duration)
      } : exercise
    ))
  }

  const updateExerciseManualCalories = (exerciseIndex, manualCalories) => {
    setSelectedExercises(prev => prev.map((exercise, i) => 
      i === exerciseIndex ? { 
        ...exercise, 
        manualCalories: manualCalories || undefined
      } : exercise
    ))
  }

  const calculateTotalCalories = () => {
    return selectedExercises.reduce((total, exercise) => {
      // If user manually set calories, use that
      if (exercise.manualCalories !== undefined) {
        return total + exercise.manualCalories
      }

      if (workoutType === 'strength') {
        const totalReps = exercise.sets.reduce((reps, set) => reps + (set.reps || 0), 0)
        return total + Math.round(totalReps * (exercise.caloriesPerRep || 0))
      } else {
        return total + Math.round(exercise.duration * (exercise.caloriesPerMinute || 0))
      }
    }, 0)
  }

  const calculateTotalDuration = () => {
    if (workoutType === 'strength') {
      return selectedExercises.reduce((total, exercise) => {
        const setsTime = exercise.sets.length * 2 // 2 minutes per set average
        const restTime = exercise.sets.reduce((rest, set) => rest + (set.restTime || 60), 0) / 60
        return total + setsTime + restTime
      }, 0)
    } else {
      return selectedExercises.reduce((total, exercise) => total + exercise.duration, 0)
    }
  }

  const handleSaveWorkout = async () => {
    if (selectedExercises.length === 0) return

    const totalCalories = calculateTotalCalories()
    const totalDuration = Math.round(calculateTotalDuration())

    // Create timestamp from selected date
    const selectedDateTime = new Date(selectedDate)
    selectedDateTime.setHours(new Date().getHours())
    selectedDateTime.setMinutes(new Date().getMinutes())

    const workoutData = {
      type: workoutType,
      name: workoutName || `${workoutTypes.find(t => t.id === workoutType)?.name} Workout`,
      exercises: selectedExercises,
      totalDuration,
      caloriesBurned: totalCalories,
      notes,
      timestamp: selectedDateTime.toISOString()
    }

    if (onWorkoutLogged) {
      await onWorkoutLogged(workoutData)
    }

    onClose()
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
        backgroundColor: isDark ? 'black' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '0px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        fontFamily: 'Georgia, "Times New Roman", Times, serif'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: `2px solid ${isDark ? 'white' : 'black'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              letterSpacing: '-0.025em'
            }}>
              Log Workout
            </h2>
            <p style={{
              margin: 0,
              color: isDark ? '#a3a3a3' : '#6b7280',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: `2px solid ${isDark ? 'white' : 'black'}`,
              backgroundColor: isDark ? 'black' : 'white',
              color: isDark ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '32px',
          maxHeight: 'calc(90vh - 120px)',
          overflowY: 'auto'
        }}>
          {/* Workout Type Selection */}
          {showWorkoutTypeSelection && (
            <div>
              <h3 style={{
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black'
              }}>
                Select Workout Type
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {workoutTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setWorkoutType(type.id)
                      setShowWorkoutTypeSelection(false)
                    }}
                    style={{
                      padding: '24px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDark ? 'white' : 'black'
                      e.target.style.color = isDark ? 'black' : 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = isDark ? 'black' : 'white'
                      e.target.style.color = isDark ? 'white' : 'black'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '12px'
                    }}>
                      <type.icon size={32} />
                      <h4 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        {type.name}
                      </h4>
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      opacity: 0.8
                    }}>
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Selection */}
          {!showWorkoutTypeSelection && workoutType && (
            <div>
              {/* Back Button */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => {
                    setShowWorkoutTypeSelection(true)
                    setWorkoutType('')
                    setSelectedExercises([])
                  }}
                  style={{
                    padding: '12px 16px',
                    border: `2px solid ${isDark ? 'white' : 'black'}`,
                    backgroundColor: isDark ? 'black' : 'white',
                    color: isDark ? 'white' : 'black',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ← Back to Workout Types
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
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isDark ? '#a3a3a3' : '#6b7280',
                    width: '20px',
                    height: '20px'
                  }} />
                  <input
                    type="text"
                    placeholder={`Search ${workoutTypes.find(t => t.id === workoutType)?.name.toLowerCase()} exercises...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                </div>
              </div>

              {/* Selected Exercises Summary */}
              {selectedExercises.length > 0 && (
                <div style={{
                  marginBottom: '32px',
                  padding: '24px',
                  backgroundColor: isDark ? '#333333' : '#f0f0f0',
                  border: `1px solid ${isDark ? 'white' : 'black'}`
                }}>
                  <h4 style={{
                    margin: '0 0 16px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black'
                  }}>
                    Selected Exercises ({selectedExercises.length})
                  </h4>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: isDark ? '#a3a3a3' : '#6b7280'
                  }}>
                    <span>📊 {Math.round(calculateTotalDuration())} min</span>
                    <span>🔥 {calculateTotalCalories()} cal</span>
                  </div>
                  
                  {selectedExercises.map((exercise, index) => (
                    <ExerciseCard
                      key={`${exercise.id}-${index}`}
                      exercise={exercise}
                      index={index}
                      workoutType={workoutType}
                      isDark={isDark}
                      onRemove={removeExercise}
                      onUpdateSets={updateExerciseSets}
                      onUpdateDuration={updateExerciseDuration}
                      onUpdateManualCalories={updateExerciseManualCalories}
                    />
                  ))}
                </div>
              )}

              {/* Exercise List */}
              <div style={{
                display: 'grid',
                gap: '12px',
                marginBottom: '32px'
              }}>
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    style={{
                      padding: '20px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: '0 0 8px 0',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: isDark ? 'white' : 'black',
                        fontFamily: 'Georgia, "Times New Roman", Times, serif'
                      }}>
                        {exercise.name}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        color: isDark ? '#a3a3a3' : '#6b7280'
                      }}>
                        {exercise.targetMuscle || exercise.intensity} • {exercise.equipment}
                      </p>
                    </div>
                    <button
                      onClick={() => addExercise(exercise)}
                      style={{
                        padding: '12px',
                        border: `2px solid ${isDark ? 'white' : 'black'}`,
                        backgroundColor: isDark ? 'black' : 'white',
                        color: isDark ? 'white' : 'black',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = isDark ? 'white' : 'black'
                        e.target.style.color = isDark ? 'black' : 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = isDark ? 'black' : 'white'
                        e.target.style.color = isDark ? 'white' : 'black'
                      }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Save Workout */}
              {selectedExercises.length > 0 && (
                <div style={{
                  padding: '24px',
                  backgroundColor: isDark ? 'black' : 'white',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  marginTop: '32px'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: isDark ? 'white' : 'black'
                    }}>
                      Workout Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      placeholder={`${workoutTypes.find(t => t.id === workoutType)?.name} Workout`}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${isDark ? 'white' : 'black'}`,
                        backgroundColor: isDark ? 'black' : 'white',
                        color: isDark ? 'white' : 'black',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: isDark ? 'white' : 'black'
                    }}>
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="How did the workout feel? Any observations?"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `1px solid ${isDark ? 'white' : 'black'}`,
                        backgroundColor: isDark ? 'black' : 'white',
                        color: isDark ? 'white' : 'black',
                        fontSize: '16px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSaveWorkout}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'white' : 'black',
                      color: isDark ? 'black' : 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Save Workout ({calculateTotalCalories()} cal, {Math.round(calculateTotalDuration())} min)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Exercise Card Component for detailed tracking
function ExerciseCard({ 
  exercise, 
  index, 
  workoutType, 
  isDark, 
  onRemove, 
  onUpdateSets, 
  onUpdateDuration,
  onUpdateManualCalories 
}) {
  const addSet = () => {
    const newSets = [...exercise.sets, { reps: 10, weight: 0, restTime: 60 }]
    onUpdateSets(index, newSets)
  }

  const removeSet = (setIndex) => {
    const newSets = exercise.sets.filter((_, i) => i !== setIndex)
    onUpdateSets(index, newSets)
  }

  const updateSet = (setIndex, field, value) => {
    const newSets = exercise.sets.map((set, i) => 
      i === setIndex ? { ...set, [field]: parseInt(value) || 0 } : set
    )
    onUpdateSets(index, newSets)
  }

  return (
    <div style={{
      padding: '16px',
      border: `1px solid ${isDark ? 'white' : 'black'}`,
      backgroundColor: isDark ? 'black' : 'white',
      marginBottom: '12px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black'
        }}>
          {exercise.name}
        </h4>
        <button
          onClick={() => onRemove(index)}
          style={{
            padding: '4px',
            border: `1px solid ${isDark ? 'white' : 'black'}`,
            backgroundColor: 'transparent',
            color: isDark ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {workoutType === 'strength' ? (
        <div>
          {/* Sets tracking for strength exercises */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black'
              }}>
                Sets ({exercise.sets.length})
              </span>
              <button
                onClick={addSet}
                style={{
                  padding: '4px 8px',
                  border: `1px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: 'transparent',
                  color: isDark ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                + Add Set
              </button>
            </div>
            
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: '8px',
                alignItems: 'center',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                <div>
                  <label style={{ color: isDark ? '#a3a3a3' : '#6b7280', fontSize: '12px' }}>Reps</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(setIndex, 'reps', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px',
                      border: `1px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: isDark ? '#a3a3a3' : '#6b7280', fontSize: '12px' }}>Weight</label>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(setIndex, 'weight', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px',
                      border: `1px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: isDark ? '#a3a3a3' : '#6b7280', fontSize: '12px' }}>Rest (s)</label>
                  <input
                    type="number"
                    value={set.restTime}
                    onChange={(e) => updateSet(setIndex, 'restTime', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px',
                      border: `1px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <button
                  onClick={() => removeSet(setIndex)}
                  style={{
                    padding: '4px',
                    border: `1px solid ${isDark ? 'white' : 'black'}`,
                    backgroundColor: 'transparent',
                    color: isDark ? 'white' : 'black',
                    cursor: 'pointer'
                  }}
                >
                  <Minus size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Duration tracking for cardio/other exercises */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black'
            }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={exercise.duration}
              onChange={(e) => onUpdateDuration(index, parseInt(e.target.value) || 0)}
              style={{
                width: '100px',
                padding: '8px',
                border: `1px solid ${isDark ? 'white' : 'black'}`,
                backgroundColor: isDark ? 'black' : 'white',
                color: isDark ? 'white' : 'black',
                fontSize: '16px'
              }}
            />
            <span style={{
              marginLeft: '12px',
              fontSize: '14px',
              color: isDark ? '#a3a3a3' : '#6b7280'
            }}>
              ≈ {exercise.manualCalories !== undefined ? exercise.manualCalories : Math.round((exercise.caloriesPerMinute || 0) * exercise.duration)} calories
            </span>
          </div>

          {/* Manual calorie override */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black'
            }}>
              Override Calories (optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="number"
                placeholder="From Apple Watch, etc."
                value={exercise.manualCalories || ''}
                onChange={(e) => onUpdateManualCalories(index, parseInt(e.target.value) || undefined)}
                style={{
                  width: '150px',
                  padding: '8px',
                  border: `1px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: isDark ? 'black' : 'white',
                  color: isDark ? 'white' : 'black',
                  fontSize: '14px'
                }}
              />
              {exercise.manualCalories !== undefined && (
                <button
                  onClick={() => onUpdateManualCalories(index, undefined)}
                  style={{
                    padding: '4px 8px',
                    border: `1px solid ${isDark ? 'white' : 'black'}`,
                    backgroundColor: 'transparent',
                    color: isDark ? 'white' : 'black',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutLogging
