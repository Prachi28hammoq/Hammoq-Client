import React from 'react';
import './AnalyticsCards.css';
import TotalReferralsCard from './totalreferralscard/TotalReferralsCard.js';
import TotalListingsCard from './totallistingscard/TotalListingsCard.js';
import TotalEarningsCard from './totalearningscard/TotalEarningsCard.js';

const AnalyticsCards = (props) => {

    return (
        <div className="analytics-cards">
            <TotalReferralsCard totalReferrals={props.totalReferrals} isTotalReferralsCardLoading={props.isTotalReferralsCardLoading} />
            <TotalListingsCard totalListings={props.totalListings} isTotalListingsCardLoading={props.isTotalListingsCardLoading} />
            <TotalEarningsCard totalEarnings={props.totalEarnings} isTotalEarningsCardLoading={props.isTotalEarningsCardLoading} />
        </div>
    )
}

export default AnalyticsCards;
