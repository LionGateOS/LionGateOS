import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import './AIAssistant.css';
export const AIAssistant = ({ coreAPI, tripContext }) => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [isThinking, setIsThinking] = React.useState(false);
    const [isStreaming, setIsStreaming] = React.useState(false);
    const [currentResponse, setCurrentResponse] = React.useState('');
    const [voiceAvailable, setVoiceAvailable] = React.useState(false);
    const messagesEndRef = React.useRef(null);
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
        if (!input.trim())
            return;
        const userMessage = {
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
        }
        catch (error) {
            console.error('AI request failed:', error);
            setIsThinking(false);
            setIsStreaming(false);
            setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'I apologize, but I\'m having trouble connecting right now. Please try again.',
                }]);
        }
    };
    const handleVoiceOutput = async (text) => {
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
        }
        catch (error) {
            console.error('Voice output failed:', error);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return (_jsxs("div", { className: "ai-assistant", children: [_jsxs("div", { className: "ai-disclaimer", children: [_jsx("div", { className: "ai-disclaimer-icon", children: "\u2139\uFE0F" }), _jsxs("div", { className: "ai-disclaimer-text", children: [_jsx("strong", { children: "Planning Assistant" }), _jsx("p", { children: "I help organize trip scenarios and surface constraints. I don't recommend destinations or make bookings. All decisions remain yours." })] })] }), _jsxs("div", { className: "ai-messages", children: [messages.length === 0 && (_jsxs("div", { className: "ai-empty-state", children: [_jsx("div", { className: "ai-empty-icon", children: "\u2728" }), _jsx("h3", { children: "AI Trip Planning Assistant" }), _jsx("p", { children: "Ask me to help you organize trip components, compare scenarios, or understand constraints." }), _jsxs("div", { className: "ai-example-queries", children: [_jsx("button", { className: "ai-example-btn", onClick: () => setInput('Help me organize a 7-day trip to Japan'), children: "\"Help me organize a 7-day trip to Japan\"" }), _jsx("button", { className: "ai-example-btn", onClick: () => setInput('Compare costs between summer and fall travel'), children: "\"Compare costs between summer and fall travel\"" }), _jsx("button", { className: "ai-example-btn", onClick: () => setInput('What constraints should I consider for this itinerary?'), children: "\"What constraints should I consider?\"" })] })] })), messages.map((msg, i) => (_jsxs("div", { className: `ai-message ai-message--${msg.role}`, children: [_jsx("div", { className: "ai-message-avatar", children: msg.role === 'user' ? '👤' : '✨' }), _jsxs("div", { className: "ai-message-content", children: [msg.content, msg.role === 'assistant' && voiceAvailable && (_jsx("button", { className: "ai-voice-btn", onClick: () => handleVoiceOutput(msg.content), title: "Listen to response", children: "\uD83D\uDD0A" }))] })] }, i))), (isThinking || isStreaming) && (_jsxs("div", { className: "ai-message ai-message--assistant", children: [_jsx("div", { className: "ai-message-avatar", children: "\u2728" }), _jsxs("div", { className: "ai-message-content", children: [isThinking && (_jsxs("div", { className: "ai-thinking", children: [_jsx("span", { className: "ai-thinking-dot" }), _jsx("span", { className: "ai-thinking-dot" }), _jsx("span", { className: "ai-thinking-dot" })] })), isStreaming && currentResponse] })] })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "ai-input-container", children: [_jsx("textarea", { className: "ai-input", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Ask about trip planning, scenarios, or constraints...", rows: 3, disabled: isThinking || isStreaming }), _jsx("button", { className: "ai-send-btn", onClick: handleSend, disabled: !input.trim() || isThinking || isStreaming, children: "Send" })] }), !voiceAvailable && (_jsx("div", { className: "ai-feature-locked", children: "\uD83D\uDD12 Voice output requires premium subscription" }))] }));
};
