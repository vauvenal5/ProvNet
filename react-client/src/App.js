import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import DetailsView from "./DetailsView";
import LinksView from "./LinksView";
import DeployContract from "./DeployContract";
import EditDetailsView from "./EditDetailsView";
import EditTagView from './EditTagView';
import { connect } from 'react-redux';

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
				<DetailsView.Component/>
				<LinksView.Component/>
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
