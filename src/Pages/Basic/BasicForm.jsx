import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "../../services/Axios";
import ButtonGroup from "./ButtonGroup";
import "./BasicForm.css";
import { Link } from "react-router-dom";
import LoadingSpinner from "../utils/loader";
import { assetsURL, socketCon } from "../../services/Axios";
import io from "socket.io-client";
import PaymentAlert from "../../Components/paymentAlert/PaymentAlert";
import imageCompression from "browser-image-compression";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import {nanoid} from "nanoid";

const $ = window.$;

class BasicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedCards: [],
      username: "",
      password: "",
      website: "",
      loading: false,
      offeredRate: {},
      itemCondition: "",
      sku: "",
      price: 0,
      costOfGoods: 0,
      brand: "",
      model: "",
      note: "",
      quantity: 0,
      weightOZ: 0,
      weightLB: 0,
      waist: 0,
      inseam: 0,
      rise: 0,
      progress: 10,
      category: "",
      isSubmitting: false,
      images: [
        { key: "default_image", label: "Default", img: "" },
        { key: "brand_image", label: "Brand", img: "" },
        { key: "model_image", label: "Model", img: "" },
        { key: "side1_image", label: "Side", img: "" },
        { key: "side2_image", label: "Side", img: "" },
        { key: "front_image", label: "Front", img: "" },
        { key: "back_image", label: "Back", img: "" },
        { key: "condition1_image", label: "Condition", img: "" },
        { key: "condition2_image", label: "Condition", img: "" },
        { key: "condition3_image", label: "Condition", img: "" },
        { key: "condition4_image", label: "Condition", img: "" },
        { key: "condition5_image", label: "Image Tag", img: "" },
      ],
      bal: 0,
      rates: {},
      fullimg: "",
      img: [],
      cid: "",
      open: false,
      templates: [],
      templateId: "",
      productId: "",
      marketPlaces: [],
      otherFieldActive: false,
      hasMarketPlaces: false,
      isMarketPlaceSelected: false,
      delist: false
    };
    this.handleChange.bind(this);
  }

  componentDidMount = () => {
    const { cid, images } = this.state;
    var { marketPlaces, hasMarketPlaces } = this.state;

    Axios.get("/password/getstatus").then(({ data }) => {
      for(let item in data)
      {
        let website = {"Name":item,"Status":false}
        marketPlaces.push(website);
        hasMarketPlaces = true;
      }
      this.setState({marketPlaces:marketPlaces, hasMarketPlaces:hasMarketPlaces});
    });

/*    Axios.get("/template")
         .then((data) => {this.setState({ templates: data.data.templates });})
         .catch((err) => {console.log(err);});*/

    Axios.get("/payment/rates")
         .then((res) => {this.setState({ rates: res.data[res.data.length - 1] });})
         .catch((err) => console.log(err));

    Axios.get("/clientdetails/basiclisting")
      .then(({ data }) => {
        if (!data.isSubscribed) 
        {
          alert("You are not subscribed, Kindly Subscribe To Hammoq Listing Services To Continue.");
          window.open("/subscription", "_self");
        }
        else if(parseInt(data.balance) < 5 && data.savedCards.length > 0) 
        {
          this.setState({ open: true });
        }
        else if (parseInt(data.balance) < 5 && data.savedCards.length == 0) 
        {
          window.alert("Low Payment and No card added, Please add a card and then add payment..");
          window.open("/subscription", "_self");
        }
        this.setState({bal: data.balance, savedCards: data.savedCards, cid: data._id});
      })
      .catch((err) => console.log(err));
  };

  fetchimg = (src) => {
    this.setState({ fullimg: src }, () => {$("#addTemplateModal1").modal("show");});
  };

  change = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  setCategory = (str) => {
    var { category } = this.state;

    if (category === str) this.setState({ category: "" });
    else this.setState({ category: str });
  };

  onSubmit = async () => {
    //e.preventDefault();
    const { images, cid, itemCondition, sku, brand, model, quantity, price, costOfGoods, category, waist, inseam, rise, weightLB, weightOZ, marketPlaces, hasMarketPlaces, templateId, note, delist, rates, bal, savedCards } = this.state;
    var { isMarketPlaceSelected } = this.state;
    const data = new FormData();
    var imagedata = new FormData();
    var imageid = {};
    var ebayChecked = false;
    var mercariChecked = false;
    var poshmarkChecked = false;

    for(let entries in marketPlaces)
    {
      if(marketPlaces[entries].Status === true) isMarketPlaceSelected = true;
    }
  
    if (localStorage.getItem("isSubscribed") === false || localStorage.getItem("isSubscribed") === "false") return alert("You are not subscribed, Please Subscribe To Hammoq Listing Services To Continue.");
    if (images[0].img == "") return alert("The First Image Is Required");
    if (itemCondition == "Select Condition *" || itemCondition == "") return alert("A Condition Is Required");
    if (!hasMarketPlaces) return $("#addTemplateModal").modal("show");
    if (!isMarketPlaceSelected) return alert("Please Selected At Least One Marketplace");

    var otherSites = [];

    marketPlaces.map((o, i) => {
      switch(marketPlaces[i].Name)
      {
        case "Ebay":
          ebayChecked = true;
          break;
        case "Mercari":
          mercariChecked = true;
          break;
        case "Poshmark":
          poshmarkChecked = true;          
          break;
        default:
          let site = {name: marketPlaces[i].Name, status: marketPlaces[i].Status, url: ""};
          otherSites.push(site);
          break;
      }
    });

    var cnt = marketPlaces.length;
    var rate1 = 0, rate2 = 0, rate3 = 0;
    var total = 0;

    rate1 = (rates.basic / 100) * 1;
    rate2 = (rates.advance / 100) * (cnt - 1);

    if (delist == true) rate3 = (rates.list / 100) * (cnt - 1);

    total = rate1 + rate2 + rate3;

    if (bal - total < 0) 
    {
      if (savedCards.length > 0) 
      {
        this.setState({ open: true });
        return window.alert("Insufficient Balance.");
      } 
      else 
      {
        window.alert("Low Payment and No Card Added, Please add a card and then add to your balance.");
        return window.open("/subscription", "_self");
      }
    }

    data.append("sku", sku);
    data.append("quantity", quantity || 1);

    data.append("price", price);
    data.append("brand", brand);
    data.append("model", model);
    data.append("note", note);
    data.append("condition_name", itemCondition);

    data.append("ebay.check", ebayChecked);
    data.append("mercari.check", mercariChecked);
    data.append("poshmark.check", poshmarkChecked);
    data.append("others", JSON.stringify(otherSites));
    data.append("delist.check", delist);

    data.append("waist", waist);
    data.append("inseam", inseam);
    data.append("category", category);
    data.append("rise", rise);
    data.append("weightLB", weightLB);
    data.append("weightOZ", weightOZ);
    data.append("activity", "Basic");
    data.append("action", "Move");
    data.append("status", true);
    data.append("listed", false);
    data.append("costOfGoods", costOfGoods);
    data.append("rate1", rate1);
    data.append("rate2", rate2);
    data.append("rate3", rate3);
    data.append("prodStatus", "submitted");

    this.setState({ isSubmitting: true });

    Axios.post("/product/validateProduct", data, {headers: {"Content-Type": "multipart/form-data"}}).then(async(response) => {

      await Promise.all(images.filter(image => !!image.img).map(async(image) => {if(!!image.img) 
      {
        imagedata = new FormData();
        imagedata.append(image.key, image.img);
        let response = await Axios.post("/product/images", imagedata, {headers: {"Content-Type": "multipart/form-data"}}).catch((err) => {this.setState({ isSubmitting: false });console.log(err);});
        imageid[image.key] = response.data.imageid
        this.setState({ progress : this.state.progress + 7 })
      }}))

      this.setState({ progress : 90})

      data.append("images", JSON.stringify(imageid))
      Axios.post("/product", data, {headers: {"Content-Type": "multipart/form-data"}}).then((response) => {
        this.setState({ progress : 98})
        //let productId = response.data.products ? response.data.products[response.data.products.length - 1]._id : response.data.products;
        //if (templateId) Axios.post("/producttemplate", {productId: productId, templateId: templateId}).then((response) => {});
        window.open("/basic", "_self");
      })
      .catch((err) => {
        this.setState({isSubmitting: false});
        console.log(err)});
    })
    .catch((err) => {
      this.setState({isSubmitting: false});
      if(err.response && err.response.data)
      {
        alert("Error: " + err.response.data.Error + "\n" + 
                "Type: " + err.response.data.Type + "\n" + 
                "Correction: " + err.response.data.Correction + "\n" +
                "Message: " + err.response.data.OtherMessage);
      }
      console.log(err)});
  };
  
 handleSubmit = (e) => {
    const { website, username, password } = this.state;
    e.preventDefault();
    if (website != "" && username != "" && password != "") 
    {
      this.setState({ loading: true });

      Axios.post("/password", {website: website, username: username, password: password})
           .then((response) => {this.setState({ loading: false });})
           .catch((err) => {this.setState({ loading: false }); console.log(err);});    
    } 
    else 
    {
      alert("Complete The Product Details.");
    }
  };

  handleChange = async (event) => {
    const { images, cid } = this.state;
    const idx = images.findIndex((image) => image.key === event.target.name);
    try 
    {
      this.setState({ isSubmitting: true });
      images[idx].img = event.target.files[0];
      this.setState({images});
      this.setState({ isSubmitting: false });
    } 
    catch (error) 
    {
      console.log(error);
    }
  };

  handleBulkUpload = async (e) => {
    const { images, cid } = this.state;
    var imgobj = [];
    const files = e.target.files;
    const count = files.length;

    this.setState({ isSubmitting: true });
    for (let i = 0; i < count; i++) 
    {
      const idx = images.findIndex((image) => !image.img);
      if (idx > -1) {
        try 
        {
          images[idx].img = files[i];
          this.setState({ images }, () => console.log(this.state.images));
        } 
        catch (error) 
        {
          console.log(error);
        }
      }
    }
    this.setState({ isSubmitting: false });
  };

  handleChangesTemplate = (e) => {
    this.setTemplate(e.target.value);
  };

  setTemplate = (id) => {
    this.setState({ templateId: id });
  };

  removeImg = (idx) => {
    const { images } = this.state;
    images[idx].img = "";
    this.setState({ images });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  updatePayment = async (amount, stripeId) => {
    const { cid } = this.state;
    let body = {customer_id: cid, amount: amount, stripeId: stripeId};
    this.setState({ open: false });
    await Axios.post("/payment/payment", body)
               .then(({ data }) => {
                if (data.success) 
                {
                  alert(data.msg);
                  window.open("/basic", "_self");
                } 
                else 
                {
                  alert("A Credit Card Is Not Added");
                  window.open("/subscription", "_self");
                }
              })
              .catch((err) => console.log(err));
  };

  toggleMarketPlaces = (e, i) =>
  {
    var { marketPlaces } = this.state;

    marketPlaces[i].Status = !marketPlaces[i].Status;

    this.setState({marketPlaces});
  }

  handleMarketPlacePopUp = (e) =>
  {
    var { marketPlaces, otherFieldActive} = this.state;

    let entry = {};

    if(e.target.name === "website")
    {
      if(e.target.value === "other") 
      {
        this.setState({otherFieldActive: true});
      }
      else
      {
        entry = {Name:e.target.name, Status: false};
        this.setState({website:e.target.value});
      }
    }
    else if(e.target.name === "otherwebsite")
    {
      entry = {Name:e.target.name, Status: false};
      this.setState({website:e.target.value});
    }
    else
    {
      this.setState({[e.target.name]:e.target.value});
    }

    marketPlaces.push(entry);

    this.setState({marketPlaces:marketPlaces});
  }

  render() {
    const {
      website,
      username,
      password,
      images,
      isSubmitting,
      fullimg,
      img,
      templates,
      marketPlaces,
      otherFieldActive,
      hasMarketPlaces,
      delist,
      itemCondition,
      sku,
      brand,
      weightLB,
      weightOZ,
      price,
      quantity,
      model,
      note,
      waist,
      inseam,
      rise,
      progress,
      open,
      savedCards
    } = this.state;
    return (
        <div className="basicListingContainer">
        <PaymentAlert
          open={open}
          handleClose={this.handleClose}
          updatePayment={this.updatePayment}
          savedCards={savedCards}
        />
        {isSubmitting ? (<LinearProgress variant="determinate" value={progress}  />) : null}
        <Link to="/products/submitted">
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </Link>
        
        <div className="basicListingRow">
          <div
            className="modal fade  bd-example-modal-sm"
            id="addTemplateModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="addTemplateModalLabel"
            aria-hidden="true"
          >
          <div
            className="modal-dialog modal-sm  modal-dialog-centered"
            role="document"
          >
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="addTemplateModalLabel">
                Logins
              </h6>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          <div className="col-12 py-2">
            <div className="card p-3 mb-3">
            {this.state.loading ? (
              <div className="center">
                <LoadingSpinner asOverlay />
              </div>
            ) : null}
              <h6 className="mb-3  sub-heading">
                Please enter the logins for each site you want to delist or list to
              </h6>
              <select
                className="form-control body-text"
                name="website"
                value={website}
                onChange={this.handleMarketPlacePopUp}
              >
                <option>Select Site</option>
                <option value="Ebay">Ebay</option>
                <option value="Poshmark">Poshmark</option>
                <option value="Mercari">Mercari</option>
                <option value="other">Others</option>
              </select>
              {otherFieldActive ? (
                <>
                  <input
                    type="text"
                    placeholder="Website"
                    className="form-control mt-3"
                    name="otherwebsite"
                    value={website}
                    onChange={this.handleMarketPlacePopUp}
                  />
                </>
              ) : null}
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-control mt-3 body-text"
                    name="username"
                    value={username}
                    onChange={this.handleMarketPlacePopUp}
                  />
                  <input
                    type="text"
                    placeholder="Password"
                    className="form-control mt-3"
                    name="password"
                    value={password}
                    onChange={this.handleMarketPlacePopUp}
                  />
                  <div className="text-center">
                    <button
                      className="btn btn-danger mt-3 text-center"
                      onClick={this.handleSubmit}
                    >
                      Add
                    </button>
                    <br />
                    <br />
                    <small className="ml-2">
                      You can always add more logins under settings in the future
                    </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="row m-auto">
              {images.map((image, idx) => {
                return (
                  <div className="col-4 col-md-3 px-1" key={nanoid(4)}>
                    <div
                      className="modal fade bd-example-modal-sm"
                      id="addTemplateModal1"
                      tabIndex={-1}
                      role="dialog"
                      aria-labelledby="addTemplateModalLabel"
                      aria-hidden="true"
                    >
                    <div
                      className="modal-dialog modal-lg  modal-dialog-centered"
                      role="document"
                    >
                    <div className="modal-content">
                      <div className="modal-header">
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>

                      <img src={fullimg} style={{ height: "500px" }} />
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body body-text text-center align-middle d-flex align-items-center justify-content-center p-2 px-1">
                    {image.img ? (
                      <div className="container p-0 m-0">
                        <img
                          src={
                            typeof image.img === "string"
                              ? assetsURL + image.img
                              : URL.createObjectURL(image.img)
                          }
                          style={{ width: "100%", height: "90px" }}
                          onClick={() => {
                            this.setState({ fullimg: image.key }, () => {
                              this.fetchimg(
                                typeof image.img === "string"
                                  ? assetsURL + image.img
                                  : URL.createObjectURL(image.img)
                              );
                            });
                          }}
                        />
                        <button
                          type="button"
                          className="btn2 close mr-auto"
                          data-dismiss="modal"
                          aria-label="Close"
                          onClick={() => this.removeImg(idx)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          height: "90px",
                          margin: "0px!important",
                        }}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <label>
                          <div className="fas fa-plus"></div> <br />
                          {image.label}
                        </label>

                        <input
                          type="file"
                          style={styles.inputFile}
                          name={image.key}
                          accept="image/*"
                          onChange={this.handleChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
                );
              })}
              <div className="col-12 px-1">
                <div className="input-group mb-3">
                  <div className="custom-file">
                    <input
                      id="bulk"
                      type="file"
                      accept="image/*"
                      className="custom-file-input"
                      multiple
                      onChange={(e) => {this.handleBulkUpload(e)}}
                    ></input>
                    <label
                      className="custom-file-label"
                      htmlFor="inputGroupFile01"
                    >
                      Bulk Upload Images
                    </label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 px-1 ml-3">
                  <select
                    value={this.state.templateId}
                    className="form-control"
                    id="template"
                    onChange={this.handleChangesTemplate}
                  >
                  <option value="">Choose Template</option>
                    {templates &&
                      templates.map((template) => {
                        return (
                          <option value={template._id}>{template.name}</option>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="rightSideContainer">
            <div className="rs_productDetails">
            <div className="rs_header">Product Details: </div>
            <div className="row_rightSide">
                <select
                  className="custom-select"
                  value={itemCondition}
                  name="itemCondition"
                  onChange={(e) => this.change(e)}
                  required
                >
                  <option>Select Condition *</option>
                  <option value="New">New</option>
                  <option value="New With Tags">New With Tags</option>
                  <option value="New (Other/Open Box)">New (Other/Open Box)</option>
                  <option value="New With Defects">New With Defects</option>
                  <option value="Seller Refurbished">Seller Refurbished</option>
                  <option value="Used">Used</option>
                  <option value="Broken/For Repair">Broken/For Repair</option>
                </select>
                <input
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={sku}
                  name="sku"
                  placeholder="SKU"
                  className="form-control"
                />
            </div>
              <div className="row_rightSide">
                <input
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={brand}
                  name="brand"
                  placeholder="Brand"
                  className="form-control"
                />
                <input
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={model}
                  name="model"
                  placeholder="Model"
                  className="form-control"
                />
              </div>
              <div className="row_rightSide"  style={{'paddingBottom':'4%'}}>
                <input
                  type="number"
                  onChange={(e) => this.change(e)}
                  value={quantity === 0 ? "" : quantity}
                  name="quantity"
                  defaultValue="1"
                  placeholder="Quantity(1)"
                  min="1"
                  className="form-control"
                />
                <input
                  type="number"
                  onChange={(e) => this.change(e)}
                  value={price === 0 ? "" : price}
                  name="price"
                  placeholder="Selling Price"
                  min="0"
                  className="form-control"
                />
                <input
                  type="number"
                  name="costOfGoods"
                  onChange={(e) => this.change(e)}
                  placeholder="Cost of Goods"
                  className="form-control"
                  step="0.01"
                />
              </div>

              <div className="row_gender">
                <ButtonGroup
                  category="Unisex Kids"
                  selectedCategory={this.state.category}
                  setCategory={this.setCategory}
                />
                <ButtonGroup
                  category="Men"
                  selectedCategory={this.state.category}
                  setCategory={this.setCategory}
                />
                <ButtonGroup
                  category="Women"
                  selectedCategory={this.state.category}
                  setCategory={this.setCategory}
                />
                <ButtonGroup
                  category="Girls"
                  selectedCategory={this.state.category}
                  setCategory={this.setCategory}
                />
                <ButtonGroup
                  category="Boys"
                  selectedCategory={this.state.category}
                  setCategory={this.setCategory}
                />
              </div>
              <div className="row_rightSide2">
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={waist}
                    name="waist"
                    placeholder="Waist"
                    className="form-control"
                  />
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={inseam}
                    name="inseam"
                    placeholder="Inseam"
                    className="form-control"
                  />
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={rise}
                    name="rise"
                    placeholder="Rise"
                    className="form-control"
                  />
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={weightLB === 0 ? "" : weightLB}
                    name="weightLB"
                    placeholder="W (LB)"
                    min="0"
                    className="form-control"
                  />
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={weightOZ === 0 ? "" : weightOZ}
                    name="weightOZ"
                    placeholder="W (OZ)"
                    min="0"
                    className="form-control"
                  />
              </div>
              <div className="row_rightSide3">
                <textarea
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={note}
                  rows="4"
                  name="note"
                  placeholder="Notes For VA"
                  className="form-control"
                ></textarea>
              </div>
            </div>
              <div className="row_rightSide4">
                <div className="marketPlacesTitle">Listing Selection:</div>
                  <div className="marketPlacesEntry">
                  {hasMarketPlaces
                    ? marketPlaces.map((o, i) => {
                        return (
                            <div className="form-check" key={nanoid(4)}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name={marketPlaces[i].Name}
                                checked={marketPlaces[i].Status || false}
                                onChange={(e) => {this.toggleMarketPlaces(e, i)}}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="marketPlace"
                              >
                                List on {o.Name}
                              </label>
                            </div>
                        );
                      })
                    : null}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={delist || false}
                      onChange={() => this.setState({ delist: !delist })}
                      id="delist"
                    />
                    <label className="form-check-label" htmlFor="delist">
                      Delist Once Item Is Sold?
                    </label>
                  </div>
                </div>  
              </div>

              <div className="row_rightSide5">
                {isSubmitting ? (
                  <button className="btn btn-block d-flex align-items-center justify-content-center">
                   <div className="center">
                    <Box position="relative" display="inline-flex">
                      <CircularProgress variant="determinate" value={this.state.progress}  />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography variant="caption" component="div" color="textSecondary">{`${this.state.progress}%`}</Typography>
                      </Box>
                      </Box>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => this.onSubmit()}
                    className="btn btn-success controlButtons"
                  >
                    Submit
                  </button>
                )}
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => this.props.history.push("/products")}
                  className="btn btn-danger controlButtons"
                />
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const styles = {
  inputFile: {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    opacity: 0,
  },
};

export default withRouter(BasicForm);
