import React from "react";

export default (props) => (
  <div className="form-group mb-4 row">
    <div className="col-12 col-lg-8">
      <input className="form-control form-control-sm" {...props} />
    </div>
    <label
      htmlFor="colFormLabelSm"
      className="col-sm-4 col-form-label text-lg-right col-form-label-sm"
    >
      {props.label !== "L" ? null : null}
      {props.label}
    </label>
  </div>
);
