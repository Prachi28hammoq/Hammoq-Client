import React, { useEffect, useState } from 'react';
import AccountsTab from './AccountsTab';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const AccountsTabBar = () => {

    let history = useHistory();
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState('Ebay Accounts');

    useEffect(() => {

        switch (selectedTab) {
            case "Ebay Accounts": history.push('/accounts/ebayAccounts');
                break;
            default:
                break;
        }

    }, [selectedTab, history])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-2"></div>
                <div className="col-8 d-flex justify-content-start">
                    <AccountsTab onClick={setSelectedTab} tabName="Ebay Accounts" isSelected={selectedTab === "Ebay Accounts"} />                    
                </div>
            </div>
        </div>);
}

export default AccountsTabBar;