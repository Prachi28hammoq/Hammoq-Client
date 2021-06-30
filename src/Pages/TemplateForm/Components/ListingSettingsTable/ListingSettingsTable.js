import { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

class ListingSettingsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsInUse:
      [
        {key:'internationalReturnsAccepted', name: 'International Returns Status', dataLocation: 'internationalReturnsAccepted', listingSettingsLocation: 'intlShipping.0.returns.0.accepted', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'internationalReturnsRefundGivenAs', name: 'International Returns Type', dataLocation: 'internationalReturnsRefundGivenAs', listingSettingsLocation: 'intlShipping.0.returns.0.refundGivenAs', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'internationalReturnsPaidBy', name: 'International Returns Paid By', dataLocation: 'internationalReturnsPaidBy', listingSettingsLocation: 'intlShipping.0.returns.0.returnShipPaidBy', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'internationalReturnsWithin', name: 'International Returns Within Time', dataLocation: 'internationalReturnsWithin', listingSettingsLocation: 'intlShipping.0.returns.0.returnWithin', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'domesticReturnsAccepted', name: 'Domestic Returns Status', dataLocation: 'domesticReturnsAccepted', listingSettingsLocation: 'shipping.0.returns.0.accepted', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'domesticReturnsRefundGivenAs', name: 'Domestic Returns Type', dataLocation: 'domesticReturnsRefundGivenAs', listingSettingsLocation: 'shipping.0.returns.0.refundGivenAs', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'domesticReturnsPaidBy', name: 'Domestic Returns Paid By', dataLocation: 'domesticReturnsPaidBy', listingSettingsLocation: 'shipping.0.returns.0.returnShipPaidBy', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'domesticReturnsWithin', name: 'Domestic Returns Within Time', dataLocation: 'domesticReturnsWithin', listingSettingsLocation: 'shipping.0.returns.0.returnWithin', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'compPriceSetting', name: 'Comp Price Setting', dataLocation: 'compPriceSetting', listingSettingsLocation: 'listing.0.priceOptions', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'compPriceIncreaseValue', name: 'Comp Price Value', dataLocation: 'compPriceIncreaseValue', listingSettingsLocation: 'listing.0.incrCompPrice.0.value', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'compPriceIncreaseMethod', name: 'Comp Price Method', dataLocation: 'compPriceIncreaseMethod', listingSettingsLocation: 'listing.0.incrCompPrice.0.by', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'zipCode', name: 'ZipCode', dataLocation: 'zipCode', listingSettingsLocation: 'listing.0.zipCode', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'mercariHashtags', name: 'Mercari HashTags', dataLocation: 'mercariHashtags', listingSettingsLocation: 'listing.0.mercariTags', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'companyBlurb', name: 'Company Blurb', dataLocation: 'companyBlurb', listingSettingsLocation: 'listing.0.companyBlurb', listingSettingsValue: '', listingSettingsValueString: ''},
        //{key:'flatShippingRules', name: 'FlatShipping Rules', dataLocation: '', listingSettingsLocation: 'shipping.0.flatShippingRules'}, Not utilized, removed for now due to some data complexity needed.
        {key:'domesticShippingFreeShippingActive', name: 'Free Domestic Shipping Status', dataLocation: 'domesticShippingFreeShippingActive', listingSettingsLocation: 'shipping.0.freeShipping', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'calculatedShippingActive', name: 'Calculated Shipping Status', dataLocation: 'calculatedShippingActive', listingSettingsLocation: 'shipping.0.calculatedShipping', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'bestOfferActive', name: 'Best Offer Status', dataLocation: 'bestOfferActive', listingSettingsLocation: 'listing.0.bestOffer.0.enabled', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'ebay.ebayPayPalEmailActive', name: 'Ebay PayPal Email Status', dataLocation: 'ebayPayPalEmailActive', listingSettingsLocation: 'payment.0.allowPaypal', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'ebay.ebayPayPalEmail', name: 'Ebay PayPal Email', dataLocation: 'ebayPayPalEmail', listingSettingsLocation: 'payment.0.paypalEmail', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'ebayAutoPayActive', name: 'Ebay AutoPay Status', dataLocation: 'ebayAutoPayActive', listingSettingsLocation: 'payment.0.enableEbayAutoPay', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'bestOfferAcceptFloorActive', name: 'Best Offer Atleast Status', dataLocation: 'bestOfferAcceptFloorActive', listingSettingsLocation: 'listing.0.bestOffer.0.isOfferAccepted', listingSettingsValue: '', listingSettingsValueString: ''},
        {key:'bestOfferDeclineCeilingActive', name: 'Best Offer Decline Status', dataLocation: 'bestOfferDeclineCeilingActive', listingSettingsLocation: 'listing.0.bestOffer.0.isOfferDeclined', listingSettingsValue: '', listingSettingsValueString: ''}
     ],
     settingsParsed: false
    };
  }

  getDescendantProp(obj, desc) {
    var arr = desc.split('.');
    if(obj !== undefined)
    {
      while (arr.length) {
        obj = obj[arr.shift()];
      }
      return obj;
    }
  }

  setValue(data, settingsInUse)
  {
    data[settingsInUse.dataLocation] = settingsInUse.listingSettingsValue;
    this.forceUpdate();
  }

  render = () => {
    const {
      nanoid,
      data,
      isClientListingSettingsLoading,
      doesClientListingSettingsExist,
      clientListingSettings
    } = this.props;
    const {
      settingsInUse,
      settingsParsed
    } = this.state;

    if(clientListingSettings._id !== undefined && settingsParsed === false)
    {
      for(let entry in settingsInUse)
      {
        let result = this.getDescendantProp(clientListingSettings, settingsInUse[entry].listingSettingsLocation)
        settingsInUse[entry].listingSettingsValue = result;
        settingsInUse[entry].listingSettingsValueString = String(result).charAt(0).toUpperCase() + String(result).slice(1);
      }
      this.setState({settingsInUse, settingsParsed:true});
    }

    return(
      <>
        <Paper>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                  Variable Name
                </TableCell>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                  Current Variable
                </TableCell>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                  Listing Settings Variable
                </TableCell>
                <TableCell
                  key={nanoid(4)}
                  align={'left'}
                >
                 Set Variable 
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {data && settingsInUse ? (settingsInUse.map((setting, index) => {
              return(
              <TableRow>
                <TableCell>
                  {setting.name}
                </TableCell>
                <TableCell>
                  {String(data[setting.dataLocation]).charAt(0).toUpperCase() + String(data[setting.dataLocation]).slice(1)}
                </TableCell>
                <TableCell>
                   {setting.listingSettingsValueString}
                </TableCell>
                <TableCell>
                   <Button
                   variant="contained" 
                   color="primary"
                   onClick={(e) => {this.setValue(data,setting)}}
                   >
                   Set
                   </Button>
                </TableCell>
              </TableRow>
              );
            })) : (" ")}

            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
      </>
      );
  }
}
export default ListingSettingsTable;