import { Component } from "react";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import "./DomesticShipping.css";


class DomesticShipping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingDomesticDropDownItemsLOADED: false,
      clientEbayShippingDomesticDropDownItemsLOADED: false,
    };
   }

  componentDidMount = () => {
    const { shippingDomesticDropDownItemsLOADED, clientEbayShippingDomesticDropDownItemsLOADED } = this.state;
    const { shippingDomesticDropDownItems, clientEbayShippingDomesticDropDownItems } = this.props;
    
    if(!shippingDomesticDropDownItemsLOADED && !shippingDomesticDropDownItems.length)
    {
      shippingDomesticDropDownItems.push({'Description':'Domestic Shipping Services Are Missing'})
      this.setState({shippingDomesticDropDownItemsLOADED:true})
    }

    if(!clientEbayShippingDomesticDropDownItemsLOADED && !clientEbayShippingDomesticDropDownItems.length)
    {
      clientEbayShippingDomesticDropDownItems.push({'name':'Client Domestic Shipping Services Are Missing'})
      this.setState({clientEbayShippingDomesticDropDownItemsLOADED:true})
    }
  }

  render = () => {
    const {
      shippingDomesticDropDownItemsLOADED,
      clientEbayShippingDomesticDropDownItemsLOADED,
    } = this.state;
    const {data, 
          handleChange, 
          handleShippingChange,
          handleEbayClientShippingChange,
          handleCheckboxToggle,
          toggleOptional,
          clientEbayShippingDomesticDropDownItems,
          shippingDomesticDropDownItems,
    } = this.props;

    return (
          <div className='dom__header'>
            <div className='Dom_ship'> Domestic Shipping Service</div>
            <div className='dom__body'>
              <div className='arrange__main_dom'>
                {data.domesticClientShippingPoliciesActive ?
                  (<div className='arrange__col_dom'>
                   <label htmlFor='ShippingServiceDom' className='label__style'>
                      Ebay (Client) Shipping Service
                   </label>
                   <div style={{'display':'flex', width: '100%'}}>
                   <Autocomplete
                        name='domesticClientShippingPolicy'
                        className='dom__input'
                        value={data.domesticClientShippingPolicy ? data.domesticClientShippingPolicy : {'name':''}}
                        options={clientEbayShippingDomesticDropDownItems}
                        getOptionLabel={(option) => option.name}
                        style={{ width: '100%' }}
                        onChange={(event, value, reason) =>
                          reason === "select-option"
                            ? handleEbayClientShippingChange(event, value)
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            placeholder={data.domesticClientShippingPolicy ? data.domesticClientShippingPolicy.name : ""}
                            {...params}
                          />
                        )}
                      />
                    <button
                    className='brz__btn'
                    onClick={(e) => {handleEbayClientShippingChange(e, 'CLEARDOM')}}
                    >
                      Clear
                    </button>
                    </div>
                    </div>)
                  :
                  (
                  <div className='arrange__col_dom'>
                  <label htmlFor='ShippingServiceDom' className='label__style'>
                    Ebay (Default) Shipping Service
                  </label>
                  <div style={{'display':'flex', width: '100%'}}>
                  <Autocomplete
                        name='ebayDomesticShippingService'
                        className='dom__input'
                        value={data.domesticShippingService ? data.domesticShippingService : {'Description':''}}
                        options={shippingDomesticDropDownItems}
                        getOptionLabel={(option) => option.Description}
                        style={{ width: '100%' }}
                        onChange={(event, value, reason) =>
                          reason === "select-option"
                            ? handleShippingChange(event, value, 'domesticShippingService')
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            placeholder={data.domesticShippingService ? data.domesticShippingService.Description : ""}
                            {...params}
                          />
                        )}
                      />
                <button
                className='brz__btn '
                onClick={(e) => {handleShippingChange(e, '', 'domesticShippingService')}}
                >
                  Clear
                </button>
                </div>
                </div>)}
                <div className='arrange__col_dom'>
                  <label htmlFor='CostDom' className='label__style'>
                    Cost
                  </label>
                  <input 
                  className='dom__input'
                  name='domesticShippingCost'
                  disabled={data.domesticShippingFreeShippingActive}
                  value={(Number(data.domesticShippingCost) || 0) === 0 ? '' : data.domesticShippingCost}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}

              <div className='arrange__main_dom'>
                <div className='arrange__col_dom'>
                  <label htmlFor='EachAdditionalDom' className='label__style'>
                    Each Additional
                  </label>
                  <input 
                  className='dom__input'
                  name='domesticShippingEachAdditional'
                  disabled={data.domesticShippingFreeShippingActive}
                  value={(Number(data.domesticShippingEachAdditional) || 0) === 0 ? '' : data.domesticShippingEachAdditional}
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
                  disabled={data.domesticShippingFreeShippingActive}
                  value={(Number(data.domesticShippingSurcharge) || 0) === 0 ? '' : data.domesticShippingSurcharge}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}
              <div className='arrange__main_dom' style={{'marginTop':'20px'}}>
                <div className='arrange__col_dom'>
                  <div className='free__ship_dom'>
                    <input 
                    type='checkbox' 
                    className='dom__input'
                    name='domesticClientShippingPoliciesActive'
                    checked={data.domesticClientShippingPoliciesActive || false}
                    onChange={(e) => {handleCheckboxToggle(e.target.checked, 'domesticClientShippingPoliciesActive')}}
                    ></input>
                    <label
                      htmlFor='FreeShippingInt'
                      className='label__style_free'
                    >
                      Use Ebay Client Shipping List?
                    </label>
                  </div>
                  <div className='free__ship_dom'>
                    <input 
                    type='checkbox'
                    className='dom__input'
                    name='domesticShippingFreeShippingActive'
                    checked={data.domesticShippingFreeShippingActive || false}
                    onChange={(e) => {handleCheckboxToggle(e.target.checked, 'domesticShippingFreeShippingActive')}}
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
          </div>
    );
  };
}

export default DomesticShipping;