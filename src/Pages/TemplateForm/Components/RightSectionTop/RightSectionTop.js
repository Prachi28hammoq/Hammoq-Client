import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./RightSectionTop.css";
import Poshmarkimg from "./images/poshmark.png";
import Ebayimg from "./images/ebay.png";
import Mercariimg from "./images/mercari.png";
import { ToggleButton } from "@material-ui/lab";
import SvgIcon from "@material-ui/core/SvgIcon";

let Axios;

class RightSectionTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestTitles: false,
      showOtherTitles: false,
      custom: true,
      title: "",
      gtin: ""      
    };
    this.ebayRef = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.customtitle = this.customtitle.bind(this);
    this.handleChangeLocal = this.handleChangeLocal.bind(this);
    this.ebayGTINCall = this.ebayGTINCall.bind(this);
  }

  componentWillMount() {
    Axios = this.props.Axios;
    if ("custom" in localStorage) {
      let custom = localStorage.getItem("custom");
      this.setState({ custom: custom === "true" });
    }
  }

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
    if (data.title) 
    {
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
      gtin
    } = this.state;

    const {
      data,
      handleChange,
      handleOtherTitles,
      handleUrl,
      handleToggleButton,
      handleMarketPlaceDataChange,
    } = this.props;


    if(data.isListingGood === undefined)
    {
      data.isListingGood = false;
    }

    if (custom === false) {
      data.title = [data.brand, data.size].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.ebay.title = [data.brand, data.size].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.poshmark.title = [data.brand, data.size,].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.mercari.title = [data.brand, data.size].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
    }

    return (
          <>
          <div className='d-flex align-items-center mb-1'>
            <div className='h6 fw-500 text-uppercase mt-3'>Product Title </div>
            <i className='fas fa-question-circle c-pointer text-secondary ml-2 mt-2'></i>
            <button
              className={custom ? "btn btn-success ml-2 mt-2 btn-sm" : "btn btn-warning ml-2 mt-2 btn-sm"}
              onClick={this.customtitle}
            >
              Custom Title
            </button>
          </div>
          <div className='form-group row'>
            <div className='col-sm-8'>
            {custom ? 
              (
              <>
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
                {data.title ? data.title.length : 0}/140 max characters
              </small>
            </>
            )
            :
            (
            <>
              <textarea
                className='form-control form-control-sm'
                style={{height:'31px'}}
                type='text'
                name='title'
                id='tite'
                value={data.title}
                readOnly
                maxLength='140'
              />
              <small
                className='form-text text-muted'
                style={{ fontSize: "0.5em" }}
              >
                {data.title ? data.title.length : 0}/140 max characters
              </small>
            </>
              )}
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
                alt='ebayIcon'
                width='28'
                height='25'
                className='imgcls'
              />
              <input
                name='ebay'
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
                alt='poshmarkIcon'
                width='25'
                height='25'
                className='imgcls'
              />
              <input
                name='poshmark'
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
                alt='mercariIcon'
                width='25'
                height='25'
                className='imgcls'
              />
              <input
                name='mercari'
                placeholder='Mercari URL'
                type='text'
                className='the__url_input'
                value={data["mercari"]["url"]}
                onChange={handleUrl}
              ></input>
            </div>
          </div>
        </>
    );
  };
}

export default RightSectionTop;
