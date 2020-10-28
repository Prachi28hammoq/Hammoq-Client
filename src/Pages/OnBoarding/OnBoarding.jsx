import React, { Component } from "react";
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
      firstName: "",
      lastName: "",
      emailAddress: "",
      phoneNum: "",
      storeLink: "",
      findUs: "",
      listOnEbay: "",
      serviceWant: [],
      crosslisting: [],
      howPrice: "",
      increaseCompPrice: "",
      zipCode: "",
      howShipping: "",
      blurb: "",
      bestOffer: "",
      mercari: "",
      handleTime: "",
      permitJay: "",
      ebayAcc: "",
      mercariAcc: "",
      poshAcc: "",
      shopify: "",
      otherAcc: ""
    };
   this.handleChangeText = this.handleChangeText.bind(this)
   this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this)
   this.handleSubmit = this.handleSubmit.bind(this)
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
      mercari,
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
      password: "DUMMY",
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
      mercariBestPricing: mercari,
      handlingTime: handleTime,
      sendPermissionToJay: permitJay,
      ebayAccountInfo: ebayAcc,
      mercariAccountInfo: mercariAcc,
      shopifyAccountInfo: shopify,
      otherAccountInfo: otherAcc,
    };

    Axios.post("/signup", body)
      .then((res) => {
        if (res.data.errors) {
          return alert(res.data.errors);
        }
        if (res.status == 200) {
          alert(
            "Successfully Updated,click on basic Listing to list your products"
          );
        }
      })
      .catch((err) => {
        if (err.response.data.err) {
          return alert(err.response.data.err);
        }
        alert("Something went wrong.");
        console.log(err);
      });
  };

  handleChangeText = (variable, event) => {
    let newValue = event.target.value;
    this.setState({variable:newValue});
  };

  handleChangeCheckBox = (variable, newValue) => {
    this.setState({variable:newValue});
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
      mercari,
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
              onChange={(event) => this.handleChangeText(firstName, event)}
            />
            <TextField
              style={{ margin: "10px" }}
              id='lastNameInput'
              label='Last name'
              type='search'
              variant='outlined'
              value={lastName}
              onChange={(event) => this.handleChangeText(lastName, event)}
            />
            <TextField
              style={{ margin: "10px" }}
              id='emailAddressInput'
              label='Email Address'
              type='search'
              variant='outlined'
              value={emailAddress}
              onChange={(event) => this.handleChangeText(emailAddress, event)}
            />
            <TextField
              style={{ margin: "10px" }}
              id='phoneNumInput'
              label='Phone Number'
              type='search'
              variant='outlined'
              value={phoneNum}
              onChange={(event) => this.handleChangeText(phoneNum, event)}
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
              onChange={(event) => this.handleChangeText(storeLink, event)}
            />
            <TextField
              className='group__two_two'
              id='findUsInput'
              label='How did you find about us?'
              type='search'
              variant='outlined'
              value={findUs}
              onChange={(event) => this.handleChangeText(findUs, event)}
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
                defaultValue=''
                onChange={(event) => this.handleChangeText(listOnEbay, event)}
              >
                <FormControlLabel
                  value='Yes'
                  control={<Radio />}
                  label='Yes'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='No'
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
                  value={serviceWant}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(serviceWant["Listings"], 1)
                        : this.handleChangeCheckBox(serviceWant["Listings"], 0)
                  }}
                />
              }
              label='Listings'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  value={serviceWant}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(serviceWant["Crosslistings"], 1)
                        : this.handleChangeCheckBox(serviceWant["Crosslistings"], 0)
                  }}
                />
              }
              label='Crosslistings'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  value={serviceWant}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(serviceWant["Delistings"], 1)
                        : this.handleChangeCheckBox(serviceWant["Delistings"], 0)
                  }}
                />
              }
              label='Delistings (only applicable if crosslisting) Setup Video https://drive.google.com/file/d/1DpESoA1O3utMC6aLvnIzowltX0Ln4bCZ/view?usp=sharing'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  value={serviceWant}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(serviceWant["Accounting"], 1)
                        : this.handleChangeCheckBox(serviceWant["Accounting"], 0)
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
                  value={crosslisting}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Ebay"], 1)
                        : this.handleChangeCheckBox(crosslisting["Ebay"], 0)
                  }}
                />
              }
              label='Ebay'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  value={crosslisting}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Mercari"], 1)
                        : this.handleChangeCheckBox(crosslisting["Mercari"], 0)
                  }}
                />
              }
              label='Mercari'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  value={crosslisting}
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Poshmark"], 1)
                        : this.handleChangeCheckBox(crosslisting["Poshmark"], 0)
                  }}
                />
              }
              label='Poshmark'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Shopify"], 1)
                        : this.handleChangeCheckBox(crosslisting["Shopify"], 0)
                  }}
                />
              }
              label='Shopify'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Offerup"], 1)
                        : this.handleChangeCheckBox(crosslisting["Offerup"], 0)
                  }}
                />
              }
              label='Offerup'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Depop"], 1)
                        : this.handleChangeCheckBox(crosslisting["Depop"], 0)
                  }}
                />
              }
              label='Depop'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Craigslist"], 1)
                        : this.handleChangeCheckBox(crosslisting["Craigslist"], 0)
                  }}
                />
              }
              label='Craigslist'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Letgo"], 1)
                        : this.handleChangeCheckBox(crosslisting["Letgo"], 0)
                  }}
                />
              }
              label='Letgo'
            />
            <FormControlLabel
              control={
                <Checkbox
                  color='primary'
                  inputProps={{ "aria-label": "secondary checkbox" }}
                  onChange={(event) => {
                    const a = event.target.checked == true
                        ? this.handleChangeCheckBox(crosslisting["Tradsy"], 1)
                        : this.handleChangeCheckBox(crosslisting["Tradsy"], 0)
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
                defaultValue=''
                onChange={(event) => this.handleChangeText(howPrice, event)}
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
              onChange={(event) => this.handleChangeText(increaseCompPrice, event)}
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
              onChange={(event) => this.handleChangeText(zipCode, event)}
            />
          </div>
          <div className='group__nine'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>
                How would you like shipping? See exact shipping options here
                https://bit.ly/3f10ktg (this is how your items will be
                listed/crosslisted)
              </FormLabel>
              <RadioGroup
                row
                aria-label='position'
                name='position'
                defaultValue='top'
                onChange={(event) => this.handleChangeText(howShipping, event)}
              >
                <FormControlLabel
                  value='freeShipping'
                  control={<Radio color='primary' />}
                  label='Free shipping (sells 15% better. Recommended) Shipping is added in the price using comp'
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
              onChange={(event) => this.handleChangeText(blurb, event)}
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
                defaultValue=''
                onChange={(event) => this.handleChangeText(bestOffer, event)}
              >
                <FormControlLabel
                  value='bestYes'
                  control={<Radio color='primary' />}
                  label='Yes'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='bestNo'
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
                defaultValue=''
                onChange={(event) => this.handleChangeText(mercari, event)}
              >
                <FormControlLabel
                  value='mYes'
                  control={<Radio color='primary' />}
                  label='Yes'
                  labelPlacement='end'
                />
                <FormControlLabel
                  value='mNo'
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
                defaultValue=''
                onChange={(event) => this.handleChangeText(handleTime, event)}
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
              onChange={(event) => this.handleChangeText(permitJay, event)}
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
              onChange={(event) => this.handleChangeText(ebayAcc, event)}
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
              onChange={(event) => this.handleChangeText(mercariAcc, event)}
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
              onChange={(event) => this.handleChangeText(poshAcc, event)}
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
              onChange={(event) => this.handleChangeText(shopify, event)}
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
              onChange={(event) => this.handleChangeText(otherAcc, event)}
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
