import React, { Component } from "react";
import LeftSection from "./Components/LeftSection";
import RightSection from "./Components/RightSection";
import "./Template.css";
import Axios from "../../services/Axios";
import { socketCon } from "../../services/Axios";
import { Link } from "react-router-dom";
import LoadingSpinner from "../utils/loader";
import io from "socket.io-client";
import imageCompression from "browser-image-compression";

// const socket = io(socketCon);

const $ = window.$;

export default class extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      users: [],
      website: "",
      otherssignal: false,
      loading: false,

      data: {
        line1:{line1:"",value1:""},
        line2:{line2:"",value2:""},
        line3:{line3:"",value3:""},
        line4:{line4:"",value4:""},
        line5:{line5:"",value5:""},
        line6:{line6:"",value6:""},
        line7:{line7:"",value7:""},
        line8:{line8:"",value8:""},
        ebay: { title: "", check: "" },
        poshmark: { title: "", check: "" },
        mercari: { title: "", check: "" },
        delist: { title: "", check: "" },
      },
      templatename: "",
      isSubmitting: false,
      templates: [],
      extraMeasures: [],
      extraDescriptions : [],
      count: 1,
      count1 : 1,
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
      tempcheck: false,
      otherfromdb: [],
      bal: 0,
      rates: {},
      cid: "",
      imglen: 0,
      templateid : ''
    };
  }

  setTemplate = (tempid) => {
    const { images } = this.state;
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
          Object.entries(data.templates[0].data).map((item) => {
            if (
              this.state.data[`${item[0]}`] == "" ||
              this.state.data[`${item[0]}`] == undefined ||
              this.state.data[`${item[0]}`] == null
            ) {
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

          if (data.templates[0].data.line) {
            this.state.extraDescriptions = JSON.parse(
              data.templates[0].data.line
            );
            this.setState({extraDescriptions: this.state.extraDescriptions , count1 : this.state.extraDescriptions.length + 1})
            
          }

          if (data.templates[0].data.others) {
            this.state.otherfromdb = JSON.parse(data.templates[0].data.others);
            this.state.otherfromdb.map((db, i) => {
              this.state.othersstate[i] = db.status;
            });
          }
          this.setState({ tempcheck: true });
        }
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  componentDidMount = () => {
    const tempId = this.props.match.params.id
    this.setState({templateid : tempId})
    Axios.get("/template")
      .then(({ data }) => this.setState({ templates: data.templates }))
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    const { templateid } = this.props.match.params;
    let { templatename, images, cid } = this.state;
    templateid &&
      Axios.get(`/template/${templateid}`)
        .then(({ data }) => {
          if (!data.templates[0].data) {
            data.templates[0].data = {};
            this.state.data["ebay"]["check"] = false;
            this.state.data["poshmark"]["check"] = false;
            this.state.data["mercari"]["check"] = false;
            this.state.data["delist"]["check"] = false;
          } else {
            this.setState({ data: data.templates[0].data });
            this.state.data["ebay"]["title"] =
              data.templates[0].data.ebay.title;
            this.state.data["poshmark"]["title"] =
              data.templates[0].data.poshmark.title;
            this.state.data["mercari"]["title"] =
              data.templates[0].data.mercari.title;
            this.state.data["delist"]["title"] =
              data.templates[0].data.delist.title;
            if (data.templates[0].data.images)
              images.forEach((image) => {
                image.img = data.templates[0].data.images[image.key];
              });
            this.setState({ images });

            if (data.templates[0].data.extraMeasures) {
              this.state.extraMeasures = JSON.parse(
                data.templates[0].data.extraMeasures
              );
              this.state.count = this.state.extraMeasures.length + 1;
            }

            if (data.templates[0].data.others) {
              this.state.otherfromdb = JSON.parse(
                data.templates[0].data.others
              );
              this.state.otherfromdb.map((db, i) => {
                this.state.othersstate[i] = db.status;
              });
            }
          }

          templatename = data.templates[0].name;
          this.setState({ templatename });

          this.setState({ tempcheck: true });
        })
        .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    if (!templateid) {
      this.state.data["ebay"]["check"] = false;
      this.state.data["poshmark"]["check"] = false;
      this.state.data["mercari"]["check"] = false;
      this.state.data["delist"]["check"] = false;
    }

    Axios.get("/password/getstatus").then(({ data }) => {
      this.setState({ Ebay: data.Ebay });
      this.setState({ Poshmark: data.Poshmark });
      this.setState({ Mercari: data.Mercari });
    });

    Axios.get("/password/getstatus/others").then(({ data }) => {
      if (data.length > 0) {
        this.setState({ othersbool: true });
        data.map((d, i) => {
          const others = [...this.state.others];
          others.push(d);
          this.setState({ others });

          const otherss = [...this.state.othersstate];
          otherss.push(false);
          this.setState({ othersstate: otherss });
          //console.log(this.state.othersstate)
        });
      }
    });

    Axios.get("/clientdetails")
      .then(({ data }) => {
        this.setState({ bal: data.balance });
        this.setState({ cid: data._id }, () =>
          localStorage.setItem("cid", this.state.cid)
        );
        // socket.emit("cidinit", { cid: this.state.cid });
        // console.log(this.state.cid);
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    Axios.get("/payment/rates")
      .then((res) => {
        //rates = res.data[res.data.length - 1];
        this.setState({ rates: res.data[res.data.length - 1] });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };
  // setImage = (i) => {
  //   const { images } = this.state;
  //   i.img.map((imgi) => {
  //     if (imgi.cid == localStorage.getItem("cid"))
  //       images[imgi.index].img = imgi.name;
  //   });
  //   this.setState({
  //     images,
  //   });
  // };

  // imgStatusHandler = () => {
  //   const { cid } = this.state;
  //   console.log("called imgStatusHandler");
  //   socket.emit("getuploadstatus", { cid: cid });
  //   socket.on("imgupload", (i) => {
  //     console.log("imgcnt:" + i.imgcnt);
  //     var imglen = this.state.images.filter((i) => {
  //       if (i.img != "") {
  //         return true;
  //       }
  //     });
  //     console.log(imglen.length);
  //     if (i.cid == cid && imglen.length == i.imgcnt) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  // };

  handleChange = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    if (name == "title") {
      data[name] = e.target.value.replace(/[^\w\s]/gi, "");
    } else {
      data[name] = value;
    }
    this.setState({ data });
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

  handleOtherTitles = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["title"] = value;
    this.setState({ data });
  };

  handleDescriptionLabel = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.map((description) => {
      if (description.id == id) {
        description.key = value;
      }
    });
    this.setState({ extraDescriptions });
    console.log(extraDescriptions);
  };

  handleMeasureLabel = (id, e) => {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.map((measure) => {
      if (measure.id == id) {
        measure.label = value;
      }
    });
    this.setState({ extraMeasures });
    console.log(extraMeasures);
  };

  handleDescriptionChange = (id, e) => {
    const { value } = e.target;
    const { extraDescriptions } = this.state;
    extraDescriptions.map((description) => {
      if (description.id == id) {
        description.value = value;
      }
    });
    this.setState({ extraDescriptions });
    console.log(extraDescriptions);
  };

  handleMeasureChange = (id, e) => {
    const { value } = e.target;
    const { extraMeasures } = this.state;
    extraMeasures.map((measure) => {
      if (measure.id == id) {
        measure.val = value;
      }
    });
    this.setState({ extraMeasures });
    console.log(extraMeasures);
  };

  addMeasure = (e) => {
    const { extraMeasures, count } = this.state;
    extraMeasures.push({ label: "", val: "", id: count });
    this.setState({ extraMeasures });
    this.setState({ count: count + 1 });
  };

  addDescription = () => {
    console.log("add description");
    const { extraDescriptions, count1 } = this.state;
    extraDescriptions.push({ key: "", value: "", id: count1 });
    console.log(extraDescriptions);
    this.setState({ extraDescriptions });
    this.setState({ count1: count1 + 1 });
  };

  removeMeasure = (id, e) => {
    const { extraMeasures, count } = this.state;

    this.setState({
      extraMeasures: extraMeasures.filter((measure) => {
        return measure.id != id;
      }),
    });
    this.setState({ count: count - 1 });
  };
  removeDescription = (id, e) => {
    const { extraDescriptions, count1 } = this.state;
    this.setState({
      extraDescriptions: extraDescriptions.filter((description) => {
        return description.id != id;
      }),
    });
  };


  onSubmit = (e) => {
    e.preventDefault();
    const { data, images, extraMeasures, extraDescriptions } = this.state;
    const { templateid } = this.props.match.params;
    const dataform = new FormData();

    if (images[0].img == "" && !templateid) {
      return alert("Atleast First Image is required");
    }

    if (data.condition_name == undefined && !templateid) {
      return alert("Condition is required");
    }

    // if (data.sku == undefined && !templateid) {
    //   return alert("SKU is required");
    // }

    var y = [];
    this.state.others.map((o, i) => {
      let obj = {
        name: o,
        status: this.state.othersstate[i],
        url: "",
      };
      y.push(obj);
    });
    //console.log(y);

    var mplace = true;

    if (
      this.state.Ebay == true ||
      this.state.Poshmark == true ||
      this.state.Mercari == true ||
      this.state.others.length != 0
    ) {
      mplace = true;
    } else {
      if (!templateid) {
        mplace = false;
        return $("#addTemplateModal").modal("show");
      }
      //return alert("Please have marketplace logins atleast")
    }

    var flag = 0;
    this.state.othersstate.forEach((os) => {
      if (os == true) {
        flag = 1;
      }
    });

    if (
      (this.state.Ebay && this.state.data.ebay.check == true) ||
      (this.state.Poshmark && this.state.data.poshmark.check == true) ||
      (this.state.Mercari && this.state.data.mercari.check == true)
    ) {
      if (!templateid) flag = 1;
    }

    if (mplace == true && flag == 0 && !templateid) {
      return alert("Please choose any marketplace to list the product");
    }

    //bal check routine
    var cnt = 0;

    if (this.state.data.ebay.check == true) {
      cnt++;
    }
    if (this.state.data.poshmark.check == true) {
      cnt++;
    }
    if (this.state.data.mercari.check == true) {
      cnt++;
    }
    this.state.othersstate.forEach((os) => {
      if (os == true) {
        cnt++;
        console.log(os);
      }
    });

    var rate1 = 0,
      rate2 = 0,
      rate3 = 0;
    var total = 0;
    rate1 = (this.state.rates.basic / 100) * 1;
    rate2 = (this.state.rates.advance / 100) * (cnt - 1);
    if (this.state.data.delist.check == true) {
      rate3 = (this.state.rates.list / 100) * (cnt - 1);
    }
    total = rate1 + rate2 + rate3;
    console.log(rate1);
    console.log(rate2);
    console.log(rate3);
    console.log(this.state.bal);
    if (this.state.bal - total < 0) {
      return alert("Insufficient balance");
    }
    this.setState({ isSubmitting: true });

    dataform.append("extraMeasures", JSON.stringify(extraMeasures));
    dataform.append("sku", data.sku || "");

    dataform.append("quantity", data.quantity || 1);
    dataform.append("price", data.price || 0);
    dataform.append("brand", data.brand || "");
    dataform.append("model", data.model || "");
    dataform.append("title", data.title);
    dataform.append("shortDescription", data.shortDescription || "");
    dataform.append("notes", data.notes)
    dataform.append("condition_name", data.condition_name);
    dataform.append("ebay", data.ebay.title);
    dataform.append("mercari", data.mercari.title);
    dataform.append("poshmark", data.poshmark.title);
    dataform.append("delist", data.delist.title);
    dataform.append("ebayc", data.ebay.check);
    dataform.append("mercaric", data.mercari.check);
    dataform.append("poshmarkc", data.poshmark.check);
    dataform.append("delistc", data.delist.check);
    dataform.append("colorShade", data.colorShade || "");
    dataform.append("material", data.material || "");
    dataform.append("modelNo", data.modelNo || "");
    dataform.append("size", data.size || "");
    dataform.append("style", data.style || "");
    dataform.append("pattern", data.pattern || "");
    dataform.append("category", data["category"]);
    dataform.append("seasonOrWeather", data.seasonOrWeather || "");
    dataform.append("care", data.care || "");
    dataform.append("inseam", data.inseam || "");
    dataform.append("rise", data.rise || "");
    dataform.append("waist", data.waist || "");
    dataform.append("activity", "advanced");
    dataform.append("bottomDescription", data.bottomDescription || "");
    dataform.append("msrp", data.msrp || 0);
    dataform.append("upc", data.upc || "");
    dataform.append("keywords", data.keywords || "");
    dataform.append("note", data.note || "");
    dataform.append("weightLB", data.weightLB || 0);
    dataform.append("weightOZ", data.weightOZ || 0);
    dataform.append("zipCode", data.zipCode || 0);
    dataform.append("packageLength", data.packageLength || 0);
    dataform.append("packageWidth", data.packageWidth || 0);
    dataform.append("packageHeight", data.packageHeight || 0);
    dataform.append("costOfGoods", data.costOfGoods || 0);
    dataform.append("shippingFees", data.shippingFees || 0);
    dataform.append("profit", data.profit || 0);
    dataform.append("status", true);
    dataform.append("listed", false);
    dataform.append("line", JSON.stringify(extraDescriptions))
    dataform.append("line1", {line1:data.line1,value1:data.value1});
    dataform.append("line2", {line2:data.line2,value2:data.value2});
    dataform.append("line3", {line3:data.line3,value3:data.value3});
    dataform.append("line4", {line4:data.line4,value4:data.value4});
    dataform.append("line6", {line6:data.line6,value6:data.value6});
    dataform.append("line7", {line7:data.line7,value7:data.value7});
    dataform.append("line8", {line8:data.line8,value8:data.value8});
    dataform.append("line5", {line5:data.line5,value5:data.value5});
    dataform.append("madeIn", data.madeIn || "");
    dataform.append("gender", data.gender || "");
    dataform.append("others", JSON.stringify(y));
    dataform.append("rate1", rate1);
    dataform.append("rate2", rate2);
    dataform.append("rate3", rate3);
    var tempimg = [];
    for (let i = 0; i < this.state.imglen; i++) {
      if (
        document
          .getElementById(i)
          .src.substring(0, document.getElementById(i).src.indexOf(":")) ==
          "http" ||
        document
          .getElementById(i)
          .src.substring(0, document.getElementById(i).src.indexOf(":")) ==
          "https"
      ) {
        let obj = {};
        obj[document.getElementById(i).name] = document.getElementById(i).src;
        tempimg.push(obj);
      }
    }
    if (tempimg.length > 0) {
      dataform.append("imgFromSite", JSON.stringify(tempimg));
      console.log(tempimg);
    }

    images.forEach((image) => {
      if (!!image.img) dataform.append(image.key, image.img);
    });

    // var object = {};
    // dataform.forEach(function (value, key) {
    //   object[key] = value;
    // });

    // if (this.imgStatusHandler() && !templateid) {
    //   this.setState({ isSubmitting: false });
    //   return alert("Please Wait! Images are uploading.....");
    // }

    templateid
      ? Axios.put(`/template/${templateid}`, dataform, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            console.log(response)
            window.open("/templates", "_self");
          })
          .catch((err) => {
            this.setState({ isSubmitting: false });
            console.log(err) || alert(JSON.stringify({ err: err }));
          })
      : Axios.post("/product", dataform, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": `${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            window.open("/products", "_self");
          })
          .catch((err) => {
            this.setState({ isSubmitting: true });
            console.log(err) || alert(JSON.stringify({ err: err }));
          });
  };

  handleSubmit = (e) => {
    const { website, username, password, users } = this.state;
    e.preventDefault();
    if (website != "" && username != "" && password != "") {
      this.setState({ loading: true });
      Axios.post("/password", {
        website: website,
        username: username,
        password: password,
      })
        .then((response) => {
          this.setState({ loading: false });
          alert("Login details has been added");
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

          // let user = {
          //   website: website,
          //   username: username,
          //   password: password,
          // };
          // users.push(user);

          // this.setState({ [website]: false });

          // this.setState(
          //   {
          //     users: users,
          //   },
          //   () => {
          //     this.setState({
          //       username: "",
          //       password: "",
          //       website: "",
          //     });
          //   }
          // );
        })
        .catch((err) => {
          this.setState({ isSubmitting: true });
          console.log(err) || alert(JSON.stringify({ err: err }));
        });
    } else {
      alert("Fill up the details");
    }
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
    const { images, cid } = this.state;
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
    // console.log(images);

    // var reader = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload = function () {
    //   //console.log(reader.result);
    //   socket.emit("img", {
    //     key: images[idx].key,
    //     base64: reader.result,
    //     cid: cid,
    //   });
    // };
    // reader.onerror = function (error) {
    //   console.log("Error: ", error);
    // };
  };

  handleBulkUpload = async (e) => {
    const { images, cid } = this.state;
    var imgobj = [];
    const files = e.target.files;
    const count = files.length;
    console.log("bulk image change");
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

    //this.setState({ images }, () => console.log(this.state.images));

    // images.map((i) => {
    //   var reader = new FileReader();
    //   if (i.img != "") {
    //     reader.readAsDataURL(i.img);
    //     reader.onload = function () {
    //       //console.log(reader.result);
    //       imgobj.push({ base64: reader.result, cid: cid, key: i.key });
    //       // setTimeout(() => {
    //       //   socket.emit("img", {
    //       //     key: i.key,
    //       //     base64: reader.result,
    //       //     cid: cid,
    //       //   });
    //       // }, 1000);
    //     };
    //     reader.onerror = function (error) {
    //       console.log("Error: ", error);
    //     };
    //   }
    // });

    // setTimeout(() => {
    //   // var imglen = this.state.images.filter((i) => {
    //   //   if (i.img != "") {
    //   //     return true;
    //   //   }
    //   // });
    //   // if (imgobj.length == imglen.length) {
    //   //   console.log(imgobj);
    //   // let img1 = imgobj.slice(0, 6);
    //   // console.log(img1);
    //   // let img2 = imgobj.slice(6, 12);
    //   // console.log(img2);
    //   //if (img1 != null) {
    //   socket.emit("bimg", {
    //     bimg: imgobj,
    //     cid: cid,
    //   });
    //   //}

    //   // setTimeout(() => {
    //   //   if (img2 != null) {
    //   //     socket.emit("bimg2", {
    //   //       bimg: img2,
    //   //       cid: cid,
    //   //     });
    //   //   }
    //   // }, 5000);
    //   //}
    // }, 2000);
  };

  removeImg = (idx) => {
    const { images } = this.state;
    images[idx].img = "";
    this.setState({ images });
  };

  exthandle = (e) => {
    const { images, imglen } = this.state;
    console.log("detected");
    images.forEach((i, idx) => {
      if (e.target.value > idx) i.img = "true";
    });
    this.setState({
      imglen: e.target.value,
    });
    this.setState({
      images,
    });

    //console.log(document.getElementsByTagName("img"));
  };
  setCategory = (str) => {
    const { data } = this.state;
    data["category"] = str;
    this.setState({ data });
  };

    handleDelete = async () => {
     const id = this.props.match.params.templateid
     
     Axios.delete(`/template/${id}`, {
      headers: {
        "x-access-token": `${localStorage.getItem("token")}`,
      },
    }) 
    .then((response) => {
      window.open("/templates", "_self");
    })
    .catch((err) => {
      console.log(err) || alert(JSON.stringify({ err: err }));
    });

  }
  handleUrl = (e) => {
    const { name, value } = e.target;
    const { data } = this.state;
    data[name]["url"] = value;
    this.setState({ data });
  };
  render = () => {
    const {
      website,
      username,
      password,
      users,
      otherssignal,

      data,
      images,
      isSubmitting,
      templates,
      extraMeasures,
      Ebay,
      Poshmark,
      Mercari,
      templatename,
      othersbool,
      others,
      othersstate,
      tempcheck,
      cid,
    } = this.state;
    const { templateid } = this.props.match.params;
    return (
      <div className="container-fluid px-3 template">
        {templateid ? (
          <Link to="/templates">
            <i className="fa fa-arrow-left mt-3" aria-hidden="true"></i>
          </Link>
        ) : (
          <Link to="/products">
            <i className="fa fa-arrow-left mt-3" aria-hidden="true"></i>
          </Link>
        )}
        <h2 className="text-dark d-flex justify-content-lg-center pb-4">
          Create or Edit: {templatename}
        </h2>
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
                      crosslist to
                    </h6>
                    <select
                      className="form-control body-text"
                      name="website"
                      value={website}
                      onChange={this.handleChangepop}
                    >
                      <option>Select Site</option>
                      {Ebay ? null : <option defaultValue="Ebay">Ebay</option>}
                      {Poshmark ? null : (
                        <option defaultValue="Poshmark">Poshmark</option>
                      )}
                      {Mercari ? null : (
                        <option defaultValue="Mercari">Mercari</option>
                      )}
                      <option defaultValue="other">Others</option>
                    </select>
                    <br />
                    {otherssignal ? (
                      <>
                        <input
                          type="text"
                          placeholder="Website"
                          className="form-control mt-3"
                          name="website"
                          defaultValue=""
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
                      <h6>
                        You can always add more logins under setting in the
                        future
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 pr-4">
            <div className="dropdown">
              <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
              >
                Choose Template
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                {templates && templates.length != 0 ? (
                  templates.map((template) => {
                    return (
                      <li>
                        <button
                          className="btn colorIt"
                          style={{ width: "100%", textAlign: "left" }}
                          id="dropdownMenuOffset"
                          onClick={() => this.setTemplate(template._id)}
                        >
                          {template.name}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li>No Templates created</li>
                )}
              </ul>
            </div>
            <LeftSection
              data={data}
              images={images}
              Ebay={Ebay}
              Poshmark={Poshmark}
              Mercari={Mercari}
              othersbool={othersbool}
              others={others}
              othersstate={othersstate}
              cid={cid}
              isSubmitting={isSubmitting}
              toggleSelectedOthersWebsite={this.toggleSelectedOthersWebsite}
              handleChange={this.handleChange}
              removeImg={this.removeImg}
              extraMeasures={extraMeasures}
              addMeasure={this.addMeasure}
              removeMeasure={this.removeMeasure}
              handleMeasureChange={this.handleMeasureChange}
              handleMeasureLabel={this.handleMeasureLabel}
              handleBulkUpload={this.handleBulkUpload}
              handleImageChange={this.handleImageChange}
              handleOtherTitles={this.handleOtherTitles}
              toggleSelectedWebsite={this.toggleSelectedWebsite}
              exthandle={this.exthandle}
              setImage={this.setImage}
              setCategory={this.setCategory}
            />
          </div>
          <div className="col-12 col-lg-6 pl-lg-3">
            <RightSection
              data={data}
              toggleSelectedWebsite={this.toggleSelectedWebsite}
              handleChange={this.handleChange}
              templatename={templatename}
              tempcheck={tempcheck}
              images={images}
              removeImg={this.removeImg}
              extraMeasures={extraMeasures}
              extraDescriptions={this.state.extraDescriptions}
              addMeasure={this.addMeasure}
              addDescription={this.addDescription}
              handleMeasureChange={this.handleMeasureChange}
              handleDescriptionChange={this.handleDescriptionChange}
              handleMeasureLabel={this.handleMeasureLabel}
              handleBulkUpload={this.handleBulkUpload}
              handleDescriptionLabel={this.handleDescriptionLabel}
              handleImageChange={this.handleImageChange}
              handleOtherTitles={this.handleOtherTitles}
              removeDescription={this.removeDescription}
              templateid = {this.state.templateid}
              handleUrl = {this.handleUrl}
              
            />
          </div>
        </div>
        <div className="row d-lg-flex justify-content-lg-center">
          <div className="col-12 col-lg-3 mt-2">
            {isSubmitting ? (
              <button
                className="btn btn-success mb-4 btn-block col-12 mr-auto col-lg-12"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                />
                {templateid ? "Saving..." : "Submitting..."}
              </button>
            ) : (
              <button
                className="btn btn-success mb-4 btn-block col-12 mr-auto col-lg-12"
                onClick={this.onSubmit}
              >
                {templateid ? "Save" : "Submit"}
              </button>
            )}
          </div>
          <div className="col-12 col-lg-3 mt-2">
            <input
              type="button"
              defaultValue="Cancel"
              onClick={() => window.open("/products", "_self")}
              className="btn btn-danger mb-4 btn-block col-12 mr-auto col-lg-12"
            />
          </div>
          {templateid ? <button
                className="btn btn-danger mb-4 btn-block col-3 mr-auto"
                onClick={this.handleDelete}
              >Delete</button>: ""}

        </div>
      </div>
    );
  };
}
