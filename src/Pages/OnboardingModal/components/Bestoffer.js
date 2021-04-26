import React, { useState } from "react";
import "./Bestoffer.css";

const Bestoffer = (props) => {

  if(props.enableBestOfferToggle == false) {
    props.setModal0InValid(false)
  }
  else if ((props.automaticAcceptOffersCheckBox || props.automaticDeclineOffersCheckBox)==true){
    props.setModal0InValid(false)
  }
  else {
    props.setModal0InValid(true)
  }

  return (
    <div className='Best_offer'>
      <div className='Best_offer_header'>Best Offer</div>
      <div className='Best_offer_form'>
        <div style={{ fontWeight: "500" }}>
          Enable best offer{" "}
          <label class='switch'>
            <input
              type='checkbox'
              checked={props.enableBestOfferToggle}
              onClick={(event) =>
                props.setEnableBestOfferToggle(
                  (enableBestOfferToggle) => !enableBestOfferToggle
                )
              }
            />
            <span class='slider round'></span>
          </label>
        </div>
        {props.enableBestOfferToggle ? (
          <div style={{ marginTop: "20px" }}>
            <input
              type='checkbox'
              checked={props.automaticAcceptOffersCheckBox}
              onClick={(event) =>
                props.setAutomaticAcceptOffersCheckBox(
                  (automaticAcceptOffersCheckBox) =>
                    !automaticAcceptOffersCheckBox
                )
              }
            />
            <label style={{ marginLeft: "5px" }}>
              Automatically accept offers of atleast
            </label>
            <input
              type='test'
              style={{ width: "30px", marginLeft: "5px" }}
              value={props.automaticAcceptOffersTextBox}
              onChange={(event) =>
                props.setAutomaticAcceptOffersTextBox(event.target.value)
              }
            ></input>{" "}
            %
          </div>
        ) : null}
        {props.enableBestOfferToggle ? (
          <div style={{ marginTop: "20px" }}>
            <input
              type='checkbox'
              checked={props.automaticDeclineOffersCheckBox}
              onClick={(event) =>
                props.setAutomaticDeclineOffersCheckBox(
                  (automaticDeclineOffersCheckBox) =>
                    !automaticDeclineOffersCheckBox
                )
              }
            />
            <label style={{ marginLeft: "5px" }}>
              Automatically decline offers lower than
            </label>
            <input
              type='test'
              style={{ width: "30px", marginLeft: "5px" }}
              value={props.automaticDeclineOffersTextBox}
              onChange={(event) =>
                props.setAutomaticDeclineOffersTextBox(event.target.value)
              }
            ></input>{" "}
            %
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Bestoffer;
