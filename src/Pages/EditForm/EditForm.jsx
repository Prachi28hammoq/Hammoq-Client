import React, { Component } from "react";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import "./EditForm.css";
import Axios from "../../services/Axios";
import jwt_decode from "jwt-decode";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import { nanoid } from 'nanoid';

class ListForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        line1: { line1: "", value1: "" },
        line2: { line2: "", value2: "" },
        line3: { line3: "", value3: "" },
        line4: { line4: "", value4: "" },
        line5: { line5: "", value5: "" },
        line6: { line6: "", value6: "" },
        line7: { line7: "", value7: "" },
        line8: { line8: "", value8: "" },
        ebay: { title: "", check: "", url: "" },
        poshmark: { title: "", check: "", url: "" },
        mercari: { title: "", check: "", url: "" },
        delist: { title: "", check: "", url: "" },
      },
      isSubmitting: false,
      extraMeasures: [],
      extraDescriptions: [],
      deletedDescriptions: [],
      count: 1,
      count1: 1,
      images: [
        { key: "default_image", label: "Default", img: "" },
        { key: "brand_image", label: "Brand", img: "" },
        { key: "model_image", label: "Model", img: "" },
        { key: "side1_image", label: "Side", img: "" },
        { key: "side2_image", label: "Side", img: "" },
        { key: "front_image", label: "Front", img: "" },
        { key: "back_image", label: "Back", img: "" },
        { key: "condition1_image", label: "Condition", img: "" },
        { key: "condition2_image", label: "Condition", img: "" },
        { key: "condition3_image", label: "Condition", img: "" },
        { key: "condition4_image", label: "Condition", img: "" },
        { key: "condition5_image", label: "Image Tag", img: "" },
      ],
      sku: "",
      Ebay: false,
      Poshmark: false,
      Mercari: false,
      othersbool: false,

      others: [],
      othersstate: [],
      otherfromdb: [],
      othertolist: [],
      othersurl: [],

      showcat: false,

      rates: {},

      editchange: false,
      productid : "",
      clientid : "",
      agentName : '',

      ebayCategoryDropDownItems: [],
      shippingDropDownItems: [],
      shippingDomesticDropDownItems: [],
      shippingInternationalDropDownItems: [],

      clientEbayShippingDropDownItems: [],
      clientEbayShippingDomesticDropDownItems: [],
      clientEbayShippingInternationalDropDownItems: [],
      clientEbayADCampaignDropDownItems: [],

      ebayPayPalEmail: "",
      ebayPayPalEmailActive: false,
      ebayAutoPayActive: false,
      ebayPaymentMethod: "",

      companyBlurb: "",
      mercariHashtags: "",

      originZipCode: "",
      calculatedShippingActive: false,
      freeShippingActive: false,
      flatShippingActive: false,
      flatShippingRules: [],

      bestOfferActive: false,
      bestOfferSettings: [],

      compPriceSetting: "",
      compPriceIncreaseValue: 0,
      compPriceIncreaseMethod: "",

      internationalShipping: [],

      internationalReturnsAccepted: false,
      internationalReturnsRefundGivenAs: "",
      internationalReturnsPaidBy: "",
      internationalReturnsWithin: "",

      domesticReturnsAccepted: false,
      domesticReturnsRefundGivenAs: "",
      domesticReturnsPaidBy: "",
      domesticReturnsWithin: "",

      rightSectionProps: [],

      isDataLoading: false,
      isEbayCategoryDropDownItemsLoading: false,
      isShippingDropDownItemsLoading: false,
      isShippingDomesticDropDownItemsLoading: false,
      isShippingInternationalDropDownItemsLoading: false,
      isClientEbayShippingDropDownItemsLoading: false,
      isClientEbayShippingDomesticDropDownItemsLoading: false,
      isClientEbayShippingInternationalDropDownItemsLoading: false,
      isClientEbayADCampaignDropDownItemsLoading: false,
      isClientListingSettingsLoading: false,

      doesDataExist: false,
      doesEbayCategoryDropDownItemsExist: false,
      doesShippingDropDownItemsExist: false,
      doesShippingDomesticDropDownItemsExist: false,
      doesShippingInternationalDropDownItemsExist: false,
      doesClientEbayShippingDropDownItemsExist: false,
      doesClientEbayShippingDomesticDropDownItemsExist: false,
      doesClientEbayShippingInternationalDropDownItemsExist: false,
      doesClientEbayADCampaignDropDownItemsExist: false,
      doesClientListingSettingsExist: false
    };
  }

  componentDidMount = () => {
  const clientid = localStorage.getItem("cid");
  this.setState({clientid})
  const productid = this.props.match.params.id
  this.setState({productid})

  this.setState({isDataLoading: true});
  Axios.get(`/product/${productid}`, { headers: { "content-type": "application/x-www-form-urlencoded"} })
       .then((response) => {
              const res = response
              const { images } = this.state;
              let data = res.data.products[0]

              this.state.data['shortDescription'] = decodeURIComponent(res.data.products[0].shortDescription);

              if (res.data.products[0].extraMeasures) 
              {
                  let extraMeasures = JSON.parse(res.data.products[0].extraMeasures);
                  let count = extraMeasures.length + 1;
                  this.setState({extraMeasures, count});
              }

              if (res.data.products[0].line) 
              {
                let extraDescriptions = JSON.parse(res.data.products[0].line);
                this.setState({
                  extraDescriptions: extraDescriptions,
                  count1: extraDescriptions.length + 1,
                });
              }

              if (res.data.products[0].ebay.url !== "") 
              {
                this.setState({ebayurl : res.data.products[0].ebay.url});
              }

              if (res.data.products[0].poshmark.url !== "") 
              {
                this.setState({poshmarkurl : res.data.products[0].poshmark.url});
              }

              if (res.data.products[0].mercari.url !== "") 
              {
                this.setState({mercariurl : res.data.products[0].mercari.url});
              }

              if (res.data.products[0].others) {
                let otherfromdb = JSON.parse(res.data.products[0].others);
                let othersurl = [];
                let othertolist = [];
                let othersstate = [];

                otherfromdb.forEach((db, i) => {
                  othersstate[i] = db.status;
                  if (db.status === true && db.url !== undefined && db.url !== "") 
                  {
                    othersurl[i] = db;
                  }
                  if (db.status === true) 
                  {
                    othertolist[i] = db;
                  }
                });
                this.setState({otherfromdb, othersurl, othertolist});
            }

            if(res.data.products[0])
            {
              if(res.data.products[0].domesticShippingService && res.data.products[0].domesticShippingService.length > 20)
              {
                let domesticShippingService = JSON.parse(res.data.products[0].domesticShippingService)
                data["domesticShippingService"] = domesticShippingService;
              }

              if(res.data.products[0].internationalShippingService && res.data.products[0].internationalShippingService.length > 20)
              {
                let internationalShippingService = JSON.parse(res.data.products[0].internationalShippingService)
                data["internationalShippingService"] = internationalShippingService;
              }

              if(res.data.products[0].ebayCategoryField && res.data.products[0].ebayCategoryField.length > 20)
              {
                let ebayCategoryField = JSON.parse(res.data.products[0].ebayCategoryField)
                data["ebayCategoryField"] = ebayCategoryField;
              }

              if(res.data.products[0].domesticClientShippingPolicy && res.data.products[0].domesticClientShippingPolicy.length > 20)
              {
                let domesticClientShippingPolicy = JSON.parse(res.data.products[0].domesticClientShippingPolicy)
                data["domesticClientShippingPolicy"] = domesticClientShippingPolicy;
              }

              if(res.data.products[0].internationalClientShippingPolicy && res.data.products[0].internationalClientShippingPolicy.length > 20)
              {
                let internationalClientShippingPolicy = JSON.parse(res.data.products[0].internationalClientShippingPolicy)
                data["internationalClientShippingPolicy"] = internationalClientShippingPolicy;
              }

              if(res.data.products[0].ebayCampaign && res.data.products[0].ebayCampaign.length > 20)
              {
                let ebayCampaign = JSON.parse(res.data.products[0].ebayCampaign)
                data["ebayCampaign"] = ebayCampaign;
              }

              if(res.data.products[0].ebay.ebayADCampaign && res.data.products[0].ebay.ebayADCampaign.length > 20)
              {
                let ebayADCampaign = JSON.parse(res.data.products[0].ebay.ebayADCampaign)
                data["ebay"]["ebayADCampaign"] = ebayADCampaign;
              }
            }

            data["ebay"]["title"] = res.data.products[0].ebay.title;
            data["poshmark"]["title"] = res.data.products[0].poshmark.title;
            data["mercari"]["title"] = res.data.products[0].mercari.title;
            data["delist"]["title"] = res.data.products[0].delist.title;

            data["ebay"]["url"] = res.data.products[0].ebay.url;
            data["poshmark"]["url"] = res.data.products[0].poshmark.url;
            data["mercari"]["url"] = res.data.products[0].mercari.url;

            if (res.data.products[0].images)
            {
              images.forEach((image) => 
              {
                image.img = res.data.products[0].images[image.key];
              });
            }

            this.setState({ images });
            if(data['clientSettingsLoaded'] === false || data['clientSettingsLoaded'] === undefined)
            {
              this.setState({isClientListingSettingsLoading: true});
              Axios.get(`/clientdetails/listingSettings`)
                  .then(({ data }) => {
                    if(data && data.settings[0])
                    {
                      this.setState({doesClientListingSettingsExist: true});

                      if(data.settings[0].listing && data.settings[0].listing[0])
                      {
                        this.setState({compPriceSetting: data.settings[0].listing[0].priceOptions || this.state.compPriceSetting})
                        if(data.settings[0].listing[0].incrCompPrice && data.settings[0].listing[0].incrCompPrice[0])
                        {
                          this.setState({compPriceIncreaseValue : data.settings[0].listing[0].incrCompPrice[0].value || 0});
                          this.setState({compPriceIncreaseMethod : data.settings[0].listing[0].incrCompPrice[0].by || this.state.compPriceIncreaseMethod});
                        }
                        this.setState({originZipCode: data.settings[0].listing[0].zipCode || this.state.originZipCode});
                        this.setState({mercariHashtags: data.settings[0].listing[0].mercariTags || this.state.mercariHashtags});
                        this.setState({companyBlurb : data.settings[0].listing[0].companyBlurb || this.state.companyBlurb});
                      }

                      if(data.settings[0].shipping && data.settings[0].shipping[0])
                      {
                        this.setState({flatShippingRules: data.settings[0].shipping[0].flatShippingRules || this.state.flatShippingRules});
                        this.setState({freeShippingActive: data.settings[0].shipping[0].freeShipping || this.state.freeShippingActive});
                        this.setState({calculatedShippingActive: data.settings[0].shipping[0].calculatedShipping || this.state.calculatedShippingActive});
                      }

                      if(data.settings[0].shipping && data.settings[0].shipping[0] && data.settings[0].shipping[0].returns && data.settings[0].shipping[0].returns[0])
                      {
                        this.setState({domesticReturnsAccepted: data.settings[0].shipping[0].returns[0].accepted || this.state.domesticReturnsAccepted});
                        this.setState({domesticReturnsRefundGivenAs: data.settings[0].shipping[0].returns[0].refundGivenAs || this.state.domesticReturnsRefundGivenAs});
                        this.setState({domesticReturnsPaidBy: data.settings[0].shipping[0].returns[0].returnShipPaidBy || this.state.domesticReturnsPaidBy});
                        this.setState({domesticReturnsWithin: data.settings[0].shipping[0].returns[0].returnWithin || this.state.domesticReturnsWithin});
                      }

                      if(data.settings[0].intlShipping && data.settings[0].intlShipping[0] && data.settings[0].intlShipping[0].returns && data.settings[0].intlShipping[0].returns[0])
                      {
                        this.setState({internationalReturnsAccepted: data.settings[0].intlShipping[0].returns[0].accepted || this.state.internationalReturnsAccepted});
                        this.setState({internationalReturnsRefundGivenAs: data.settings[0].intlShipping[0].returns[0].refundGivenAs || this.state.internationalReturnsRefundGivenAs});
                        this.setState({internationalReturnsPaidBy: data.settings[0].intlShipping[0].returns[0].returnShipPaidBy || this.state.internationalReturnsPaidBy});
                        this.setState({internationalReturnsWithin: data.settings[0].intlShipping[0].returns[0].returnWithin || this.state.internationalReturnsWithin});
                      }

                      if(data.settings[0].listing[0].bestOffer && data.settings[0].listing[0].bestOffer[0] )
                      {
                        this.setState({bestOfferActive: data.settings[0].listing[0].bestOffer[0].enabled || this.state.bestOfferActive});
                        this.setState({bestOfferSettings: data.settings[0].listing[0].bestOffer[0] || this.state.bestOfferSettings});
                      }

                      if(data.settings[0].payment && data.settings[0].payment[0] )
                      {
                        this.setState({ebayPayPalEmail: data.settings[0].payment[0].paypalEmail || this.state.ebayPayPalEmail});
                        this.setState({ebayPayPalEmailActive: data.settings[0].payment[0].allowPaypal || this.state.ebayPayPalEmailActive});
                        this.setState({ebayAutoPayActive: data.settings[0].payment[0].enableEbayAutoPay || this.state.ebayAutoPayActive});
                      }
                    }
                  })
                  .then(() =>
                  {

                      const { internationalReturnsAccepted } = this.state;
                      data['internationalReturnsAccepted'] = internationalReturnsAccepted || false;

                      const { internationalReturnsRefundGivenAs } = this.state;
                      data['internationalReturnsRefundGivenAs'] = internationalReturnsRefundGivenAs || "";

                      const { internationalReturnsPaidBy } = this.state;
                      data['internationalReturnsPaidBy'] = internationalReturnsPaidBy || "";

                      const { internationalReturnsWithin } = this.state;
                      data['internationalReturnsWithin'] = internationalReturnsWithin || "";

                      const { domesticReturnsAccepted } = this.state;
                      data['domesticReturnsAccepted'] = domesticReturnsAccepted || false;

                      const { domesticReturnsRefundGivenAs } = this.state;
                      data['domesticReturnsRefundGivenAs'] = domesticReturnsRefundGivenAs || "";

                      const { domesticReturnsPaidBy } = this.state;
                      data['domesticReturnsPaidBy'] = domesticReturnsPaidBy || "";

                      const { domesticReturnsWithin } = this.state;
                      data['domesticReturnsWithin'] = domesticReturnsWithin || "";

                      const { compPriceSetting } = this.state;
                      data['compPriceSetting'] = compPriceSetting || '';

                      const { compPriceIncreaseValue } = this.state;
                      data['compPriceIncreaseValue'] = compPriceIncreaseValue || 0;

                      const { compPriceIncreaseMethod } = this.state;
                      data['compPriceIncreaseMethod'] = compPriceIncreaseMethod || '';

                      const { originZipCode } = this.state;
                      data['zipCode'] = originZipCode || 0;

                      const { mercariHashtags } = this.state;
                      data['mercariHashtags'] = mercariHashtags || '';
                      const { companyBlurb } = this.state;
                      data['companyBlurb'] = companyBlurb || '';

                      const { flatShippingRules } = this.state;
                      data['flatShippingRules'] = flatShippingRules || [];

                      const { freeShippingActive } = this.state;
                      data['domesticShippingFreeShippingActive'] = freeShippingActive || false;

                      const { calculatedShippingActive } = this.state;
                      data['calculatedShippingActive'] = calculatedShippingActive || false;

                      const { bestOfferActive } = this.state;
                      data['bestOfferActive'] = bestOfferActive || false;

                      const { ebayPayPalEmailActive } = this.state;
                      data['ebay']['ebayPayPalEmailActive'] = ebayPayPalEmailActive || false;

                      const { ebayPayPalEmail } = this.state;
                      data['ebay']['ebayPayPalEmail'] = ebayPayPalEmail || '';

                      const { ebayAutoPayActive } = this.state;
                      data['ebayAutoPayActive'] = ebayAutoPayActive || false;

                      const { bestOfferSettings } = this.state;
                      data['bestOfferAcceptFloorActive'] = bestOfferSettings.isOfferAccepted || false;
                      data['bestOfferDeclineCeilingActive'] = bestOfferSettings.isOfferDeclined || false;

                      if(bestOfferSettings === undefined || !bestOfferSettings.acceptOfferOf)
                      {
                        data['bestOfferAcceptFloorValue'] = 0;
                      }
                      else
                      {
                        data['bestOfferAcceptFloorValue'] = (bestOfferSettings.acceptOfferOf/100) * data['price'];
                      }

                      if(bestOfferSettings === undefined || !bestOfferSettings.declineOfferOf)
                      {
                        data['bestOfferDeclineCeilingValue'] = 0;
                      }
                      else
                      {
                        data['bestOfferDeclineCeilingValue'] = (bestOfferSettings.declineOfferOf/100) * data['price'];
                      }

                      data['clientSettingsLoaded'] = true;

                  })
                  .catch((err) => console.log(err));
              this.setState({isClientListingSettingsLoading: false});
            }
            else if(data['clientSettingsLoaded'])
            {
              this.setState({doesClientListingSettingsExist: true});
              this.setState({isClientListingSettingsLoading: false});
            }

    this.setState({data});
    this.setState({isDataLoading: false});
    this.setState({doesDataExist: true});
  });

  const {
    ebayCategoryDropDownItems,
    shippingDropDownItems,
    shippingDomesticDropDownItems,
    shippingInternationalDropDownItems,

    clientEbayShippingDropDownItems,
    clientEbayShippingDomesticDropDownItems,
    clientEbayShippingInternationalDropDownItems,
    clientEbayADCampaignDropDownItems,
  } = this.state;

  this.setState({isEbayCategoryDropDownItemsLoading: true});
  Axios.get('ebay/itemSuggestionPopulater').then((res) => {this.setState({ebayCategoryDropDownItems : (res.data && res.data.data ? res.data.data : ebayCategoryDropDownItems)});
                                                           this.setState({isEbayCategoryDropDownItemsLoading: false});
                                                           if(this.state.ebayCategoryDropDownItems.length > 0) this.setState({doesEbayCategoryDropDownItemsExist: true});});

  this.setState({isShippingDropDownItemsLoading: true});
  this.setState({isShippingInternationalDropDownItemsLoading: true});
  this.setState({isShippingDomesticDropDownItemsLoading: true});

  Axios.get('ebay/shippingPopulater').then((res) => {
      this.setState({shippingDropDownItems : (res.data && res.data.data && res.data.data.ShippingServiceDetails ? (res.data.data.ShippingServiceDetails.map((item, key) => {return res.data.data.ShippingServiceDetails[key]})) : (shippingDropDownItems))});
      this.setState({isShippingDropDownItemsLoading: false});
      if(this.state.shippingDropDownItems.length > 0) this.setState({doesShippingDropDownItemsExist: true});

      this.setState({shippingDomesticDropDownItems: (res.data && 
                                                     res.data.data && 
                                                     res.data.data.ShippingServiceDetails ? 
                                                     (res.data.data.ShippingServiceDetails
                                                    .filter(item => item.ValidForSellingFlow === 'true')
                                                    .filter(item => item.InternationalService === undefined)
                                                    .map(item => {return item})) :
                                                     (shippingDomesticDropDownItems))
                                                  });
      this.setState({isShippingDomesticDropDownItemsLoading: false});
      if(this.state.shippingDomesticDropDownItems.length > 0) this.setState({doesShippingDomesticDropDownItemsExist: true});

      this.setState({shippingInternationalDropDownItems: (res.data && 
                                                          res.data.data && 
                                                          res.data.data.ShippingServiceDetails ? 
                                                          (res.data.data.ShippingServiceDetails
                                                          .filter(item => item.ValidForSellingFlow === 'true')
                                                          .filter(item => item.InternationalService === 'true')
                                                          .map(item => {return item})) :
                                                          (shippingInternationalDropDownItems))
                                                  });
      this.setState({isShippingInternationalDropDownItemsLoading: false});
      if(this.state.shippingInternationalDropDownItems.length > 0) this.setState({doesShippingInternationalDropDownItemsExist: true});
    });

  this.setState({isClientEbayShippingDropDownItemsLoading: true});
  this.setState({isClientEbayShippingInternationalDropDownItemsLoading: true});
  this.setState({isClientEbayShippingDomesticDropDownItemsLoading: true});

  Axios.get('ebay/sellerShippingPolicies', {params: {userID: clientid}}).then((res) => {
      this.setState({clientEbayShippingDropDownItems : (res.data && res.data.data && res.data.data.fulfillmentPolicies ? (res.data.data.fulfillmentPolicies.map((item, key) => {return res.data.data.fulfillmentPolicies[key]})) : (clientEbayShippingDropDownItems))});

      this.setState({isClientEbayShippingDropDownItemsLoading: false});
      if(res.data.data.total > 0) this.setState({doesClientEbayShippingDropDownItemsExist: true});

      this.setState({clientEbayShippingDomesticDropDownItems: (res.data && 
                                                               res.data.data && 
                                                               res.data.data.fulfillmentPolicies ? 
                                                               (res.data.data.fulfillmentPolicies
                                                              .filter(item => (item.shippingOptions && item.shippingOptions[0]) ? (item.shippingOptions[0].optionType === "DOMESTIC") : false)
                                                              .map(item => {
                                                                return item})) :
                                                              (clientEbayShippingDomesticDropDownItems))
                                                  });
      this.setState({isClientEbayShippingDomesticDropDownItemsLoading: false});
      if(this.state.clientEbayShippingDomesticDropDownItems.length > 1) this.setState({doesClientEbayShippingDomesticDropDownItemsExist: true});

      this.setState({clientEbayShippingInternationalDropDownItems: (res.data && 
                                                                   res.data.data && 
                                                                   res.data.data.fulfillmentPolicies ? 
                                                                   (res.data.data.fulfillmentPolicies
                                                                  .filter(item => (item.shippingOptions && item.shippingOptions[1]) ? (item.shippingOptions[1].optionType === "INTERNATIONAL") : false)
                                                                  .map(item => {
                                                                    return item})) :
                                                                  (clientEbayShippingInternationalDropDownItems))
                                                  });
      this.setState({isClientEbayShippingInternationalDropDownItemsLoading: false});
      if(this.state.clientEbayShippingInternationalDropDownItems.length > 1) this.setState({doesClientEbayShippingInternationalDropDownItemsExist: true});
    });

  this.setState({isClientEbayADCampaignDropDownItemsLoading: true});

  Axios.get('ebay/getCampaigns', {params: {userID: clientid}}).then((res) => {
      let campaignList = clientEbayADCampaignDropDownItems;

      if(res.data && res.data.data && res.data.data.campaigns && res.data.data.campaigns.length > 0)
        {
          campaignList = res.data.data.campaigns.map((item, key) => {return res.data.data.campaigns[key]})
        }

      campaignList.unshift({campaignName: 'None', campaignId:0})

      this.setState({clientEbayADCampaignDropDownItems : campaignList})
      this.setState({isClientEbayADCampaignDropDownItemsLoading: false});
      if(res.data && res.data.data && res.data.data.total && res.data.data.total > 0) this.setState({doesClientEbayADCampaignDropDownItemsExist: true});
    });
  };

  skuSearch = () => {
    const { clientid, sku } = this.state;
    Axios.get(`/product/cid/${sku}/${clientid}`)
      .then(({ data }) => {
        if (!data) {
          data = {};
          this.state.data["ebay"]["check"] = false;
          this.state.data["poshmark"]["check"] = false;
          this.state.data["mercari"]["check"] = false;
          this.state.data["delist"]["check"] = false;
        } else {
          this.setState({ data: data });
          if (data.extraMeasures) {
            this.state.extraMeasures = JSON.parse(data.extraMeasures);
            this.state.count = this.state.extraMeasures.length + 1;
          }
          if (data.templates[0].data.others) {
            this.state.otherfromdb = JSON.parse(data.templates[0].data.others);
            this.state.otherfromdb.forEach((db, i) => {
              this.state.othersstate[i] = db.status;
            });
          }
          this.state.data["ebay"]["title"] = data.ebay.title;
          this.state.data["poshmark"]["title"] = data.poshmark.title;
          this.state.data["mercari"]["title"] = data.mercari.title;
          this.state.data["delist"]["title"] = data.delist.title;
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const { data, bestOfferSettings, clientEbayADCampaign } = this.state;

    if (name === "price")
    {
      data["profit"] = value - data["costOfGoods"];
      if(bestOfferSettings)
      {
        if(bestOfferSettings.acceptOfferOf) data['bestOfferAcceptFloorValue'] = value * (bestOfferSettings.acceptOfferOf/100);
        if(bestOfferSettings.declineOfferOf) data['bestOfferDeclineCeilingValue'] =  value * (bestOfferSettings.declineOfferOf/100);
      }
    }

    if(name === 'domesticShippingCost' || name === 'domesticShippingEachAdditional' || name === 'domesticShippingSurcharge')
    {
      data['domesticShippingFreeShippingActive'] = false;
    }

    if(name ==='internationalShippingCost' || name === 'internationalShippingSurcharge' || name === 'internationalShippingEachAdditional')
    {
      data['internationalShippingFreeShippingActive'] = false;
    }

    if (name === "costOfGoods")
    {
      data["profit"] = data["price"] - value;
    }

    data[name] = value;

    if(name === 'ebayCampaign')
    {
      data['ebayCampaign'] = clientEbayADCampaign[value];
    }

    this.setState({ data });
  };

  handleMarketPlaceDataChange = (event, market, field) =>
  {
    const { value } = event.target;
    const { data } = this.state;

    data[market][field] = value;
    this.setState({ data });
  }

  handleEbayClientShippingChange = (e, v) => {
    const { data } = this.state;

    if(v === 'CLEARDOM')
    {
      data['domesticClientShippingPolicy'] = '';
    }

    if(v === 'CLEARINT')
    {
      data['internationalClientShippingPolicy'] = '';
    }

    if(v.shippingOptions)
    {
      if((v.shippingOptions[0] !== undefined) && (v.shippingOptions[1] !== undefined) && (v.shippingOptions[0].optionType === "DOMESTIC") && (v.shippingOptions[1].optionType === "INTERNATIONAL"))
      {
        data['domesticClientShippingPolicy'] = v;
        data['internationalClientShippingPolicy'] = v;

        if(!data.domesticClientShippingPoliciesActive) data['domesticClientShippingPoliciesActive'] = true;
        if(!data.internationalClientShippingPoliciesActive) data['internationalClientShippingPoliciesActive'] = true;

        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined)
        {
          data['domesticShippingFreeShippingActive'] = v.shippingOptions[0].shippingServices[0].freeShipping;
          data['domesticShippingCost'] = 0.0;
        }

        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined) data['domesticShippingFreeShippingActive'] = v.shippingOptions[0].shippingServices[0].freeShipping;

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] !== undefined)
        {
          data['internationalShippingFreeShippingActive'] = v.shippingOptions[1].shippingServices[0].freeShipping;
          data['internationalShippingCost'] = 0.0;
        }

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] !== undefined) data['internationalShippingFreeShippingActive'] = v.shippingOptions[1].shippingServices[0].freeShipping;


        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined && v.shippingOptions[0].shippingServices[0].shippingCost && v.shippingOptions[0].shippingServices[0].shippingCost.value) data['domesticShippingCost'] = v.shippingOptions[0].shippingServices[0].shippingCost.value;


        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] !== undefined && v.shippingOptions[1].shippingServices[0].shippingCost && v.shippingOptions[1].shippingServices[0].shippingCost.value) data['internationalShippingCost'] = v.shippingOptions[1].shippingServices[0].shippingCost.value;


        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined && v.shippingOptions[0].shippingServices[0].additionalShippingCost && v.shippingOptions[0].shippingServices[0].additionalShippingCost.value) data['domesticShippingEachAdditional'] = v.shippingOptions[0].shippingServices[0].additionalShippingCost.value;

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] !== undefined && v.shippingOptions[1].shippingServices[0].additionalShippingCost && v.shippingOptions[1].shippingServices[0].additionalShippingCost.value) data['internationalShippingEachAdditional'] = v.shippingOptions[1].shippingServices[0].additionalShippingCost.value;

        data['ebay']['ebaySellerShippingPolicyID'] = v.fulfillmentPolicyId;
        data['ebay']['ebaySellerShippingPolicyName'] = v.name;
      }

      else if((v.shippingOptions[0] !== undefined) && (v.shippingOptions[1] === undefined) && (v.shippingOptions[0].optionType === "DOMESTIC"))
      {
        data['domesticClientShippingPolicy'] = v;

        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined && v.shippingOptions[0].shippingServices[0].shippingCost && v.shippingOptions[0].shippingServices[0].shippingCost.value) data['domesticShippingCost'] = v.shippingOptions[0].shippingServices[0].shippingCost.value;
        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined && v.shippingOptions[0].shippingServices[0].additionalShippingCost && v.shippingOptions[0].shippingServices[0].additionalShippingCost.value) data['domesticShippingEachAdditional'] = v.shippingOptions[0].shippingServices[0].additionalShippingCost.value;


        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined && v.shippingOptions[0].shippingServices[0].freeShipping)
        {
          data['domesticShippingFreeShippingActive'] = true;
          data['domesticShippingCost'] = 0.0;
        }

        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined && !v.shippingOptions[0].shippingServices[0].freeShipping) data['domesticShippingFreeShippingActive'] = false;

        data['ebay']['ebaySellerShippingPolicyID'] = v.fulfillmentPolicyId;
        data['ebay']['ebaySellerShippingPolicyName'] = v.name;
      }

      else if((v.shippingOptions[0] === undefined) && (v.shippingOptions[1] !== undefined) && (v.shippingOptions[1].optionType === "INTERNATIONAL"))
      {
        data['internationalClientShippingPolicy'] = v;

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] && v.shippingOptions[1].shippingServices[0].shippingCost && v.shippingOptions[1].shippingServices[0].shippingCost.value) data['internationalShippingCost'] = v.shippingOptions[1].shippingServices[0].shippingCost.value;
        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] && v.shippingOptions[1].shippingServices[0].additionalShippingCost && v.shippingOptions[1].shippingServices[0].additionalShippingCost.value) data['internationalShippingEachAdditional'] = v.shippingOptions[1].shippingServices[0].additionalShippingCost.value;

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] && v.shippingOptions[1].shippingServices[0].freeShipping)
        {
          data['internationalShippingFreeShippingActive'] = true;
          data['internationalShippingCost'] = 0.0;
        }

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] && !v.shippingOptions[1].shippingServices[0].freeShipping) data['internationalShippingFreeShippingActive'] = false;

        data['ebay']['ebaySellerShippingPolicyID'] = v.fulfillmentPolicyId;
        data['ebay']['ebaySellerShippingPolicyName'] = v.name;
      }
    }

    this.setState({data}); 
  }

  handleCampaignSelect = (e, v) =>
  {
    const { data } = this.state
    data['ebayCampaign'] = v;
    this.setState({data});
  }

  handleShippingChange = (e, v, name) => {
    const { data } = this.state;
    data['ebay'][e.target.name] = v.ShippingService;
    data[name] = v;
    this.setState({ data });
  };

  handleOtherTitles = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["title"] = value;
    this.setState({ data });
  };

  handleUrl = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["url"] = value;
    this.setState({ data });
  };

  handleMeasureLabel = (id, e) => {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.forEach((measure) => {
      if (measure.id === id) {
        measure.label = value;
      }
    });
    this.setState({ extraMeasures });
  };

  handleDescriptionLabel = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.key = value;
      }
    });
    this.setState({ extraDescriptions });
  };

  handleMeasureChange = (id, e) => {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.forEach((measure) => {
      if (measure.id === id) {
        measure.val = value;
      }
    });
    this.setState({ extraMeasures });
  };

  addMeasure = (e) => {
    const { extraMeasures, count } = this.state;
    extraMeasures.push({ label: "", val: "", id: count });
    this.setState({ extraMeasures });
    this.setState({ count: count + 1 });
  };

  removeMeasure = (id, e) => {
    const { extraMeasures, count } = this.state;

    this.setState({
      extraMeasures: extraMeasures.filter((measure) => {
        return measure.id !== id;
      }),
    });
    this.setState({ count: count - 1 });
  };

  onSubmit = (e,  value) => {
    e.preventDefault();
    const { data, images, extraMeasures, extraDescriptions, clientid, productid } = this.state;
    const dataform = new FormData();

    this.setState({ isSubmitting: true });

    var y = [];
    this.state.others.forEach((o, i) => {
      let obj = {name: o, status: this.state.othersstate[i], url: this.state.othersurl[i] ? this.state.othersurl[i] : ""};
      y.push(obj);
    });

    //https://www.ebay.com/help/selling/listings/creating-managing-listings/item-conditions-category?id=4765
    //https://developer.ebay.com/devzone/finding/callref/enums/conditionIdList.html
    //https://www.ebay.com/help/selling/listings/creating-managing-listings/item-conditions-category?id=4765
    //https://developer.ebay.com/devzone/finding/callref/enums/conditionIdList.html
    if(data.ebay.check)
    {
      this.state.data['ebay']['ebayListingType'] = 'FixedPriceItem';
      
      switch(data.condition_name)
      {
        case "New":
          this.state.data['ebay']['ebayConditionID'] = 1000;
          break;
        case "New With Tags":
          this.state.data['ebay']['ebayConditionID'] = 1000;
          break;
        case "Used":
          this.state.data['ebay']['ebayConditionID'] = 3000;
          break;
        case "New (Other/Open Box)":
          this.state.data['ebay']['ebayConditionID'] = 2750;
          break;
        case "Seller Refurbished":
          this.state.data['ebay']['ebayConditionID'] = 2500;
          break;
        case "Broken/For Repair":
          this.state.data['ebay']['ebayConditionID'] = 7000;
          break;
        case "New With Defects":
          this.state.data['ebay']['ebayConditionID'] = 1750;
          break;
        default:
          return;
      }

      if(data.ebay.ebayListingType === 'FixedPriceItem' && value === "inventory")
      {
        this.state.data['ebay']['ebayListingDuration'] = 'GTC';
      }
      else
      {
        this.state.data['ebay']['ebayListingDuration'] = data.listingDuration || 0;
      }

      if(data.domesticReturnsWithin)
      {
        switch(data.domesticReturnsWithin)
        {
          case 14:
            this.state.data.domesticReturnsWithin = 'Days_14';
            break;
          case 30:
            this.state.data.domesticReturnsWithin = 'Days_30';
            break;
          case 60:
            this.state.data.domesticReturnsWithin = 'Days_60';
            break;
          case '14':
            this.state.data.domesticReturnsWithin = 'Days_14';
            break;
          case '30':
            this.state.data.domesticReturnsWithin = 'Days_30';
            break;
          case '60':
            this.state.data.domesticReturnsWithin = 'Days_60';
            break;
          default:
            break;
        }
      }

      if(data.internationalReturnsWithin)
      {
        switch(data.internationalReturnsWithin)
        {
          case 14:
            this.state.data.internationalReturnsWithin = 'Days_14';
            break;
          case 30:
            this.state.data.internationalReturnsWithin = 'Days_30';
            break;
          case 60:
            this.state.data.internationalReturnsWithin = 'Days_60';
            break;
          case '14':
            this.state.data.internationalReturnsWithin = 'Days_14';
            break;
          case '30':
            this.state.data.internationalReturnsWithin = 'Days_30';
            break;
          case '60':
            this.state.data.internationalReturnsWithin = 'Days_60';
            break;
          default:
            break;
        }
      }

      if(this.state.domesticReturnsAccepted)
      {
        this.state.data['ebay']['ebayDomesticReturnsAccepted'] = data.domesticReturnsAccepted;
        this.state.data['ebay']['ebayDomesticReturnsShippingCostPaidBy'] = data.domesticReturnsPaidBy;
        this.state.data['ebay']['ebayDomesticRefundOption'] = data.domesticReturnsRefundGivenAs;
        this.state.data['ebay']['ebayDomesticReturnsWithin'] = data.domesticReturnsWithin;
      }

      if(this.state.internationalReturnsAccepted)
      {
        this.state.data['ebay']['ebayInternationalReturnsAccepted'] = data.internationalReturnsAccepted;
        this.state.data['ebay']['ebayInternationalReturnsShippingCostPaidBy'] = data.internationalReturnsPaidBy;
        this.state.data['ebay']['ebayInternationalRefundOption'] = data.internationalReturnsRefundGivenAs;
        this.state.data['ebay']['ebayInternationalReturnsWithin'] = data.internationalReturnsWithin;
      }

      if(data.domesticClientShippingPolicy && data.domesticClientShippingPolicy.shippingOptions !== undefined && data.domesticClientShippingPolicy.shippingOptions[0] !== undefined && data.domesticClientShippingPolicy.shippingOptions[0].shippingServices !== undefined && data.domesticClientShippingPolicy.shippingOptions[0].shippingServices[0] !== undefined && data.domesticClientShippingPolicy.shippingOptions[0].shippingServices[0].shippingServiceCode)
      {
        this.state.data['ebay']['ebayDomesticShippingService'] = data.domesticClientShippingPolicy.shippingOptions[0].shippingServices[0].shippingServiceCode;
      }
      else
      {
        if(data.domesticShippingService) this.state.data['ebay']['ebayDomesticShippingService'] = data.domesticShippingService.ShippingService;
      }

      if(data.internationalClientShippingPolicy && data.domesticClientShippingPolicy.shippingOptions !== undefined && data.domesticClientShippingPolicy.shippingOptions[1] !== undefined && data.domesticClientShippingPolicy.shippingOptions[1].shippingServices !== undefined && data.domesticClientShippingPolicy.shippingOptions[1].shippingServices[0] !== undefined && data.domesticClientShippingPolicy.shippingOptions[1].shippingServices[0].shippingServiceCode)
      {
        this.state.data['ebay']['ebayInternationalShippingService'] = data.internationalClientShippingPolicy.shippingOptions[1].shippingServices[0].shippingServiceCode;
      }
      else
      {
        if(data.internationalShippingService) this.state.data['ebay']['ebayInternationalShippingService'] = data.internationalShippingService.ShippingService;
      }

      this.state.data['ebay']['ebayDomesticShippingCost'] = data.domesticShippingCost ? data.domesticShippingCost : 0;
      this.state.data['ebay']['domesticShippingEachAdditional'] = data.domesticShippingEachAdditional ? data.domesticShippingEachAdditional : 0;
      this.state.data['ebay']['ebayDomesticShippingSurcharge'] = data.domesticShippingSurcharge ? data.domesticShippingSurcharge : 0;

      this.state.data['ebay']['ebayInternationalShippingCost'] = data.internationalShippingCost ? data.internationalShippingCost : 0;
      this.state.data['ebay']['ebayInternationalShippingEachAdditional'] = data.internationalShippingEachAdditional ? data.internationalShippingEachAdditional : 0;
      this.state.data['ebay']['ebayInternationalShippingSurcharge'] = data.internationalShippingSurcharge ? data.internationalShippingSurcharge : 0;

      if(data.promotedListingActive) this.state.data['ebay']['ebayPromotedListingActive'] = data.promotedListingActive;
      if(data.promotedListingPercentage) this.state.data['ebay']['ebayPromotedListingPercentage'] = data.promotedListingPercentage;
      if(data.ebayCampaign && data.ebayCampaign !== 'None' && data.ebayCampaign !== undefined) this.state.data['ebay']['ebayADCampaign'] = data.ebayCampaign;
    }

    dataform.append("sku", data.sku);
    dataform.append("upc", data.upc);
    dataform.append("quantity", data.quantity);
    dataform.append("price", data.price);

    dataform.append("extraMeasures", JSON.stringify(extraMeasures));
    dataform.append("extraDescription", JSON.stringify(extraDescriptions));

    dataform.append("brand", data.brand);
    dataform.append("model", data.model);

    dataform.append("title", data.title);
    dataform.append("shortDescription", encodeURIComponent(data.shortDescription));
    dataform.append("condition_name", data.condition_name);

    dataform.append("mercari", data.mercari.title);
    dataform.append("poshmark", data.poshmark.title);
    dataform.append("delist", data.delist.title);
    dataform.append("mercaric", data.mercari.check ? data.mercari.check : false);
    dataform.append("poshmarkc", data.poshmark.check ? data.poshmark.check : false);
    dataform.append("delistc", data.delist.check ? data.delist.check : false);
    dataform.append("listed", false);
    dataform.append("activity", "advance");

    dataform.append("size", data.size);
    dataform.append("lotSize", data.lotSize);
    dataform.append("category", data["category"]);

    dataform.append("givingWorksCharityID", data.givingWorksCharityID);
    dataform.append("givingWorksDonationPercentage", data.givingWorksDonationPercentage);
    dataform.append("storeCategoryOne", data.storeCategoryOne);
    dataform.append("storeCategoryTwo", data.storeCategoryTwo);

    dataform.append("listingDuration", data.listingDuration);

    dataform.append("inseam", data.inseam);
    dataform.append("rise", data.rise);
    dataform.append("waist", data.waist);

    dataform.append("msrp", data.msrp);
    dataform.append("mrp", data.mrp);
    dataform.append("keywords", data.keywords);
    dataform.append("notes", data.notes);

    dataform.append("weightLB", data.weightLB);
    dataform.append("weightOZ", data.weightOZ);
    dataform.append("packageLength", data.packageLength);
    dataform.append("packageWidth", data.packageWidth);
    dataform.append("packageHeight", data.packageHeight);

    dataform.append("costOfGoods", data.costOfGoods);
    dataform.append("zipCode", data.zipCode);

    dataform.append("shippingFees", data.shippingFees);
    dataform.append("domesticClientShippingPoliciesActive", data.domesticClientShippingPoliciesActive);
    dataform.append("domesticClientShippingPolicy", JSON.stringify(data.domesticClientShippingPolicy));
    dataform.append("domesticShippingService", JSON.stringify(data.domesticShippingService));
    dataform.append("domesticShippingCost", data.domesticShippingCost);
    dataform.append("domesticShippingEachAdditional", data.domesticShippingEachAdditional);
    dataform.append("domesticShippingSurcharge", data.domesticShippingSurcharge);
    dataform.append("domesticShippingFreeShippingActive", data.domesticShippingFreeShippingActive);
    dataform.append("internationalClientShippingPoliciesActive", data.internationalClientShippingPoliciesActive);
    dataform.append("internationalClientShippingPolicy", JSON.stringify(data.internationalClientShippingPolicy));
    dataform.append("internationalShippingService", JSON.stringify(data.internationalShippingService));
    dataform.append("internationalShippingCost", data.internationalShippingCost);
    dataform.append("internationalShippingEachAdditional", data.internationalShippingEachAdditional);
    dataform.append("internationalShippingSurcharge", data.internationalShippingSurcharge);
    dataform.append("internationalShippingFreeShippingActive", data.internationalShippingFreeShippingActive);
    dataform.append("calculatedShippingActive", data.calculatedShippingActive);
    dataform.append("calculatedShipping", data.calculatedShipping);

    dataform.append("profit", data.profit);
    dataform.append("status", true);
    dataform.append("line", JSON.stringify(extraDescriptions));
    dataform.append("note", data.note)
    dataform.append("madeIn", data.madeIn);
    dataform.append("gender", data.gender || "");
    dataform.append("others", JSON.stringify(y));

    dataform.append("bestOfferActive", data.bestOfferActive);
    dataform.append("bestOfferAcceptFloorActive", data.bestOfferAcceptFloorActive);
    dataform.append("bestOfferDeclineCeilingActive", data.bestOfferDeclineCeilingActive);
    dataform.append("bestOfferAcceptFloorValue", data.bestOfferAcceptFloorValue);
    dataform.append("bestOfferDeclineCeilingValue", data.bestOfferDeclineCeilingValue);

    dataform.append("compPriceSetting", data.compPriceSetting);
    dataform.append("compPriceIncreaseValue", data.compPriceIncreaseValue);
    dataform.append("compPriceIncreaseMethod", data.compPriceIncreaseMethod);

    dataform.append("mercariHashtags", data.mercariHashtags);
    dataform.append("companyBlurb", data.companyBlurb);

    dataform.append("ebayCategoryField", JSON.stringify(data.ebayCategoryField));
    dataform.append("ebayOptionalFieldsActive", data.ebayOptionalFieldsActive);

    dataform.append("promotedListingActive", data.promotedListingActive);
    dataform.append("promotedListingPercentage", data.promotedListingPercentage);
    dataform.append("ebayCampaign", JSON.stringify(data.ebayCampaign));

    dataform.append("clientSettingsLoaded", data.clientSettingsLoaded);

    dataform.append("isListingGood", data.isListingGood);

    ////////////////////EBAY////////////////////////////////
    dataform.append("ebayc", data.ebay.check ? data.ebay.check : false);
    dataform.append("ebay", data.ebay.title);

    dataform.append("ebay.ebayCategoryID", data.ebay.ebayCategoryID);
    dataform.append("ebay.ebayConditionID", data.ebay.ebayConditionID); //https://developer.ebay.com/devzone/finding/callref/enums/conditionIdList.html

    dataform.append("ebay.ebayListingType", data.ebay.ebayListingType); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ListingTypeCodeType.html
    dataform.append("ebay.ebayListingDuration", data.ebay.ebayListingDuration); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ListingDurationCodeType.html

    dataform.append("ebay.ebayAutoPayActive", data.ebay.ebayAutoPayActive);
    dataform.append("ebay.ebayPaymentMethod", data.ebay.ebayPaymentMethod); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/BuyerPaymentMethodCodeType.html https://developer.ebay.com/devzone/xml/docs/reference/ebay/extra/additm.rqst.itm.pymntmthds.html Paypal or Autopay.
    dataform.append("ebay.ebayPayPalEmail", data.ebay.ebayPayPalEmail);
    dataform.append("ebay.ebayPayPalEmailActive", data.ebay.ebayPayPalEmailActive);

    dataform.append("ebay.ebayGlobalShippingActive", data.ebay.ebayGlobalShippingActive);
    dataform.append("ebay.ebaySellerShippingPolicyID", data.ebay.ebaySellerShippingPolicyID);
    dataform.append("ebay.ebaySellerShippingPolicyName", data.ebay.ebaySellerShippingPolicyName);

    dataform.append("ebay.ebayDomesticShippingType", data.ebay.ebayDomesticShippingType); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingTypeCodeType.html
    dataform.append("ebay.ebayDomesticShippingService", data.ebay.ebayDomesticShippingService); // https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingServiceCodeType.html
    dataform.append("ebay.ebayDomesticShippingCost", data.ebay.ebayDomesticShippingCost);
    dataform.append("ebay.ebayDomesticShippingEachAdditional", data.ebay.ebayDomesticShippingEachAdditional);
    dataform.append("ebay.ebayDomesticShippingSurcharge", data.ebay.ebayDomesticShippingSurcharge);
    dataform.append("ebay.ebayDomesticShippingFreeShippingActive", data.ebay.ebayDomesticShippingFreeShippingActive);

    dataform.append("ebay.ebayInternationalShippingService", data.ebay.ebayInternationalShippingService); // https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingServiceCodeType.html
    dataform.append("ebay.ebayInternationalShippingType", data.ebay.ebayInternationalShippingType); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingTypeCodeType.html
    dataform.append("ebay.ebayInternationalShippingCost", data.ebay.ebayInternationalShippingCost);
    dataform.append("ebay.ebayInternationalShippingEachAdditional", data.ebay.ebayInternationalShippingEachAdditional);
    dataform.append("ebay.ebayInternationalShippingSurcharge", data.ebay.ebayInternationalShippingSurcharge);
    dataform.append("ebay.ebayInternationalShippingFreeShippingActive", data.ebay.ebayInternationalShippingFreeShippingActive);

    dataform.append("ebay.ebayDomesticReturnsShippingCostPaidBy", data.ebay.ebayDomesticReturnsShippingCostPaidBy); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingCostPaidByOptionsCodeType.html
    dataform.append("ebay.ebayDomesticRefundOption", data.ebay.ebayDomesticRefundOption); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/RefundOptionsCodeType.html
    dataform.append("ebay.ebayDomesticReturnsAccepted", data.ebay.ebayDomesticReturnsAccepted); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ReturnsAcceptedOptionsCodeType.html
    dataform.append("ebay.ebayDomesticReturnsWithin", data.ebay.ebayDomesticReturnsWithin); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ReturnsWithinOptionsCodeType.html

    dataform.append("ebay.ebayInternationalReturnsShippingCostPaidBy", data.ebay.ebayInternationalReturnsShippingCostPaidBy); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingCostPaidByOptionsCodeType.html
    dataform.append("ebay.ebayInternationalRefundOption", data.ebay.ebayInternationalRefundOption); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/RefundOptionsCodeType.html
    dataform.append("ebay.ebayInternationalReturnsAccepted", data.ebay.ebayInternationalReturnsAccepted); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ReturnsAcceptedOptionsCodeType.html
    dataform.append("ebay.ebayInternationalReturnsWithin", data.ebay.ebayInternationalReturnsWithin); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ReturnsWithinOptionsCodeType.html

    dataform.append("ebay.ebayPromotedListingActive", data.ebay.ebayPromotedListingActive);
    dataform.append("ebay.ebayPromotedListingPercentage", data.ebay.ebayPromotedListingPercentage);
    dataform.append("ebay.ebayADCampaign", JSON.stringify(data.ebay.ebayADCampaign));
    ////////////////////EBAY///////////////////////////////

    switch(value)
    {
      case "submit":
            dataform.append("prodStatus", "submit");
            break;
      case "inventory":
            dataform.append("prodStatus", "inventory");
            break;
      case "draft":
            dataform.append("prodStatus", "draft");
            break;
      case "current":
            dataform.append("prodStatus", data.prodStatus);
            break;
      default:
            dataform.append("prodStatus", "submit");
            break;
    }

    if (this.state.ebayurl !== "" && this.state.ebayurl !== null && this.state.ebayurl !== "d") dataform.append("ebayurl", data["ebay"]["url"]);
    if (this.state.poshmarkurl !== "" && this.state.poshmarkurl !== null && this.state.poshmarkurl !== "d") dataform.append("poshmarkurl", data["poshmark"]["url"]);
    if (this.state.mercariurl !== "" && this.state.mercariurl !== null && this.state.mercariurl !== "d") dataform.append("mercariurl", data["mercari"]["url"]);

    Axios.put(`/validateProduct`, dataform, {headers: {"Content-Type": "multipart/form-data", headers: this.agentid}})
          .then((response) => {
            if(response.data.SuccessCode)
            {
              images.forEach((image) => {if(image.img) dataform.append(image.key, image.img);});

                   Axios.put(`/product/${clientid}/${productid}`, dataform, {headers: {"Content-Type": "multipart/form-data", headers: this.agentid}})
                        .then((response) => {
                        if(value === "draft") alert('Product Is Saved As Draft.')
                        if(value === "submit") alert('Product Is Saved As A Submission.')
                        if(value === "inventory") alert('Product Is Updated.')
                    })
                    .catch((err) => {
                      this.setState({ isSubmitting: false });
                      console.log(err);
                    });
            }
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        console.log(err);
      });
  };

  toggleSelectedWebsite = (str) => {
    const { data } = this.state;
    data[str]["check"] = !data[str]["check"];
    this.setState({ data });
  };

  toggleSelectedOthersWebsite = (i) => {
    const { othersstate } = this.state;
    othersstate[i] = !othersstate[i];
    this.setState({ othersstate });
  };

  handleImageChange = async (event) => {
    const { images } = this.state;

    const idx = images.findIndex((image) => image.key === event.target.name);
    try {
      this.setState({ isSubmitting: true });
      images[idx].img = event.target.files[0];
      this.setState({images});
      this.setState({ isSubmitting: false });
    } catch (error) {
      console.log(error);
    }
  };

  handleBulkUpload = async (e) => {
    const { images } = this.state;
    const files = e.target.files;
    const count = files.length;

    this.setState({ isSubmitting: true });
    for (let i = 0; i < count; i++) {
      const idx = images.findIndex((image) => !image.img);
      if (idx > -1) {
        try 
        {
          images[idx].img = files[i];
          this.setState({ images }, () => console.log(this.state.images));
        } 
        catch (error) 
        {
          console.log(error);
        }
      }
    }
    this.setState({ isSubmitting: false });
  };

  handleToggleButton = (booleanValue, name) => {
    const { data } = this.state;

    data[name] = !booleanValue;

    this.setState({ data });
    this.setState({ editchange: true });
  }

  handleCheckboxToggle = (booleanValue, name) => {
    const { data } = this.state;

    data[name] = booleanValue;

    this.setState({ data });
    this.setState({ editchange: true });
  }

  removeImg = (idx) => {
    const { images } = this.state;
    images[idx].img = "";
    this.setState({ images });
  };

  skuChange = (e) => {
    this.setState({ sku: e.target.value });
  };

  clearExtraDescriptions = () => {
    this.setState({ extraDescriptions: [] });
    this.setState({ deletedDescriptions: [] });
  };

  handleSelectedLeaf = (itemAspectsArray) => {
    var { extraDescriptions, count1 } = this.state;
    extraDescriptions = [];
    Object.keys(itemAspectsArray.data.aspects).forEach((item, index) => {
      extraDescriptions.push({
        id: index,
        key: itemAspectsArray.data.aspects[index].localizedAspectName,
        aspectUsage: itemAspectsArray.data.aspects[index].aspectConstraint.aspectUsage,
        suggestedValues: itemAspectsArray.data.aspects[index].aspectValues,
        aspectRequired: itemAspectsArray.data.aspects[index].aspectConstraint.aspectRequired,
        value: ""
      });
      count1 = count1 + 1;
    });
    this.setState({ extraDescriptions: extraDescriptions, count1: count1 });
  };

  handleSelectedEbayCategory = (category) => {
    const url = "/ebay/itemAspects/" + category.categoryId;
    var { data } = this.state;

    data['ebay']['ebayCategoryID'] = category.categoryId;
    Axios.get(url)
      .then((response) => response.data)
      .then((data) => {
        this.handleSelectedLeaf(data);
      })
      .catch((err) => console.log(err));

      data['ebayCategoryField'] = category;
      this.setState({ data });
  };

  //TODO; Refactor for supporting any array. 
  handleDescriptionLabel = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.key = value;
      }
    });
    this.setState({ extraDescriptions });
  };

  handleDescriptionChange = (id, value) => {
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.value = value;
      }
    });
    this.setState({ extraDescriptions });
  };

  addDescription = () => {
    const { extraDescriptions, count1 } = this.state;
    extraDescriptions.push({ key: "", value: "", id: count1 });
    this.setState({ extraDescriptions });
    this.setState({ count1: count1 + 1 });
  };

  arrayFilterStorage = (item, filterValue) => 
  {
    var {deletedDescriptions} = this.state;

    if(item.id !== filterValue)
    {
      return true;
    }
    else if(item.id === filterValue)
    {
      deletedDescriptions.push(item);
      this.setState({deletedDescriptions});
      return false;
    }
  }

  removeDescription = (id, e) => {
    const { extraDescriptions } = this.state;
    this.setState({extraDescriptions: extraDescriptions.filter((description) => {return this.arrayFilterStorage(description, id)})});
  };

  toggleOptional = () => {
    var { data } = this.state;
    data['ebayOptionalFieldsActive'] = !data.ebayOptionalFieldsActive;
    this.setState({ data });
  };

  setEbayCategoryField = (categoryName) => {
    var { data } = this.state
    data['ebayCategoryField'] = categoryName;
    this.setState({ data });
  };

  repopulateExtraDescriptions = () => {
    var { extraDescriptions, deletedDescriptions } = this.state;
    var concatenatedArray = extraDescriptions.concat(deletedDescriptions);
    this.setState({deletedDescriptions: []});
    this.setState({extraDescriptions:concatenatedArray});
  }

  priceCalculation = () => {
    var { data } = this.state;
    if(data['compPriceIncreaseMethod'] || data['compPriceIncreaseValue'] === 'undefined' || data['compPriceIncreaseMethod'] || data['compPriceIncreaseValue'] === 'null')
    {
      alert("User does not have increase comp price settings set.");
    }
    else
    {
      if(data['compPriceIncreaseMethod'] === 'dollar')
      {
        data['price'] = parseFloat(data['price']) + parseFloat(data['compPriceIncreaseValue']);
        data["profit"] = data['price'] - data["costOfGoods"];
      }
      if(data['compPriceIncreaseMethod'] === 'percent')
      {
        data['price'] = parseFloat(data['price']) + (parseFloat(data['price']) * (parseFloat(data['compPriceIncreaseValue'])/100));
        data["profit"] = data['price'] - data["costOfGoods"];
      }
    }
    this.setState({data});
  };

  goToPreviousPath = () => {
      this.props.history.goBack();
  }

  createPromotedListing = () =>
  {
    Axios.get(`/ebay/createPromotedListing`, {params: {listing_id: 203353946816, percentage:1.0, campaign_id:12259133012, userID:'5ed5c1b70be28646617263a9'}})
  }

  render = () => {
    const {
      data,
      images,
      isSubmitting,
      extraMeasures,
      extraDescriptions,
      Ebay,
      Poshmark,
      Mercari,
      others,
      ebayCategoryDropDownItems,
      shippingDropDownItems,
      shippingDomesticDropDownItems,
      shippingInternationalDropDownItems,
      clientEbayShippingDomesticDropDownItems,
      clientEbayShippingInternationalDropDownItems,
      clientEbayADCampaignDropDownItems,
      isDataLoading,
      isEbayCategoryDropDownItemsLoading,
      isShippingDropDownItemsLoading,
      isShippingDomesticDropDownItemsLoading,
      isShippingInternationalDropDownItemsLoading,
      isClientEbayShippingDropDownItemsLoading,
      isClientEbayShippingDomesticDropDownItemsLoading,
      isClientEbayShippingInternationalDropDownItemsLoading,
      isClientEbayADCampaignDropDownItemsLoading,
      isClientListingSettingsLoading,
      doesDataExist,
      doesEbayCategoryDropDownItemsExist,
      doesShippingDropDownItemsExist,
      doesShippingDomesticDropDownItemsExist,
      doesShippingInternationalDropDownItemsExist,
      doesClientEbayShippingDropDownItemsExist,
      doesClientEbayShippingDomesticDropDownItemsExist,
      doesClientEbayShippingInternationalDropDownItemsExist,
      doesClientEbayADCampaignDropDownItemsExist,
      doesClientListingSettingsExist
    } = this.state;
    return (
      <div className='app'>
        <div className='app__body'>
        <div style={{'display':'flex', 'alignItems': 'flex-start'}}>
        <IconButton aria-label="close" onClick={this.goToPreviousPath}>{/*RETURN BACK TO GOBACK FUNCTION.*/}
          <KeyboardBackspaceIcon />
        </IconButton>
        </div>
          <LeftSection
            key='LeftSection'
            nanoid={nanoid}
            data={data}
            images={images}
            Ebay={Ebay}
            Poshmark={Poshmark}
            Mercari={Mercari}
            others={others}
            isSubmitting={isSubmitting}
            handleChange={this.handleChange}
            removeImg={this.removeImg}
            handleBulkUpload={this.handleBulkUpload}
            handleImageChange={this.handleImageChange}
            toggleSelectedOthersWebsite={this.toggleSelectedOthersWebsite}
            toggleSelectedWebsite={this.toggleSelectedWebsite}
            extraDescriptions={extraDescriptions}
            extraMeasures={extraMeasures}
            isDataLoading={isDataLoading}
            isEbayCategoryDropDownItemsLoading={isEbayCategoryDropDownItemsLoading}
            isShippingDropDownItemsLoading={isShippingDropDownItemsLoading}
            isShippingDomesticDropDownItemsLoading={isShippingDomesticDropDownItemsLoading}
            isShippingInternationalDropDownItemsLoading={isShippingInternationalDropDownItemsLoading}
            isClientEbayShippingDropDownItemsLoading={isClientEbayShippingDropDownItemsLoading}
            isClientEbayShippingDomesticDropDownItemsLoading={isClientEbayShippingDomesticDropDownItemsLoading}
            isClientEbayShippingInternationalDropDownItemsLoading={isClientEbayShippingInternationalDropDownItemsLoading}
            isClientEbayADCampaignDropDownItemsLoading={isClientEbayADCampaignDropDownItemsLoading}
            isClientListingSettingsLoading={isClientListingSettingsLoading}
            doesDataExist={doesDataExist}
            doesEbayCategoryDropDownItemsExist={doesEbayCategoryDropDownItemsExist}
            doesShippingDropDownItemsExist={doesShippingDropDownItemsExist}
            doesShippingDomesticDropDownItemsExist={doesShippingDomesticDropDownItemsExist}
            doesShippingInternationalDropDownItemsExist={doesShippingInternationalDropDownItemsExist}
            doesClientEbayShippingDropDownItemsExist={doesClientEbayShippingDropDownItemsExist}
            doesClientEbayShippingDomesticDropDownItemsExist={doesClientEbayShippingDomesticDropDownItemsExist}
            doesClientEbayShippingInternationalDropDownItemsExist={doesClientEbayShippingInternationalDropDownItemsExist}
            doesClientEbayADCampaignDropDownItemsExist={doesClientEbayADCampaignDropDownItemsExist}
            doesClientListingSettingsExist={doesClientListingSettingsExist}
              />
          <RightSection
            key='RightSection'
            nanoid={nanoid}
            data={data}
            handleChange={this.handleChange}
            addMeasure={this.addMeasure}
            removeMeasure={this.removeMeasure}
            extraMeasures={extraMeasures}
            handleMeasureChange={this.handleMeasureChange}
            handleMeasureLabel={this.handleMeasureLabel}
            clearExtraDescriptions={this.clearExtraDescriptions}
            addDescription={this.addDescription}
            extraDescriptions={this.state.extraDescriptions}
            handleDescriptionChange={this.handleDescriptionChange}
            handleDescriptionLabel={this.handleDescriptionLabel}
            removeDescription={this.removeDescription}
            repopulateExtraDescriptions={this.repopulateExtraDescriptions}
            handleSelectedLeaf={this.handleSelectedLeaf}
            handleSelectedEbayCategory={this.handleSelectedEbayCategory}
            handleOtherTitles={this.handleOtherTitles}
            toggleOptional={this.toggleOptional}
            handleUrl={this.handleUrl}
            ebayCategoryDropDownItems={ebayCategoryDropDownItems}
            shippingDropDownItems={shippingDropDownItems}
            shippingDomesticDropDownItems={shippingDomesticDropDownItems}
            shippingInternationalDropDownItems={shippingInternationalDropDownItems}
            handleCheckboxToggle={this.handleCheckboxToggle}
            handleToggleButton={this.handleToggleButton}
            onSubmit={this.onSubmit}
            isSubmitting={this.isSubmitting}
            setEbayCategoryField={this.setEbayCategoryField}
            priceCalculation={this.priceCalculation}
            handleShippingChange={this.handleShippingChange}
            handleMarketPlaceDataChange={this.handleMarketPlaceDataChange}
            clientEbayShippingDomesticDropDownItems={clientEbayShippingDomesticDropDownItems}
            clientEbayShippingInternationalDropDownItems={clientEbayShippingInternationalDropDownItems}
            handleEbayClientShippingChange={this.handleEbayClientShippingChange}
            clientEbayADCampaignDropDownItems={clientEbayADCampaignDropDownItems}
            handleCampaignSelect={this.handleCampaignSelect}
              />
        </div>
      </div>
    );
  }
}

export default ListForm;
