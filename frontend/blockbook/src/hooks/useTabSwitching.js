import { useState } from 'react';

export const useTabSwitching = (defaultTab) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };
  
  return {
    activeTab,
    switchTab
  };
};
