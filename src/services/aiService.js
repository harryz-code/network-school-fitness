// AI Service for nutritionist and health analysis using Hugging Face
// Using free Hugging Face Inference API with open-source models

class AIService {
  constructor() {
    // Using Hugging Face's free inference API
    this.baseURL = 'https://api-inference.huggingface.co/models'
    this.apiToken = process.env.REACT_APP_HUGGING_FACE_TOKEN || null
    // Using free, open-source models for text generation
    this.nutritionModel = 'microsoft/DialoGPT-medium'
    this.analysisModel = 'facebook/blenderbot-400M-distill'
    this.textModel = 'google/flan-t5-base' // Good for structured responses
  }

  // Analyze daily nutrition and provide personalized tips
  async getNutritionAnalysis(dailyData) {
    try {
      const { calories, protein, carbs, fat, fiber, meals, userProfile } = dailyData
      
      // Calculate nutritional ratios and status
      const totalMacros = protein * 4 + carbs * 4 + fat * 9
      const proteinPercent = Math.round((protein * 4 / totalMacros) * 100) || 0
      const carbPercent = Math.round((carbs * 4 / totalMacros) * 100) || 0
      const fatPercent = Math.round((fat * 9 / totalMacros) * 100) || 0
      
      const targetCalories = userProfile?.targetCalories || 2000
      const calorieStatus = calories < targetCalories * 0.8 ? 'low' : 
                           calories > targetCalories * 1.2 ? 'high' : 'good'
      
      // Create a structured prompt for the AI
      const prompt = this.createNutritionPrompt({
        calories,
        targetCalories,
        protein,
        carbs,
        fat,
        fiber,
        proteinPercent,
        carbPercent,
        fatPercent,
        calorieStatus,
        mealsCount: meals.length
      })

      // Try AI analysis first, fallback to rule-based
      try {
        const aiTips = await this.getAINutritionTips(prompt)
        if (aiTips && aiTips.length > 0) {
          const ruleBasedAnalysis = this.getRuleBasedNutritionAnalysis({
            calories,
            targetCalories,
            protein,
            carbs,
            fat,
            fiber,
            proteinPercent,
            carbPercent,
            fatPercent,
            calorieStatus,
            mealsCount: meals.length,
            userProfile
          })
          
          // Combine AI tips with rule-based analysis
          return {
            ...ruleBasedAnalysis,
            tips: aiTips.slice(0, 3), // Use AI tips instead of rule-based tips
            aiPowered: true
          }
        }
      } catch (error) {
        console.log('AI API unavailable, using rule-based analysis:', error.message)
      }

      // Fallback to rule-based analysis
      return this.getRuleBasedNutritionAnalysis({
        calories,
        targetCalories,
        protein,
        carbs,
        fat,
        fiber,
        proteinPercent,
        carbPercent,
        fatPercent,
        calorieStatus,
        mealsCount: meals.length,
        userProfile
      })

    } catch (error) {
      console.error('AI Nutrition Analysis Error:', error)
      return this.getFallbackNutritionTips()
    }
  }

  // Create structured prompt for nutrition analysis
  createNutritionPrompt(data) {
    return `As a nutritionist, analyze this daily intake:
    
Calories: ${data.calories}/${data.targetCalories} (${data.calorieStatus})
Macros: ${data.proteinPercent}% protein, ${data.carbPercent}% carbs, ${data.fatPercent}% fat
Fiber: ${data.fiber}g
Meals logged: ${data.mealsCount}

Provide 3 specific, actionable tips to improve nutrition.`
  }

  // Rule-based analysis (immediate implementation)
  getRuleBasedNutritionAnalysis(data) {
    const tips = []
    const insights = []
    let overallScore = 85 // Base score

    // Calorie Analysis
    if (data.calorieStatus === 'low') {
      tips.push("🔋 Consider adding healthy calorie-dense foods like nuts, avocado, or protein smoothies")
      insights.push(`Calories are ${Math.round(((data.targetCalories - data.calories) / data.targetCalories) * 100)}% below target`)
      overallScore -= 10
    } else if (data.calorieStatus === 'high') {
      tips.push("⚖️ Try portion control and focus on nutrient-dense, lower-calorie foods")
      insights.push(`Calories are ${Math.round(((data.calories - data.targetCalories) / data.targetCalories) * 100)}% above target`)
      overallScore -= 8
    } else {
      insights.push("✅ Great calorie balance!")
      overallScore += 5
    }

    // Protein Analysis
    if (data.proteinPercent < 15) {
      tips.push("💪 Boost protein with lean meats, eggs, Greek yogurt, or protein powder")
      overallScore -= 8
    } else if (data.proteinPercent > 35) {
      tips.push("🥗 Balance protein with more complex carbs and healthy fats")
      overallScore -= 5
    } else {
      insights.push("💪 Excellent protein intake!")
      overallScore += 3
    }

    // Carb Analysis
    if (data.carbPercent < 25) {
      tips.push("🍠 Add complex carbs like quinoa, sweet potatoes, or oats for sustained energy")
      overallScore -= 6
    } else if (data.carbPercent > 65) {
      tips.push("🥑 Consider replacing some carbs with healthy fats and protein")
      overallScore -= 4
    }

    // Fat Analysis
    if (data.fatPercent < 20) {
      tips.push("🥜 Include healthy fats: nuts, olive oil, avocado, or fatty fish")
      overallScore -= 7
    } else if (data.fatPercent > 40) {
      tips.push("🥗 Moderate fat intake and focus on lean proteins and complex carbs")
      overallScore -= 6
    }

    // Fiber Analysis
    const targetFiber = 25 // Standard recommendation
    if (data.fiber < targetFiber * 0.6) {
      tips.push("🥬 Increase fiber with vegetables, fruits, legumes, and whole grains")
      overallScore -= 8
    } else if (data.fiber >= targetFiber) {
      insights.push("🌾 Great fiber intake for digestive health!")
      overallScore += 3
    }

    // Meal Frequency Analysis
    if (data.mealsCount < 2) {
      tips.push("🍽️ Try to eat at least 3 meals for better metabolism and energy")
      overallScore -= 5
    } else if (data.mealsCount >= 4) {
      insights.push("⏰ Great meal frequency for steady energy!")
      overallScore += 2
    }

    // Ensure score is within bounds
    overallScore = Math.max(0, Math.min(100, overallScore))

    return {
      score: overallScore,
      rating: this.getScoreRating(overallScore),
      tips: tips.slice(0, 3), // Limit to 3 most important tips
      insights: insights,
      macroBreakdown: {
        protein: data.proteinPercent,
        carbs: data.carbPercent,
        fat: data.fatPercent
      },
      recommendations: this.getPersonalizedRecommendations(data)
    }
  }

  // Get score rating
  getScoreRating(score) {
    if (score >= 90) return { text: 'Excellent', emoji: '🌟', color: '#10B981' }
    if (score >= 80) return { text: 'Very Good', emoji: '✨', color: '#059669' }
    if (score >= 70) return { text: 'Good', emoji: '👍', color: '#34D399' }
    if (score >= 60) return { text: 'Fair', emoji: '⚡', color: '#FBBF24' }
    if (score >= 50) return { text: 'Needs Work', emoji: '⚠️', color: '#F59E0B' }
    return { text: 'Poor', emoji: '🎯', color: '#EF4444' }
  }

  // Get personalized recommendations
  getPersonalizedRecommendations(data) {
    const recs = []
    
    // Based on user profile goals
    if (data.userProfile?.goal === 'lose_weight') {
      recs.push("Focus on high-protein, high-fiber foods to stay full")
      recs.push("Consider intermittent fasting or smaller, frequent meals")
    } else if (data.userProfile?.goal === 'gain_muscle') {
      recs.push("Aim for 1.6-2.2g protein per kg of body weight")
      recs.push("Include post-workout protein within 30 minutes")
    } else if (data.userProfile?.goal === 'maintain') {
      recs.push("Maintain your current balanced approach")
      recs.push("Focus on nutrient timing around workouts")
    }

    return recs
  }

  // Analyze biometric data
  async getBiometricAnalysis(biometricData) {
    try {
      const { height, weight, bodyFat, age, gender } = biometricData
      
      // Calculate BMI
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      
      return this.getRuleBasedBiometricAnalysis({
        height,
        weight,
        bmi,
        bodyFat,
        age,
        gender
      })

    } catch (error) {
      console.error('AI Biometric Analysis Error:', error)
      return this.getFallbackBiometricAnalysis()
    }
  }

  // Rule-based biometric analysis
  getRuleBasedBiometricAnalysis(data) {
    const { height, weight, bmi, bodyFat, age, gender } = data
    const insights = []
    const recommendations = []
    const healthMetrics = {}
    let healthScore = 85

    // BMI Analysis with detailed categories
    let bmiCategory = ''
    let bmiStatus = ''
    if (bmi < 16) {
      bmiCategory = 'Severely Underweight'
      bmiStatus = 'critical'
      recommendations.push("⚠️ Seek immediate medical consultation for severe underweight")
      healthScore -= 25
    } else if (bmi < 18.5) {
      bmiCategory = 'Underweight'
      bmiStatus = 'poor'
      recommendations.push("🥗 Focus on healthy weight gain with nutrient-dense foods")
      recommendations.push("💪 Add strength training to build lean muscle mass")
      healthScore -= 15
    } else if (bmi < 25) {
      bmiCategory = 'Normal Weight'
      bmiStatus = 'excellent'
      insights.push("✅ BMI is in the optimal healthy range!")
      healthScore += 15
    } else if (bmi < 30) {
      bmiCategory = 'Overweight'
      bmiStatus = 'fair'
      recommendations.push("🎯 Target 1-2 lbs weight loss per week through diet and exercise")
      recommendations.push("🏃‍♀️ Increase cardio to 150+ minutes per week")
      healthScore -= 10
    } else if (bmi < 35) {
      bmiCategory = 'Obesity Class I'
      bmiStatus = 'poor'
      recommendations.push("📋 Consider structured weight loss program")
      recommendations.push("🏥 Regular health checkups recommended")
      healthScore -= 20
    } else if (bmi < 40) {
      bmiCategory = 'Obesity Class II'
      bmiStatus = 'critical'
      recommendations.push("🏥 Medical supervision for weight management strongly advised")
      healthScore -= 30
    } else {
      bmiCategory = 'Obesity Class III'
      bmiStatus = 'critical'
      recommendations.push("🏥 Immediate medical consultation for severe obesity")
      healthScore -= 35
    }

    healthMetrics.bmi = {
      value: Math.round(bmi * 10) / 10,
      category: bmiCategory,
      status: bmiStatus,
      ideal: { min: 18.5, max: 24.9 }
    }

    // Body Fat Analysis with detailed ranges
    if (bodyFat && bodyFat > 0) {
      const bodyFatRanges = gender === 'male' ? {
        essential: { min: 2, max: 5 },
        athletes: { min: 6, max: 13 },
        fitness: { min: 14, max: 17 },
        average: { min: 18, max: 24 },
        obese: { min: 25, max: 100 }
      } : {
        essential: { min: 10, max: 13 },
        athletes: { min: 14, max: 20 },
        fitness: { min: 21, max: 24 },
        average: { min: 25, max: 31 },
        obese: { min: 32, max: 100 }
      }

      let bodyFatCategory = ''
      let bodyFatStatus = ''

      if (bodyFat <= bodyFatRanges.essential.max) {
        bodyFatCategory = 'Essential Fat'
        bodyFatStatus = bodyFat < bodyFatRanges.essential.min ? 'critical' : 'poor'
        if (bodyFat < bodyFatRanges.essential.min) {
          recommendations.push("⚠️ Body fat dangerously low - seek medical advice")
          healthScore -= 20
        } else {
          recommendations.push("⚡ Maintain current body fat with balanced nutrition")
          healthScore += 10
        }
      } else if (bodyFat <= bodyFatRanges.athletes.max) {
        bodyFatCategory = 'Athletic'
        bodyFatStatus = 'excellent'
        insights.push("🏆 Athletic body fat percentage - excellent fitness level!")
        healthScore += 15
      } else if (bodyFat <= bodyFatRanges.fitness.max) {
        bodyFatCategory = 'Fitness'
        bodyFatStatus = 'very good'
        insights.push("💪 Great body fat percentage for fitness!")
        healthScore += 10
      } else if (bodyFat <= bodyFatRanges.average.max) {
        bodyFatCategory = 'Average'
        bodyFatStatus = 'good'
        insights.push("👍 Body fat in acceptable range")
        recommendations.push("🏋️‍♀️ Strength training can help improve body composition")
        healthScore += 5
      } else {
        bodyFatCategory = 'Above Average'
        bodyFatStatus = 'poor'
        recommendations.push("🔥 Focus on fat loss through cardio and strength training")
        recommendations.push("🍽️ Create moderate caloric deficit through diet")
        healthScore -= 15
      }

      healthMetrics.bodyFat = {
        value: bodyFat,
        category: bodyFatCategory,
        status: bodyFatStatus,
        ranges: bodyFatRanges
      }
    }

    // Age-specific analysis and recommendations
    let ageCategory = ''
    if (age < 25) {
      ageCategory = 'Young Adult'
      recommendations.push("🏃‍♀️ Build strong fitness habits early for lifelong health")
      recommendations.push("🦴 Focus on bone density through weight-bearing exercises")
    } else if (age < 35) {
      ageCategory = 'Adult'
      recommendations.push("⚖️ Maintain metabolic health with regular exercise")
      recommendations.push("💪 Prioritize strength training to preserve muscle mass")
    } else if (age < 50) {
      ageCategory = 'Middle-aged'
      recommendations.push("🧘‍♀️ Include flexibility and mobility work in routine")
      recommendations.push("❤️ Monitor cardiovascular health regularly")
      if (gender === 'female') {
        recommendations.push("🦴 Increase calcium and vitamin D for bone health")
      }
    } else if (age < 65) {
      ageCategory = 'Mature Adult'
      recommendations.push("🦴 Focus on bone health and fall prevention exercises")
      recommendations.push("🧠 Include balance and coordination training")
      recommendations.push("🏥 Regular health screenings become more important")
    } else {
      ageCategory = 'Senior'
      recommendations.push("🚶‍♀️ Maintain mobility with gentle, regular movement")
      recommendations.push("💊 Work closely with healthcare providers")
      recommendations.push("🤝 Consider group fitness for social connection")
    }

    // Calculate ideal weight range
    const heightInMeters = height / 100
    const idealWeightMin = 18.5 * heightInMeters * heightInMeters
    const idealWeightMax = 24.9 * heightInMeters * heightInMeters
    
    healthMetrics.weight = {
      current: weight,
      ideal: {
        min: Math.round(idealWeightMin),
        max: Math.round(idealWeightMax)
      },
      status: weight < idealWeightMin ? 'low' : weight > idealWeightMax ? 'high' : 'optimal'
    }

    // Calculate metabolic age approximation
    let metabolicAge = age
    if (bodyFat) {
      const avgBodyFat = gender === 'male' ? 18 : 25
      const bodyFatDiff = bodyFat - avgBodyFat
      metabolicAge += Math.round(bodyFatDiff * 0.5) // Rough approximation
    }
    if (bmi > 25) {
      metabolicAge += Math.round((bmi - 25) * 0.8)
    } else if (bmi < 18.5) {
      metabolicAge += Math.round((18.5 - bmi) * 1.2)
    }

    healthMetrics.metabolicAge = {
      estimated: Math.max(age - 10, Math.min(age + 15, metabolicAge)),
      chronological: age,
      status: metabolicAge < age ? 'younger' : metabolicAge > age + 2 ? 'older' : 'matched'
    }

    healthScore = Math.max(0, Math.min(100, healthScore))

    return {
      score: healthScore,
      rating: this.getScoreRating(healthScore),
      insights,
      recommendations: recommendations.slice(0, 4), // More recommendations for comprehensive analysis
      healthMetrics,
      ageCategory,
      riskFactors: this.assessRiskFactors({ bmi, bodyFat, age, gender }),
      goals: this.generateHealthGoals({ bmi, bodyFat, age, gender, healthScore })
    }
  }

  // Assess health risk factors
  assessRiskFactors({ bmi, bodyFat, age, gender }) {
    const risks = []
    
    if (bmi >= 30) {
      risks.push({ 
        factor: 'Obesity', 
        level: 'High', 
        description: 'Increased risk of diabetes, heart disease, and other conditions' 
      })
    } else if (bmi >= 25) {
      risks.push({ 
        factor: 'Overweight', 
        level: 'Moderate', 
        description: 'Elevated risk of metabolic disorders' 
      })
    }

    if (age >= 45) {
      risks.push({ 
        factor: 'Age', 
        level: age >= 65 ? 'High' : 'Moderate', 
        description: 'Age-related health risks increase' 
      })
    }

    if (bodyFat) {
      const highBodyFat = gender === 'male' ? 25 : 32
      if (bodyFat >= highBodyFat) {
        risks.push({ 
          factor: 'High Body Fat', 
          level: 'Moderate', 
          description: 'May impact metabolic health and mobility' 
        })
      }
    }

    return risks
  }

  // Generate personalized health goals
  generateHealthGoals({ bmi, bodyFat, age, gender, healthScore }) {
    const goals = []

    if (bmi > 25) {
      const targetWeight = Math.round(24.9 * Math.pow(170/100, 2)) // Example for average height
      goals.push({
        type: 'Weight Management',
        target: `Reach healthy BMI range (18.5-24.9)`,
        timeline: '3-6 months',
        priority: 'High'
      })
    }

    if (bodyFat && ((gender === 'male' && bodyFat > 20) || (gender === 'female' && bodyFat > 25))) {
      goals.push({
        type: 'Body Composition',
        target: `Reduce body fat to fitness range`,
        timeline: '4-8 months',
        priority: 'Medium'
      })
    }

    if (age > 35) {
      goals.push({
        type: 'Strength Maintenance',
        target: 'Preserve muscle mass through resistance training',
        timeline: 'Ongoing',
        priority: 'High'
      })
    }

    if (healthScore < 70) {
      goals.push({
        type: 'Overall Health',
        target: 'Improve health score to 80+',
        timeline: '2-4 months',
        priority: 'High'
      })
    }

    return goals.slice(0, 3) // Limit to top 3 goals
  }

  // Fallback nutrition tips
  getFallbackNutritionTips() {
    return {
      score: 75,
      rating: { text: 'Good', emoji: '👍', color: '#34D399' },
      tips: [
        "🥗 Aim for a variety of colorful fruits and vegetables",
        "💧 Stay hydrated with at least 8 glasses of water daily",
        "🍽️ Practice portion control and mindful eating"
      ],
      insights: ["Keep tracking your meals for personalized insights!"],
      macroBreakdown: { protein: 20, carbs: 50, fat: 30 }
    }
  }

  // Fallback biometric analysis
  getFallbackBiometricAnalysis() {
    return {
      score: 75,
      rating: { text: 'Good', emoji: '👍', color: '#34D399' },
      insights: ["Regular monitoring helps track progress!"],
      recommendations: [
        "Maintain regular exercise routine",
        "Focus on balanced nutrition",
        "Get adequate sleep for recovery"
      ]
    }
  }

  // Get AI-powered nutrition tips
  async getAINutritionTips(prompt) {
    try {
      const response = await this.callHuggingFaceAPI(this.textModel, prompt)
      if (response && response.generated_text) {
        // Parse the AI response into actionable tips
        return this.parseNutritionTips(response.generated_text)
      }
      return null
    } catch (error) {
      console.error('AI Tips Error:', error)
      return null
    }
  }

  // Get AI chat response for the coach
  async getChatResponse(prompt) {
    try {
      const response = await this.callHuggingFaceAPI(this.textModel, prompt)
      if (response && response.generated_text) {
        // Clean up the response
        let cleanResponse = response.generated_text.replace(/^.*?:/g, '').trim()
        cleanResponse = cleanResponse.replace(/\n\n+/g, '\n\n')
        return cleanResponse || "I'm here to help with your fitness and nutrition goals! What would you like to know?"
      }
      return "I'm here to help with your fitness and nutrition goals! What would you like to know?"
    } catch (error) {
      console.error('Error getting chat response:', error)
      return "I'm having some technical difficulties, but I'm still here to help! Try asking about nutrition or workout advice."
    }
  }

  // Get exercise analysis
  async getExerciseAnalysis(exerciseData) {
    try {
      const { workouts, totalCaloriesBurned, totalDuration, weeklyGoal } = exerciseData
      
      return this.getRuleBasedExerciseAnalysis({
        workouts,
        totalCaloriesBurned: totalCaloriesBurned || 0,
        totalDuration: totalDuration || 0,
        weeklyGoal: weeklyGoal || 150 // WHO recommendation: 150 min moderate activity per week
      })
    } catch (error) {
      console.error('Exercise Analysis Error:', error)
      return this.getFallbackExerciseAnalysis()
    }
  }

  // Rule-based exercise analysis
  getRuleBasedExerciseAnalysis(data) {
    const { workouts, totalCaloriesBurned, totalDuration, weeklyGoal } = data
    const insights = []
    const recommendations = []
    let fitnessScore = 75

    // Duration Analysis
    const weeklyProgress = Math.min((totalDuration / weeklyGoal) * 100, 100)
    if (weeklyProgress >= 100) {
      insights.push("🎯 Excellent! You've met your weekly exercise goal!")
      fitnessScore += 15
    } else if (weeklyProgress >= 75) {
      insights.push("💪 Great progress! You're close to your weekly goal")
      fitnessScore += 10
    } else if (weeklyProgress >= 50) {
      insights.push("👍 Good start! Keep building your routine")
      fitnessScore += 5
    } else {
      recommendations.push("📈 Aim for at least 150 minutes of moderate exercise per week")
      fitnessScore -= 10
    }

    // Workout Variety Analysis
    const workoutTypes = new Set(workouts.map(w => w.workout_type || w.type))
    if (workoutTypes.size >= 3) {
      insights.push("🌟 Excellent workout variety for balanced fitness!")
      fitnessScore += 10
    } else if (workoutTypes.size === 2) {
      insights.push("👏 Good workout variety!")
      fitnessScore += 5
      recommendations.push("💡 Consider adding flexibility/yoga to your routine")
    } else if (workoutTypes.size === 1) {
      recommendations.push("🔄 Mix in different exercise types for balanced fitness")
      fitnessScore -= 5
    }

    // Frequency Analysis
    const workoutsThisWeek = workouts.length
    if (workoutsThisWeek >= 4) {
      insights.push("🔥 Outstanding workout frequency!")
      fitnessScore += 10
    } else if (workoutsThisWeek >= 3) {
      insights.push("✅ Great workout consistency!")
      fitnessScore += 5
    } else if (workoutsThisWeek >= 1) {
      recommendations.push("📅 Try to exercise at least 3-4 times per week")
      fitnessScore -= 5
    } else {
      recommendations.push("🏃‍♀️ Start with 2-3 workouts this week")
      fitnessScore -= 15
    }

    // Calorie burn analysis
    if (totalCaloriesBurned > 0) {
      if (totalCaloriesBurned >= 2000) {
        insights.push("🔥 Impressive calorie burn this week!")
        fitnessScore += 8
      } else if (totalCaloriesBurned >= 1000) {
        insights.push("💪 Good calorie burn from your workouts!")
        fitnessScore += 5
      }
    }

    fitnessScore = Math.max(0, Math.min(100, fitnessScore))

    return {
      score: fitnessScore,
      rating: this.getScoreRating(fitnessScore),
      weeklyProgress: Math.round(weeklyProgress),
      insights,
      recommendations: recommendations.slice(0, 3),
      stats: {
        workoutsThisWeek,
        totalDuration,
        totalCaloriesBurned,
        workoutTypes: Array.from(workoutTypes)
      }
    }
  }

  // Fallback exercise analysis
  getFallbackExerciseAnalysis() {
    return {
      score: 70,
      rating: { text: 'Good', emoji: '👍', color: '#34D399' },
      weeklyProgress: 0,
      insights: ["Start tracking workouts for personalized insights!"],
      recommendations: [
        "🏃‍♀️ Aim for 150 minutes of moderate exercise per week",
        "💪 Include both cardio and strength training",
        "🧘‍♀️ Don't forget flexibility and recovery days"
      ],
      stats: {
        workoutsThisWeek: 0,
        totalDuration: 0,
        totalCaloriesBurned: 0,
        workoutTypes: []
      }
    }
  }

  // Parse AI response into structured tips
  parseNutritionTips(aiResponse) {
    const tips = []
    
    // Simple parsing - look for numbered points or bullet points
    const lines = aiResponse.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      const cleanLine = line.trim()
      if (cleanLine.match(/^\d+\./) || cleanLine.match(/^[-•*]/)) {
        // Remove numbering/bullets and clean up
        const tip = cleanLine.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim()
        if (tip.length > 10 && tip.length < 200) {
          tips.push(`💡 ${tip}`)
        }
      }
    }
    
    return tips.length > 0 ? tips : null
  }

  // Implement actual Hugging Face API calls
  async callHuggingFaceAPI(model, prompt) {
    try {
      // Check if API token is available
      if (!this.apiToken) {
        console.log('Hugging Face API token not available, using rule-based analysis')
        throw new Error('No API token available')
      }

      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${this.baseURL}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HF API Error: ${response.status}`)
      }

      const data = await response.json()
      
      // Handle different response formats
      if (Array.isArray(data) && data.length > 0) {
        return data[0]
      } else if (data.generated_text) {
        return data
      }
      
      return null
    } catch (error) {
      console.error('Hugging Face API Error:', error)
      throw error
    }
  }
}

const aiServiceInstance = new AIService()
export default aiServiceInstance
