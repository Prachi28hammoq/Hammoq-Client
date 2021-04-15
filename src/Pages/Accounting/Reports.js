import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';
import Axios from "../../services/Axios";
import socket from "../../../src/services/socket.jsx";
import './Reports.css';
import { nanoid } from 'nanoid';
import AddIcon from '@material-ui/icons/Add';
import { NavLink  } from 'react-router-dom'

const Reports = (props) => {

    const [orders, setOrders] = useState([]);
    //const [fromDate, setFromDate] = useState('');
    //const [toDate, setToDate] = useState('');
    const [ebayAccounts, setEbayAccounts] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [fromDateInIsoFormat, setFromDateInIsoFormat] = useState('');
    const [toDateInIsoFormat, setToDateInIsoFormat] = useState('');
    const [selectedEbayAccount, setSelectedEbayAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progressIndicatorPercentage, setProgressIndicatorPercentage] = useState(0);
    const [room, setRoom] = useState('');
    const [profit, setProfit] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [profitProgressIndicator, setProfitProgressIndicator] = useState(50);
    const [expensesProgressIndicator, setExpensesProgressIndicator] = useState(50);

    useEffect(() => {

        setRoom(nanoid(5));

        const loadEbayAccounts = async () => {
            setEbayAccounts(await getAllEbayAccountsLinkedToThisHammoqUser());
        }

        loadEbayAccounts();

        return () => {
            socket.disconnect();
            socket.off('connect');
            socket.off("updateAnalyticsProgress");
        };

    }, []);

    useEffect(() => {
        console.log(room);
        if (room.length > 0) {
            socket.connect();
            socket.on('connect', function () {
                socket.emit('room', room);
            });

            socket.on('updateReportsProgress', function (data) {
                if (data.room === room)
                    setProgressIndicatorPercentage(data.percentage);
            });
        }

    }, [room])

    useEffect(() => {

        if (!fromDate)
            return;

        setFromDateInIsoFormat(fromDate.getFullYear()
            + '-' + String(fromDate.getMonth() + 1).padStart(2, '0')
            + '-' + String(fromDate.getDate()).padStart(2, '0')
            + 'T00:00:00.000Z');

    }, [fromDate]);

    useEffect(() => {

        if (!toDate)
            return;

        setToDateInIsoFormat(toDate.getFullYear()
            + '-' + String(toDate.getMonth() + 1).padStart(2, '0')
            + '-' + String(toDate.getDate()).padStart(2, '0')
            + 'T00:00:00.000Z');

    }, [toDate])

    useEffect(() => {

        if (orders.length > 0) {

            setProfit(orders.reduce((acc, item) => acc + parseFloat(item.totalDueSeller), 0));
            setExpenses(orders.reduce((acc, item) => acc
                + (parseFloat(item.deliveryCost) || 0)
                + (parseFloat(item.tax) || 0)
                + (parseFloat(item.totalMarketplaceFee) || 0), 0))

        }

    }, [orders])

    useEffect(() => {

        if ((profit + expenses) > 0) {
            setProfitProgressIndicator(parseFloat(((profit / (profit + expenses)) * 100)));
            setExpensesProgressIndicator(parseFloat(((expenses / (profit + expenses)) * 100)));
        }

    }, [profit, expenses])

    const getAllEbayAccountsLinkedToThisHammoqUser = async () => {

        let res = await Axios.get('/ebayAuth/ebayaccounts');

        return res?.data;

    }

    const updateCostOfGoods = async (index, orderId, value) => {

        if (!isNaN(value)) {
            setOrders(orders => orders.map((order, idx) => {
                if (idx === index) return { ...orders[index], costOfGoods: value };
                return order;
            }))

            await Axios.put('/ebayaccounting/orders', {
                orderId: orderId,
                costOfGoods: value
            });
        }
    }

    const handleSearch = async (selectedEbayAccount, fromDate, toDate) => {

        setOrders([]);
        setProfit(0);
        setExpenses(0);

        setIsLoading(true);

        let res = await Axios.post('/ebayaccounting/search', {
            selectedEbayAccount,
            fromDate: fromDateInIsoFormat,
            toDate: toDateInIsoFormat,
            room
        });

        setOrders(res?.data?.orders);

        setIsLoading(false);

    }

    return (
        <>
            <div className="row">
            <NavLink   class="btn btn-success" style={{ height:'40px', 'text-align':'center'}}  to="/accounts/ebayAccounts"><AddIcon />&nbsp;Add Ebay Account</NavLink >
                <div style={{ display: 'inline-block', float: 'right', margin: '7px 0px' }} className="ml-auto">
                
                    <div className="ebay-reports-control-bar">
                        <div className="ebay-reports-progress-bar">
                            <div className="ebay-reports-progress-bar-indicator" style={{ width: isLoading ? progressIndicatorPercentage + '%' : '100%' }}>

                            </div>
                        </div>
                        <div style={{ padding: '10px 7px' }}>
                            <div style={{ display: 'inline-block' }}>
                                <select id="inputState" value={selectedEbayAccount} onChange={(event) => setSelectedEbayAccount(event.target.value)}>
                                    <option selected>Choose Ebay Account</option>
                                    <option value="All accounts">All accounts</option>
                                    {ebayAccounts.map(ebayAccount => <option value={ebayAccount.ebayUserName}>{ebayAccount.ebayUserName}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'inline-block' }}>
                                <div className="ebay-reports-datepicker">
                                    <label>FROM</label>
                                    <DatePicker
                                        onChange={setFromDate}
                                        value={fromDate}
                                        format="MMM-dd-y"
                                    />
                                </div>
                                <div className="ebay-reports-datepicker">
                                    <label>TO</label>
                                    <DatePicker
                                        onChange={setToDate}
                                        value={toDate}
                                        format="MMM-dd-y"
                                    />
                                </div>
                                <button disabled={isLoading} type="button" className="btn btn-success btn-sm" onClick={() => handleSearch(selectedEbayAccount, fromDateInIsoFormat, toDateInIsoFormat)}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" style={{ height: '60vh', overflow: 'scroll' }}>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Order ID</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Cost Of Goods</th>
                            <th scope="col">Purchase Marketplace Id</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Price Subtotal</th>
                            <th scope="col">Delivery Cost</th>
                            <th scope="col">Tax</th>
                            <th scope="col">Total</th>
                            <th scope="col">Total Marketplace Fee</th>
                            <th scope="col">Total Due Seller</th>
                            <th scope="col">Profit or Loss</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{order.orderId}</td>
                                    <td>{order.title}</td>
                                    <td>{<input size="8"
                                        style={{ border: '1px solid grey', padding: '5px 5px' }}
                                        value={order.costOfGoods ? order.costOfGoods : ''}
                                        onChange={(e) => updateCostOfGoods(index, order.orderId, e.target.value)} />}
                                    </td>
                                    <td>{order.purchaseMarketplaceId}</td>
                                    <td>{order.orderPaymentStatus}</td>
                                    <td>{order.priceSubtotal}</td>
                                    <td>{order.deliveryCost}</td>
                                    <td>{order.tax}</td>
                                    <td>{order.total}</td>
                                    <td>{order.totalMarketplaceFee}</td>
                                    <td>{order.totalDueSeller}</td>
                                    {order.costOfGoods ?
                                        parseInt(order.totalDueSeller) - parseInt(order.costOfGoods) > 0 ?
                                            <td style={{ color: '#4caf50', fontStyle: 'bold' }}>{parseInt(order.totalDueSeller) - parseInt(order.costOfGoods)}</td> :
                                            <td style={{ color: '#EF3E36', fontStyle: 'bold' }}>{parseInt(order.totalDueSeller) - parseInt(order.costOfGoods)}</td> :
                                        <td>{order.totalDueSeller}</td>}
                                </tr>)
                        })}

                    </tbody>
                </table>
                <div style={{ width: '100%' }}>
                    {isLoading ?
                        (<div className="d-flex justify-content-center">
                            <div className="spinner-border text-secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>) : null}
                </div>
            </div>
            <div className="ebay-reports-profits-expenses-bar">
                <div className="ebay-reports-profit-expenses-labels">
                    <div className="ebay-reports-profit-label">
                        <div>
                            <div>Total Net Profit</div>
                            <div>${parseInt(profit).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        </div>
                    </div>
                    <div className="ebay-reports-expenses-label">
                        <div>
                            <div>Total Expenses</div>
                            <div>${parseInt(expenses).toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="profit-progress-bar" style={{ width: profitProgressIndicator + '%'}}></div>
                    <div className="expenses-progress-bar" style={{ width: expensesProgressIndicator + '%'}}></div>
                </div>
            </div>
        </>
    );

}

export default Reports;