import { useState } from 'react';

export const useChat = () => {
  const [activeTab, setActiveTab] = useState('exchange');
  const [activeConversation, setActiveConversation] = useState('tech-society');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  
  const switchTab = (tabType) => {
    setActiveTab(tabType);
  };
  
  const selectConversation = (conversationId, conversationName) => {
    setActiveConversation(conversationId);
    
    // In a real app, this would load messages from the server
    if (conversationId !== 'tech-society') {
      alert(`Loading conversation with ${conversationName}... This would load different messages in a real application.`);
    }
  };
  
  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    // Add message to chat
    const newMessage = {
      id: Date.now(),
      type: 'sent',
      content: messageInput,
      time: timeString
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Simulate reply
    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        type: 'received',
        content: 'Thanks for your message! I\'ll get back to you soon.',
        time: timeString
      };
      
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000);
  };
  
  return {
    activeTab,
    activeConversation,
    messageInput,
    messages,
    switchTab,
    selectConversation,
    setMessageInput,
    sendMessage
  };
};
