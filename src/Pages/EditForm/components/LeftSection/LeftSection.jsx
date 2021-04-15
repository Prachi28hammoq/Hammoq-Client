import React, { Component } from "react";
import "./LeftSection.css";
import { assetsURL } from "../../../../services/Axios";
import LoadingSpinner from "../../../utils/loader";
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
      shortDescCharCount: 0,
      modalImage: "",
      imageIndex: 0,
      anchorEl: null,
      customdesc: false,
      desc: ""
    };
  }

  componentWillMount() 
  {
    if ("customdesc" in localStorage) 
    {
      this.setState({customdesc: localStorage.getItem("customdesc") === "true"});
    }
  }

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ shortDescCharCount: e.target.value.length });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  
  handleImageModal = (idx) => {
    if (
      idx >= 0 &&
      idx < this.props.images.length &&
      this.props.images[idx].img !== null
    ) {
      let image = this.props.images[idx];
      this.setState(
        {
          imageIndex: idx,
          fullimg:
            typeof image.img === "string"
              ? image.img.substrCPing(0, 4) !== "http" &&
                image.img.substrCPing(0, 5) !== "https"
                ? assetsURL + image.img
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
      customdesc 
    } = this.state;
    const {
      data,
      handleChange,
      images,
      extraMeasures,
      others,
      handleBulkUpload,
      handleImageChange,
      removeImg,
      extraDescriptions,
      toggleSelectedOthersWebsite,
      toggleSelectedWebsite,
      nanoid
    } = this.props;

    if (customdesc === false) {
      if(data !== null && data !== undefined && data !== "undefined")
      {
        data.shortDescription = "";
          if(data.title !== undefined && data.title !== "" && data.title !== null && data.title !== 'undefined')
          {
            data.shortDescription = data.shortDescription + data.title + "\n" + "\n";
          }

          if(data.brand !== undefined && data.brand !== "" && data.brand !== null && data.brand !== 'undefined')
          {
            data.shortDescription = data.shortDescription + "Brand: " + data.brand + "\n"
          }

          if(data.model !== undefined  && data.model !== "" && data.model !== null && data.model !== 'undefined')
          {
            data.shortDescription = data.shortDescription + "Model: " + data.model + "\n"
          }

          if(data.category !== undefined  && data.category !== "" && data.category !== null && data.category !== 'undefined')
          {
            data.shortDescription = data.shortDescription + "Category: " + data.category + "\n"
          }

          if(extraDescriptions.length <= 0 && data['waist'] > 0)
          {
            data.shortDescription += 'Waist: ' + data['waist'] + "\n";
          }

          if(extraDescriptions.length <= 0 && data['rise'] > 0)
          {
            data.shortDescription += 'Rise: ' + data['rise'] + "\n";
          }

          if(extraDescriptions.length <= 0 && data['inseam'] > 0)
          {
            data.shortDescription += 'Inseam: ' + data['inseam'] + "\n";
          }
        }

      for (let i = 0; i < extraDescriptions.length; i++) 
      {
        if((extraDescriptions[i].value !== "" && extraDescriptions[i].value !== null && extraDescriptions[i].value !== undefined && extraDescriptions[i].value !== "No Suggested Values" && extraDescriptions[i].value !== "undefined") && 
           (extraDescriptions[i].value.localizedValue !== "" && extraDescriptions[i].value.localizedValue !== null && extraDescriptions[i].value.localizedValue !== undefined && extraDescriptions[i].value.localizedValue !== "No Suggested Values" && extraDescriptions[i].value.localizedValue !== "undefined"))
        {
          data.shortDescription += extraDescriptions[i].key + ": " + extraDescriptions[i].value.localizedValue + "\n";
        }
        else if(extraDescriptions[i].value !== "" && extraDescriptions[i].value !== null && extraDescriptions[i].value !== undefined && extraDescriptions[i].value !== "No Suggested Values" && extraDescriptions[i].value !== "undefined")
        {
          data.shortDescription += extraDescriptions[i].key + ": " + extraDescriptions[i].value + "\n";
        }
      }

        for (let i = 0; i < extraMeasures.length; i++) 
        {
          if(extraMeasures[i].value !== "" && extraMeasures[i].value !== null && extraMeasures[i].value !== undefined && extraMeasures[i].value !== "No Suggested Values" && extraMeasures[i].value !== "undefined")
          {
            data.shortDescription += extraMeasures[i].label + ": " + extraMeasures[i].val + "\n";
          }
        }

      if(data.companyBlurb !== undefined && data.companyBlurb !== "")
      {
        data.shortDescription += "\n" + data.companyBlurb + "\n";
      }
    }


    return (
      <>
      <div className='left__app'>
        <div className="mt-3" />
          <div className="row m-auto">
            {images.map((image, idx) => {
              return (
                <div className="col-12 col-lg-4 px-2" key={nanoid(4)}>
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
                      style={{ width: "80vh", height: "80vh" }}
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
                          style={{ height: "80vh", width: "80vh" }}
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
                                ? assetsURL + image.img
                                : URL.createObjectURL(image.img)
                            }
                            style={{ width: "90px", height: "90px" }}
                            alt="+"
                            onClick={() => {
                              this.setState(
                                {
                                  fullimg:
                                    typeof image.img === "string"
                                      ? assetsURL + image.img
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
                            width: "90px",
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
          <button className={`${data["ebay"]["check"] ? "fill__button" : "outline__button"}`}
                  onClick={() => {toggleSelectedWebsite("ebay");}}
                  id="EbayToggleButton"
                  >Ebay</button>
          <button className={`${data["mercari"]["check"] ? "fill__button" : "outline__button"}`}
                  onClick={() => {toggleSelectedWebsite("mercari");}}
                  id="MercariToggleButton"
                  >Mercari</button>
        </div>
        <div className='store__buttons'>
          <button className={`${data["poshmark"]["check"] ? "fill__button" : "outline__button"}`}
                  onClick={() => {toggleSelectedWebsite("poshmark");}}
                  id="PoshmarkToggleButton"
                  >Poshmark</button>
          <button className='outline__button'>Other</button>
        </div>
        {others && others.length !== 0 ?
        (
          others.map((other) => {
                return (
                  <>
                  <div className='store__buttons'>
                  <button 
                    className={`${other.status ? "fill__button" : "outline__button"}`}
                    onClick={() => {toggleSelectedOthersWebsite(other.name)}}
                    id={nanoid(3)}
                  >{other}</button>
                  </div>
                  </>
                  )})
        ) 
        : 
        (
        " "
        )}
        <div className='store__buttons'>
          <button className={`${data["delist"]["check"] ? "fill__button_red" : "outline__button_red"} w-100`}
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
              className={"btn btn-success ml-2  btn-sm"}
              onClick={this.customdescription}
              >
              Custom
            </button>
            :
              <button
                className={"btn btn-warning ml-2 btn-sm"}
                onClick={this.customdescription}
              >
                 Automatically Generate
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
            {this.state.shortDescCharCount}/5000 max characters
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
            value={data.keywords}
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
            value={data.note}
            onChange={handleChange}
          />
        </div>
      </div>
      </>
    );
  };
}

export default LeftSection;
