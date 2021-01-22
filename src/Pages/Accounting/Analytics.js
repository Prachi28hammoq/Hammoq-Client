import React, { useState, useEffect } from 'react';
import LineChart from './Components/LineChart';
import DoughnutChart from './Components/DoughnutChart';
import Axios from "../../services/Axios";

const Analytics = (props) => {

    const [ebayAccounts, setEbayAccounts] = useState([]);
    const [selectedEbayAccount, setSelectedEbayAccount] = useState('');
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState([]);
    const [previousMonthRevenue, setPreviousMonthRevenue] = useState([]);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [incomeExpenseRatio, setIncomeExpenseRatio] = useState([1, 1])
    const [profitLoss, setProfitLoss] = useState(0);
    const [websites, setWebsites] = useState(['Ebay', 'Poshmark', 'Mercari']);
    const [selectedWebsite, setSelectedWebsite] = useState('');

    useEffect(() => {

        (async () => {
            setEbayAccounts(await getAllEbayAccountsLinkedToThisHammoqUser());
        })();

    }, [])

    useEffect(() => {
        props.getAnalyticsData(selectedWebsite, selectedEbayAccount);
    }, [selectedWebsite, selectedEbayAccount])

    useEffect(() => {

        if (selectedWebsite == 'Ebay') {

            setCurrentMonthRevenue(props.currentMonthOrders.map(datum => parseFloat(datum.totalDueSeller)))
            setExpenses(props.currentMonthOrders.reduce((acc, item) => acc
                + (parseFloat(item.deliveryCost) || 0)
                + (parseFloat(item.tax) || 0)
                + (parseFloat(item.totalMarketplaceFee) || 0), 0))
            setProfitLoss(props.currentMonthOrders.reduce((acc, item) => acc
                + (isNaN(item.costOfGoods) ? 0 : (parseInt(item.totalDueSeller) || 0)
                    - (parseInt(item.costOfGoods) || 0)), 0))

        }

        if (selectedWebsite == 'Poshmark') {

            setCurrentMonthRevenue(props.currentMonthOrders.map(datum => parseFloat(datum.earnings)))
            setExpenses(props.currentMonthOrders.reduce((acc, item) => acc
                + ((parseFloat(item.itemPrice) || 0) - (parseFloat(item.earnings) || 0)), 0))

            console.log(currentMonthRevenue);
        }

        if (selectedWebsite == 'Mercari') {

            setCurrentMonthRevenue(props.currentMonthOrders.map(datum => parseFloat(datum.earnings)))
            setExpenses(props.currentMonthOrders.reduce((acc, item) => acc
                + (parseFloat(item.sellingFee) || 0)
                + (parseFloat(item.processingFee) || 0), 0))
        }

    }, [props.currentMonthOrders])


    useEffect(() => {

        setPreviousMonthRevenue(props.previousMonthOrders.map(datum => parseFloat(datum.totalDueSeller)))

    }, [props.previousMonthOrders])

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
                <div className="col-7"></div>
                <div className="col-5">
                    <select style={{ marginRight: '10px' }} id="inputState" value={selectedWebsite} onChange={(event) => setSelectedWebsite(event.target.value)}>
                        <option selected>Choose Website</option>
                        {websites.map(website => <option value={website}>{website}</option>)}
                    </select>
                    <select id="inputState" disabled={selectedWebsite != 'Ebay'} value={selectedEbayAccount} onChange={(event) => setSelectedEbayAccount(event.target.value)}>
                        <option selected>Choose Ebay Account</option>
                        <option value="All accounts">All accounts</option>
                        {ebayAccounts.map(ebayAccount => <option value={ebayAccount.ebayUserName}>{ebayAccount.ebayUserName}</option>)}
                    </select>
                </div>
            </div>
            <div className="row">

                <div className="col-6">
                    <div style={{ width: '600px' }}>
                        <LineChart data1={currentMonthRevenue} data2={previousMonthRevenue} />
                        <div className="row">
                            <div className="col-5">
                                <div>
                                    <div className="d-flex justify-content-center" style={{ color: '#999799' }}>
                                        Current Month
                                    </div>
                                    <div className="d-flex justify-content-center" style={{ color: '#7FDEFF', fontStyle: 'bold' }}>
                                        $ &nbsp; {Math.round((currentMonthRevenue.reduce((acc, item) => acc + item, 0) + Number.EPSILON) * 100) / 100}
                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <div>
                                    <div className="d-flex justify-content-center" style={{ color: '#999799' }}>
                                        Previous Month
                                    </div>
                                    <div className="d-flex justify-content-center" style={{ color: '#758ECD', fontStyle: 'bold' }}>
                                        $ &nbsp; {Math.round((previousMonthRevenue.reduce((acc, item) => acc + item, 0) + Number.EPSILON) * 100) / 100}
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
                <span style={{ fontSize: '1.25em' }}>Profit/Loss (Current Month)&nbsp;:&nbsp;&nbsp;$&nbsp;{profitLoss}</span>
            </div>
        </div>
    );
}

export default Analytics;