import React, { useState, useContext, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import './MainAppBar.css';
import MainAppBarTab from '../mainpageappbar/mainappbartab/MainAppBarTab.js';
import AccountInformation from './AccountInformation.js';
import { useHistory } from 'react-router-dom';

const MainAppBar = () => {

    let history = useHistory();
    
    const [selectedTab, setSelectedTab] = useState("");

    useEffect(() => {
        setSelectedTab("Dashboard");
        history.push("/dashboard");
    }, [])

    const navigateToModule = (moduleName) => {
        switch (moduleName) {
            case "Dashboard": setSelectedTab(moduleName);
                history.push("/dashboard");
        }
    }

    return (
        <div className="main-app-bar">
            <div className="app-header">HAMMOQ <span style={{ fontSize: '0.7em' }}>AFFILIATE PROGRAM</span></div>
            <div>
                <MainAppBarTab onClick={() => navigateToModule("Dashboard")} image="" text="Dashboard" active={selectedTab == "Dashboard" ? true : false} />
                <AccountInformation />
            </div>
        </div>
    )
}

export default MainAppBar;