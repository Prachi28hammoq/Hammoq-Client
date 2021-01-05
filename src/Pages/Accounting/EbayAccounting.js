import React, { useState, useEffect } from 'react';
import './EbayAccounting.css';
import TabPanel from './Components/TabPanel.js';
import AccountingSearchBar from './Components/AccoutingSearchBar.js';
import { Route, useHistory } from 'react-router-dom';
import Reports from './Reports';
import Analytics from './Analytics';
import Axios from "../../services/Axios";

const EbayAccounting = () => {

    const history = useHistory();

    const [orders, setOrders] = useState([]);
    const [isReportsDataLoading, setIsReportsDataLoading] = useState(false);
    const [currentMonthOrders, setCurrentMonthOrders] = useState([]);
    const [previousMonthOrders, setPreviousMonthOrders] = useState([]);

    useEffect(() => {

        history.push('/ebayaccounting/analytics');

    }, []);

    const updateCostOfGoods = (index, orderId, value) => {

        let re = /^[0-9\b]+$/;

        if (!isNaN(value)) {
            setOrders(orders.map((order, idx) => {
                if (idx == index) return { ...orders[index], costOfGoods: value };
                return order;
            }))

            Axios.put('/ebayaccounting/orders', {
                orderId: orderId,
                costOfGoods: value
            });
        }
    }

    const onTabSelect = (tabName) => {

        switch (tabName) {
            case 'Analytics': history.push('/ebayaccounting/analytics');
                break;
            case 'Reports': history.push('/ebayaccounting/reports');
                break;
        }

    }

    const handleSearch = async (selectedEbayAccount, fromDate, toDate) => {

        setOrders([]);
        setIsReportsDataLoading(true);

        let orders = await Axios.post('/ebayaccounting/search', {
            selectedEbayAccount,
            fromDate,
            toDate
        });

        setIsReportsDataLoading(false);
        setOrders(orders.data);

    }

    const getAnalyticsData = async (selectedEbayAccount) => {

        let orders;
        let fromDate;
        let toDate;

        fromDate = getPriorDate(30);
        toDate = getPriorDate(1);

        orders = await Axios.post('/ebayaccounting/search', {
            selectedEbayAccount,
            fromDate,
            toDate
        });

        setCurrentMonthOrders(orders.data);

        fromDate = getPriorDate(60);
        toDate = getPriorDate(30);

        orders = await Axios.post('/ebayaccounting/search', {
            selectedEbayAccount,
            fromDate,
            toDate
        });

        setPreviousMonthOrders(orders.data);

    }

    const getPriorDate = (numberOfDaysAgo) => {

        var priorDate = new Date(new Date().getTime() - (numberOfDaysAgo * 24 * 60 * 60 * 1000));

        return priorDate.toISOString();

    }


    return (
        <div className="container-fluid h-100">
            <div className="row d-flex align-items-end">
                <div className="col-4">
                    <TabPanel onTabSelect={onTabSelect} />
                </div>
                <div className="col-8 d-flex align-items-end">
                    <AccountingSearchBar handleSearch={handleSearch} />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Route path="/ebayaccounting/analytics">
                        <Analytics getAnalyticsData={getAnalyticsData} currentMonthOrders={currentMonthOrders} previousMonthOrders={previousMonthOrders} />
                    </Route>
                    <Route path="/ebayaccounting/reports">
                        <Reports orders={orders}
                            isReportsDataLoading={isReportsDataLoading}
                            updateCostOfGoods={updateCostOfGoods} />
                    </Route>
                </div>
            </div>
        </div>
    );
}

export default EbayAccounting;