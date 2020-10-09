import React, { Component } from "react";
import Popover from '@material-ui/core/Popover';
import "./searchcartmin.css";
import Search from "../utils/Search";
import Comment from './Comment'
import Axios, { assetsURL } from "../../services/Axios";
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import LoadingSpinner from "../utils/loader";
import Pagination from "../../Components/pagination/Pagination";
Axios.defaults.headers["x-access-token"] = localStorage.getItem("token");


const $ = window.$;

class Searchcart extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      rates: {},
      search: "",
      searchedProducts: [],
      bal: 0,
      Ebay: false,
      Poshmark: false,
      Mercari: false,
      othersbool: false,
      others: [],
      othersstate: [],
      loading: false,
      datesort: false,
      counter: 2,
      page: 1,
      rowsPerPage: 10,
      clientdetails: [],
      totalPage: "",
      filteredProducts: [],
      message : '',
      pop_open: false,
      inventoryCount : '',
      draftCount : '',
      submittedCount : '',
      prodStatus:'submitted'
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    await Axios.get("/payment/rates")
      .then((res) => {
      
        //rates = res.data[res.data.length - 1];
        this.setState({ rates: res.data[res.data.length - 1] });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    
      Axios.get(`/product/type/${this.state.prodStatus}`, { params: { page: 1, size: 10 } })
      .then(({ data }) => {
        console.log(data, 'data user')
        if(data.err){
          window.alert('No product, Please add few...')
          window.open("/basic", "_self");
        }else{
          this.setState({
            products: data.data.filter((status) => status.status != false),
            totalPage: parseInt(data.pages),
            page: parseInt(data.currPage),
            inventoryCount : data.count.inventoryCount,
            draftCount : data.count.draftCount,
            submittedCount : data.count.submittedCount 
          });
        }
      this.setState({ loading: false });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    await Axios.get("/clientdetails")
      .then(({ data }) => {
        
        this.setState({ bal: data.balance, clientdetails: data });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));

    await Axios.get("/password/getstatus").then(({ data }) => {
      
      this.setState({ Ebay: data.Ebay });
      this.setState({ Poshmark: data.Poshmark });
      this.setState({ Mercari: data.Mercari });
    });

    await Axios.get("/password/getstatus/others").then(({ data }) => {
     
      if (data.length > 0) {
        this.setState({ othersbool: true });
        data.map((d, i) => {
          const others = [...this.state.others];
          others.push(d);
          this.setState({ others });

          const otherss = [...this.state.othersstate];
          otherss.push(false);
          this.setState({ othersstate: otherss });
          
        });
      }
    });
  };

  duplicateHandler = async (itemId) => {
    const tokenvalue = localStorage.getItem("token");

    try {
      const response = await Axios.post(
        `/product/${itemId}`,
        (Axios.defaults.headers.common["x-access-token"] = tokenvalue),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      this.setState({ products: response.data.products });
      // this.setState({
      //   products: this.state.products.filter((filtered) => {
      //     return filtered.status == true;
      //   }),
      // });
    } catch (error) {
      console.log(error);
    }
  };

  handleSearchChange = (e) => {
    const { value } = e.target;
    const { products } = this.state;
    this.setState(
      { searchedProducts: Search(products, value), search: value },
      () =>
        this.setState({
          searchedProducts: this.state.searchedProducts.filter((filtered) => {
            return filtered.status == true;
          }),
        })
    );
  };

  handleInventory = async () => {
     await Axios.get(`/product/type/inventory`, { params: { page: 1, size: 10 } })
    .then(({ data }) => {
     
      this.setState({
        prodStatus:'inventory',
        products: data.data,
        totalPage: parseInt(data.pages),
        page: parseInt(data.currPage),
      });
      // if (this.state.products != null) {
      //   this.setState({
      //     products: this.state.products.filter((filtered) => {
      //       return filtered.status == true;
      //     }),
      //   });
      // }

      this.setState({ loading: false });
    })
    .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  }  

  handleDrafts = async () => {
    await Axios.get(`/product/type/draft`, { params: { page: 1, size: 10 } })
    .then(({ data }) => {
      
      this.setState({
        prodStatus:'draft',
        products: data.data,
        totalPage: parseInt(data.pages),
        page: parseInt(data.currPage),
      });
      // if (this.state.products != null) {
      //   this.setState({
      //     products: this.state.products.filter((filtered) => {
      //       return filtered.status == true;
      //     }),
      //   });
      // }

      this.setState({ loading: false });
    })
    .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  handleSubmitted = async () => {
    await Axios.get(`/product/type/submitted`, { params: { page: 1, size: 10 } })
    .then(({ data }) => {
      
      this.setState({
        prodStatus:'submitted',
        products: data.data,
        totalPage: parseInt(data.pages),
        page: parseInt(data.currPage),
      });
      // if (this.state.products != null) {
      //   this.setState({
      //     products: this.state.products.filter((filtered) => {
      //       return filtered.status == true;
      //     }),
      //   });
      // }

      this.setState({ loading: false });
    })
    .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  handleDelete = async (itemId) => {
    window.alert('Are You Sure')
    const data = {
      status: false,
    };
    try {
      const response = await Axios.put(`/product/status/${itemId}`, data, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });
      this.setState({ products: response.data.products });
      this.setState({
        products: this.state.products.filter((filtered) => {
          return filtered.status == true;
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };


  handleChangePage = async (newPage) => {
    if (newPage > 0 && newPage <= this.state.totalPage) {
      this.setState({ page: newPage });
      await Axios.get(`/product/type/${this.state.prodStatus}`, {
        params: { page: newPage, size: this.state.rowsPerPage },
      })
        .then(({ data }) => {
          this.setState({ products: data.data });
          // if (this.state.products != null) {
          //   this.setState({
          //     products: this.state.products.filter((filtered) => {
          //       return filtered.status == true;
          //     }),
          //   });
          // }

          this.setState({ loading: false });
        })
        .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    }
  };

  handleChangeRowsPerPage = async (val) => {
    await Axios.get(`/product/type/${this.state.prodStatus}`, {
      params: { page: this.state.page, size: val },
    })
      .then(({ data }) => {
       console.log(data.data);
        this.setState({
          products: data.data,
          rowsPerPage: val,
          totalPage: data.pages,
        });
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  handleMessageAlert = (e) => {
    e.preventDefault();
    this.setState({
        pop_open: !this.state.pop_open,
        anchorEl: e.currentTarget,
    });

  }

  handleRequestClose() {
    this.setState({
        pop_open: false,
    });
};
  render() {
    const {comment, addComment} = this.props
   // console.log(this.state.products, "products");
 
    const {
      products,
      rates,
      searchedProducts,
      search,
      bal,
      Ebay,
      Poshmark,
      Mercari,
      othersbool,
      others,
      othersstate,
      datesort,
      counter,
      rowsPerPage,
      page,
      clientdetails,
      totalPage,
      filteredProducts
    } = this.state;
    const newproducts =
      searchedProducts.length > 0 || search.length > 0
        ? searchedProducts
        : filteredProducts.length
        ? filteredProducts
        : products;

    return (
      <div>
      <div className="cartIt" style = {{minHeight : "75vh"}}>
        <div className="row">
          <div className="col-6 d-flex">
            <input
              type="text"
              id="searcheverything"
              className="form-control col-12 ml-2"
              value={search}
              onChange={this.handleSearchChange}
              placeholder="Search"
            />
          </div>
        </div>
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
                  Rates for listing are -
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
              <div className="col">
                <br />
                First site Listing: ${rates.basic / 100}
                <br /> <br />
                Other site Listing: ${rates.advance / 100} <br /> <br />
                Delisting Listing: ${rates.list / 100} <br /> <br />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* <h5 className="ml-4 mt-2">Balance: $ {bal.toFixed(2)}</h5> */}
          <div
            className="btn btn-secondary d-flex col-2 col-lg-1 ml-auto justify-content-center mr-4 mb-2"
            style={{ position: "absolute", top: "75px", right: "0px" }}
            onClick={() => $("#addTemplateModal").modal("show")}
          >
            Rates
          </div>
        </div>
        {/* <div className="row">
        
          <div
            className=" d-flex  ml-auto justify-content-center mr-4 mb-2"
            style={{ position: "absolute", top: "85px", right: "135px" }}
          >
            Unlisted products :{" "}
            {clientdetails.noOfProducts - clientdetails.noOfListings > 0 ? clientdetails.noOfProducts - clientdetails.noOfListings : 0} , Listed
            products: {clientdetails.noOfListings}
          </div>
        </div> */}
        <div className="product__info">
          {/* <div>
            <button type="text" onClick = {this.handleMessageAlert} className="btn btn-primary d-incline mr-4 mb-3" >Message</button>
            <Popover
              open={this.state.pop_open}
              anchorEl={this.state.anchorEl}
              onRequestClose={this.handleRequestClose}
              anchorOrigin={{
              vertical: "top",
              horizontal: "left",
              }}
              transformOrigin={{
              vertical: "top",
              horizontal: "left",
              }}
            ></Popover> 
            <Popover
              id={chatid}
               open={open}
              anchorEl={anchorEl}
              onClose={this.commentClose}
              anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
              }}
              transformOrigin={{
              vertical: "top",
              horizontal: "center",
                }}
                />

            <Message addComment={this.addComment} comment={comment} />
          </div> */}

          <div style={{ justifyContent: "space-evenly" }}>
            <button
              className="btn btn-primary d-inline mr-3 mb-3"
              onClick={() => {
                this.handleInventory()
              }}
            >
              {this.state.inventoryCount}-Inventory
            </button>
            <button
              className="btn btn-primary d-inline mr-3 mb-3"
              onClick={() => {
                this.handleDrafts();
              }}
            >
              {this.state.draftCount}-Drafts
            </button>
            <button
              className="btn btn-primary d-inline mr-3 mb-3"
              onClick={() => {
                this.handleSubmitted();
              }}
            >
            {this.state.submittedCount} -Submitted
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="imageIt">
                No
              </th>
              <th scope="col" className="imageIt">
                Photos
              </th>
              <th scope="col" className="title">
                TITLE
              </th>
              <th scope="col" className="sku">
                SKU
              </th>
              <th scope="col" className="price">
                PRICE
              </th>
              <th scope="col" className="status">
                STATUS
              </th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col" className="date">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    this.setState({ datesort: !datesort });
                  }}
                >
                  <i class="fa fa-sort" aria-hidden="true"></i>
                  <b>DATE</b>
                </button>
              </th>
              <th scope="col" className="notes">
                NOTES
              </th>
            </tr>
          </thead>
          <tbody>
            {datesort ? (
              <>
                {newproducts && newproducts.length > 0 ? (
                  newproducts.reverse().map((product, idx) => {
                    return (
                      <tr>
                        <td>{idx + 1 + (page - 1) * rowsPerPage}</td>
                        <td>
                          <img
                            src={
                              product.images.default_image.substring(
                                0,
                                product.images.default_image.indexOf(":")
                              ) != "http" &&
                              product.images.default_image.substring(
                                0,
                                product.images.default_image.indexOf(":")
                              ) != "https"
                                ? assetsURL + product.images.default_image
                                : product.images.default_image
                            }
                            className="product-img"
                            alt="prod"
                          />
                        </td>
                        <td>
                          {product.title
                            ? product.title
                            : product.brand + " " + product.model}
                        </td>
                        <td>{product.sku}</td>
                        <td>
                          <div>{product.price}</div>
                        </td>
                        <td>
                          {product.ebay.check && Ebay ? (
                            <div>
                              <small>
                                {product.ebay.url == "" ||
                                product.ebay.url == null ? (
                                  <p className="text-danger">Ebay</p>
                                ) : product.ebay.url == "d" ? (
                                  "Ebay"
                                ) : (
                                  <a href={product.ebay.url} target="_blank">
                                    Ebay
                                  </a>
                                )}
                              </small>
                            </div>
                          ) : null}
                          {product.poshmark.check && Poshmark ? (
                            <div>
                              <small>
                                {product.poshmark.url == "" ||
                                product.poshmark.url == null ? (
                                  <p className="text-danger">Poshmark</p>
                                ) : product.poshmark.url == "d" ? (
                                  "Poshmark"
                                ) : (
                                  <a
                                    href={product.poshmark.url}
                                    target="_blank"
                                  >
                                    Poshmark
                                  </a>
                                )}
                              </small>
                            </div>
                          ) : null}
                          {product.mercari.check && Mercari ? (
                            <div>
                              <small>
                                {product.mercari.url == "" ||
                                product.mercari.url == null ? (
                                  <p className="text-danger">Mercari</p>
                                ) : product.mercari.url == "d" ? (
                                  "Mercari"
                                ) : (
                                  <a href={product.mercari.url} target="_blank">
                                    Mercari
                                  </a>
                                )}
                              </small>
                            </div>
                          ) : null}
                          {product.delist.check ? (
                            <div>
                              <small>
                                Delist -
                                {product.delist.url == "" ? "false" : "true"}
                              </small>
                            </div>
                          ) : null}
                          {othersbool &&
                            product.others &&
                            JSON.parse(product.others).map((items) => {
                              if (items.status) {
                                return (
                                  <div>
                                    <small>
                                      {items.name}-
                                      {items.url == "" ? "false" : "true"}
                                    </small>
                                  </div>
                                );
                              }
                            })}
                        </td>
                        <td>
                          <a href={`/edit/${product._id}`}>
                            <button className="btn btn-primary d-inline btn-sm">
                              Edit/List
                            </button>
                          </a>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary d-inline btn-sm"
                            onClick={() => this.duplicateHandler(product._id)}
                          >
                            Duplicate
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger d-inline btn-sm"
                            onClick={() => this.handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          <small>{product.date.split("T")[0]}</small>
                        </td>
                        <td>
                          <small>{product.note}</small>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <h4>
                      No products submitted for listings, please submit some
                    </h4>
                    {this.state.loading ? (
                      <div className="center">
                        <LoadingSpinner asOverlay />
                      </div>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <>
                {newproducts && newproducts.length > 0 ? (
                  newproducts.map((product, idx) => {
                    return (
                      <tr>
                        <td>{idx + 1 + (page - 1) * rowsPerPage}</td>
                        <td>
                          <img
                            src={
                              product.images.default_image != null &&
                              product.images.default_image.substring(
                                0,
                                product.images.default_image.indexOf(":")
                              ) != "http" &&
                              product.images.default_image.substring(
                                0,
                                product.images.default_image.indexOf(":")
                              ) != "https"
                                ? assetsURL + product.images.default_image
                                : product.images.default_image
                            }
                            className="product-img"
                            alt="prod"
                          />
                        </td>
                        <td>
                          {product.title
                            ? product.title
                            : product.brand + " " + product.model}
                        </td>
                        <td>{product.sku}</td>
                        <td>
                          <div>{product.price}</div>
                        </td>
                        <td>
                          {product.ebay.check && Ebay ? (
                            <div>
                              <small>
                                {product.ebay.url == "" ||
                                product.ebay.url == null ? (
                                  <p className="text-danger">Ebay</p>
                                ) : product.ebay.url == "d" ? (
                                  "Ebay"
                                ) : (
                                  <a href={product.ebay.url} target="_blank">
                                    Ebay
                                  </a>
                                )}
                              </small>
                            </div>
                          ) : null}
                          {product.poshmark.check && Poshmark ? (
                            <div>
                              <small>
                                {product.poshmark.url == "" ||
                                product.poshmark.url == null ? (
                                  <p className="text-danger">Poshmark</p>
                                ) : product.poshmark.url == "d" ? (
                                  "Poshmark"
                                ) : (
                                  <a
                                    href={product.poshmark.url}
                                    target="_blank"
                                  >
                                    Poshmark
                                  </a>
                                )}
                              </small>
                            </div>
                          ) : null}
                          {product.mercari.check && Mercari ? (
                            <div>
                              <small>
                                {product.mercari.url == "" ||
                                product.mercari.url == null ? (
                                  <p className="text-danger">Mercari</p>
                                ) : product.mercari.url == "d" ? (
                                  "Mercari"
                                ) : (
                                  <a href={product.mercari.url} target="_blank">
                                    Mercari
                                  </a>
                                )}
                              </small>
                            </div>
                          ) : null}
                          {product.delist.check ? (
                            <div>
                              <small>
                                Delist -
                                {product.delist.url == "" ? "false" : "true"}
                              </small>
                            </div>
                          ) : null}
                          {othersbool &&
                            product.others &&
                            JSON.parse(product.others).map((items) => {
                              if (items.status) {
                                return (
                                  <div>
                                    <small>
                                      {items.name}-
                                      {items.url == "" ? "false" : "true"}
                                    </small>
                                  </div>
                                );
                              }
                            })}
                        </td>
                        <td>
                          <a href={`/edit/${product._id}`}>
                            <button className="btn btn-primary d-inline btn-sm">
                              Edit/List
                            </button>
                          </a>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary d-inline btn-sm"
                            onClick={() => this.duplicateHandler(product._id)}
                          >
                            Duplicate
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger d-inline btn-sm"
                            onClick={() => this.handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          <small>{product.date.split("T")[0]}</small>
                        </td>
                        <td>
                          <small>{product.note}</small>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <h4>
                      No products submitted for listings, please submit some
                    </h4>
                    {this.state.loading ? (
                      <div className="center">
                        <LoadingSpinner asOverlay />
                      </div>
                    ) : null}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
        <div className="w-100 mx-auto py-2">
          <Pagination
            curPage={page}
            totalPage={totalPage}
            rowPerPage={rowsPerPage}
            onRowNumberChange={this.handleChangeRowsPerPage}
            previous={this.handleChangePage}
            next={this.handleChangePage}
          />
        </div>
        </div>
      
      
    );
  }
}
export default Searchcart;
