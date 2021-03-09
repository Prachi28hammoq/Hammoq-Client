import React, { useState } from 'react';
import './MainPage.css';
import MainAppBar from '../mainpage/components/mainpageappbar/MainAppBar.js';
import DashboardPage from '../dashboard/DashboardPage.js';
import { Route } from 'react-router-dom';

const MainPage = () => {

    return (
        <>
            <MainAppBar />
            <Route path="/dashboard" exact><DashboardPage /></Route>
        </>
    );
}

export default MainPage;
