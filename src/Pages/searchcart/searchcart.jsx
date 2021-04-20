import React, { Component } from "react";
import "./searchcartmin.css";
import Search from "../utils/Search";
import Axios, { assetsURL } from "../../services/Axios";
import LoadingSpinner from "../utils/loader";
import Pagination from "../../Components/pagination/Pagination";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import { nanoid } from "nanoid";

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
      pop_open: false,
      inventoryCount: 0,
      draftCount: 0,
      submittedCount: 0,
      prodStatus: "",
    };
  }

  componentDidMount = () => {
    const prodStatus = this.props.match.params.prodStatus;
    this.setState({ prodStatus: this.props.match.params.prodStatus });
    this.setState({ loading: true });
    Axios.get("/payment/rates")
      .then((res) => {this.setState({ rates: res.data[res.data.length-1] });})
      .catch((error) => {console.log(error)});

    Axios.get(`/product/type/${prodStatus}`, { params: { page: 1, size: 10 } })
         .then(({ data }) => {this.setState({products: data.data.filter((status) => status.status !== false),
                                             totalPage: parseInt(data.pages),
                                             page: parseInt(data.currPage),
                                             inventoryCount: data.count.inventoryCount,
                                             draftCount: data.count.draftCount,
                                             submittedCount: data.count.submittedCount                                        
                                            });
                              if(!data.data || (data.count.inventoryCount === 0 && data.count.draftCount === 0 && data.count.submittedCount === 0))
                              {
                                window.open("No Products, Please Add One....");
                                window.open("/basic", "_self");
                              }

          this.setState({ loading: false });
      })
      .catch((error) => {
          console.log(error);
        });

    Axios.get("/clientdetails")
      .then(({ data }) => {this.setState({ bal: data.balance, clientdetails: data });})
      .catch((error) => {console.log(error)});

    Axios.get("/password/getstatus").then(({ data }) => {
      this.setState({ Ebay: data.Ebay });
      this.setState({ Poshmark: data.Poshmark });
      this.setState({ Mercari: data.Mercari });
    })
    .catch((error) => {console.log(error)});

    Axios.get("/password/getstatus/others")
         .then(({ data }) => {
      if (data.length > 0) {
        this.setState({ othersbool: true });
        data.forEach((d, i) => {
          const others = [...this.state.others];
          others.push(d);
          this.setState({ others });
          const otherss = [...this.state.othersstate];
          otherss.push(false);
          this.setState({ othersstate: otherss });
        });
      }
    })
    .catch((error) => {console.log(error)});
  };


  duplicateHandler = async (itemId) => {
    await Axios.post(`/product/${itemId}`, {headers: {"x-access-token": localStorage.getItem("token"),"content-type": "application/x-www-form-urlencoded",},})
               .catch((error) => {console.log(error)});

    const response1 = await Axios.get(`/product/type/${this.state.prodStatus}`,{params: {page: 1, size: 10}})
                                  .catch((error) => {console.log(error)});

    this.setState({products: response1.data.data,});
    window.alert("Duplicate has been created.");
    window.location.reload();
  };

  handleSearchChange = (e) => {
    const { value } = e.target;
    const { products } = this.state;
    this.setState({ searchedProducts: Search(products, value), search: value }, () => this.setState({searchedProducts: this.state.searchedProducts.filter((filtered) => {return filtered.status === true;}),}));
  };


  handleDelete = async (itemId) => {
    window.confirm("Are You Sure?");
    const data = {status: false,};

    try {
      const response = await Axios.put(`/product/status/${itemId}`, data, {headers: {"Content-Type": "application/json", "x-access-token": localStorage.getItem("token"),},})
                                  .catch((error) => {console.log(error)});;

      this.setState({ products: response.data.products });
      window.location.reload()
    } 
    catch (error) 
    {
      console.log(error);
    }
  };

  handleChangePage = async (newPage) => {
    if (newPage > 0 && newPage <= this.state.totalPage) {
      this.setState({ page: newPage });
      await Axios.get(`/product/type/${this.state.prodStatus}`, {params: { page: newPage, size: this.state.rowsPerPage },}).then(({ data }) => {
          if (data) this.setState({ products: data.data.filter((status) => status.status !== false),loading: false });
        })
        .catch((error) => {console.log(error)});
    }
  };

  handleChangeRowsPerPage = async (val) => {
    await Axios.get(`/product/type/${this.state.prodStatus}`, {params: { page: this.state.page, size: val },})
               .then(({ data }) => {
        this.setState({products: data.data.filter((status) => status.status !== false), rowsPerPage: val, totalPage: data.pages,});
      })
      .catch((error) => {console.log(error)});
  };

  handleRequestClose() {
    this.setState({pop_open: false,});
  }

  datesort = () =>
  {
    let { products, searchedProducts, filteredProducts } = this.state;
    if(products.length > 0) products = products.reverse().map((product, idx) => {return product});
    if(searchedProducts.length > 0) searchedProducts = searchedProducts.reverse().map((product, idx) => {return product});
    if(filteredProducts.length > 0) filteredProducts = filteredProducts.reverse().map((product, idx) => {return product});
    this.setState({products, searchedProducts, filteredProducts});
  }

  render() {
    const {
      products,
      rates,
      searchedProducts,
      search,
      Ebay,
      Poshmark,
      Mercari,
      othersbool,
      datesort,
      rowsPerPage,
      page,
      totalPage,
      filteredProducts
    } = this.state;
    const newproducts = searchedProducts.length > 0 || search.length > 0 ? searchedProducts : filteredProducts.length ? filteredProducts : products;
    return (
      <div>
        <div className="cartIt" style={{ minHeight: "75vh" }}>
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
            <div
              className="btn btn-secondary d-flex col-2 col-lg-1 ml-auto justify-content-center mr-4 mb-2"
              style={{ position: "absolute", top: "75px", right: "0px" }}
              onClick={() => $("#addTemplateModal").modal("show")}
            >
              Rates
            </div>
          </div>
          <div className="product__info">

            <div style={{ justifyContent: "space-evenly" }}>
              <button
                type="button"
                className="btn btn-primary d-inline mr-3 mb-3"
                onClick={() => {this.props.history.push("/products/inventory"); window.location.reload();}}
              >
                {this.state.inventoryCount} - Inventory
              </button>
              <button
                className="btn btn-primary d-inline mr-3 mb-3"
                onClick={() => {this.props.history.push("/products/draft"); window.location.reload();}}
              >
                {this.state.draftCount} - Drafts
              </button>
              <button
                className="btn btn-primary d-inline mr-3 mb-3"
                onClick={() => {this.props.history.push("/products/submitted"); window.location.reload();}}
              >
                {this.state.submittedCount} - Submitted
              </button>
            </div>
          </div>
          {!this.state.loading ? 
            (
          <React.Fragment key={nanoid(4)}>
          <table className="table">
          <thead>
          <tr>
          <th scope="col" className="imageIt">No</th>
          <th scope="col" className="imageIt">Photos</th>
          <th scope="col" className="title">TITLE</th>
          <th scope="col" className="sku">SKU</th>
          <th scope="col" className="price">PRICE</th>
          <th scope="col" className="status">STATUS</th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col" className="date"><button className="btn btn-sm" onClick={() => {this.datesort()}}><i className="fa fa-sort" aria-hidden="true"></i><b>DATE</b></button></th>
          <th scope="col" className="notes">NOTES</th>
          </tr>
          </thead>
          <tbody>            
            {(newproducts && newproducts.length > 0) ? (newproducts.map((product, idx) => {
             return(
             <React.Fragment key={nanoid(4)}>
             <tr>
               <td>{idx + 1 + (page - 1) * rowsPerPage}</td>
               <td>
                <img
                  src={product.images.default_image ?
                       (product.images.default_image.substring(0, product.images.default_image.indexOf(":")) !== "http" && 
                       product.images.default_image.substring(0, product.images.default_image.indexOf(":")) !== "https" ? 
                       assetsURL + product.images.default_image : product.images.default_image) : ("")}
                  className="product-img"
                  alt="Default Image Missing"
                />
                </td>
                <td>
                  {product.title ? product.title : product.brand + " " + product.model}
                </td>
                <td>{product.sku}</td>
                <td>
                  <div>{product.price}</div>
                </td>
                <td>
                  {product.ebay.check && Ebay ? (<div><small>{product.ebay.url === "" || product.ebay.url === null ? (<p className="text-danger">Ebay</p>) : product.ebay.url === "d" ? ("Ebay") : (<a href={product.ebay.url} target="_blank" rel="noreferrer">Ebay</a>)}</small></div>
                  ) : null}
                  {product.poshmark.check && Poshmark ? (<div><small>{product.poshmark.url === "" || product.poshmark.url === null ? (<p className="text-danger">Poshmark</p>) : product.poshmark.url === "d" ? ("Poshmark") : (<a href={product.poshmark.url} target="_blank" rel="noreferrer"> Poshmark </a>)}</small></div>
                  ) : null}
                  {product.mercari.check && Mercari ? (<div><small>{product.mercari.url === "" || product.mercari.url === null ? (<p className="text-danger">Mercari</p>) : product.mercari.url === "d" ? ("Mercari") : ( <a href={product.mercari.url} target="_blank" rel="noreferrer"> Mercari </a>)}</small></div>
                  ) : null}
                  {product.delist.check ? (<div><small> Delist - {product.delist.url === "" ? "false" : "true"}</small></div>
                  ) : null}
                  {(othersbool && product.others) && JSON.parse(product.others).forEach((items) => {if (items.status) {return (<div><small>{items.name} - {items.url === "" ? "false" : "true"}</small></div>);}})}
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
              </React.Fragment>
                  );})
              ) : (<React.Fragment key={nanoid(4)}>
                   <tr><td style={{'display': 'block', 'fontSize': '1em', 'marginTop': '1.33em', 'marginBottom': '1.33em', 'marginLeft': '0', 'marginRight': '0', 'fontWeight': 'bold'}}>No products submitted for listings, please submit some</td></tr>
                   </React.Fragment>
                  )}
        </tbody>
        </table>
        </React.Fragment>
        ) : (<div className="center"><LoadingSpinner asOverlay /></div>)
        }
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
