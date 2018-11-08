import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import LinksView from "./LinksView";
import {DeployContract, EditDetailsView, EditTagView} from "./EditViews";
import { connect } from 'react-redux';
import ContractView from "./ContractView"

class App extends Component {
    render() {
		let renderDeployModal;
		if(this.props.renderDeployModal) {
			renderDeployModal=(<DeployContract.Component/>);
		}

		let renderEdit;
		if(this.props.renderDetails) {
			renderEdit=(<EditDetailsView.Component/>);
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
	return {
		renderDeployModal: state.deployment.isOpen(),
		renderDetails: state.editDetails.isOpen(),
		renderTagEdit: state.editTag.isOpen()
	};
}

export default connect(mapStateToProps)(App);;
