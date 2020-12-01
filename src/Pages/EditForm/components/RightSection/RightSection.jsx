import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
//import { HOST } from "../../../../services/Axios";
import Axios from "../../../../services/Axios";
import "./RightSection.css";
import Poshmarkimg from "./images/poshmark.png";
import Ebayimg from "./images/ebay.png";
import Mercariimg from "./images/mercari.png";
import EbayCategoryModal from "../ebayModal";
//import Popover from '@material-ui/core/Popover';
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useTheme /*makeStyles*/ } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
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
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
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
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.forEach(getChildSize).reduce((a, b) => a + b, 0);
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
      customdesc: false,
      desc: "",
      msgFormToggle: false,
      msgFormTitle: "",
      msgFormDescription: "",
      curTime: new Date(),
      anchorEl: null,
      productMessage: [],
      field: "",
      extraDescriptions: [],
      currentSuggestion: [],
      loadOptional: false,
      gtin: "",
    };
    this.ebayRef = React.createRef();
  }

  componentWillMount() {
    if ("custom" in localStorage) {
      let custom = localStorage.getItem("custom");
      this.setState({ custom: custom === "true" });
    }

    if ("customdesc" in localStorage) {
      this.setState({
        customdesc: localStorage.getItem("customdesc") === "true",
      });
    }
  }

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ count: e.target.value.length });
  };

  handleMessage = (e) => {
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

  toggleOptional = () => {
    var { loadOptional } = this.state;
    this.setState({ loadOptional: !loadOptional });
  };

  clearExtraDescriptions = () => {
    this.setState({ extraDescriptions: [] });
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
  };

  handleSelectedLeaf = (itemAspectsArray) => {
    var { extraDescriptions, count1 } = this.state;
    extraDescriptions = [];
    Object.keys(itemAspectsArray.data.aspects).forEach((item, index) => {
      extraDescriptions.push({
        key: itemAspectsArray.data.aspects[index].localizedAspectName,
        aspectUsage:
          itemAspectsArray.data.aspects[index].aspectConstraint.aspectUsage,
        suggestedValues: itemAspectsArray.data.aspects[index].aspectValues,
        aspectRequired:
          itemAspectsArray.data.aspects[index].aspectConstraint.aspectRequired,
      });
      count1 = count1 + 1;
    });

    this.setState({ extraDescriptions: extraDescriptions, count1: count1 });
  };

  handleSelectedEbayCategory = (category) => {
    const url = "/ebay/itemAspects/" + category.categoryId;
    Axios.get(url)
      .then((response) => response.data)
      .then((data) => {
        this.handleSelectedLeaf(data);
      })
      .catch((err) => console.log(err));
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
    console.log(extraDescriptions);
  };

  handleDescriptionChange = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.value = value;
      }
    });
    this.setState({ extraDescriptions });
    console.log(extraDescriptions);
  };

  setCategoryField = (categoryName) => {
    const { ebayCategory } = this.state;
    this.setState({ ebayCategory: categoryName });
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

  handleChangeLocal = (e) => {
    let change = {};
    change[e.target.id] = e.target.value;
    this.setState(change);
  };

  render = () => {
    const {
      //selectedWebsites,
      //ebayCategory,
      //category,
      //showMoreLines,
      custom,
      //anchorEl,
      extraDescriptions,
      //handleDescriptionChange,
      handleDescriptionLabel,
      //suggestTitles,
      showOtherTitles,
      //msgFormToggle,
      //productMessage,
      loadOptional,
      gtin,
    } = this.state;

    //const open = Boolean(anchorEl);
    //const id = open ? 'simple-popover' : undefined;

    const {
      data,
      handleChange,
      //images,
      //handleBulkUpload,
      //handleImageChange,
      //removeImg,
      addMeasure,
      //addDescription,
      //extraMeasures,
      //removeMeasure,
      removeDescription,
      //handleMeasureChange,
      //handleMeasureLabel,
      handleOtherTitles,
      handleUrl,
      //brandacc,
      //coloracc,
      showcat,
      //labelacc,
      //messageNotSeen,
      suggestions,
    } = this.props;

    if (custom === false) {
      data.title = [
        data.brand,
        data.colorShade,
        data.model,
        data.modelNo,
        data.category,
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
        data.modelNo,
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
          onSelectedLeafModalClose={this.handleSelectedLeaf}
          setSelectedCategoryField={this.setCategoryField}
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
                // let title=data.title;
                // data.title=title.trim();
                // data.ebay.title=data.title;
                // data.poshmark.title=data.title;
                // data.mercari.title=data.title;
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
            <button className='toggle__button'>Un Sold</button>
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
              <label htmlFor='Market'>Market</label>
              <select id='Market' name='Market' className='select__market'>
                <option value='Ebay'>Ebay</option>
                <option value='Poshmark'>Poshmark</option>
                <option value='Mercari'>Mercari</option>
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
                    Shipping/other Costs
                  </label>
                </div>
                <div className='details__input_header'>
                  <input
                    className='details__input'
                    type='number'
                    name='price'
                    id='price'
                    defaultValue={data.price}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='mrp'
                    id='mrp'
                    defaultValue={data.mrp}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='msrp'
                    id='msrp'
                    defaultValue={data.msrp}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='costOfGoods'
                    id='costOfGoods'
                    defaultValue={data.costOfGoods}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='shippingFees'
                    id='shippingFees'
                    defaultValue={data.shippingFees}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
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
                    defaultValue={data.sku}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='text'
                    name='upc'
                    id='upc'
                    defaultValue={data.upc}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='quantity'
                    id='quantity'
                    defaultValue={data.quantity}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='weightLB'
                    id='weightLB'
                    defaultValue={data.weightLB}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='weightOZ'
                    id='weightOZ'
                    defaultValue={data.weightOZ}
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
                    name='profit'
                    id='profit'
                    defaultValue={data.profit}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='text'
                    name='zipCode'
                    id='zipCode'
                    defaultValue={data.zipCode}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='packageLength'
                    id='packageLength'
                    defaultValue={data.packageLength}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='packageWidth'
                    id='packageWidth'
                    defaultValue={data.packageWidth}
                    onChange={handleChange}
                  ></input>
                  <input
                    className='details__input'
                    type='number'
                    name='packageHeight'
                    id='packageHeight'
                    defaultValue={data.packageHeight}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================================================== */}

          <div className='measurements__header'>
            <div className='prodname_div'>
              <div className='productdetails_adjust'>Product Details</div>
              <div className='product__header_btn_ctn'>
                <button
                  className={`btn mr-3 ${
                    loadOptional ? "fill__button" : "outline__button"
                  } btn-sm`}
                  onClick={this.toggleOptional}
                >
                  Optional
                </button>
                <button
                  className='btn mr-3 btn-success btn-sm'
                  onClick={this.clearExtraDescriptions}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {extraDescriptions.length !== 0 ? (
            extraDescriptions
              .filter((description) =>
                loadOptional ? true : description.aspectUsage === "RECOMMENDED"
              )
              .forEach((description) => {
                return (
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
                      id={description.key}
                      defaultValue={description.key}
                      onChange={(e) =>
                        handleDescriptionLabel(description.id, e)
                      }
                      placeholder='key'
                    />
                    :-
                    <Autocomplete
                      options={
                        description.suggestedValues
                          ? description.suggestedValues
                          : [("localizedValue": "No Suggested Values")]
                      }
                      getOptionLabel={(option) => option.localizedValue}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          classes='form-control form-control-sm col-4 mr-3 aspect__input_field'
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
                  ></input>
                  <input
                    placeholder='    Style or Feature'
                    type='text'
                    className='properties__input'
                  ></input>
                  <select
                    id='condition'
                    name='condition'
                    className='properties__input'
                  >
                    <option value='Condition'>Condition</option>
                    <option value='New'>New</option>
                    <option value='Used'>Used</option>
                    <option value='Salvage'>Salvage</option>
                  </select>
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
                      name='waist'
                      id='waist'
                      defaultValue={data.waist}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <label htmlFor='Rise' className='label__style'>
                    Rise
                    <input
                      className='measurement__input'
                      type='number'
                      name='rise'
                      id='rise'
                      defaultValue={data.rise}
                      onChange={handleChange}
                    ></input>
                  </label>
                  <label htmlFor='Inseam' className='label__style'>
                    Inseam
                    <input
                      className='measurement__input'
                      type='number'
                      name='inseam'
                      id='inseam'
                      defaultValue={data.inseam}
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
              </div>
            </>
          )}
          {/* ========================================================================================================== */}

          <div className='general__header'>
            <div className='gen_settings'>General Settings</div>
            <div className='general__body'>
              <div className='general__col'>
                <label htmlFor='Category' className='label__style_general'>
                  Category
                  <div className='category__alignment'>
                    <Autocomplete
                      disableListWrap
                      ListboxComponent={ListboxComponent}
                      renderGroup={renderGroup}
                      options={suggestions}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => (
                        <TextField
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
                          ? this.handleSelectedEbayCategory(value)
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
                  Secondary Category
                  <div>
                    <input className='general__input_brz'></input>
                    <button className='brz__btn'>Browse</button>
                  </div>
                </label>
                <label htmlFor='ListingFormat' className='label__style_general'>
                  Listing Format
                  <input className='general__input'></input>
                </label>
              </div>

              {/* =============================================================== */}
              <div className='general__col'>
                <label
                  htmlFor='GivingWorksCharityID'
                  className='label__style_general'
                >
                  Giving Works Charity ID
                  <input className='general__input'></input>
                </label>
                <label
                  htmlFor='GivingWorksDonationPercentage'
                  className='label__style_general'
                >
                  Giving Works Donation %
                  <input className='general__input'></input>
                </label>
                <label
                  htmlFor='StoreCategory1'
                  className='label__style_general'
                >
                  Store Category 1<input className='general__input'></input>
                </label>
              </div>

              {/* =============================================================== */}
              <div className='general__col'>
                <label
                  htmlFor='StoreCategory2'
                  className='label__style_general'
                >
                  Store Category 2<input className='general__input'></input>
                </label>
                <label htmlFor='LotSize' className='label__style_general'>
                  Lot Size
                  <input className='general__input'></input>
                </label>
                <label htmlFor='Type' className='label__style_general'>
                  Type
                  <input className='general__input'></input>
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
                  <input className='dom__input'></input>
                </div>
                <div className='arrange__col_dom'>
                  <label htmlFor='CostDom' className='label__style'>
                    Cost
                  </label>
                  <input className='dom__input'></input>
                </div>
              </div>

              {/* ==================================================================================== */}

              <div className='arrange__main'>
                <div className='arrange__col_dom'>
                  <label htmlFor='EachAdditionalDom' className='label__style'>
                    Each Additional
                  </label>
                  <input className='dom__input'></input>
                </div>
                <div className='arrange__col_dom'>
                  <label
                    htmlFor='AK/HI/PR/SurchargeDom'
                    className='label__style'
                  >
                    AK/HI/PR Surcharge
                  </label>
                  <input className='dom__input'></input>
                </div>
              </div>

              {/* ==================================================================================== */}
              <div className='arrange__col_dom'>
                <div className='free__ship'>
                  <input type='checkbox' className='dom__input'></input>
                  <label
                    htmlFor='FreeShippingDom'
                    className='label__style_free'
                  >
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
                  <input className='dom__input'></input>
                </div>
                <div className='arrange__col_dom'>
                  <label htmlFor='CostInt' className='label__style'>
                    Cost
                  </label>
                  <input className='dom__input'></input>
                </div>
              </div>

              {/* ==================================================================================== */}

              <div className='arrange__main'>
                <div className='arrange__col_dom'>
                  <label htmlFor='EachAdditionalInt' className='label__style'>
                    Each Additional
                  </label>
                  <input className='dom__input'></input>
                </div>
                <div className='arrange__col_dom'>
                  <label
                    htmlFor='AK/HI/PRSurchargeInt'
                    className='label__style'
                  >
                    AK/HI/PR Surcharge
                  </label>
                  <input className='dom__input'></input>
                </div>
              </div>

              {/* ==================================================================================== */}
              <div className='arrange__col_dom'>
                <div className='free__ship'>
                  <input type='checkbox' className='dom__input'></input>
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
                <button className='button_style'>
                  Yes, best offer enabled
                </button>
                <div className='option_div'>
                  <input type='checkbox'></input>{" "}
                  <label>Automatically accept offers of atleast</label>{" "}
                  <input className='inputbox1'></input>
                </div>
                <div className='option_div'>
                  <input type='checkbox'></input>{" "}
                  <label>Automatically decline offers lower than</label>{" "}
                  <input className='inputbox'></input>
                </div>
              </div>
            </div>
            <div className='decition_buttons'>
              <button className='save_to_draft'>Save to draft</button>
              <button className='submit'>Submit</button>
              <button className='cancel'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default RightSection;
