import React, { Component } from "react";
import Input from "./Input";
import "./style.css";
import { Link } from "react-router-dom";
import { assetsURL } from "../../../services/Axios";
import ButtonGroup from "./ButtonGroup";
import LoadingSpinner from "../../utils/loader";
import Popover from "@material-ui/core/Popover";
import Axios from "../../../services/Axios";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const max = 5000;
const $ = window.$;

export default class extends Component {
  constructor() {
    super();
    this.state = {
      suggestTitles: true,
      showOtherTitles: false,

      selectedWebsites: [],
      category: "",
      showMoreLines: false,
      value: "",
      count: 0,
      fullimg: "",
      messageFormToggle: false,
      anchorEl: null,
      msgFormTitle: "",
      msgFormDescription: "",
      productMessage: [],
      modalImage: "",
      imageIndex: 0,
    };
  }

  componentDidMount = () => {
    const image = assetsURL + this.props.images[0].img;

    this.setState({ modalImage: image });
  };

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ count: e.target.value.length });
  };

  handleMessage = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleMessageSubmit = async () => {
    const formData = {
      msgformTitle: this.state.msgFormTitle,
      senderName: `customer : ${localStorage.getItem("customerName")}`,
      msgFormDescription: this.state.msgFormDescription,
      field: this.state.field,
    };
    //window.alert(formData.senderName)
    try {
      const response = await Axios.post(
        `/message/${this.props.productid}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response, 'customer jshdfjkhakl')
      this.setState({ anchorEl: null });
    } catch (error) {
      console.log(error);
    }
  };

  handleMessageData = async (value, event) => {
    //console.log(value,"value")
    const productId = this.props.productid;
    const messageFormToggle = this.state.messageFormToggle;
    const anchorEl = event.currentTarget;
    //  console.log(anchorEl)
    try {
      const response = await Axios.get(`/message/${productId}/${value}`, {
        headers: {
          "content-type": "application/json",
          headers: localStorage.getItem("token"),
        },
      });
      //  console.log(response, "messsage data value")
      this.setState({
        productMessage: response.data.message,
        messageFormToggle: !messageFormToggle,
        msgFormTitle: `was : ${this.props.data[value]}`,
        field: value,
        anchorEl,
      });
    } catch (error) {
      console.log(error);
    }
  };

  setCategory = (str) => {
    const { data } = this.props;
    if (this.state.category === str) {
      data["category"] = "";
      this.props.setCategory("");
      this.setState({ category: "" });
    } else {
      data["category"] = str;
      this.props.setCategory(str);
      this.setState({ category: str });
    }
  };
  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleImageModal = (idx) => {
    //console.log(idx ,'idx')
    console.log(this.props.images, "concoel");
    if (
      idx >= 0 &&
      idx < this.props.images.length &&
      this.props.images[idx].img != null
    ) {
      let image = this.props.images[idx];
      // console.log(image, 'index check')
      this.setState(
        {
          imageIndex: idx,
          fullimg:
            typeof image.img === "string"
              ? image.img.substring(0, 4) != "http" &&
                image.img.substring(0, 5) != "https"
                ? assetsURL + image.img
                : image.img
              : image.img != null
              ? URL.createObjectURL(image.img)
              : "",
        },
        () => {
          $("#addTemplateModal1").modal("show");
        }
      );
    }
  };

  render = () => {
    //  console.log(this.state.imageIndex, 'image index')
    const { suggestTitles, showOtherTitles } = this.state;
    const {
      data,
      handleChange,
      images,
      Ebay,
      Poshmark,
      Mercari,
      othersbool,
      others,
      othersstate,
      handleBulkUpload,
      handleImageChange,
      removeImg,
      extraMeasures,
      addMeasure,
      removeMeasure,
      handleMeasureChange,
      handleMeasureLabel,
      handleOtherTitles,
      toggleSelectedOthersWebsite,
      showcat,
      messageNotSeen,
    } = this.props;

    const {
      selectedWebsites,
      category,
      showMoreLines,
      messageFormToggle,
      anchorEl,
      productMessage,
    } = this.state;
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const { toggleSelectedWebsite } = this.props;
    return (
      <>
        <div className="mt-3" />
        <h4>
          <text className="text-danger">*</text>
          <u>Upload Images:</u>
        </h4>
        <div className="row">
          {images.map((image, idx) => {
            return (
              <div className="col-12 col-lg-4 px-2">
                <div
                  className="modal fade bd-example-modal-sm"
                  id="addTemplateModal1"
                  tabIndex={-1}
                  role="dialog"
                  aria-labelledby="addTemplateModalLabel"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-lg modal-dialog-centered"
                    style={{ width: "50%", maxHeight: "auto" }}
                  >
                    <div className="modal-content">
                      <div className="modal-header d-flex justify-content-between">
                        <div>
                          <FaChevronLeft
                            onClick={() => {
                              this.handleImageModal(this.state.imageIndex - 1);
                            }}
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                        <div>
                          <FaChevronRight
                            onClick={() => {
                              this.handleImageModal(this.state.imageIndex + 1);
                            }}
                          />
                        </div>
                      </div>

                      <div
                        className="d-flex  justify-content-center"
                        style={{
                          maxWidth: "100%",
                          padding: "auto",
                        }}
                      >
                        {" "}
                        <img
                          src={this.state.fullimg}
                          style={{ maxWidth: "100%", maxHeight: "500px" }}
                        />
                      </div>
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
                              ? image.img.substring(0, 4) != "http" &&
                                image.img.substring(0, 5) != "https"
                                ? assetsURL + image.img
                                : image.img
                              : URL.createObjectURL(image.img)
                          }
                          style={{ width: "100%", height: "90px" }}
                          // onClick={() => {
                          //   this.setState(
                          //     {
                          //       fullimg:
                          //         typeof image.img === "string"
                          //           ? image.img.substring(0, 4) != "http" &&
                          //             image.img.substring(0, 5) != "https"
                          //             ? assetsURL + image.img
                          //             : image.img
                          //           : URL.createObjectURL(image.img),
                          //     },
                          //     () => {
                          //       $("#addTemplateModal1").modal("show");
                          //     }
                          //   );
                          // }}
                          onClick={() => {
                            this.handleImageModal(idx);
                          }}
                        ></img>

                        <button
                          type="button"
                          className="btn2 close mr-auto"
                          data-dismiss="modal"
                          aria-label="Close"
                          onClick={() => removeImg(idx)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "40px",
                          height: "90px",
                          margin: "0px!important",
                        }}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <label style={{ fontSize: "18px", color: "#4a86e8" }}>
                          <div className="fas fa-plus"></div> <br />
                          {image.label}
                        </label>
                        <input
                          type="file"
                          style={styles.inputFile}
                          name={image.key}
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="col-8 col-lg-12 px-1">
            <div className="input-group mb-3" style={{ fontSize: "18px" }}>
              {this.props.isSubmitting ? (
                <div className="center">
                  <LoadingSpinner />
                </div>
              ) : null}
              <div className="custom-file">
                <input
                  id="bulk"
                  type="file"
                  accept="image/*"
                  className="custom-file-input"
                  multiple
                  onChange={handleBulkUpload}
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Bulk Upload Images
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Suggest Titles */}
        {/* <div className="d-flex align-items-center py-3">
          <div className="h6 fw-600 text-uppercase mt-3">Suggest Titles?</div>
          {suggestTitles ? (
            <i
              className="fas fa-check-square c-pointer text-primary ml-3 mt-2"
              onClick={() => this.setState({ suggestTitles: false })}
            ></i>
          ) : (
            <i
              className="far fa-square c-pointer text-primary ml-3 mt-2"
              onClick={() => this.setState({ suggestTitles: true })}
            ></i>
          )}
        </div> */}

        {/*market place and category*/}
        <div className="h6 col-6 text-uppercase">
          SELECT ACTIONS YOU WANT FOR E-COMMERCE LISTING
        </div>

        <div className="button-group">
          <div className="d-lg-flex justify-content-around my-3">
            <div className="col-12 col-lg-2 mr-lg-1 ">
              <button
                className={`btn btn-${
                  selectedWebsites.includes("SOLD")
                    ? "primary"
                    : "outline-primary"
                }`}
                onClick={() => toggleSelectedWebsite("SOLD")}
                disabled
              >
                SOLD
              </button>
            </div>
            {Ebay ? (
              <div className="col-12 col-lg-2 mx-lg-1 ">
                <button
                  className={` btn  btn-${
                    data["ebay"]["check"] === true
                      ? "primary"
                      : "outline-primary"
                  }`}
                  onClick={() => {
                    toggleSelectedWebsite("ebay");
                  }}
                  name="ebay"
                >
                  EBAY
                </button>
              </div>
            ) : null}
            {Poshmark ? (
              <div className="col-12 col-lg-3 mx-lg-1 ">
                <button
                  className={`btn  btn-${
                    data["poshmark"]["check"] === true
                      ? "primary"
                      : "outline-primary"
                  }`}
                  onClick={() => {
                    toggleSelectedWebsite("poshmark");
                  }}
                >
                  POSHMARK
                </button>
              </div>
            ) : null}
            {Mercari ? (
              <div className="col-12 col-lg-3 ml-lg-1">
                <button
                  className={` btn  btn-${
                    data["mercari"]["check"] === true
                      ? "primary"
                      : "outline-primary"
                  }`}
                  onClick={() => {
                    toggleSelectedWebsite("mercari");
                  }}
                >
                  MERCARI
                </button>
              </div>
            ) : null}

            <div className="col-12 col-lg-2  ">
              <button
                className={` btn  btn-${
                  data["delist"]["check"] === true
                    ? "primary"
                    : "outline-primary"
                }`}
                onClick={() => {
                  toggleSelectedWebsite("delist");
                }}
              >
                DELIST
              </button>
            </div>
          </div>
        </div>

        <div className="button-group">
          <div className="row">
            {othersbool
              ? others.map((o, i) => {
                  if (o)
                    return (
                      <div className="col-6 p-1">
                        <button
                          style={{ width: "100%" }}
                          className={` btn  btn-${
                            othersstate[i] == true || othersstate[i] == "true"
                              ? "primary"
                              : "outline-primary"
                          }`}
                          onClick={() => {
                            toggleSelectedOthersWebsite(i);
                          }}
                        >
                          {o.replace("https://", "")
                            ? o.replace("https://", "").substring(0, 25)
                            : o.replace("http://", "")
                            ? o.replace("http://", "").substring(0, 25)
                            : o.substring(0, 25)}
                        </button>
                      </div>
                    );
                })
              : null}
          </div>
        </div>

        <h4>
          <text className="text-danger">*</text>Choose Category:
        </h4>

        <div className="col-12 col-lg-12 p-1">
          <ButtonGroup
            category="Men"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            category="Women"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            category="Unisex Kids"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            category="Babies"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            category="Specialty"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />

          {showcat && (
            <input
              className="form-control form-control-sm col-4 mt-2 border-secondary"
              style={{ backgroundColor: "" }}
              type="text"
              name="category"
              placeholder="Custom Category"
              value={data.category}
              onChange={handleChange}
              maxLength="140"
            />
          )}
        </div>

        {/* Measurements */}
        <div className="measurements pt-3">
          <span className="h4 p-2 pr-3">Measurements :-</span>
          <div className="form-group my-2 my-4 d-flex align-items-center">
            <button
              onClick={(event) => this.handleMessageData("waist", event)}
              // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.waist}`, anchorEl : event.currentTarget,  field : "waist" })}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: messageNotSeen.includes("waist") ? "red" : "",
              }}
            >
              +
            </button>
            <label className=" mb-0 mr-3 label">Waist :-</label>
            <input
              className="form-control form-control-sm"
              type="number"
              name="waist"
              id="waist"
              value={data.waist}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-2 my-4 d-flex align-items-center">
            <button
              onClick={(event) => this.handleMessageData("inseam", event)}
              // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.inseam}`, anchorEl : event.currentTarget,  field : "inseam" })}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: messageNotSeen.includes("inseam") ? "red" : "",
              }}
            >
              +
            </button>
            <label className=" mb-0 mr-3 label">Inseam :-</label>
            <input
              className="form-control form-control-sm"
              type="number"
              name="inseam"
              id="inseam"
              value={data.inseam}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-2 my-4 d-flex align-items-center">
            <button
              onClick={(event) => this.handleMessageData("rise", event)}
              //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.rise}`, anchorEl : event.currentTarget,  field : "rise" })}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: messageNotSeen.includes("rise") ? "red" : "",
              }}
            >
              +
            </button>
            <label className=" mb-0 mr-3 label">Rise :-</label>
            <input
              className="form-control form-control-sm"
              type="number"
              name="rise"
              id="rise"
              value={data.rise}
              onChange={handleChange}
            />
          </div>
          {extraMeasures &&
            extraMeasures.map((measure) => {
              return (
                <div className="form-group my-2 my-4 d-flex align-items-center">
                  <input
                    className="form-control form-control-sm mb-0 mr-1"
                    type="text"
                    name="label"
                    id={measure.label}
                    defaultValue={measure.label}
                    onChange={(e) => handleMeasureLabel(measure.id, e)}
                    placeholder="Type of measurement"
                  />
                  :-
                  <input
                    className="form-control form-control-sm col-2 ml-3"
                    type="number"
                    name="value"
                    defaultValue={measure.val}
                    placeholder="Measurement"
                    onChange={(e) => handleMeasureChange(measure.id, e)}
                  />
                  <button
                    className="btn"
                    onClick={(e) => removeMeasure(measure.id, e)}
                  >
                    <div className="fa fa-minus-square ml-3"></div>
                  </button>
                </div>
              );
            })}
        </div>

        <div className="h6 pt-3 fw-500 text-uppercase mt-3">
          <button
            className="btn no-border"
            style={{ color: "#186194" }}
            onClick={addMeasure}
          >
            <u>Enter More or Different Measurements ?</u>
            <div className="fa fa-plus-square ml-3"></div>
          </button>
        </div>

        {/* Meta Data */}

        <div className="row">
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("price", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.price}`, anchorEl : event.currentTarget,  field : "price" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("price") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">
                <text className="text-danger">*</text>Selling Price
              </label>
              <input
                type="number"
                className="form-control"
                name="price"
                id="price"
                value={data.price}
                min="0"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("mrp", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.mrp}`, anchorEl : event.currentTarget,  field : "mrp" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("mrp") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">MRP</label>
              <input
                type="number"
                className="form-control"
                name="mrp"
                id="mrp"
                value={data.mrp}
                min="0"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-2 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("msrp", event)}
                //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.msrp}`, anchorEl : event.currentTarget,  field : "msrp" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("msrp") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">MSRP</label>
              <input
                type="number"
                className="form-control"
                name="msrp"
                id="msrp"
                value={data.msrp}
                min="0"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) =>
                  this.handleMessageData("costOfGoods", event)
                }
                //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.costOfGoods}`, anchorEl : event.currentTarget,  field : "costOfGoods" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("costOfGoods") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">COST OF GOODS</label>
              <input
                type="number"
                name="costOfGoods"
                defaultValue={data.costOfGoods}
                onChange={handleChange}
                id="costOfGoods"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) =>
                  this.handleMessageData("shippingFees", event)
                }
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("shippingFees") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">SHIPPING/OTHER COSTS?</label>
              <input
                type="number"
                name="shippingFees"
                id="shippingFees"
                defaultValue={data.shippingFees}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-2 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("profit", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.profit}`, anchorEl : event.currentTarget,  field : "profit" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("profit") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Profit</label>
              <input
                type="number"
                name="profit"
                id="profit"
                defaultValue={data.profit}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("sku", event)}
                //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.sku}`, anchorEl : event.currentTarget,  field : "sku" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("sku") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">SKU</label>
              <input
                type="text"
                className="form-control"
                name="sku"
                id="sku"
                value={data.sku}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("upc", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.upc}`, anchorEl : event.currentTarget,  field : "upc" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("upc") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">UPC</label>
              <input
                type="text"
                className="form-control"
                name="upc"
                id="upc"
                value={data.upc}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-2 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("quantity", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.quantity}`, anchorEl : event.currentTarget,  field : "quantity" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("quantity") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">
                <text className="text-danger">*</text>Quantity?
              </label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                id="quantity"
                defaultValue="1"
                min="1"
                value={data.quantity}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/*Shipping details*/}

        <div className="row">
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("weightOZ", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.weightLB}`, anchorEl : event.currentTarget,  field : "weightLB" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("weightLB") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Shipping weight lb/kg</label>
              <input
                type="number"
                className="form-control"
                name="weightLB"
                id="weightLB"
                defaultValue={data.weightLB}
                min="0"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("weightOZ", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.weightOZ}`, anchorEl : event.currentTarget,  field : "weightOZ" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("weightOZ") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Shipping weight oz/g</label>
              <input
                type="number"
                className="form-control"
                name="weightOZ"
                id="weightOZ"
                defaultValue={data.weightOZ}
                min="0"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-2 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) => this.handleMessageData("zipCode", event)}
                // onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.zipCode}`, anchorEl : event.currentTarget,  field : "zipCode" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("zipCode") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Shipping zip or city code</label>
              <input
                type="text"
                className="form-control"
                name="zipCode"
                id="zipCode"
                defaultValue={data.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) =>
                  this.handleMessageData("packageLength", event)
                }
                //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.packageLength}`, anchorEl : event.currentTarget,  field : "packageLength" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("packageLength") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Shipping package length</label>
              <input
                type="number"
                className="form-control"
                name="packageLength"
                id="packageLength"
                defaultValue={data.packageLength}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-3 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) =>
                  this.handleMessageData("packageWidth", event)
                }
                //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.packageWidth}`, anchorEl : event.currentTarget,  field : "packageWidth" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("packageWidth") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Shipping package width</label>
              <input
                type="number"
                className="form-control"
                name="packageWidth"
                id="packageWidth"
                defaultValue={data.packageWidth}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-2 col-lg-4">
            <div className="form-group">
              <button
                onClick={(event) =>
                  this.handleMessageData("packageHeight", event)
                }
                //onClick={(event) => this.setState({ messageFormToggle: !messageFormToggle, msgFormTitle :`was : ${data.packageHeight}`, anchorEl : event.currentTarget,  field : "packageHeight" })}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: messageNotSeen.includes("packageHeight") ? "red" : "",
                }}
              >
                +
              </button>
              <label className="label mb-3">Shipping package height</label>
              <input
                type="number"
                className="form-control"
                name="packageHeight"
                id="packageHeight"
                defaultValue={data.packageHeight}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {messageFormToggle && (
          <Popover
            className
            id={id}
            open={open}
            anchorEl={this.state.anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div
              className="col"
              style={{
                width: "20rem",
                paddingBottom: "1rem",
                paddingTop: "1rem",
              }}
            >
              <div
                className="scroll"
                style={{ overflow: "auto", width: "18rem", height: "15rem" }}
              >
                <p>
                  {productMessage &&
                    productMessage.map((msg) => {
                      return (
                        <div>
                          <small>{msg.senderName ? msg.senderName : ""}</small>
                          <p
                            style={{
                              color: "red",
                              marginTop: "2px",
                              marginBottom: "2px",
                            }}
                          >
                            {msg.msgformTitle}
                          </p>
                          <p style={{ marginTop: "2px", marginBottom: "2px" }}>
                            {msg.msgFormDescription}
                          </p>{" "}
                          <hr />
                        </div>
                      );
                    })}
                </p>
              </div>
              <div style={{ paddingBottom: "1rem" }}>
                <form onSubmit={this.handleMessageSubmit}>
                  <input
                    placeholder="title"
                    style={{ width: "100%" }}
                    onChange={this.handleMessage}
                    value={this.state.msgFormTitle}
                    name="msgformTitle"
                  />
                  <textarea
                    placeholder="explain"
                    style={{ width: "100%" }}
                    onChange={this.handleMessage}
                    value={`${this.state.msgFormDescription}`}
                    name="msgFormDescription"
                  />
                  <button className="btn btn-primary">Send</button>
                </form>
              </div>
            </div>
          </Popover>
        )}

        {/*keywords & notes(not displayed in listing)*/}
        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            Keywords or tags
          </label>
          <textarea
            className="form-control col-12 col-lg-12"
            id="keywords"
            rows="5"
            name="keywords"
            defaultValue={data.keywords}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            Enter Note (Will not be displayed in listing)
          </label>
          <textarea
            className="form-control"
            id="note"
            rows="5"
            name="note"
            defaultValue={data.note}
            onChange={handleChange}
          ></textarea>
        </div>
      </>
    );
  };
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
