import React, {useState, useEffect} from "react";
import Axios from "axios";
import {Modal,Button} from "react-bootstrap";
import "./BasicInformation.css";

const BasicInformation = (props) => {

  useEffect(() => {
    if((props.firstName && props.lastName && props.emailAddress && props.phoneNumber && props.storeName) != "") {
      props.setModal0InValid(false)
    }
    else {
      props.setModal0InValid(true)
    }
  },[props.firstName, props.lastName, props.emailAddress, props.phoneNumber, props.storeName])

  return (
    <div className='basic_info'>

      <div className='basic_info_header'>Basic Information</div>
      <div className='basic_info_form'>
        <div className='basic_info_form_left'>
          <div className='basic_info_form_field'>
            {/* /---------------1-------------- */}
            <div style={{ display: "inline-flex", flexFlow: "column" }}>
              <div style={{ display: "inline-flex", marginBottom: "5px" }}>
                First Name*
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  defaultValue={props.firstName}
                  readOnly={true}
                  onChange={(event) => props.setFirstName(event.target.value)}
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>

          <div className='basic_info_form_field'>
            {/* /---------------2-------------- */}
            <div style={{ display: "inline-flex", flexFlow: "column" }}>
              <div style={{ display: "inline-flex", marginBottom: "5px" }}>
                Last Name*
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  value={props.lastName}
                  readOnly={true}
                  onChange={(event) => props.setLastName(event.target.value)}
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>

          <div className='basic_info_form_field'>
            {/* /---------------3-------------- */}
            <div style={{ display: "inline-flex", flexFlow: "column" }}>
              <div style={{ display: "inline-flex", marginBottom: "5px" }}>
                Email Address*
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  value={props.emailAddress}
                  readOnly={true}
                  onChange={(event) =>
                    props.setEmailAddress(event.target.value)
                  }
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>

          <div className='basic_info_form_field'>
            {/* /---------------4-------------- */}
            <div
              style={{
                display: "inline-flex",
                flexFlow: "column",
              }}
            >
              <div style={{ display: "inline-flex", marginBottom: "5px" }}>
                Phone Number*
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  value={props.phoneNumber}
                  onChange={(event) => props.setPhoneNumber(event.target.value)}
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>
        </div>
        <div className='basic_info_form_middle'></div>
        <div className='basic_info_form_right'>
          <div className='basic_info_form_field'>
            {/* /---------------1-------------- */}
            <div style={{ display: "inline-flex", flexFlow: "column" }}>
              <div
                style={{
                  display: "inline-flex",
                  marginBottom: "5px",
                }}
              >
                Store Name/Link*
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  value={props.storeName || ''}
                  onChange={(event) => props.setStoreName(event.target.value)}
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>

          <div className='basic_info_form_field'>
            {/* /---------------2-------------- */}
            <div style={{ display: "inline-flex", flexFlow: "column" }}>
              <div style={{ display: "inline-flex", marginBottom: "5px" }}>
                How did you find us?
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  placeholder='(optional)'
                  value={props.howDidYouKnow || ''}
                  onChange={(event) =>
                    props.setHowDidYouKnow(event.target.value)
                  }
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>

          <div className='basic_info_form_field'>
            {/* /---------------3-------------- */}
            <div style={{ display: "inline-flex", flexFlow: "column" }}>
              <div style={{ display: "inline-flex", marginBottom: "5px" }}>
                Referral Code
              </div>
              <div>
                <input
                  type='text'
                  className='input_field'
                  placeholder='(optional)'
                  value={props.referralCode}
                  onChange={(event) =>
                    props.setReferralCode(event.target.value)
                  }
                ></input>
              </div>
            </div>

            {/* /----------------------------- */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BasicInformation;
