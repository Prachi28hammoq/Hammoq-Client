import React, { Component } from "react";
import "font-awesome/css/font-awesome.min.css";
import "./Template.css";
import { Link } from "react-router-dom";
import Axios from "../../services/Axios";

const $ = window.$;

class Templates extends Component {
  constructor() {
    super();
    this.state = {
      templates: [],
      templateName: "",
    };
  }

  componentDidMount = () => {
    Axios.get("/template")
       .then(({ data }) => this.setState({ templates: data.templates }))
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
    $("#addTemplateModal").on("hidden.bs.modal", (e) => {
      this.setState({ templateName: "" });
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { templates, templateName } = this.state;

    const idx =
      templates && templates.findIndex((a) => a.name === templateName);
    if (idx > -1) return alert("Template with same name already exists");

    Axios.post("/template", { name: this.state.templateName, data: {} })
      .then(({ data }) => {
        console.log(data, 'teempalated')
        const { templateName } = this.state;
        
        const idx = data.templates.findIndex((a) => a.name === templateName);
        window.open("/template/" + data.templates[idx]._id, "_self");
      })
      .catch((err) => console.log(err) || alert(JSON.stringify(err)));
  };

  render = () => {
    const { templateName, templates } = this.state;
    return (
      <div>
        <div className="container p-4">
          <Link to="/products/submitted">
            <i className="fa fa-arrow-left mt-3" aria-hidden="true"></i>
          </Link>
          {/* modal */}
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
                    Add Template
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
                <form onSubmit={this.handleSubmit} className="modal-body">
                  <div className="form-group">
                    <input
                      type="text"
                      name="templateName"
                      value={templateName}
                      onChange={this.handleChange}
                      className="form-control"
                      placeholder="Enter template name  "
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 col-lg-2">
              <div
                className="card template-card bg-light"
                onClick={() => $("#addTemplateModal").modal("show")}
              >
                <div className="card-body d-flex align-items-center justify-content-center c-pointer text-center py-4">
                  <i className="fas fa-plus  fa-4x"></i>
                </div>
              </div>
            </div>
            {templates &&
              templates.map((template) => {
                return (
                  <div className="col-12 col-md-6 col-lg-2">
                    <Link
                      to={`/template/${template._id}`}
                      className="card template-card bg-light"
                    >
                      <div className="card-body d-flex align-items-center c-pointer text-center py-4 ">
                        <h5 className="card-text text-center p-3">
                          {template.name}
                        </h5>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
}
export default Templates;