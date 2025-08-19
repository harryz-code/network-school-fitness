import React, { useState, useEffect } from 'react';
import { X, User, Ruler, Weight, Activity, Calendar, Target } from 'lucide-react';

const BiometricsModal = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onSave, 
  isDark = false 
}) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bodyFat: '',
    age: '',
    gender: 'male',
    targetWeight: '',
    weeklyExerciseGoal: '150',
    activityLevel: 'moderate'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        bodyFat: userProfile.bodyFat || '',
        age: userProfile.age || '',
        gender: userProfile.gender || 'male',
        targetWeight: userProfile.targetWeight || '',
        weeklyExerciseGoal: userProfile.weeklyExerciseGoal || '150',
        activityLevel: userProfile.activityLevel || 'moderate'
      });
    }
  }, [userProfile]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Height must be between 100-250 cm';
    }
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Weight must be between 30-300 kg';
    }
    if (formData.bodyFat && (formData.bodyFat < 3 || formData.bodyFat > 60)) {
      newErrors.bodyFat = 'Body fat must be between 3-60%';
    }
    if (!formData.age || formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Age must be between 13-120 years';
    }
    if (formData.targetWeight && (formData.targetWeight < 30 || formData.targetWeight > 300)) {
      newErrors.targetWeight = 'Target weight must be between 30-300 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Calculate BMI
      const heightInMeters = parseFloat(formData.height) / 100;
      const bmi = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
      
      const profileData = {
        ...formData,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
        age: parseInt(formData.age),
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
        weeklyExerciseGoal: parseInt(formData.weeklyExerciseGoal),
        bmi: Math.round(bmi * 10) / 10,
        updatedAt: new Date().toISOString()
      };

      await onSave(profileData);
      onClose();
    } catch (error) {
      console.error('Error saving biometrics:', error);
      setErrors({ submit: 'Failed to save data. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const bmi = parseFloat(formData.weight) / (heightInMeters * heightInMeters);
      return Math.round(bmi * 10) / 10;
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: '#F59E0B' };
    if (bmi < 25) return { text: 'Normal', color: '#10B981' };
    if (bmi < 30) return { text: 'Overweight', color: '#F59E0B' };
    return { text: 'Obese', color: '#EF4444' };
  };

  if (!isOpen) return null;

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

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
        border: `3px solid ${isDark ? 'white' : 'black'}`,
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: `2px solid ${isDark ? 'white' : 'black'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: isDark ? 'white' : 'black',
            fontFamily: 'Georgia, "Times New Roman", Times, serif'
          }}>
            📊 Biometric Data
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              color: isDark ? 'white' : 'black',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            
            {/* Basic Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                Basic Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {/* Height */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <Ruler size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="170"
                    min="100"
                    max="250"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errors.height ? '#EF4444' : (isDark ? 'white' : 'black')}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                  {errors.height && (
                    <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {errors.height}
                    </p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <Weight size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="70"
                    min="30"
                    max="300"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errors.weight ? '#EF4444' : (isDark ? 'white' : 'black')}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                  {errors.weight && (
                    <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {errors.weight}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <Calendar size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    min="13"
                    max="120"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errors.age ? '#EF4444' : (isDark ? 'white' : 'black')}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                  {errors.age && (
                    <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {errors.age}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BMI Display */}
            {bmi && (
              <div style={{
                marginBottom: '32px',
                padding: '20px',
                backgroundColor: isDark ? 'black' : 'white',
                border: `2px solid ${isDark ? 'white' : 'black'}`
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: isDark ? 'white' : 'black',
                  fontFamily: 'Georgia, "Times New Roman", Times, serif'
                }}>
                  Body Mass Index (BMI)
                </h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'Georgia, "Times New Roman", Times, serif'
                  }}>
                    {bmi}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: bmiCategory.color,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {bmiCategory.text}
                  </span>
                </div>
              </div>
            )}

            {/* Optional Measurements */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                Optional Measurements
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {/* Body Fat */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <Activity size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Body Fat (%)
                  </label>
                  <input
                    type="number"
                    value={formData.bodyFat}
                    onChange={(e) => handleInputChange('bodyFat', e.target.value)}
                    placeholder="15"
                    min="3"
                    max="60"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errors.bodyFat ? '#EF4444' : (isDark ? 'white' : 'black')}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                  {errors.bodyFat && (
                    <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {errors.bodyFat}
                    </p>
                  )}
                </div>

                {/* Target Weight */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <Target size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                    placeholder="65"
                    min="30"
                    max="300"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${errors.targetWeight ? '#EF4444' : (isDark ? 'white' : 'black')}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  />
                  {errors.targetWeight && (
                    <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {errors.targetWeight}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fitness Goals */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: isDark ? 'white' : 'black',
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
              }}>
                Fitness Goals
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {/* Weekly Exercise Goal */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    Weekly Exercise Goal (minutes)
                  </label>
                  <select
                    value={formData.weeklyExerciseGoal}
                    onChange={(e) => handleInputChange('weeklyExerciseGoal', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    <option value="75">75 min (Minimum recommended)</option>
                    <option value="150">150 min (WHO recommended)</option>
                    <option value="300">300 min (Optimal health)</option>
                    <option value="450">450 min (Athletic)</option>
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDark ? 'white' : 'black',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    Activity Level
                  </label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${isDark ? 'white' : 'black'}`,
                      backgroundColor: isDark ? 'black' : 'white',
                      color: isDark ? 'white' : 'black',
                      fontSize: '16px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    <option value="sedentary">Sedentary (desk job, no exercise)</option>
                    <option value="light">Light (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                    <option value="active">Active (hard exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (physical job + exercise)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #EF4444',
                color: '#DC2626',
                fontSize: '14px'
              }}>
                {errors.submit}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: 'transparent',
                  color: isDark ? 'white' : 'black',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  border: `2px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: isDark ? 'white' : 'black',
                  color: isDark ? 'black' : 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Data'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiometricsModal;
