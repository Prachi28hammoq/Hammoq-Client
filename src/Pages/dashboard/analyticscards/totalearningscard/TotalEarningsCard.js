import './TotalEarningsCard.css';
import { Loader } from 'semantic-ui-react';

const TotalEarningsCard = (props) => {

    return(
        <div className="total-earnings-card">
            <div className="total-earnings-label">Total Earnings</div>
            <div className="total-earnings-content">
                {props.isTotalEarningsCardLoading?  <Loader active inline='centered' />: 
                typeof props.totalEarnings != 'string' && props.totalEarnings >= 0 ? '$ ' + props.totalEarnings : null}
            </div>            
        </div>
    )
}

export default TotalEarningsCard;