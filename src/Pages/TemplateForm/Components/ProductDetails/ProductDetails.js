import { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete, ToggleButton } from "@material-ui/lab";
import "./ProductDetails.css";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showcat: false,
      category: ""
    };
    this.setCategory = this.setCategory.bind(this);
   }

  setCategory = (str) => {
    const { data } = this.props;
    if (this.state.category === str) 
    {
      data["category"] = "";
      this.setState({ category: "" });
    } 
    else 
    {
      data["category"] = str;
      this.setState({ category: str });
    }
  };

  render = () => {
    const { category, showcat } = this.state;
    const {
          data,
          handleChange,
          extraMeasures,
          extraDescriptions,
          toggleOptional,
          clearExtraDescriptions, 
          repopulateExtraDescriptions,
          addMeasure,
          removeMeasure,
          removeDescription,
          handleDescriptionChange,
          handleDescriptionLabel,
          handleMeasureChange,
          handleMeasureLabel,
          handleZeroFix
    } = this.props;

    if(data.ebayOptionalFieldsActive === undefined)
    {
      data.ebayOptionalFieldsActive = false;
    }

    return(
      <>
      <div className='measurements__header'>
        <div className='productdetails_adjust'>
          Product Details
        </div>
        <div className='product__header_btn_ctn'>
          <select
            id='condition_name'
            name='condition_name'
            className='condition__input'
            value={data.condition_name}
            onChange={handleChange}
            >
            <option value={data.condition_name} disabled>{data.condition_name}</option>
            <option value='New'>New</option>
            <option value='New (Other/Open Box)'>New (Other/Open Box)</option>
            <option value='New With Defects'>New With Defects</option>
            <option value='Seller Refurbished'>Seller Refurbished</option>
            <option value='Used'>Used</option>
            <option value='Broken/For Repair'>Broken/For Repair</option>
          </select>
          <ToggleButton
            className='product__togglebtn'
            variant='contained'
            value={data.ebayOptionalFieldsActive}
            onClick={toggleOptional}
          >
            Optional
          </ToggleButton>
          <button
            className='btn-success product__btn'
            onClick={clearExtraDescriptions}
          >
            Reset Details
          </button>
          <button
            className='btn-success product__btn'
            onClick={repopulateExtraDescriptions}
          >
            Undo Delete
          </button>
        </div>
      </div>
              {extraDescriptions.length !== 0 ? (extraDescriptions.filter((description) => data.ebayOptionalFieldsActive ? true : description.aspectUsage === "RECOMMENDED").map((description) => {
                    return (
                      <>
                      <div className='measurement__body'>
                        <input
                          className={`form-control form-control-sm col-4 mr-3 ${
                            description.aspectRequired
                              ? "aspect__input_required"
                              : description.aspectUsage === "RECOMMENDED"
                              ? "aspect__input_recommended"
                              : ""
                          }`}
                          type='text'
                          name='label'
                          id={description.id}
                          value={description.key}
                          onChange={(e) => handleDescriptionLabel(description.id, e)}
                          placeholder='key'
                        />
                        :-
                        <Autocomplete
                          freeSolo
                          options={
                            description.suggestedValues
                              ? description.suggestedValues
                              : [{"localizedValue": "No Suggested Values"}]
                          }
                          getOptionLabel={(option) => option.localizedValue ? option.localizedValue : option}
                          className='form-control-sm col-4 mr-3'
                          value={description.value}
                          onChange={(event, value, reason) => handleDescriptionChange(description.id, value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                            />
                          )}
                        />
                        <button
                          className='btn'
                          onClick={(e) => removeDescription(description.id, e)}
                        >
                          <div className='fa fa-minus-square ml-3'></div>
                        </button>
                      </div>
                      </>
                    );
                  })
              ) : (
                <>
                  <div className='properties'>
                    <div className='prop_adjust'>
                      <input
                        placeholder='  Show all title'
                        type='text'
                        className='properties__input'
                      ></input>
                      <input
                        placeholder='  Brand or Maker'
                        type='text'
                        className='properties__input'
                        name='brand'
                        value={data.brand  || ""}
                        onChange={handleChange}
                      ></input>
                      <input
                        placeholder='    Style/Feature/Model'
                        type='text'
                        className='properties__input'
                        name='model'
                        value={data.model  || ""}
                        onChange={handleChange}
                      ></input>
                    </div>
                    </div>
                  <div className='segregate'>
                    <button
                      className={`${
                        data.category === "Unisex"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Unisex'
                      onClick={() => {
                        this.setCategory("Unisex");
                      }}
                    >
                      Unisex
                    </button>
                    <button
                      className={`${
                        data.category === "Men" ? "fill__button" : "outline__button"
                      }`}
                      category='Men'
                      onClick={() => {
                        this.setCategory("Men");
                      }}
                    >
                      Men
                    </button>
                    <button
                      className={`${
                        data.category === "Women"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Women'
                      onClick={() => {
                        this.setCategory("Women");
                      }}
                    >
                      Women
                    </button>
                    <button
                      className={`${
                        data.category === "Unisex Kids"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Unisex Kids'
                      onClick={() => {
                        this.setCategory("Unisex Kids");
                      }}
                    >
                      Unisex Kids
                    </button>
                    <button
                      className={`${
                        data.category === "Girls"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Girls'
                      onClick={() => {
                        this.setCategory("Girls");
                      }}
                    >
                      Girls
                    </button>
                    <button
                      className={`${
                        data.category === "Boys"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Boys'
                      onClick={() => {
                        this.setCategory("Boys");
                      }}
                    >
                      Boys
                    </button>
                    <button
                      className={`${
                        data.category === "Maternity"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Materity'
                      onClick={() => {
                        this.setCategory("Maternity");
                      }}
                    >
                      Materity
                    </button>
                    <button
                      className={`${
                        data.category === "Babies"
                          ? "fill__button"
                          : "outline__button"
                      }`}
                      category='Babies'
                      onClick={() => {
                        this.setCategory("Babies");
                      }}
                    >
                      Babies
                    </button>

                    {showcat && (
                      <input
                        className='custom__category'
                        type='text'
                        name='category'
                        placeholder='Custom Category'
                        value={data.category}
                        onChange={handleChange}
                        maxLength='140'
                      />
                    )}
                  </div>
                </>
              )}
                  <div className='measurement__heading'>
                    <div className='measurement_adjust'>Measurements</div>
                    <div className='measurement__body'>
                      <label htmlFor='Waist' className='label__style'>
                        Waist
                        <input
                          className='measurement__input'
                          type='number'
                          step="any"
                          name='waist'
                          id='waist'
                          value={handleZeroFix("waist")}
                          onChange={handleChange}
                        ></input>
                      </label>
                      <label htmlFor='Rise' className='label__style'>
                        Rise
                        <input
                          className='measurement__input'
                          type='number'
                          step="any"
                          name='rise'
                          id='rise'
                          value={handleZeroFix("rise")}
                          onChange={handleChange}
                        ></input>
                      </label>
                      <label htmlFor='Inseam' className='label__style'>
                        Inseam
                        <input
                          className='measurement__input'
                          type='number'
                          step="any"
                          name='inseam'
                          id='inseam'
                          value={handleZeroFix("inseam")}
                          onChange={handleChange}
                        ></input>
                      </label>
                      <button
                        className='outline__button__measurement'
                        onClick={addMeasure}
                      >
                        Add new measurement
                      </button>
                    </div>
                    {extraMeasures.length !== 0 ? (extraMeasures.map((extraMeasurement) => {
                    return (
                      <>
                      <div className='measurement__body'>
                        <input
                          className={`form-control form-control-sm col-4 mr-3`}
                          type='text'
                          name='label'
                          id={extraMeasurement.id}
                          value={extraMeasurement.label}
                          onChange={(e) => handleMeasureLabel(extraMeasurement.id, e)}
                          placeholder='Measurement'
                        />
                        :-
                        <input
                          className={'form-control form-control-sm col-4 mr-3'}
                          type='text'
                          name='value'
                          id={extraMeasurement.id}
                          value={extraMeasurement.val}
                          onChange={(e) => handleMeasureChange(extraMeasurement.id, e)}
                          placeholder='Value'
                          />
                        <button
                          className='btn'
                          onClick={(e) => removeMeasure(extraMeasurement.id, e)}
                        >
                          <div className='fa fa-minus-square ml-3'></div>
                        </button>
                      </div>
                      </>
                    );
                  })
              ) : (" ")
                  }
                  </div>
          </>
    );
  };
}

export default ProductDetails;