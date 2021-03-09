import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import SignupPage from './pages/signup/SignupPage.js';
import LoginPage from './pages/login/LoginPage.js';
import MainPage from './pages/mainpage/MainPage.js';
import 'semantic-ui-css/semantic.min.css';
import { AuthContext } from '../src/context/AuthContext.js';
import { useAuth } from '../src/hooks/auth-hook.js';


function App() {

  const { token, login, logout, userFullName } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/"><MainPage /></Route>
        <Redirect to="/dashboard" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/signup" exact><SignupPage /></Route>
        <Route path="/login" exact><LoginPage /></Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userFullName: userFullName,
          login: login,
          logout: logout
        }}>
        <BrowserRouter>
          {routes}
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
