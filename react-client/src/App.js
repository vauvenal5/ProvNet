import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import LinksView from "./LinksView";
import {
	DeployContract, 
	EditDetailsView, 
	EditTagView, 
	EditUserView,
	EditLinkView
} from "./EditViews";
import { connect } from 'react-redux';
import ContractView from "./ContractView"
import EditModelSelector from './models/selectors/EditModelSelector';
import EditModel from './models/EditModel';

class App extends Component {
    render() {
		let renderDeployModal;
		if(this.props.renderDeployModal) {
			renderDeployModal=(<DeployContract/>);
		}

		let renderEdit;
		if(this.props.renderDetails) {
			renderEdit=(<EditDetailsView/>);
		}

		let renderTagEdit;
		if(this.props.renderTagEdit){
			renderTagEdit = (<EditTagView/>);
		}

		return (
			<div>
				<TopMenu.Component/>
				<Loader.Component/>
				<ContractView/>
				{checkAndRender(this.props.renderDeployModal, (<DeployContract/>))}
				{checkAndRender(this.props.renderDetails, (<EditDetailsView/>))}
				{checkAndRender(this.props.renderTagEdit, (<EditTagView/>))}
				{checkAndRender(this.props.renderAddUser, (<EditUserView/>))}
				{checkAndRender(this.props.renderAddLink, (<EditLinkView/>))}
			</div>
		);
	}
}

export const checkAndRender = (isOpen, component) => {
	if(isOpen) {
		return component;
	}
}

export const mapStateToProps = (state) => {
	console.log(state);
	let tagModel = EditModelSelector.getTagSelectedEditModel(state);
	let deployModel = EditModelSelector.getNewContractModel(state);
	let detailsModel = EditModelSelector.getContractDetailsModel(state);
	let userModel = EditModelSelector.getUserAddModel(state);
	let linkModel = EditModelSelector.getSelectedEditModel(state);
	return {
		renderDeployModal: EditModel.isOpen(deployModel),
		renderDetails: EditModel.isOpen(detailsModel),
		renderTagEdit: EditModel.isOpen(tagModel),
		renderAddUser: EditModel.isOpen(userModel),
		renderAddLink: EditModel.isOpen(linkModel)
	};
}

export default connect(mapStateToProps)(App);
