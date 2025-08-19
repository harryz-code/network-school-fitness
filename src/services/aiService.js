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
    const { bmi, bodyFat, age, gender } = data
    const insights = []
    const recommendations = []
    let healthScore = 85

    // BMI Analysis
    let bmiCategory = ''
    if (bmi < 18.5) {
      bmiCategory = 'Underweight'
      recommendations.push("Consider consulting a nutritionist for healthy weight gain strategies")
      healthScore -= 15
    } else if (bmi < 25) {
      bmiCategory = 'Normal'
      insights.push("✅ BMI is in the healthy range!")
      healthScore += 10
    } else if (bmi < 30) {
      bmiCategory = 'Overweight'
      recommendations.push("Focus on gradual weight loss through diet and exercise")
      healthScore -= 10
    } else {
      bmiCategory = 'Obese'
      recommendations.push("Consider working with healthcare professionals for weight management")
      healthScore -= 20
    }

    // Body Fat Analysis (if provided)
    if (bodyFat) {
      const idealBodyFat = gender === 'male' ? 
        { min: 10, max: 20, optimal: 15 } : 
        { min: 16, max: 25, optimal: 20 }

      if (bodyFat < idealBodyFat.min) {
        recommendations.push("Body fat may be too low - ensure adequate nutrition")
        healthScore -= 8
      } else if (bodyFat > idealBodyFat.max) {
        recommendations.push("Consider incorporating strength training to reduce body fat")
        healthScore -= 12
      } else {
        insights.push("💪 Body fat percentage is in a healthy range!")
        healthScore += 8
      }
    }

    // Age-based recommendations
    if (age > 40) {
      recommendations.push("Focus on strength training to maintain muscle mass")
      recommendations.push("Ensure adequate calcium and vitamin D intake")
    }

    healthScore = Math.max(0, Math.min(100, healthScore))

    return {
      score: healthScore,
      rating: this.getScoreRating(healthScore),
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      insights,
      recommendations: recommendations.slice(0, 3),
      targetRanges: {
        bmi: { min: 18.5, max: 24.9 },
        bodyFat: gender === 'male' ? { min: 10, max: 20 } : { min: 16, max: 25 }
      }
    }
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
