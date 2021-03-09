import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userFullName: null,
    token: null,
    login: () => { },
    logout: () => { }
})