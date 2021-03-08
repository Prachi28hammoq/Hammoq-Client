import React, { useState, useEffect } from 'react';
import './Accounting.css';
import TabPanel from './Components/TabPanel.js';
import { Route, useHistory } from 'react-router-dom';
import Reports from './Reports';
import Analytics from './Analytics';
import Axios from "../../services/Axios";

const Accounting = () => {

    const history = useHistory();

    useEffect(() => {

        history.push('/accounting/analytics');

    }, []);

    const onTabSelect = (tabName) => {

        switch (tabName) {
            case 'Analytics': history.push('/accounting/analytics');
                break;
            case 'Reports': history.push('/accounting/reports');
                break;
        }

    }

    return (
        <div className="container-fluid h-100">
            <div className="row d-flex align-items-end">
                <div className="col-4">
                    <TabPanel onTabSelect={onTabSelect} />
                </div>
                <div className="col-8 d-flex align-items-end">                    
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Route path="/accounting/analytics">
                        <Analytics />
                    </Route>
                    <Route path="/accounting/reports">
                        <Reports />
                    </Route>
                </div>
            </div>
        </div>
    );
}

export default Accounting;