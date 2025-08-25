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
  preSelectedDate = new Date(),
  userProfile = null
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

  // Comprehensive exercise database with user preferences
  const [userExercisePreferences, setUserExercisePreferences] = useState(() => {
    const saved = localStorage.getItem('fitness-exercise-preferences')
    return saved ? JSON.parse(saved) : {}
  })

  const exerciseDatabase = {
    strength: [
      // Upper Body - Chest
      { id: 1001, name: "Push-ups", category: "Upper Body", targetMuscle: "Chest, Triceps", equipment: "Bodyweight", caloriesPerRep: 0.5, isPinned: false },
      { id: 1002, name: "Bench Press", category: "Upper Body", targetMuscle: "Chest", equipment: "Barbell", caloriesPerRep: 0.8, isPinned: false },
      { id: 1003, name: "Dumbbell Bench Press", category: "Upper Body", targetMuscle: "Chest", equipment: "Dumbbells", caloriesPerRep: 0.7, isPinned: false },
      { id: 1004, name: "Incline Bench Press", category: "Upper Body", targetMuscle: "Upper Chest", equipment: "Barbell", caloriesPerRep: 0.8, isPinned: false },
      { id: 1005, name: "Decline Bench Press", category: "Upper Body", targetMuscle: "Lower Chest", equipment: "Barbell", caloriesPerRep: 0.8, isPinned: false },
      { id: 1006, name: "Chest Flyes", category: "Upper Body", targetMuscle: "Chest", equipment: "Dumbbells", caloriesPerRep: 0.4, isPinned: false },
      { id: 1007, name: "Cable Flyes", category: "Upper Body", targetMuscle: "Chest", equipment: "Cable Machine", caloriesPerRep: 0.4, isPinned: false },
      { id: 1008, name: "Dips", category: "Upper Body", targetMuscle: "Chest, Triceps", equipment: "Parallel Bars", caloriesPerRep: 0.6, isPinned: false },
      
      // Upper Body - Back
      { id: 1010, name: "Pull-ups", category: "Upper Body", targetMuscle: "Back, Biceps", equipment: "Pull-up Bar", caloriesPerRep: 0.7, isPinned: false },
      { id: 1011, name: "Chin-ups", category: "Upper Body", targetMuscle: "Back, Biceps", equipment: "Pull-up Bar", caloriesPerRep: 0.7, isPinned: false },
      { id: 1012, name: "Lat Pulldowns", category: "Upper Body", targetMuscle: "Back", equipment: "Cable Machine", caloriesPerRep: 0.6, isPinned: false },
      { id: 1013, name: "Barbell Rows", category: "Upper Body", targetMuscle: "Back", equipment: "Barbell", caloriesPerRep: 0.7, isPinned: false },
      { id: 1014, name: "Dumbbell Rows", category: "Upper Body", targetMuscle: "Back", equipment: "Dumbbells", caloriesPerRep: 0.6, isPinned: false },
      { id: 1015, name: "T-Bar Rows", category: "Upper Body", targetMuscle: "Back", equipment: "T-Bar Machine", caloriesPerRep: 0.7, isPinned: false },
      { id: 1016, name: "Face Pulls", category: "Upper Body", targetMuscle: "Rear Delts", equipment: "Cable Machine", caloriesPerRep: 0.3, isPinned: false },
      
      // Upper Body - Shoulders
      { id: 1020, name: "Overhead Press", category: "Upper Body", targetMuscle: "Shoulders", equipment: "Barbell", caloriesPerRep: 0.7, isPinned: false },
      { id: 1021, name: "Dumbbell Shoulder Press", category: "Upper Body", targetMuscle: "Shoulders", equipment: "Dumbbells", caloriesPerRep: 0.6, isPinned: false },
      { id: 1022, name: "Lateral Raises", category: "Upper Body", targetMuscle: "Shoulders", equipment: "Dumbbells", caloriesPerRep: 0.4, isPinned: false },
      { id: 1023, name: "Front Raises", category: "Upper Body", targetMuscle: "Shoulders", equipment: "Dumbbells", caloriesPerRep: 0.4, isPinned: false },
      { id: 1024, name: "Rear Delt Flyes", category: "Upper Body", targetMuscle: "Rear Delts", equipment: "Dumbbells", caloriesPerRep: 0.3, isPinned: false },
      { id: 1025, name: "Arnold Press", category: "Upper Body", targetMuscle: "Shoulders", equipment: "Dumbbells", caloriesPerRep: 0.6, isPinned: false },
      
      // Upper Body - Arms
      { id: 1030, name: "Bicep Curls", category: "Upper Body", targetMuscle: "Biceps", equipment: "Dumbbells", caloriesPerRep: 0.4, isPinned: false },
      { id: 1031, name: "Barbell Curls", category: "Upper Body", targetMuscle: "Biceps", equipment: "Barbell", caloriesPerRep: 0.5, isPinned: false },
      { id: 1032, name: "Hammer Curls", category: "Upper Body", targetMuscle: "Biceps, Forearms", equipment: "Dumbbells", caloriesPerRep: 0.4, isPinned: false },
      { id: 1033, name: "Preacher Curls", category: "Upper Body", targetMuscle: "Biceps", equipment: "Barbell", caloriesPerRep: 0.4, isPinned: false },
      { id: 1034, name: "Tricep Dips", category: "Upper Body", targetMuscle: "Triceps", equipment: "Bench", caloriesPerRep: 0.5, isPinned: false },
      { id: 1035, name: "Tricep Pushdowns", category: "Upper Body", targetMuscle: "Triceps", equipment: "Cable Machine", caloriesPerRep: 0.4, isPinned: false },
      { id: 1036, name: "Skull Crushers", category: "Upper Body", targetMuscle: "Triceps", equipment: "Barbell", caloriesPerRep: 0.4, isPinned: false },
      { id: 1037, name: "Overhead Tricep Extensions", category: "Upper Body", targetMuscle: "Triceps", equipment: "Dumbbells", caloriesPerRep: 0.4, isPinned: false },
      
      // Lower Body - Quads
      { id: 1040, name: "Squats", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Barbell", caloriesPerRep: 0.8, isPinned: false },
      { id: 1041, name: "Front Squats", category: "Lower Body", targetMuscle: "Quads", equipment: "Barbell", caloriesPerRep: 0.8, isPinned: false },
      { id: 1042, name: "Goblet Squats", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Dumbbell", caloriesPerRep: 0.6, isPinned: false },
      { id: 1043, name: "Leg Press", category: "Lower Body", targetMuscle: "Quads", equipment: "Machine", caloriesPerRep: 0.7, isPinned: false },
      { id: 1044, name: "Leg Extensions", category: "Lower Body", targetMuscle: "Quads", equipment: "Machine", caloriesPerRep: 0.4, isPinned: false },
      { id: 1045, name: "Lunges", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Bodyweight", caloriesPerRep: 0.5, isPinned: false },
      { id: 1046, name: "Walking Lunges", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Dumbbells", caloriesPerRep: 0.6, isPinned: false },
      { id: 1047, name: "Bulgarian Split Squats", category: "Lower Body", targetMuscle: "Quads, Glutes", equipment: "Dumbbells", caloriesPerRep: 0.6, isPinned: false },
      
      // Lower Body - Hamstrings & Glutes
      { id: 1050, name: "Deadlifts", category: "Lower Body", targetMuscle: "Hamstrings, Glutes", equipment: "Barbell", caloriesPerRep: 1.0, isPinned: false },
      { id: 1051, name: "Romanian Deadlifts", category: "Lower Body", targetMuscle: "Hamstrings", equipment: "Barbell", caloriesPerRep: 0.8, isPinned: false },
      { id: 1052, name: "Leg Curls", category: "Lower Body", targetMuscle: "Hamstrings", equipment: "Machine", caloriesPerRep: 0.4, isPinned: false },
      { id: 1053, name: "Glute Bridges", category: "Lower Body", targetMuscle: "Glutes", equipment: "Bodyweight", caloriesPerRep: 0.4, isPinned: false },
      { id: 1054, name: "Hip Thrusts", category: "Lower Body", targetMuscle: "Glutes", equipment: "Barbell", caloriesPerRep: 0.6, isPinned: false },
      { id: 1055, name: "Good Mornings", category: "Lower Body", targetMuscle: "Hamstrings", equipment: "Barbell", caloriesPerRep: 0.6, isPinned: false },
      
      // Lower Body - Calves
      { id: 1060, name: "Standing Calf Raises", category: "Lower Body", targetMuscle: "Calves", equipment: "Machine", caloriesPerRep: 0.3, isPinned: false },
      { id: 1061, name: "Seated Calf Raises", category: "Lower Body", targetMuscle: "Calves", equipment: "Machine", caloriesPerRep: 0.3, isPinned: false },
      { id: 1062, name: "Donkey Calf Raises", category: "Lower Body", targetMuscle: "Calves", equipment: "Bodyweight", caloriesPerRep: 0.3, isPinned: false },
      
      // Core
      { id: 1070, name: "Plank", category: "Core", targetMuscle: "Core", equipment: "Bodyweight", caloriesPerSecond: 0.1, isPinned: false },
      { id: 1071, name: "Side Plank", category: "Core", targetMuscle: "Obliques", equipment: "Bodyweight", caloriesPerSecond: 0.1, isPinned: false },
      { id: 1072, name: "Crunches", category: "Core", targetMuscle: "Abs", equipment: "Bodyweight", caloriesPerRep: 0.2, isPinned: false },
      { id: 1073, name: "Russian Twists", category: "Core", targetMuscle: "Obliques", equipment: "Bodyweight", caloriesPerRep: 0.3, isPinned: false },
      { id: 1074, name: "Mountain Climbers", category: "Core", targetMuscle: "Core, Cardio", equipment: "Bodyweight", caloriesPerRep: 0.4, isPinned: false },
      { id: 1075, name: "Dead Bug", category: "Core", targetMuscle: "Core", equipment: "Bodyweight", caloriesPerRep: 0.2, isPinned: false },
      { id: 1076, name: "Hanging Leg Raises", category: "Core", targetMuscle: "Abs", equipment: "Pull-up Bar", caloriesPerRep: 0.5, isPinned: false },
      { id: 1077, name: "Cable Woodchoppers", category: "Core", targetMuscle: "Obliques", equipment: "Cable Machine", caloriesPerRep: 0.4, isPinned: false },
      { id: 1078, name: "Ab Wheel Rollouts", category: "Core", targetMuscle: "Core", equipment: "Ab Wheel", caloriesPerRep: 0.6, isPinned: false }
    ],
    
    cardio: [
      { id: 2001, name: "Treadmill Running", category: "Cardio", intensity: "Moderate", equipment: "Treadmill", caloriesPerMinute: 10, isPinned: false },
      { id: 2002, name: "Cycling", category: "Cardio", intensity: "Moderate", equipment: "Bike", caloriesPerMinute: 8, isPinned: false },
      { id: 2003, name: "Elliptical", category: "Cardio", intensity: "Moderate", equipment: "Elliptical", caloriesPerMinute: 9, isPinned: false },
      { id: 2004, name: "Rowing Machine", category: "Cardio", intensity: "High", equipment: "Rowing Machine", caloriesPerMinute: 12, isPinned: false },
      { id: 2005, name: "Jump Rope", category: "Cardio", intensity: "High", equipment: "Jump Rope", caloriesPerMinute: 11, isPinned: false },
      { id: 2006, name: "Stair Climber", category: "Cardio", intensity: "High", equipment: "Stair Climber", caloriesPerMinute: 10, isPinned: false },
      { id: 2007, name: "Swimming", category: "Cardio", intensity: "Moderate", equipment: "Pool", caloriesPerMinute: 11, isPinned: false },
      { id: 2008, name: "Walking", category: "Cardio", intensity: "Light", equipment: "None", caloriesPerMinute: 4, isPinned: false },
      { id: 2009, name: "Jogging", category: "Cardio", intensity: "Moderate", equipment: "None", caloriesPerMinute: 8, isPinned: false },
      { id: 2010, name: "Sprint Intervals", category: "Cardio", intensity: "High", equipment: "None", caloriesPerMinute: 15, isPinned: false },
      { id: 2011, name: "Stationary Bike", category: "Cardio", intensity: "Moderate", equipment: "Stationary Bike", caloriesPerMinute: 8, isPinned: false },
      { id: 2012, name: "Spinning", category: "Cardio", intensity: "High", equipment: "Spinning Bike", caloriesPerMinute: 12, isPinned: false }
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

  // Smart exercise sorting based on user preferences and frequency
  const getCurrentExercises = () => {
    const exercises = exerciseDatabase[workoutType] || []
    
    // Merge with user preferences
    const exercisesWithPreferences = exercises.map(exercise => ({
      ...exercise,
      isPinned: userExercisePreferences[exercise.id]?.isPinned || false,
      frequency: userExercisePreferences[exercise.id]?.frequency || 0,
      lastUsed: userExercisePreferences[exercise.id]?.lastUsed || null
    }))
    
    // Sort by: pinned first, then by frequency, then alphabetically
    return exercisesWithPreferences.sort((a, b) => {
      // Pinned exercises first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then by frequency (most used first)
      if (a.frequency !== b.frequency) return b.frequency - a.frequency
      
      // Finally alphabetically
      return a.name.localeCompare(b.name)
    })
  }

  const filteredExercises = getCurrentExercises().filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.targetMuscle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Update user preferences when exercise is used
  const updateExercisePreference = (exerciseId, isPinned = null) => {
    const currentPrefs = userExercisePreferences[exerciseId] || { frequency: 0, isPinned: false }
    
    const updatedPrefs = {
      ...currentPrefs,
      frequency: currentPrefs.frequency + 1,
      lastUsed: new Date().toISOString(),
      ...(isPinned !== null && { isPinned })
    }
    
    const newPreferences = {
      ...userExercisePreferences,
      [exerciseId]: updatedPrefs
    }
    
    setUserExercisePreferences(newPreferences)
    localStorage.setItem('fitness-exercise-preferences', JSON.stringify(newPreferences))
  }

  // Toggle pin status
  const togglePinExercise = (exerciseId) => {
    const currentPrefs = userExercisePreferences[exerciseId] || { frequency: 0, isPinned: false }
    updateExercisePreference(exerciseId, !currentPrefs.isPinned)
  }

  const addExercise = (exercise) => {
    // Update exercise preference when added
    updateExercisePreference(exercise.id)
    
    // Calculate estimated calories based on user's biometrics
    const estimatedCalories = calculateEstimatedCalories(exercise)
    
    const newExercise = {
      ...exercise,
      sets: workoutType === 'strength' ? [{ reps: 10, weight: 0, restTime: 60 }] : [],
      duration: workoutType !== 'strength' ? 10 : 0, // minutes for cardio/other
      totalCalories: estimatedCalories,
      estimatedCalories: estimatedCalories
    }
    setSelectedExercises(prev => [...prev, newExercise])
  }

  // Calculate estimated calories based on user's biometrics
  const calculateEstimatedCalories = (exercise) => {
    if (!userProfile) {
      // Fallback calculation without biometrics
      if (exercise.caloriesPerRep) {
        return Math.round(exercise.caloriesPerRep * 10) // Default 10 reps
      } else if (exercise.caloriesPerMinute) {
        return Math.round(exercise.caloriesPerMinute * 10) // Default 10 minutes
      }
      return 0
    }
    
    // Calculate based on user's weight, age, and activity level
    const weight = userProfile.weight || 70 // kg
    const age = userProfile.age || 25
    const isMale = userProfile.gender === 'male'
    
    // Base metabolic rate adjustment
    const bmrMultiplier = isMale ? 1.2 : 1.1
    
    // Age adjustment (metabolism slows with age)
    const ageMultiplier = Math.max(0.8, 1 - (age - 25) * 0.01)
    
    // Activity level multiplier
    const activityMultiplier = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    }[userProfile.activityLevel || 'moderate'] || 1.55
    
    const totalMultiplier = bmrMultiplier * ageMultiplier * activityMultiplier
    
    // Calculate calories based on exercise type
    if (exercise.caloriesPerRep) {
      // Strength training: calories per rep adjusted by user factors
      const baseCaloriesPerRep = exercise.caloriesPerRep
      const adjustedCaloriesPerRep = baseCaloriesPerRep * (weight / 70) * totalMultiplier
      return Math.round(adjustedCaloriesPerRep * 10) // Default 10 reps
    } else if (exercise.caloriesPerMinute) {
      // Cardio: calories per minute adjusted by user factors
      const baseCaloriesPerMinute = exercise.caloriesPerMinute
      const adjustedCaloriesPerMinute = baseCaloriesPerMinute * (weight / 70) * totalMultiplier
      return Math.round(adjustedCaloriesPerMinute * 10) // Default 10 minutes
    }
    
    return 0
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
                    <span>{Math.round(calculateTotalDuration())} min</span>
                    <span>{calculateTotalCalories()} cal</span>
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
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    {/* Pin indicator */}
                    {exercise.isPinned && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#f59e0b',
                        borderRadius: '50%'
                      }} />
                    )}
                    
                    <div style={{ flex: 1, marginLeft: exercise.isPinned ? '16px' : '0' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: isDark ? 'white' : 'black',
                          fontFamily: 'Georgia, "Times New Roman", Times, serif'
                        }}>
                          {exercise.name}
                        </h4>
                        {exercise.frequency > 0 && (
                          <span style={{
                            fontSize: '12px',
                            color: isDark ? '#a3a3a3' : '#6b7280',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}>
                            ({exercise.frequency}x)
                          </span>
                        )}
                      </div>
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
                    
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      {/* Pin/Unpin button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePinExercise(exercise.id)
                        }}
                        style={{
                          padding: '8px',
                          border: `1px solid ${isDark ? 'white' : 'black'}`,
                          backgroundColor: 'transparent',
                          color: exercise.isPinned ? '#f59e0b' : (isDark ? '#a3a3a3' : '#6b7280'),
                          cursor: 'pointer',
                          borderRadius: '0px'
                        }}
                        title={exercise.isPinned ? 'Unpin exercise' : 'Pin exercise'}
                      >
                        <Target size={16} />
                      </button>
                      
                      {/* Add exercise button */}
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
