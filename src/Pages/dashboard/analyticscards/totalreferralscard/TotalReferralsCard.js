import './TotalReferralsCard.css';
import { Loader } from 'semantic-ui-react';

const TotalReferralsCard = (props) => {

    return (
        <div className="total-referrals-card">
            <div className="total-referrals-label">Total Referrals</div>
            <div className="total-referrals-content">
                {props.isTotalReferralsCardLoading ? <Loader active inline='centered' /> : props.totalReferrals}
            </div>
        </div>
    )
}

export default TotalReferralsCard;