import { Component } from "react";
import "./ControllerButtons.css";

class ControllerButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
   }

  render = () => {
    const {data, onSubmit,isTemplate,handleDelete} = this.props;

    return(
            <div className='decision_buttons'>
            {process.env.REACT_APP_NAME === 'APP' ?
            (
              <>
              <button className='save_to_draft'
              onClick={(e) => {onSubmit(e, "current", "Move");}}>
              Save</button>
              </>
            )
            :
            data.prodStatus && data.prodStatus === 'draft'?
              (
                <>
                <button 
                className='save_to_draft'
                onClick={(e) => {onSubmit(e, "draft", "Move");}}>
                Save to Draft
                </button>
                <button className='submit'
                onClick={(e) => {onSubmit(e, "inventory", "List");}}>
                List
                </button>
                </>
              )
              :
              (
                <>
                <button 
                className='save_to_draft'
                onClick={(e) => {onSubmit(e, "draft", "Move");}}>
                Save To Draft
                </button>
                <button className='submit'
                onClick={(e) => {onSubmit(e, "current", "Save");}}>
                Save
                </button>
                </>
            )
            }
            {isTemplate? 
            (<>
            <button className='cancel'
              onClick={()=>handleDelete()}>
              Delete</button>
              </>): <br></br>}
            <button 
            className='cancel'
            onClick={() => window.open("/searchcart", "_self")}
            >Cancel</button>
            </div>
        );
  };
}

export default ControllerButtons;