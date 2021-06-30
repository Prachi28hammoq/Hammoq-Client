import { Component } from "react";

const max = 5000;

class LeftSideTextBoxes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customdesc: false,
      shortDescCharCount: 0
    };
    this.handleMaxChar = this.handleMaxChar.bind(this);
    this.customdescription = this.customdescription.bind(this);
  }

  componentWillMount() 
  {
    if ("customdesc" in localStorage) 
    {
      this.setState({customdesc: localStorage.getItem("customdesc") === "true"});
    }
  }

  handleMaxChar = (e) => {
    if (e.target.value.length > max) return 0;
    this.setState({ shortDescCharCount: e.target.value.length });
  };

  customdescription = (e) => {
    const { data } = this.props;
    const { customdesc } = this.state
    localStorage.setItem('customdesc', !customdesc);
    this.setState({ customdesc: !customdesc });

    if (data.shortDescription) {
      let desc = data.shortDescription;
      this.setState({ desc });
      data.shortDescription = desc.trim();
    }
  };

  render = () => {
    const { customdesc } = this.state;
    const {
      data,
      extraDescriptions,
      extraMeasures,
      handleChange
    } = this.props;

    if (customdesc === false) {
      if(data !== null && data !== undefined && data !== "undefined")
      {
        data.shortDescription = "";
          if(data.title !== undefined && data.title !== "" && data.title !== null && data.title !== 'undefined')
          {
            data.shortDescription += data.title + "\n \n";
          }

          if(data.brand !== undefined && data.brand !== "" && data.brand !== null && data.brand !== 'undefined')
          {
            data.shortDescription += "Brand: " + data.brand + "\n"
          }

          if(data.model !== undefined  && data.model !== "" && data.model !== null && data.model !== 'undefined')
          {
            data.shortDescription += "Model: " + data.model + "\n"
          }

          if(data.category !== undefined  && data.category !== "" && data.category !== null && data.category !== 'undefined')
          {
            data.shortDescription += "Category: " + data.category + "\n"
          }

          if(data['waist'] > 0)
          {
            data.shortDescription += 'Waist: ' + data['waist'] + "\n";
          }

          if(data['rise'] > 0)
          {
            data.shortDescription += 'Rise: ' + data['rise'] + "\n";
          }

          if(data['inseam'] > 0)
          {
            data.shortDescription += 'Inseam: ' + data['inseam'] + "\n";
          }
        }

      for (let i = 0; i < extraDescriptions.length; i++) 
      {
        if((extraDescriptions[i].value !== "" && extraDescriptions[i].value !== null && extraDescriptions[i].value !== undefined && extraDescriptions[i].value !== "No Suggested Values" && extraDescriptions[i].value !== "undefined") && 
           (extraDescriptions[i].value.localizedValue !== "" && extraDescriptions[i].value.localizedValue !== null && extraDescriptions[i].value.localizedValue !== undefined && extraDescriptions[i].value.localizedValue !== "No Suggested Values" && extraDescriptions[i].value.localizedValue !== "undefined"))
        {
          data.shortDescription += extraDescriptions[i].key + ": " + extraDescriptions[i].value.localizedValue + "\n";
        }
        else if(extraDescriptions[i].value !== "" && extraDescriptions[i].value !== null && extraDescriptions[i].value !== undefined && extraDescriptions[i].value !== "No Suggested Values" && extraDescriptions[i].value !== "undefined")
        {
          data.shortDescription += extraDescriptions[i].key + ": " + extraDescriptions[i].value + "\n";
        }
      }

        for (let i = 0; i < extraMeasures.length; i++) 
        {
          if(extraMeasures[i].value !== "" && extraMeasures[i].value !== null && extraMeasures[i].value !== undefined && extraMeasures[i].value !== "No Suggested Values" && extraMeasures[i].value !== "undefined")
          {
            data.shortDescription += extraMeasures[i].label + ": " + extraMeasures[i].val + "\n";
          }
        }

      if(data.companyBlurb !== undefined && data.companyBlurb !== "")
      {
        data.shortDescription += "\n" + data.companyBlurb + "\n";
      }
    }

    return(
      <>
      <div className="form-group mt-3">
            <label className="h6 py-2 fw-500 text-uppercase">
              Short Description
              {
                customdesc ?
                <button
                className={"btn btn-success ml-2  btn-sm"}
                onClick={this.customdescription}
                >
                Custom
              </button>
              :
                <button
                  className={"btn btn-warning ml-2 btn-sm"}
                  onClick={this.customdescription}
                >
                   Automatically Generate
                </button>
            }
            </label>
            <textarea
              className="form-control"
              id="shortDescriptionInputField"
              rows="7"
              name="shortDescription"
              value={data.shortDescription || ''}
              onKeyUp={this.handleMaxChar}
              onChange={handleChange}
            ></textarea>
            <small className="form-text text-muted" style={{ fontSize: "0.5em" }}>
              {this.state.shortDescCharCount}/5000 max characters
            </small>
          </div>
          <div className="form-group mt-3">
            <label className="h6 py-2 fw-500 text-uppercase">
              Keywords or tags
            </label>
            <textarea
              className="form-control"
              id="KeywordsTagsInputField"
              rows="5"
              name="keywords"
              value={data.keywords || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3">
            <label className="h6 py-2 fw-500 text-uppercase">
              Enter Note (Will not be displayed in listing)
            </label>
            <textarea
              className="form-control"
              id="NoteInputField"
              rows="5"
              name="note"
              value={data.note || ''}
              onChange={handleChange}
            />
          </div>
        </>
        );
  }
}
export default LeftSideTextBoxes;