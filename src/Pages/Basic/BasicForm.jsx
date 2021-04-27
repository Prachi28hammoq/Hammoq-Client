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

const $ = window.$;

class BasicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedCards: [],
      username: "",
      password: "",
      users: [],
      website: "",
      otherssignal: false,
      loading: false,
      offeredRate: {},
      input1: "",
      input2: "",
      input3: 0,
      input4: 0,
      input5: "",
      input6: "",
      input7: "",
      input8: "",
      input9: "",
      input10: "",
      input11: 0,
      input12: 0,
      costOfGoods: 0,
      progress: 10,
      category: "",
      isSubmitting: false,
      ebay: localStorage.getItem("ebay") === "true", //for selection presence
      mercari: localStorage.getItem("mercari") === "true",
      poshmark: localStorage.getItem("poshmark") === "true",
      delist: localStorage.getItem("delist") === "true",
      OtherState: localStorage.getItem("otherState" === "true"),
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
      Ebay: false, //for Login presence
      Poshmark: false,
      Mercari: false,
      othersbool: false,
      others: [],
      othersstate: [],
      bal: 0,
      rates: {},
      fullimg: "",
      img: [],
      cid: "",
      open: false,
      client_id: "",
      templates: [],
      templateId: "",
      productId: "",
    };
    this.handleChange.bind(this);
  }

  componentDidMount = () => {
    const { cid, images } = this.state;
    Axios.get("/password/getstatus").then(({ data }) => {
      this.setState({ Ebay: data.Ebay });
      this.setState({ Poshmark: data.Poshmark });
      this.setState({ Mercari: data.Mercari });
    });

/*    Axios.get("/template")
         .then((data) => {this.setState({ templates: data.data.templates });})
         .catch((err) => {console.log(err);});*/

    Axios.get("/password/getstatus/others").then(({ data }) => {
      if (data.length > 0) {
        this.setState({ othersbool: true });
        data.map((d, i) => {
          const others = [...this.state.others];
          others.push(d);

          this.setState({ others });
          const otherss = [...this.state.othersstate];
          otherss.push(localStorage.getItem(d) || false);
          this.setState({ othersstate: otherss });

        });
      }
    });

    Axios.get("/payment/rates")
         .then((res) => {this.setState({ rates: res.data[res.data.length - 1] });})
         .catch((err) => console.log(err));

    Axios.get("/clientdetails")
      .then(({ data }) => {
        if (!data.isSubscribed) 
        {
          alert("You are not subscribed, Kindly Subscribe To Hammoq Listing Services To Continue.");
          window.open("/subscription", "_self");
        }
        else if(parseInt(data.balance) < 5 && data.savedCards.length > 0) this.setState({ open: true });
        else if (parseInt(data.balance) < 5 && data.savedCards.length == 0) 
        {
          window.alert("Low Payment and No card added, Please add a card and then add payment..");
          window.open("/subscription", "_self");
        }
        this.setState({
          bal: data.balance,
          client_id: data._id,
          savedCards: data.savedCards,
          cid: data._id,
          offeredRate: data.offeredRate || {},
        });
        this.setState({ cid: data._id }, () => localStorage.setItem("cid", this.state.cid));
      })
      .catch((err) => console.log(err));
  };

  fetchimg = (src) => {
    const { cid } = this.state;
    this.setState({ fullimg: src }, () => {$("#addTemplateModal1").modal("show");});
  };

  change = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  setCategory = (str) => {
    if (this.state.category === str) this.setState({ category: "" });
    else this.setState({ category: str });
  };

  onSubmit = async () => {
    //e.preventDefault();
    const { images, cid } = this.state;
    const data = new FormData();
    var imagedata = new FormData();
    var imageid={}
  

    if (images[0].img == "") return alert("Atleast first image is required");
    if (this.state.input1 == "Select Condition *" || this.state.input1 == "") return alert("Condition is required");

    var y = [];
    this.state.others.map((o, i) => {
      let obj = {
        name: o,
        status: this.state.othersstate[i],
        url: "",
      };
      y.push(obj);
    });

    var mplace = true;

    if (this.state.Ebay == true || this.state.Poshmark == true || this.state.Mercari == true || this.state.others.length != 0) mplace = true;
    else 
    {
      mplace = false;
      return $("#addTemplateModal").modal("show");
      return alert("Please Have At Least One Marketplace Login Entered")
    }

    var flag = 0;
    this.state.othersstate.forEach((os) => {if (os == "true") flag = 1;});
    if ((this.state.Ebay == true && this.state.ebay == true) || (this.state.Poshmark == true && this.state.poshmark == true) || (this.state.Mercari == true && this.state.mercari == true)) flag = 1;
    if (mplace && flag == 0) return alert("Please Have At Least One Marketplace Login Selected");

    //bal check routine
    var cnt = 0;

    if (this.state.Ebay && this.state.ebay == true) cnt++;
    if (this.state.Poshmark && this.state.poshmark == true) cnt++;
    if (this.state.Mercari && this.state.mercari == true) cnt++;

    this.state.othersstate.forEach((os) => {if (os == "true") cnt++;});
    var rate1 = 0, rate2 = 0, rate3 = 0;
    var total = 0;
    rate1 = (this.state.rates.basic / 100) * 1;
    rate2 = (this.state.rates.advance / 100) * (cnt - 1);
    if (this.state.delist == true) rate3 = (this.state.rates.list / 100) * (cnt - 1);
    total = rate1 + rate2 + rate3;

    if (this.state.bal - total < 0) 
    {
      if (this.state.savedCards.length > 0) 
      {
        this.setState({ open: true });
        window.alert("Insufficient balance");
      } 
      else 
      {
        window.alert("Low Payment and No card added, Please add a card and then add payment..");
        window.open("/subscription", "_self");
      }
    }

    data.append("sku", this.state.input2);

    if (this.state.input3 == 0) {
      data.append("quantity", 1);
    } else {
      data.append("quantity", this.state.input3);
    }

    data.append("price", this.state.input4);
    data.append("brand", this.state.input5);
    data.append("model", this.state.input6);
    data.append("note", this.state.input7);
    data.append("condition_name", this.state.input1);
    if (this.state.Ebay) {
      data.append("ebayc", this.state.ebay);
    } else {
      data.append("ebayc", false);
    }
    if (this.state.Mercari) {
      data.append("mercaric", this.state.mercari);
    } else {
      data.append("mercaric", false);
    }
    if (this.state.Poshmark) {
      data.append("poshmarkc", this.state.poshmark);
    } else {
      data.append("poshmarkc", false);
    }
    // if(this.state.others){
    //     for(let i = 0 ; i < this.state.others.length ; i++){
    //     data.append(this.state.others[i],false)
    // }
    // }

    data.append("waist", this.state.input8);
    data.append("inseam", this.state.input9);
    data.append("category", this.state.category);
    data.append("rise", this.state.input10);
    data.append("weightLB", this.state.input11);
    data.append("weightOZ", this.state.input12);
    data.append("delistc", this.state.delist);
    data.append("activity", "basic");
    data.append("status", true);
    data.append("listed", false);
    data.append("costOfGoods", this.state.costOfGoods || 0);
    data.append("others", JSON.stringify(y));
    data.append("rate1", rate1);
    data.append("rate2", rate2);
    data.append("rate3", rate3);
    data.append("prodStatus", "submitted");

    this.setState({ isSubmitting: true });

    if(localStorage.getItem("isSubscribed") === false || localStorage.getItem("isSubscribed") === "false")
    {
      alert("You are not subscribed, Kindly Subscribe To Hammoq Listing Services To Continue.");
      return;
    }
    else
    {
      
       await Promise.all(images.filter(image => !!image.img).map( async (image) => { if (!!image.img) {
        imagedata = new FormData();
        imagedata.append(image.key, image.img);
        let response = await Axios.post("/product/images", imagedata, {headers: {"Content-Type": "multipart/form-data"}})
        imageid[image.key] = response.data.imageid
        this.setState({ progress : this.state.progress + 7 })
      }}))

   
      this.setState({ progress : 90})
      data.append("images",JSON.stringify(imageid))
      Axios.post("/product", data, {headers: {"Content-Type": "multipart/form-data"}})
          .then((response) => {
            this.setState({ progress : 98})
            let productId = response.data.products
                          ? response.data.products[response.data.products.length - 1]._id
                          : response.data.products;
        if (this.state.templateId) Axios.post("/producttemplate", { productId: productId, templateId: this.state.templateId }).then((response) => {});
        window.open("/basic", "_self");
      })
      .catch((err) => console.log(err));
      
      
        
  }
  };
  
  handleSubmit = (e) => {
    const { website, username, password } = this.state;
    e.preventDefault();
    if (website != "" && username != "" && password != "") 
    {
      this.setState({ loading: true });

      Axios.post("/password", {website: website, username: username, password: password})
           .then((response) => {
          //this.setState({ loading: false });
          alert("Login details has been added");
          if (website == "Ebay") {
            this.setState({ Ebay: true });
            this.setState({ loading: false });
          } else if (website == "Poshmark") {
            this.setState({ Poshmark: true });
            this.setState({ loading: false });
          } else if (website == "Mercari") {
            this.setState({ Mercari: true });
            this.setState({ loading: false });
          } else {
            // const others = [...this.state.others];
            // others.push(website);
            // this.setState({ others });
            // const otherss = [...this.state.othersstate];
            // otherss.push(true);
            // this.setState({ othersstate: otherss });

            Axios.get("/password/getstatus/others").then(({ data }) => {
              //console.log(data);
              this.setState({ loading: false });
              if (data.length > 0) {
                this.setState({ othersbool: true });
                data.map((d, i) => {
                  const others = [...this.state.others];
                  others.push(d);
                  this.setState({ others });

                  const otherss = [...this.state.othersstate];
                  otherss.push(true);
                  this.setState({ othersstate: otherss });
                });
              }
            });
          }
          //  Axios.get("/password/getstatus").then(({ data }) => {
          //   //console.log(data);
          //   this.setState({ Ebay: data.Ebay });
          //   this.setState({ Poshmark: data.Poshmark });
          //   this.setState({ Mercari: data.Mercari });
          // });
        })
        .catch((err) => {
          this.setState({ isSubmitting: true });
          console.log(err) || alert(JSON.stringify({ err: err }));
        });
    } else {
      alert("Fill up the details");
    }
  };

  handleChange = async (event) => {
    const { images, cid } = this.state;
    const idx = images.findIndex((image) => image.key === event.target.name);
    try {
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

  handleChangepop = (e) => {
    const { name, value } = e.target;
    if (value == "Others") {
      this.setState({ otherssignal: true });
    } else {
      if (value == "Ebay" || value == "Poshmark" || value == "Mercari") {
        this.setState({ otherssignal: false });
      }
      this.setState({ [name]: value });
    }
  };

  handleOnClick = (o, i) => {
    if (this.state.othersstate[i] == "false") {
      this.state.othersstate[i] = "true";
    } else if (this.state.othersstate[i] == "true") {
      this.state.othersstate[i] = "false";
    }
    this.setState({ othersstate: this.state.othersstate });
  };

  handleBulkUpload = async (e) => {
    const { images, cid } = this.state;
    var imgobj = [];
    const files = e.target.files;
    const count = files.length;

    this.setState({ isSubmitting: true });
    for (let i = 0; i < count; i++) {
      const idx = images.findIndex((image) => !image.img);
      if (idx > -1) {
        try {
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
    let body = {customer_id: this.state.client_id, amount: amount, stripeId: stripeId};
    this.setState({ open: false });
    await Axios.post("/payment/payment", body)
               .then(({ data }) => {
                if (data.success) {
                  alert(data.msg);
                  window.open("/basic", "_self");
                } else {
                  alert("Credit Card is Not added");
                  window.open("/subscription", "_self");
                }
              })
              .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };
  render() {
    const {
      website,
      username,
      password,
      users,
      otherssignal,
      images,
      isSubmitting,
      Ebay,
      Poshmark,
      Mercari,
      othersbool,
      others,
      othersstate,
      fullimg,
      img,
      templates,
    } = this.state;
    return (
      <div className="container mt-5">
         
      
        
        <PaymentAlert
          open={this.state.open}
          handleClose={this.handleClose}
          updatePayment={this.updatePayment}
          savedCards={this.state.savedCards}
        />

            {this.state.isSubmitting ? (
                    
                      
                    <LinearProgress variant="determinate" value={this.state.progress}  />
                    
                 
                ) : null}
        <Link to="/products/submitted">
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </Link>
        
        <div className="row">
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
                      Please enter the logins for each site you want to list &
                      list to
                    </h6>
                    <select
                      className="form-control body-text"
                      name="website"
                      value={website}
                      onChange={this.handleChangepop}
                    >
                      <option>Select Site</option>
                      {Ebay ? null : <option value="Ebay">Ebay</option>}
                      {Poshmark ? null : (
                        <option value="Poshmark">Poshmark</option>
                      )}
                      {Mercari ? null : (
                        <option value="Mercari">Mercari</option>
                      )}
                      <option value="other">Others</option>
                    </select>
                    <br />
                    {otherssignal ? (
                      <>
                        <input
                          type="text"
                          placeholder="Website"
                          className="form-control mt-3"
                          name="website"
                          value=""
                          onChange={this.handleChangepop}
                        />
                      </>
                    ) : null}
                    <input
                      type="text"
                      placeholder="Username"
                      className="form-control mt-3 body-text"
                      name="username"
                      value={username}
                      onChange={this.handleChangepop}
                    />
                    <input
                      type="text"
                      placeholder="Password"
                      className="form-control mt-3"
                      name="password"
                      value={password}
                      onChange={this.handleChangepop}
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
                        You can always add more logins under setting in the
                        future
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
                  <div className="col-4 col-md-3 px-1 ">
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
                      onChange={(e) => {
                        this.handleBulkUpload(e);
                      }}
                      onClick={(e) => {
                        console.log(e, "onclick");
                      }}
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
          <div className="col-12 col-md-6 pt-4 pt-lg-0">
            <div className="row w-lg-75 mt-lg-0 m-auto">
              <div className="col-sm-12 col-md-6  mb-4 px-1 my-4">
                <select
                  className="custom-select"
                  value={this.state.input1}
                  name="input1"
                  onChange={(e) => this.change(e)}
                  required
                >
                  <option>Select Condition *</option>
                  <option value="New">New</option>
                  <option value="New With Tags">New With Tags</option>
                  <option value="New (Other/Open Box)">
                    New (Other/Open Box)
                  </option>
                  <option value="New With Defects">New With Defects</option>
                  <option value="Seller Refurbished">Seller Refurbished</option>
                  <option value="Used">Used</option>
                  <option value="Broken/For Repair">Broken/For Repair</option>
                </select>
              </div>
              <div className="col-sm-12 col-md-6  mb-4 mt-4 px-1">
                <input
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={this.state.input2}
                  name="input2"
                  placeholder="SKU"
                  className="form-control"
                />
              </div>
              <div className="col-sm-12 col-md-6  mb-4 px-1">
                <input
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={this.state.input5}
                  name="input5"
                  placeholder="Brand"
                  className="form-control"
                />
              </div>
              <div className="col-sm-12 col-md-6  mb-4 px-1">
                <input
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={this.state.input6}
                  name="input6"
                  placeholder="Model"
                  className="form-control"
                />
              </div>
              <div className="col-4 mb-4 px-1">
                <input
                  type="number"
                  onChange={(e) => this.change(e)}
                  value={this.state.input3 === 0 ? "" : this.state.input3}
                  name="input3"
                  defaultValue="1"
                  placeholder="Quantity(1)"
                  min="1"
                  className="form-control"
                />
              </div>
              <div className="col-4 mb-4 px-1">
                <input
                  type="number"
                  onChange={(e) => this.change(e)}
                  value={this.state.input4 === 0 ? "" : this.state.input4}
                  name="input4"
                  placeholder="Selling Price"
                  min="0"
                  className="form-control"
                />
              </div>
              <div className="col-4 mb-4 px-1">
                <input
                  type="number"
                  name="costOfGoods"
                  onChange={(e) => this.change(e)}
                  placeholder="Cost of Goods"
                  className="form-control"
                  step="0.01"
                />
              </div>

              <div className="col-12 d-flex justify-content-between align-content-center border round p-3">
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
              <div className="d-flex justify-content-between py-2 my-2">
                <div className="mr-1">
                  <input
                    type="text"
                    onChange={(e) => this.change(e)}
                    value={this.state.input8}
                    name="input8"
                    placeholder="Waist"
                    className="form-control"
                  />
                </div>
                <div className="mr-1">
                  <input
                    type="text"
                    onChange={(e) => this.change(e)}
                    value={this.state.input9}
                    name="input9"
                    placeholder="Inseam"
                    className="form-control"
                  />
                </div>
                <div className="mr-1">
                  <input
                    type="text"
                    onChange={(e) => this.change(e)}
                    value={this.state.input10}
                    name="input10"
                    placeholder="Rise"
                    className="form-control"
                  />
                </div>
                <div className="mr-1">
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={this.state.input11 === 0 ? "" : this.state.input11}
                    name="input11"
                    placeholder="W (LB)"
                    min="0"
                    className="form-control"
                  />
                </div>
                <div className="">
                  <input
                    type="number"
                    onChange={(e) => this.change(e)}
                    value={this.state.input12 === 0 ? "" : this.state.input12}
                    name="input12"
                    placeholder="W (OZ)"
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-sm-12  mb-4 px-1 py-2">
                <textarea
                  type="text"
                  onChange={(e) => this.change(e)}
                  value={this.state.input7}
                  rows="4"
                  name="input7"
                  placeholder="Notes For VA"
                  className="form-control"
                ></textarea>
              </div>
              <div className="col-12 col-lg-12">
                {Ebay ? (
                  <div className="col-12 col-lg-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={this.state.ebay}
                        onChange={() =>
                          this.setState({ ebay: !this.state.ebay })
                        }
                        id="ebay"
                      />
                      <label className="form-check-label" htmlFor="ebay">
                        List on eBay
                      </label>
                    </div>
                  </div>
                ) : null}
                {Poshmark ? (
                  <div className="col-12 col-lg-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={this.state.poshmark}
                        onChange={() =>
                          this.setState({ poshmark: !this.state.poshmark })
                        }
                        defaultChecked="true"
                        id="poshmark"
                      />
                      <label className="form-check-label" htmlFor="poshmark">
                        List on Poshmark
                      </label>
                    </div>
                  </div>
                ) : null}
                {Mercari ? (
                  <div className="col-12 col-lg-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={this.state.mercari}
                        onChange={() =>
                          this.setState({ mercari: !this.state.mercari })
                        }
                        id="mercari"
                      />
                      <label className="form-check-label" htmlFor="mercari">
                        List on Mercari
                      </label>
                    </div>
                  </div>
                ) : null}
                {othersbool
                  ? others.map((o, i) => {
                      return (
                        <div
                          className="col-12 col-lg-6"
                          onClick={() => this.handleOnClick(o, i)}
                        >
                          <div className="form-check">
                            {this.state.othersstate[i] == "true" ? (
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked
                              />
                            ) : (
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            )}

                            <label
                              className="form-check-label"
                              htmlFor="mercari"
                            >
                              List on {o}
                            </label>
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div className="col-12 col-lg-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={this.state.delist}
                      onChange={() =>
                        this.setState({ delist: !this.state.delist })
                      }
                      id="delist"
                    />
                    <label className="form-check-label" htmlFor="delist">
                      Delist once item is sold
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-6 px-1 mt-2">
                {isSubmitting ? (
                  <button
                    className="btn btn-block d-flex align-items-center justify-content-center"
                    
                  >
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
                    className="btn btn-success mb-4 btn-block"
                  >
                    Submit
                  </button>
                )}
              </div>
              <div className="col-6 px-1 mt-2">
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => this.props.history.push("/products")}
                  className="btn btn-danger mb-4 btn-block"
                />
              </div>
              
            </div>
          </div>
        </div>
        <br />
        <div style={{ marginBottom: "60px" }}></div>
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
