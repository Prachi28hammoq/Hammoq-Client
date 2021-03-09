import React, { useState, useEffect, useContext } from 'react';
import { Button, Segment, Portal, Icon } from 'semantic-ui-react';
import './AccountInformation.css';
import titleCase from '../../../../utilities/utilities.js';
import Axios from '../../../../services/Axios.jsx';
import { AuthContext } from '../../../../context/AuthContext.js';
import useWindowSize from '../../../../hooks/usewindowsize-hook.js';

const AccountInformation = () => {

    const [userName, setUserName] = useState('');
    const [dropdownXPosition, setDropdownXPosition] = useState(0);
    const [chevronName, setChevronName] = useState('chevron down')

    const auth = useContext(AuthContext);
    const windowSize = useWindowSize();

    useEffect(() => {
        
        setTimeout(() => populateUserName(), 400);
        setTimeout(() => alignDropdownWithTrigger(), 600);

    }, [windowSize]);

    const populateUserName = () => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        if (storedData)
            setUserName(storedData.userFullName);
    }

    const logoutUser = async () => {

        let res;

        try {
            res = await Axios.get('/authentication/logout', {
                headers: {
                    'Authorization': 'Bearer ' + auth.token
                }
            });
        } catch (error) { }

        if (res?.data?.httpStatus == 'Success') {
            auth.logout();
        }
    }

    const alignDropdownWithTrigger = () => {
            setDropdownXPosition(document.querySelector('.account-information-trigger').getBoundingClientRect().left + 'px');
    }

    return (
        <>
            <Portal closeOnTriggerClick openOnTriggerClick onOpen={() => setChevronName('chevron up')} onClose={() => setChevronName('chevron down')}
                trigger={<div className="account-information-trigger">{titleCase(userName)} &nbsp; <Icon name={chevronName} /></div>}>
                <Segment id="account-information-dropdown" style={{ left: dropdownXPosition, position: 'fixed', top: '40px', zIndex: 1000 }}>
                    <Button color="grey" onClick={logoutUser}> Logout </Button>
                </Segment>
            </Portal>
        </>
    );
}

export default AccountInformation;