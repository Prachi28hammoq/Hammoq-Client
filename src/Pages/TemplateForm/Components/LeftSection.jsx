import React, { Component } from "react";
import ButtonGroup from "./ButtonGroup";
import { assetsURL } from "../../../services/Axios";
import LoadingSpinner from "../../utils/loader";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"

const max = 5000;
const $ = window.$;

class LeftSection extends Component {
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
      img: [],
      showcat: false,
      modalImage : "",
      imageIndex : 0
    };
  }

  // componentDidMount() {
  //   var uploader = new SocketIOFileUpload(socket);
  //   uploader.listenOnInput(document.getElementById("bulk"));
  //   uploader.addEventListener("start", function (event) {
  //     event.file.meta.cid = localStorage.getItem("cid");
  //   });
  //   socket.on("server2clientimg", (i) => {
  //     //console.log(i);
  //     this.props.setImage(i);
  //   });
  // }

  fetchimg = (src) => {
    this.setState({ fullimg: src }, () => {
      $("#addTemplateModal1").modal("show");
    });
    // socket.emit("getimg", { cid: this.props.cid });
    // socket.on("reimg", (re) => {
    //   //this.setState({ img: "" });
    //   if (re.id == this.props.cid) {
    //     console.log(re.id);
    //     console.log("this");
    //     this.setState({ img: re.img }, () => {
    //       this.state.img.forEach((i) => {
    //         if (i.key == this.state.fullimg) {
    //           // this.setState({ fullimg: src }, () => {
    //           //   $("#addTemplateModal1").modal("show");
    //           // });
    //         }
    //       });
    //     });
    //     console.log(this.state.img);
    //   }
    // });
  };

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ count: e.target.value.length });
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
  handleImageModal = (idx) => {
    console.log(idx ,'idx')
    console.log(this.props.images ,'concoel')
    if(idx >=  0  && idx < this.props.images.length && this.props.images[idx].img != null ){
      let image = this.props.images[idx]
      console.log(image, 'index check')
      this.setState(
        {
          imageIndex : idx,
          fullimg:
            typeof image.img === "string"
              ? image.img.substring(0, 4) !== "http" &&
                image.img.substring(0, 5) !== "https"
                ? assetsURL + image.img
                : image.img
              :image.img !== null ? URL.createObjectURL(image.img) : '',
        },
        () => {
          $("#addTemplateModal1").modal("show");
        }
      );
    }
  }

  render = () => {
    const { 
      //suggestTitles, 
      //showOtherTitles, 
      //fullimg, 
      img 
    } = this.state;

    const { 
      selectedWebsites, 
      //category, 
      //showMoreLines, 
      showcat 
    } = this.state;

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
      //handleOtherTitles,
      toggleSelectedOthersWebsite,
      exthandle,
    } = this.props;

    const { toggleSelectedWebsite } = this.props;

    return (
      <>
        <div className="mt-3" />
        

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
          <div className="d-lg-flex justify-content-around my-3">
            <div className="col-12 col-lg-2 mr-lg-1 "></div>
            {othersbool
              ? others.map((o, i) => {
                  return (
                    <div className="col-12 col-lg-3 ml-lg-1">
                      <button
                        className={` btn  btn-${
                          othersstate[i] === true
                            ? "primary"
                            : "outline-primary"
                        }`}
                        onClick={() => {
                          toggleSelectedOthersWebsite(i);
                        }}
                      >
                        {o}
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
            style={{ color: "#4a86e8" }}
            category="Men"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            style={{ color: "#4a86e8" }}
            category="Women"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            style={{ color: "#4a86e8" }}
            category="Unisex Kids"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            style={{ color: "#4a86e8" }}
            category="Babies"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />
          <ButtonGroup
            style={{ color: "#4a86e8" }}
            category="Specialty"
            selectedCategory={data.category}
            setCategory={this.setCategory}
          />

          {showcat && (
            <input
              className="form-control form-control-sm col-4 mt-2 border-primary"
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

        <div className="h6 pt-3 fw-500 text-uppercase mt-3">
          <button
            className="btn no-border"
            style={{ color: "#186194" }}
            onClick={() => this.setState({ showcat: !showcat })}
          >
            <u>Enter Custom Category ?</u>
            <div className="fa fa-plus-square ml-3"></div>
          </button>
        </div>

        {/* Measurements */}
        <div className="measurements pt-3">
          <span className="h4 p-2 pr-3">Measurements :-</span>
          <div className="form-group my-2 my-4 d-flex align-items-center">
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

        {/*keywords & notes(not displayed in listing)*/}
        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            Keywords or tags
          </label>
          <textarea
            className="form-control col-12 col-lg-12"
            id="keywords"
            // id="exampleFormControlTextarea1"
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
            className="form-control col-12 col-lg-12"
            id="note"
            // id="exampleFormControlTextarea1"
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
export default LeftSection;