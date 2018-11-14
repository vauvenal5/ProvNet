import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import LinksView from "./LinksView";
import {DeployContract, EditDetailsView, EditTagView} from "./EditViews";
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
				{renderDeployModal}
				{renderEdit}
				{renderTagEdit}
			</div>
		);
	}
}

export const mapStateToProps = (state) => {
	console.log(state);
	let tagModel = EditModelSelector.getTagSelectedEditModel(state);
	let deployModel = EditModelSelector.getNewContractModel(state);
	let detailsModel = EditModelSelector.getContractDetailsModel(state);
	return {
		renderDeployModal: EditModel.isOpen(deployModel),
		renderDetails: EditModel.isOpen(detailsModel),
		renderTagEdit: EditModel.isOpen(tagModel)
	};
}

export default connect(mapStateToProps)(App);;
