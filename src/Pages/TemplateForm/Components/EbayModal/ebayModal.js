import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './ebayModal.css';

let Axios;

export default class EbayCategoryModal extends Component {
	elRefs = React.createRef([]);

	constructor(props)
	{
	    super(props);
	    this.state = 
	    {
	    	showModal: false,
	    	isLeafSelected: false,
	    	itemCategoryList: undefined,
	    	categorySelected: undefined,
	    	currentCategory: undefined,
	    	selectedLeaf: undefined,
	    	renderMap: [],
	    	itemAspects: undefined,
	 	};
	 	this.openModal = this.openModal.bind(this);
	 	this.closeModal = this.closeModal.bind(this);
	 	this.handleChange = this.handleChange.bind(this);
	 	this.setRenderMap = this.setRenderMap.bind(this);
	 	this.setCategorySelection = this.setCategorySelection.bind(this);
	 	this.setLeafSelection = this.setLeafSelection.bind(this);
	 	this.selectedLeafModalClose = this.selectedLeafModalClose.bind(this);
	 	this.resetSelection = this.resetSelection.bind(this);
 	}

 	componentWillMount = () =>
    {
	    Axios = this.props.Axios;
	    const url = '/ebay/categoryTree/';
	    Axios.get(url)
		     .then(response => response.data)
		     .then((data) => {this.setState({ itemCategoryList: data })})
		     .catch(err => console.log(err));
  	}

 	openModal = () =>
 	{
 		this.setRenderMap();
    	this.setState({showModal : true});
  	}

	closeModal = () =>
	{
		this.setState({renderMap: [], showModal : false, isLeafSelected: false, selectedLeaf: undefined});
  	}

  	selectedLeafModalClose = () =>
	{
    	this.setState({showModal : false, renderMap: []});
    	const { selectedLeaf } = this.state;
    	const url = '/ebay/itemAspects/' + selectedLeaf.category.categoryId;
	    Axios.get(url)
		     .then(response => response.data)
		     .then((data) => {
		    	this.setState({itemAspects: data});
		    	this.props.onSelectedLeafModalClose(data);
		    	this.props.setSelectedCategoryField(selectedLeaf.category)
		      })
		     .catch(err => console.log(err));
  	}

 	handleChange = async(passedArray, event) => 
 	{
		this.setState({currentCategory: passedArray[event.target.value]});

		event.target.disabled = true

		if(passedArray[event.target.value].leafCategoryTreeNode)
		{
			this.setLeafSelection(passedArray[event.target.value]);
		}

		else
		{
			this.setCategorySelection(passedArray[event.target.value]);
		}
	};

	setLeafSelection = (newLeafSelection) =>
	{
		this.setState({selectedLeaf: newLeafSelection, isLeafSelected: true});
	}

	setRenderMap = () =>
	{
		const { itemCategoryList, categorySelected } = this.state;
		this.state.renderMap.push(<React.Fragment key="BaseMenuFragment">
					<FormControl className="BaseMenu" key = 'BaseMenuFormControl' style={{'width':'auto'}}>
				    <Select
				        multiple
				        native
				        ref={this.elRefs}
				        value={categorySelected}
				        onChange={(e) => this.handleChange(itemCategoryList.data.rootCategoryNode.childCategoryTreeNodes, e)}
				        style={{'height':'100%'}}
				        inputProps={{id: 'select-multiple-native', style:{'height':'95%'}}}>
				        {Object.keys(itemCategoryList.data.rootCategoryNode.childCategoryTreeNodes).map((childCategoryTreeNodes, index) => (
				            <option key={itemCategoryList.data.rootCategoryNode.childCategoryTreeNodes[index].category.categoryId} value={index}>
				              {itemCategoryList.data.rootCategoryNode.childCategoryTreeNodes[index].category.categoryName}
				            </option>
				        ))}
				    </Select>
				    </FormControl>
				    </React.Fragment>)
	}

	resetSelection = () =>
	{
		for (let i = this.state.renderMap.length; i > 1; i--) 
		{
  			if(this.state.renderMap.key !== 'BaseMenuFragment')
  			{
  				this.state.renderMap.pop();
  			}
		}
		this.setState({selectedLeaf: undefined, isLeafSelected: false});
		this.elRefs.current.firstChild.disabled = false;
		this.forceUpdate();
	}

 	setCategorySelection = (newCurrentCategory) =>
	{
		const currentCategory = newCurrentCategory;
		const { categorySelected } = this.state;
		this.state.renderMap.push(<React.Fragment key={newCurrentCategory.category.categoryName}>
			<FormControl className="categorySelected" key = {newCurrentCategory.category.categoryName} style={{'width':'auto'}}>
		        <Select
		          multiple
		          native
		          value={categorySelected}
		          onChange={(e) => this.handleChange(currentCategory.childCategoryTreeNodes, e)}
		          style={{'height':'100%'}}
		          inputProps={{id: 'select-multiple-native', style:{'height':'95%'}}}>
		          {Object.keys(currentCategory.childCategoryTreeNodes).map((childCategoryTreeNodes, index) => (
		            <option key={currentCategory.childCategoryTreeNodes[index].category.categoryId} value={index}>
		              {currentCategory.childCategoryTreeNodes[index].category.categoryName}
		            </option>
		          ))}
		        </Select>
		    </FormControl>
		    </React.Fragment>);
	}

  	render = () =>
  	{
  		const { 
  			//renderMap, 
  			showModal,
  			isLeafSelected } = this.state;
        return(
		<div>
        	<Dialog open={showModal} maxWidth='80%'>
		        <DialogTitle closeButton>
          			<DialogTitle>Ebay Category Selector</DialogTitle>
      			      {!showModal ? (
				        <IconButton aria-label="close" onClick={this.closeModal}>
				          <CloseIcon />
				        </IconButton>
				      ) : null}
        		</DialogTitle>
        		<DialogContent dividers style={{'min-height':'60vh', 'max-height':'60vh', 'display':'flex'}}>
			        <>
				    {this.state.renderMap.map(item => (
				    <React.Fragment key={item.id}>{item}</React.Fragment>
				    ))}
				    </>
			    </DialogContent>

				<DialogActions>
				    <Button variant="secondary" onClick={this.resetSelection}>
            			Reset Selection
          			</Button>
          			<Button variant="secondary" onClick={this.closeModal}>
            			Close
          			</Button>
          			<Button variant="primary" onClick={this.selectedLeafModalClose} disabled={!isLeafSelected}>
           				Select Category
          			</Button>
        		</DialogActions>
	        </Dialog>
      	</div>
        );
	}
}