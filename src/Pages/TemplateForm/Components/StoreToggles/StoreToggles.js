import { Component } from "react";
import "./StoreToggles.css";

class StoreToggles extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const {
      nanoid,
      data,
      others,
      toggleSelectedWebsite,
      toggleSelectedOthersWebsite
    } = this.props;

    return(
      <>
        <div className='store__buttons'>
          <button className={`${data["ebay"]["check"] ? "fill__button" : "outline__button"}`}
                  onClick={() => {toggleSelectedWebsite("ebay");}}
                  id="EbayToggleButton"
                  >Ebay</button>
          <button className={`${data["mercari"]["check"] ? "fill__button" : "outline__button"}`}
                  onClick={() => {toggleSelectedWebsite("mercari");}}
                  id="MercariToggleButton"
                  >Mercari</button>
        </div>
        <div className='store__buttons'>
          <button className={`${data["poshmark"]["check"] ? "fill__button" : "outline__button"}`}
                  onClick={() => {toggleSelectedWebsite("poshmark");}}
                  id="PoshmarkToggleButton"
                  >Poshmark</button>
          <button className='outline__button'>Other</button>
        </div>
        {data.others && data.others.length > 0 ?
        (data.others.map((other, index) => {return(
                  <>
                  <div className='store__buttons'>
                  <button 
                    className={`${other.status ? "fill__button" : "outline__button"}`}
                    onClick={() => {toggleSelectedOthersWebsite(index)}}
                    id={nanoid(3)}
                  >{other.name}</button>
                  </div>
                  </>
                  )})
        ) 
        : 
        (
        " "
        )}
        <div className='store__buttons'>
          <button className={`${data["delist"]["check"] ? "fill__button_red" : "outline__button_red"} w-100`}
                  onClick={() => {toggleSelectedWebsite("delist");}}
                  id="DelistToggleButton"
                  >Delist</button>
        </div>
      </>
      );
  }
}
export default StoreToggles;