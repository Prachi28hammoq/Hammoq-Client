import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';
import Axios from "../../../services/Axios";
import './AccountingSearchBar.css';

const AccountingSearchBar = (props) => {

    const [ebayAccounts, setEbayAccounts] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [fromDateInIsoFormat, setFromDateInIsoFormat] = useState('');
    const [toDateInIsoFormat, setToDateInIsoFormat] = useState('');
    const [selectedEbayAccount, setSelectedEbayAccount] = useState('');

    useEffect(async () => {

        setEbayAccounts(await getAllEbayAccountsLinkedToThisHammoqUser());

    }, [])

    useEffect(() => {

        setFromDateInIsoFormat(fromDate.getFullYear()
        + '-' + String(fromDate.getMonth() + 1).padStart(2, '0') 
        + '-' + String(fromDate.getDate()).padStart(2, '0')
        + 'T00:00:00.000Z');

    }, [fromDate]);

    useEffect(() => {

        setToDateInIsoFormat(toDate.getFullYear()
        + '-' + String(toDate.getMonth() + 1).padStart(2, '0') 
        + '-' + String(toDate.getDate()).padStart(2, '0')
        + 'T00:00:00.000Z');

    }, [toDate])

    const getAllEbayAccountsLinkedToThisHammoqUser = async () => {

        let res = await Axios.get('/ebayAuth/ebayaccounts');

        return res?.data;

    }

    return (
        <>
            <div className="row accounting-search-controls accounting-search-bar">
                <div className="col-3">
                    <select id="inputState" value={selectedEbayAccount} onChange={(event) => setSelectedEbayAccount(event.target.value)}>
                        <option selected>Choose Ebay Account</option>
                        <option value="All accounts">All accounts</option>
                        {ebayAccounts.map(ebayAccount => <option value={ebayAccount.ebayUserName}>{ebayAccount.ebayUserName}</option>)}
                    </select>
                </div>
                <div className="col-9">
                    <div className="accounting-datepicker">
                        <label>FROM</label>
                        <DatePicker
                            onChange={setFromDate}
                            value={fromDate}
                            format="MMM-dd-y"
                        />
                    </div>
                    <div className="accounting-datepicker">
                        <label>TO</label>
                        <DatePicker
                            onChange={setToDate}
                            value={toDate}
                            format="MMM-dd-y"
                        />
                    </div>
                    <button type="button" className="btn btn-success btn-sm" onClick={() => props.handleSearch(selectedEbayAccount, fromDateInIsoFormat, toDateInIsoFormat)}>
                     Search
                    </button>
                </div>
            </div>
        </>
    );
}

export default AccountingSearchBar;