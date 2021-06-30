import { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import "./Details.css";

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {clientEbayADCampaignDropDownItemsLOADED: false};
   }

  componentDidMount = () => {
    const { clientEbayADCampaignDropDownItemsLOADED } = this.state;
    const { clientEbayADCampaignDropDownItems } = this.props;

    if(!clientEbayADCampaignDropDownItemsLOADED && !clientEbayADCampaignDropDownItems.length) 
    {
      clientEbayADCampaignDropDownItems.push({'campaignName':'Client Ebay Campaigns Are Missing'})
      this.setState({clientEbayADCampaignDropDownItemsLOADED:true})
    }
  }

  render = () => {
    const {clientEbayADCampaignDropDownItemsLOADED} = this.state;

    const {
      data, 
      handleChange,
      handleCheckboxToggle,
      handleCampaignSelect,
      priceCalculation,
      clientEbayADCampaignDropDownItems,
      handleZeroFix
    } = this.props;

    return (
    <div className='details__heading'>
                <div className=' detail_adjust'>Details</div>
                <div className='details__content'>
                  <div className='arrange__details'>
                    <div className='details__col'>
                      <label htmlFor='Price' className='label__style'>
                        Price (Per Item)
                      </label>
                      <label htmlFor='Price' className='label__style'>
                        Apply Price
                      </label>
                      <label htmlFor='Price' className='label__style'>
                        Comp Price Setting
                      </label>
                      <label htmlFor='MRP' className='label__style'>
                        MRP
                      </label>
                      <label htmlFor='MSRP' className='label__style'>
                        MSRP
                      </label>
                      <label htmlFor='COGS' className='label__style'>
                        Cost of Goods (Per Item)
                      </label>
                      <label htmlFor='SOC' className='label__style'>
                        Other Costs (Per Item)
                      </label>
                    </div>
                    <div className='details__input_header'>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='price'
                        id='price'
                        value={handleZeroFix('price')}
                        onChange={handleChange}
                      ></input>
                      <button
                        className='details__input'
                        onClick={priceCalculation}
                      >Calculate</button>
                      <label 
                        className='compPriceSetting'
                        style={{'marginTop':'8px', 'alignSelf':'center'}}
                        >{data.compPriceSetting ? data.compPriceSetting : "N/A"}</label>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='mrp'
                        id='mrp'
                        value={handleZeroFix('mrp')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        name='msrp'
                        id='msrp'
                        value={handleZeroFix('msrp')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='costOfGoods'
                        id='costOfGoods'
                        value={handleZeroFix('costOfGoods')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='otherCosts'
                        id='otherCosts'
                        value={handleZeroFix('otherCosts')}
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
                      <label htmlFor='PromotedListingsActive' className='label__style'>
                      <input
                      type='checkbox'
                      name='promotedListingActive'
                      checked={data.promotedListingActive || false}
                      onChange={(e) => {handleCheckboxToggle(e.target.checked, 'promotedListingActive')}}
                      ></input>
                        {" "}Promoted Listing(%)
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
                        type='number'
                        name='upc'
                        id='upc'
                        value={handleZeroFix('upc')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='quantity'
                        id='quantity'
                        value={handleZeroFix('quantity')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='weightLB'
                        id='weightLB'
                        value={handleZeroFix('weightLB')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='weightOZ'
                        id='weightOZ'
                        value={handleZeroFix('weightOZ')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='promotedListingPercentage'
                        id='promotedListingPercentage'
                        disabled={!data.promotedListingActive}
                        value={handleZeroFix('promotedListingPercentage')}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className='arrange__details'>
                    <div className='details__col'>
                      <label htmlFor='Profit' className='label__style'>
                        Profit (Total)
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
                      <label htmlFor='SWOZG' className='label__style'>
                        Ebay Campaign List
                      </label>
                    </div>
                    <div className='details__input_header'>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='profit'
                        id='profit'
                        value={handleZeroFix('profit')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='text'
                        name='zipCode'
                        id='zipCode'
                        value={handleZeroFix('zipCode')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='packageLength'
                        id='packageLength'
                        value={handleZeroFix('packageLength')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='packageWidth'
                        id='packageWidth'
                        value={handleZeroFix('packageWidth')}
                        onChange={handleChange}
                      ></input>
                      <input
                        className='details__input'
                        type='number'
                        step="any"
                        name='packageHeight'
                        id='packageHeight'
                        value={handleZeroFix('packageHeight')}
                        onChange={handleChange}
                      ></input>
                       <Autocomplete
                            name='ebayCampaign'
                            className='details__input'
                            value={data.ebayCampaign ? data.ebayCampaign : {'campaignName':''}}
                            options={clientEbayADCampaignDropDownItems}
                            getOptionLabel={(option) => option.campaignName}
                            onChange={(event, value, reason) =>
                                reason === "select-option"
                                ? handleCampaignSelect(event, value)
                                : null
                            }
                            renderInput={(params) => (
                              <TextField
                                placeholder={data.ebayCampaign ? data.ebayCampaign.campaignName : ""}
                                {...params}
                              />
                            )}
                          />
                        <button
                        className='brz__btn'
                        style={{'marginTop':'8px'}}
                        onClick={(event) => {handleCampaignSelect(event, {'campaignName':''})}}
                        >
                          Clear
                        </button>
                    </div>
                  </div>
                </div>
              </div>
    );
  };
}

export default Details;