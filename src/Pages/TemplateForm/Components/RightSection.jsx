import React, { Component } from "react";
import Input from "./Input";
import { Link } from "react-router-dom";
import ButtonGroup from "./ButtonGroup";
import { assetsURL } from "../../../services/Axios";

const max = 5000;

export default class extends Component {
  constructor() {
    super();
    this.state = {
      suggestTitles: false,
      showOtherTitles: false,
      selectedWebsites: [],
      category: "",
      showMoreLines: false,
      value: "",
      count: 0,
      custom: localStorage.getItem("customformtitle") || "false",
      title: "",
      customdesc: localStorage.getItem("customformdesc") || "false",
      desc: "",
    };
  }

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ count: e.target.value.length });
  };

  customtitle = (e) => {
    const { custom } = this.state;
    const { data } = this.props;
    localStorage.setItem("customformtitle", !custom);
    this.setState({ custom: !custom });

    if (data.title) {
      let title = data.title;
      this.setState({ title });
      data.title = title.trim();
    }
  };

  customdescription = (e) => {
    const { customdesc } = this.state;
    const { data } = this.props;
    localStorage.setItem("customformdesc", !customdesc);
    this.setState({ customdesc: !this.state.customdesc });

    if (data.shortDescription) {
      let desc = data.shortDescription;
      this.setState({ desc });
      data.shortDescription = desc.trim();
    }
  };

  setCategory = (str) => {
    const { data } = this.props;
    if (this.state.category === str) {
      data["category"] = "";
      this.setState({ category: "" });
    } else {
      data["category"] = str;
      this.setState({ category: str });
    }
  };

  render = () => {
    const {
      showOtherTitles,
      suggestTitles,
      showMoreLines,
      custom,
      customdesc,
    } = this.state;

    const {
      data,
      handleChange,
      handleOtherTitles,
      extraDescriptions,
      removeDescription,
      addDescription,
      handleDescriptionChange,
      handleDescriptionLabel,
      templatename,
      tempcheck,
      handleUrl
    } = this.props;

    if (custom.toString() == "false") {
      if (localStorage.getItem("titletype") == "type2") {
        data.title =
          (data.brand != undefined
            ? data.brand != ""
              ? data.brand + " "
              : ""
            : "") +
          (data.model != undefined
            ? data.model != ""
              ? data.model + " "
              : ""
            : "") +
          (data.modelNo != undefined
            ? data.modelNo != ""
              ? data.modelNo + " "
              : ""
            : "") +
          (data.category != undefined
            ? data.category != ""
              ? data.category + " "
              : ""
            : "") +
          (data.colorShade != undefined
            ? data.colorShade != ""
              ? data.colorShade + " "
              : ""
            : "") +
          (data.style != undefined
            ? data.style != ""
              ? data.style + " "
              : ""
            : "") +
          (data.pattern != undefined
            ? data.pattern != ""
              ? data.pattern + " "
              : ""
            : "") +
          (data.size != undefined
            ? data.size != ""
              ? data.size + " "
              : ""
            : "");
      } else {
        data.title =
          (data.brand != undefined
            ? data.brand != ""
              ? data.brand + " "
              : ""
            : "") +
          (data.category != undefined
            ? data.category != ""
              ? data.category + " "
              : ""
            : "") +
          (data.model != undefined
            ? data.model != ""
              ? data.model + " "
              : ""
            : "") +
          (data.modelNo != undefined
            ? data.modelNo != ""
              ? data.modelNo + " "
              : ""
            : "") +
          (data.colorShade != undefined
            ? data.colorShade != ""
              ? data.colorShade + " "
              : ""
            : "") +
          (data.style != undefined
            ? data.style != ""
              ? data.style + " "
              : ""
            : "") +
          (data.pattern != undefined
            ? data.pattern != ""
              ? data.pattern + " "
              : ""
            : "") +
          (data.size != undefined
            ? data.size != ""
              ? data.size + " "
              : ""
            : "");
      }
    }

    if (customdesc.toString() == "false") {
      data.shortDescription =
        (data.title != undefined
          ? data.title != ""
            ? data.title + "\n"
            : ""
          : "") +
        (data.brand != undefined
          ? data.brand != ""
            ? "Brand: " + data.brand + "\n"
            : ""
          : "") +
        (data.model != undefined
          ? data.model != ""
            ? "Model: " + data.model + "\n"
            : ""
          : "") +
        (data.modelNo != undefined
          ? data.modelNo != ""
            ? "Model No.: " + data.modelNo + "\n"
            : ""
          : "") +
        (data.category != undefined
          ? data.category != ""
            ? "Category: " + data.category + "\n"
            : ""
          : "") +
        (data.colorShade != undefined
          ? data.colorShade != ""
            ? "Color: " + data.colorShade + "\n"
            : ""
          : "") +
        (data.material != undefined
          ? data.material != ""
            ? "Material: " + data.material + "\n"
            : ""
          : "") +
        (data.style != undefined
          ? data.style != ""
            ? "Style: " + data.style + "\n"
            : ""
          : "") +
        (data.pattern != undefined
          ? data.pattern != ""
            ? "Pattern: " + data.pattern + "\n"
            : ""
          : "") +
        (data.size != undefined
          ? data.size != ""
            ? "Size: " + data.size + "\n"
            : ""
          : "") +
        (data.seasonOrWeather != undefined
          ? data.seasonOrWeather != ""
            ? "Season/Weather: " + data.seasonOrWeather + "\n"
            : ""
          : "") +
        (data.care != undefined
          ? data.care != ""
            ? "Care: " + data.care + "\n"
            : ""
          : "") +
        (data.madeIn != undefined
          ? data.madeIn != ""
            ? "Made in: " + data.madeIn + "\n"
            : ""
          : "") +
        (data.line1 != undefined
          ? data.line1 != ""
            ? data.line1 + "\n"
            : ""
          : "") +
        (data.line2 != undefined
          ? data.line2 != ""
            ? data.line2 + "\n"
            : ""
          : "") +
        (data.line3 != undefined
          ? data.line3 != ""
            ? data.line3 + "\n"
            : ""
          : "") +
        (data.line4 != undefined
          ? data.line4 != ""
            ? data.line4 + "\n"
            : ""
          : "") +
        (data.line5 != undefined
          ? data.line5 != ""
            ? data.line5 + "\n"
            : ""
          : "") +
        (data.line6 != undefined
          ? data.line6 != ""
            ? data.line6 + "\n"
            : ""
          : "") +
        (data.line7 != undefined
          ? data.line7 != ""
            ? data.line7 + "\n"
            : ""
          : "") +
        (data.line8 != undefined
          ? data.line8 != ""
            ? data.line8 + "\n"
            : ""
          : "");
          for(let i = 0 ; i < extraDescriptions.length ; i++){
            data.shortDescription += extraDescriptions[i].key + ": " + extraDescriptions[i].value + "\n"
            
          } 
    }
    if (data.title) {
      //advance listing & data.title is not undefined
      let title = data.title.trim();
      data.ebay.title =
        (data.brand != undefined
          ? data.brand != ""
            ? data.brand + " "
            : ""
          : "") +
        (data.category != undefined
          ? data.category != ""
            ? data.category + " "
            : ""
          : "") +
        (data.model != undefined
          ? data.model != ""
            ? data.model + " "
            : ""
          : "") +
        (data.modelNo != undefined
          ? data.modelNo != ""
            ? data.modelNo + " "
            : ""
          : "") +
        (data.colorShade != undefined
          ? data.colorShade != ""
            ? data.colorShade + " "
            : ""
          : "") +
        (data.style != undefined
          ? data.style != ""
            ? data.style + " "
            : ""
          : "") +
        (data.pattern != undefined
          ? data.pattern != ""
            ? data.pattern + " "
            : ""
          : "") +
        (data.size != undefined
          ? data.size != ""
            ? data.size + " "
            : ""
          : "");

      data.poshmark.title =
        (data.brand != undefined
          ? data.brand != ""
            ? data.brand + " "
            : ""
          : "") +
        (data.category != undefined
          ? data.category != ""
            ? data.category + " "
            : ""
          : "") +
        (data.model != undefined
          ? data.model != ""
            ? data.model + " "
            : ""
          : "") +
        (data.colorShade != undefined
          ? data.colorShade != ""
            ? data.colorShade + " "
            : ""
          : "") +
        (data.size != undefined
          ? data.size != ""
            ? data.size + " "
            : ""
          : "");
      data.mercari.title =
        (data.brand != undefined
          ? data.brand != ""
            ? data.brand + " "
            : ""
          : "") +
        (data.category != undefined
          ? data.category != ""
            ? data.category + " "
            : ""
          : "") +
        (data.model != undefined
          ? data.model != ""
            ? data.model + " "
            : ""
          : "") +
        (data.colorShade != undefined
          ? data.colorShade != ""
            ? data.colorShade + " "
            : ""
          : "") +
        (data.size != undefined
          ? data.size != ""
            ? data.size + " "
            : ""
          : "");
    }

    return (
      <div>
        {/* Product Titles */}
        <div className="d-flex align-items-center mb-1">
          <div className="h6 fw-500 text-uppercase mt-3">
            <text className="text-danger">*</text>Product Title{" "}
          </div>
          <i className="fas fa-question-circle c-pointer text-secondary ml-2 mt-2"></i>
          {custom.toString() == "true" ? (
            <button
              className={"btn btn-success ml-2 btn-sm"}
              onClick={(e) => this.customtitle(e)}
            >
              Custom Title
            </button>
          ) : (
            <button
              className={"btn btn-warning ml-2 btn-sm"}
              onClick={(e) => this.customtitle(e)}
            >
              Automated Title
            </button>
          )}
        </div>
        <div className="form-group row">
          <div className="col-12 col-lg-8">
            <input
              id="tite"
              className="form-control form-control-sm"
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              maxLength="140"
            />
            <small
              className="form-text text-muted"
              style={{ fontSize: "0.5em" }}
            >
              {data.title
                ? custom
                  ? data.title.length
                  : data.title.length
                : null}
              /140 max characters
            </small>
          </div>
          <label
            className="col-sm-4 text-lg-right col-form-label col-form-label-sm"
            onClick={() => {
              this.setState({ showOtherTitles: !showOtherTitles });
              if (data.title) {
                //advance listing & data.title is not undefined
                let title = data.title.trim();
                data.ebay.title =
                  (data.brand != undefined
                    ? data.brand != ""
                      ? data.brand + " "
                      : ""
                    : "") +
                  (data.category != undefined
                    ? data.category != ""
                      ? data.category + " "
                      : ""
                    : "") +
                  (data.model != undefined
                    ? data.model != ""
                      ? data.model + " "
                      : ""
                    : "") +
                  (data.modelNo != undefined
                    ? data.modelNo != ""
                      ? data.modelNo + " "
                      : ""
                    : "") +
                  (data.colorShade != undefined
                    ? data.colorShade != ""
                      ? data.colorShade + " "
                      : ""
                    : "") +
                  (data.style != undefined
                    ? data.style != ""
                      ? data.style + " "
                      : ""
                    : "") +
                  (data.pattern != undefined
                    ? data.pattern != ""
                      ? data.pattern + " "
                      : ""
                    : "") +
                  (data.size != undefined
                    ? data.size != ""
                      ? data.size + " "
                      : ""
                    : "");

                data.poshmark.title =
                  (data.brand != undefined
                    ? data.brand != ""
                      ? data.brand + " "
                      : ""
                    : "") +
                  (data.category != undefined
                    ? data.category != ""
                      ? data.category + " "
                      : ""
                    : "") +
                  (data.model != undefined
                    ? data.model != ""
                      ? data.model + " "
                      : ""
                    : "") +
                  (data.colorShade != undefined
                    ? data.colorShade != ""
                      ? data.colorShade + " "
                      : ""
                    : "") +
                  (data.size != undefined
                    ? data.size != ""
                      ? data.size + " "
                      : ""
                    : "");
                data.mercari.title =
                  (data.brand != undefined
                    ? data.brand != ""
                      ? data.brand + " "
                      : ""
                    : "") +
                  (data.category != undefined
                    ? data.category != ""
                      ? data.category + " "
                      : ""
                    : "") +
                  (data.model != undefined
                    ? data.model != ""
                      ? data.model + " "
                      : ""
                    : "") +
                  (data.colorShade != undefined
                    ? data.colorShade != ""
                      ? data.colorShade + " "
                      : ""
                    : "") +
                  (data.size != undefined
                    ? data.size != ""
                      ? data.size + " "
                      : ""
                    : "");
              }
            }}
            style={{ color: "#4a86e8" }}
          >
            <Link to="#">{showOtherTitles ? "Hide" : "Show"} All Titles</Link>
          </label>
        </div>
        {showOtherTitles && (
          <div>
            <div className="form-group row">
              <div className="col-12 col-lg-8">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  name="ebay"
                  id="ebay"
                  value={
                    data["ebay"]["title"] != undefined
                      ? data["ebay"]["title"]
                      : ""
                  }
                  onChange={handleOtherTitles}
                  maxLength="140"
                />
                <small
                  className="form-text text-muted"
                  style={{ fontSize: "0.5em" }}
                >
                  {data.ebay.title ? data.ebay.title.length : null}/140 max
                  characters
                </small>
              </div>
              <label
                htmlFor="colFormLabelSm"
                className="col-sm-4 text-lg-right col-form-label col-form-label-sm"
              >
                EBAY
              </label>
            </div>
            <div className="form-group row">
              <div className="col-12 col-lg-8">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  name="poshmark"
                  id="poshmark"
                  value={
                    data["poshmark"]["title"] != undefined
                      ? data["poshmark"]["title"]
                      : ""
                  }
                  onChange={handleOtherTitles}
                  maxLength="140"
                />
                <small
                  className="form-text text-muted"
                  style={{ fontSize: "0.5em" }}
                >
                  {data.poshmark.title ? data.poshmark.title.length : null}/140
                  max characters
                </small>
              </div>
              <label
                htmlFor="colFormLabelSm"
                className="col-sm-4 text-lg-right col-form-label col-form-label-sm"
              >
                POSHMARK
              </label>
            </div>
            <div className="form-group row">
              <div className="col-12 col-lg-8">
                <input
                  className="form-control form-control-sm"
                  type="text"
                  name="mercari"
                  id="mercari"
                  value={
                    data["mercari"]["title"] != undefined
                      ? data["mercari"]["title"]
                      : ""
                  }
                  onChange={handleOtherTitles}
                  maxLength="140"
                />
                <small
                  className="form-text text-muted"
                  style={{ fontSize: "0.5em" }}
                >
                  {data.mercari.title ? data.mercari.title.length : null}/140
                  max characters
                </small>
              </div>
              <label
                htmlFor="colFormLabelSm"
                className="col-sm-4 text-lg-right col-form-label col-form-label-sm"
              >
                MERCARI
              </label>
            </div>
          </div>
        )}

        {/* Feilds */}
        <div className="py-3">
          <Input
            label="BRAND OR MARKER"
            name="brand"
            id="brand"
            value={data.brand}
            onChange={handleChange}
          />
          <Input
            label="MODEL"
            name="model"
            id="model"
            defaultValue={data.model}
            onChange={handleChange}
          />
          <Input
            label="MODEL NO."
            name="modelNo"
            id="modelNo"
            defaultValue={data.modelNo}
            onChange={handleChange}
          />
          <Input
            label="COLOR SHADE"
            name="colorShade"
            id="colorShade"
            value={data.colorShade}
            onChange={handleChange}
          />

          <Input
            label="STYLE OR FEATURE ?"
            name="style"
            id="style"
            value={data.style}
            onChange={handleChange}
          />
          <Input
            label="PATTERN OR TEXTURE ?"
            name="pattern"
            id="pattern"
            value={data.pattern}
            onChange={handleChange}
          />
          <Input
            label="SIZE OR FIT"
            name="size"
            id="size"
            value={data.size}
            onChange={handleChange}
          />
          <Input
            label="MATERIAL OR INGREDIENT"
            name="material"
            id="material"
            value={data.material}
            onChange={handleChange}
          />

          <Input
            label="SEASON OR WEATHER ?"
            name="seasonOrWeather"
            id="seasonOrWeather"
            value={data.seasonOrWeather}
            onChange={handleChange}
          />
          <Input
            label="CARE ?"
            name="care"
            id="care"
            value={data.care}
            onChange={handleChange}
          />
          <Input
            label="MADE IN ?"
            name="madeIn"
            id="madeIn"
            value={data.madeIn}
            onChange={handleChange}
          />

          {/* <select
            className="form-control body-text col-8"
            name="gender"
            id="gender"
            value={data.gender}
            onChange={handleChange}
          >
            <option>Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select> */}
        </div>

        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            <text className="text-danger">*</text>Description
          </label>
          {/* shortDescription btn */}

          {customdesc.toString() == "true" ? (
            <button
              className={"btn btn-success ml-2 btn-sm"}
              onClick={this.customdescription}
            >
              Custom Description
            </button>
          ) : (
            <button
              className={"btn btn-warning ml-2 btn-sm"}
              onClick={this.customdescription}
            >
              Automated Description
            </button>
          )}
          <textarea
            className="form-control col-12 col-lg-12"
            id="shortDescription"
            // id="exampleFormControlTextarea1"
            rows="7"
            name="shortDescription"
            //defaultValue={data.shortDescription}
            value={data.shortDescription}
            onKeyUp={this.handleChanges}
            onChange={handleChange}
          ></textarea>
          <small className="form-text text-muted" style={{ fontSize: "0.5em" }}>
            {this.state.count}/5000 max characters
          </small>
        </div>
        <div className= "template__form">
        <div className="h6 pt-3 fw-500 text-uppercase mt-3">
          <button
            className="btn no-border"
            style={{ color: "#186194" }}                   
            onClick={addDescription}
          >
            <u>Enter More or Different Description ?</u>
            <div className="fa fa-plus-square ml-3"></div>
          </button>
        </div>
        {extraDescriptions &&
            extraDescriptions.map((description) => {
              return (
                <div className="form-group my-2 my-4 d-flex align-items-center">
                  <input
                    className="form-control form-control-sm col-4 mr-3"
                    type="text"
                    name="label"
                    id={description.key}
                    defaultValue={description.key}
                    onChange={(e) => handleDescriptionLabel(description.id, e)}
                    placeholder="key"
                  />
                  :-
                  <input
                    className="form-control form-control-sm col-6 ml-3"
                    type="text"
                    name="value"
                    defaultValue={description.value}
                    placeholder="Value"
                    onChange={(e) => handleDescriptionChange(description.id, e)}
                  />
                  <button
                    className="btn"
                    onClick={(e) => removeDescription(description.id, e)}
                  >
                    <div className="fa fa-minus-square ml-3"></div>
                  </button>
                </div>
              );
            })}
        

        </div>
        
          
         
          {/* <div>
            <div
              className="btn btn-link mb-3 pl-0"
              onClick={() => this.setState({ showMoreLines: !showMoreLines })}
            >
              {showMoreLines ? "Hide" : "Show more"}
            </div>
          </div> */}
          <hr />

          <div className="form-group mb-4 row align-items-center">
            <div className="col-12 col-lg-8">
              <select
                className="custom-select border border-dark  custom-select-sm"
                name="condition_name"
                id="condition_name"
                value={data.condition_name}
                onChange={handleChange}
              >
                <option>Select Condition *</option>
                <option defaultValue="New with tags">New with tags</option>
                <option defaultValue="New without tags">
                  New without tags
                </option>
                <option defaultValue="Used">Used</option>
              </select>
            </div>
            <label
              htmlFor="colFormLabelSm"
              className="col-sm-4 col-form-label text-lg-right col-form-label-sm"
            >
              <text className="text-danger">*</text>Condition
            </label>
          </div>

          {/*bottom of description*/}
          <div className="form-group">
            <label className="h6 py-2 fw-500 text-uppercase">
              Bottom of Description
            </label>
            <textarea
              className="form-control col-12 col-lg-12"
              id="bottomDescription"
              // id="exampleFormControlTextarea1"
              rows="3"
              name="bottomDescription"
              value={data.bottomDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          <input
          className="form-control form-control-sm"
          type="text"
          name="ebay"
          placeholder="Ebay url"
          value={data["ebay"]["url"]}
          onChange={handleUrl}
        />
        <input
          className="form-control form-control-sm"
          type="text"
          name="poshmark"
          placeholder="Poshmark url"
          value={data["poshmark"]["url"]}
          onChange={handleUrl}
        />
        <input
          className="form-control form-control-sm"
          type="text"
          name="mercari"
          placeholder="Mercari url"
          value={data["mercari"]["url"]}
          onChange={handleUrl}
        />

              <div className="form-group">
            <label className="h6 py-2 fw-500 text-uppercase">
              notes
            </label>
            <textarea
              className="form-control col-12 col-lg-12"
              id="notes"
              rows="3"
              name="notes"
              defaultValue={data.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        
      </div>
    );
  };
}
