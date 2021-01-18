import React, { Component } from "react";
import "./LeftSection.css";
//import Imagebtn from "../Imagebtn";
//import { Link } from "react-router-dom";
import { HOST } from "../../../../services/Axios";
//import Popover from '@material-ui/core/Popover';
//import Axios from '../../../../services/Axios';
//import Badge from '@material-ui/core/Badge';
import LoadingSpinner from "../../../utils/loader";
//import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
const max = 5000;
const $ = window.$;

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

class LeftSection extends Component {
  constructor() {
    super();
    this.state = {
      messageFormToggle: false,
      modalImage: "",
      imageIndex: 0,
      anchorEl: null,
      custom: true,
      customdesc: false,
      desc: ""
    };
  }

  componentWillMount() {
    if ("custom" in localStorage) {
      let custom = localStorage.getItem("custom");
      this.setState({ custom: custom === "true" });
    }

    if ("customdesc" in localStorage) {
      this.setState({
        customdesc: localStorage.getItem("customdesc") === "true",
      });
    }
  }

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ count: e.target.value.length });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  
  handleImageModal = (idx) => {
    //console.log(idx ,'idx')
    if (
      idx >= 0 &&
      idx < this.props.images.length &&
      this.props.images[idx].img !== null
    ) {
      let image = this.props.images[idx];
      // console.log(image, 'index check')
      this.setState(
        {
          imageIndex: idx,
          fullimg:
            typeof image.img === "string"
              ? image.img.substring(0, 4) !== "http" &&
                image.img.substring(0, 5) !== "https"
                ? HOST + image.img
                : image.img
              : image.img !== null
              ? URL.createObjectURL(image.img)
              : "",
        },
        () => {
          $("#addTemplateModal1").modal("show");
        }
      );
    }
  };

  customdescription = (e) => {
    const { data } = this.props;
    const { customdesc } = this.state
    localStorage.setItem('customdesc', !customdesc);
    this.setState({ customdesc: !customdesc });

    if (data.shortDescription) {
      let desc = data.shortDescription;
      this.setState({ desc });
      data.shortDescription = desc.trim();
    }
  };

  render = () => {
    const { 
      //suggestTitles, 
      //showOtherTitles,
      custom,
      customdesc 
    } = this.state;
    const {
      data,
      handleChange,
      images,
      //Ebay,
      //Poshmark,
      //Mercari,
      handleBulkUpload,
      handleImageChange,
      removeImg,
      extraDescriptions,
      //toggleSelectedOthersWebsite,
      toggleSelectedWebsite
    } = this.props;

    if (custom === false) {
      data.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.style,
        data.pattern,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.ebay.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.style,
        data.pattern,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.poshmark.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
      data.mercari.title = [
        data.brand,
        data.colorShade,
        data.material,
        data.size,
        data.seasonOrWeather,
        data.care,
        data.madeIn,
      ].reduce((title, val) =>
        val === undefined || val === "" ? title : title + " " + val
      );
    }

    if (customdesc === false) {
      data.shortDescription =
        (data.title !== undefined
          ? data.title !== ""
            ? data.title + "\n" + "\n"
            : ""
          : "") +
        (data.brand !== undefined
          ? data.brand !== ""
            ? "Brand: " + data.brand + "\n"
            : ""
          : "") +
        (data.model !== undefined
          ? data.model !== ""
            ? "Model: " + data.model + "\n"
            : ""
          : "") +
        (data.category !== undefined
          ? data.category !== ""
            ? "Category: " + data.category + "\n"
            : ""
          : "") +
        (data.colorShade !== undefined
          ? data.colorShade !== ""
            ? "Color: " + data.colorShade + "\n"
            : ""
          : "") +
        (data.material !== undefined
          ? data.material !== ""
            ? "Material: " + data.material + "\n"
            : ""
          : "") +
        (data.style !== undefined
          ? data.style !== ""
            ? "Style: " + data.style + "\n"
            : ""
          : "") +
        (data.pattern !== undefined
          ? data.pattern !== ""
            ? "Pattern: " + data.pattern + "\n"
            : ""
          : "") +
        (data.size !== undefined
          ? data.size !== ""
            ? "Size: " + data.size + "\n"
            : ""
          : "") +
        (data.seasonOrWeather !== undefined
          ? data.seasonOrWeather !== ""
            ? "Season/Weather: " + data.seasonOrWeather + "\n"
            : ""
          : "") +
        (data.care !== undefined
          ? data.care !== ""
            ? "Care: " + data.care + "\n"
            : ""
          : "") +
        (data.madeIn !== undefined
          ? data.madeIn !== ""
            ? "Made in: " + data.madeIn + "\n"
            : ""
          : "") +
        (data.line1 !== undefined
          ? data.line1 !== ""
            ? data.line1 + ": " + data.value1 + "\n"
            : ""
          : "") +
        (data.line2 !== undefined
          ? data.line2 !== ""
            ? data.line2 + ": " + data.value2 + "\n"
            : ""
          : "") +
        (data.line3 !== undefined
          ? data.line3 !== ""
            ? data.line3 + ": " + data.value3 + "\n"
            : ""
          : "") +
        (data.line4 !== undefined
          ? data.line4 !== ""
            ? data.line4 + ": " + data.value4 + "\n"
            : ""
          : "") +
        (data.line5 !== undefined
          ? data.line5 !== ""
            ? data.line5 + ": " + data.value5 + "\n"
            : ""
          : "") +
        (data.line6 !== undefined
          ? data.line6 !== ""
            ? data.line6 + ": " + data.value6 + "\n"
            : ""
          : "") +
        (data.line7 !== undefined
          ? data.line7 !== ""
            ? data.line7 + ": " + data.value7 + "\n"
            : ""
          : "") +
        (data.line8 !== undefined
          ? data.line8 !== ""
            ? data.line8 + ": " + data.value8 + "\n"
            : ""
          : "");

      for (let i = 0; i < extraDescriptions.length; i++) {
        if((extraDescriptions[i].value !== "" | null | undefined | "No Suggested Values") && (extraDescriptions[i].value.localizedValue !== "" | null | undefined | "No Suggested Values"))
        {
          data.shortDescription +=
            extraDescriptions[i].key + ": " + extraDescriptions[i].value.localizedValue + "\n";
        }
      }

      if(data.companyBlurb !== undefined)
      {
        data.shortDescription+=
        (data.companyBlurb !== undefined
          ? data.companyBlurb !== ""
            ? "\n" + data.companyBlurb + "\n"
            : ""
          : "");
      }
    }


    return (
      <>
      <div className='left__app'>
        <div className="mt-3" />
          <div className="row m-auto">
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
                      //style={{ width: "500px", height: "10px" }}
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
                        <img
                          src={this.state.fullimg}
                          style={{ height: "500px" }}
                          alt="+"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card text-primary mb-3">
                    <div className="card-body body-text text-center align-middle d-flex align-items-center justify-content-center p-2 px-1">
                      {image.img ? (
                        <div className="container p-0 m-0">
                          <img
                            src={
                              typeof image.img === "string"
                                ? HOST + image.img
                                : URL.createObjectURL(image.img)
                            }
                            style={{ width: "100%", height: "90px" }}
                            alt="+"
                            onClick={() => {
                              this.setState(
                                {
                                  fullimg:
                                    typeof image.img === "string"
                                      ? HOST + image.img
                                      : URL.createObjectURL(image.img),
                                },
                                () => {
                                  $("#addTemplateModal1").modal("show");
                                }
                              );
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
                          <label style={{ fontSize: "18px" }}>
                            <div className="fas fa-plus"></div>
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
            <div className="col-12 px-1">
              <div className="input-group mb-3">
                {this.props.isSubmitting ? (
                  <div className="center">
                    <LoadingSpinner />
                  </div>
                ) : null}
                <div className="custom-file">
                  <input
                    type="file"
                    accept="image/*"
                    className="custom-file-input"
                    multiple
                    onChange={handleBulkUpload}
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="inputGroupFile01"
                  >
                    Bulk Upload Images
                  </label>
                </div>
              </div>
            </div>
          </div>
        <div className='store__buttons'>
          <button className={`${data["ebay"]["check"] === true ? "outline__button" : "fill__button"}`}
                  onClick={() => {toggleSelectedWebsite("ebay");}}
                  id="EbayToggleButton"
                  >Ebay</button>
          <button className={`${data["mercari"]["check"] === true ? "outline__button" : "fill__button"}`}
                  onClick={() => {toggleSelectedWebsite("mercari");}}
                  id="MercariToggleButton"
                  >Mercari</button>
        </div>
        <div className='store__buttons'>
          <button className={`${data["poshmark"]["check"] === true ? "outline__button" : "fill__button"}`}
                  onClick={() => {toggleSelectedWebsite("poshmark");}}
                  id="PoshmarkToggleButton"
                  >Poshmark</button>
          <button className='outline__button'>Other</button>
        </div>
        <div className='store__buttons'>
          <button className={`${data["delist"]["check"] === true ? "outline__button_red" : "fill__button_red"} w-100`}
                  onClick={() => {toggleSelectedWebsite("delist");}}
                  id="DelistToggleButton"
                  >Delist</button>
        </div>
        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            Short Description
            {
              customdesc ?
                <button
                className={
                    "btn btn-warning ml-2 btn-sm"
                }
                onClick={this.customdescription}
              >
                 Automatic Generate
              </button>
            :
              <button
              className={
                  "btn btn-success ml-2  btn-sm"
              }
              onClick={this.customdescription}
            >
              Custom
            </button>
          }
          </label>
          <textarea
            className="form-control"
            id="shortDescriptionInputField"
            rows="7"
            name="shortDescription"
            value={data.shortDescription}
            onKeyUp={this.handleChanges}
            onChange={handleChange}
          ></textarea>
          <small className="form-text text-muted" style={{ fontSize: "0.5em" }}>
            {this.state.count}/5000 max characters
          </small>
        </div>
        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            Keywords or tags
          </label>
          <textarea
            className="form-control"
            id="KeywordsTagsInputField"
            rows="5"
            name="keywords"
            defaultValue={data.keywords}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            Enter Note (Will not be displayed in listing)
          </label>
          <textarea
            className="form-control"
            id="NoteInputField"
            rows="5"
            name="note"
            defaultValue={data.note}
            onChange={handleChange}
          />
        </div>
      </div>
      </>
    );
  };
}

export default LeftSection;
