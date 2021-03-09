import React from 'react';
import './MainAppBarTab.css';
import { Icon } from 'semantic-ui-react';

const MainAppBarTab = (props) => {

    return(
        <div onClick={props.onClick} className={props.active == true? "main-app-bar-tab active" : "main-app-bar-tab"} >
            {props.image !=""? <Icon aria-hidden="true" color="white" size="large" name={props.image} /> : "" }{props.text}
        </div>
    )
}

export default MainAppBarTab