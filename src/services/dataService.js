import { supabase } from '../lib/supabase'

// Helper function to check if user is guest
const isGuestUser = (user) => user && user.isGuest

// Guest mode local storage helpers
const getGuestData = () => {
  const data = localStorage.getItem('fitness-guest-data')
  return data ? JSON.parse(data) : {
    profile: null,
    meals: [],
    workouts: [],
    waterLogs: []
  }
}

const saveGuestData = (data) => {
  localStorage.setItem('fitness-guest-data', JSON.stringify(data))
}

// Profile operations
export const saveUserProfile = async (profileData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    guestData.profile = { ...profileData, id: 'guest', email: 'guest@example.com' }
    saveGuestData(guestData)
    return guestData.profile
  }

  // Map form fields to database columns
  const dbData = {
    id: user.id,
    email: user.email || user.user_metadata?.email,
    age: profileData.age,
    weight: profileData.weight,
    height: profileData.height,
    sex: profileData.gender, // form uses 'gender', db uses 'sex'
    activity_level: profileData.activityLevel, // form uses 'activityLevel', db uses 'activity_level'
    goal: profileData.goal || 'weight_loss', // provide default
    bmr: profileData.bmr,
    tdee: profileData.tdee,
    daily_calories: profileData.recommendedCalories,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(dbData)
    .select()

  if (error) throw error
  return data[0]
}

export const getUserProfile = async () => {
  console.log('getUserProfile called')
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('No authenticated user found')
    throw new Error('No authenticated user')
  }

  console.log('User found:', user.email, 'ID:', user.id, 'isGuest check:', isGuestUser(user))

  // Handle guest mode
  if (isGuestUser(user)) {
    console.log('Guest user detected, loading from localStorage')
    const guestData = getGuestData()
    console.log('Guest profile:', guestData.profile)
    return guestData.profile
  }

  console.log('Regular user, querying database for profile...')
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.log('Database query error:', error.code, error.message)
    if (error.code !== 'PGRST116') throw error // PGRST116 = not found
  }

  console.log('Profile query result:', data)
  return data
}

// Meal operations
export const saveMeal = async (mealData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    const newMeal = {
      id: Date.now().toString(), // Simple ID for guest mode
      user_id: 'guest',
      ...mealData
    }
    guestData.meals.push(newMeal)
    saveGuestData(guestData)
    return newMeal
  }

  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: user.id,
      ...mealData
    })
    .select()

  if (error) throw error
  return data[0]
}

export const getUserMeals = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    return guestData.meals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}

export const deleteMeal = async (mealId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    guestData.meals = guestData.meals.filter(meal => meal.id !== mealId)
    saveGuestData(guestData)
    return
  }

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId)

  if (error) throw error
}

// Workout operations
export const saveWorkout = async (workoutData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    const newWorkout = {
      id: Date.now().toString(),
      user_id: 'guest',
      ...workoutData
    }
    guestData.workouts.push(newWorkout)
    saveGuestData(guestData)
    return newWorkout
  }

  const { data, error } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      ...workoutData
    })
    .select()

  if (error) throw error
  return data[0]
}

export const getUserWorkouts = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    return guestData.workouts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}

// Water log operations
export const saveWaterLog = async (waterData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    const newWaterLog = {
      id: Date.now().toString(),
      user_id: 'guest',
      ...waterData
    }
    guestData.waterLogs.push(newWaterLog)
    saveGuestData(guestData)
    return newWaterLog
  }

  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: user.id,
      ...waterData
    })
    .select()

  if (error) throw error
  return data[0]
}

export const getUserWaterLogs = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  // Handle guest mode
  if (isGuestUser(user)) {
    const guestData = getGuestData()
    return guestData.waterLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}