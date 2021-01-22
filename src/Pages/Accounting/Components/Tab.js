import React from 'react';
import './Tab.css';

const Tab = (props) => {

    return(
        <div onClick={() => props.onClick(props.tabName)} className={props.isSelected ?  "ebay-accounting-tab active" : "ebay-accounting-tab"}>{props.tabName}</div>
    )
}

export default Tab;