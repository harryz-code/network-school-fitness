import { supabase } from '../lib/supabase'

// Profile operations
export const saveUserProfile = async (profileData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id,
      email: user.email,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()

  if (error) throw error
  return data[0]
}

export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data
}

// Meal operations
export const saveMeal = async (mealData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

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

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}

export const deleteMeal = async (mealId) => {
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

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  if (error) throw error
  return data || []
}