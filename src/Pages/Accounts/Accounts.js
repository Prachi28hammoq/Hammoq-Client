import React from 'react';
import AccountsTabBar from './components/AccountsTabBar';
import { Route } from 'react-router-dom';
import EbayAccounts from './EbayAccounts';

const Accounts = () => {

    return (
        <>
            <AccountsTabBar />
            <div style={{margin: '25px 10px'}}>
                <Route path="/accounts/ebayAccounts"><EbayAccounts /></Route>
            </div>
        </>
    );
}

export default Accounts;