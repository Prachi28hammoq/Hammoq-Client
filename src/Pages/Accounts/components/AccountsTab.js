import React from 'react';
import './AccountsTab.css';

const AccountsTab = (props) => {

    return (
        <div onClick={() => props.onClick(props.tabName)} className={props.isSelected ? "accounts-tab accounts-tab-selected" : "accounts-tab"}>
            {props.tabName}
        </div>
    );
}

export default AccountsTab;