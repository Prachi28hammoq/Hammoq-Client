import React, { useState } from 'react';
import './TabPanel.css';
import Tab from './Tab.js';

const TabPanel = (props) => {

  const [selectedTab, setSelectedTab] = useState('Analytics');

  return (
    <div className="ebay-accounting-tab-panel">
      <Tab tabName="Analytics"
        onClick={(tabName) => { setSelectedTab(tabName); props.onTabSelect(tabName); }}
        isSelected={selectedTab === 'Analytics'} />
      <Tab tabName="Reports"
        onClick={(tabName) => { setSelectedTab(tabName); props.onTabSelect(tabName); }}
        isSelected={selectedTab === 'Reports'} />
    </div>
  );
}

export default TabPanel;