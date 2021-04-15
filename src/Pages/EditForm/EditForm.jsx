import React, { Component } from "react";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import "./EditForm.css";
import Axios from "../../services/Axios";
//import LoadingSpinner from "../utils/loader";
import imageCompression from "browser-image-compression";
import { evaluateTree } from "../utils/parser";
//import $ from "jquery";
//import imageDataURI from "image-data-uri";
import jwt_decode from "jwt-decode";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import { nanoid } from 'nanoid';
import { useHistory } from "react-router-dom";

class EditForm extends Component {
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
    };
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    this.agentid = decoded._doc._id;
  }

  componentDidMount = () => {
    const token = localStorage.getItem("token");
    Axios.get(`/product/${this.props.match.params.id}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-access-token": token,
        },
      }
    ).then((res) => {
      const { images } = this.state;
      
      this.setState({ data: res.data.products[0] });

      this.state.data['shortDescription'] = decodeURIComponent(res.data.products[0].shortDescription);

      if (res.data.products[0].extraMeasures) {
        this.state.extraMeasures = JSON.parse(
          res.data.products[0].extraMeasures
        );
        this.state.count = this.state.extraMeasures.length + 1;
      }

      if (res.data.products[0].line) {
        this.state.extraDescriptions = JSON.parse(res.data.products[0].line);
        this.setState({
          extraDescriptions: this.state.extraDescriptions,
          count1: this.state.extraDescriptions.length + 1,
        });
      }

      var yourString = this.state.data.title;
      var maxLength = 15;
      var trimmedString = yourString.substr(0, maxLength);
      this.state.templatename = trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
      );

      if (res.data.products[0].ebay.url !== "") {
        this.state.ebayurl = res.data.products[0].ebay.url;
      }
      if (res.data.products[0].poshmark.url !== "") {
        this.state.poshmarkurl = res.data.products[0].poshmark.url;
      }
      if (res.data.products[0].mercari.url !== "") {
        this.state.mercariurl = res.data.products[0].mercari.url;
      }

      if (
        res.data.products[0].category !== "Men" &&
        res.data.products[0].category !== "Women" &&
        res.data.products[0].category !== "Unisex Kids" &&
        res.data.products[0].category !== "Babies" &&
        res.data.products[0].category !== "Speacialty"
      ) {
        this.setState({ showcat: true });
      }

      if (res.data.products[0].others) {
        this.state.otherfromdb = JSON.parse(res.data.products[0].others);
        this.state.otherfromdb.forEach((db, i) => {
          this.state.othersstate[i] = db.status;
          if (db.status === true && db.url !== undefined && db.url !== "") {
            this.state.othersurl[i] = db;
          }
          if (db.status === true) {
            this.state.othertolist[i] = db;
          }
        });
      }

      if(res.data.products[0])
      {
        const {data} = this.state;
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
        this.setState({data});
      }

      if (res.data.products[0]._id) 
      {
        this.setState({ productid: res.data.products[0]._id });
      }

      if (res.data.products[0].message) 
      {
        this.setState({ message: res.data.products[0].message });
      }

      this.state.data["ebay"]["title"] = res.data.products[0].ebay.title;
      this.state.data["poshmark"]["title"] =
        res.data.products[0].poshmark.title;
      this.state.data["mercari"]["title"] = res.data.products[0].mercari.title;
      this.state.data["delist"]["title"] = res.data.products[0].delist.title;
      if (res.data.products[0].images)
        images.forEach((image) => {
          image.img = res.data.products[0].images[image.key];
        });
      this.setState({ images });

    });

    Axios.get('ebay/itemSuggestionPopulater').then((res) => {this.setState({ebayCategoryDropDownItems : res.data.data})});
    Axios.get('ebay/shippingPopulater').then((res) => {
      this.setState({shippingDropDownItems : res.data.data.ShippingServiceDetails.map((item, key) => {return res.data.data.ShippingServiceDetails[key]})})
      this.setState({shippingDomesticDropDownItems: res.data.data.ShippingServiceDetails
                                                    .filter(item => item.ValidForSellingFlow === 'true')
                                                    .filter(item => item.InternationalService === undefined)
                                                    .map(item => {return item})
                                                  })
      this.setState({shippingInternationalDropDownItems: res.data.data.ShippingServiceDetails
                                                        .filter(item => item.ValidForSellingFlow === 'true')
                                                        .filter(item => item.InternationalService === 'true')
                                                        .map(item => {return item})
                                                  })
      });
    Axios.get('ebay/sellerShippingPolicies', {params: {userID: this.props.match.params.clientid}}).then((res) => {
      this.setState({clientEbayShippingDropDownItems : res.data.data.fulfillmentPolicies.map((item, key) => {return res.data.data.fulfillmentPolicies[key]})})
      this.setState({clientEbayShippingDomesticDropDownItems: res.data.data.fulfillmentPolicies
                                                    .filter(item => (item.shippingOptions && item.shippingOptions[0]) ? (item.shippingOptions[0].optionType === "DOMESTIC") : false)
                                                    .map(item => {
                                                      return item})
                                                  });
      this.setState({clientEbayShippingInternationalDropDownItems: res.data.data.fulfillmentPolicies
                                                        .filter(item => (item.shippingOptions && item.shippingOptions[1]) ? (item.shippingOptions[1].optionType === "INTERNATIONAL") : false)
                                                        .map(item => {
                                                          return item})
                                                  });
    });
    Axios.get('ebay/getCampaigns', {params: {userID: this.props.match.params.clientid}}).then((res) => {
      let campaignList = res.data.data.campaigns.map((item, key) => {return res.data.data.campaigns[key]})
      campaignList.unshift({campaignName: 'None', campaignId:0})
      this.setState({clientEbayADCampaignDropDownItems : campaignList})
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const { data, bestOfferSettings } = this.state;
    if (name === "price")
    {
      
      data["profit"] = value - data["costOfGoods"]  ;
      if(bestOfferSettings)
      {
        if(bestOfferSettings.acceptOfferOf) data['bestOfferAcceptFloorValue'] = value * (bestOfferSettings.acceptOfferOf/100);
        if(bestOfferSettings.declineOfferOf) data['bestOfferDeclineCeilingValue'] =  value * (bestOfferSettings.declineOfferOf/100);
      }
    }
    if (name === "costOfGoods")
    {
      data["profit"] = data["price"] - value ;
    }
    data[name] = value;
    this.setState({ data });
    this.setState({ editchange: true });
  };

  handleMarketPlaceDataChange = (event, market, field) =>
  {
    const { name, value } = event.target;
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
    this.setState({ editchange: true });
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
    const { data, images, extraMeasures, extraDescriptions } = this.state;
    const dataform = new FormData();
    
    images.forEach((image) => {
      if(image.img)
      {
        dataform.append(image.key, image.img);
      }
    });

    var y = [];
    this.state.others.forEach((o, i) => {
      let obj = {
        name: o,
        status: this.state.othersstate[i],
        url: this.state.othersurl[i] ? this.state.othersurl[i] : "",
      };
      y.push(obj);
    });

    //https://developer.ebay.com/devzone/finding/callref/enums/conditionIdList.html
    if(data.ebay.check)
    {
      this.state.data['ebay']['ebayListingType'] = 'FixedPriceItem';

      switch(data.condition_name)
      {
        case "New":
          this.state.data['ebayConditionID'] = 1000;
          break;
        case "Used":
          this.state.data['ebayConditionID'] = 3000;
          break;
        case "New (Other/Open Box)":
          this.state.data['ebayConditionID'] = 2750;
          break;
        case "Seller Refurbished":
          this.state.data['ebayConditionID'] = 2500;
          break;
        case "Broken/For Repair":
          this.state.data['ebayConditionID'] = 7000;
          break;
      }

      if(data.ebay.ebayListingType === 'FixedPriceItem' && value === "inventory" || value === "submit")
      {
        this.state.data['ebay']['ebayListingDuration'] = 'GTC';
      }
      else
      {
        this.state.data['ebay']['ebayListingDuration'] = data.listingDuration || 0;
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

      if(data.domesticShippingService)
      {
        this.state.data['ebay']['ebayDomesticShippingService'] = data.domesticShippingService.ShippingService;
      }

      if(data.internationalShippingService)
      {
        this.state.data['ebay']['ebayInternationalShippingService'] = data.internationalShippingService.ShippingService;
      }

      if(data.domesticShippingCost) this.state.data['ebay']['ebayDomesticShippingCost'] = data.domesticShippingCost;
      if(data.domesticShippingEachAdditional) this.state.data['ebay']['domesticShippingEachAdditional'] = data.domesticShippingEachAdditional;
      if(data.domesticShippingSurcharge) this.state.data['ebay']['ebayDomesticShippingSurcharge'] = data.domesticShippingSurcharge;

      if(data.internationalShippingCost) this.state.data['ebay']['ebayInternationalShippingCost'] = data.internationalShippingCost;
      if(data.internationalShippingEachAdditional) this.state.data['ebay']['ebayInternationalShippingEachAdditional'] = data.internationalShippingEachAdditional;
      if(data.internationalShippingSurcharge) this.state.data['ebay']['ebayInternationalShippingSurcharge'] = data.internationalShippingSurcharge;
    }


    this.setState({ isSubmitting: true });

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
    dataform.append("mercaric", data.mercari.check);
    dataform.append("poshmarkc", data.poshmark.check);
    dataform.append("delistc", data.delist.check);

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
    dataform.append("ebayc", data.ebay.check);
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


    if(value === "draft")
    {
      dataform.append("prodStatus", "draft");
    }
    
    Axios.put(`/product/${this.props.match.params.id}`, dataform, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if(value === "draft")
        {
          alert('Product Is Saved As Draft.')
        }
        window.open(`/products/${data.prodStatus}`, "_self");
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        console.log(err) || alert(JSON.stringify({ err: err }));
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

      this.setState({
        images,
      });
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
        try {
          images[idx].img = files[i];
          this.setState({ images }, () => console.log(this.state.images));
        } catch (error) {
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

  setCategory = (str) => {
    const { data } = this.state;
    data["category"] = str;
    this.setState({ data });
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
      othersbool,
      others,
      othersstate,
      otherfromdb,
      othertolist,
      othersurl,
      ebayCategoryDropDownItems,
      shippingDropDownItems,
      shippingDomesticDropDownItems,
      shippingInternationalDropDownItems,
      clientEbayShippingDomesticDropDownItems,
      clientEbayShippingInternationalDropDownItems,
      clientEbayADCampaignDropDownItems
    } = this.state;
    
    return (
      <div className='app'>
        <div className='app__body'>
        <div style={{'display':'flex', 'alignItems': 'flex-start'}}>
        <IconButton aria-label="close" onClick={this.goToPreviousPath}>
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

export default EditForm;
