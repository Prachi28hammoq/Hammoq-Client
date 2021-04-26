import React, { useState, useEffect } from "react";
import Axios from "axios";
import {Modal,Button} from "react-bootstrap";
import "./Onboardingmodal.css";
import BasicInformation from "./components/BasicInformation";
import Wizardbar from "./components/Wizardbar";
import Listingsettings from "./components/Listingsettings";
import Bestoffer from "./components/Bestoffer";
import Accountdetails from "./components/Accountdetails";

function Onboardingmodal() {

  const [numberOfDots, setNumberOfDots] = useState(4);
  const [selectedDot, setSelectedDot] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [howDidYouKnow, setHowDidYouKnow] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [listingCheckBox, setListingCheckBox] = useState(false);
  const [delistingCheckbox, setDelistingCheckbox] = useState(false);
  const [crosslistingCheckBox, setCrosslistingCheckBox] = useState(false);
  const [accountingCheckBox, setAccountingCheckBox] = useState(false);

  const [highSoldCheckBox, setHighSoldCheckBox] = useState(false);
  const [mediumSoldCheckBox, setMediumSoldCheckBox] = useState(false);
  const [otherSoldCheckBox, setOtherSoldCheckBox] = useState(false);
  const [otherSoldInputBox, setOtherSoldInputBox] = useState("");

  const [priceOptions, setPriceOptions] = useState("");

  const [chooseDollarPercentage, setChooseDollarPercentage] = useState("");
  const [increaseCompPrice, setIncreaseCompPrice] = useState("");
  const [companyBlob, setCompanyBlob] = useState("");

  const [enableBestOfferToggle, setEnableBestOfferToggle] = useState(false);
  const [
    automaticAcceptOffersCheckBox,
    setAutomaticAcceptOffersCheckBox,
  ] = useState(false);
  const [
    automaticAcceptOffersTextBox,
    setAutomaticAcceptOffersTextBox,
  ] = useState("");
  const [
    automaticDeclineOffersCheckBox,
    setAutomaticDeclineOffersCheckBox,
  ] = useState(false);
  const [
    automaticDeclineOffersTextBox,
    setAutomaticDeclineOffersTextBox,
  ] = useState("");

  const [ebayUser, setEbayUser] = useState("");
  const [ebayPass, setEbayPass] = useState("");
  const [mercariUser, setMercariUser] = useState("");
  const [mercariPass, setMercariPass] = useState("");
  const [poshUser, setPoshUser] = useState("");
  const [poshPass, setPoshPass] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [otherPass, setOtherPass] = useState("");

  useEffect(() => {
    Axios.get("/clientdetails")
      .then(({ data }) => {
        console.log(data,'data')
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setEmailAddress(data.email)
        setPhoneNumber(data.phoneno)
        setReferralCode(data.referralCode)

      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
      Axios.get("/clientdetails/listingSettings")
        .then(({ data }) => {
          console.log(data,'data2')
          setStoreName(data.storeName)
          setHowDidYouKnow(data.foundOutAboutUs)
          // let savedData = data.settings[0].listing[0];
        })
        .catch((err) => console.log(err) || alert(JSON.stringify(err)));

  },[]);



  // To enable/disable Wizardbar buttons
  const [modal0InValid, setModal0InValid] = useState(true);

  const [show, setShow] = useState(true);
  const [submit, setSubmit] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (submit == true) {
      let services = []
      if (listingCheckBox == true) { services.push("Listing"); }
      if (delistingCheckbox == true) { services.push("Delisting"); }
      if (crosslistingCheckBox == true) { services.push("Crosslisting"); }
      if (accountingCheckBox == true) { services.push("Accounting"); }
      // let servicesObj = Object.assign({}, services)
      console.log(services);

      var ListSettingsObj={
        services: services,
        priceOptions: priceOptions,
        incrCompPrice: {
          by: chooseDollarPercentage,
          value: increaseCompPrice,
        },
        companyBlurb: companyBlob,
        bestOffer: {
          enabled: enableBestOfferToggle,
          acceptOfferOf: automaticAcceptOffersTextBox,
          isOfferAccepted: automaticAcceptOffersCheckBox,
          declineOfferOf: automaticDeclineOffersTextBox,
          isOfferDeclined: automaticDeclineOffersCheckBox,
        },
      }
      var shippingSettingsObj={}
      var intlShippingObj={}
      var paymentProfObj={}
      var configObj = {
        listing: ListSettingsObj,
        shipping: shippingSettingsObj,
        intlShipping: intlShippingObj,
        payment: paymentProfObj,
        storeName: storeName,
        foundOutAboutUs: howDidYouKnow,
      };
      var basicObj = {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        phoneno: phoneNumber,
      };
      var finalObj = {
        basicSettings: basicObj,
        configSettings: configObj,
      };

      console.log(basicObj);
      Axios.post("/clientdetails/listingSettings", finalObj)
        .then((res) => {
          console.log(res.data);
          if(res.data === 'Old Settings Updated' || res.data === 'New Settings Created')
          {
            alert('Settings Saved Succesfully!');
          }
        })
        .catch((err) => console.log("Error: ", err));


    }
  }, [submit]);



  return (
    <>
      <div className='onboarding_modal'>
        <Modal size="lg"
          show={!submit}
          backdrop="static"
          keyboard={false}
        >
            <Modal.Header>
              <Modal.Title>Onboarding</Modal.Title>
            </Modal.Header>

            <Modal.Body>

              <div>
                {selectedDot == 0 ? (
                  <BasicInformation
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    emailAddress={emailAddress}
                    setEmailAddress={setEmailAddress}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    storeName={storeName}
                    setStoreName={setStoreName}
                    howDidYouKnow={howDidYouKnow}
                    setHowDidYouKnow={setHowDidYouKnow}
                    referralCode={referralCode}
                    setReferralCode={setReferralCode}
                    modal0InValid={modal0InValid}
                    setModal0InValid={setModal0InValid}


                  />
                ) : null}
                {selectedDot == 1 ? (
                  <Listingsettings
                    listingCheckBox={listingCheckBox}
                    setListingCheckBox={setListingCheckBox}
                    delistingCheckbox={delistingCheckbox}
                    setDelistingCheckbox={setDelistingCheckbox}
                    crosslistingCheckBox={crosslistingCheckBox}
                    setCrosslistingCheckBox={setCrosslistingCheckBox}
                    accountingCheckBox={accountingCheckBox}
                    setAccountingCheckBox={setAccountingCheckBox}
                    highSoldCheckBox={highSoldCheckBox}
                    setHighSoldCheckBox={setHighSoldCheckBox}
                    mediumSoldCheckBox={mediumSoldCheckBox}
                    setMediumSoldCheckBox={setMediumSoldCheckBox}
                    otherSoldCheckBox={otherSoldCheckBox}
                    setOtherSoldCheckBox={setOtherSoldCheckBox}
                    otherSoldInputBox={otherSoldInputBox}
                    setOtherSoldInputBox={setOtherSoldInputBox}
                    companyBlob={companyBlob}
                    setCompanyBlob={setCompanyBlob}
                    chooseDollarPercentage={chooseDollarPercentage}
                    setChooseDollarPercentage={setChooseDollarPercentage}
                    increaseCompPrice={increaseCompPrice}
                    setIncreaseCompPrice={setIncreaseCompPrice}
                    modal0InValid={modal0InValid}
                    setModal0InValid={setModal0InValid}
                    priceOptions={priceOptions}
                    setPriceOptions={setPriceOptions}
                  />
                ) : null}
                {selectedDot == 2 ? (
                  <Bestoffer
                    enableBestOfferToggle={enableBestOfferToggle}
                    setEnableBestOfferToggle={setEnableBestOfferToggle}
                    automaticAcceptOffersCheckBox={automaticAcceptOffersCheckBox}
                    setAutomaticAcceptOffersCheckBox={
                      setAutomaticAcceptOffersCheckBox
                    }
                    automaticAcceptOffersTextBox={automaticAcceptOffersTextBox}
                    setAutomaticAcceptOffersTextBox={setAutomaticAcceptOffersTextBox}
                    automaticDeclineOffersCheckBox={automaticDeclineOffersCheckBox}
                    setAutomaticDeclineOffersCheckBox={
                      setAutomaticDeclineOffersCheckBox
                    }
                    automaticDeclineOffersTextBox={automaticDeclineOffersTextBox}
                    setAutomaticDeclineOffersTextBox={
                      setAutomaticDeclineOffersTextBox
                    }
                    modal0InValid={modal0InValid}
                    setModal0InValid={setModal0InValid}
                  />
                ) : null}
                {selectedDot == 3 ? (
                  <Accountdetails
                    ebayUser={ebayUser}
                    setEbayUser={setEbayUser}
                    ebayPass={ebayPass}
                    setEbayPass={setEbayPass}
                    mercariUser={mercariUser}
                    setMercariUser={setMercariUser}
                    mercariPass={mercariPass}
                    setMercariPass={setMercariPass}
                    poshUser={poshUser}
                    setPoshUser={setPoshUser}
                    poshPass={poshPass}
                    setPoshPass={setPoshPass}
                    otherUser={otherUser}
                    setOtherUser={setOtherUser}
                    otherPass={otherPass}
                    setOtherPass={setOtherPass}
                    modal0InValid={modal0InValid}
                    setModal0InValid={setModal0InValid}
                  />
                ) : null}
              </div>
              <Wizardbar
                numberOfDots={numberOfDots}
                selectedDot={selectedDot}
                setSelectedDot={setSelectedDot}
                modal0InValid={modal0InValid}
                setModal0InValid={setModal0InValid}
                submit={submit}
                setSubmit={setSubmit}
              />


            </Modal.Body>

            {/*<Modal.Footer>
              <Button variant="secondary">Close</Button>
              <Button variant="primary">Save changes</Button>
            </Modal.Footer>*/}
        </Modal>
</div>

    </>
  );
}

export default Onboardingmodal;
