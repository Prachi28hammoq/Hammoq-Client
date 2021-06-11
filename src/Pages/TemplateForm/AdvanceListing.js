import React from "react";
import RightSectionTop from "./Components/RightSectionTop/RightSectionTop";
import Details from "./Components/Details/Details";
import GeneralSettings from "./Components/GeneralSettings/GeneralSettings";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import BestOffer from "./Components/BestOffer/BestOffer";
import ControllerButtons from "./Components/ControllerButtons/ControllerButtons";
import DomesticShipping from "./Components/DomesticShipping/DomesticShipping";
import InternationalShipping from "./Components/InternationalShipping/InternationalShipping";
import Images from "./Components/Images/Images";
import StoreToggles from "./Components/StoreToggles/StoreToggles";
import LeftSideTextBoxes from "./Components/LeftSideTextBoxes/LeftSideTextBoxes";
import DataMonitorTable from "./Components/DataMonitorTable/DataMonitorTable";
import ListingSettingsTable from "./Components/ListingSettingsTable/ListingSettingsTable";
import "./AdvanceListing.css";
import jwt_decode from "jwt-decode";
import { nanoid } from 'nanoid';
import EbayCategoryModal from "./Components/EbayModal/ebayModal";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

let Axios;

export default class AdvanceListing extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      data: {
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
        { key: "default_image", label: "Default", img: "", URL: ""},
        { key: "brand_image", label: "Brand", img: "", URL: ""},
        { key: "model_image", label: "Model", img: "", URL: ""},
        { key: "side1_image", label: "Side", img: "", URL: ""},
        { key: "side2_image", label: "Side", img: "", URL: ""},
        { key: "front_image", label: "Front", img: "", URL: ""},
        { key: "back_image", label: "Back", img: "", URL: ""},
        { key: "condition1_image", label: "Condition", img: "", URL: ""},
        { key: "condition2_image", label: "Condition", img: "", URL: ""},
        { key: "condition3_image", label: "Condition", img: "", URL: ""},
        { key: "condition4_image", label: "Condition", img: "", URL: ""},
        { key: "condition5_image", label: "Image Tag", img: "", URL: ""},
      ],
      imgThumbnailAssets:{},
      imgAssets:{},
      imgObjectURL:{},
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

      rates: {},
      clientListingSettings: {},

      editchange: false,
      productid: "",
      clientid: "",
      agentid: "",
      adminid: "",

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
    this.onSubmit = this.onSubmit.bind(this);
    this.skuSearch = this.skuSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMarketPlaceDataChange = this.handleMarketPlaceDataChange.bind(this);
    this.handleEbayClientShippingChange = this.handleEbayClientShippingChange.bind(this);
    this.handleCampaignSelect = this.handleCampaignSelect.bind(this);
    this.handleShippingChange = this.handleShippingChange.bind(this);
    this.handleOtherTitles = this.handleOtherTitles.bind(this);
    this.handleUrl = this.handleUrl.bind(this);
    this.handleMeasureLabel = this.handleMeasureLabel.bind(this);
    this.handleDescriptionLabel = this.handleDescriptionLabel.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
    this.addMeasure = this.addMeasure.bind(this);
    this.removeMeasure = this.removeMeasure.bind(this);
    this.toggleSelectedWebsite = this.toggleSelectedWebsite.bind(this);
    this.toggleSelectedOthersWebsite = this.toggleSelectedOthersWebsite.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleBulkUpload = this.handleBulkUpload.bind(this);
    this.handleToggleButton = this.handleToggleButton.bind(this);
    this.handleCheckboxToggle = this.handleCheckboxToggle.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.skuChange = this.skuChange.bind(this);
    this.clearExtraDescriptions = this.clearExtraDescriptions.bind(this);
    this.handleSelectedLeaf = this.handleSelectedLeaf.bind(this);
    this.handleSelectedEbayCategory = this.handleSelectedEbayCategory.bind(this);
    this.handleDescriptionLabel = this.handleDescriptionLabel.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.addDescription = this.addDescription.bind(this);
    this.arrayFilterStorage = this.arrayFilterStorage.bind(this);
    this.removeDescription = this.removeDescription.bind(this);
    this.toggleOptional = this.toggleOptional.bind(this);
    this.setEbayCategoryField = this.setEbayCategoryField.bind(this);
    this.repopulateExtraDescriptions = this.repopulateExtraDescriptions.bind(this);
    this.priceCalculation = this.priceCalculation.bind(this);
    this.handleZeroFix = this.handleZeroFix.bind(this);
    this.ebayRef = React.createRef();
  }

  componentDidMount() {
  Axios = this.props.Axios;
  var { adminid, agentid } = this.state;
  var clientid = this.props.clientid
  this.setState({clientid})
  var productid = this.props.productid
  this.setState({productid})

  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);

  if(decoded.access.isAdmin) 
    {
      this.setState({adminid:decoded._id});
    }
  else if(decoded.access.isAgent) 
    {
      this.setState({agentid:decoded._id});
    }
  else if(decoded.access.isClient) 
    {
      clientid = decoded._id;
      this.setState({clientid:decoded._id});
    }

  this.setState({isDataLoading: true});
  Axios.get(`/product/${clientid}/${productid}`, {headers: { "content-type": "application/x-www-form-urlencoded"}})
       .then((response) => {
              const res = response;
              let { images, imgAssets, imgThumbnailAssets, imgObjectURL } = this.state;
              let productData = response.data.products[0];

              productData['shortDescription'] = decodeURIComponent(productData.shortDescription);

              if (productData.extraMeasures) 
              {
                  let extraMeasures = JSON.parse(productData.extraMeasures);
                  let count = extraMeasures.length + 1;
                  this.setState({extraMeasures, count});
              }

              if (productData.extraDescriptions) 
              {
                let extraDescriptions = JSON.parse(productData.extraDescriptions);
                this.setState({extraDescriptions: extraDescriptions, count1: extraDescriptions.length + 1});
              }

              if (productData.ebay.url !== "") 
              {
                this.setState({ebayurl : productData.ebay.url});
              }

              if (productData.poshmark.url !== "") 
              {
                this.setState({poshmarkurl : productData.poshmark.url});
              }

              if (productData.mercari.url !== "") 
              {
                this.setState({mercariurl : productData.mercari.url});
              }

              if (productData.others) {
                let otherfromdb = JSON.parse(productData.others);
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

            if(productData)
            {
              productData['internationalReturnsAccepted'] = productData['ebay']['ebayInternationalReturnsAccepted'] || false;
              productData['internationalReturnsRefundGivenAs'] = productData['ebay']['ebayInternationalRefundOption'] || "";
              productData['internationalReturnsPaidBy'] = productData['ebay']['ebayInternationalReturnsShippingCostPaidBy'] || "";
              productData['internationalReturnsWithin'] = productData['ebay']['ebayInternationalReturnsWithin'] || "";
              productData['domesticReturnsAccepted'] = productData['ebay']['ebayDomesticReturnsAccepted'] || false;
              productData['domesticReturnsRefundGivenAs'] = productData['ebay']['ebayDomesticRefundOption'] || "";
              productData['domesticReturnsPaidBy'] = productData['ebay']['ebayDomesticReturnsShippingCostPaidBy'] || "";
              productData['domesticReturnsWithin'] = productData['ebay']['ebayDomesticReturnsWithin'] || "";
              productData['ebayPayPalEmailActive'] = productData['ebay']['ebayPayPalEmailActive'] || false;
              productData['ebayPayPalEmail'] = productData['ebay']['ebayPayPalEmail'] || '';
              productData['ebayAutoPayActive'] = productData['ebay']['ebayAutoPayActive'] || false;
            }

            if(productData)
            {
              productData["price"] = productData.price ? productData.price : 0;
              productData["costOfGoods"] = productData.costOfGoods ? productData.costOfGoods : 0;
              productData["otherCosts"] = productData.otherCosts ? productData.otherCosts : 0;
              productData["promotedListingPercentage"] = productData.promotedListingPercentage ? productData.promotedListingPercentage : 0;
              productData["quantity"] = productData.quantity ? productData.quantity : 0;

              if(productData.price && productData.costOfGoods && productData.otherCosts && productData.promotedListingPercentage)
              {
                productData["profit"] = (productData.price - productData.costOfGoods - productData.otherCosts - (productData.price * (productData.promotedListingPercentage > 0 ? productData.promotedListingPercentage/100 : 0))) * productData.quantity;
              }

              if(productData.domesticShippingService && productData.domesticShippingService.length > 20)
              {
                let domesticShippingService = JSON.parse(productData.domesticShippingService)
                productData["domesticShippingService"] = domesticShippingService;
              }

              if(productData.internationalShippingService && productData.internationalShippingService.length > 20)
              {
                let internationalShippingService = JSON.parse(productData.internationalShippingService)
                productData["internationalShippingService"] = internationalShippingService;
              }

              if(productData.ebayCategoryField && productData.ebayCategoryField.length > 20)
              {
                let ebayCategoryField = JSON.parse(productData.ebayCategoryField)
                productData["ebayCategoryField"] = ebayCategoryField;
              }

              if(productData.domesticClientShippingPolicy && productData.domesticClientShippingPolicy.length > 20)
              {
                let domesticClientShippingPolicy = JSON.parse(productData.domesticClientShippingPolicy)
                productData["domesticClientShippingPolicy"] = domesticClientShippingPolicy;
              }

              if(productData.internationalClientShippingPolicy && productData.internationalClientShippingPolicy.length > 20)
              {
                let internationalClientShippingPolicy = JSON.parse(productData.internationalClientShippingPolicy)
                productData["internationalClientShippingPolicy"] = internationalClientShippingPolicy;
              }

              if(productData.ebayCampaign && productData.ebayCampaign.length > 20)
              {
                let ebayCampaign = JSON.parse(productData.ebayCampaign)
                productData["ebayCampaign"] = ebayCampaign;
              }

              if(productData.ebay.ebayADCampaign && productData.ebay.ebayADCampaign.length > 20)
              {
                let ebayADCampaign = JSON.parse(productData.ebay.ebayADCampaign)
                productData["ebay"]["ebayADCampaign"] = ebayADCampaign;
              }
            }

            let {assetsURL, assetsThumbnailURL} = this.props;

            if (productData.images) images.forEach((image) => {
              image.img = productData.images[image.key]
 
              if(productData.images[image.key])
              {
                imgAssets[image.key] = assetsURL + productData.images[image.key];
                imgThumbnailAssets[image.key] = assetsThumbnailURL + productData.images[image.key];
                if(typeof productData.images[image.key] === 'object')
                {
                  imgObjectURL[image.key] = (typeof productData.images[image.key] === 'object' ? (URL.createObjectURL(productData.images[image.key])) : (""))
                }
              }
            });

            this.setState({ images, imgAssets, imgThumbnailAssets, imgObjectURL });

            if(productData['clientSettingsLoaded'] === false || productData['clientSettingsLoaded'] === undefined)
            {
              this.setState({isClientListingSettingsLoading: true});

              Axios.get(`/listingSettings/${clientid}`)
                   .then(({ data }) => {

                    if(data && data.settings[0])
                    {
                      this.setState({doesClientListingSettingsExist: true});
                      this.setState({clientListingSettings: data.settings[0]})

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
                      productData['internationalReturnsAccepted'] = this.state.internationalReturnsAccepted || false;
                      productData['internationalReturnsRefundGivenAs'] = this.state.internationalReturnsRefundGivenAs || "";
                      productData['internationalReturnsPaidBy'] = this.state.internationalReturnsPaidBy || "";
                      productData['internationalReturnsWithin'] = this.state.internationalReturnsWithin || "";
                      productData['domesticReturnsAccepted'] = this.state.domesticReturnsAccepted || false;
                      productData['domesticReturnsRefundGivenAs'] = this.state.domesticReturnsRefundGivenAs || "";
                      productData['domesticReturnsPaidBy'] = this.state.domesticReturnsPaidBy || "";
                      productData['domesticReturnsWithin'] = this.state.domesticReturnsWithin || "";
                      productData['compPriceSetting'] = this.state.compPriceSetting || '';
                      productData['compPriceIncreaseValue'] = this.state.compPriceIncreaseValue || 0;
                      productData['compPriceIncreaseMethod'] = this.state.compPriceIncreaseMethod || '';
                      productData['zipCode'] = this.state.originZipCode || 0;
                      productData['mercariHashtags'] = this.state.mercariHashtags || '';
                      productData['companyBlurb'] = this.state.companyBlurb || '';
                      productData['flatShippingRules'] = this.state.flatShippingRules || [];
                      productData['domesticShippingFreeShippingActive'] = this.state.freeShippingActive || false;
                      productData['calculatedShippingActive'] = this.state.calculatedShippingActive || false;
                      productData['bestOfferActive'] = this.state.bestOfferActive || false;
                      productData['ebay']['ebayPayPalEmailActive'] = this.state.ebayPayPalEmailActive || false;
                      productData['ebay']['ebayPayPalEmail'] = this.state.ebayPayPalEmail || '';
                      productData['ebayAutoPayActive'] = this.state.ebayAutoPayActive || false;
                      productData['bestOfferAcceptFloorActive'] = this.state.bestOfferSettings.isOfferAccepted || false;
                      productData['bestOfferDeclineCeilingActive'] = this.state.bestOfferSettings.isOfferDeclined || false;

                      if(this.state.bestOfferSettings === undefined || !this.state.bestOfferSettings.acceptOfferOf)
                      {
                        productData['bestOfferAcceptFloorValue'] = 0;
                      }
                      else
                      {
                        productData['bestOfferAcceptFloorValue'] = (this.state.bestOfferSettings.acceptOfferOf/100) * productData['price'];
                      }

                      if(this.state.bestOfferSettings === undefined || !this.state.bestOfferSettings.declineOfferOf)
                      {
                        productData['bestOfferDeclineCeilingValue'] = 0;
                      }
                      else
                      {
                        productData['bestOfferDeclineCeilingValue'] = (this.state.bestOfferSettings.declineOfferOf/100) * productData['price'];
                      }

                      productData['clientSettingsLoaded'] = true;

                  })
                  .catch((err) => console.log(err));
              this.setState({isClientListingSettingsLoading: false});
            }
            else if(productData['clientSettingsLoaded'])
            {
              Axios.get(`/listingSettings/${clientid}`)
                   .then(({ data }) => {
                    if(data && data.settings[0])
                    {
                      this.setState({clientListingSettings: data.settings[0]})
                    }
                    })
              this.setState({doesClientListingSettingsExist: true});
              this.setState({isClientListingSettingsLoading: false});
            }

    this.setState({data:productData});
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
    clientEbayADCampaignDropDownItems 
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

  onSubmit(e,  queuePlacement, action) {
    e.preventDefault();
    const { data, images, clientid, productid } = this.state;
    var { extraMeasures, extraDescriptions } = this.state;
    var dataform = new FormData();
    var imagedata = new FormData();

    this.setState({ isSubmitting: true });

    var y = [];
    this.state.others.forEach((o, i) => {
      let obj = {name: o, status: this.state.othersstate[i], url: this.state.othersurl[i] ? this.state.othersurl[i] : ""};
      y.push(obj);
    });

    if(this.state.data['domesticShippingFreeShippingActive'])
    {
      this.state.data['domesticShippingCost'] = 0;
      this.state.data['domesticShippingSurcharge'] = 0;
      this.state.data['domesticShippingEachAdditional'] = 0;
    }

    if(this.state.data['internationalShippingFreeShippingActive'])
    {
      this.state.data['internationalShippingCost'] = 0;
      this.state.data['internationalShippingSurcharge'] = 0;
      this.state.data['internationalShippingEachAdditional'] = 0;
    }

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

      if(data.ebay.ebayListingType === 'FixedPriceItem')
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
        this.state.data['ebay']['ebayDomesticShippingService'] = data.domesticClientShippingPolicy.shippingOptions[0].shippingServices[0].shippingServiceCode ? data.domesticClientShippingPolicy.shippingOptions[0].shippingServices[0].shippingServiceCode : '';
      }
      else
      {
        if(data.domesticShippingService) this.state.data['ebay']['ebayDomesticShippingService'] = data.domesticShippingService.ShippingService ? data.domesticShippingService.ShippingService : '';
      }

      if(data.internationalClientShippingPolicy && data.domesticClientShippingPolicy.shippingOptions !== undefined && data.domesticClientShippingPolicy.shippingOptions[1] !== undefined && data.domesticClientShippingPolicy.shippingOptions[1].shippingServices !== undefined && data.domesticClientShippingPolicy.shippingOptions[1].shippingServices[0] !== undefined && data.domesticClientShippingPolicy.shippingOptions[1].shippingServices[0].shippingServiceCode)
      {
        this.state.data['ebay']['ebayInternationalShippingService'] = data.internationalClientShippingPolicy.shippingOptions[1].shippingServices[0].shippingServiceCode ? data.internationalClientShippingPolicy.shippingOptions[1].shippingServices[0].shippingServiceCode : '';
      }
      else
      {
        if(data.internationalShippingService) this.state.data['ebay']['ebayInternationalShippingService'] = data.internationalShippingService.ShippingService ? data.internationalShippingService.ShippingService : '';
      }

      this.state.data['ebay']['ebayDomesticShippingCost'] = data.domesticShippingCost ? data.domesticShippingCost : 0;
      this.state.data['ebay']['ebayDomesticShippingEachAdditional'] = data.domesticShippingEachAdditional ? data.domesticShippingEachAdditional : 0;
      this.state.data['ebay']['ebayDomesticShippingSurcharge'] = data.domesticShippingSurcharge ? data.domesticShippingSurcharge : 0;

      this.state.data['ebay']['ebayInternationalShippingCost'] = data.internationalShippingCost ? data.internationalShippingCost : 0;
      this.state.data['ebay']['ebayInternationalShippingEachAdditional'] = data.internationalShippingEachAdditional ? data.internationalShippingEachAdditional : 0;
      this.state.data['ebay']['ebayInternationalShippingSurcharge'] = data.internationalShippingSurcharge ? data.internationalShippingSurcharge : 0;

      if(data.promotedListingActive) this.state.data['ebay']['ebayPromotedListingActive'] = data.promotedListingActive;
      if(data.promotedListingPercentage) this.state.data['ebay']['ebayPromotedListingPercentage'] = data.promotedListingPercentage;
      if(data.ebayCampaign && data.ebayCampaign !== 'None' && data.ebayCampaign !== undefined) this.state.data['ebay']['ebayADCampaign'] = data.ebayCampaign;
    }

    let multiformEbayADCampaign;
    let multiformEbayCampaign;
    let multiformEbayCategoryField;
    let multiformInternationalShippingService;
    let multiformInternationalClientShippingPolicy;
    let multiformDomesticShippingService;
    let multiformDomesticClientShippingPolicy;
    let multiformExtraMeasures;
    let multiformExtraDescriptions;

    if(data.ebay.ebayADCampaign && data.ebay.ebayADCampaign.campaignId) multiformEbayADCampaign = JSON.stringify(data.ebay.ebayADCampaign);
    if(data.ebayCampaign && data.ebayCampaign.campaignId) multiformEbayCampaign = JSON.stringify(data.ebayCampaign);
    if(data.ebayCategoryField && data.ebayCategoryField.categoryId && data.ebayCategoryField.categoryName) multiformEbayCategoryField = JSON.stringify(data.ebayCategoryField);
    if(data.internationalShippingService && data.internationalShippingService.ShippingService) multiformInternationalShippingService = JSON.stringify(data.internationalShippingService);
    if(data.internationalClientShippingPolicy && data.internationalClientShippingPolicy.name) multiformInternationalClientShippingPolicy = JSON.stringify(data.internationalClientShippingPolicy);
    if(data.domesticShippingService && data.domesticShippingService.ShippingService) multiformDomesticShippingService = JSON.stringify(data.domesticShippingService);
    if(data.domesticClientShippingPolicy && data.domesticClientShippingPolicy.name) multiformDomesticClientShippingPolicy = JSON.stringify(data.domesticClientShippingPolicy);
    if(extraMeasures && extraMeasures.length > 1) multiformExtraMeasures = JSON.stringify(extraMeasures);
    if(extraDescriptions && extraDescriptions.length > 1) multiformExtraDescriptions = JSON.stringify(extraDescriptions);
    
    if(y && y.length > 1) y = JSON.stringify(y);
    else y = "";

    dataform.append("sku", data.sku);
    dataform.append("upc", data.upc);
    dataform.append("quantity", Number(data.quantity));
    dataform.append("price", Number(data.price));

    dataform.append("extraMeasures", multiformExtraMeasures);
    dataform.append("extraDescriptions", multiformExtraDescriptions);

    dataform.append("brand", data.brand);
    dataform.append("model", data.model);

    dataform.append("title", data.title);
    dataform.append("shortDescription", encodeURIComponent(data.shortDescription));
    dataform.append("condition_name", data.condition_name);

    dataform.append("mercari.title", data.mercari.title);
    dataform.append("poshmark.title", data.poshmark.title);
    dataform.append("delist.title", data.delist.title);
    dataform.append("mercari.check", data.mercari.check ? data.mercari.check : false);
    dataform.append("poshmark.check", data.poshmark.check ? data.poshmark.check : false);
    dataform.append("delist.check", data.delist.check ? data.delist.check : false);
    dataform.append("listed", (action === 'List' || action === 'Revise') ? true : false);
    dataform.append("activity", "Advance");
    dataform.append("action", action);

    dataform.append("size", Number(data.size));
    dataform.append("lotSize", Number(data.lotSize));
    dataform.append("category", data["category"]);

    dataform.append("givingWorksCharityID", Number(data.givingWorksCharityID));
    dataform.append("givingWorksDonationPercentage", Number(data.givingWorksDonationPercentage));
    dataform.append("storeCategoryOne", data.storeCategoryOne);
    dataform.append("storeCategoryTwo", data.storeCategoryTwo);

    dataform.append("listingDuration", data.listingDuration);

    dataform.append("inseam", Number(data.inseam));
    dataform.append("rise", Number(data.rise));
    dataform.append("waist", Number(data.waist));

    dataform.append("msrp", Number(data.msrp));
    dataform.append("mrp", Number(data.mrp));
    dataform.append("keywords", data.keywords);
    dataform.append("notes", data.notes);

    dataform.append("weightLB", Number(data.weightLB));
    dataform.append("weightOZ", Number(data.weightOZ));
    dataform.append("packageLength", Number(data.packageLength));
    dataform.append("packageWidth", Number(data.packageWidth));
    dataform.append("packageHeight", Number(data.packageHeight));

    dataform.append("costOfGoods", Number(data.costOfGoods));
    dataform.append("zipCode", data.zipCode);

    dataform.append("shippingFees", Number(data.shippingFees));
    dataform.append("domesticClientShippingPoliciesActive", data.domesticClientShippingPoliciesActive);
    dataform.append("domesticClientShippingPolicy", multiformDomesticClientShippingPolicy);
    dataform.append("domesticShippingService", multiformDomesticShippingService);
    dataform.append("domesticShippingCost", Number(data.domesticShippingCost));
    dataform.append("domesticShippingEachAdditional", Number(data.domesticShippingEachAdditional));
    dataform.append("domesticShippingSurcharge", Number(data.domesticShippingSurcharge));
    dataform.append("domesticShippingFreeShippingActive", data.domesticShippingFreeShippingActive);
    dataform.append("internationalClientShippingPoliciesActive", data.internationalClientShippingPoliciesActive);
    dataform.append("internationalClientShippingPolicy", multiformInternationalClientShippingPolicy);
    dataform.append("internationalShippingService", multiformInternationalShippingService);
    dataform.append("internationalShippingCost", Number(data.internationalShippingCost));
    dataform.append("internationalShippingEachAdditional", Number(data.internationalShippingEachAdditional));
    dataform.append("internationalShippingSurcharge", Number(data.internationalShippingSurcharge));
    dataform.append("internationalShippingFreeShippingActive", data.internationalShippingFreeShippingActive);
    dataform.append("calculatedShippingActive", data.calculatedShippingActive);
    dataform.append("calculatedShipping", Number(data.calculatedShipping));

    dataform.append("profit", Number(data.profit));
    dataform.append("status", true);
    dataform.append("note", data.note)
    dataform.append("madeIn", data.madeIn);
    dataform.append("gender", data.gender || "");
    dataform.append("others", y);

    dataform.append("bestOfferActive", data.bestOfferActive);
    dataform.append("bestOfferAcceptFloorActive", data.bestOfferAcceptFloorActive);
    dataform.append("bestOfferDeclineCeilingActive", data.bestOfferDeclineCeilingActive);
    dataform.append("bestOfferAcceptFloorValue", Number(data.bestOfferAcceptFloorValue));
    dataform.append("bestOfferDeclineCeilingValue", Number(data.bestOfferDeclineCeilingValue));

    dataform.append("compPriceSetting", data.compPriceSetting);
    dataform.append("compPriceIncreaseValue", Number(data.compPriceIncreaseValue));
    dataform.append("compPriceIncreaseMethod", data.compPriceIncreaseMethod);

    dataform.append("mercariHashtags", data.mercariHashtags);
    dataform.append("companyBlurb", data.companyBlurb);

    dataform.append("ebayCategoryField", multiformEbayCategoryField);
    dataform.append("ebayOptionalFieldsActive", data.ebayOptionalFieldsActive);

    dataform.append("promotedListingActive", data.promotedListingActive);
    dataform.append("promotedListingPercentage", Number(data.promotedListingPercentage));
    dataform.append("ebayCampaign", multiformEbayCampaign);

    dataform.append("clientSettingsLoaded", data.clientSettingsLoaded);

    dataform.append("isListingGood", data.isListingGood);

    ////////////////////EBAY////////////////////////////////
    dataform.append("ebay.title", data.ebay.title);
    dataform.append("ebay.check", data.ebay.check ? data.ebay.check : false);

    dataform.append("ebay.ebayCategoryID", Number(data.ebay.ebayCategoryID));
    dataform.append("ebay.ebayConditionID", Number(data.ebay.ebayConditionID)); //https://developer.ebay.com/devzone/finding/callref/enums/conditionIdList.html

    dataform.append("ebay.ebayListingType", data.ebay.ebayListingType); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ListingTypeCodeType.html
    dataform.append("ebay.ebayListingDuration", data.ebay.ebayListingDuration); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ListingDurationCodeType.html

    dataform.append("ebay.ebayAutoPayActive", data.ebay.ebayAutoPayActive);
    dataform.append("ebay.ebayPaymentMethod", data.ebay.ebayPaymentMethod); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/BuyerPaymentMethodCodeType.html https://developer.ebay.com/devzone/xml/docs/reference/ebay/extra/additm.rqst.itm.pymntmthds.html Paypal or Autopay.
    dataform.append("ebay.ebayPayPalEmail", data.ebay.ebayPayPalEmail);
    dataform.append("ebay.ebayPayPalEmailActive", data.ebay.ebayPayPalEmailActive);

    dataform.append("ebay.ebayGlobalShippingActive", data.ebay.ebayGlobalShippingActive);
    dataform.append("ebay.ebaySellerShippingPolicyID", Number(data.ebay.ebaySellerShippingPolicyID));
    dataform.append("ebay.ebaySellerShippingPolicyName", data.ebay.ebaySellerShippingPolicyName);

    dataform.append("ebay.ebayDomesticShippingType", data.ebay.ebayDomesticShippingType); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingTypeCodeType.html
    dataform.append("ebay.ebayDomesticShippingService", data.ebay.ebayDomesticShippingService); // https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingServiceCodeType.html
    dataform.append("ebay.ebayDomesticShippingCost", Number(data.ebay.ebayDomesticShippingCost));
    dataform.append("ebay.ebayDomesticShippingEachAdditional", Number(data.ebay.ebayDomesticShippingEachAdditional));
    dataform.append("ebay.ebayDomesticShippingSurcharge", Number(data.ebay.ebayDomesticShippingSurcharge));
    dataform.append("ebay.ebayDomesticShippingFreeShippingActive", data.ebay.ebayDomesticShippingFreeShippingActive);

    dataform.append("ebay.ebayInternationalShippingService", data.ebay.ebayInternationalShippingService); // https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingServiceCodeType.html
    dataform.append("ebay.ebayInternationalShippingType", data.ebay.ebayInternationalShippingType); //https://developer.ebay.com/devzone/xml/docs/reference/ebay/types/ShippingTypeCodeType.html
    dataform.append("ebay.ebayInternationalShippingCost", Number(data.ebay.ebayInternationalShippingCost));
    dataform.append("ebay.ebayInternationalShippingEachAdditional", Number(data.ebay.ebayInternationalShippingEachAdditional));
    dataform.append("ebay.ebayInternationalShippingSurcharge", Number(data.ebay.ebayInternationalShippingSurcharge));
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
    dataform.append("ebay.ebayPromotedListingPercentage", Number(data.ebay.ebayPromotedListingPercentage));
    dataform.append("ebay.ebayADCampaign", multiformEbayADCampaign);
    ////////////////////EBAY///////////////////////////////

    let alertString = "Product Was";

    switch(action)
    {
      case "Delete":
            alertString += ' Deleted And Is Now';
            break;
      case "Save":
            alertString += ' Saved And Is Now';
            break;
      case "List":
            alertString += ' Listed And Is Now';
            break;
      case "Move":
            alertString += ' Moved And Is Now';
            break;
      case "Revise":
            alertString += ' Revised And Is Now';
            break;
      case "Delist":
            alertString += ' Delisted And Is Now';
            break;
      default:
            alertString += ' Moved And Is Now';
            break;
    }

    switch(queuePlacement)
    {
      case "submitted":
            alertString += ' Marked As Submitted';
            dataform.append("prodStatus", "submitted");
            break;
      case "inventory":
            alertString += ' Marked As Inventory';
            dataform.append("prodStatus", "inventory");
            break;
      case "draft":
            alertString += ' Marked As A Draft';
            dataform.append("prodStatus", "draft");
            break;
      case "current":
            if(data.prodStatus === undefined || data.prodStatus === null || data.prodStatus.length === 0) data.prodStatus = "submitted";
            else if(data.prodStatus === 'draft') alertString += ' Marked As A Draft';
            else alertString += ' Marked As ' + data.prodStatus;
            dataform.append("prodStatus", data.prodStatus);
            break;
      default:
            alertString += ' Marked As Submitted';
            dataform.append("prodStatus", "submitted");
            break;
    }

    if (this.state.ebayurl !== "" && this.state.ebayurl !== null && this.state.ebayurl !== "d") dataform.append("ebay.url", data["ebay"]["url"]);
    if (this.state.poshmarkurl !== "" && this.state.poshmarkurl !== null && this.state.poshmarkurl !== "d") dataform.append("poshmark.url", data["poshmark"]["url"]);
    if (this.state.mercariurl !== "" && this.state.mercariurl !== null && this.state.mercariurl !== "d") dataform.append("mercari.url", data["mercari"]["url"]);

    Axios.put(`/product/validateProduct`, dataform, {headers: {"Content-Type": "multipart/form-data"}}).then(async(response) => {
        var imageid = {};
        var imagedata = new FormData();

              await Promise.all(images.filter(image => !!image.img).map(async(image) => {if(!!image.img)
              {
                if(typeof image.img === 'object')
                {
                  imagedata = new FormData();
                  imagedata.append(image.key, image.img);
                  Axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
                  Axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
                  let response = await Axios.get("https://bgremove-dot-hammock-272305.wl.r.appspot.com/", imagedata, {headers: {"Content-Type": "multipart/form-data"}}).catch((err) => {this.setState({ isSubmitting: false });console.log(err);});
                  imageid[image.key] = response.data.imageid ? response.data.imageid : image.img;
                }
                else
                {
                  imageid[image.key] = image.img;
                }
              }}));

              dataform.append("images", JSON.stringify(imageid));
              
              Axios.put(`/product/${clientid}/${productid}`, dataform, {headers: {"Content-Type": "multipart/form-data"}})
                   .then((response) => {
                          if(response && response.Information && response.Information.EbayURL) alertString = alertString + "\n" + response.Information.EbayURL;
                          alert(alertString);
                      })
                      .catch((err) => {
                        this.setState({ isSubmitting: false });
                        if(err && err.response && err.response.data && err.response.data.Error && err.response.data.Error.errorMessage) alert(err.response.data.Error.errorMessage);
                        console.log(err.response);
                      });
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        if(err.response && err.response.data)
        {
          alert("Error: " + err.response.data.Error + "\n" + 
                "Type: " + err.response.data.Type + "\n" + 
                "Correction: " + err.response.data.Correction + "\n" +
                "Message: " + err.response.data.OtherMessage);
        }
        console.log(err);
      });
  };

  skuSearch() {
    const { sku, clientid } = this.state;
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

  handleChange(e) {
    const { name, value } = e.target;
    const { data, bestOfferSettings, clientEbayADCampaign, clientid, agentid, adminid } = this.state;

    if (name === "price")
    {
      data["profit"] = (value - data["costOfGoods"] - data["otherCosts"] - (data["price"] * (data["promotedListingPercentage"] > 0 ? data["promotedListingPercentage"]/100 : 0))) * data["quantity"];

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
      data["profit"] = (data["price"] - value - data["otherCosts"] - (data["price"] * (data["promotedListingPercentage"] > 0 ? data["promotedListingPercentage"]/100 : 0))) * data["quantity"];
    }

    if (name === "otherCosts")
    {
      data["profit"] = (data["price"] - data["costOfGoods"] - value - (data["price"] * (data["promotedListingPercentage"] > 0 ? data["promotedListingPercentage"]/100 : 0))) * data["quantity"];
    }

    if (name === "promotedListingPercentage")
    {
      data["profit"] = (data["price"] - data["costOfGoods"] - data["otherCosts"] - (data["price"] * (value > 0 ? value/100 : 0))) * data["quantity"];
    }

    if (name === "quantity")
    {
      data["profit"] = (data["price"] - data["costOfGoods"] - data["otherCosts"] - (data["price"] * (data["promotedListingPercentage"] > 0 ? data["promotedListingPercentage"]/100 : 0))) * value;
    }

    if (name === 'ebayCampaign')
    {
      data['ebayCampaign'] = clientEbayADCampaign[value];
    }

    data[name] = value;
    this.setState({ data });
  };

  handleMarketPlaceDataChange(event, market, field)
  {
    const { value } = event.target;
    const { data } = this.state;

    data[market][field] = value;
    this.setState({ data });
  }

  handleEbayClientShippingChange(e, v) {
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
          data['domesticShippingSurcharge'] = 0.0;
          data['domesticShippingEachAdditional'] = 0.0;
        }

        if(v.shippingOptions[0].shippingServices && v.shippingOptions[0].shippingServices[0] !== undefined) data['domesticShippingFreeShippingActive'] = v.shippingOptions[0].shippingServices[0].freeShipping;

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] !== undefined)
        {
          data['internationalShippingFreeShippingActive'] = v.shippingOptions[1].shippingServices[0].freeShipping;
          data['internationalShippingCost'] = 0.0;
          data['internationalShippingSurcharge'] = 0.0;
          data['internationalShippingEachAdditional'] = 0.0;
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
          data['domesticShippingSurcharge'] = 0.0;
          data['domesticShippingEachAdditional'] = 0.0;
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
          data['internationalShippingSurcharge'] = 0.0;
          data['internationalShippingEachAdditional'] = 0.0;
        }

        if(v.shippingOptions[1].shippingServices && v.shippingOptions[1].shippingServices[0] && !v.shippingOptions[1].shippingServices[0].freeShipping) data['internationalShippingFreeShippingActive'] = false;

        data['ebay']['ebaySellerShippingPolicyID'] = v.fulfillmentPolicyId;
        data['ebay']['ebaySellerShippingPolicyName'] = v.name;
      }
    }

    this.setState({data}); 
  }

  handleZeroFix(fieldName)
  {
    var { data } = this.state;
    if(isNaN(data[fieldName]))
    {
      data[fieldName] = 0;
      return '';
    }
    else 
    {
        if(Number(data[fieldName]) === 0)
        {
          return '';
        } 
        else 
        {
          return(data[fieldName]);
        }
    }
    this.setState({data});
  }

  handleCampaignSelect(e, v)
  {
    const { data } = this.state
    data['ebayCampaign'] = v;
    this.setState({data});
  }

  handleShippingChange(e, v, name)
  {
    const { data } = this.state;
    data['ebay'][e.target.name] = v.ShippingService;
    data[name] = v;
    this.setState({ data });
  };

  handleOtherTitles(e)
  {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["title"] = value;
    this.setState({ data });
  };

  handleUrl(e)
  {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["url"] = value;
    this.setState({ data });
  };

  handleMeasureLabel(id, e)
  {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.forEach((measure) => {
      if (measure.id === id) {
        measure.label = value;
      }
    });
    this.setState({ extraMeasures });
  };

  handleDescriptionLabel(id, e)
  {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.key = value;
      }
    });
    this.setState({ extraDescriptions });
  };

  handleMeasureChange(id, e)
  {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.forEach((measure) => {
      if (measure.id === id) {
        measure.val = value;
      }
    });
    this.setState({ extraMeasures });
  };

  addMeasure(e)
  {
    const { extraMeasures, count } = this.state;
    extraMeasures.push({ label: "", val: "", id: count });
    this.setState({ extraMeasures });
    this.setState({ count: count + 1 });
  };

  removeMeasure(id, e)
  {
    const { extraMeasures, count } = this.state;

    this.setState({
      extraMeasures: extraMeasures.filter((measure) => {
        return measure.id !== id;
      }),
    });
    this.setState({ count: count - 1 });
  };

  toggleSelectedWebsite(str)
  {
    const { data } = this.state;
    data[str]["check"] = !data[str]["check"];
    this.setState({ data });
  };

  toggleSelectedOthersWebsite(i)
  {
    const { othersstate } = this.state;
    othersstate[i] = !othersstate[i];
    this.setState({ othersstate });
  };

  async handleImageChange(event){
    const { images } = this.state;

    const idx = images.findIndex((image) => image.key === event.target.name);
    try {
      this.setState({ isSubmitting: true });
      images[idx].img = event.target.files[0];
      images[idx].URL = URL.createObjectURL(event.target.files[0]);
      this.setState({images});
      this.setState({ isSubmitting: false });
    } 
    catch (error) 
    {
      console.log(error);
    }
  };

  async handleBulkUpload(e)
  {
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
          images[idx].URL = URL.createObjectURL(files[i]);
          this.setState({ images });
        } 
        catch (error) 
        {
          console.log(error);
        }
      }
    }
    this.setState({ isSubmitting: false });
  };

  handleToggleButton(booleanValue, name)
  {
    const { data } = this.state;

    data[name] = !booleanValue;

    this.setState({ data });
    this.setState({ editchange: true });
  }

  handleCheckboxToggle(booleanValue, name)
  {
    var { data } = this.state;

    data[name] = booleanValue;

    if(name === 'promotedListingActive')
    {
      data['promotedListingPercentage'] = 0;
    }

    this.setState({ data });
    this.setState({ editchange: true });
  }

  removeImg(idx)
  {
    const { images } = this.state;
    images[idx].img = "";
    this.setState({ images });
  };

  skuChange(e)
  {
    this.setState({ sku: e.target.value });
  };

  clearExtraDescriptions()
  {
    this.setState({ extraDescriptions: [] });
    this.setState({ deletedDescriptions: [] });
  };

  handleSelectedLeaf(itemAspectsArray)
  {
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

  handleSelectedEbayCategory(category)
  {
    var { data } = this.state;
    if(category && category.categoryId)
    {
      const url = "/ebay/itemAspects/" + category.categoryId;

      data['ebay']['ebayCategoryID'] = category.categoryId;
      Axios.get(url)
           .then((response) => response.data)
           .then((data) => {
                  this.handleSelectedLeaf(data);
            })
           .catch((err) => console.log(err));
    }

    data['ebayCategoryField'] = category;
    this.setState({ data });
  };

  //TODO; Refactor for supporting any array. 
  handleDescriptionLabel(id, e)
  {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.key = value;
      }
    });
    this.setState({ extraDescriptions });
  };

  handleDescriptionChange(id, value)
  {
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.value = value;
      }
    });
    this.setState({ extraDescriptions });
  };

  addDescription()
  {
    const { extraDescriptions, count1 } = this.state;
    extraDescriptions.push({ key: "", value: "", id: count1 });
    this.setState({ extraDescriptions });
    this.setState({ count1: count1 + 1 });
  };

  arrayFilterStorage(item, filterValue)
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

  removeDescription(id, e)
  {
    const { extraDescriptions } = this.state;
    this.setState({extraDescriptions: extraDescriptions.filter((description) => {return this.arrayFilterStorage(description, id)})});
  };

  toggleOptional()
  {
    var { data } = this.state;
    data['ebayOptionalFieldsActive'] = !data.ebayOptionalFieldsActive;
    this.setState({ data });
  };

  setEbayCategoryField(categoryName)
  {
    var { data } = this.state
    data['ebayCategoryField'] = categoryName;
    this.setState({ data });
  };

  repopulateExtraDescriptions()
  {
    var { extraDescriptions, deletedDescriptions } = this.state;
    var concatenatedArray = extraDescriptions.concat(deletedDescriptions);
    this.setState({deletedDescriptions: []});
    this.setState({extraDescriptions:concatenatedArray});
  }

  priceCalculation()
  {
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
        data["profit"] = data["price"] - data["costOfGoods"] - data["otherCosts"] - (data["price"] * (data["promotedListingPercentage"] > 0 ? data["promotedListingPercentage"]/100 : 0));
      }
      if(data['compPriceIncreaseMethod'] === 'percent')
      {
        data['price'] = parseFloat(data['price']) + (parseFloat(data['price']) * (parseFloat(data['compPriceIncreaseValue'])/100));
        data["profit"] = data["price"] - data["costOfGoods"] - data["otherCosts"] - (data["price"] * (data["promotedListingPercentage"] > 0 ? data["promotedListingPercentage"]/100 : 0));
      }
    }
    this.setState({data});
  };

  render() {
    const { Axios, assetsURL, assetsThumbnailURL } = this.props;
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
      doesClientListingSettingsExist,
      imgAssets,
      imgThumbnailAssets,
      imgObjectURL,
      clientListingSettings
    } = this.state;

	  return (
	    <div className='app'>
	      <div className='app__body'>
        <div style={{'display':'flex', 'alignItems': 'flex-start'}}>
        </div>
          <div className='left__app'>
            <EbayCategoryModal
              ref={this.ebayRef}
              Axios={Axios}
              onSelectedLeafModalClose={this.handleSelectedLeaf}
              setSelectedCategoryField={this.handleSelectedEbayCategory}
            />
  	        <Images
              key='Images'
              nanoid={nanoid}
              data={data}
              images={images}
              removeImg={this.removeImg}
              handleBulkUpload={this.handleBulkUpload}
              handleImageChange={this.handleImageChange}
              Axios={Axios}
              assetsURL={assetsURL}
              assetsThumbnailURL={assetsThumbnailURL}
              imgAssets={imgAssets}
              imgThumbnailAssets={imgThumbnailAssets}
              imgObjectURL={imgObjectURL}
            />

            <StoreToggles
              key='StoreToggles'
              nanoid={nanoid}
              data={data}
              handleChange={this.handleChange}
              Ebay={Ebay}
              Poshmark={Poshmark}
              Mercari={Mercari}
              others={others}
              toggleSelectedOthersWebsite={this.toggleSelectedOthersWebsite}
              toggleSelectedWebsite={this.toggleSelectedWebsite}
            />

            <LeftSideTextBoxes
              key='LeftSideTextBoxes'
              nanoid={nanoid}
              data={data}
              extraDescriptions={extraDescriptions}
              extraMeasures={extraMeasures}
              handleChange={this.handleChange}
            />

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="listingSettingsAccordion"
                id="listingSettingsAccordion"
                style={{'background-color':'#007df0', 'color':'white'}}
              >
                <Typography style={{'fontSize': 'theme.typography.pxToRem(15)', 'fontWeight': 'theme.typography.fontWeightRegular'}}>Manual Listing Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ListingSettingsTable
                  key='ListingSettingsTable'
                  nanoid={nanoid}
                  data={data}
                  isClientListingSettingsLoading={isClientListingSettingsLoading}
                  doesClientListingSettingsExist={doesClientListingSettingsExist}
                  clientListingSettings={clientListingSettings}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="DataStatusAccordion"
                id="DataStatusAccordion"
                style={{'background-color':'#007df0', 'color':'white'}}
              >
                <Typography style={{'fontSize': 'theme.typography.pxToRem(15)', 'fontWeight': 'theme.typography.fontWeightRegular'}}>Data Status</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DataMonitorTable
                  key='DataMonitorTable'
                  nanoid={nanoid}
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
              </AccordionDetails>
            </Accordion>
          </div>

          <div className='right__app'>
  	        <RightSectionTop
              key='RightSectionTop'
              nanoid={nanoid}
  	          data={data}
  	          handleChange={this.handleChange}
              handleOtherTitles={this.handleOtherTitles}
              handleUrl={this.handleUrl}
              handleToggleButton={this.handleToggleButton}
              handleMarketPlaceDataChange={this.handleMarketPlaceDataChange}
              Axios = {Axios}
            />

            <Details
              key='Details'
              nanoid={nanoid}
              data={data}
              handleChange={this.handleChange}
              handleCheckboxToggle={this.handleCheckboxToggle}
              handleCampaignSelect={this.handleCampaignSelect}
              priceCalculation={this.priceCalculation}
              clientEbayADCampaignDropDownItems={clientEbayADCampaignDropDownItems}
              handleZeroFix={this.handleZeroFix}
            />

            <ProductDetails
              key='ProductDetails'
              nanoid={nanoid}
              data={data}
              handleChange={this.handleChange}
              extraMeasures={extraMeasures}
              extraDescriptions={extraDescriptions}
              toggleOptional={this.toggleOptional}
              clearExtraDescriptions={this.clearExtraDescriptions}
              repopulateExtraDescriptions={this.repopulateExtraDescriptions}
              addMeasure={this.addMeasure}
              removeMeasure={this.removeMeasure}
              removeDescription={this.removeDescription}
              handleDescriptionChange={this.handleDescriptionChange}
              handleDescriptionLabel={this.handleDescriptionLabel}
              handleMeasureChange={this.handleMeasureChange}
              handleMeasureLabel={this.handleMeasureLabel}
              handleZeroFix={this.handleZeroFix}
            />

            <GeneralSettings
              key='GeneralSettings'
              nanoid={nanoid}
              data={data}
              handleChange={this.handleChange}
              handleCheckboxToggle={this.handleCheckboxToggle}
              handleCampaignSelect={this.handleCampaignSelect}
              handleSelectedEbayCategory={this.handleSelectedEbayCategory}
              ebayCategoryDropDownItems={ebayCategoryDropDownItems}
              clearExtraDescriptions={this.clearExtraDescriptions}
              Axios={Axios}
              ebayRef={this.ebayRef}
              handleZeroFix={this.handleZeroFix}
            />

            <DomesticShipping
              key='DomesticShipping'
              nanoid={nanoid}
              data={data}
              handleChange={this.handleChange}
              handleShippingChange={this.handleShippingChange}
              handleEbayClientShippingChange={this.handleEbayClientShippingChange}
              handleCheckboxToggle={this.handleCheckboxToggle}
              toggleOptional={this.toggleOptional}
              clientEbayShippingDomesticDropDownItems={clientEbayShippingDomesticDropDownItems}
              shippingDomesticDropDownItems={shippingDomesticDropDownItems}
              handleZeroFix={this.handleZeroFix}
            />

            <InternationalShipping
              key='InternationalShipping'
              nanoid={nanoid}
              data={data}
              handleChange={this.handleChange}
              handleShippingChange={this.handleShippingChange}
              handleEbayClientShippingChange={this.handleEbayClientShippingChange}
              handleCheckboxToggle={this.handleCheckboxToggle}
              toggleOptional={this.toggleOptional}
              clientEbayShippingInternationalDropDownItems={clientEbayShippingInternationalDropDownItems}
              shippingInternationalDropDownItems={shippingInternationalDropDownItems}
              handleZeroFix={this.handleZeroFix}
            />

            <div style={{'display':'flex'}}>
              <BestOffer
                key='BestOffer'
                nanoid={nanoid}
                data={data}
                handleChange={this.handleChange}
                handleCheckboxToggle={this.handleCheckboxToggle}
                handleZeroFix={this.handleZeroFix}
              />
              <ControllerButtons
                key='ControllerButtons'
                nanoid={nanoid}
                data={data}
                handleChange={this.handleChange}
                onSubmit={this.onSubmit}
              />
            </div>

          </div>
	      </div>
	    </div>
	  );
	}
}