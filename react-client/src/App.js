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
import ContractEditModelMap from './models/maps/ContractEditModelMap';

class App extends Component {
    render() {

		let renderModal;
		switch(EditModel.getModal(this.props.model)) {
			case ContractEditModelMap.modals.deploy:
				renderModal = (<DeployContract/>);
				break;
			case ContractEditModelMap.modals.details:
				renderModal = (<EditDetailsView/>);
				break;
			case ContractEditModelMap.modals.editLink:
				renderModal = (<EditLinkView/>);
				break;
			case ContractEditModelMap.modals.editTag:
				renderModal = (<EditTagView/>);
				break;
			case ContractEditModelMap.modals.editUser:
				renderModal = (<EditUserView/>);
				break;
			default:
				break;
		}

		return (
			<div>
				<TopMenu.Component/>
				<Loader.Component/>
				<ContractView/>
				{renderModal}
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
	return {
		model: EditModelSelector.getSelectedModel(state),
	};
}

export default connect(mapStateToProps)(App);
