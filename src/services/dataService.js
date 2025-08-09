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
    full_name: user.user_metadata?.full_name || user.email,
    age: profileData.age,
    weight: profileData.weight, // use weight column from your schema
    height: profileData.height,
    sex: profileData.gender, // form uses 'gender', db uses 'sex'
    activity_level: profileData.activityLevel, // form uses 'activityLevel', db uses 'activity_level'
    goal: profileData.goal || 'weight_loss', // provide default
    target_weight: profileData.weight, // set target same as current for now
    bmr: profileData.bmr,
    tdee: profileData.tdee,
    daily_calories: profileData.recommendedCalories,
    daily_deficit: profileData.dailyDeficit || 500,
    workout_split: profileData.workoutSplit || 50,
    protein: 0, // these columns already exist in your schema
    carbs: 0,
    fat: 0,
    updated_at: new Date().toISOString()
  }

  console.log('🗃️ DataService: Saving profile data to database:', dbData)

  const { data, error } = await supabase
    .from('profiles')
    .upsert(dbData)
    .select()

  console.log('🗃️ DataService: Database response:', { data, error })

  if (error) {
    console.error('❌ Database save error:', error)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error details:', error.details)
    throw error
  }
  
  console.log('✅ Profile saved successfully:', data[0])
  return data[0]
}

export const getUserProfile = async () => {
  console.log('🔍 getUserProfile called')
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('❌ No authenticated user found')
    throw new Error('No authenticated user')
  }

  console.log('👤 User found:', user.email, 'ID:', user.id)

  // Handle guest mode
  if (isGuestUser(user)) {
    console.log('👤 Guest user detected, loading from localStorage')
    const guestData = getGuestData()
    console.log('📋 Guest profile:', guestData.profile)
    return guestData.profile
  }

  console.log('🗃️ Regular user, querying database for profile...')
  console.log('🔍 Querying profiles table with user ID:', user.id)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)

  if (error) {
    console.log('❌ Database query error:', error.code, error.message)
    console.log('❌ Full error object:', error)
    throw error
  }

  // Handle multiple profiles - take the most recent one
  let profileData = null
  if (data && data.length > 0) {
    console.log(`📊 Found ${data.length} profile(s) for user`)
    if (data.length > 1) {
      console.log('⚠️ Multiple profiles found, using most recent one')
      // Sort by created_at if available, otherwise use the first one
      profileData = data.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at)
        }
        return 0
      })[0]
      console.log('🔄 Selected profile:', profileData.id)
    } else {
      profileData = data[0]
      console.log('✅ Single profile found')
    }
  } else {
    console.log('📭 No profiles found for user')
  }

  console.log('📊 Profile query result:', profileData)
  console.log('✅ Profile found?', !!profileData)
  
  if (profileData) {
    console.log('📋 Profile details:', {
      id: profileData.id,
      email: profileData.email,
      age: profileData.age,
      sex: profileData.sex,
      weight: profileData.weight,
      height: profileData.height,
      activity_level: profileData.activity_level,
      bmr: profileData.bmr,
      tdee: profileData.tdee,
      daily_calories: profileData.daily_calories
    })
  }
  
  return profileData
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

  if (error) {
    throw error
  }
  
  const meals = data || []
  
  // Check for potential duplicates
  const mealGroups = {}
  meals.forEach(meal => {
    const key = `${meal.food}-${meal.timestamp}`
    if (!mealGroups[key]) {
      mealGroups[key] = []
    }
    mealGroups[key].push(meal)
  })
  
  const duplicates = Object.entries(mealGroups).filter(([key, meals]) => meals.length > 1)
  if (duplicates.length > 0) {
    console.warn('⚠️ Found potential duplicate meals:')
    duplicates.forEach(([key, duplicateMeals]) => {
      console.warn(`🔄 "${key}": ${duplicateMeals.length} copies`, duplicateMeals.map(m => ({ id: m.id, food: m.food, timestamp: m.timestamp })))
    })
  }
  
  return meals
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
    .eq('user_id', user.id) // Extra safety: only delete user's own meals
  
  if (error) {
    throw error
  }
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