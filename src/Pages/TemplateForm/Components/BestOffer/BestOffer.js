import { Component } from "react";
import "./BestOffer.css";

class BestOffer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
   }

  render = () => {
    const {data, 
          handleChange, 
          handleCheckboxToggle,
          handleZeroFix
    } = this.props;

    return(
          <div className='best_offer'>
            <div className='dom__header2'>
              <div className='int_ship2'> Best Offer</div>
              <div className='dom__body2'>
              <div className='option_div'>
              <input
                type='checkbox'
                name='bestOfferActive'
                checked={data.bestOfferActive || false}
                onChange={(e) => {handleCheckboxToggle(e.target.checked, 'bestOfferActive')}}
              >
              </input>{" "}
              <label>Best Offer Enabled?</label>{" "}
              </div>
                <div className='option_div'>
                  <input 
                  type='checkbox'
                  name='bestOfferAcceptFloorActive'
                  disabled={!data.bestOfferActive}
                  checked={data.bestOfferAcceptFloorActive || false}
                  onChange={(e) => {handleCheckboxToggle(e.target.checked, 'bestOfferAcceptFloorActive')}}
                  ></input>{" "}
                  <label>Automatically accept offers of atleast</label>{" "}
                  <input 
                  className='inputbox1'
                  name='bestOfferAcceptFloorValue'
                  disabled={!data.bestOfferActive || !data.bestOfferAcceptFloorActive}
                  value={handleZeroFix('bestOfferAcceptFloorValue')}
                  onChange={handleChange}
                  ></input>$
                </div>
                <div className='option_div'>
                  <input 
                  type='checkbox'
                  name='bestOfferDeclineCeilingActive'
                  disabled={!data.bestOfferActive}
                  checked={data.bestOfferDeclineCeilingActive || false}
                  onChange={(e) => {handleCheckboxToggle(e.target.checked, 'bestOfferDeclineCeilingActive')}}
                  ></input>{" "}
                  <label>Automatically decline offers lower than</label>{" "}
                  <input 
                  className='inputbox'
                  name='bestOfferDeclineCeilingValue'
                  disabled={!data.bestOfferActive || !data.bestOfferDeclineCeilingActive}
                  value={handleZeroFix('bestOfferDeclineCeilingValue')}
                  onChange={handleChange}
                  ></input>$
                </div>
              </div>
            </div>
          </div>
        );
  };
}

export default BestOffer;