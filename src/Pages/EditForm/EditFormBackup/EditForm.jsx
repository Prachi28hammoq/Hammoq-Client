import React, { Component } from "react";
import LeftSection from "./Components/LeftSection";
import RightSection from "./Components/RightSection";
import "./Edit.css";
import Axios from "../../services/Axios";
import { Link } from "react-router-dom";
//import { assetsURL } from "../../services/Axios";
import imageCompression from "browser-image-compression";
Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");

//const $ = window.$;

export default class extends Component {
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
        ebay: { title: "", check: "" },
        poshmark: { title: "", check: "" },
        mercari: { title: "", check: "" },
        delist: { title: "", check: "" },
      },
      templatename: "",
      isSubmitting: false,
      extraMeasures: [],
      extraDescriptions: [],
      count: 1,
      count1: 1,
      templates: [],
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
      message: [],
      productid: "",
      inventoryCount: 0,
      messageNotSeen: [],
      templateIdd: "",

      ebayCategoryDropDownItems: [],
      companyBlurb: "",
      originZipCode: 0,
      calculatedShippingActive: false,
      freeShippingActive: false,
      flatShippingActive: false,
      flatShippingRules: [],
      bestOfferActive: false,
      bestOfferSettings: [],
      mercariHashtags: [],
      internationalShipping: [],
      compPriceSetting: "",
      compPriceIncreaseValue: 0,
      compPriceIncreaseMethod: "",
      rightSectionProps: [],
    };
  }
  handleChangesTemplate = (e) => {
    this.setState({ templateIdd: e.target.value });
    this.setTemplate(e.target.value);
  };

  handelMessageNotSeen() {
    var msgSeenTemp = [];
    var data = this.state.data;
    console.log(data,'dataaaaaaaaaa')
    if (data.messageSeen) {
      for (let i = 0; i < data.messageSeen.length; i++) {
        if (data.messageSeen[i].client === false) {
          msgSeenTemp.push(data.messageSeen[i].field);
        }
      }
    }
    this.setState({ messageNotSeen: msgSeenTemp });
  }
  setTemplate = (tempid) => {
    //const { images } = this.state;
    let { templatename } = this.state;
    // images.forEach((i) => {
    //   i.img = "";
    // });
    Axios.get(`/template/${tempid}`)
      .then(({ data }) => {
        if (!data.templates[0].data) {
          data.templates[0].data = {};
          this.state.data["ebay"]["check"] = false;
          this.state.data["poshmark"]["check"] = false;
          this.state.data["mercari"]["check"] = false;
          this.state.data["delist"]["check"] = false;
        } else {
          Object.entries(this.state.data).forEach((item) => {
            if (item[1] === "" || item[1] === undefined || item[1] === null) {
              this.state.data[`${item[0]}`] =
                data.templates[0].data[`${item[0]}`];
            }
          });

          //this.setState({ data: data.templates[0].data });
          templatename = data.templates[0].name;
          this.setState({ templatename });

          this.state.data["ebay"]["title"] = data.templates[0].data.ebay.title;
          this.state.data["poshmark"]["title"] =
            data.templates[0].data.poshmark.title;
          this.state.data["mercari"]["title"] =
            data.templates[0].data.mercari.title;
          this.state.data["delist"]["title"] =
            data.templates[0].data.delist.title;
          // if (data.templates[0].data.images) {
          //   images.forEach((image) => {
          //     image.img = data.templates[0].data.images[image.key];
          //   });
          //   this.setState({ images });
          // }

          if (data.templates[0].data.extraMeasures) {
            this.state.extraMeasures = JSON.parse(
              data.templates[0].data.extraMeasures
            );
            this.state.count = this.state.extraMeasures.length + 1;
          }

          if (data.templates[0].data.others) {
            this.state.otherfromdb = JSON.parse(data.templates[0].data.others);
            //console.log(this.state.otherfromdb);
            this.state.otherfromdb.forEach((db, i) => {
              this.state.othersstate[i] = db.status;
            });
          }
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

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

    Axios.get('ebay/itemSuggestionPopulater')
         .then((res) => {this.setState({ebayCategoryDropDownItems : res.data.data})});

    };
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    if (name === "title") {
      data[name] = e.target.value.replace(/[^\w\s]/gi, "");
    } else {
      data[name] = value;
    }
    console.log(data);
    this.setState({ data });
    this.setState({ editchange: true });
  };

  handleOtherTitles = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["title"] = value;
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
    // console.log(extraMeasures);
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
    const { extraMeasures, count } = this.state;
    extraMeasures.push({ label: "", val: "", id: count });
    this.setState({ extraMeasures });
    this.setState({ count: count + 1 });
  };

  addDescription = () => {
    //  console.log("add description");
    const { extraDescriptions, count1 } = this.state;
    extraDescriptions.push({ key: "", value: "", id: count1 });
    // console.log(extraDescriptions);
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

  onSubmit = (e) => {
    e.preventDefault();
    const { data, images, extraMeasures, extraDescriptions } = this.state;
    const dataform = new FormData();
    images.forEach((image) => {
      if (!!image.img) dataform.append(image.key, image.img);
    });

    if (images[0].img === "") {
      return alert("Atleast First Image is required");
    }

    if (data.condition_name === "Select Condition") {
      return alert("Condition is required");
    }

    // if (data.sku === undefined) {
    //   return alert("SKU is required");
    // }

    var y = [];
    this.state.others.forEach((o, i) => {
      let obj = {
        name: o,
        status: this.state.othersstate[i],
        url: this.state.othersurl[i] ? this.state.othersurl[i] : "",
      };
      y.push(obj);
    });
    // console.log(y);

    this.setState({ isSubmitting: true });

    dataform.append("sku", data.sku);
    dataform.append("quantity", data.quantity);
    dataform.append("price", data.price);
    dataform.append("extraMeasures", JSON.stringify(extraMeasures));
    dataform.append("brand", data.brand);
    dataform.append("model", data.model);
    dataform.append("title", data.title);
    dataform.append("shortDescription", this.state.input7);
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
    dataform.append("modelNo", data.modelNo || "");
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
    dataform.append("note", data.note);
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
    dataform.append("activity", "basic");
    dataform.append("line", JSON.stringify(extraDescriptions));
    // const value1 = { line1: data.line1, value1: data.value1 };
    // const value2 = { line2: data.line2, value2: data.value2 };
    // const value3 = { line3: data.line3, value3: data.value3 };
    // const value4 = { line4: data.line4, value4: data.value4 };
    // const value5 = { line5: data.line5, value5: data.value5 };
    // const value6 = { line6: data.line6, value6: data.value6 };
    // const value7 = { line7: data.line7, value7: data.value7 };
    // const value8 = { line8: data.line8, value8: data.value8 };
    // dataform.append("line1", JSON.stringify(value1));
    // dataform.append("line2", JSON.stringify(value2));
    // dataform.append("line3", JSON.stringify(value3));
    // dataform.append("line4", JSON.stringify(value4));
    // dataform.append("line6", JSON.stringify(value6));
    // dataform.append("line7", JSON.stringify(value7));
    // dataform.append("line8", JSON.stringify(value8));
    // dataform.append("line5", JSON.stringify(value5));
    dataform.append("madeIn", data.madeIn);
    dataform.append("gender", data.gender || "");
    dataform.append("notes", data.notes);
    dataform.append("others", JSON.stringify(y));

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
    // console.log(this.state.data,'othr value shdjchkjh')
    data[str]["check"] = !data[str]["check"];
    this.setState({ data });
  };

  toggleSelectedOthersWebsite = (i) => {
    const { othersstate } = this.state;
    // console.log(this.state.othersstate, 'other user websiter')
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
      //console.log(compressedFile);
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
          console.log(files[i]);
          let compressedFile = await imageCompression(files[i], options);
          console.log(compressedFile);
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

  listHandler = (website) => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (website === "ebay") {
      localStorage.setItem("actionebay", "listebay");
      window.location.reload();
      // window.open(
      //   "https://bulksell.ebay.com/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem"
      // );
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

  listHandlerAll = () => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (this.state.Ebay && this.state.data["ebay"]["check"]) {
      localStorage.setItem("actionebay", "listebay");
      window.location.reload();
      // window.open(
      //   "https://bulksell.ebay.com/ws/eBayISAPI.dll?SingleList&sellingMode=AddItem"
      // );
    }
    if (this.state.Poshmark && this.state.data["poshmark"]["check"]) {
      localStorage.setItem("actionposhmark", "listposhmark");
      window.location.reload();
      //window.open("https://poshmark.com/create-listing");
    }
    if (this.state.Mercari && this.state.data["mercari"]["check"]) {
      localStorage.setItem("actionmercari", "listmercari");
      window.location.reload();
      //window.open("https://www.mercari.com/sell/");
    }
  };

  editHandlerAll = () => {
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

  delistHandler = (website) => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
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

  delistHandlerAll = () => {
    if (this.state.editchange === true) {
      return alert("Please save changes before listing");
    }
    if (
      this.state.Ebay &&
      this.state.data["ebay"]["check"] &&
      this.state.ebayurl
    ) {
      localStorage.setItem("actionebay", "delistebay");
      localStorage.setItem("ebaydelisturl", this.state.ebayurl);
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
      window.location.reload();
      //window.open(this.state.mercariurl);
    }
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
        this.state.ebayurl !== ""
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
        this.state.ebayurl !== ""
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
      //cnt++;
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
  handleUrl = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["url"] = value;
    this.setState({ data });
  };

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
      //templatename,
      //othersbool,
      //others,
      //othersstate,
      //otherfromdb,
      //othertolist,
      //othersurl,
      //ebayurl,
      //poshmarkurl,
      //mercariurl,
      //activity_check,
      showcat,
      brandacc,
      coloracc,
      labelacc,
      //messageNotSeen,
      ebayCategoryDropDownItems
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
              />
          <RightSection
            data={data}
            handleChange={this.handleChange}
            brandacc={brandacc}
            coloracc={coloracc}
            labelacc={labelacc}
            addMeasure={this.addMeasure}
            removeMeasure={this.removeMeasure}
            extraMeasures={extraMeasures}
            handleMeasureChange={this.handleMeasureChange}
            handleMeasureLabel={this.handleMeasureLabel}
            clearExtraDescriptions={this.clearExtraDescriptions}
            addDescription={this.addDescription}
            extraDescriptions={this.state.extraDescriptions}
            handleDescriptionChange={this.handleDescriptionChange}
            handleDescriptionLabel={this.handleDescriptionLabel}
            removeDescription={this.removeDescription}
            repopulateExtraDescriptions={this.repopulateExtraDescriptions}
            handleSelectedLeaf={this.handleSelectedLeaf}
            handleSelectedEbayCategory={this.handleSelectedEbayCategory}
            handleOtherTitles={this.handleOtherTitles}
            toggleOptional={this.toggleOptional}
            handleUrl={this.handleUrl}
            productid = {this.state.productid}
            clientid = {this.state.clientid}
            productMessage = {this.state.productMessage}
            showcat={showcat}
            setCategory={this.setCategory}
            ebayCategoryDropDownItems={ebayCategoryDropDownItems}
            handleCheckboxToggle={this.handleCheckboxToggle}
            onSubmit={this.onSubmit}
            isSubmitting={this.isSubmitting}
            setEbayCategoryField={this.setEbayCategoryField}
              />
        </div>
      </div>
    );
  };
}

//const styles = {
//  inputFile: {
//    position: "absolute",
//    top: "0",
//    left: "0",
//    height: "100%",
//    width: "100%",
//    opacity: 0,
//  },
//};
