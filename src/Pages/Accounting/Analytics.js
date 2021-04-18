import React, { useState, useEffect } from 'react';
import BarChart from './Components/BarChart';
import DoughnutChart from './Components/DoughnutChart';
import Axios from "../../services/Axios";
import socket from "../../../src/services/socket.jsx";
import './Analytics.css';
import _ from 'lodash';
import { NavLink  } from 'react-router-dom'
import { nanoid } from 'nanoid';
import AddIcon from '@material-ui/icons/Add';

const Analytics = (props) => {

    const [ebayAccounts, setEbayAccounts] = useState([]);
    const [selectedEbayAccount, setSelectedEbayAccount] = useState('');
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState([]);
    const [previousMonthRevenue, setPreviousMonthRevenue] = useState([]);
    const [income, setIncome] = useState(-1);
    const [expenses, setExpenses] = useState(-1);
    const [incomeExpenseRatio, setIncomeExpenseRatio] = useState([1, 1])
    const [profitLoss, setProfitLoss] = useState(0);
    const [orders, setOrders] = useState([]);
    const [currentMonthOrders, setCurrentMonthOrders] = useState([]);
    const [previousMonthOrders, setPreviousMonthOrders] = useState([]);
    const [room, setRoom] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progressIndicatorPercentage, setProgressIndicatorPercentage] = useState(0);
    const [barChartDataSet, setBarChartDataSet] = useState([]);

    const getAnalyticsData = async () => {

        setIsLoading(true);

        setOrders([]);
        setCurrentMonthOrders([]);
        setPreviousMonthOrders([]);
        setBarChartDataSet([]);

        let res = await Axios.post('/ebayaccounting/analyticsData', {
            selectedEbayAccount,
            room
        });

        setOrders(orders => [...orders, ...res?.data?.previousMonthOrders, ...res?.data?.currentMonthOrders])
        setPreviousMonthOrders(res?.data?.previousMonthOrders);
        setCurrentMonthOrders(res?.data?.currentMonthOrders);

        setIsLoading(false);
    }

    useEffect(() => {

        setRoom(nanoid(5));

        (async () => {
            setEbayAccounts(await getAllEbayAccountsLinkedToThisHammoqUser());
        })();

        return () => {
            socket.disconnect();
            socket.off('connect');
            socket.off("updateAnalyticsProgress");
        };

    }, [])

    useEffect(() => {
        if (room.length > 0) {
            socket.connect();
            socket.on('connect', function () {
                socket.emit('room', room);
            });

            socket.on('updateAnalyticsProgress', function (data) {
                if (data.room == room)
                    setProgressIndicatorPercentage(data.percentage);
            });
        }

    }, [room])

    useEffect(() => {

        let groupedByCodeArray = _.groupBy(orders, 'groupByCode');

        let previousMonthRevenuePerDay = [];
        let currentMonthRevenuePerDay = [];

        let prevMonthDay;
        let currMonthDay;

        for (let day = 1; day <= 31; day++) {

            prevMonthDay = groupedByCodeArray['PREV_MONTH-' + day];
            currMonthDay = groupedByCodeArray['CURR_MONTH-' + day];

            if (prevMonthDay) {
                previousMonthRevenuePerDay = [...previousMonthRevenuePerDay, prevMonthDay.reduce((acc, datum) => acc + parseFloat(datum.totalDueSeller), 0)]
            } else {
                previousMonthRevenuePerDay = [...previousMonthRevenuePerDay, 0]
            }

            if (currMonthDay) {
                currentMonthRevenuePerDay = [...currentMonthRevenuePerDay, currMonthDay.reduce((acc, datum) => acc + parseFloat(datum.totalDueSeller), 0)]
            } else {
                currentMonthRevenuePerDay = [...currentMonthRevenuePerDay, 0]
            }
        }

        setBarChartDataSet([
            {
                label: 'Previous Month',
                backgroundColor: "#3F88C5",
                data: previousMonthRevenuePerDay
            },
            {
                label: 'Current Month',
                backgroundColor: "#F4989C",
                data: currentMonthRevenuePerDay
            },
        ]);

    }, [orders])

    useEffect(() => {

        setCurrentMonthRevenue(currentMonthOrders.map(datum => parseFloat(datum.totalDueSeller)))
        setExpenses(currentMonthOrders.reduce((acc, item) => acc
            + (parseFloat(item.deliveryCost) || 0)
            + (parseFloat(item.tax) || 0)
            + (parseFloat(item.totalMarketplaceFee) || 0), 0))
        setProfitLoss(currentMonthOrders.reduce((acc, item) => acc
            + (isNaN(item.costOfGoods) ? 0 : (parseInt(item.totalDueSeller) || 0)
                - (parseInt(item.costOfGoods) || 0)), 0))

    }, [currentMonthOrders])


    useEffect(() => {

        setPreviousMonthRevenue(previousMonthOrders.map(datum => parseFloat(datum.totalDueSeller)))

    }, [previousMonthOrders])

    useEffect(() => {

        setIncome(currentMonthRevenue.reduce((acc, item) => acc + item, 0));

    }, [currentMonthRevenue])

    useEffect(() => {

        let incomeRatio = Math.round((income / (income + expenses)) * 100);
        let expenseRatio = Math.round((expenses / (income + expenses)) * 100);

        setIncomeExpenseRatio([incomeRatio, expenseRatio])


    }, [income, expenses])


    const getAllEbayAccountsLinkedToThisHammoqUser = async () => {

        let res = await Axios.get('/ebayAuth/ebayaccounts');

        return res?.data;

    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-9"><NavLink   className="btn btn-success" style={{ height:'40px', textAlign:'center'}}  to="/accounts/ebayAccounts"><AddIcon />&nbsp;Add Ebay Account</NavLink ></div>
                <div className="col-3">
                    <div className="ebay-analytics-control-bar">
                        <div className="ebay-analytics-progress-bar">
                            <div className="ebay-analytics-progress-bar-indicator" style={{ width: isLoading ? progressIndicatorPercentage + '%' : '100%' }}>

                            </div>
                        </div>
                        <div style={{ padding: '10px 7px' }}>
                            <select id="inputState" value={selectedEbayAccount} onChange={(event) => setSelectedEbayAccount(event.target.value)}>
                                <option defaultValue>Choose Ebay Account</option>
                                <option value="All accounts">All accounts</option>
                                {ebayAccounts.map(ebayAccount => <option value={ebayAccount.ebayUserName} key={nanoid(3)}>{ebayAccount.ebayUserName}</option>)}
                            </select>
                            <button type="button" className="btn btn-success btn-sm" style={{ marginLeft: '10px' }} onClick={() => getAnalyticsData()} disabled={isLoading}>
                                Load Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">

                <div className="col-6">
                    <div style={{ width: '600px' }}>
                        <BarChart barChartDataSet={barChartDataSet} />
                        <div className="row">
                            <div className="col-5">
                                <div>
                                    <div className="d-flex justify-content-center" style={{ color: '#999799' }}>
                                        Previous Month
                                    </div>
                                    <div className="d-flex justify-content-center" style={{ color: '#3F88C5', fontStyle: 'bold' }}>
                                        $ &nbsp; {Math.round((previousMonthRevenue.reduce((acc, item) => acc + item, 0) + Number.EPSILON) * 100) / 100}
                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div>
                                    <div className="d-flex justify-content-center" style={{ color: '#999799' }}>
                                        Current Month
                                    </div>
                                    <div className="d-flex justify-content-center" style={{ color: '#F4989C', fontStyle: 'bold' }}>
                                        $ &nbsp; {Math.round((currentMonthRevenue.reduce((acc, item) => acc + item, 0) + Number.EPSILON) * 100) / 100}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div style={{ width: '400px' }}>
                        <DoughnutChart data={incomeExpenseRatio} />
                        <div className="row" style={{ topMargin: '30px' }}>
                            <div className="col-6">
                                <div>
                                    <div className="d-flex justify-content-center" style={{ color: '#999799' }}>
                                        Income
                                    </div>
                                    <div className="d-flex justify-content-center" style={{ color: '#81E979', fontStyle: 'bold' }}>
                                        $ &nbsp; {Math.round((income + Number.EPSILON) * 100) / 100}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div>
                                    <div className="d-flex justify-content-center" style={{ color: '#999799' }}>
                                        Expenses
                                    </div>
                                    <div className="d-flex justify-content-center" style={{ color: '#E6AA68', fontStyle: 'bold' }}>
                                        $ &nbsp; {Math.round((expenses + Number.EPSILON) * 100) / 100}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="row">
                <span style={{ fontSize: '1.25em' }}>Profit/Loss (Current Month)&nbsp;:&nbsp;&nbsp;$&nbsp;{parseInt(income) - parseInt(expenses)}</span>
            </div>
        </div>
    );
}

export default Analytics;