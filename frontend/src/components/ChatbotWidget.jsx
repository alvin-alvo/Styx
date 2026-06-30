import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChatMessage } from '../services/api'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Styx-AI. How can I assist you with your API ecosystem today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await sendChatMessage(newMessages)
      setMessages([...newMessages, response.data.message])
    } catch (err) {
      console.error(err)
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ *I am currently offline or unable to reach my neural network. Please check your local Ollama connection.*' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[32rem] bg-navy/90 backdrop-blur-xl border border-light-navy/50 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 relative">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/80 to-navy p-4 flex justify-between items-center border-b border-purple-500/30">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="text-ice-blue font-bold text-sm">Styx AI Assistant</h3>
                <p className="text-ice-blue/50 text-xs">Powered by llama3</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-ice-blue/70 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-lg text-sm prose prose-sm prose-invert prose-p:leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none shadow-lg shadow-purple-600/20' 
                      : 'bg-light-navy/50 text-ice-blue/90 border border-light-navy rounded-bl-none shadow-lg'
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-light-navy/50 border border-light-navy rounded-lg rounded-bl-none p-3 px-4 flex space-x-1 items-center h-10">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-navy/95 border-t border-light-navy/50">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your APIs..."
                className="w-full bg-dark-navy text-ice-blue text-sm rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-light-navy/50"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 p-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-light-navy disabled:text-gray-500 text-white rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-fuchsia-500 rounded-full shadow-2xl shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none"
        >
          <span className="text-2xl">✨</span>
        </button>
      )}
    </div>
  )
}
