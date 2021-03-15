import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Axios from "../../../../services/Axios";
import "./RightSection.css";
import Poshmarkimg from "./images/poshmark.png";
import Ebayimg from "./images/ebay.png";
import Mercariimg from "./images/mercari.png";
import EbayCategoryModal from "../ebayModal";
import { Autocomplete, ToggleButton } from "@material-ui/lab";
import { useTheme /*makeStyles*/ } from "@material-ui/core/styles";
import { Typography, useMediaQuery, ListSubheader, TextField, Select, SvgIcon } from "@material-ui/core";
import { VariableSizeList } from "react-window";
const max = 5000;

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props,ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) 
    {
      return 8 * itemSize;
    }
    else if(itemCount > 0 && itemCount < 8)
    {
      return itemCount * itemSize;
    }
    else
    {
      return 0;
    }
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width='100%'
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType='ul'
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

//const useStyles = makeStyles({
//  listbox: {
//    boxSizing: 'border-box',
//    '& ul': {
//      padding: 0,
//      margin: 0,
//    },
//  },
//});

const renderGroup = (params) => [
  <ListSubheader key={params.key} component='div'>
    {params.group}
  </ListSubheader>,
  params.children,
];

class RightSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestTitles: false,
      showOtherTitles: false,
      selectedWebsites: [],
      ebayCategory: "",
      category: "",
      showMoreLines: false,
      value: "",
      count: 0,
      custom: true,
      title: "",
      desc: "",
      msgFormToggle: false,
      msgFormTitle: "",
      msgFormDescription: "",
      curTime: new Date(),
      anchorEl: null,
      productMessage: [],
      field: "",
      currentSuggestion: [],
      gtin: "",
    };
    this.ebayRef = React.createRef();
  }

  componentWillMount() {
    if ("custom" in localStorage) {
      let custom = localStorage.getItem("custom");
      this.setState({ custom: custom === "true" });
    }
  }

/*  handleMessage = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleMessageSubmit = async () => {
    const productId = this.props.productid;
    const clientId = this.props.clientid;
    const formData = {
      msgformTitle: this.state.msgFormTitle,
      senderName: `agent: ${localStorage.getItem("agentName")}`,
      msgFormDescription: this.state.msgFormDescription,
      field: this.state.field,
    };
    try {
      const response = await Axios.post(
        `/message/${clientId}/${productId}`,
        formData,
        {
          headers: {
            "content-type": "application/json",
            headers: localStorage.getItem("agent"),
          },
        }
      );
      console.log(response);
      this.setState({ anchorEl: null });
    } catch (error) {
      console.log(error);
    }
  };

    handleMessageData = async (value, event) => {
    //console.log(value,"value")
    const productId = this.props.productid;
    const clientId = this.props.clientid;
    const msgFormToggle = this.state.msgFormToggle;
    const anchorEl = event.currentTarget;
    //console.log(anchorEl)
    try {
      const response = await Axios.get(
        `/message/${clientId}/${productId}/${value}`,
        {
          headers: {
            "content-type": "application/json",
            headers: localStorage.getItem("agent"),
          },
        }
      );
      this.setState({
        productMessage: response.data.message,
        msgFormToggle: !msgFormToggle,
        msgFormTitle: `was : ${this.props.data[value]}`,
        field: value,
        anchorEl,
      });
    } catch (error) {
      console.log(error);
    }
  };*/

  setCategory = (str) => {
    const { data } = this.props;
    if (this.state.category === str) {
      data["category"] = "";
      this.setState({ category: "" });
    } else {
      data["category"] = str;
      this.setState({ category: str });
    }
  };

  handleClick = (event) => {
    this.setState({ anchorE1: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  customtitle = (e) => {
    const { custom } = this.state;
    const { data } = this.props;
    localStorage.setItem("custom", !custom);
    this.setState({ custom: !custom });
    if (data.title) {
      let title = data.title;
      this.setState({ title });
      data.title = title.trim();
    }
  };

  handleChangeLocal = (e) => {
    let change = {};
    change[e.target.id] = e.target.value;
    this.setState(change);
  };

  ebayGTINCall = () => {
  const { gtin } = this.state;
  const url = "/ebay/lookUpForUPCISBN/" + gtin;
  Axios.get(url)
    .then((response) => response.data)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
  };

  render = () => {
    const {
      custom,
      showOtherTitles,
      gtin,
    } = this.state;

    const {
      data,
      handleChange,
      addMeasure,
      addDescription,
      extraMeasures,
      handleDescriptionChange,
      handleDescriptionLabel,
      removeDescription,
      handleMeasureChange,
      handleMeasureLabel,
      removeMeasure,
      handleSelectedLeaf,
      handleSelectedEbayCategory,
      handleOtherTitles,
      handleUrl,
      handleCheckboxToggle,
      handleToggleButton,
      showcat,
      ebayCategoryDropDownItems,
      onSubmit,
      extraDescriptions,
      toggleOptional,
      clearExtraDescriptions,
      setEbayCategoryField,
      repopulateExtraDescriptions,
      priceCalculation,
      shippingDropDownItems,
      shippingDomesticDropDownItems,
      shippingInternationalDropDownItems,
      handleShippingChange,
      handleMarketPlaceDataChange
    } = this.props;

    if(data.isListingGood === undefined)
    {
      data.isListingGood = false;
    }
    if(data.ebayOptionalFieldsActive === undefined)
    {
      data.ebayOptionalFieldsActive = false;
    }

    if (custom === false) {
      data.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.style,
        data.pattern,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.ebay.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.style,
        data.pattern,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.poshmark.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.mercari.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
    }

    return (
      <div className='right__app'>
        <EbayCategoryModal
          ref={this.ebayRef}
          onSelectedLeafModalClose={handleSelectedLeaf}
          setSelectedCategoryField={setEbayCategoryField}
        />
        <div>
          {/* Product Titles */}
          <div className='d-flex align-items-center mb-1'>
            <div className='h6 fw-500 text-uppercase mt-3'>Product Title </div>
            <i className='fas fa-question-circle c-pointer text-secondary ml-2 mt-2'></i>
            <button
              className={
                custom
                  ? "btn btn-success ml-2 mt-2 btn-sm"
                  : "btn btn-warning ml-2 mt-2 btn-sm"
              }
              onClick={this.customtitle}
            >
              Custom Title
            </button>
          </div>
          <div className='form-group row'>
            <div className='col-sm-8'>
              <input
                className='form-control form-control-sm'
                type='text'
                name='title'
                id='tite'
                value={data.title}
                onChange={handleChange}
                maxLength='140'
              />
              <small
                className='form-text text-muted'
                style={{ fontSize: "0.5em" }}
              >
                {data.title
                  ? custom
                    ? data.title.length
                    : data.title.length - 8
                  : null}
                /140 max characters
              </small>
            </div>
            <label
              className='col-sm-4 text-left col-form-label col-form-label-sm'
              onClick={() => {
                this.setState({ showOtherTitles: !showOtherTitles });
                let title=data.title;
                data.title=title.trim();
                data.ebay.title=data.title;
                data.poshmark.title=data.title;
                data.mercari.title=data.title;
              }}
            >
              <Link to='#'>{showOtherTitles ? "Hide" : "Show"} All Titles</Link>
            </label>
          </div>
          {showOtherTitles && (
            <div>
              <div className='form-group row'>
                <div className='col-sm-8'>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    name='ebay'
                    id='EbayTitleButton'
                    value={data["ebay"]["title"]}
                    onChange={handleOtherTitles}
                    maxLength='140'
                  />
                  <small
                    className='form-text text-muted'
                    style={{ fontSize: "0.5em" }}
                  >
                    {data.ebay.title ? data.ebay.title.length : null}/140 max
                    characters
                  </small>
                </div>
                <label
                  htmlFor='colFormLabelSm'
                  className='col-sm-4 text-left col-form-label col-form-label-sm'
                >
                  EBAY
                </label>
              </div>
              <div className='form-group row'>
                <div className='col-sm-8'>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    name='poshmark'
                    id='PoshmarkTitleButton'
                    value={data["poshmark"]["title"]}
                    onChange={handleOtherTitles}
                    maxLength='140'
                  />
                  <small
                    className='form-text text-muted'
                    style={{ fontSize: "0.5em" }}
                  >
                    {data.poshmark.title ? data.poshmark.title.length : null}140
                    max characters
                  </small>
                </div>
                <label
                  htmlFor='colFormLabelSm'
                  className='col-sm-4 text-left col-form-label col-form-label-sm'
                >
                  POSHMARK
                </label>
              </div>
              <div className='form-group row'>
                <div className='col-sm-8'>
                  <input
                    className='form-control form-control-sm'
                    type='text'
                    name='mercari'
                    id='MercariTitleButton'
                    value={data["mercari"]["title"]}
                    onChange={handleOtherTitles}
                    maxLength='140'
                  />
                  <small
                    className='form-text text-muted'
                    style={{ fontSize: "0.5em" }}
                  >
                    {data.mercari.title ? data.mercari.title.length : null}/140
                    max characters
                  </small>
                </div>
                <label
                  htmlFor='colFormLabelSm'
                  className='col-sm-4 text-left col-form-label col-form-label-sm'
                >
                  MERCARI
                </label>
              </div>
            </div>
          )}
          <div className='search__toggle'>
            <div className='right__search'>
              <input
                placeholder='   Search for UPC, ISBN, or EAN'
                id='gtin'
                type='text'
                className='right__search__container'
                value={gtin}
                onChange={(e) => this.handleChangeLocal(e)}
              ></input>
              <button
                className='right__search__button'
                onClick={this.ebayGTINCall}
              >
                Search
              </button>
            </div>
            <label>
            List:{"  "}
            <ToggleButton style={data.isListingGood ? ({color:'white', background:'green'}) : ({color:'white', background:'red'})} name='isListingGood' value={data.isListingGood} onClick={(e) => {handleToggleButton(data.isListingGood, 'isListingGood')}}>
            {data.isListingGood ? <SvgIcon><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></SvgIcon> : <SvgIcon><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></SvgIcon>}
            </ToggleButton>
            </label>
          </div>
          {/* ========================================================================================================== */}

          <div className='account__market'>
            <div className='account'>
              <label htmlFor='Account'>Account:</label>
              <select id='Account' name='Account' className='select__account'>
                <option value='USA'>USA</option>
                <option value='UK'>UK</option>
                <option value='India'>India</option>
                <option value='Aus'>Aus</option>
              </select>
            </div>

            {/* ========================================================================================================== */}

            <div className='market'>
              <label htmlFor='Market'>Market:</label>
              <select id='Market' name='Market' className='select__market'>
                <option value='Ebay'>Ebay</option>
                <option value='Poshmark'>Poshmark</option>
                <option value='Mercari'>Mercari</option>
              </select>
            </div>

          {/* ========================================================================================================== */}

            <div className='ebayListingType'>
              <label htmlFor='ebayListingType'>eBay Listing Type:</label>
              <select 
              id='ebayListingType' 
              name='ebayListingType' 
              className='select__market'
              value={data.ebay.ebayListingType}
              onChange={(e) => {handleMarketPlaceDataChange(e,'ebay','ebayListingType')}}>
                <option value='FixedPriceItem'>Fixed Price Item</option>
                <option value='Auction'>Auction</option>
              </select>
            </div>
          </div>

          {/* ========================================================================================================== */}

          <div className='urls'>
            <div className='the__url'>
              <img
                src={Ebayimg}
                alt='ebay'
                width='28'
                height='25'
                className='imgcls'
              />
              <input
                placeholder='Ebay URL'
                type='text'
                className='the__url_input'
                value={data["ebay"]["url"]}
                onChange={handleUrl}
              ></input>
            </div>

            <div className='the__url'>
              <img
                src={Poshmarkimg}
                alt='ebay'
                width='25'
                height='25'
                className='imgcls'
              />
              <input
                placeholder='Poshmark URL'
                type='text'
                className='the__url_input'
                value={data["poshmark"]["url"]}
                onChange={handleUrl}
              ></input>
            </div>

            <div className='the__url'>
              <img
                src={Mercariimg}
                alt='ebay'
                width='25'
                height='25'
                className='imgcls'
              />
              <input
                placeholder='Mercari URL'
                type='text'
                className='the__url_input'
                value={data["mercari"]["url"]}
                onChange={handleUrl}
              ></input>
            </div>
          </div>
          {/* ========================================================================================================== */}

          {/* ========================================================================================================== */}

          <div className='details__heading'>
            <div className=' detail_adjust'>Details</div>
            <div className='details__content'>
              <div className='arrange__details'>
                <div className='details__col'>
                  <label htmlFor='Price' className='label__style'>
                    Price
                  </label>
                  <label htmlFor='Price' className='label__style'>
                    Apply Price
                  </label>
                  <label htmlFor='MRP' className='label__style'>
                    MRP
                  </label>
                  <label htmlFor='MSRP' className='label__style'>
                    MSRP
                  </label>
                  <label htmlFor='COGS' className='label__style'>
                    Cost of Goods
                  </label>
                  <label htmlFor='SOC' className='label__style'>
                    Shipping/Other Costs
                  </label>
                </div>
                <div className='details__input_header'>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='price'
                    id='price'
                    value={data.price}
                    onChange={handleChange}
                  ></input>
                  <button
                    className='details__input'
                    onClick={priceCalculation}
                  >Calculate</button>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='mrp'
                    id='mrp'
                    value={data.mrp}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='msrp'
                    id='msrp'
                    value={data.msrp}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='costOfGoods'
                    id='costOfGoods'
                    value={data.costOfGoods}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='shippingFees'
                    id='shippingFees'
                    value={data.shippingFees}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <label className='compPriceSetting'>{data.compPriceSetting}</label>
              <div className='arrange__details'>
                <div className='details__col'>
                  <label htmlFor='SKU' className='label__style'>
                    SKU
                  </label>
                  <label htmlFor='UPC' className='label__style'>
                    UPC
                  </label>
                  <label htmlFor='Quantity' className='label__style'>
                    Quantity
                  </label>
                  <label htmlFor='SWLBKG' className='label__style'>
                    Shipping weight Lb/KG
                  </label>
                  <label htmlFor='SWOZG' className='label__style'>
                    Shipping weight Oz/G
                  </label>
                </div>
                <div className='details__input_header'>
                  <input
                    className='details__input'
                    type='text'
                    name='sku'
                    id='sku'
                    value={data.sku}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='text'
                    name='upc'
                    id='upc'
                    value={data.upc}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='quantity'
                    id='quantity'
                    value={data.quantity}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='weightLB'
                    id='weightLB'
                    value={data.weightLB}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='weightOZ'
                    id='weightOZ'
                    value={data.weightOZ}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div className='arrange__details'>
                <div className='details__col'>
                  <label htmlFor='Profit' className='label__style'>
                    Profit
                  </label>
                  <label htmlFor='SZOCC' className='label__style'>
                    Shipping Zip or City Code
                  </label>
                  <label htmlFor='SPL' className='label__style'>
                    Shipping Package Length
                  </label>
                  <label htmlFor='SPW' className='label__style'>
                    Shipping Package Width
                  </label>
                  <label htmlFor='SPH' className='label__style'>
                    Shipping Package Height
                  </label>
                </div>
                <div className='details__input_header'>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='profit'
                    id='profit'
                    value={data.profit}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='text'
                    name='zipCode'
                    id='zipCode'
                    value={data.zipCode}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='packageLength'
                    id='packageLength'
                    value={data.packageLength}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='packageWidth'
                    id='packageWidth'
                    value={data.packageWidth}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    step="any"
                    name='packageHeight'
                    id='packageHeight'
                    value={data.packageHeight}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================================================== */}

          <div className='measurements__header'>
              <div className='productdetails_adjust'>
                Product Details
              </div>
              <div className='product__header_btn_ctn'>
                <select
                  id='condition_name'
                  name='condition_name'
                  className='condition__input'
                  value={data.condition_name}
                  onChange={handleChange}
                  >
                  <option value={data.condition_name} disabled>{data.condition_name}</option>
                  <option value='New'>New</option>
                  <option value='New (Other/Open Box)'>New (Other/Open Box)</option>
                  <option value='New With Defects'>New With Defects</option>
                  <option value='Seller Refurbished'>Seller Refurbished</option>
                  <option value='Used'>Used</option>
                  <option value='Broken/For Repair'>Broken/For Repair</option>
                </select>
              <ToggleButton
                className='product__togglebtn'
                variant='contained'
                value={data.ebayOptionalFieldsActive}
                onClick={toggleOptional}
              >
                Optional
              </ToggleButton>
              <button
                className='btn-success product__btn'
                onClick={clearExtraDescriptions}
              >
                Reset Details
              </button>
              <button
                className='btn-success product__btn'
                onClick={repopulateExtraDescriptions}
              >
                Undo Delete
              </button>
            </div>
          </div>
          {extraDescriptions.length !== 0 ? (
            extraDescriptions.filter((description) =>
                data.ebayOptionalFieldsActive ? true : description.aspectUsage === "RECOMMENDED"
              )
              .map((description) => {
                return (
                  <>
                  <div className='measurement__body'>
                    <input
                      className={`form-control form-control-sm col-4 mr-3 ${
                        description.aspectRequired
                          ? "aspect__input_required"
                          : description.aspectUsage === "RECOMMENDED"
                          ? "aspect__input_recommended"
                          : ""
                      }`}
                      type='text'
                      name='label'
                      id={description.id}
                      value={description.key}
                      onChange={(e) => handleDescriptionLabel(description.id, e)}
                      placeholder='key'
                    />
                    :-
                    <Autocomplete
                      freeSolo
                      options={
                        description.suggestedValues
                          ? description.suggestedValues
                          : [{"localizedValue": "No Suggested Values"}]
                      }
                      getOptionLabel={(option) => option.localizedValue ? option.localizedValue : option}
                      className='form-control-sm col-4 mr-3'
                      value={description.value}
                      onChange={(event, value, reason) => handleDescriptionChange(description.id, value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                        />
                      )}
                    />
                    <button
                      className='btn'
                      onClick={(e) => removeDescription(description.id, e)}
                    >
                      <div className='fa fa-minus-square ml-3'></div>
                    </button>
                  </div>
                  </>
                );
              })
          ) : (
            <>
              <div className='properties'>
                <div className='prop_adjust'>
                  <input
                    placeholder='  Show all title'
                    type='text'
                    className='properties__input'
                  ></input>
                  <input
                    placeholder='  Brand or Maker'
                    type='text'
                    className='properties__input'
                    name='brand'
                    value={data.brand}
                    onChange={handleChange}
                  ></input>
                  <input
                    placeholder='    Style/Feature/Model'
                    type='text'
                    className='properties__input'
                    name='model'
                    value={data.model}
                    onChange={handleChange}
                  ></input>
                </div>
                </div>
              <div className='segrigate'>
                <button
                  className={`${
                    data.category === "Unisex"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Unisex'
                  onClick={() => {
                    this.setCategory("Unisex");
                  }}
                >
                  Unisex
                </button>
                <button
                  className={`${
                    data.category === "Men" ? "fill__button" : "outline__button"
                  }`}
                  category='Men'
                  onClick={() => {
                    this.setCategory("Men");
                  }}
                >
                  Men
                </button>
                <button
                  className={`${
                    data.category === "Women"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Women'
                  onClick={() => {
                    this.setCategory("Women");
                  }}
                >
                  Women
                </button>
                <button
                  className={`${
                    data.category === "Unisex Kids"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Unisex Kids'
                  onClick={() => {
                    this.setCategory("Unisex Kids");
                  }}
                >
                  Unisex Kids
                </button>
                <button
                  className={`${
                    data.category === "Girls"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Girls'
                  onClick={() => {
                    this.setCategory("Girls");
                  }}
                >
                  Girls
                </button>
                <button
                  className={`${
                    data.category === "Boys"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Boys'
                  onClick={() => {
                    this.setCategory("Boys");
                  }}
                >
                  Boys
                </button>
                <button
                  className={`${
                    data.category === "Maternity"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Materity'
                  onClick={() => {
                    this.setCategory("Maternity");
                  }}
                >
                  Materity
                </button>
                <button
                  className={`${
                    data.category === "Babies"
                      ? "fill__button"
                      : "outline__button"
                  }`}
                  category='Babies'
                  onClick={() => {
                    this.setCategory("Babies");
                  }}
                >
                  Babies
                </button>

                {showcat && (
                  <input
                    className='custom__category'
                    type='text'
                    name='category'
                    placeholder='Custom Category'
                    value={data.category}
                    onChange={handleChange}
                    maxLength='140'
                  />
                )}
              </div>
              <div className='measurement__heading'>
                <div className='measurement_adjust'>Measurements</div>
                <div className='measurement__body'>
                  <label htmlFor='Waist' className='label__style'>
                    Waist
                    <input
                      className='measurement__input'
                      type='number'
                      step="any"
                      name='waist'
                      id='waist'
                      value={data.waist}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <label htmlFor='Rise' className='label__style'>
                    Rise
                    <input
                      className='measurement__input'
                      type='number'
                      step="any"
                      name='rise'
                      id='rise'
                      value={data.rise}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <label htmlFor='Inseam' className='label__style'>
                    Inseam
                    <input
                      className='measurement__input'
                      type='number'
                      step="any"
                      name='inseam'
                      id='inseam'
                      value={data.inseam}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <button
                    className='outline__button__measurement'
                    onClick={addMeasure}
                  >
                    Add new measurement
                  </button>
                </div>
                {extraMeasures.length !== 0 ? (
            extraMeasures
              .map((extraMeasurement) => {
                return (
                  <>
                  <div className='measurement__body'>
                    <input
                      className={`form-control form-control-sm col-4 mr-3`}
                      type='text'
                      name='label'
                      id={extraMeasurement.id}
                      value={extraMeasurement.label}
                      onChange={(e) => handleMeasureLabel(extraMeasurement.id, e)}
                      placeholder='Measurement'
                    />
                    :-
                    <input
                      className={'form-control form-control-sm col-4 mr-3'}
                      type='text'
                      name='value'
                      id={extraMeasurement.id}
                      value={extraMeasurement.val}
                      onChange={(e) => handleMeasureChange(extraMeasurement.id, e)}
                      placeholder='Value'
                      />
                    <button
                      className='btn'
                      onClick={(e) => removeMeasure(extraMeasurement.id, e)}
                    >
                      <div className='fa fa-minus-square ml-3'></div>
                    </button>
                  </div>
                  </>
                );
              })
          ) : (" ")
              }
              </div>
            </>
          )}
          {/* ========================================================================================================== */}

          <div className='general__header'>
            <div className='gen_settings'>General Settings</div>
            <div className='general__body'>
              <div className='general__col'>
                <label htmlFor='Category' className='label__style_general'>
                  Ebay Category 1
                  <div className='category__alignment'>
                    <Autocomplete
                      disableListWrap
                      ListboxComponent={ListboxComponent}
                      renderGroup={renderGroup}
                      options={ebayCategoryDropDownItems}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => (
                        <TextField
                          value={data.ebayCategoryField ? data.ebayCategoryField : ""}
                          {...params}
                          style={{
                            borderRadius: 7,
                            border: 1,
                            borderColor: "solid gray",
                            width: 185,
                            marginLeft: 7,
                            height: 30,
                            marginTop: 3,
                          }}
                        />
                      )}
                      renderOption={(option) => (
                        <Typography noWrap>{option.categoryName}</Typography>
                      )}
                      onChange={(event, value, reason) =>
                        reason === "select-option"
                          ? handleSelectedEbayCategory(value)
                          : null
                      }
                    />
                    <button
                      className='brz__btn '
                      onClick={(e) => {
                        this.ebayRef.current.openModal();
                      }}
                    >
                      Browse
                    </button>
                  </div>
                </label>
                <label
                  htmlFor='SecondaryCategory'
                  className='label__style_general'
                >
                  Ebay Category 2
                  <div>
                    <input 
                    className='general__input_brz'
                    ></input>
                    <button className='brz__btn'>Browse</button>
                  </div>
                </label>
                <label htmlFor='ListingFormatType' className='label__style_general'>
                  Listing Format/Type
                  <input 
                  className='general__input'
                  name='listingFormatType'
                  value={data.listingFormatType}
                  onChange={handleChange}
                  ></input>
                </label>
              </div>

              {/* =============================================================== */}
              <div className='general__col'>
                <label
                  htmlFor='GivingWorksCharityID'
                  className='label__style_general'
                >
                  Giving Works Charity ID
                  <input 
                  className='general__input'
                  name='givingWorksCharityID'
                  value={data.givingWorksCharityID}
                  onChange={handleChange}
                  ></input>
                </label>
                <label
                  htmlFor='GivingWorksDonationPercentage'
                  className='label__style_general'
                >
                  Giving Works Donation %
                  <input 
                  className='general__input'
                  name='givingWorksDonationPercentage'
                  value={data.givingWorksDonationPercentage}
                  onChange={handleChange}
                  ></input>
                </label>
                <label htmlFor='listingDuration' className='label__style_general'>
                  Listing Duration
                  <input 
                  className='general__input'
                  name='listingDuration'
                  value={data.listingDuration}
                  onChange={handleChange}
                  ></input>
                </label>
              </div>

              {/* =============================================================== */}
              <div className='general__col'>
                <label
                  htmlFor='StoreCategory1'
                  className='label__style_general'
                >
                  Store Category 1
                  <input 
                  className='general__input'
                  name='storeCategoryOne'
                  value={data.storeCategoryOne}
                  onChange={handleChange}
                  ></input>
                </label>
                <label
                  htmlFor='StoreCategory2'
                  className='label__style_general'
                >
                  Store Category 2
                  <input 
                  className='general__input'
                  name='storeCategoryTwo'
                  value={data.storeCategoryTwo}
                  onChange={handleChange}
                  ></input>
                </label>
                <label htmlFor='LotSize' className='label__style_general'>
                  Lot Size
                  <input 
                  className='general__input'
                  name='lotSize'
                  value={data.lotSize}
                  onChange={handleChange}
                  ></input>
                </label>
              </div>
            </div>
          </div>
          {/* ========================================================================================================== */}
          <div className='dom__header'>
            <div className='Dom_ship'> Domestic Shipping Service</div>
            <div className='dom__body'>
              <div className='arrange__main'>
                <div className='arrange__col_dom'>
                  <label htmlFor='ShippingServiceDom' className='label__style'>
                    Shipping Service
                  </label>
                  <Autocomplete
                        name='ebayDomesticShippingService'
                        className='dom__input'
                        value={data.domesticShippingService}
                        options={shippingDomesticDropDownItems}
                        getOptionLabel={(option) => option.Description}
                        onChange={(event, value, reason) =>
                          reason === "select-option"
                            ? handleShippingChange(event, value, 'domesticShippingService')
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            value={data.domesticShippingService ? data.domesticShippingService.Description : ""}
                            {...params}
                          />
                        )}
                      />
                </div>
                <div className='arrange__col_dom'>
                  <label htmlFor='CostDom' className='label__style'>
                    Cost
                  </label>
                  <input 
                  className='dom__input'
                  name='domesticShippingCost'
                  value={data.domesticShippingCost}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}

              <div className='arrange__main'>
                <div className='arrange__col_dom'>
                  <label htmlFor='EachAdditionalDom' className='label__style'>
                    Each Additional
                  </label>
                  <input 
                  className='dom__input'
                  name='domesticShippingEachAdditional'
                  value={data.domesticShippingEachAdditional}
                  onChange={handleChange}
                  ></input>
                </div>
                <div className='arrange__col_dom'>
                  <label
                    htmlFor='AK/HI/PR/SurchargeDom'
                    className='label__style'
                  >
                    AK/HI/PR Surcharge
                  </label>
                  <input 
                  className='dom__input'
                  name='domesticShippingSurcharge'
                  value={data.domesticShippingSurcharge}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}
              <div className='arrange__col_dom'>
                <div className='free__ship'>
                  <label>
                  <input 
                  type='checkbox'
                  className='dom__input'
                  checked={data.domesticShippingFreeShippingActive}
                  onChange={(e) => {handleCheckboxToggle(e.target.checked, 'domesticShippingFreeShippingActive')}}
                  ></input>
                    Free Shipping?
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* ========================================================================================================== */}
          <div className='dom__header'>
            <div className='int_ship'> International Shipping Service</div>
            <div className='dom__body'>
              <div className='arrange__main'>
                <div className='arrange__col_dom'>
                  <label htmlFor='ShippingServiceInt' className='label__style'>
                    Shipping Service
                  </label>
                  <Autocomplete
                        name='ebayInternationalShippingService'
                        className='dom__input'
                        value={data.internationalShippingService}
                        options={shippingInternationalDropDownItems}
                        getOptionLabel={(option) => option.Description}
                        style={{ width: 300 }}
                        onChange={(event, value, reason) =>
                          reason === "select-option"
                            ? handleShippingChange(event, value, 'internationalShippingService')
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            value={data.internationalShippingService ? data.internationalShippingService.Description : ""}
                            {...params}
                          />
                        )}
                      />
                </div>
                <div className='arrange__col_dom'>
                  <label htmlFor='CostInt' className='label__style'>
                    Cost
                  </label>
                  <input 
                  className='dom__input'
                  name='internationalShippingCost'
                  value={data.internationalShippingCost}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}

              <div className='arrange__main'>
                <div className='arrange__col_dom'>
                  <label htmlFor='EachAdditionalInt' className='label__style'>
                    Each Additional
                  </label>
                  <input 
                  className='dom__input'
                  name='internationalShippingEachAdditional'
                  value={data.internationalShippingEachAdditional}
                  onChange={handleChange}
                  ></input>
                </div>
                <div className='arrange__col_dom'>
                  <label
                    htmlFor='AK/HI/PRSurchargeInt'
                    className='label__style'
                  >
                    AK/HI/PR Surcharge
                  </label>
                  <input 
                  className='dom__input'
                  name='internationalShippingSurcharge'
                  value={data.internationalShippingSurcharge}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}
              <div className='arrange__col_dom'>
                <div className='free__ship'>
                  <input 
                  type='checkbox' 
                  className='dom__input'
                  name='internationalShippingFreeShippingActive'
                  checked={data.internationalShippingFreeShippingActive}
                  onChange={(e) => {handleCheckboxToggle(e.target.checked, 'internationalShippingFreeShippingActive')}}
                  ></input>
                  <label
                    htmlFor='FreeShippingInt'
                    className='label__style_free'
                  >
                    Free Shipping?
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* =============================================================== */}
          <div className='best_offer'>
            <div className='dom__header2'>
              <div className='int_ship2'> Best Offer</div>
              <div className='dom__body2'>
              <button
                type='button'
                onClick={(e) => {handleToggleButton(!data.bestOfferActive, 'bestOfferActive')}}
                className='button__q5'
              >
                {data.bestOfferActive
                  ? "Yes, best offer enabled"
                  : "No, best offer disabled"}
              </button>
                <div className='option_div'>
                  <input 
                  type='checkbox'
                  name='bestOfferAcceptFloorActive'
                  checked={data.bestOfferAcceptFloorActive}
                  onChange={(e) => {handleCheckboxToggle(e.target.checked, 'bestOfferAcceptFloorActive')}}
                  ></input>{" "}
                  <label>Automatically accept offers of atleast</label>{" "}
                  <input 
                  className='inputbox1'
                  name='bestOfferAcceptFloorValue'
                  value={data.bestOfferAcceptFloorValue}
                  onChange={handleChange}
                  ></input>
                </div>
                <div className='option_div'>
                  <input 
                  type='checkbox'
                  name='bestOfferDeclineCeilingActive'
                  checked={data.bestOfferDeclineCeilingActive}
                  onChange={(e) => {handleCheckboxToggle(e.target.checked, 'bestOfferDeclineCeilingActive')}}
                  ></input>{" "}
                  <label>Automatically decline offers lower than</label>{" "}
                  <input 
                  className='inputbox'
                  name='bestOfferDeclineCeilingValue'
                  value={data.bestOfferDeclineCeilingValue}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>
            </div>
            <div className='decition_buttons'>
            {process.env.REACT_APP_NAME === 'APP' ?
            (
              <>
              <button className='save_to_draft'
              onClick={(e) => {onSubmit(e, "save");}}>
              Save</button>
              </>
            )
            :
            data.prodStatus && data.prodStatus === 'draft'?
              (
                <>
                <button 
                className='save_to_draft'
                onClick={(e) => {onSubmit(e, "draft");}}>
                Save to Draft
                </button>
                <button className='submit'
                onClick={(e) => {onSubmit(e, "inventory");}}>
                List
                </button>
                </>
              )
              :
              (
                <>
                <button 
                className='save_to_draft'
                onClick={(e) => {onSubmit(e, "draft");}}>
                Save To Draft
                </button>
                <button className='submit'
                onClick={(e) => {onSubmit(e, "save");}}>
                Save
                </button>
                </>
            )
            }
            <button 
            className='cancel'
            onClick={() => window.open("/searchcart", "_self")}
            >Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default RightSection;
