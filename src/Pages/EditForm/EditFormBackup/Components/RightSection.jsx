import React, { Component } from "react";
import Input from "./Input";
import { Link } from "react-router-dom";
//import { assetsURL } from "../../../services/Axios";
//import ButtonGroup from "./ButtonGroup";
import Popover from '@material-ui/core/Popover';
import Axios from '../../../services/Axios'
//import ScrollArea  from 'react-scrollbar';


const max = 5000;

class RightSection extends Component {
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
      custom: localStorage.getItem("customformtitleedit") || "false",
      title: "",
      customdesc: localStorage.getItem("customformdescedit") || "false",
      desc: "",
      anchorEl: null,
      msgFormTitle : "",
      msgFormDescription : "",
      field  : '',
      productMessage : []
    };
  }

 

  handleChanges = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ count: e.target.value.length });
  };

  handleMessage = (e) => {
    this.setState({[e.target.name] : e.target.value})
  }

  handleMessageSubmit = async () => {
    //const formData = {
    //  msgformTitle : this.state.msgFormTitle,
    //  senderName :  `customer : ${localStorage.getItem("customerName")}`,
    //  msgFormDescription : this.state.msgFormDescription,
    //  field : this.state.field
    //}
   // window.alert(formData.clientName ,' form data data dhfjkasdhfjkha')
    try{
      //const response = await Axios.post(`/message/${this.props.productid}`, formData, {
      //  headers: {
      //    "Content-Type": "application/json",
      //    "x-access-token": `${localStorage.getItem("token")}`,
      //  },
      //})
      //console.log(response, 'customer jshdfjkhakl')
      this.setState({anchorEl: null})
    }catch(error){
      console.log(error)
    }
  }

  customtitle = (e) => {
    const { custom } = this.state;
    const { data } = this.props;
    localStorage.setItem("customformtitleedit", !custom);
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
    localStorage.setItem("customformdescedit", !customdesc);
    this.setState({ customdesc: !customdesc });

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

  handleClick = (event) => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl : null })
  };
  
  handleMessageData = async (value, event) => {
    //console.log(value,"value")
    const productId = this.props.productid
    const msgFormToggle = this.state.msgFormToggle
    const anchorEl= event.currentTarget
    try {
      const response = await Axios.get(`/message/${productId}/${value}`, {
        headers : {
          "content-type": "application/json",
          "x-access-token": localStorage.getItem("token")
        
        }
      })
      this.setState({productMessage : response.data.message, msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${this.props.data[value]}`,  field : value ,anchorEl   })
    }catch(error){
      console.log(error)
    }

  }
  render = () => {
    const { 
      //selectedWebsites, 
      //category, 
      showMoreLines, 
      custom, 
      msgFormToggle, 
      anchorEl 
    } = this.state;

    const { 
      data, 
      handleChange, 
      //toggleSelectedWebsite 
    } = this.props;

    const { 
      //suggestTitles, 
      showOtherTitles, 
      customdesc, 
      productMessage 
    } = this.state;

    const open = Boolean(anchorEl);

    const id = open ? 'simple-popover' : undefined;

    const {
      //images,
      //handleBulkUpload,
      //handleImageChange,
      //removeImg,
      //extraMeasures,
      //addMeasure,
      //handleMeasureChange,
      //handleMeasureLabel,
      extraDescriptions,
      handleOtherTitles,
      addDescription,
      handleDescriptionChange,
      handleDescriptionLabel,
      removeDescription,
      handleUrl,
      messageNotSeen
    } = this.props;
   // console.log(messageNotSeen , 'message not seeen')

    if (custom.toString() === "false") {
      if (localStorage.getItem("titletype") === "type2") {
        data.title =
          (data.brand !== undefined
            ? data.brand !== ""
              ? data.brand + " "
              : ""
            : "") +
          (data.model !== undefined
            ? data.model !== ""
              ? data.model + " "
              : ""
            : "") +
          (data.modelNo !== undefined
            ? data.modelNo !== ""
              ? data.modelNo + " "
              : ""
            : "") +
          (data.category !== undefined
            ? data.category !== ""
              ? data.category + " "
              : ""
            : "") +
          (data.colorShade !== undefined
            ? data.colorShade !== ""
              ? data.colorShade + " "
              : ""
            : "") +
          (data.style !== undefined
            ? data.style !== ""
              ? data.style + " "
              : ""
            : "") +
          (data.pattern !== undefined
            ? data.pattern !== ""
              ? data.pattern + " "
              : ""
            : "") +
          (data.size !== undefined
            ? data.size !== ""
              ? data.size + " "
              : ""
            : "") 
      } else {
        data.title =
          (data.brand !== undefined
            ? data.brand !== ""
              ? data.brand + " "
              : ""
            : "") +
          (data.category !== undefined
            ? data.category !== ""
              ? data.category + " "
              : ""
            : "") +
          (data.model !== undefined
            ? data.model !== ""
              ? data.model + " "
              : ""
            : "") +
          (data.modelNo !== undefined
            ? data.modelNo !== ""
              ? data.modelNo + " "
              : ""
            : "") +
          (data.colorShade !== undefined
            ? data.colorShade !== ""
              ? data.colorShade + " "
              : ""
            : "") +
          (data.style !== undefined
            ? data.style !== ""
              ? data.style + " "
              : ""
            : "") +
          (data.pattern !== undefined
            ? data.pattern !== ""
              ? data.pattern + " "
              : ""
            : "") +
          (data.size !== undefined
            ? data.size !== ""
              ? data.size + " "
              : "" 
            : "") + 
          (data.seasonOrWeather !== undefined
            ? data.seasonOrWeather !== ""
            ? " " + data.seasonOrWeather + "\n"
            : ""
            : "") +
            (data.care !== undefined 
              ? data.care !== ""
              ? " " + data.care + "\n"
              :""
              :"") +
              (data.madeIn !== undefined
                ? data.madeIn !== ""
                ? " " + data.madeIn + "\n"
                :""
                :"")  
      }
     // console.log(data.title);
    }

    if (customdesc === false) {
      data.shortDescription =
        (data.title !== "" ? data.title + "\n" : "") +
        (data.brand !== "" ? "Brand: " + data.brand + "\n" : "") +
        (data.model !== "" ? "Model: " + data.model + "\n" : "") +
        (data.modelNo !== "" ? "Model No.: " + data.modelNo + "\n" : "") +
        (data.category !== "" ? "Gender: " + data.category + "\n" : "") +
        (data.colorShade !== "" ? "Color: " + data.colorShade + "\n" : "") +
        (data.material !== "" ? "Material: " + data.material + "\n" : "") +
        (data.style !== "" ? "Style: " + data.style + "\n" : "") +
        (data.pattern !== "" ? "Pattern: " + data.pattern + "\n" : "") +
        (data.size !== "" ? "Size: " + data.size + "\n" : "") +
        (data.seasonOrWeather !== ""
          ? "seasonOrWeather: " + data.seasonOrWeather + "\n"
          : "") +
        (data.care !== "" ? "Care: " + data.care + "\n" : "") +
        (data.madeIn !== "" ? "Made in: " + data.madeIn + "\n" : "") +
        
        (data.bottomDescription !== "" ? "Bottom Description: " + data.bottomDescription + "\n" : "" ) +
        (data.line1 !== undefined? data.line1 !== "" ? data.line1 +": " + data.value1 +"\n" : "" : "") +
        (data.line2 !== undefined ? data.line2 !== ""? data.line2 +": " + data.value2 +"\n": "": "") +
        (data.line3 !== undefined ? data.line3 !== ""? data.line3 +": " + data.value3 +"\n" : "" : "") +
        (data.line4 !== undefined ? data.line4 !== "" ?data.line4 +": " + data.value4 +"\n" : "" : "") +
        (data.line5 !== undefined ? data.line5 !== "" ? data.line5 +": " + data.value5 +"\n" : "" : "") +
        (data.line6 !== undefined ? data.line6 !== "" ? data.line6 +": " + data.value6 +"\n" : "": "") +
        (data.line7 !== undefined ? data.line7 !== "" ? data.line7 +": " + data.value7 +"\n" : "" : "") +
        (data.line8 !== undefined ? data.line8 !== "" ? data.line8 +": " + data.value8 +"\n" : "" : "");
        for(let i = 0 ; i < extraDescriptions.length ; i++){
          data.shortDescription += extraDescriptions[i].key + ": " + extraDescriptions[i].value + "\n"
          
        }
    }
    if (data.title) {
      //advance listing & data.title is not undefined
      //let title = data.title.trim();
      data.ebay.title =
        (data.brand !== undefined
          ? data.brand !== ""
            ? data.brand + " "
            : ""
          : "") +
        (data.category !== undefined
          ? data.category !== ""
            ? data.category + " "
            : ""
          : "") +
        (data.model !== undefined
          ? data.model !== ""
            ? data.model + " "
            : ""
          : "") +
        (data.modelNo !== undefined
          ? data.modelNo !== ""
            ? data.modelNo + " "
            : ""
          : "") +
        (data.colorShade !== undefined
          ? data.colorShade !== ""
            ? data.colorShade + " "
            : ""
          : "") +
        (data.style !== undefined
          ? data.style !== ""
            ? data.style + " "
            : ""
          : "") +
        (data.pattern !== undefined
          ? data.pattern !== ""
            ? data.pattern + " "
            : ""
          : "") +
        (data.size !== undefined
          ? data.size !== ""
            ? data.size + " "
            : ""
          : "");

      data.poshmark.title =
        (data.brand !== undefined
          ? data.brand !== ""
            ? data.brand + " "
            : ""
          : "") +
        (data.category !== undefined
          ? data.category !== ""
            ? data.category + " "
            : ""
          : "") +
        (data.model !== undefined
          ? data.model !== ""
            ? data.model + " "
            : ""
          : "") +
        (data.colorShade !== undefined
          ? data.colorShade !== ""
            ? data.colorShade + " "
            : ""
          : "") +
        (data.size !== undefined
          ? data.size !== ""
            ? data.size + " "
            : ""
          : "");
      data.mercari.title =
        (data.brand !== undefined
          ? data.brand !== ""
            ? data.brand + " "
            : ""
          : "") +
        (data.category !== undefined
          ? data.category !== ""
            ? data.category + " "
            : ""
          : "") +
        (data.model !== undefined
          ? data.model !== ""
            ? data.model + " "
            : ""
          : "") +
        (data.colorShade !== undefined
          ? data.colorShade !== ""
            ? data.colorShade + " "
            : ""
          : "") +
        (data.size !== undefined
          ? data.size !== ""
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
          {custom.toString() === "true" ? (
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
              className="form-control form-control-sm"
              type="text"
              name="title"
              id="tite"
              value={data.title}
              onChange={handleChange}
              maxLength="140"
            />
            <small
              className="form-text text-muted"
              style={{ fontSize: "0.5em" }}
            >
              {data.title ? data.title.length : null}
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
                data.ebay.title = title;

                data.poshmark.title =
                  (data.brand !== undefined
                    ? data.brand !== ""
                      ? data.brand + " "
                      : ""
                    : "") +
                  (data.category !== undefined
                    ? data.category !== ""
                      ? data.category + " "
                      : ""
                    : "") +
                  (data.model !== undefined
                    ? data.model !== ""
                      ? data.model + " "
                      : ""
                    : "") +
                  (data.colorShade !== undefined
                    ? data.colorShade !== ""
                      ? data.colorShade + " "
                      : ""
                    : "") +
                  (data.size !== undefined
                    ? data.size !== ""
                      ? data.size + " "
                      : ""
                    : "");
                data.mercari.title =
                  (data.brand !== undefined
                    ? data.brand !== ""
                      ? data.brand + " "
                      : ""
                    : "") +
                  (data.category !== undefined
                    ? data.category !== ""
                      ? data.category + " "
                      : ""
                    : "") +
                  (data.model !== undefined
                    ? data.model !== ""
                      ? data.model + " "
                      : ""
                    : "") +
                  (data.colorShade !== undefined
                    ? data.colorShade !== ""
                      ? data.colorShade + " "
                      : ""
                    : "") +
                  (data.size !== undefined
                    ? data.size !== ""
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
                    data["ebay"]["title"].toString() !== "undefined"
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
                    data["poshmark"]["title"].toString() !== "undefined"
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
                    data["mercari"]["title"].toString() !== "undefined"
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
        <div className="row">
        <div className="py-3 col-11">
          <div className="row">
            <div className="col-11">
              <Input
                label="BRAND OR MARKER"
                name="brand"
                id="brand"
                defaultValue={data.brand}
                onChange={handleChange}
                field = "brand"
          />
            </div>
          
            <div className="col-1">
                <button
                 // onClick={(event) => this.setState({msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.brand}`, anchorEl : event.currentTarget, field : "brand" })}
                  onClick = {(event) => this.handleMessageData('brand', event)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color:messageNotSeen.includes('brand')?'red':''

                  }}
                >
                  +
                </button>
              </div>
          </div>
         
          <div className="row">
              <div className="col-11">
              <Input
                label="Model"
                name="model"
                id="model"
                defaultValue={data.model}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
               // onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.model}`, anchorEl : event.currentTarget,  field : "model" })}
                onClick = {(event) => this.handleMessageData('model', event)}

                style={{
                   background: "none", 
                   border: "none",
                   outline: "none",
                   color:messageNotSeen.includes('model')?'red':''
                  }}
              >
                +
              </button>
              </div>
              
             
            </div>
            <div className="row">
              <div className="col-11">
              <Input
                label="Model No."
                name="modelNo"
                id="modelNo"
                defaultValue={data.modelNo}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
               //onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.modelno}`, anchorEl : event.currentTarget,  field : "modelno" })}
                onClick = {(event) => this.handleMessageData('modelNo', event)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  outline: "none" ,
                  color:messageNotSeen.includes('modelNo')?'red':''
                }}
              >
                +
              </button>
              </div>
            </div>

            <div className="row" >
              <div className="col-11">
              <Input
                label="COLOR SHADE"
                name="colorShade"
                id="colorShade"
                defaultValue={data.colorShade}
                onChange={handleChange}
                // coloracc={coloracc}
              />
              </div>
              <div className="col-1">
              <button
               // onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.colorShade}`, anchorEl : event.currentTarget,  field : "colorShade" })}
               onClick = {(event) => this.handleMessageData('colorShade', event)} 
               style={{ background: "none", 
               border: "none", 
               outline: "none" ,
               color:messageNotSeen.includes('colorShade')?'red':''

              }}
              >
                +
              </button>
              </div> 
            </div>


            <div className="row">
              <div className="col-11">
              <Input
                label="STYLE OR FEATURE ?"
                name="style"
                id="style"
                defaultValue={data.style}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
                //onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.style}`, anchorEl : event.currentTarget, field : "style"  })}
                onClick = {(event) => this.handleMessageData('style', event)} 
                style={{ background: "none", 
                border: "none", 
                outline: "none" ,
                color:messageNotSeen.includes('colorShade')?'red':''
              }}
              >
                +
              </button>
              </div>  
            </div>
          
            {/* <div className="row">
              <div className="col-11">
              <Input
                label="STYLE OR FEATURE ?"
                name="style"
                id="style"
                defaultValue={data.style}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
                onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.style}`, anchorEl : event.currentTarget })}
                style={{ background: "none", border: "none", outline: "none" }}
              >
                +
              </button>
              </div> 
            </div> */}
          
          
            <div className="row">
              <div className="col-11">
              <Input
                label="PATTERN OR TEXTURE ?"
                name="pattern"
                id="pattern"
                defaultValue={data.pattern}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
                //onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.pattern}`, anchorEl : event.currentTarget, field : "pattern" })}
                onClick = {(event) => this.handleMessageData('pattern', event)} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  outline: "none", 
                  color:messageNotSeen.includes('pattern')?'red':''

                }}
              >
                +
              </button>
              </div>                       
            </div>
           
            <div className="row">
              <div className="col-11">
              <Input
                label="SIZE OR FIT"
                name="size"
                id="size"
                defaultValue={data.size}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
              //  onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.size}`, anchorEl : event.currentTarget, field : "size" })}
                onClick = {(event) => this.handleMessageData('size', event)} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  outline: "none" ,
                  color:messageNotSeen.includes('size')?'red':''

                }}
              >
                +
              </button>
              </div>  
            </div>

            <div className="row">
              <div className="col-11">
              <Input
                label="SEASON OR WEATHER ?"
                name="seasonOrWeather"
                id="seasonOrWeather"
                defaultValue={data.seasonOrWeather}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
               // onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.seasonOrWeather}` , anchorEl : event.currentTarget, field : "seasonOrWeather"})}
                onClick = {(event) => this.handleMessageData('seasonOrWeather', event)} 
                style={{ 
                  background: "none", 
                   border: "none", 
                   outline: "none",
                   color:messageNotSeen.includes('seasonOrWeather')?'red':''

                  }}
              >
                +
              </button>
              </div>                        
            </div>
         
            <div className="row">
              <div className="col-11">
              <Input
                label="CARE ?"
                name="care"
                id="care"
                defaultValue={data.care}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
                //onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.care}`, anchorEl : event.currentTarget , field : "care"} )}
                onClick = {(event) => this.handleMessageData('care', event)} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  outline: "none" ,
                  color:messageNotSeen.includes('care')?'red':''
                }}
              >
                +
              </button>
              </div>                        
            </div>
         
            <div className="row">
              <div className="col-11">
              <Input
                label="MADE IN ?"
                name="madeIn"
                id="madeIn"
                defaultValue={data.madeIn}
                onChange={handleChange}
              />
              </div>
              <div className="col-1">
              <button
              //  onClick={(event) => this.setState({ msgFormToggle: !msgFormToggle, msgFormTitle :`was : ${data.madeIn}, ` , anchorEl : event.currentTarget , field : "madeIn"  })}
                onClick = {(event) => this.handleMessageData('madeIn', event)} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  outline: "none" ,
                  color:messageNotSeen.includes('madeIn')?'red':''
                }}
              >
                +
              </button>
              </div> 
            </div>
            {msgFormToggle && (
             <Popover
             className 
             id={id}
             open={open}
             anchorEl={this.state.anchorEl}
             onClose={this.handleClose}
             anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'center',
             }}
             transformOrigin={{
               vertical: 'top',
               horizontal: 'center',
             }}
             
           >
            <div className="col" style = {{width : "20rem", paddingBottom : '1rem' , paddingTop : '1rem'}}>
              <div className="scroll" style = {{overflow : "auto" , width : "18rem" , height : "15rem"}}>
              <p>{productMessage && productMessage.map((msg) => {
              return (
                <div>
                  <small>{msg.senderName ? msg.senderName : ''}</small>
                  <p style = {{color : "red" , marginTop: "2px", marginBottom : "2px"}}>{msg.msgformTitle}</p>
                  <p style = {{marginTop : "2px" , marginBottom : "2px"}}>{msg.msgFormDescription}</p> <hr />
                </div>
              )
            })}</p>
              </div>
              <div style = {{paddingBottom : "1rem"}}>
              <form onSubmit = {this.handleMessageSubmit}>
                <input
                  placeholder="title"
                  style={{ width: "100%" }}
                  onChange={this.handleMessage}
                  value = {this.state.msgFormTitle}
                  name = "msgformTitle"

                />
                <textarea
                  placeholder="explain"
                  style={{ width: "100%" }}
                  onChange={this.handleMessage}
                  value = {`${this.state.msgFormDescription}`}
                  name = "msgFormDescription"
                />
                <button className = "btn btn-primary">Send</button>
              </form>
            </div>
            
            </div>
            
            
            
          </Popover>)}
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
        </div>
        

        <div className="form-group mt-3">
          <label className="h6 py-2 fw-500 text-uppercase">
            <text className="text-danger">*</text>Description
          </label>
          {/* shortDescription btn */}

          {customdesc.toString() === "true" ? (
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
            rows="7"
            name="shortDescription"
            defaultValue={data.shortDescription}
            value={data.shortDescription}
            onKeyUp={this.handleChanges}
            onChange={handleChange}
          ></textarea>
          <small className="form-text text-muted" style={{ fontSize: "0.5em" }}>
            {this.state.count}/5000 max characters
          </small>
        </div>
        <div className="edit__description">
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
        <div className="py-3">
        {/* <div className="d-flex">
          <Input
            placeholder="Value"
            name="value1"
            id="line1"
            defaultValue={data.line1.value1}
            onChange={handleChange}
          />
          <Input
            placeholder="line 1"
            name="line1"
            id="line1"
            defaultValue={data.line1.line1}
            onChange={handleChange}
          />
          </div> */}

            {/* <div className="d-flex">
            <Input
            placeholder="Value"
            name="value2"
            id="line1"
            defaultValue={data.line2.value2}
            onChange={handleChange}
          />
          <Input
            placeholder="line 2"
            name="line2"
            id="line1"
            defaultValue={data.line2.line2}
            onChange={handleChange}
          />
            </div> */}
            {/* <div className="d-flex">
            <Input
            placeholder="Value"
            name="value3"
            id="line1"
            defaultValue={data.line3.value3}
            onChange={handleChange}
          />
          <Input
            placeholder="line 3"
            name="line3"
            id="line1"
            defaultValue={data.line3.line3}
            onChange={handleChange}
          />
            </div> */}

            {/* <div className="d-flex">
            <Input
            placeholder="Value"
            name="value4"
            id="line1"
            defaultValue={data.line4.value4}
            onChange={handleChange}
          />
          <Input
            placeholder="line 4"
            name="line4"
            id="line1"
            defaultValue={data.line4.line4}
            onChange={handleChange}
          />
            </div> */}
            {/* <div className="d-flex">
            <Input
            placeholder="Value"
            name="value5"
            id="line1"
            defaultValue={data.line5.value5}
            onChange={handleChange}
          />
          <Input
            placeholder="line 5"
            name="line5"
            id="line1"
            defaultValue={data.line5.line5}
            onChange={handleChange}
          />
            </div> */}

          {showMoreLines && (
            <div>

          
            {/* <div className="d-flex">
            <Input
          placeholder="Value"
          name="value6"
          id="line1"
          defaultValue={data.line6.value6}
          onChange={handleChange}
        />
        <Input
          placeholder="line 6"
          name="line6"
          id="line1"
          defaultValue={data.line6.line6}
          onChange={handleChange}
        />
 
            </div> */}
            {/* <div className="d-flex">
            <Input
          placeholder="Value"
          name="value7"
          id="line1"
          defaultValue={data.line7.value7}
          onChange={handleChange}
        />
        <Input
          placeholder="line 7"
          name="line7"
          id="line1"
          defaultValue={data.line7.line7}
          onChange={handleChange}
        />
            </div> */}
            {/* <div className="d-flex">
            <Input
          placeholder="Value"
          name="value8"
          id="line8"
          defaultValue={data.line8.value8}
          onChange={handleChange}
        />
        <Input
          placeholder="line 8"
          name="line8"
          id="line1"
          defaultValue={data.line8.line8}
          onChange={handleChange}
        />
            </div> */}
 
            </div>
          )}
          {/* <div>
            <div
              className="btn btn-link mb-3 pl-0"
              onClick={() => this.setState({ showMoreLines: !showMoreLines })}
            >
              {showMoreLines ? "Hide" : "Show more"}
            </div>
          </div> */}

          <div className="form-group mb-4 row align-items-center">
            <div className="col-12 col-lg-8">
              <select
                className="custom-select border border-dark  custom-select-sm"
                name="condition_name"
                id="condition_name"
                value={data.condition_name}
                onChange={handleChange}
              >
                <option>Select Condition</option>
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

          <div className="form-group">
            <label className="h6 py-2 fw-500 text-uppercase">
              Bottom of Description
            </label>
            <textarea
              className="form-control col-12 col-lg-12"
              id="bottomDescription"
              rows="3"
              name="bottomDescription"
              defaultValue={data.bottomDescription}
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
        </div>
      </div>
    );
  };
}
export default RightSection;