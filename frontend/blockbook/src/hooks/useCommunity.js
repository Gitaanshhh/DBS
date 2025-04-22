import { useState } from 'react';

export const useCommunity = () => {
  const [activeTab, setActiveTab] = useState('booking-board');
  
  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };
  
  const requestExchange = (studentBody, venue) => {
    alert(`Exchange request will be sent to ${studentBody} for their booking of ${venue}.`);
  };
  
  const addToCalendar = (event) => {
    alert(`Event "${event}" has been added to your calendar.`);
  };
  
  const cancelExchangeRequest = (exchangeCard) => {
    if (confirm('Are you sure you want to cancel this exchange request?')) {
      alert('Exchange request cancelled successfully.');
      return true; // Return true to indicate the request was cancelled
    }
    return false;
  };
  
  const sendReminder = (otherParty) => {
    alert(`Reminder sent to ${otherParty}.`);
  };
  
  const searchEvents = (searchTerm) => {
    if (searchTerm.trim() === '') {
      alert('Please enter a search term.');
      return;
    }
    
    alert(`Searching for "${searchTerm}"... In a real application, this would filter the results.`);
  };
  
  const applyFilter = (filterType, filterValue) => {
    if (filterValue !== '') {
      alert(`Filter applied: ${filterType} = ${filterValue}`);
    }
  };
  
  return {
    activeTab,
    switchTab,
    requestExchange,
    addToCalendar,
    cancelExchangeRequest,
    sendReminder,
    searchEvents,
    applyFilter
  };
};
