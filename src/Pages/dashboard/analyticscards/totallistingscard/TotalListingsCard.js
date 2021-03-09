import './TotalListingsCard.css';
import { Loader } from 'semantic-ui-react';

const TotalListingsCard = (props) => {

    return(
        <div className="total-listings-card">
            <div className="total-listings-label">Total Listings</div>
            <div className="total-listings-content">
                {props.isTotalListingsCardLoading? <Loader active inline='centered' /> : props.totalListings}
            </div>            
        </div>
    )
}

export default TotalListingsCard;