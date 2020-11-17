import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Axios from "../../services/Axios";
import "./ListingSettings.css";

const ListingSettings = () => {
  // Listing settings
  const [services, setServices] = useState(["Listing"]);
  const [priceOptions, setPriceOptions] = useState("");
  const [otherPriceOptions, setOtherPriceOptions] = useState("");
  const [incrCompPrice, setIncrCompPrice] = useState("");
  const [companyBlob, setCompanyBlob] = useState("");
  const [bestOffer, setBestOffer] = useState(true);
  const [isOfferAccept, setIsOfferAccept] = useState(false);
  const [offerAccept, setOfferAccept] = useState("");
  const [isOfferDecline, setIsOfferDecline] = useState(false);
  const [offerDecline, setOfferDecline] = useState("");
  const [ebaySmartPricing, setEbaySmartPricing] = useState(false);
  const [mercariSmartPricing, setMercariSmartPricing] = useState(false);
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [location, setLocation] = useState("");
  const [mercariTags, setMercariTags] = useState([]);

  // Shipping and Return settings
  const [shipping, setShipping] = useState([]);
  const [flatShipRules, setFlatShipRules] = useState(false);
  const [itemType1, setItemType1] = useState("");
  const [itemType2, setItemType2] = useState("");
  const [itemPrice1, setItemPrice1] = useState("");
  const [itemPrice2, setItemPrice2] = useState("");
  const [itemShipServ1, setItemShipServ1] = useState("");
  const [itemShipServ2, setItemShipServ2] = useState("");
  const [isReturnAccept, setIsReturnAccept] = useState(false);
  const [returnedWithin, setReturnedWithin] = useState("");
  const [refundAs, setRefundAs] = useState("");
  const [returnShipBy, setReturnShipBy] = useState("");

  // International Shipping settings
  const [incrByDomestic, setIncrByDomestic] = useState("");
  const [shipService, setShipService] = useState("");
  const [intlReturnAccepted, setIntlReturnAccepted] = useState(false);
  const [intlReturnedWithin, setIntlReturnedWithin] = useState("");
  const [intlRefundAs, setIntlRefundAs] = useState("");
  const [intlReturnShipBy, setIntlReturnShipBy] = useState("");
  const [useEbayGlobal, setUseEbayGlobal] = useState(false);
  const [handlingTime, setHandlingTime] = useState("");
  const [cost, setCost] = useState("");
  const [worldwideShip, setWorldwideShip] = useState(false);
  const [shipCountries, setShipCountries] = useState([]);
  const [allowPaypal, setAllowPaypal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [taxes, setTaxes] = useState("");
  const [paymentInstr, setPaymentInstr] = useState("");
  const [buyerReqs, setBuyerReqs] = useState("");

  //Basic Settings -> Signup Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]= useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [findUs, setFindUs] = useState("");

  //Client ID
  //const [clientID, setClientID] = useState("");

  useEffect(() => {
    Axios.get("/clientDetails")
      .then((res) => {
        let savedData = res.data;

        setFirstName(savedData.firstName);
        setLastName(savedData.lastName);
        setEmailAddress(savedData.email);
        setPhoneNum(savedData.phoneno);
        setStoreLink(savedData.storeName);
        setFindUs(savedData.findOutAboutUs);

        //console.log("Client's saved data: ", res.data.configSettings[0]);
        savedData = res.data.configSettings[0].listing[0];
        //console.log("listing data: ", savedData);
        var compPriceSign = "" 
        if(savedData.incrCompPrice[0].by !== undefined && savedData.incrCompPrice[0].by === 'percent')
        {
          compPriceSign = "%"
        }
        else if(savedData.incrCompPrice[0].by !== undefined && savedData.incrCompPrice[0].by === 'dollar')
        {
          compPriceSign = "$"
        }
        setServices(savedData.services);
        setPriceOptions(savedData.priceOptions);
        setOtherPriceOptions(savedData.otherPriceOptions);
        setIncrCompPrice(savedData.incrCompPrice[0].value + compPriceSign);
        setCompanyBlob(savedData.companyBlob);
        setBestOffer(savedData.bestOffer[0].enabled);
        setOfferAccept(savedData.bestOffer[0].acceptOfferOf);
        setIsOfferAccept(savedData.bestOffer[0].isOfferAccepted);
        setOfferDecline(savedData.bestOffer[0].declineOfferOf);
        setIsOfferDecline(savedData.bestOffer[0].isOfferDeclined);
        setEbaySmartPricing(savedData.ebay_smart);
        setMercariSmartPricing(savedData.mercari_smart);
        setCountry(savedData.country);
        setZipCode(savedData.zipCode);
        setLocation(savedData.location);
        setMercariTags(savedData.mercariTags);
        setBuyerReqs(savedData.buyerReqs);

        savedData = res.data.configSettings[0].shipping[0];
        //console.log("shipping data: ", savedData);
        setShipping(savedData.shippingType);
        setFlatShipRules(savedData.flatShippingRules[0].enabled);
        setItemType1(savedData.flatShippingRules[0].rule1[0].itemType);
        setItemType2(savedData.flatShippingRules[0].rule2[0].itemType);
        setItemPrice1(savedData.flatShippingRules[0].rule1[0].itemPrice);
        setItemPrice2(savedData.flatShippingRules[0].rule2[0].itemPrice);
        setItemShipServ1(savedData.flatShippingRules[0].rule1[0].itemShipServ);
        setItemShipServ2(savedData.flatShippingRules[0].rule2[0].itemShipServ);
        setIsReturnAccept(savedData.returns[0].accepted);
        setReturnedWithin(savedData.returns[0].returnWithin);
        setRefundAs(savedData.returns[0].refundGivenAs);
        setReturnShipBy(savedData.returns[0].ReturnShipPaidBy);

        savedData = res.data.configSettings[0].intlShipping[0];
        //console.log("intlShipping data: ", savedData);
        setIncrByDomestic(savedData.incrFromDomestic);
        setShipService(savedData.shippingService);
        setIntlReturnAccepted(savedData.returns[0].accepted);
        setIntlReturnedWithin(savedData.returns[0].returnWithin);
        setIntlRefundAs(savedData.returns[0].refundGivenAs);
        setIntlReturnShipBy(savedData.returns[0].ReturnShipPaidBy);
        setUseEbayGlobal(savedData.globalShipping[0].ebayGlobalShipEnabled);
        setHandlingTime(savedData.globalShipping[0].handlingTime);
        setCost(savedData.globalShipping[0].cost);
        setWorldwideShip(savedData.globalShipping[0].isWorldwide);
        setShipCountries(savedData.globalShipping[0].shipCountries);

        savedData = res.data.configSettings[0].payment[0];
        //console.log("payment data: ", savedData);
        setAllowPaypal(savedData.allowPaypal);
        setPaypalEmail(savedData.paypalEmail);
        setTaxes(savedData.taxes);
        setPaymentInstr(savedData.paymentInstr);

      })
      .catch((err) => console.log("error fetching client: ", err));
  }, []);

  const handleSubmit = () => {
    let priceOpt = priceOptions;
    if (otherPriceOptions.toLowerCase() === "i'll price") {
      priceOpt = null;
    }

    let sign = "dollar";
    let compPriceVal = incrCompPrice;
    if(incrCompPrice !== undefined || "")
    {
      if (incrCompPrice[0] === "$") {
        sign = "dollar";
        compPriceVal = incrCompPrice.slice(1);
      } else if (incrCompPrice[incrCompPrice.length - 1] === "%") {
        sign = "percent";
        compPriceVal = incrCompPrice.slice(0, -1);
      }
    }

    let mercari_tags = mercariTags.map((e) => e.trim());
    var ListSettingsObj = {
      services: services,
      priceOptions: priceOpt,
      otherPriceOptions: otherPriceOptions,
      incrCompPrice: {
        by: sign,
        value: compPriceVal,
      },
      buyerReqs: buyerReqs,
      companyBlob: companyBlob,
      bestOffer: {
        enabled: bestOffer,
        acceptOfferOf: offerAccept,
        isOfferAccepted: isOfferAccept,
        declineOfferOf: offerDecline,
        isOfferDeclined: isOfferDecline,
      },
      ebay_smart: ebaySmartPricing,
      mercari_smart: mercariSmartPricing,
      country: country,
      zipCode: zipCode,
      location: location,
      mercariTags: mercari_tags,
    };

    var shippingSettingsObj = {
      shippingType: shipping,
      flatShippingRules: {
        enabled: flatShipRules,
        rule1: {
          itemType: itemType1,
          itemPrice: itemPrice1,
          itemShipServ: itemShipServ1,
        },
        rule2: {
          itemType: itemType2,
          itemPrice: itemPrice2,
          itemShipServ: itemShipServ2,
        },
      },
      returns: {
        accepted: isReturnAccept,
        returnWithin: returnedWithin,
        refundGivenAs: refundAs,
        ReturnShipPaidBy: returnShipBy,
      },
    };

    var intlShippingObj = {
      incrFromDomestic: incrByDomestic,
      shippingService: shipService,
      returns: {
        accepted: intlReturnAccepted,
        returnWithin: intlReturnedWithin,
        refundGivenAs: intlRefundAs,
        ReturnShipPaidBy: intlReturnShipBy,
      },
      globalShipping: {
        ebayGlobalShipEnabled: useEbayGlobal,
        handlingTime: handlingTime,
        cost: cost,
        isWorldwide: worldwideShip,
        shipCountries: shipCountries,
      },
    };

    var paymentProfObj = {
      allowPaypal: allowPaypal,
      paypalEmail: paypalEmail,
      taxes: taxes,
      paymentInstr: paymentInstr,
    };

    var configObj = {
      listing: ListSettingsObj,
      shipping: shippingSettingsObj,
      intlShipping: intlShippingObj,
      payment: paymentProfObj,
    };

    var basicObj = {
      firstName: firstName,
      lastName: lastName,
      email: emailAddress,
      phoneno: phoneNum,
      storeName: storeLink,
      findOutAboutUs: findUs,
    };

    var finalObj = {
      basicSettings: basicObj,
      configSettings: configObj,
    };

    //var _id = clientID;

    //console.log("Client ID: " + clientID);
    //console.log("Posted Object: " + finalObj);

    Axios.post("/clientDetails/listingSettings", finalObj)
      .then((res) => {
        //console.log("Posted: ", res);
      })
      .catch((err) => console.log("Error: ", err));
  };

  return (
    <div className='main'>
      <div className='body'>
      <div className='bold'>Basic Info</div>
            <div className='group__one'>
              <TextField
                style={{ margin: "10px" }}
                id='firstNameInput'
                label='First Name'
                type='search'
                variant='outlined'
                value={firstName}
                onChange={(event) => this.handleChangeText('firstName', event)}
              />
              <TextField
                style={{ margin: "10px" }}
                id='lastNameInput'
                label='Last name'
                type='search'
                variant='outlined'
                value={lastName}
                onChange={(event) => this.handleChangeText('lastName', event)}
              />
              <TextField
                style={{ margin: "10px" }}
                id='emailAddressInput'
                label='Email Address'
                type='search'
                variant='outlined'
                value={emailAddress}
                onChange={(event) => this.handleChangeText('emailAddress', event)}
              />
              <TextField
                style={{ margin: "10px" }}
                id='phoneNumInput'
                label='Phone Number'
                type='search'
                variant='outlined'
                value={phoneNum}
                onChange={(event) => this.handleChangeText('phoneNum', event)}
              />
            </div>
            <div className='group__two'>
              <TextField
                className='group__two_one'
                id='storeLinkInput'
                label='Store Name / Store Link'
                type='search'
                variant='outlined'
                value={storeLink}
                onChange={(event) => this.handleChangeText('storeLink', event)}
              />
              <TextField
                className='group__two_two'
                id='findUsInput'
                label='How did you find about us?'
                type='search'
                variant='outlined'
                value={findUs}
                onChange={(event) => this.handleChangeText('findUs', event)}
              />
            </div>
        <div className='col_one_scroll'>
          <div className='bold'>Listing Settings</div>
          <div className='body__one__q1'>
            <label>What service do you want? (Can always change)</label>
            <label>
              <input
                type='checkbox'
                name='service'
                value='Listing'
                checked={services.find((i) => i === "Listing")}
                onChange={(e) => {
                  let list = services;
                  if (e.target.checked) {
                    list.push(e.target.value);
                    setServices(list);
                    //console.log("services: ", list);
                  } else {
                    let newList = list.filter((i) => i !== e.target.value);
                    setServices(newList);
                    //console.log("services: ", newList);
                  }
                }}
              ></input>{" "}
              Listing
            </label>
            <label>
              <input
                type='checkbox'
                name='service'
                value='Crosslisting'
                checked={services.find((i) => i === "Crosslisting")}
                onChange={(e) => {
                  let list = services;
                  if (e.target.checked) {
                    list.push(e.target.value);
                    setServices(list);
                    //console.log("services: ", list);
                  } else {
                    let newList = list.filter((i) => i !== e.target.value);
                    setServices(newList);
                    //console.log("services: ", newList);
                  }
                }}
              ></input>{" "}
              Crosslisting
            </label>
            <label>
              <input
                type='checkbox'
                name='service'
                value='Delisting'
                checked={services.find((i) => i === "Delisting")}
                onChange={(e) => {
                  let list = services;
                  if (e.target.checked) {
                    list.push(e.target.value);
                    setServices(list);
                    //console.log("services: ", list);
                  } else {
                    let newList = list.filter((i) => i !== e.target.value);
                    setServices(newList);
                    //console.log("services: ", newList);
                  }
                }}
              ></input>{" "}
              Delisting
            </label>
            <label>
              <input
                type='checkbox'
                name='service'
                value='Accounting'
                checked={services.find((i) => i === "Accounting")}
                onChange={(e) => {
                  let list = services;
                  if (e.target.checked) {
                    list.push(e.target.value);
                    setServices(list);
                    //console.log("services: ", list);
                  } else {
                    let newList = list.filter((i) => i !== e.target.value);
                    setServices(newList);
                    //console.log("services: ", newList);
                  }
                }}
              ></input>{" "}
              Accounting
            </label>
          </div>

          {/* -------------------- */}
          <div className='body__one__q1'>
            <label>
              For price, How would you like us to price? If you want to do the
              pricing yourself, Put it in the other section, I'll price.
            </label>
            <label>
              <input
                type='radio'
                name='pricing'
                value='High'
                checked={priceOptions === "High"}
                onChange={(e) => {
                  setPriceOptions(e.target.value);
                  //console.log("Price Options: ", e.target.value);
                }}
              ></input>{" "}
              High sold comp (longer hold)
            </label>
            <label>
              <input
                type='radio'
                name='pricing'
                value='Mid'
                checked={priceOptions === "Mid"}
                onChange={(e) => {
                  setPriceOptions(e.target.value);
                  //console.log("Price Options: ", e.target.value);
                }}
              ></input>{" "}
              Medium sold comp (mid hold)
            </label>
            <label>
              <input
                type='radio'
                name='pricing'
                value='Cheap'
                checked={priceOptions === "Cheap"}
                onChange={(e) => {
                  setPriceOptions(e.target.value);
                  //console.log("Price Options: ", e.target.value);
                }}
              ></input>{" "}
              Cheapest sold comp (Fast sale)
            </label>
            <label>
              <input
                type='text'
                value={otherPriceOptions}
                placeholder='Other'
                onChange={(e) => {
                  setOtherPriceOptions(e.target.value);
                  //console.log("other price option: ", e.target.value);
                }}
                className='other_price_options'
              ></input>
            </label>
          </div>
          {/* -------------------- */}
          <div className='body__one__q2'>
            <label>
              Increase comp price by $ or % (Please include $ or % if applicable
              )
            </label>
            <label>
              <input
                type='text'
                value={incrCompPrice}
                placeholder='(i.e. $10 or 10%)'
                className='body__one__q2_input'
                onChange={(e) => {
                  setIncrCompPrice(e.target.value);
                  //console.log("Incr Comp By: ", e.target.value);
                }}
              ></input>
            </label>
          </div>
          {/* -------------------- */}
          <div className='blob'>
            <label>Bottom of Discription (Company Blob)</label>
            <label>
              <input
                type='text'
                value={companyBlob}
                className='body__one__q4_input'
                placeholder=''
                onChange={(e) => {
                  setCompanyBlob(e.target.value);
                  //console.log("Comp Blob: ", e.target.value);
                }}
              ></input>
            </label>
          </div>
          {/* -------------------- */}
          <div className='body__one__q5'>
            <div className='sub_head'>Best Offer</div>

            <button
              type='button'
              onClick={(e) => {
                setBestOffer(!bestOffer);
                //console.log(!bestOffer);
                if (!bestOffer === false) {
                  setOfferAccept("");
                  setOfferDecline("");
                  setIsOfferAccept(false);
                  setIsOfferDecline(false);
                }
              }}
              className='button__q5'
            >
              {bestOffer
                ? "Yes, best offer enabled"
                : "No, best offer disabled"}
            </button>
            <div className='automatic_arrange'>
              <label className='automatic_label_arrange'>
                <input
                  type='checkbox'
                  checked={isOfferAccept}
                  onChange={(e) => {setIsOfferAccept(e.target.checked); 
                                    if (!e.target.checked) setOfferAccept(" ");
                                  }}
                ></input>{" "}
                Automatically accept offers of atleast
              </label>
              <label>
                <input
                  type='number'
                  min='0'
                  value={offerAccept}
                  className='automatic__input'
                  placeholder='percent(%)'
                  onChange={(e) => {
                    if (isOfferAccept && bestOffer) {
                        if(Math.sign(e.target.value) === 1) {
                            setOfferAccept(e.target.value);
                        } else setOfferAccept(" ");
                      //console.log("offer accept: ", e.target.value);
                    }
                  }}
                ></input>{" "}
              </label>
            </div>
            <div className='automatic_arrange'>
              <label className='automatic_label_arrange'>
                <input
                  type='checkbox'
                  checked={isOfferDecline}
                  onChange={(e) => {
                    setIsOfferDecline(e.target.checked);
                    if (!e.target.checked) setOfferDecline("");
                  }}
                ></input>{" "}
                Automatically decline offers lower than
              </label>
              <label>
                <input
                  type='number'
                  min={0}
                  value={offerDecline}
                  className='automatic__input'
                  placeholder='percent(%)'
                  onChange={(e) => {
                    if (isOfferDecline && bestOffer) {
                        if(Math.sign(e.target.value) === 1){
                            setOfferDecline(e.target.value);
                        } else setOfferDecline("")

                      //console.log("offer declined: ", e.target.value);
                    }
                  }}
                ></input>{" "}
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* ***************************************************************************************************** */}
      <div className='body'>
        <div className='body__two__q1_arrange'>
          <div className='ebay__smart'>
            <label>Ebay smart pricing</label>
            <div>
              <label>
                <input
                  type='radio'
                  name='ebay-pricing'
                  value='Yes'
                  checked={ebaySmartPricing}
                  onChange={(e) => {
                    setEbaySmartPricing(true);
                    //console.log("Ebay smart: ", true);
                  }}
                ></input>{" "}
                Yes
              </label>
              {"     "}
              <label>
                <input
                  type='radio'
                  name='ebay-pricing'
                  value='No'
                  checked={!ebaySmartPricing}
                  onChange={(e) => {
                    setEbaySmartPricing(false);
                    //console.log("Ebay smart: ", false);
                  }}
                ></input>{" "}
                No
              </label>
            </div>
          </div>

          <div className='mercari__smart'>
            <label>Mercari smart pricing</label>
            <div>
              <label>
                <input
                  type='radio'
                  name='mercari-pricing'
                  value='Yes'
                  checked={mercariSmartPricing}
                  onChange={(e) => {
                    setMercariSmartPricing(true);
                    //console.log("Mercari smart: ", true);
                  }}
                ></input>{" "}
                Yes
              </label>
              {"     "}

              <label>
                <input
                  type='radio'
                  name='mercari-pricing'
                  value='No'
                  checked={!mercariSmartPricing}
                  onChange={(e) => {
                    setMercariSmartPricing(false);
                    //console.log("Mercari smart: ", false);
                  }}
                ></input>{" "}
                No
              </label>
            </div>
          </div>
        </div>
        {/* ******************************** */}
        <div className='r2__q2'>
          <div className='vertical__align'>
            <label>Country</label>
            <label>
              <input
                type='text'
                value={country}
                className='automatic__input'
                onChange={(e) => {
                  setCountry(e.target.value);
                  //console.log("country: ", e.target.value);
                }}
              ></input>{" "}
            </label>
          </div>

          <div className='vertical__align'>
            <label>Zip/Postal code</label>
            <label>
              <input
                type='number'
                min='0'
                value={zipCode}
                className='automatic__input'
                onChange={(e) => {
                    if(Math.sign(e.target.value) === 1){
                        setZipCode(e.target.value);
                    } else setZipCode("")
                  //console.log("ZipCode: ", e.target.value);
                }}
              ></input>{" "}
            </label>
          </div>

          <div className='vertical__align'>
            <label>Location</label>
            <label>
              <input
                type='text'
                value={location}
                className='automatic__input'
                onChange={(e) => {
                  setLocation(e.target.value);
                  //console.log("Location: ", e.target.value);
                }}
              ></input>{" "}
            </label>
          </div>
        </div>
        {/* ******************************** */}

        <div className='r2_q3_align'>
          <label>Items specs for mercari tags:</label>
          <label>
            <input
              type='text'
              value={mercariTags}
              className='r2_q3_input'
              placeholder='seperate by comma'
              onChange={(e) => {
                setMercariTags(e.target.value.split(","));
                //console.log(e.target.value.split(","));
              }}
            ></input>{" "}
          </label>
        </div>

        {/* ******************************** */}

        <div className='shipping__alignment'>
          <div className='bold'> Shipping & Return Settings</div>
          <div className=' domestic__alignment'>
            <div className='bold2'> Domestic shipping rules:</div>
            <div className='r2_q4_align'>
              <label>
                <input
                  type='checkbox'
                  value='Free'
                  checked={shipping.find((i) => i === "Free")}
                  onChange={(e) => {
                    let list = shipping;
                    if (e.target.checked) {
                      list.push(e.target.value);
                      setShipping(list);
                      //console.log("shipping: ", list);
                    } else {
                      let newList = list.filter((i) => i !== e.target.value);
                      setShipping(newList);
                      //console.log("shipping: ", newList);
                    }
                  }}
                ></input>{" "}
                Free Shipping
              </label>
              <div>
                <label>
                  <input
                    type='checkbox'
                    value='Flat'
                    checked={flatShipRules}
                    onChange={(e) => {
                      setFlatShipRules(e.target.checked);
                      //console.log("Flat shipping? : ", e.target.checked);
                      let list = shipping;
                      if (e.target.checked) {
                        list.push(e.target.value);
                        setShipping(list);
                        //console.log("shipping: ", list);
                      } else {
                        let newList = list.filter((i) => i !== e.target.value);
                        setShipping(newList);
                        //console.log("shipping: ", newList);
                        setItemType1("");
                        setItemPrice1("");
                        setItemShipServ1("");
                        setItemType2("");
                        setItemPrice2("");
                        setItemShipServ2("");
                      }
                    }}
                  ></input>{" "}
                  Flat Shipping
                </label>
                <div className='r2_q4_inner_align'>
                  <div className='rules__arrange'> Rules</div>
                  <div className='r2_q4_sub_align'>
                    <div className='items__align_col'>
                      <div className='text_allign'>Item Type</div>
                      <div className='rules_align'>
                        <div>If</div>
                        <label>
                          <input
                            type='text'
                            value={itemType1}
                            className='r2_q4_inner_align_input'
                            onChange={(e) => {
                              if (flatShipRules) {
                                let type = itemType1;
                                type = e.target.value;
                                setItemType1(type);
                                //console.log("ItemType 1", itemType1);
                              }
                            }}
                          ></input>{" "}
                        </label>
                      </div>
                    </div>
                    <div className='items__align_col'>
                      <div className='text_allign'>Price</div>
                      <div className='rules_align'>
                        {" "}
                        <div>Then</div>
                        <label>
                          <input
                            type='number'
                            min='0'
                            value={itemPrice1}
                            className='r2_q4_inner_align_input'
                            onChange={(e) => {
                              if (flatShipRules) {
                                let type = setItemPrice1;
                                type = e.target.value;
                                if(Math.sign(type) === 1){
                                    setItemPrice1(type);
                                } else setItemPrice1("")
                                //console.log("ItemPrice 1", itemPrice1);
                              }
                            }}
                          ></input>{" "}
                        </label>
                      </div>
                    </div>
                    <div className='items__align_col'>
                      <div className='text_allign'>Shipping service</div>{" "}
                      <label className='rules_align'>
                        <input
                          type='text'
                          value={itemShipServ1}
                          className='r2_q4_inner_align_input'
                          onChange={(e) => {
                            if (flatShipRules) {
                              let type = itemShipServ1;
                              type = e.target.value;
                              setItemShipServ1(type);
                              //console.log("ItemShipServ 1", itemShipServ1);
                            }
                          }}
                        ></input>{" "}
                      </label>
                    </div>
                  </div>
                  {/* --------------------- */}

                  <div className='r2_q4_sub_align'>
                    <div>
                      <div className='text_allign'>Item Type</div>
                      <div className='rules_align'>
                        <div> If</div>
                        <label>
                          <input
                            type='text'
                            value={itemType2}
                            className='r2_q4_inner_align_input'
                            onChange={(e) => {
                              if (flatShipRules) {
                                let type = itemType2;
                                type = e.target.value;
                                setItemType2(type);
                                //console.log("ItemType 2", itemType2);
                              }
                            }}
                          ></input>{" "}
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className='text_allign'>Price</div>
                      <div className='rules_align'>
                        {" "}
                        <div>Then</div>
                        <label>
                          <input
                            type='number'
                            min='0'
                            value={itemPrice2}
                            className='r2_q4_inner_align_input'
                            onChange={(e) => {
                              if (flatShipRules) {
                                let type = itemPrice2;
                                type = e.target.value;
                                if(Math.sign(type) === 1){
                                    setItemPrice2(type);
                                } else setItemPrice2("")
                                //console.log("ItemPrice 2", itemPrice2);
                              }
                            }}
                          ></input>{" "}
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className='text_allign'>Shipping service</div>
                      <div className='rules_align'>
                        {" "}
                        <label>
                          <input
                            type='text'
                            value={itemShipServ2}
                            className='r2_q4_inner_align_input'
                            onChange={(e) => {
                              if (flatShipRules) {
                                let type = itemShipServ2;
                                type = e.target.value;
                                setItemShipServ2(type);
                                //console.log("ItemShipServ 2", itemShipServ2);
                              }
                            }}
                          ></input>{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <label>
                <input
                  type='checkbox'
                  value='Calculated'
                  checked={shipping.find((i) => i === "Calculated")}
                  onChange={(e) => {
                    let list = shipping;
                    if (e.target.checked) {
                      list.push(e.target.value);
                      setShipping(list);
                      //console.log("shipping: ", list);
                    } else {
                      let newList = list.filter((i) => i !== e.target.value);
                      setShipping(newList);
                      //console.log("shipping: ", newList);
                    }
                  }}
                ></input>{" "}
                Calculated Shipping
              </label>
              <label>
                <input
                  type='checkbox'
                  value='option1'
                  checked={isReturnAccept}
                  onChange={(e) => {
                    setIsReturnAccept(e.target.checked);
                    //console.log("Return accepted?: ", e.target.checked);
                    if(!e.target.checked){
                        setReturnedWithin("");
                        setRefundAs("");
                        setReturnShipBy("");
                    }
                  }}
                ></input>{" "}
                Returns Accepted
              </label>

              <div className='r2_q5_inner_align'>
                <div className='r2_q4_sub_align'>
                  <div>
                    <div className='text_allign'>
                      Items must be returned with in
                    </div>
                    <div className='all_allign_center'>
                      <label>
                        <input
                          type='number'
                          min='0'
                          value={returnedWithin}
                          className='r2_q4_inner_align_input'
                          placeholder='In days'
                          onChange={(e) => {
                            if(isReturnAccept) {
                                if(Math.sign(e.target.value) === 1){
                                    setReturnedWithin(e.target.value);
                                } else setReturnedWithin("")
                                //console.log("Returned within: ", e.target.value, " days");
                            }
                          }}
                        ></input>{" "}
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className='text_allign'>Refund must be given as</div>
                    <div className='all_allign_center'>
                      {" "}
                      <label>
                        <input
                          type='text'
                          value={refundAs}
                          className='r2_q4_inner_align_input'
                          onChange={(e) => {
                              if(isReturnAccept) {
                                  setRefundAs(e.target.value);
                                  //console.log("Refund given as: ", e.target.value);
                              }
                          }}
                        ></input>{" "}
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className='text_allign'>
                      Return shipping will be paid by
                    </div>
                    <div className='all_allign_center'>
                      {" "}
                      <label>
                        <input
                          type='text'
                          value={returnShipBy}
                          className='r2_q4_inner_align_input'
                          onChange={(e) => {
                            if(isReturnAccept) {
                                setReturnShipBy(e.target.value);
                                //console.log("Return paid by: ", e.target.value);
                            }
                          }}
                        ></input>{" "}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ***************************************************************************************************** */}
      <div className='body'>
        <div>
          <div className='bold2'>
            International shipping (most clients increase 300% from domestic
            shipping
          </div>
          <div className=' international_allignmant'>
            <div className='international_shipping_alignment'>
              <div>Increase by domestic shipping </div>
              <label>
                <input
                  type='number'
                  min='0'
                  placeholder='in (%)'
                  value={incrByDomestic}
                  className='input_tag'
                  onChange={(e) => {
                      if(Math.sign(e.target.value) === 1){
                          setIncrByDomestic(e.target.value);
                      } else setIncrByDomestic("")
                    //console.log("Incr by Domestic: ", e.target.value);
                  }}
                ></input>
              </label>
            </div>
            <div className='international_shipping_alignment'>
              <div>Shipping Service</div>
              <label>
                <input
                  type='text'
                  value={shipService}
                  className='input_tag'
                  onChange={(e) => {
                    setShipService(e.target.value);
                    //console.log("shipping Service: ", e.target.value);
                  }}
                ></input>
              </label>
            </div>
          </div>
        </div>
        {/* ------------------------------------------ */}
        <div className=' international_allignmant'>
          <label>
            <input
              type='checkbox'
              checked={intlReturnAccepted}
              onChange={(e) => {
                setIntlReturnAccepted(e.target.checked);
                //console.log("Intl Return accepted?: ", e.target.checked);
                if(!e.target.checked){
                    setIntlReturnedWithin("");
                    setIntlRefundAs("");
                    setIntlReturnShipBy("");
                }
              }}
            ></input>{" "}
            International returns accepted
          </label>

          <div className='r3_q2_align'>
            <div>
              <label>
                Items must be returned with in{" "}
                <input
                  type='number'
                  min='0'
                  value={intlReturnedWithin}
                  className='input_tag'
                  placeholder='in days'
                  onChange={(e) => {
                    if(intlReturnAccepted) {
                        if(Math.sign(e.target.value) === 1){
                            setIntlReturnedWithin(e.target.value);
                        } else setIntlReturnedWithin("")
                        //console.log("Intl Return within: ", e.target.value, " days");
                    }
                  }}
                ></input>
              </label>
            </div>
            <div>
              <label>
                Refund must be given as
                <input
                  type='text'
                  value={intlRefundAs}
                  className='input_tag'
                  onChange={(e) => {
                     if(intlReturnAccepted) {
                         setIntlRefundAs(e.target.value);
                         //console.log("Intl Refund As: ", e.target.value);
                     }
                  }}
                ></input>
              </label>
            </div>
            <div>
              <label>
                Return shipping will be paid by{" "}
                <input
                  type='text'
                  value={intlReturnShipBy}
                  className='input_tag'
                  onChange={(e) => {
                      if(intlReturnAccepted) {
                          setIntlReturnShipBy(e.target.value);
                          //console.log("Intl Return ship by: ", e.target.value);
                      }
                  }}
                ></input>
              </label>
            </div>
          </div>
        </div>
        {/* ------------------------------------------ */}

        <div className=' international_allignmant'>
          <label>
            <input
              type='checkbox'
              checked={useEbayGlobal}
              onChange={(e) => {
                setUseEbayGlobal(e.target.checked);
                //console.log("Use Ebay Global?: ", e.target.checked);
                if(!e.target.checked) {
                    setHandlingTime("");
                    setCost("");
                }
              }}
            ></input>
            Use ebay global shipping program
          </label>
          <div className='time__cost'>
            <div>
              {" "}
              <label>
                Handling time
                <input
                  type='number'
                  min="0"
                  placeholder="in days"
                  value={handlingTime}
                  className='input_tag'
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if(Math.sign(e.target.value) === 1){
                            setHandlingTime(e.target.value);
                        } else setHandlingTime("")
                        //console.log("Handling Time: ", e.target.value);
                    }
                  }}
                ></input>
              </label>
            </div>
            <div>
              {" "}
              <label>
                cost
                <input
                  type='number'
                  min='0'
                  placeholder='in $'
                  className='input_tag'
                  value={cost}
                  onChange={(e) => {
                     if(useEbayGlobal) {
                         if(Math.sign(e.target.value) === 1){
                             setCost(e.target.value);
                         } else setCost("")
                         //console.log("Ebay shipping cost: ", e.target.value);
                     }
                  }}
                ></input>
              </label>
            </div>
          </div>
          <div>
            <div className='country_arrange'>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Worldwide'
                  checked={worldwideShip && useEbayGlobal}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        setWorldwideShip(e.target.checked);
                        //console.log("Worldwide shipping? : ", e.target.checked);
                    }
                  }}
                ></input>
                Worldwide
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Brazil'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Brazil")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Brazil
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='United Kingdom'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "United Kingdom")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                United Kingdom
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Mexico'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Mexico")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Mexico
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Mexico'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Mexico")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Other
              </label>
            </div>
            <div className='country_arrange'>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='China'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "China")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                China
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Germany'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Germany")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Germany
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='N & S America'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "N & S America")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                N & S America
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Japan'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Japan")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Japan
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Russia'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Russia")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>{" "}
                Russia
              </label>
            </div>
            <div className='country_arrange'>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='France'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "France")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                France
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Asia'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Asia")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Asia
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Canada'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Canada")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Canada
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Europe'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Europe")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Europe
              </label>
              <label>
                <input
                  type='checkbox'
                  className='country_input'
                  value='Australia'
                  checked={useEbayGlobal && shipCountries.find((i) => i === "Australia")}
                  onChange={(e) => {
                    if(useEbayGlobal) {
                        if (e.target.checked) {
                          let list = shipCountries;
                          list.push(e.target.value);
                          setShipCountries(list);
                          //console.log("ShipCountries: ", list);
                        } else {
                          let list = shipCountries;
                          let newList = list.filter((i) => i !== e.target.value);
                          setShipCountries(newList);
                          //console.log("ShipCountries: ", newList);
                        }
                    }
                  }}
                ></input>
                Australia
              </label>
            </div>
          </div>
        </div>
        {/* ------------------------------------------ */}
        <div className='payment'>
          <div className='sub_head'>Payment Profile</div>
          <div className='r3_q4_body_align'>
            <div className='r3_q4_left_align1'>
              <div>Paypal Email</div>
              <label>
                <input
                  type='email'
                  value={paypalEmail}
                  onChange={(e) => {
                    setPaypalEmail(e.target.value);
                    //console.log("Paypal email: ", e.target.value);
                  }}
                  className='input__payprof1'
                ></input>
              </label>
              <div>
                <label>Account Payments:</label>
                <label>
                  {" "}
                  <input
                    type='checkbox'
                    checked={allowPaypal}
                    onChange={(e) => {
                      setAllowPaypal(e.target.checked);
                      //console.log("Allow paypal?: ", e.target.checked);
                    }}
                  ></input>
                </label>
                <div className='make_flex'>
                  Paypal{" "}
                  <div className='small_font'>
                    (More Options , not always supported by ebay)
                  </div>
                </div>
              </div>
            </div>
            <div className='r3_q4_left_align2'>
              <label>
                Taxes:
                <input
                  type='text'
                  style={{ width: "150px" }}
                  value={taxes}
                  onChange={(e) => {
                    setTaxes(e.target.value);
                    //console.log("Taxes: ", e.target.value);
                  }}
                  className='input__payprof2'
                ></input>
              </label>
              <label>
                Payment instructions
                <input
                  type='text'
                  style={{ width: "150px" }}
                  value={paymentInstr}
                  onChange={(e) => {
                    setPaymentInstr(e.target.value);
                    //console.log("Payment Instructions: ", e.target.value);
                  }}
                  className='input__payprof3'
                ></input>
              </label>
            </div>
          </div>
        </div>
        <div className='buyer_border'>
          <div>Buyer Requirements:</div>
          <div className=' buyer_req_align'>
            <div>
              <label>
                <input
                  type='radio'
                  name='buyer-reqs'
                  value='allow'
                  checked={buyerReqs === "allow"}
                  onChange={(e) => {
                    setBuyerReqs(e.target.value);
                    //console.log("buyer reqs: ", e.target.value);
                  }}
                ></input>
                Allow all buyers to purchase items
              </label>
            </div>
            <div>
              {" "}
              <label>
                <input
                  type='radio'
                  name='buyer-reqs'
                  value='block'
                  checked={buyerReqs === "block"}
                  onChange={(e) => {
                    setBuyerReqs(e.target.value);
                    //console.log("buyer reqs: ", e.target.value);
                  }}
                ></input>
                Block buyers
              </label>
              <br />
            </div>
          </div>
        </div>
        <label className='save_btn_align'>
          <input
            type='button'
            value='Save'
            onClick={(e) => handleSubmit()}
            className='save_button'
          ></input>
        </label>
      </div>
    </div>
  );
};

export default ListingSettings;
