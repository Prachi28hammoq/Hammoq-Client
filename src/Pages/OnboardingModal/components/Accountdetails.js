import React, {useState, useEffect} from "react";
import "./Accountdetails.css";

const Accountdetails = (props) => {

  useEffect(() => {
  if((props.ebayUser && props.ebayPass) != "") {
      props.setModal0InValid(false)
    }
    else {
      props.setModal0InValid(true)
    }
  },[props.ebayUser, props.ebayPass])

  return (
    <div className='account_details'>
      <div className='account_details_header'>Account Details</div>
      <div className='account_details_form'>
        <div className='account_details_form_left'>
          <div>
            <div>Ebay*</div>
            <div
              style={{
                // border: "1px solid red",
                // display: "flex",
                // // flexFlow: "flex-start",
                marginTop: "10px",
              }}
            >
              <input
                type='text'
                placeholder='Username'
                value={props.ebayUser}
                onChange={(event) => props.setEbayUser(event.target.value)}
              />
            </div>
            <div
              style={{
                // border: "1px solid red",
                marginTop: "5px",
              }}
            >
              <input
                type='password'
                placeholder='Password'
                value={props.ebayPass}
                onChange={(event) => props.setEbayPass(event.target.value)}
              />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div>Mercari (optional)</div>
            <div
              style={{
                // border: "1px solid red",
                // display: "flex",
                // flexFlow: "flex-start",
                marginTop: "10px",
              }}
            >
              <input
                type='text'
                placeholder='Username'
                value={props.mercariUser}
                onChange={(event) => props.setMercariUser(event.target.value)}
              />
            </div>
            <div
              style={{
                // border: "1px solid red",
                marginTop: "5px",
              }}
            >
              <input
                type='password'
                placeholder='Password'
                value={props.mercariPass}
                onChange={(event) => props.setMercariPass(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='account_details_form_right'>
          <div>
            <div>Poshmark (optional)</div>
            <div
              style={{
                // border: "1px solid red",
                // display: "flex",
                // flexFlow: "flex-start",
                marginTop: "10px",
              }}
            >
              <input
                type='text'
                placeholder='Username'
                value={props.poshUser}
                onChange={(event) => props.setPoshUser(event.target.value)}
              />
            </div>
            <div
              style={{
                // border: "1px solid red",
                marginTop: "5px",
              }}
            >
              <input
                type='password'
                placeholder='Password'
                value={props.poshPass}
                onChange={(event) => props.setPoshPass(event.target.value)}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Accountdetails;
