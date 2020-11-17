import React, { Component, useEffect } from "react";
import "./OnBoarding.css";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Axios from "../../services/Axios";

class OnBoarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: " ",
      lastName: " ",
      emailAddress: " ",
      phoneNum: " ",
      storeLink: " ",
      findUs: " ",
      listOnEbay: 'false',
      serviceWant: {'Listings': false, 'Crosslistings': false, 'Delistings': false, 'Accounting': false},
      crosslisting: {'Ebay': false, 'Mercari': false, 'Poshmark': false, 'Shopify': false, 'Offerup': false, 'Depop': false, 'Craigslist': false, 'Letgo': false, 'Tradsy': false},
      howPrice: " ",
      increaseCompPrice: " ",
      zipCode: " ",
      howShipping: " ",
      blurb: " ",
      bestOffer: 'false',
      mercariSmartPricing: 'false',
      handleTime: " ",
      permitJay: " ",
      ebayAcc: " ",
      mercariAcc: " ",
      poshAcc: " ",
      shopify: " ",
      otherAcc: " "
    };
   this.handleChangeText = this.handleChangeText.bind(this)
   this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this)
   this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount = () =>
  {
    Axios.get("/clientDetails")
      .then((res) => {
       this.setState({ firstName: res.data.firstName,
        lastName: res.data.lastName,
        emailAddress: res.data.email,
        phoneNum: res.data.phoneno,
        storeLink: res.data.storeName,
        findUs: res.data.findOutAboutUs,
        listOnEbay: res.data.startListingOnEbay,
        serviceWant: res.data.servicesRequired[0],
        crosslisting: res.data.crossListings[0],
        howPrice: res.data.likeUsToPrice,
        increaseCompPrice: res.data.increasePrice,
        zipCode: res.data.shippingZipCode,
        howShipping: res.data.likeShipping,
        blurb: res.data.companyBlurb,
        bestOffer: res.data.acceptBestOffer,
        mercariSmartPricing: res.data.mercariBestPricing,
        handleTime: res.data.handlingTime,
        permitJay: res.data.sendPermissionToJay,
        ebayAcc: res.data.ebayAccountInfo,
        mercariAcc: res.data.mercariAccountInfo,
        poshAcc: res.data.shopifyAccountInfo,
        otherAcc: res.data.otherAccountInfo});
      })
      .catch((err) => console.log("error fetching client: ", err));
  }

  handleSubmit = () => {
    const { 
      firstName,
      lastName,
      emailAddress,
      phoneNum,
      storeLink,
      findUs,
      listOnEbay,
      serviceWant,
      crosslisting,
      howPrice,
      increaseCompPrice,
      zipCode,
      howShipping,
      blurb,
      bestOffer,
      mercariSmartPricing,
      handleTime,
      permitJay,
      ebayAcc, 
      mercariAcc,
      poshAcc,
      shopify,
      otherAcc
    } = this.state;

    let body = {
      firstName: firstName,
      lastName: lastName,
      email: emailAddress,
      phoneno: phoneNum,
      storeName: storeLink,
      findOutAboutUs: findUs,
      startListingOnEbay: listOnEbay,
      servicesRequired: serviceWant,
      crossListings: crosslisting,
      likeUsToPrice: howPrice,
      increasePrice: increaseCompPrice,
      shippingZipCode: zipCode,
      likeShipping: howShipping,
      companyBlurb: blurb,
      acceptBestOffer: bestOffer,
      mercariBestPricing: mercariSmartPricing,
      handlingTime: handleTime,
      sendPermissionToJay: permitJay,
      ebayAccountInfo: ebayAcc,
      mercariAccountInfo: mercariAcc,
      shopifyAccountInfo: shopify,
      otherAccountInfo: otherAcc,
    };

    Axios.post("/clientDetails/onBoarding", body)
      .then((res) => {
        if (res.status == 200) {
          alert(
            "Successfully Updated,click on basic Listing to list your products"
          );
        }
      })
      .catch((err) => {
        alert("Something went wrong.");
        console.log(err);
      });
  };

  handleChangeText = (variable, event) => {
    let newValue = event.target.value;
    this.setState({[variable]:newValue});
  };

  handleChangeCheckBox = (variable, newValue) => {
    const {serviceWant} = this.state;
    var newServiceWant = serviceWant;
    console.log(newValue)
    console.log(serviceWant)
    console.log(newServiceWant)
    Object.entries(newServiceWant).map((entry) => {
      if(entry[0] === variable)
      {
        entry[1] = newValue;
        console.log(entry[0])
        console.log(entry[1])
      }
    });
    this.setState({serviceWant:newServiceWant});
  };

  render = () => {
    const { 
      firstName,
      lastName,
      emailAddress,
      phoneNum,
      storeLink,
      findUs,
      listOnEbay,
      serviceWant,
      crosslisting,
      howPrice,
      increaseCompPrice,
      zipCode,
      howShipping,
      blurb,
      bestOffer,
      mercariSmartPricing,
      handleTime,
      permitJay,
      ebayAcc, 
      mercariAcc,
      poshAcc,
      shopify,
      otherAcc
    } = this.state;
    return (
      <div className='main__div'>
        <Paper elevation={3} className='main__paper'>
          <div className='first__div'>
            <h2>Onboarding Form</h2>
          </div>
          <hr></hr>
          <div className='group__one'>
            <TextField
              style={{ margin: "10px" }}
              id='firstNameInput'
              label='First Name'
              type='search'
              variant='outlined'
              value={firstName}
              onChange={(event) => this.handleChangeText('firstName', event)}
            />
            <TextField
              style={{ margin: "10px" }}
              id='lastNameInput'
              label='Last name'
              type='search'
              variant='outlined'
              value={lastName}
              onChange={(event) => this.handleChangeText('lastName', event)}
            />
            <TextField
              style={{ margin: "10px" }}
              id='emailAddressInput'
              label='Email Address'
              type='search'
              variant='outlined'
              value={emailAddress}
              onChange={(event) => this.handleChangeText('emailAddress', event)}
            />
            <TextField
              style={{ margin: "10px" }}
              id='phoneNumInput'
              label='Phone Number'
              type='search'
              variant='outlined'
              value={phoneNum}
              onChange={(event) => this.handleChangeText('phoneNum', event)}
            />
          </div>
          <div className='group__two'>
            <TextField
              className='group__two_one'
              id='storeLinkInput'
              label='Store Name / Store Link'
              type='search'
              variant='outlined'
              value={storeLink}
              onChange={(event) => this.handleChangeText('storeLink', event)}
            />
            <TextField
              className='group__two_two'
              id='findUsInput'
              label='How did you find about us?'
              type='search'
              variant='outlined'
              value={findUs}
              onChange={(event) => this.handleChangeText('findUs', event)}
            />
          </div>
          <div className='group__three'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>
                Do you want us to start listing on eBay?
              </FormLabel>
              <RadioGroup
                row
                aria-label='ebayRadio'
                name='ebayRadio'
                value={listOnEbay}
                onChange={(event) => this.handleChangeText('listOnEbay', event)}
              >
                <FormControlLabel
                  type='radio'
                  value='true'
                  control={<Radio />}
                  label='Yes'
                  labelPlacement='end'
                />
                <FormControlLabel
                  type='radio'
                  value='false'
                  control={<Radio />}
                  label='No, I only want crosslistings'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='group__four'>
            <FormLabel component='legend'>
              What services do you want? (Can always change)
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={serviceWant['Listings']}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox("Listings", false)
                        : this.handleChangeCheckBox("Listings", true)
                  }}
                />
              }
              label='Listings'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={serviceWant["Crosslistings"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('Crosslistings', false)
                        : this.handleChangeCheckBox('Crosslistings', true)
                  }}
                />
              }
              label='Crosslistings'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={serviceWant["Delistings"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('Delistings', true)
                        : this.handleChangeCheckBox('Delistings', false)
                  }}
                />
              }
              label='Delistings (only applicable if crosslisting) Setup Video https://drive.google.com/file/d/1DpESoA1O3utMC6aLvnIzowltX0Ln4bCZ/view?usp=sharing'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={serviceWant["Accounting"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('Accounting', true)
                        : this.handleChangeCheckBox('Accounting', false)
                  }}
                />
              }
              label='Accounting'
            />
          </div>
          <div className='group__five'>
            <FormLabel component='legend'>
              Do you want us to start crosslisting? ------ (Please fill out the
              information below when applicable. We need login info for locations
              to crosslist on below)
            </FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Ebay"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Ebay"]', true)
                        : this.handleChangeCheckBox('["Ebay"]', false)
                  }}
                />
              }
              label='Ebay'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Mercari"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Mercari"]', true)
                        : this.handleChangeCheckBox('["Mercari"]', false)
                  }}
                />
              }
              label='Mercari'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Poshmark"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Poshmark"]', true)
                        : this.handleChangeCheckBox('["Poshmark"]', false)
                  }}
                />
              }
              label='Poshmark'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Shopify"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Shopify"]', true)
                        : this.handleChangeCheckBox('["Shopify"]', false)
                  }}
                />
              }
              label='Shopify'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Offerup"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Offerup"]', true)
                        : this.handleChangeCheckBox('["Offerup"]', false)
                  }}
                />
              }
              label='Offerup'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Depop"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Depop"]', true)
                        : this.handleChangeCheckBox('["Depop"]', false)
                  }}
                />
              }
              label='Depop'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Craigslist"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Craigslist"]', true)
                        : this.handleChangeCheckBox('["Craigslist"]', false)
                  }}
                />
              }
              label='Craigslist'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Letgo"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Letgo"]', true)
                        : this.handleChangeCheckBox('["Letgo"]', false)
                  }}
                />
              }
              label='Letgo'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  checked={crosslisting["Tradsy"]}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.selected == true
                        ? this.handleChangeCheckBox('["Tradsy"]', true)
                        : this.handleChangeCheckBox('["Tradsy"]', false)
                  }}
                />
              }
              label='Tradsy'
            />
          </div>
          <div className='group__six'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>
                For pricing how would you like us to price? If you want to do the
                pricing yourself put it in the other section "I'll price"
              </FormLabel>
              <RadioGroup
                row
                aria-label='position'
                name='position'
                value={howPrice}
                onChange={(event) => this.handleChangeText('howPrice', event)}
              >
                <FormControlLabel
                  value='LongHold'
                  control={<Radio color='primary' />}
                  label='High Sold Comp (longer hold)'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='midHold'
                  control={<Radio color='primary' />}
                  label='Medium Sold Comp (mid hold)'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='fastSale'
                  control={<Radio color='primary' />}
                  label='Cheapest Sold Comp (fast sale)'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='group__seven'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='increaseCompPriceInput'
              label='Increase comp price by $ or % (please include $ or % if applicable)'
              type='search'
              variant='outlined'
              value={increaseCompPrice}
              onChange={(event) => this.handleChangeText('increaseCompPrice', event)}
            />
          </div>
          <div className='group__eight'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='zipCodeInput'
              label='Shipping Zipcode'
              type='search'
              variant='outlined'
              value={zipCode}
              onChange={(event) => this.handleChangeText('zipCode', event)}
            />
          </div>
          <div className='group__nine'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>
                How would you like shipping? See exact shipping options here
                https://bit.ly/3f180ktg (this is how your items will be
                listed/crosslisted)
              </FormLabel>
              <RadioGroup        
                row
                aria-label='position'
                name='position'
                value={howShipping}
                onChange={(event) => this.handleChangeText('howShipping', event)}
              >
                <FormControlLabel
                  value='freeShipping'
                  control={<Radio color='primary' />}
                  label='Free shipping (sells true5% better. Recommended) Shipping is added in the price using comp'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='flatPrice'
                  control={<Radio color='primary' />}
                  label='Flat price based on average weight of item or comp -- see link (https://bit.ly/formhammoq)'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='calculated'
                  control={<Radio color='primary' />}
                  label='Calculated - You weigh the item - You supply the weight and dimensions (if no weight, we will do flat or free only)'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='group__ten'>
            <TextField
              style={{ width: "80%" }}
              id='blurbInput'
              label='Do you have a company blurb you want at the end of each product description? If so, please put it below'
              multiline
              rows={4}
              variant='outlined'
              value={blurb}
              onChange={(event) => this.handleChangeText('blurb', event)}
            />
          </div>
          {/* ----------------------------------------------------------------------------------------- */}
          <div className='group__leven'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Accept Best offer?</FormLabel>
              <RadioGroup
                row
                aria-label='position'
                name='position'
                value={bestOffer}
                onChange={(event) => this.handleChangeText('bestOffer', event)}
              >
                <FormControlLabel
                  value='true'
                  control={<Radio color='primary' />}
                  label='Yes'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='false'
                  control={<Radio color='primary' />}
                  label='No'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='group__twl'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Mercari Smart Pricing?</FormLabel>
              <RadioGroup
                row
                aria-label='position'
                name='position'
                value={mercariSmartPricing}
                onChange={(event) => this.handleChangeText('mercariSmartPricing', event)}
              >
                <FormControlLabel
                  value='true'
                  control={<Radio color='primary' />}
                  label='Yes'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='false'
                  control={<Radio color='primary' />}
                  label='No'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='group__trtn'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Handling time</FormLabel>
              <RadioGroup
                row
                aria-label='position'
                name='position'
                value={handleTime}
                onChange={(event) => this.handleChangeText('handleTime', event)}
              >
                <FormControlLabel
                  value='Sameday'
                  control={<Radio color='primary' />}
                  label='Same day'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='1day'
                  control={<Radio color='primary' />}
                  label='1 day'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='2day'
                  control={<Radio color='primary' />}
                  label='2 day'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='3day'
                  control={<Radio color='primary' />}
                  label='3 day'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='4day'
                  control={<Radio color='primary' />}
                  label='4 day'
                  labelPlacement='end'
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className='group__fotn'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='permitJayInput'
              label='Send permissions to jay k at jay@hammockdata.com'
              type='search'
              variant='outlined'
              value={permitJay}
              onChange={(event) => this.handleChangeText('permitJay', event)}
            />
          </div>
          <div className='group__fivtn'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='ebayAccInput'
              label='Ebay Account Info'
              type='search'
              variant='outlined'
              value={ebayAcc}
              onChange={(event) => this.handleChangeText('ebayAcc', event)}
            />
          </div>
          <div className='group__sxtn'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='mercariAccInput'
              label='Mercari account info'
              type='search'
              variant='outlined'
              value={mercariAcc}
              onChange={(event) => this.handleChangeText('mercariAcc', event)}
            />
          </div>
          <div className='group__svntn'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='poshAccInput'
              label='Poshmark account info'
              type='search'
              variant='outlined'
              value={poshAcc}
              onChange={(event) => this.handleChangeText('poshAcc', event)}
            />
          </div>
          <div className='group__eitn'>
            <TextField
              style={{ margin: "10px", width: "80%" }}
              id='shopifyInput'
              label='Shopify Account info'
              type='search'
              variant='outlined'
              value={shopify}
              onChange={(event) => this.handleChangeText('shopify', event)}
            />
          </div>
          <div className='group__ntn'>
            <TextField
              style={{ width: "80%" }}
              id='otherAccInput'
              label='Other account info for all other boxes check on where you want to list/ crosslist'
              multiline
              rows={4}
              variant='outlined'
              value={otherAcc}
              onChange={(event) => this.handleChangeText('otherAcc', event)}
            />
          </div>
          <div className='button'>
            <Button
              variant='contained'
              onClick={this.handleSubmit}
              color='primary'
              style={{ width: "25%" }}
            >
              Submit
            </Button>
          </div>
        </Paper>
      </div>
    );
  };
}

export default OnBoarding;
