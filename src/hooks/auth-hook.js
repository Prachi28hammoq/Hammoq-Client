import { useState, useCallback, useEffect } from 'react';
import Axios from '../services/Axios.jsx';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userFullName, setUserFullName] = useState(false);

    const login = useCallback((userFullName, token, expirationDate) => {
        setToken(token);
        setUserFullName(userFullName);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 30 * 60 * 1000);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userFullName: userFullName,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserFullName(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(async () => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            if (await isUserSessionActive())
                login(storedData.userFullName, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    const isUserSessionActive = async () => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        if (storedData && storedData.token) {

            let res = await Axios.get('/authentication/userSessionStatus', {
                headers: {
                    'Authorization': 'Bearer ' + storedData.token
                }
            });

            if (res.data.session == 'ACTIVE')
                return true;
            else
                return false;
        }
        else {
            return false;
        }
    }


    return { token, login, logout, userFullName };
};