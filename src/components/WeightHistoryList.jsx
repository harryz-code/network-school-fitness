import { useState, useEffect } from 'react'
import { Calendar, TrendingDown, TrendingUp, Target, FileText, Plus, Edit, Trash2 } from 'lucide-react'

function WeightHistoryList({ 
  weightHistory = [], 
  onAddEntry, 
  onEditEntry, 
  onDeleteEntry, 
  isDark = false 
}) {
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    notes: ''
  })

  const handleAddEntry = () => {
    if (!newEntry.weight || !newEntry.date) return
    
    onAddEntry({
      ...newEntry,
      weight: parseFloat(newEntry.weight),
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : null
    })
    
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      notes: ''
    })
    setIsAddingEntry(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const calculateLeanMass = (weight, bodyFat) => {
    if (!weight || !bodyFat) return null
    return weight * (1 - bodyFat / 100)
  }

  const getGoalDistanceColor = (distance) => {
    if (!distance) return isDark ? '#6b7280' : '#9ca3af'
    return distance > 0 ? '#ef4444' : '#10b981' // red for above goal, green for below
  }

  const getGoalDistanceIcon = (distance) => {
    if (!distance) return null
    return distance > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />
  }

  return (
    <div style={{
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      borderRadius: '0px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '18px',
          fontWeight: '600',
          color: isDark ? '#f9fafb' : '#111827',
          fontFamily: 'Georgia, serif'
        }}>
          Weight History
        </h3>
        <button
          onClick={() => setIsAddingEntry(!isAddingEntry)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
            borderRadius: '0px',
            color: isDark ? '#f9fafb' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {/* Add New Entry Form */}
      {isAddingEntry && (
        <div style={{
          backgroundColor: isDark ? '#374151' : '#f9fafb',
          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
          borderRadius: '0px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
                marginBottom: '4px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Date
              </label>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '0px',
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  color: isDark ? '#f9fafb' : '#111827',
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
                marginBottom: '4px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="70.5"
                value={newEntry.weight}
                onChange={(e) => setNewEntry(prev => ({ ...prev, weight: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '0px',
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  color: isDark ? '#f9fafb' : '#111827',
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
                marginBottom: '4px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Body Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="15.0"
                value={newEntry.bodyFat}
                onChange={(e) => setNewEntry(prev => ({ ...prev, bodyFat: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '0px',
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  color: isDark ? '#f9fafb' : '#111827',
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </div>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: isDark ? '#9ca3af' : '#6b7280',
              marginBottom: '4px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Notes (optional)
            </label>
            <input
              type="text"
              placeholder="Diet changes, workout intensity, etc."
              value={newEntry.notes}
              onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '0px',
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                color: isDark ? '#f9fafb' : '#111827',
                fontSize: '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
          }}>
            <button
              onClick={handleAddEntry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Save Entry
            </button>
            <button
              onClick={() => setIsAddingEntry(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: isDark ? '#9ca3af' : '#6b7280',
                border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '0px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weight History List */}
      {weightHistory.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: isDark ? '#9ca3af' : '#6b7280',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ margin: '0', fontSize: '16px' }}>No weight history yet</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Start tracking your progress by adding your first entry
          </p>
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {weightHistory.map((entry, index) => {
            const leanMass = calculateLeanMass(entry.weight, entry.body_fat)
            const goalDistanceWeight = entry.goal_distance_weight
            const goalDistanceBodyFat = entry.goal_distance_body_fat
            
            return (
              <div
                key={entry.id || index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  backgroundColor: isDark ? '#374151' : '#f9fafb',
                  marginBottom: '8px',
                  borderRadius: '0px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: isDark ? '#f9fafb' : '#111827',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {formatDate(entry.date)}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    gap: '12px',
                    fontSize: '14px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <div>
                      <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Weight:</span>
                      <span style={{ 
                        color: isDark ? '#f9fafb' : '#111827',
                        fontWeight: '500',
                        marginLeft: '4px'
                      }}>
                        {entry.weight} kg
                      </span>
                    </div>
                    
                    {entry.body_fat && (
                      <div>
                        <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Body Fat:</span>
                        <span style={{ 
                          color: isDark ? '#f9fafb' : '#111827',
                          fontWeight: '500',
                          marginLeft: '4px'
                        }}>
                          {entry.body_fat}%
                        </span>
                      </div>
                    )}
                    
                    {leanMass && (
                      <div>
                        <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Lean Mass:</span>
                        <span style={{ 
                          color: isDark ? '#f9fafb' : '#111827',
                          fontWeight: '500',
                          marginLeft: '4px'
                        }}>
                          {leanMass.toFixed(1)} kg
                        </span>
                      </div>
                    )}
                    
                    {goalDistanceWeight !== null && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Goal:</span>
                        <span style={{ 
                          color: getGoalDistanceColor(goalDistanceWeight),
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          {getGoalDistanceIcon(goalDistanceWeight)}
                          {Math.abs(goalDistanceWeight).toFixed(1)} kg
                          {goalDistanceWeight > 0 ? ' over' : ' under'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {entry.notes && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '13px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      fontStyle: 'italic',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FileText size={12} />
                      {entry.notes}
                    </div>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button
                    onClick={() => onEditEntry && onEditEntry(entry)}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      cursor: 'pointer',
                      borderRadius: '0px'
                    }}
                    title="Edit entry"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteEntry && onDeleteEntry(entry.id)}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      borderRadius: '0px'
                    }}
                    title="Delete entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WeightHistoryList
