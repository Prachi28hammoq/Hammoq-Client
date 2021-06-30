import { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import "./InternationalShipping.css";

class InternationalShipping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingInternationalDropDownItemsLOADED: false,
      clientEbayShippingInternationalDropDownItemsLOADED: false,
    };
   }

  componentDidMount = () => {
    const { clientEbayShippingInternationalDropDownItemsLOADED, shippingInternationalDropDownItemsLOADED } = this.state;
    const { shippingInternationalDropDownItems, clientEbayShippingInternationalDropDownItems } = this.props;
    
    if(!shippingInternationalDropDownItemsLOADED && !shippingInternationalDropDownItems.length)
    {
      shippingInternationalDropDownItems.push({'Description':'International Shipping Services Are Missing'})
      this.setState({shippingInternationalDropDownItemsLOADED:true})
    }

    if(!clientEbayShippingInternationalDropDownItemsLOADED && !clientEbayShippingInternationalDropDownItems.length)
    {
      clientEbayShippingInternationalDropDownItems.push({'name':'Client International Shipping Services Are Missing'})
      this.setState({clientEbayShippingInternationalDropDownItemsLOADED:true})
    }
  }

  render = () => {
    const {shippingInternationalDropDownItemsLOADED, clientEbayShippingInternationalDropDownItemsLOADED} = this.state;

    const {data, 
          handleChange, 
          handleShippingChange,
          handleEbayClientShippingChange,
          handleCheckboxToggle,
          toggleOptional,
          clientEbayShippingInternationalDropDownItems,
          shippingInternationalDropDownItems,
          handleZeroFix
    } = this.props;

    return(
          <div className='int__header'>
            <div className='int_ship'> International Shipping Service</div>
            <div className='int__body'>
              <div className='arrange__main_int'>
                <div className='arrange__col_int'>
                {data.internationalClientShippingPoliciesActive ?
                  (<>
                   <label htmlFor='ShippingServiceInt' className='label__style'>
                      Ebay (Client) Shipping Service
                   </label>
                  <div style={{'display':'flex', width: '100%'}}>
                   <Autocomplete
                        name='ebayInternationalShippingService'
                        className='int__input'
                        value={data.internationalClientShippingPolicy ? data.internationalClientShippingPolicy : {'name':''}}
                        options={clientEbayShippingInternationalDropDownItems}
                        getOptionLabel={(option) => option.name}
                        style={{ width: '100%' }}
                        onChange={(event, value, reason) =>
                          reason === "select-option"
                            ? handleEbayClientShippingChange(event, value)
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            placeholder={data.internationalClientShippingPolicy ? data.internationalClientShippingPolicy.name : ""}
                            {...params}
                          />
                        )}
                      />
                    <button
                    className='brz__btn '
                    onClick={(e) => {handleEbayClientShippingChange(e, 'CLEARINT')}}
                    >
                      Clear
                    </button>
                    </div>
                    </>)
                  :
                  (<>
                   <label htmlFor='ShippingServiceInt' className='label__style'>
                      Ebay (Default) Shipping Service
                   </label>
                   <div style={{'display':'flex', width: '100%'}}>
                   <Autocomplete
                          name='ebayInternationalShippingService'
                          className='int__input'
                          value={data.internationalShippingService ? data.internationalShippingService : {'Description':''}}
                          options={shippingInternationalDropDownItems}
                          getOptionLabel={(option) => option.Description}
                          style={{ width: '100%' }}
                          onChange={(event, value, reason) =>
                            reason === "select-option"
                              ? handleShippingChange(event, value, 'internationalShippingService')
                              : null
                          }
                          renderInput={(params) => (
                            <TextField
                              placeholder={data.internationalShippingService ? data.internationalShippingService.Description : ""}
                              {...params}
                            />
                          )}
                        />
                  <button
                  className='brz__btn '
                  onClick={(e) => {handleShippingChange(e, '', 'internationalShippingService')}}
                  >
                    Clear
                  </button>
                  </div>
                  </>)}
                  <label htmlFor='CostInt' className='label__style'>
                    Cost
                  </label>
                  <input 
                  className='int__input'
                  name='internationalShippingCost'
                  disabled={data.internationalShippingFreeShippingActive}
                  value={handleZeroFix("internationalShippingCost")}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}

              <div className='arrange__main_int'>
                <div className='arrange__col_int'>
                  <label htmlFor='EachAdditionalInt' className='label__style'>
                    Each Additional
                  </label>
                  <input 
                  className='int__input'
                  name='internationalShippingEachAdditional'
                  disabled={data.internationalShippingFreeShippingActive}
                  value={handleZeroFix("internationalShippingEachAdditional")}
                  onChange={handleChange}
                  ></input>
                  <label
                    htmlFor='AK/HI/PRSurchargeInt'
                    className='label__style'
                  >
                    AK/HI/PR Surcharge
                  </label>
                  <input 
                  className='int__input'
                  name='internationalShippingSurcharge'
                  disabled={data.internationalShippingFreeShippingActive}
                  value={handleZeroFix("internationalShippingSurcharge")}
                  onChange={handleChange}
                  ></input>
                </div>
              </div>

              {/* ==================================================================================== */}
              <div className='arrange__main_int' style={{'marginTop':'20px'}}>
                <div className='arrange__col_int'>
                  <div className='free__ship_int'>
                    <input 
                    type='checkbox' 
                    className='int__input'
                    name='internationalClientShippingPoliciesActive'
                    checked={data.internationalClientShippingPoliciesActive}
                    onChange={(e) => {handleCheckboxToggle(e.target.checked, 'internationalClientShippingPoliciesActive')}}
                    ></input>
                    <label
                      htmlFor='FreeShippingInt'
                      className='label__style_free'
                    >
                      Use Ebay Client Shipping List?
                    </label>
                    <input 
                    type='checkbox' 
                    className='int__input'
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
          </div>
    );
  };
}

export default InternationalShipping;