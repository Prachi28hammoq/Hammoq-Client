import { Component } from "react";
import "./Images.css";

const $ = window.$;
let assetsThumbnailURL;
let assetsURL;
let Axios;

const styles = {
  inputFile: {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    opacity: 0
  },
};

class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalImage: "",
      imageIndex: 0
    };
    this.handleImageModal = this.handleImageModal.bind(this);
  }

  componentDidMount() {
    Axios = this.props.Axios;
  }

  handleImageModal = (idx) => {
    if (idx >= 0 && idx < this.props.images.length && this.props.images[idx].img !== null) 
    {
      let image = this.props.images[idx];
      this.setState({imageIndex: idx, fullimg: typeof image.img === "string" ? image.img.substrCPing(0, 4) !== "http" && image.img.substrCPing(0, 5) !== "https"
                                               ? assetsURL + image.img : image.img : image.img !== null
                                               ? URL.createObjectURL(image.img) : ""}, () => {$("#addTemplateModal1").modal("show")});
    }
  };

  render = () => {
    const {
      data,
      handleChange,
      images,
      handleBulkUpload,
      handleImageChange,
      removeImg,
      extraDescriptions,
      nanoid,
      assetsURL,
      assetsThumbnailURL,
      Axios,
      imgThumbnailAssets,
      imgAssets,
      imgObjectURL
    } = this.props;

    return(
      <>
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
                            name={idx}
                            id={image.key}
                            src={image.URL}
                            onError={(e) => {
                              if(imgThumbnailAssets[image.key] && imgThumbnailAssets[image.key] !== "" && !imgThumbnailAssets[image.key]['passed']) 
                              {
                                e.target.src = imgThumbnailAssets[image.key];
                                image.URL = imgThumbnailAssets[image.key];
                                imgThumbnailAssets[image.key] = "";
                                e.target.onerror = null;
                              }
                              else if(imgAssets[image.key] && imgAssets[image.key] !== "" && !imgAssets[image.key]['passed'])
                              {
                                e.target.src = imgAssets[image.key];
                                image.URL = imgAssets[image.key];
                                imgAssets[image.key] = "";
                                e.target.onerror = null;
                              }
                              else if(image.img !== null || image.img !== undefined)
                              {
                                e.target.src = image.URL;
                              }
                              e.target.onerror = null;
                              console.log(image);
                            }}
                            style={{ width: "90px", height: "90px" }}
                            alt="+"
                            onClick={() => {this.setState({fullimg: imgAssets[image.key]}, () => {$("#addTemplateModal1").modal("show")})}}
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
                          style={{width: "90px", height: "90px", margin: "0px!important"}}
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
         </>
        );
      }
}
export default Images;