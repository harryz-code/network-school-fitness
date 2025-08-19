import { useState, useEffect, useMemo } from 'react'
import { Brain, TrendingUp, Target, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'
import aiService from '../services/aiService'

function AIAnalysis({ 
  dailyData, 
  biometricData, 
  isDark = false, 
  selectedDate = new Date() 
}) {
  const [nutritionAnalysis, setNutritionAnalysis] = useState(null)
  const [biometricAnalysis, setBiometricAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('nutrition')

  // Memoize the data checks to prevent infinite re-renders
  const hasNutritionData = useMemo(() => {
    return dailyData && dailyData.calories > 0
  }, [dailyData?.calories])

  const hasBiometricData = useMemo(() => {
    return biometricData && biometricData.height && biometricData.weight
  }, [biometricData?.height, biometricData?.weight])

  // Memoize the selected date string to prevent unnecessary re-renders
  const selectedDateString = useMemo(() => {
    return selectedDate.toDateString()
  }, [selectedDate])

  useEffect(() => {
    const runAnalysis = async () => {
      console.log('AI Analysis - Running analysis with data:', { 
        calories: dailyData?.calories, 
        mealsCount: dailyData?.meals?.length,
        hasUserProfile: !!dailyData?.userProfile 
      })
      
      setLoading(true)
      
      // Add timeout to prevent infinite loading
      const analysisTimeout = setTimeout(() => {
        console.log('AI Analysis - Timeout reached, using fallback')
        setLoading(false)
      }, 15000) // 15 second timeout
      
      try {
        // Only run nutrition analysis if there's actual data
        if (dailyData && dailyData.calories > 0) {
          console.log('AI Analysis - Getting nutrition analysis...')
          const nutritionResult = await aiService.getNutritionAnalysis(dailyData)
          console.log('AI Analysis - Nutrition result:', nutritionResult)
          setNutritionAnalysis(nutritionResult)
        } else {
          console.log('AI Analysis - No nutrition data, skipping analysis')
          setNutritionAnalysis(null)
        }

        // Only run biometric analysis if there's data
        if (biometricData && (biometricData.height && biometricData.weight)) {
          console.log('AI Analysis - Getting biometric analysis...')
          const biometricResult = await aiService.getBiometricAnalysis(biometricData)
          console.log('AI Analysis - Biometric result:', biometricResult)
          setBiometricAnalysis(biometricResult)
        } else {
          console.log('AI Analysis - No biometric data, skipping analysis')
          setBiometricAnalysis(null)
        }
      } catch (error) {
        console.error('AI Analysis Error:', error)
        setNutritionAnalysis(null)
        setBiometricAnalysis(null)
      } finally {
        clearTimeout(analysisTimeout)
        setLoading(false)
      }
    }

    console.log('AI Analysis - Data check:', { hasNutritionData, hasBiometricData })
    
    if (hasNutritionData || hasBiometricData) {
      runAnalysis()
    } else {
      console.log('AI Analysis - No data to analyze, hiding component')
      setLoading(false)
      setNutritionAnalysis(null)
      setBiometricAnalysis(null)
    }
  }, [hasNutritionData, hasBiometricData, selectedDateString, dailyData?.calories, dailyData?.protein, dailyData?.carbs, dailyData?.fat, dailyData?.fiber, dailyData?.meals?.length])

  // Don't render anything if no data to analyze
  if (!hasNutritionData && !hasBiometricData) {
    return null // Don't render the component at all
  }

  if (loading) {
    return (
      <div style={{
        padding: '32px',
        backgroundColor: isDark ? 'black' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`,
        borderRadius: '0px',
        textAlign: 'center',
        fontFamily: 'Georgia, "Times New Roman", Times, serif'
      }}>
        <Brain style={{ 
          width: '32px', 
          height: '32px', 
          color: isDark ? 'white' : 'black',
          margin: '0 auto 16px'
        }} />
        <p style={{ 
          color: isDark ? 'white' : 'black',
          margin: 0,
          fontSize: '16px',
          fontWeight: 'bold',
          letterSpacing: '0.025em'
        }}>
          AI analyzing your nutrition...
        </p>
        <p style={{ 
          color: isDark ? '#a3a3a3' : '#6b7280',
          margin: '8px 0 0 0',
          fontSize: '14px'
        }}>
          This may take a few seconds
        </p>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: isDark ? 'black' : 'white',
      border: `2px solid ${isDark ? 'white' : 'black'}`,
      borderRadius: '0px',
      overflow: 'hidden',
      fontFamily: 'Georgia, "Times New Roman", Times, serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '32px',
        borderBottom: `2px solid ${isDark ? 'white' : 'black'}`,
        backgroundColor: isDark ? 'black' : 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px'
        }}>
          <Brain style={{ width: '32px', height: '32px', color: isDark ? 'white' : 'black' }} />
          <h3 style={{
            margin: 0,
            color: isDark ? 'white' : 'black',
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '-0.025em',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            AI Health Analysis
          </h3>
        </div>
        <p style={{
          margin: 0,
          color: isDark ? '#a3a3a3' : '#6b7280',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Personalized insights for {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: isDark ? 'black' : 'white',
        borderBottom: `1px solid ${isDark ? 'white' : 'black'}`
      }}>
        <button
          onClick={() => setActiveTab('nutrition')}
          style={{
            flex: 1,
            padding: '16px 24px',
            border: 'none',
            backgroundColor: activeTab === 'nutrition' ? 
              (isDark ? 'white' : 'black') : 'transparent',
            color: activeTab === 'nutrition' ? 
              (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🥗 Nutrition
        </button>
        <button
          onClick={() => setActiveTab('biometrics')}
          style={{
            flex: 1,
            padding: '16px 24px',
            border: 'none',
            backgroundColor: activeTab === 'biometrics' ? 
              (isDark ? 'white' : 'black') : 'transparent',
            color: activeTab === 'biometrics' ? 
              (isDark ? 'black' : 'white') : (isDark ? 'white' : 'black'),
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📊 Biometrics
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        {activeTab === 'nutrition' && nutritionAnalysis && (
          <NutritionAnalysisView analysis={nutritionAnalysis} isDark={isDark} />
        )}
        
        {activeTab === 'biometrics' && biometricAnalysis && (
          <BiometricAnalysisView analysis={biometricAnalysis} isDark={isDark} />
        )}

        {activeTab === 'nutrition' && !nutritionAnalysis && (
          <EmptyState 
            icon="🥗" 
            title="No nutrition data" 
            description="Log some meals to get AI nutrition insights!"
            isDark={isDark}
          />
        )}

        {activeTab === 'biometrics' && !biometricAnalysis && (
          <EmptyState 
            icon="📊" 
            title="No biometric data" 
            description="Add your body measurements to get health insights!"
            isDark={isDark}
          />
        )}
      </div>
    </div>
  )
}

function NutritionAnalysisView({ analysis, isDark }) {
  return (
    <div>
      {/* Overall Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '24px',
        backgroundColor: isDark ? 'black' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '24px' }}>{analysis.rating.emoji}</span>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}>
              {analysis.rating.text}
            </span>
          </div>
          <p style={{
            margin: 0,
            color: isDark ? '#a3a3a3' : '#6b7280',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Nutrition Score
          </p>
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black',
          fontFamily: 'Georgia, "Times New Roman", Times, serif'
        }}>
          {analysis.score}
        </div>
      </div>

      {/* Macro Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: isDark ? 'white' : 'black',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          📊 Macro Distribution
        </h4>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
          <div style={{
            flex: analysis.macroBreakdown.protein,
            height: '12px',
            backgroundColor: isDark ? 'white' : 'black',
            border: `1px solid ${isDark ? 'white' : 'black'}`
          }} />
          <div style={{
            flex: analysis.macroBreakdown.carbs,
            height: '12px',
            backgroundColor: isDark ? '#666666' : '#cccccc',
            border: `1px solid ${isDark ? 'white' : 'black'}`
          }} />
          <div style={{
            flex: analysis.macroBreakdown.fat,
            height: '12px',
            backgroundColor: isDark ? '#333333' : '#e5e5e5',
            border: `1px solid ${isDark ? 'white' : 'black'}`
          }} />
        </div>
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: isDark ? 'white' : 'black'
        }}>
          <span>■ Protein {analysis.macroBreakdown.protein}%</span>
          <span>■ Carbs {analysis.macroBreakdown.carbs}%</span>
          <span>■ Fat {analysis.macroBreakdown.fat}%</span>
        </div>
      </div>

      {/* Tips */}
      {analysis.tips && analysis.tips.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: isDark ? 'white' : 'black',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Lightbulb style={{ width: '16px', height: '16px' }} />
            AI Recommendations
          </h4>
          {analysis.tips.map((tip, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              backgroundColor: isDark ? 'black' : 'white',
              marginBottom: '12px',
              border: `1px solid ${isDark ? 'white' : 'black'}`
            }}>
              <AlertCircle style={{
                width: '16px',
                height: '16px',
                color: isDark ? 'white' : 'black',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <p style={{
                margin: 0,
                color: isDark ? 'white' : 'black',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {tip}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {analysis.insights && analysis.insights.length > 0 && (
        <div>
          <h4 style={{
            margin: '0 0 12px 0',
            color: isDark ? 'white' : 'black',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            Positive Insights
          </h4>
          {analysis.insights.map((insight, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              backgroundColor: isDark ? '#333333' : '#f0f0f0',
              marginBottom: '12px',
              border: `1px solid ${isDark ? 'white' : 'black'}`
            }}>
              <CheckCircle style={{
                width: '16px',
                height: '16px',
                color: isDark ? 'white' : 'black',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <p style={{
                margin: 0,
                color: isDark ? 'white' : 'black',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BiometricAnalysisView({ analysis, isDark }) {
  return (
    <div>
      {/* Overall Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '24px',
        backgroundColor: isDark ? 'black' : 'white',
        border: `2px solid ${isDark ? 'white' : 'black'}`
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '24px' }}>{analysis.rating.emoji}</span>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black',
              fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}>
              {analysis.rating.text}
            </span>
          </div>
          <p style={{
            margin: 0,
            color: isDark ? '#a3a3a3' : '#6b7280',
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Health Score
          </p>
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: isDark ? 'white' : 'black',
          fontFamily: 'Georgia, "Times New Roman", Times, serif'
        }}>
          {analysis.score}
        </div>
      </div>

      {/* BMI Info */}
      {analysis.bmi && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: isDark ? 'white' : 'black',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            📏 Body Mass Index
          </h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px',
            backgroundColor: isDark ? '#262626' : '#f8fafc',
            borderRadius: '8px',
            border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: isDark ? 'white' : 'black'
            }}>
              {analysis.bmi}
            </div>
            <div>
              <div style={{
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontSize: '14px'
              }}>
                {analysis.bmiCategory}
              </div>
              <div style={{
                fontSize: '12px',
                color: isDark ? '#a3a3a3' : '#6b7280'
              }}>
                Healthy range: 18.5 - 24.9
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: isDark ? 'white' : 'black',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Target style={{ width: '16px', height: '16px' }} />
            Health Recommendations
          </h4>
          {analysis.recommendations.map((rec, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: isDark ? '#262626' : '#f8fafc',
              borderRadius: '8px',
              marginBottom: '8px',
              border: `1px solid ${isDark ? '#333' : '#e5e7eb'}`
            }}>
              <Target style={{
                width: '16px',
                height: '16px',
                color: '#3B82F6',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <p style={{
                margin: 0,
                color: isDark ? 'white' : 'black',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {rec}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {analysis.insights && analysis.insights.length > 0 && (
        <div>
          <h4 style={{
            margin: '0 0 12px 0',
            color: isDark ? 'white' : 'black',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp style={{ width: '16px', height: '16px' }} />
            Health Insights
          </h4>
          {analysis.insights.map((insight, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#10B98120',
              borderRadius: '8px',
              marginBottom: '8px',
              border: '1px solid #10B98140'
            }}>
              <CheckCircle style={{
                width: '16px',
                height: '16px',
                color: '#10B981',
                marginTop: '2px',
                flexShrink: 0
              }} />
              <p style={{
                margin: 0,
                color: isDark ? 'white' : 'black',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon, title, description, isDark }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '40px 20px',
      color: isDark ? '#a3a3a3' : '#6b7280'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px'
      }}>
        {icon}
      </div>
      <h4 style={{
        margin: '0 0 8px 0',
        color: isDark ? 'white' : 'black',
        fontSize: '16px',
        fontWeight: 'bold'
      }}>
        {title}
      </h4>
      <p style={{
        margin: 0,
        fontSize: '14px'
      }}>
        {description}
      </p>
    </div>
  )
}

export default AIAnalysis
