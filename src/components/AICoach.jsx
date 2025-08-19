import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Bot, User, Utensils, Dumbbell, Target, TrendingUp } from 'lucide-react';
import aiService from '../services/aiService';

const AICoach = ({ 
  dailyData, 
  biometricData, 
  selectedDate, 
  isDark = false,
  availableMenuItems = [] // Pass in all food items from all meal types
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message and daily insights
  useEffect(() => {
    if (dailyData && Object.keys(dailyData).length > 0) {
      const welcomeMessage = generateWelcomeMessage(dailyData, biometricData);
      setMessages([{
        id: Date.now(),
        type: 'coach',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [dailyData, biometricData, selectedDate]);

  const generateWelcomeMessage = (daily, biometric) => {
    const { calories, protein, carbs, fat, meals } = daily;
    const totalMeals = meals?.length || 0;
    
    let message = `👋 Hello! I'm your AI fitness & wellness coach. I've analyzed your data for ${selectedDate}:\n\n`;
    
    if (totalMeals > 0) {
      message += `📊 **Today's Nutrition:**\n`;
      message += `• ${calories || 0} calories consumed\n`;
      message += `• ${protein || 0}g protein, ${carbs || 0}g carbs, ${fat || 0}g fat\n`;
      message += `• ${totalMeals} meals logged\n\n`;
      
      // Provide specific insights
      if (protein < 50) {
        message += `💪 **Protein Alert:** You're low on protein today. Try adding eggs, Greek yogurt, or protein powder from our menu!\n\n`;
      }
      if (calories < 1200) {
        message += `⚡ **Energy Check:** Your calorie intake seems low. Need suggestions for healthy, filling options?\n\n`;
      }
    } else {
      message += `📝 I notice you haven't logged any meals yet today. Ready to plan some nutritious options from our extensive menu?\n\n`;
    }

    message += `💬 **Ask me anything about:**\n`;
    message += `• Meal recommendations from our menu\n`;
    message += `• Workout suggestions\n`;
    message += `• Nutrition optimization\n`;
    message += `• Fitness goals and progress\n\n`;
    message += `What would you like to focus on today?`;

    return message;
  };

  const generateCoachResponse = async (userMessage) => {
    try {
      // Create context for the AI coach
      const context = {
        dailyData,
        biometricData,
        selectedDate,
        availableMenuItems: availableMenuItems.slice(0, 50), // Limit to prevent token overflow
        userMessage: userMessage.toLowerCase()
      };

      // Generate a comprehensive prompt for the AI coach
      const prompt = `You are an expert AI fitness and wellness coach. Based on the user's data and question, provide helpful, personalized advice.

User's Daily Data:
- Calories: ${context.dailyData.calories || 0}
- Protein: ${context.dailyData.protein || 0}g
- Carbs: ${context.dailyData.carbs || 0}g  
- Fat: ${context.dailyData.fat || 0}g
- Meals logged: ${context.dailyData.meals?.length || 0}

User's Question: "${userMessage}"

Available Menu Items (sample): ${context.availableMenuItems.map(item => `${item.name} (${item.calories}cal, ${item.protein}g protein)`).join(', ').substring(0, 500)}...

Provide specific, actionable advice. If they ask about food, recommend specific items from the menu. If about workouts, suggest specific exercises. Be encouraging and personalized. Keep response under 200 words.`;

      const response = await aiService.getChatResponse(prompt);
      return response || generateFallbackResponse(userMessage, context);
    } catch (error) {
      console.error('AI Coach error:', error);
      return generateFallbackResponse(userMessage, { dailyData, biometricData });
    }
  };

  const generateFallbackResponse = (userMessage, context) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('food') || msg.includes('eat') || msg.includes('meal') || msg.includes('hungry')) {
      const { calories, protein } = context.dailyData;
      if (protein < 50) {
        return `🍳 For protein, I recommend: scrambled eggs (20g protein), Greek yogurt (15g), or our protein powder (24g). These are all available in our breakfast/snack menu!`;
      }
      if (calories < 1500) {
        return `🥗 Try these filling options: Nasi Lemak with chicken (450 cal), congee with salted fish (280 cal), or a protein smoothie with banana (320 cal). All available in our menu!`;
      }
      return `🍽️ Based on your intake, consider adding some healthy fats like avocado (234 cal) or nuts (160 cal per serving) from our menu for sustained energy.`;
    }
    
    if (msg.includes('workout') || msg.includes('exercise') || msg.includes('fitness')) {
      return `💪 Great question! Based on your profile, I recommend:\n\n• **Strength:** 3x/week - squats, push-ups, deadlifts\n• **Cardio:** 2x/week - 20-30 min moderate intensity\n• **Recovery:** Daily stretching or yoga\n\nStart with our workout logging feature to track your progress!`;
    }
    
    if (msg.includes('weight') || msg.includes('lose') || msg.includes('gain')) {
      const { calories } = context.dailyData;
      if (calories < 1200) {
        return `⚠️ For healthy weight management, avoid going below 1200 calories. Focus on nutrient-dense foods from our menu like lean proteins, vegetables, and whole grains.`;
      }
      return `📊 For sustainable results, aim for a 300-500 calorie deficit for weight loss, or surplus for muscle gain. Track consistently and adjust based on progress!`;
    }
    
    return `🤔 I'm here to help with nutrition, fitness, and wellness advice! Try asking me about:\n\n• "What should I eat for more protein?"\n• "Suggest a workout routine"\n• "How can I improve my nutrition?"\n• "What's a good post-workout meal?"`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const coachResponse = await generateCoachResponse(inputMessage);
      const coachMsg = {
        id: Date.now() + 1,
        type: 'coach',
        content: coachResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachMsg]);
    } catch (error) {
      console.error('Error getting coach response:', error);
      const errorMsg = {
        id: Date.now() + 1,
        type: 'coach',
        content: "I'm having trouble right now, but I'm here to help! Try asking about nutrition, workouts, or meal recommendations.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Utensils, text: "Meal suggestions", query: "What should I eat based on my current nutrition?" },
    { icon: Dumbbell, text: "Workout plan", query: "Suggest a workout routine for today" },
    { icon: Target, text: "Goal setting", query: "Help me set realistic fitness goals" },
    { icon: TrendingUp, text: "Progress tips", query: "How can I improve my nutrition and fitness?" }
  ];

  const handleQuickAction = (query) => {
    setInputMessage(query);
    handleSendMessage();
  };

  if (!isExpanded) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: `3px solid ${isDark ? 'white' : 'black'}`,
            backgroundColor: isDark ? 'black' : 'white',
            color: isDark ? 'white' : 'black',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          <MessageCircle size={28} />
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      height: '600px',
      border: `3px solid ${isDark ? 'white' : 'black'}`,
      backgroundColor: isDark ? 'black' : 'white',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `2px solid ${isDark ? 'white' : 'black'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bot size={24} color={isDark ? 'white' : 'black'} />
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            color: isDark ? 'white' : 'black'
          }}>
            AI Wellness Coach
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            border: 'none',
            background: 'none',
            color: isDark ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              ...(message.type === 'user' ? { justifyContent: 'flex-end' } : {})
            }}
          >
            {message.type === 'coach' && (
              <Bot size={20} color={isDark ? 'white' : 'black'} style={{ marginTop: '4px', flexShrink: 0 }} />
            )}
            <div
              style={{
                maxWidth: '80%',
                padding: '12px',
                backgroundColor: message.type === 'user' 
                  ? (isDark ? 'white' : 'black')
                  : 'transparent',
                color: message.type === 'user'
                  ? (isDark ? 'black' : 'white')
                  : (isDark ? 'white' : 'black'),
                border: message.type === 'coach' ? `1px solid ${isDark ? 'white' : 'black'}` : 'none',
                fontSize: '14px',
                lineHeight: '1.4',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                whiteSpace: 'pre-line'
              }}
            >
              {message.content}
            </div>
            {message.type === 'user' && (
              <User size={20} color={isDark ? 'white' : 'black'} style={{ marginTop: '4px', flexShrink: 0 }} />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color={isDark ? 'white' : 'black'} />
            <div style={{
              padding: '12px',
              border: `1px solid ${isDark ? 'white' : 'black'}`,
              color: isDark ? 'white' : 'black',
              fontSize: '14px'
            }}>
              Thinking...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div style={{
          padding: '12px 16px',
          borderTop: `1px solid ${isDark ? 'white' : 'black'}`,
          borderBottom: `1px solid ${isDark ? 'white' : 'black'}`
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.query)}
                style={{
                  padding: '8px',
                  border: `1px solid ${isDark ? 'white' : 'black'}`,
                  backgroundColor: 'transparent',
                  color: isDark ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? 'white' : 'black';
                  e.target.style.color = isDark ? 'black' : 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = isDark ? 'white' : 'black';
                }}
              >
                <action.icon size={14} />
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: `2px solid ${isDark ? 'white' : 'black'}`,
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about nutrition, workouts, or goals..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            border: `1px solid ${isDark ? 'white' : 'black'}`,
            backgroundColor: isDark ? 'black' : 'white',
            color: isDark ? 'white' : 'black',
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          style={{
            padding: '12px',
            border: `1px solid ${isDark ? 'white' : 'black'}`,
            backgroundColor: !inputMessage.trim() || isLoading ? 'transparent' : (isDark ? 'white' : 'black'),
            color: !inputMessage.trim() || isLoading ? (isDark ? '#666' : '#999') : (isDark ? 'black' : 'white'),
            cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AICoach;
