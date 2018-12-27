import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import LinksView from "./LinksView";
import {
	DeployContract, 
	EditDetailsView, 
	EditTagView, 
	EditUserView,
	EditLinkView,
	ProvRecordsView
} from "./EditViews";
import { connect } from 'react-redux';
import ContractView from "./ContractView"
import EditModelSelector from './models/selectors/EditModelSelector';
import EditModel from './models/EditModel';
import ContractEditModelMap from './models/maps/ContractEditModelMap';
import { SelectSelector } from './models';
import * as modelActions from "./modelActions";

class App extends Component {

	componentDidUpdate() {
		if(this.props.match.params.contract !== this.props.selected) {
			//this updates the state based on the browser history buttons
			//for initial state is the Web3Loader responsible
			this.props.selectHistoryContract(this.props.match.params.contract);
		}
	}

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
			case ContractEditModelMap.modals.displayProv:
				renderModal = (<ProvRecordsView/>)
				break;
			default:
				break;
		}

		return (
			<div>
				<Loader.Component match={this.props.match} location={this.props.location}/>
				<TopMenu.Component/>
				<ContractView/>
				{checkAndRender(
					EditModel.isOpen(this.props.model), 
					renderModal
				)}
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
		selected: SelectSelector.getSelectedContract(state)
	};
}

export const mapDispatchToProps = (dispatch) => {
	return {
		selectHistoryContract: (address) => dispatch(modelActions.onContractSelectHistory(address))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
