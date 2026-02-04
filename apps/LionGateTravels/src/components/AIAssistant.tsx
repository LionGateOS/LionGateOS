/**
 * AI ASSISTANT COMPONENT
 * 
 * Conversational AI interface for trip planning.
 * All AI requests routed through LionGateOS Core.
 * 
 * Features:
 * - Streaming responses
 * - Theme-reactive animations
 * - Voice output (premium tier)
 * - Governance-compliant behavior
 * 
 * Governance: LIONGATEOS_TRAVELS_PLANNER_BOUNDARIES_AND_PHASE2.md
 */

import React from 'react';
import { LionGateOS_Core_API, AI_Message, AI_ResponseChunk } from '../core/liongateos.api';
import './AIAssistant.css';

export interface AIAssistantProps {
  coreAPI: LionGateOS_Core_API;
  tripContext?: unknown; // Current trip data for context
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ coreAPI, tripContext }) => {
  const [messages, setMessages] = React.useState<AI_Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isThinking, setIsThinking] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [currentResponse, setCurrentResponse] = React.useState('');
  const [voiceAvailable, setVoiceAvailable] = React.useState(false);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Check voice feature availability
  React.useEffect(() => {
    const checkVoice = async () => {
      const result = await coreAPI.subscription.isFeatureAvailable('travels.ai.voice-output');
      setVoiceAvailable(result.available);
    };
    checkVoice();
  }, [coreAPI]);
  
  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: AI_Message = {
      role: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    setCurrentResponse('');
    
    try {
      // Request AI through Core
      const stream = coreAPI.ai.requestAI({
        featureId: 'travels.ai.trip-planning',
        context: {
          tripData: tripContext,
          conversationHistory: messages,
        },
        messages: [...messages, userMessage],
        streamResponse: true,
      });
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        switch (chunk.type) {
          case 'thinking':
            setIsThinking(true);
            break;
            
          case 'content':
            setIsThinking(false);
            setIsStreaming(true);
            if (chunk.content) {
              fullResponse += chunk.content;
              setCurrentResponse(fullResponse);
            }
            break;
            
          case 'done':
            setIsStreaming(false);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: fullResponse,
            }]);
            setCurrentResponse('');
            break;
            
          case 'error':
            setIsThinking(false);
            setIsStreaming(false);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: 'I apologize, but I encountered an error. Please try again.',
            }]);
            break;
        }
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setIsThinking(false);
      setIsStreaming(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again.',
      }]);
    }
  };
  
  const handleVoiceOutput = async (text: string) => {
    if (!voiceAvailable) {
      // Show upgrade prompt
      const prompt = await coreAPI.subscription.getUpgradePrompt('travels.ai.voice-output');
      alert(`${prompt.title}\n\n${prompt.message}`);
      return;
    }
    
    try {
      const voice = await coreAPI.ai.requestVoiceOutput(text, {
        language: 'en',
        speed: 1.0,
      });
      
      // Play audio
      const audio = new Audio(voice.audioUrl);
      audio.play();
    } catch (error) {
      console.error('Voice output failed:', error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="ai-assistant">
      {/* System Disclaimer */}
      <div className="ai-disclaimer">
        <div className="ai-disclaimer-icon">ℹ️</div>
        <div className="ai-disclaimer-text">
          <strong>Planning Assistant</strong>
          <p>
            I help organize trip scenarios and surface constraints.
            I don't recommend destinations or make bookings.
            All decisions remain yours.
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-empty-state">
            <div className="ai-empty-icon">✨</div>
            <h3>AI Trip Planning Assistant</h3>
            <p>Ask me to help you organize trip components, compare scenarios, or understand constraints.</p>
            <div className="ai-example-queries">
              <button className="ai-example-btn" onClick={() => setInput('Help me organize a 7-day trip to Japan')}>
                "Help me organize a 7-day trip to Japan"
              </button>
              <button className="ai-example-btn" onClick={() => setInput('Compare costs between summer and fall travel')}>
                "Compare costs between summer and fall travel"
              </button>
              <button className="ai-example-btn" onClick={() => setInput('What constraints should I consider for this itinerary?')}>
                "What constraints should I consider?"
              </button>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`ai-message ai-message--${msg.role}`}>
            <div className="ai-message-avatar">
              {msg.role === 'user' ? '👤' : '✨'}
            </div>
            <div className="ai-message-content">
              {msg.content}
              {msg.role === 'assistant' && voiceAvailable && (
                <button
                  className="ai-voice-btn"
                  onClick={() => handleVoiceOutput(msg.content)}
                  title="Listen to response"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
        ))}
        
        {/* Streaming response */}
        {(isThinking || isStreaming) && (
          <div className="ai-message ai-message--assistant">
            <div className="ai-message-avatar">✨</div>
            <div className="ai-message-content">
              {isThinking && (
                <div className="ai-thinking">
                  <span className="ai-thinking-dot"></span>
                  <span className="ai-thinking-dot"></span>
                  <span className="ai-thinking-dot"></span>
                </div>
              )}
              {isStreaming && currentResponse}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="ai-input-container">
        <textarea
          className="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about trip planning, scenarios, or constraints..."
          rows={3}
          disabled={isThinking || isStreaming}
        />
        <button
          className="ai-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isThinking || isStreaming}
        >
          Send
        </button>
      </div>
      
      {/* Voice Status */}
      {!voiceAvailable && (
        <div className="ai-feature-locked">
          🔒 Voice output requires premium subscription
        </div>
      )}
    </div>
  );
};

/**
 * GOVERNANCE NOTES
 * 
 * From LIONGATEOS_TRAVELS_PLANNER_BOUNDARIES_AND_PHASE2.md:
 * 
 * AI MUST:
 * - Never recommend destinations, vendors, or services
 * - Never rank options using "best", "top", or equivalents
 * - Never encourage urgency or pressure
 * - Never replace professional judgment
 * - Never simulate advisory authority
 * 
 * AI MAY:
 * - Ask neutral clarifying questions
 * - Present factual constraints
 * - Show multiple scenarios without preference
 * - Explain tradeoffs without conclusions
 * 
 * If user requests advice or recommendations:
 * - Reframe into neutral scenario comparison
 * - Explicitly state that Travels does not decide or recommend
 */
