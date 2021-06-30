import React, { Component } from "react";
import { VariableSizeList } from "react-window";
import PropTypes from "prop-types";
import { useTheme } from "@material-ui/core/styles";
import Typography  from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ListSubheader from "@material-ui/core/ListSubheader";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Autocomplete, ToggleButton } from "@material-ui/lab";
import EbayCategoryModal from "../EbayModal/ebayModal";
import "./GeneralSettings.css";

let Axios;

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return (<div ref={ref} {...props} {...outerProps} />);
});

function useResetCache(data) 
{
  const ref = React.useRef(null);
  React.useEffect(() => {if (ref.current != null) ref.current.resetAfterIndex(0, true);
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props,ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) 
    {
      return 8 * itemSize;
    }
    else if(itemCount > 0 && itemCount < 8)
    {
      return itemCount * itemSize;
    }
    else
    {
      return 0;
    }
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width='100%'
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType='ul'
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}>
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
    );
});

ListboxComponent.propTypes = {children: PropTypes.node};

const renderGroup = (params) => [
  <ListSubheader key={params.key} component='div'>
    {params.group}
  </ListSubheader>,
  params.children,
];


///////////////////////////////////////////////////////////////////////////////////

class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {ebayCategoryDropDownItemsLOADED: false};
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

  componentDidMount = () => {
    Axios = this.props.Axios;
    const { ebayCategoryDropDownItemsLOADED } = this.state;
    const { ebayCategoryDropDownItems } = this.props;
    
    if(!ebayCategoryDropDownItemsLOADED && !ebayCategoryDropDownItems.length) 
    {
      ebayCategoryDropDownItems.push({'categoryName':'Ebay Categories Are Missing'})
      this.setState({ebayCategoryDropDownItemsLOADED:true})
    }
  }

  render = () => {
    const {data, 
           handleChange,
           handleSelectedEbayCategory,
           ebayCategoryDropDownItems,
           clearExtraDescriptions,
           Axios,
           ebayRef,
           handleZeroFix
    } = this.props;

    const {ebayCategoryDropDownItemsLOADED} = this.state;

    return (
          <div className='general__header'>
            <div className='gen_settings'>General Settings</div>
            <div className='general__body'>
              <div className='general__col'>
                <label htmlFor='Category' className='label__style_general'>
                  Ebay Category 1
                  <div className='category__alignment'>
                    <Autocomplete
                      disableListWrap
                      ListboxComponent={ListboxComponent}
                      renderGroup={renderGroup}
                      value={data.ebayCategoryField ? data.ebayCategoryField : {'categoryName':''}}
                      options={ebayCategoryDropDownItems}
                      getOptionLabel={(option) => option.categoryName}
                      renderInput={(params) => (
                        <TextField
                          placeholder={data.ebayCategoryField ? data.ebayCategoryField.categoryName : ""}
                          {...params}
                          style={{
                            borderRadius: 7,
                            border: 1,
                            borderColor: "solid gray",
                            width: 185,
                            height: 30,
                            marginTop: 3,
                          }}
                        />
                      )}
                      renderOption={(option) => (
                        <Typography noWrap>{option.categoryName}</Typography>
                      )}
                      onChange={(event, value, reason) =>
                        reason === "select-option"
                          ? handleSelectedEbayCategory(value)
                          : null
                      }
                    />
                    <button
                      className='brz__btn '
                      onClick={(e) => {
                        ebayRef.current.openModal();
                      }}
                    >
                      Browse
                    </button>
                    <button
                      className='brz__btn '
                      onClick={(e) => {
                        handleSelectedEbayCategory({'categoryName':''});
                        clearExtraDescriptions();
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </label>
                <label
                  htmlFor='SecondaryCategory'
                  className='label__style_general'
                >
                  Ebay Category 2
                  <div>
                    <input 
                    className='general__input_brz'
                    ></input>
                    <button className='brz__btn'>Browse</button>
                  </div>
                </label>
                <label htmlFor='ListingFormatType' className='label__style_general'>
                  Listing Format/Type
                  <input 
                  className='general__input'
                  name='listingFormatType'
                  value={data.listingFormatType}
                  onChange={handleChange}
                  ></input>
                </label>
              </div>

              {/* =============================================================== */}
              <div className='general__col'>
                <label
                  htmlFor='GivingWorksCharityID'
                  className='label__style_general'
                >
                  Giving Works Charity ID
                  <input 
                  className='general__input'
                  name='givingWorksCharityID'
                  value={handleZeroFix('givingWorksCharityID')}
                  onChange={handleChange}
                  ></input>
                </label>
                <label
                  htmlFor='GivingWorksDonationPercentage'
                  className='label__style_general'
                >
                  Giving Works Donation %
                  <input 
                  className='general__input'
                  name='givingWorksDonationPercentage'
                  value={handleZeroFix('givingWorksDonationPercentage')}
                  onChange={handleChange}
                  ></input>
                </label>
                <label htmlFor='listingDuration' className='label__style_general'>
                  Listing Duration
                  <input 
                  className='general__input'
                  name='listingDuration'
                  value={data.listingDuration || ""}
                  onChange={handleChange}
                  ></input>
                </label>
              </div>

              {/* =============================================================== */}
              <div className='general__col'>
                <label
                  htmlFor='StoreCategory1'
                  className='label__style_general'
                >
                  Store Category 1
                  <input 
                  className='general__input'
                  name='storeCategoryOne'
                  value={data.storeCategoryOne || ""}
                  onChange={handleChange}
                  ></input>
                </label>
                <label
                  htmlFor='StoreCategory2'
                  className='label__style_general'
                >
                  Store Category 2
                  <input 
                  className='general__input'
                  name='storeCategoryTwo'
                  value={data.storeCategoryTwo || ""}
                  onChange={handleChange}
                  ></input>
                </label>
                <label htmlFor='LotSize' className='label__style_general'>
                  Lot Size
                  <input 
                  className='general__input'
                  name='lotSize'
                  value={handleZeroFix('lotSize')}
                  onChange={handleChange}
                  ></input>
                </label>
              </div>
            </div>
          </div>
    );
  };
}

export default GeneralSettings;