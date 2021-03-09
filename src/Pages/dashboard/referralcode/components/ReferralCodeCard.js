import React, { useState } from 'react';
import './ReferralCodeCard.css';

const ReferralCodeCard = (props) => {
    
    return(
        <div className="referral-code-card">
            <div className="referral-code-card-label"> Your Referral Code </div>
            {props.referralCode.length > 0 ? 
            <div className="referral-code-card-value">{props.referralCode}</div>
            : <div className="referral-code-card-empty-value">Empty</div>}
        </div>
    );
}

export default ReferralCodeCard;