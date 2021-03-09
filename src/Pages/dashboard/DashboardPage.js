import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import ReferralCodeComponent from '../dashboard/referralcode/ReferralCodeComponent.js';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import FilterBar from '../dashboard/filterbar/FilterBar.js';
import AnalyticsCards from '../dashboard/analyticscards/AnalyticsCards.js';
import Axios from '../../services/Axios.jsx';
import DataTable from '../dashboard/datatable/DataTable.js';

const DashboardPage = () => {

    const [filterYear, setFilterYear] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [totalReferrals, setTotalReferrals] = useState('');
    const [totalListings, setTotalListings] = useState('');
    const [totalEarnings, setTotalEarnings] = useState('');
    const [listingData, setListingData] = useState([]);
    const [isTotalReferralsCardLoading, setIsTotalReferralsCardLoading] = useState(false);
    const [isTotalListingsCardLoading, setIsTotalListingsCardLoading] = useState(false);
    const [isTotalEarningsCardLoading, setIsTotalEarningsCardLoading] = useState(false);
    const [isDataTableLoading, setIsDataTableLoading] = useState(false);

    useEffect(() => {

        setIsTotalEarningsCardLoading(true);

        if (Number.isInteger(totalListings)) {
            let localTotalEarnings = totalListings * 0.145;
            localTotalEarnings = Math.round((localTotalEarnings + Number.EPSILON) * 100) / 100
            setTotalEarnings(localTotalEarnings);
        }
        else
            setTotalEarnings('');

        setIsTotalEarningsCardLoading(false);

    }, [totalListings])

    const setFilterYearAndMonth = (year, month) => {
        setFilterYear(year);
        setFilterMonth(month);
    }

    const handleFilterTrigger = async () => {

        await populateTotalReferralsCard();
        await populateTotalListingsCard();
        await populateDataTable();


    }

    const populateTotalReferralsCard = async () => {

        setIsTotalReferralsCardLoading(true);

        const storedData = JSON.parse(localStorage.getItem('userData'));

        let res;

        if (storedData) {
            try {
                res = await Axios.get('usercontext/referrals/count?month=' + filterMonth + '&year=' + filterYear, {
                    headers: {
                        'Authorization': 'Bearer ' + storedData.token
                    }
                });
            } catch (error) { }
        }

        if (res?.data?.referredUsersCount >= 0) {
            setTotalReferrals(res.data.referredUsersCount);
        } else {
            setTotalReferrals('');
        }

        setIsTotalReferralsCardLoading(false);
    }

    const populateTotalListingsCard = async () => {

        setIsTotalListingsCardLoading(true);

        const storedData = JSON.parse(localStorage.getItem('userData'));

        let res;

        if (storedData) {
            try {
                res = await Axios.get('usercontext/referrals/listings/countPerUser?month=' + filterMonth + '&year=' + filterYear, {
                    headers: {
                        'Authorization': 'Bearer ' + storedData.token
                    }
                });
            } catch (error) { }
        }

        if (res?.data?.length >= 0) {

            let total = res.data.reduce((acc, item) => acc + item.listingsCount, 0);
            setTotalListings(total);
        } else {
            setTotalListings('');
        }

        setIsTotalListingsCardLoading(false);
    }

    const populateDataTable = async () => {

        setIsDataTableLoading(true);

        const storedData = JSON.parse(localStorage.getItem('userData'));

        let res;

        if (storedData) {
            try {
                res = await Axios.get('usercontext/referrals/listings/countPerUser?month=' + filterMonth + '&year=' + filterYear, {
                    headers: {
                        'Authorization': 'Bearer ' + storedData.token
                    }
                });
            } catch (error) { }
        }

        if (res?.data?.length >= 0) {
            setListingData(res.data);
        } else {
            setListingData([]);
        }

        setIsDataTableLoading(false);
    }

    return (
        <div className="dashboard">
            <Grid>
                <GridRow>
                    <GridColumn width={10}>
                        <FilterBar setFilterYearAndMonth={setFilterYearAndMonth} handleFilterTrigger={handleFilterTrigger} />
                    </GridColumn>
                    <GridColumn width={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ReferralCodeComponent />
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn width={10}>
                        <AnalyticsCards 
                        totalReferrals={totalReferrals} 
                        totalListings={totalListings} 
                        totalEarnings={totalEarnings} 
                        isTotalReferralsCardLoading={isTotalReferralsCardLoading}
                        isTotalListingsCardLoading={isTotalListingsCardLoading}
                        isTotalEarningsCardLoading={isTotalEarningsCardLoading}
                        />
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn width={10}>
                        <DataTable listingData={listingData} isDataTableLoading={isDataTableLoading}/>
                    </GridColumn>
                </GridRow>
            </Grid>
        </div>
    );
}

export default DashboardPage;