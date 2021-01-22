import React, { useState, useEffect } from 'react';
import './Accounting.css';
import TabPanel from './Components/TabPanel.js';
import AccountingSearchBar from './Components/AccoutingSearchBar.js';
import { Route, useHistory } from 'react-router-dom';
import Reports from './Reports';
import Analytics from './Analytics';
import Axios from "../../services/Axios";

const Accounting = () => {

    const history = useHistory();

    const [orders, setOrders] = useState([]);
    const [isReportsDataLoading, setIsReportsDataLoading] = useState(false);
    const [currentMonthOrders, setCurrentMonthOrders] = useState([]);
    const [previousMonthOrders, setPreviousMonthOrders] = useState([]);
    const [selectedWebsite, setSelectedWebsite] = useState('');

    useEffect(() => {

        history.push('/accounting/analytics');

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
            case 'Analytics': history.push('/accounting/analytics');
                break;
            case 'Reports': history.push('/accounting/reports');
                break;
        }

    }

    const handleSearch = async (selectedWebsite, selectedEbayAccount, fromDate, toDate) => {

        if (selectedWebsite == 'Ebay') {
            setSelectedWebsite(selectedWebsite);
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

        if (selectedWebsite == 'Poshmark') {
            setSelectedWebsite(selectedWebsite);
            setOrders([]);
            setIsReportsDataLoading(true);

            let orders = await Axios.post('/poshmarkaccounting/search', {                
                fromDate,
                toDate
            });

            setIsReportsDataLoading(false);
            setOrders(orders.data);

        }

        if (selectedWebsite == 'Mercari') {
            setSelectedWebsite(selectedWebsite);
            setOrders([]);
            setIsReportsDataLoading(true);

            let orders = await Axios.post('/mercariaccounting/search', {
                fromDate,
                toDate
            });

            setIsReportsDataLoading(false);
            setOrders(orders.data);

        }


    }

    const getAnalyticsData = async (selectedWebsite, selectedEbayAccount) => {

        let orders;
        let fromDate;
        let toDate;

        fromDate = getPriorDate(30);
        toDate = getPriorDate(0);

        console.log(fromDate);
        console.log(toDate);


        let url = '', body = { fromDate, toDate };

        if(selectedWebsite == 'Ebay')  url = '/ebayaccounting/search';
        if(selectedWebsite == 'Poshmark')  url = '/poshmarkaccounting/search';
        if(selectedWebsite == 'Mercari')  url = '/mercariaccounting/search';

        if(selectedWebsite == 'Ebay') body = { ...body, selectedEbayAccount }

        orders = await Axios.post(url, body);

        setCurrentMonthOrders(orders.data);

        fromDate = getPriorDate(60);
        toDate = getPriorDate(30);

        body = { ...body, fromDate, toDate };
        console.log(JSON.stringify(body));

        orders = await Axios.post(url, body);

        setPreviousMonthOrders(orders.data);

    }

    const getPriorDate = (numberOfDaysAgo) => {

        var priorDate = new Date(new Date().getTime() - (numberOfDaysAgo * 24 * 60 * 60 * 1000));

        return priorDate.toISOString();

    }


    return (
        <div className="container-fluid h-100">
            <div className="row d-flex align-items-end">
                <div className="col-3">
                    <TabPanel onTabSelect={onTabSelect} />
                </div>
                <div className="col-9 d-flex align-items-end">
                    <AccountingSearchBar handleSearch={handleSearch} />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Route path="/accounting/analytics">
                        <Analytics getAnalyticsData={getAnalyticsData} currentMonthOrders={currentMonthOrders} previousMonthOrders={previousMonthOrders} />
                    </Route>
                    <Route path="/accounting/reports">
                        <Reports orders={orders}
                            isReportsDataLoading={isReportsDataLoading}
                            updateCostOfGoods={updateCostOfGoods}
                            selectedWebsite={selectedWebsite} />
                    </Route>
                </div>
            </div>
        </div>
    );
}

export default Accounting;