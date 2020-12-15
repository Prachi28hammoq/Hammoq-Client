import React, { Component } from "react";
import LeftSection from "./components/LeftSection/LeftSection";
import RightSection from "./components/RightSection/RightSection";
import "./EditForm.css";
import Axios from "../../services/Axios";
import { Link } from "react-router-dom";
//import { assetsURL } from "../../services/Axios";
import imageCompression from "browser-image-compression";
import { has } from "rambda";
import { evaluateTree } from "../utils/parser";
import jwt_decode from "jwt-decode";

Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");

class ListForm extends Component {
	constructor() {
    super();
    this.state = {
      data: {
        line1: { line1: "", value1: "" },
        line2: { line2: "", value2: "" },
        line3: { line3: "", value3: "" },
        line4: { line4: "", value4: "" },
        line5: { line5: "", value5: "" },
        line6: { line6: "", value6: "" },
        line7: { line7: "", value7: "" },
        line8: { line8: "", value8: "" },
        ebay: { title: "", check: "", url: "" },
        poshmark: { title: "", check: "", url: "" },
        mercari: { title: "", check: "", url: "" },
        delist: { title: "", check: "", url: "" },
      },
      isSubmitting: false,
      extraMeasures: [],
      extraDescriptions: [],
      ctemplates: [],
      templates: [],
      count: 1,
      count1: 1,
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
      sku: "",
      Ebay: false,
      Poshmark: false,
      Mercari: false,
      othersbool: false,
      others: [],
      othersstate: [],
      otherfromdb: [],
      othertolist: [],

      othersurl: [],
      ebayurl: "",
      poshmarkurl: "",
      mercariurl: "",
      showcat: false,

      rates: {},
      bal: 0,
      basiccheck: true,
      advancecheck: true,
      activity: "",
      activity_check: true,
      editchange: false,
      brandacc: 0,
      coloracc: 0,
      labelacc : 0,
      productid : "",
      clientid : "",
      productMessage : [],
      messageNotSeen : [],
      agentName : '',
      templateIdd: '',

      suggestions: [],
      companyBlurb: "",
      originZipCode: 0,
      freeShipping: false,
      flatShipping: false,
      flatShippingRules: [],
      calculatedShipping: false,
      bestOfferStatus: false,
      bestOfferSettings: [],
      mercariHashtags: [],
      internationalShipping: [],
      compPriceSetting: "",
      compPriceIncreaseValue: 0,
      compPriceIncreaseMethod: "",
    };
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    this.agentid = decoded._doc._id;
  }


  handelMessageNotSeen() {
    var msgSeenTemp = [];
    var data = this.state.data;
    console.log(data,'dataaaaaaaaaa')
    if (data.messageSeen) {
      for (let i = 0; i < data.messageSeen.length; i++) {
        if (data.messageSeen[i].client == false) {
          msgSeenTemp.push(data.messageSeen[i].field);
        }
      }
    }
    this.setState({ messageNotSeen: msgSeenTemp });
  }

componentDidMount = () => {
    Axios.get("/template")
      .then(({ data }) => this.setState({ templates: data.templates }))
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    Axios.get(
      `/product/${this.props.match.params.id}`,
      (Axios.defaults.headers.common["x-access-token"] = localStorage.getItem(
        "token"
      )),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    ).then((res) => {
      const { 
        images, 
        //data 
      } = this.state;
      this.setState({ data: res.data.products[0] });

      this.handelMessageNotSeen()

      if (res.data.products[0].extraMeasures) {
        this.state.extraMeasures = JSON.parse(
          res.data.products[0].extraMeasures
        );
        this.state.count = this.state.extraMeasures.length + 1;
      }

      if (res.data.products[0].line) {
        this.state.extraDescriptions = JSON.parse(res.data.products[0].line);
        this.setState({
          extraDescriptions: this.state.extraDescriptions,
          count1: this.state.extraDescriptions.length + 1,
        });
      }

      //this.state.templatename = this.state.data.title.substring(0,5)
      var yourString = this.state.data.title;
      var maxLength = 15;
      var trimmedString = yourString.substr(0, maxLength);
      this.state.templatename = trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
      );

      if (res.data.products[0].ebay.url !== "") {
        this.state.ebayurl = res.data.products[0].ebay.url;
        console.log(this.state.ebayurl);
      }
      if (res.data.products[0].poshmark.url !== "") {
        this.state.poshmarkurl = res.data.products[0].poshmark.url;
        console.log(this.state.poshmarkurl);
      }
      if (res.data.products[0].mercari.url !== "") {
        this.state.mercariurl = res.data.products[0].mercari.url;
        console.log(this.state.mercariurl);
      }

      if (
        res.data.products[0].category !== "Men" &&
        res.data.products[0].category !== "Women" &&
        res.data.products[0].category !== "Unisex Kids" &&
        res.data.products[0].category !== "Babies" &&
        res.data.products[0].category !== "Speacialty"
      ) {
        this.setState({ showcat: true });
      }

      // if(res.data.products[0])

      if (res.data.products[0].others) {
        this.state.otherfromdb = JSON.parse(res.data.products[0].others);
        //console.log(this.state.otherfromdb);
        this.state.otherfromdb.forEach((db, i) => {
          this.state.othersstate[i] = db.status;
          if (db.status === true && db.url !== undefined && db.url !== "") {
            this.state.othersurl[i] = db;
          }
          if (db.status === true) {
            this.state.othertolist[i] = db;
          }
        });
        //console.log(this.state.othersurl);
      }

      if (res.data.products[0]._id) {
        this.setState({ productid: res.data.products[0]._id });
      }

      if (res.data.products[0].message) {
        // console.log( res.data.products[0].message ,'msg value reading')
        this.setState({ message: res.data.products[0].message });
      }

      // console.log(this.state.messageNotSeen, 'edit mforefh dfkhkjh')

      this.state.data["ebay"]["title"] = res.data.products[0].ebay.title;
      this.state.data["poshmark"]["title"] =
        res.data.products[0].poshmark.title;
      this.state.data["mercari"]["title"] = res.data.products[0].mercari.title;
      this.state.data["delist"]["title"] = res.data.products[0].delist.title;
      if (res.data.products[0].images)
        images.forEach((image) => {
          image.img = res.data.products[0].images[image.key];
        });
      this.setState({ images });

      //balance check

      let activity = res.data.products[0].activity;
      this.setState({ activity });

/*      const message = async () => {
        const response = await Axios.get(
          `/message/${this.props.match.params.id}`,
          (Axios.defaults.headers.common[
            "x-access-token"
          ] = localStorage.getItem("token")),
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        //console.log(response);
      };*/
      //console.log(message(), "response message check");

      if (localStorage.getItem("token")) {
        Axios.get("/payment/rates")
          .then((res) => {
            //rates = res.data[res.data.length - 1];
            this.setState({ rates: res.data[res.data.length - 1] });

            Axios.get("/clientdetails")
              .then(({ data }) => {
                this.setState({ bal: data.balance });
                if (this.state.rates.basic / 100 > this.state.bal) {
                  this.setState({ basiccheck: false });
                }
                if (this.state.rates.advance / 100 > this.state.bal) {
                  this.setState({ advancecheck: false });
                }

                if (this.state.activity === "basic") {
                  this.setState({ activity_check: this.state.basiccheck });
                } else {
                  //advance
                  this.setState({ activity_check: this.state.advancecheck });
                }
                //console.log(this.state.bal);
              })
              .catch((err) => console.log(err) || alert(JSON.stringify(err)));
          })
          .catch((err) => console.log(err) || alert(JSON.stringify(err)));
      }
    });

    Axios.get("/password/getstatus").then(({ data }) => {
      //console.log(data);
      this.setState({ Ebay: data.Ebay });
      this.setState({ Poshmark: data.Poshmark });
      this.setState({ Mercari: data.Mercari });
    });

    Axios.get("/password/getstatus/others").then(({ data }) => {
      //console.log(data);
      if (data.length > 0) {
        this.setState({ othersbool: true });
        data.forEach((d, i) => {
          const others = [...this.state.others];
          others.push(d);
          this.setState({ others });

          const otherss = [...this.state.othersstate];
          otherss.push(false);
          this.setState({ othersstate: otherss });
          //console.log(this.state.othersstate);
        });
      }
    });

    localStorage.setItem("actionebay", "");
    localStorage.setItem("actionposhmark", "");
    localStorage.setItem("actionmercari", "");
    localStorage.setItem("actionfb", "");

    Axios.get(`/producttemplate/${this.props.match.params.id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      if (response.data.templateId) {
        this.setState({ templateIdd: response.data.templateId });
        this.setTemplate(response.data.templateId);
      }
    });
  };

  skuSearch = () => {
    const { images } = this.state;
    // images.forEach((i) => {
    //   i.img = "";
    // });
    Axios.get(`/product/cid/${this.state.sku}/${this.props.match.params.clientid}`)
      .then(({ data }) => {
        console.log(data);
        if (!data) {
          data = {};
          this.state.data["ebay"]["check"] = false;
          this.state.data["poshmark"]["check"] = false;
          this.state.data["mercari"]["check"] = false;
          this.state.data["delist"]["check"] = false;
        } else {
          this.setState({ data: data });
          if (data.extraMeasures) {
            this.state.extraMeasures = JSON.parse(data.extraMeasures);
            this.state.count = this.state.extraMeasures.length + 1;
          }
          if (data.templates[0].data.others) {
            this.state.otherfromdb = JSON.parse(data.templates[0].data.others);
            this.state.otherfromdb.forEach((db, i) => {
              this.state.othersstate[i] = db.status;
            });
          }
          this.state.data["ebay"]["title"] = data.ebay.title;
          this.state.data["poshmark"]["title"] = data.poshmark.title;
          this.state.data["mercari"]["title"] = data.mercari.title;
          this.state.data["delist"]["title"] = data.delist.title;
          // if (data.images) {
          //   images.forEach((image) => {
          //     image.img = data.images[image.key];
          //   });
          //   this.setState({ images });
          // }
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  setModelName = () => {
    const jsonToObject = (data) => JSON.parse(data);
    //const trace = (x) => {
    //  console.log(x);
    //  return x;
    //};
    const { clientid } = this.props.match.params;
    const id = this.props.match.params.productid;
    Axios.get(`/product/vision/${clientid}/${id}`)
         .then((data) => 
         {
          console.log(data);
          if (has("labels", data.data)) {
            const table = data.data.labels.forEach(jsonToObject).reduce(
              (tb, curLabel) => ({
                ...tb,
                [curLabel.description]: curLabel.score,
              }),
              {}
            );

          const eva = (pre, curRule) => {
            console.log("rule", curRule);
            if (has("output", curRule) && has("expression", curRule)) {
              const re = evaluateTree(curRule, table);
              if (re !== "") return [...pre, re];
            }
            return pre;
          };
          this.getRules().then((data) => {
            console.log("res", data);
            const res = data.reduce(eva, []);
            if (res.length > 0)
              this.setState({
                ...this.state,
                data: { ...this.state.data, model: res[0] },
              });
          });
        }
      })
      .catch(console.dir);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    //     if (name === "title") {
    //       data[name] = e.target.value.replace(/[^\w\s]/gi, "");
    //     } else {
    //       data[name] = value;
    //     }
    data[name] = value;
   // console.log(e.target.value);
   // console.log(this.state.data.brand);
    this.setState({ data });
    this.setState({ editchange: true });
  };

  handleOtherTitles = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["title"] = value;
    this.setState({ data });
  };

  handleUrl = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["url"] = value;
    this.setState({ data });
  };

  handleMeasureLabel = (id, e) => {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.forEach((measure) => {
      if (measure.id === id) {
        measure.label = value;
      }
    });
    this.setState({ extraMeasures });
    //console.log(extraMeasures);
  };

  handleDescriptionLabel = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.key = value;
      }
    });
    this.setState({ extraDescriptions });
   // console.log(extraDescriptions);
  };

  handleMeasureChange = (id, e) => {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.forEach((measure) => {
      if (measure.id === id) {
        measure.val = value;
      }
    });
    this.setState({ extraMeasures });
    //console.log(extraMeasures);
  };

  handleDescriptionChange = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.forEach((description) => {
      if (description.id === id) {
        description.value = value;
      }
    });
    this.setState({ extraDescriptions });
   // console.log(extraDescriptions);
  };

  addMeasure = (e) => {
  //  console.log("addMeaseure");
    const { extraMeasures, count } = this.state;
    extraMeasures.push({ label: "", val: "", id: count });
    this.setState({ extraMeasures });
    this.setState({ count: count + 1 });
  };

  addDescription = () => {
  //  console.log("add description");
    const { extraDescriptions, count1 } = this.state;
    extraDescriptions.push({ key: "", value: "", id: count1 });
  //  console.log(extraDescriptions);
    this.setState({ extraDescriptions });
    this.setState({ count1: count1 + 1 });
  };

  removeMeasure = (id, e) => {
    const { extraMeasures, count } = this.state;

    this.setState({
      extraMeasures: extraMeasures.filter((measure) => {
        return measure.id !== id;
      }),
    });
    this.setState({ count: count - 1 });
  };

  removeDescription = (id, e) => {
    const { 
      extraDescriptions, 
      //count1 
    } = this.state;
    this.setState({
      extraDescriptions: extraDescriptions.filter((description) => {
        return description.id !== id;
      }),
    });
  };

  onSubmit = (e,  value) => {
    e.preventDefault();
    const { clientid, productid } = this.props.match.params;
    const { data, images, extraMeasures, extraDescriptions } = this.state;
    const manualProdList =
      (this.state.data["ebay"]["url"] !== undefined &&
        this.state.data["ebay"]["url"] !== "") ||
      (this.state.data["mercari"]["url"] !== undefined &&
        this.state.data["mercari"]["url"] !== "") ||
      (this.state.data["poshmark"]["title"] !== undefined &&
        this.state.data["poshmark"]["url"] !== "");
    // const manualProdListBy = this.props;
    const ebayUrl =
      this.state.data["ebay"]["url"] !== undefined
        ? this.state.data["ebay"]["url"]
        : "";
    const poshMarkUrl =
      this.state.data["poshmark"]["url"] !== undefined
        ? this.state.data["poshmark"]["url"]
        : "";
    const mercariUrl =
      this.state.data["mercari"]["url"] !== undefined
        ? this.state.data["mercari"]["url"]
        : "";
    const dataform = new FormData();
    images.forEach((image) => {
      if (!!image.img) dataform.append(image.key, image.img);
    });

    var y = [];
    this.state.others.forEach((o, i) => {
      let obj = {
        name: o,
        status: this.state.othersstate[i],
      };
      y.push(obj);
    });
    console.log(y);

    this.setState({ isSubmitting: true });

    dataform.append("sku", data.sku);
    dataform.append("quantity", data.quantity);
    dataform.append("price", data.price);
    dataform.append("extraMeasures", JSON.stringify(extraMeasures));
    //dataform.append("extraDescription", JSON.stringify(extraDescriptions));
    dataform.append("brand", data.brand);
    dataform.append("model", data.model);
    dataform.append("modelNo", data.modelNo)
    dataform.append("title", data.title);
    dataform.append("shortDescription", data.shortDescription);
    dataform.append("condition_name", data.condition_name);
    dataform.append("ebay", data.ebay.title);
    dataform.append("mercari", data.mercari.title);
    dataform.append("poshmark", data.poshmark.title);
    dataform.append("delist", data.delist.title);
    dataform.append("ebayc", data.ebay.check);
    dataform.append("mercaric", data.mercari.check);
    dataform.append("poshmarkc", data.poshmark.check);
    dataform.append("delistc", data.delist.check);
    dataform.append("colorShade", data.colorShade);
    dataform.append("material", data.material);
    dataform.append("size", data.size);
    dataform.append("style", data.style);
    dataform.append("pattern", data.pattern);
    dataform.append("category", data["category"]);
    dataform.append("seasonOrWeather", data.seasonOrWeather);
    dataform.append("care", data.care);
    dataform.append("inseam", data.inseam);
    dataform.append("rise", data.rise);
    dataform.append("waist", data.waist);
    dataform.append("bottomDescription", data.bottomDescription);
    dataform.append("msrp", data.msrp);
    dataform.append("upc", data.upc);
    dataform.append("mrp", data.mrp);
    dataform.append("keywords", data.keywords);
    dataform.append("notes", data.notes);
    dataform.append("weightLB", data.weightLB);
    dataform.append("weightOZ", data.weightOZ);
    dataform.append("zipCode", data.zipCode);
    dataform.append("packageLength", data.packageLength);
    dataform.append("packageWidth", data.packageWidth);
    dataform.append("packageHeight", data.packageHeight);
    dataform.append("costOfGoods", data.costOfGoods);
    dataform.append("shippingFees", data.shippingFees);
    dataform.append("profit", data.profit);
    dataform.append("status", true);
    dataform.append("line", JSON.stringify(extraDescriptions));
    dataform.append("note", data.note)
    // dataform.append("line2", { line2: data.line2, value2: data.value2 });
    // dataform.append("line3", { line3: data.line3, value3: data.value3 });
    // dataform.append("line4", { line4: data.line4, value4: data.value4 });
    // dataform.append("line6", { line6: data.line6, value6: data.value6 });
    // dataform.append("line7", { line7: data.line7, value7: data.value7 });
    // dataform.append("line8", { line8: data.line8, value8: data.value8 });
    // dataform.append("line5", { line5: data.line5, value5: data.value5 });
    dataform.append("madeIn", data.madeIn);
    dataform.append("gender", data.gender || "");
    dataform.append("others", JSON.stringify(y));
    dataform.append("manualProdList", manualProdList);
    dataform.append("ebayUrl", ebayUrl);
    dataform.append("poshMarkUrl", poshMarkUrl);
    dataform.append("mercariUrl", mercariUrl);
    if(value === "draft"){
      dataform.append("prodStatus", "draft");
    }
    if (
      this.state.ebayurl !== "" &&
      this.state.ebayurl !== null &&
      this.state.ebayurl !== "d"
    ) {
      dataform.append("ebayurl", data["ebay"]["url"]);
    }
    if (
      this.state.poshmarkurl !== "" &&
      this.state.poshmarkurl !== null &&
      this.state.poshmarkurl !== "d"
    ) {
      dataform.append("poshmarkurl", data["poshmark"]["url"]);
    }
    if (
      this.state.mercariurl !== "" &&
      this.state.mercariurl !== null &&
      this.state.mercariurl !== "d"
    ) {
      dataform.append("mercariurl", data["mercari"]["url"]);
    }
   
    Axios.put(`/product/${this.props.match.params.id}`, dataform, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": `${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        // console.log(response, "image");
        window.open(`/products/${data.prodStatus}`, "_self");
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        console.log(err) || alert(JSON.stringify({ err: err }));
      });
  };

  toggleSelectedWebsite = (str) => {
    
    const { data } = this.state;
    
    data[str]["check"] = !data[str]["check"];
    this.setState({ data });
  };

  toggleSelectedOthersWebsite = (i) => {
    const { othersstate } = this.state;
    othersstate[i] = !othersstate[i];
    this.setState({ othersstate });
  };

  handleImageChange = async (event) => {
    const { images } = this.state;

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const idx = images.findIndex((image) => image.key === event.target.name);
    try {
      this.setState({ isSubmitting: true });
      let compressedFile = await imageCompression(
        event.target.files[0],
        options
      );
      images[idx].img = compressedFile;
      this.setState({
        images,
      });
      this.setState({ isSubmitting: false });
    } catch (error) {
      console.log(error);
    }
  };

  handleBulkUpload = async (e) => {
    const { images } = this.state;
    const files = e.target.files;
    const count = files.length;

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    this.setState({ isSubmitting: true });
    for (let i = 0; i < count; i++) {
      const idx = images.findIndex((image) => !image.img);
      if (idx > -1) {
        try {
         // console.log(files[i]);
          let compressedFile = await imageCompression(files[i], options);
        //  console.log(compressedFile);
          images[idx].img = compressedFile;
          this.setState({ images }, () => console.log(this.state.images));
        } catch (error) {
          console.log(error);
        }
      }
    }
    this.setState({ isSubmitting: false });
  };

  removeImg = (idx) => {
    const { images } = this.state;
    images[idx].img = "";
    this.setState({ images });
  };

  skuChange = (e) => {
    this.setState({ sku: e.target.value });
  };

  listHandler = async (website) => {
    const tempData = {listing:1,crosslisting:0,delisting:0}
    await Axios.post("/nooflistings/",tempData,{headers: {"x-access-token": localStorage.getItem("token"),},})

    //console.log(website,"websitesssssss")

    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }

    if (website === "ebay") {
      //localStorage.setItem("actionebay", "listebay");
      //const eBayAuthToken = localStorage.getItem("ebayauthtoken");
    }
    if (website === "poshmark") {
      
      localStorage.setItem("actionposhmark", "listposhmark");
      window.location.reload();
      // window.open("https://poshmark.com/create-listing");
    }
    if (website === "mercari") {
      
      localStorage.setItem("actionmercari", "listmercari");
      window.location.reload();
      // window.open("https://www.mercari.com/sell/");
    }
    if (website === "facebook") {
     
      localStorage.setItem("actionfb", "listfb");
      window.location.reload();
      // window.open("https://www.facebook.com/marketplace/");
    }
  };

  editHandler = (website) => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (website === "ebay") {
      localStorage.setItem("actionebay", "editebay");
      localStorage.setItem("ebaydelisturl", this.state.ebayurl);
     
      window.location.reload();
      // window.open("https://www.ebay.com/sh/lst/active");
     
    }
    if (website === "poshmark") {
      localStorage.setItem("actionposhmark", "editposhmark");
      localStorage.setItem("poshmarkdelisturl", this.state.poshmarkurl);
      
      window.location.reload();
      // window.open(this.state.poshmarkurl);
    }
    if (website === "mercari") {
      localStorage.setItem("actionmercari", "editmercari");
      localStorage.setItem("mercaridelisturl", this.state.mercariurl);
      
      window.location.reload();
      // window.open(this.state.mercariurl);

    }
  };

  listHandlerAll = async() => {
    var count = 0;
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (this.state.Ebay && this.state.data["ebay"]["check"]) {
      localStorage.setItem("actionebay", "listebay");
      window.location.reload();
      // window.open(
      //   "https://bulksell.ebay.com/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem"
      // );
      count = count+1;
    }
    if (this.state.Poshmark && this.state.data["poshmark"]["check"]) {
      localStorage.setItem("actionposhmark", "listposhmark");
      window.location.reload();
      //window.open("https://poshmark.com/create-listing");
      count = count+1;
    }
    if (this.state.Mercari && this.state.data["mercari"]["check"]) {
      localStorage.setItem("actionmercari", "listmercari");
      window.location.reload();
      //window.open("https://www.mercari.com/sell/");
      count = count+1;
    }

    const tempData = {listing:1,crosslisting:count-1,delisting:0}
    await Axios.post("/nooflistings/",tempData,{headers: {"x-access-token": localStorage.getItem("token"),},})

  };

  editHandlerAll = () => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (
      this.state.Ebay &&
      this.state.data["ebay"]["check"] &&
      this.state.ebayurl
    ) {
      localStorage.setItem("actionebay", "editebay");
      localStorage.setItem("ebaydelisturl", this.state.ebayurl);
      window.location.reload();
      //window.open("https://www.ebay.com/sh/lst/active");
    }
    if (
      this.state.Poshmark &&
      this.state.data["poshmark"]["check"] &&
      this.state.poshmarkurl
    ) {
      localStorage.setItem("actionposhmark", "editposhmark");
      localStorage.setItem("poshmarkdelisturl", this.state.poshmarkurl);
      window.location.reload();
      //window.open(this.state.poshmarkurl);
    }
    if (
      this.state.Mercari &&
      this.state.data["mercari"]["check"] &&
      this.state.mercariurl
    ) {
      localStorage.setItem("actionmercari", "editmercari");
      localStorage.setItem("mercaridelisturl", this.state.mercariurl);
      window.location.reload();
      //window.open(this.state.mercariurl);
    }
  };

  delistHandler = async (website) => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    const tempData = {listing:0,crosslisting:0,delisting:1}
    await Axios.post("/nooflistings/",tempData,{headers: {"x-access-token": localStorage.getItem("token"),},})
    
    if (website === "ebay") {
      localStorage.setItem("actionebay", "delistebay");
      localStorage.setItem("ebaydelisturl", this.state.ebayurl);
      window.location.reload();
      // window.open("https://www.ebay.com/sh/lst/active");
    }
    if (website === "poshmark") {
      localStorage.setItem("actionposhmark", "delistposhmark");
      localStorage.setItem("poshmarkdelisturl", this.state.poshmarkurl);
      window.location.reload();
      // window.open(this.state.poshmarkurl);
    }
    if (website === "mercari") {
      localStorage.setItem("actionmercari", "delistmercari");
      localStorage.setItem("mercaridelisturl", this.state.mercariurl);
      window.location.reload();
      // window.open(this.state.mercariurl);
    }
    if (website === "facebook") {
      localStorage.setItem("actionfb", "delistfb");
      window.location.reload();
      this.state.othersurl.forEach((db, i) => {
        if (db.name === "facebook") {
          window.open(db.url);
        }
      });
    }
  };

  delistHandlerAll = async () => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    var count = 0;
    if (
      this.state.Ebay &&
      this.state.data["ebay"]["check"] &&
      this.state.ebayurl
    ) {
      localStorage.setItem("actionebay", "delistebay");
      localStorage.setItem("ebaydelisturl", this.state.ebayurl);
      count=count+1;
      window.location.reload();
      //window.open("https://www.ebay.com/sh/lst/active");
    }
    if (
      this.state.Poshmark &&
      this.state.data["poshmark"]["check"] &&
      this.state.poshmarkurl
    ) {
      localStorage.setItem("actionposhmark", "delistposhmark");
      localStorage.setItem("poshmarkdelisturl", this.state.poshmarkurl);
      count=count+1
      window.location.reload();
      //window.open(this.state.poshmarkurl);
    }
    if (
      this.state.Mercari &&
      this.state.data["mercari"]["check"] &&
      this.state.mercariurl
    ) {
      localStorage.setItem("actionmercari", "delistmercari");
      localStorage.setItem("mercaridelisturl", this.state.mercariurl);
      count=count+1;
      window.location.reload();
      //window.open(this.state.mercariurl);
    }
    const tempData = {listing:0,crosslisting:0,delisting:count}
    await Axios.post("/nooflistings/",tempData,{headers: {"x-access-token": localStorage.getItem("token"),},})
  };

  listallow = () => {
    var allow = 0,
      cnt = 0;
    if (this.state.Ebay && this.state.data.ebay.check) {
      cnt++;
      if (this.state.ebayurl === null || this.state.ebayurl === "") {
        allow++;
      }
    }
    if (this.state.Poshmark && this.state.data.poshmark.check) {
      cnt++;
      if (this.state.poshmarkurl === null || this.state.poshmarkurl === "") {
        allow++;
      }
    }
    if (this.state.Mercari && this.state.data.mercari.check) {
      cnt++;
      if (this.state.mercariurl === null || this.state.mercariurl === "") {
        allow++;
      }
    }

    if (allow === cnt && cnt !== 0) {
      return true;
    } else {
      return false;
    }
  };

  delistallow = () => {
    var deallow = 0,
      cnt = 0;
    if (this.state.Ebay && this.state.data.ebay.check) {
      cnt++;
      if (
        this.state.ebayurl !== null &&
        this.state.ebayurl !== "d" &&
        this.state.ebayurl !== "" //ebayurl[0]=="h"
      ) {
        deallow++;
      }
    }
    if (this.state.Poshmark && this.state.data.poshmark.check) {
      cnt++;
      if (
        this.state.poshmarkurl !== null &&
        this.state.poshmarkurl !== "d" &&
        this.state.poshmarkurl !== ""
      ) {
        deallow++;
      }
    }
    if (this.state.Mercari && this.state.data.mercari.check) {
      cnt++;
      if (
        this.state.mercariurl !== null &&
        this.state.mercariurl !== "d" &&
        this.state.mercariurl !== ""
      ) {
        deallow++;
      }
    }

    if (deallow === cnt && cnt !== 0) {
      return true;
    } else {
      return false;
    }
  };

  nonelisted = () => {
    var bol = 0
      //,cnt = 0;
    if (this.state.Ebay && this.state.data.ebay.check) {
      //cnt++;
      if (
        this.state.ebayurl !== null &&
        this.state.ebayurl !== "d" &&
        this.state.ebayurl !== "" ////ebayurl[0]=="h"
      ) {
        bol++;
      }
    }
    if (this.state.Poshmark && this.state.data.poshmark.check) {
      //cnt++;
      if (
        this.state.poshmarkurl !== null &&
        this.state.poshmarkurl !== "d" &&
        this.state.poshmarkurl !== ""
      ) {
        bol++;
      }
    }
    if (this.state.Mercari && this.state.data.mercari.check) {
      if (
        this.state.mercariurl !== null &&
        this.state.mercariurl !== "d" &&
        this.state.mercariurl !== ""
      ) {
        bol++;
      }
    }

    if (bol === 0) {
      return true;
    } else {
      return false;
    }
  };
  setCategory = (str) => {
    const { data } = this.state;
    data["category"] = str;
    this.setState({ data });
  };
  blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  handleDelete = async () => {
    const id = this.props.match.params.templateid
    
    Axios.delete(`/template/${id}`) 
   .then((response) => {
     window.open("/templates", "_self");
   })
   .catch((err) => {
     console.log(err) || alert(JSON.stringify({ err: err }));
   });

 }

 handleChangesTemplate = (e) => {
   this.setState({templateIdd : e.target.value})
  this.set_c_Template(e.target.value)
 }
  render = () => {
    const {
      data,
      images,
      isSubmitting,
      extraMeasures,
      //templates,
      //ctemplates,
      Ebay,
      Poshmark,
      Mercari,
      templatename,
      othersbool,
      others,
      othersstate,
      //otherfromdb,
      othertolist,
      othersurl,
      ebayurl,
      poshmarkurl,
      mercariurl,
      activity_check,
      showcat,
      brandacc,
      coloracc,
      labelacc,
      //messageNotSeen,
      suggestions,
    } = this.state;
    //const {templateid} = this.props.match.params
	  return (
	    <div className='app'>
	      <div className='app__body'>
	        <LeftSection
	          data={data}
            images={images}
            Ebay={Ebay}
            Poshmark={Poshmark}
            Mercari={Mercari}
            isSubmitting={isSubmitting}
            handleChange={this.handleChange}
            removeImg={this.removeImg}
            handleBulkUpload={this.handleBulkUpload}
            handleImageChange={this.handleImageChange}
            handleOtherTitles={this.handleOtherTitles}
            toggleSelectedOthersWebsite={this.toggleSelectedOthersWebsite}
            toggleSelectedWebsite={this.toggleSelectedWebsite}
            productid = {this.state.productid}
            clientid = {this.state.clientid}
            extraDescriptions={this.state.extraDescriptions}
            companyBlurb={this.state.companyBlurb}
              />
	        <RightSection
	          data={data}
	          handleChange={this.handleChange}
	          images={images}
	          extraMeasures={extraMeasures}
	          brandacc={brandacc}
	          coloracc={coloracc}
	          labelacc={labelacc}
	          extraDescriptions={this.state.extraDescriptions}
	          addMeasure={this.addMeasure}
	          addDescription={this.addDescription}
	          handleMeasureChange={this.handleMeasureChange}
	          handleDescriptionChange={this.handleDescriptionChange}
	          handleMeasureLabel={this.handleMeasureLabel}
	          handleDescriptionLabel={this.handleDescriptionLabel}
	          removeMeasure={this.removeMeasure}
	          removeDescription={this.removeDescription}
	          removeImg={this.removeImg}
	          handleBulkUpload={this.handleBulkUpload}
	          handleImageChange={this.handleImageChange}
	          handleOtherTitles={this.handleOtherTitles}
	          handleUrl={this.handleUrl}
	          productid = {this.state.productid}
	          clientid = {this.state.clientid}
	          productMessage = {this.state.productMessage}
	          showcat={showcat}
            setCategory={this.setCategory}
            suggestions={suggestions}
              />
	      </div>
	    </div>
	  );
	}
}

export default ListForm;
