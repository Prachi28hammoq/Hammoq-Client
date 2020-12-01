import React from "react";
import { v4 as uuid } from "uuid";

const Select = (props) => (
  <div className="form-group mb-4 row align-items-center">
    <div className="col-sm-8">
      <select
        className="custom-select border border-dark  custom-select-sm"
        {...props}
      >
        {props.selectOptions.map((option) => (
          <option value={option} key={uuid()}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <label
      htmlFor="colFormLabelSm"
      className="col-sm-4 col-form-label text-right col-form-label-sm"
    >
      {props.label}
    </label>
  </div>
);
export default Select;