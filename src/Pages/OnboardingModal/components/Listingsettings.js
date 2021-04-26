import React from "react";
import "./Listingsettings.css";

const Listingsettings = (props) => {

  if(((props.listingCheckBox || props.delistingCheckbox || props.crosslistingCheckBox || props.accountingCheckBox) == true)
    && (props.priceOptions != "") && ((props.increaseCompPrice &&
      props.companyBlob) != ""))
  {
    props.setModal0InValid(false)
  }
  else {
    props.setModal0InValid(true)
  }

  return (
    <div className='listing_settings'>
      <div className='listing_settings_header'>Listing Settings</div>
      <div className='listing_settings_form'>
        <div className='listing_settings_form_left'>
          <div className='listingsettings_question_one'>
            <div
              style={{
                // border: "1px solid red",
                display: "flex",
                flexFlow: "flex-start",
                fontWeight: "500",
                fontSize: "small",
              }}
            >
              Choose one or more services*
            </div>
            <div
              style={{
                // border: "1px solid red",
                display: "flex",
                justifyContent: "space-between",
                maxWidth: "50%",
              }}
            >
              <div
                style={
                  {
                    //   border: "1px solid red",
                  }
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexFlow: "flex-start",
                    fontSize: "small",
                  }}
                >
                  <input
                    type='checkbox'
                    style={{ verticalAlign: "middle" }}
                    checked={props.listingCheckBox}
                    onChange={(event) =>
                      props.setListingCheckBox(
                        (listingCheckBox) => !listingCheckBox
                      )
                    }
                  />
                  <label style={{ marginLeft: "4px", verticalAlign: "middle" }}>
                    Listing
                  </label>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexFlow: "flex-start",
                    fontSize: "small",
                  }}
                >
                  <input
                    type='checkbox'
                    checked={props.crosslistingCheckBox}
                    onChange={(event) =>
                      props.setCrosslistingCheckBox(
                        (crosslistingCheckBox) => !crosslistingCheckBox
                      )
                    }
                  />
                  <label style={{ marginLeft: "4px", verticalAlign: "middle" }} >Crosslisting</label>
                </div>
              </div>
              <div
                style={
                  {
                    //   border: "1px solid yellow",
                  }
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexFlow: "flex-start",
                    fontSize: "small",
                  }}
                >
                  <input
                    type='checkbox'
                    checked={props.delistingCheckbox}
                    onChange={(event) =>
                      props.setDelistingCheckbox(
                        (delistingCheckbox) => !delistingCheckbox
                      )
                    }
                  />
                  <label style={{ marginLeft: "4px", verticalAlign: "middle" }} >Delisting</label>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexFlow: "flex-start",
                    fontSize: "small",
                  }}
                >
                  <input
                    type='checkbox'
                    checked={props.accountingCheckBox}
                    onChange={(event) =>
                      props.setAccountingCheckBox(
                        (accountingCheckBox) => !accountingCheckBox
                      )
                    }
                  />
                  <label style={{ marginLeft: "4px", verticalAlign: "middle" }} >Accounting</label>
                </div>
              </div>
            </div>
          </div>
          <div className='listingsettings_question_two'>
            <div
              style={{
                display: "flex",
                flexFlow: "flex-start",
                fontWeight: "500",
                fontSize: "small",
              }}
            >
              Choose how you would like us to price*
            </div>
            <div onChange={(event)=> props.setPriceOptions(event)}>
            <div
              style={{
                display: "flex",
                flexFlow: "flex-start",
                fontSize: "small",
              }}
            >
              <input
                type='radio'
                name='priceOptions'
                value="High"
              />
            <label style={{ marginLeft: "4px", verticalAlign: "middle" }} >High sold comp (Longer Hold)</label>
            </div>
            <div
              style={{
                display: "flex",
                flexFlow: "flex-start",
                fontSize: "small",
              }}
            >
              <input
                type='radio'
                name='priceOptions'
                value="Mid"

              />
            <label style={{ marginLeft: "4px", verticalAlign: "middle" }} >Medium sold comp (mid hold)</label>
            </div>
            <div
              style={{
                display: "flex",
                flexFlow: "flex-start",
                fontSize: "small",
              }}
            >
              <input
                type='radio'
                name='priceOptions'
                value="other"

              />
            <label style={{ marginLeft: "4px", marginRight:"4px", verticalAlign: "middle" }}>Other</label>
              <input
                type='text'
                style={{ border: "1px solid grey", borderRadius: "4px" }}
                value={props.otherSoldInputBox}
                onChange={(event) =>
                  props.setOtherSoldInputBox(event.target.value)
                }
              ></input>
            </div>
          </div>
        </div>
        </div>
        <div className='listing_settings_form_right'>
          <div
            style={{
              //   border: "1px solid blue",
              height: "49%",
              display: "flex",
              flexFlow: "flex-start",
            }}
          >
            <div
              style={{
                // border: "1px solid red",

                display: "flex",
                flexFlow: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  // border: "1px solid red",
                  display: "flex",
                  flexFlow: "flex-start",
                  fontWeight: "500",
                  fontSize: "small",
                }}
              >
                Increase comp price by*
              </div>
              <div>
                <select
                  value={props.chooseDollarPercentage}
                  onChange={(event) =>
                    props.setChooseDollarPercentage(event.target.value)
                  }
                >
                  <option value='$'>$</option>
                  <option value='%'>%</option>
                </select>
              </div>
              <div>
                <input
                  type='text'
                  style={{
                    width: "60px",
                  }}
                  value={props.increaseCompPrice}
                  onChange={(event) =>
                    props.setIncreaseCompPrice(event.target.value)
                  }
                ></input>
              </div>
            </div>
          </div>
          <div
            style={{
              //   border: "1px solid blue",
              height: "49%",
              display: "flex",
              flexFlow: "flex-start",
              fontSize: "small",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                // border: "1px solid red",
                display: "flex",
                flexFlow: "flex-start",
                fontWeight: "500",
                fontSize: "small",
              }}
            >
              Bottom of Description (Company Blob)*
            </div>
            <div
              style={{
                // border: "1px solid red",
                display: "flex",
                flexFlow: "flex-start",
                width: "100%",
                height: "100%",
              }}
            >
              <input
                type='textbox'
                style={{
                  // border: "1px solid red",
                  display: "flex",
                  flexFlow: "flex-start",
                  width: "95%",
                  height: "90%",
                  fontSize: "small",
                  border: "1px solid grey",
                  borderRadius: "4px",
                  marginTop: "5px",
                }}
                value={props.companyBlob}
                onChange={(event) => props.setCompanyBlob(event.target.value)}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listingsettings;
