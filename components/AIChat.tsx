'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import styles from './AIChat.module.css';

interface AIChatProps {
  context: string;
}

export default function AIChat({ context }: AIChatProps) {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your Omega assistant. Ask me anything about the stocks on your watchlist."
      }
    ],
    body: {
      context
    }
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`glass-panel ${styles.container}`}>
      <div className={styles.header}>
        <h3>Omega AI</h3>
        <span className={styles.pulseIndicator}></span>
      </div>
      
      <div className={styles.messagesContainer} ref={scrollRef}>
        {messages.map((m: any) => (
          <div key={m.id} className={`${styles.messageWrapper} ${m.role === 'user' ? styles.userWrapper : styles.aiWrapper}`}>
            <div className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about these assets..."
          className={styles.input}
        />
        <button type="submit" disabled={!input.trim()} className={styles.sendButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
