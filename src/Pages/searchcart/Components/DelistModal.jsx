import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Axios from "../../../services/Axios";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function DelistModal(props) {
  const { deListProductId, onHide } = props,
    [deListingReason, setDeListingReason] = useState(""),
    [loading, setLoading] = useState(false);

  const handleProductDelist = async () => {
    try {
      setLoading(true);
      if (deListingReason == "") {
        alert("Select a reason of delisting");
        return;
      }
      const res = await Axios.put(`/product/delist/ebay/${deListProductId}`, {
        EndingReason: deListingReason,
      });

      onHide();
      alert("Delisted Successfully");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err?.response?.data?.errorMessage) {
        alert("Error: " + err.response.data.errorMessage);
      }
    }
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delist Item
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center mb-2">
          <FormControl style={{ minWidth: "240px" }}>
            <InputLabel id="demo-simple-select-helper-label">
              Reason of delisting
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={deListingReason}
              onChange={(evt) => setDeListingReason(evt.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Incorrect"}>
                Start price or reserve price is incorrect.
              </MenuItem>
              <MenuItem value={"LostOrBroken"}>
                The item was lost or is broken.
              </MenuItem>
              <MenuItem value={"NotAvailable"}>
                The item is no longer available for sale.
              </MenuItem>
              <MenuItem value={"OtherListingError"}>
                Listing contained an error
              </MenuItem>
            </Select>
            <FormHelperText>
              Please specify a reason of delisting
            </FormHelperText>
          </FormControl>
        </div>

        <div className="d-flex justify-content-around">
          <button
            className=" btn btn-outline-success"
            onClick={onHide}
            disabled={loading}
          >
            No, Don't delist the product.
          </button>
          or
          <button
            className=" btn btn-outline-danger"
            onClick={handleProductDelist}
            disabled={loading}
          >
            Yes, Delist the product.
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <small>
          <ul>
            <li>
              By clicking on <b>Yes, Delist the product.</b>, The product will
              be delisted from eBay.
            </li>
          </ul>
        </small>
      </Modal.Footer>
    </Modal>
  );
}
