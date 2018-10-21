import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import DetailsView from "./DetailsView";
import LinksView from "./LinksView";
import DeployContract from "./DeployContract";
import {EditDetailsView} from "./EditDetailsView/EditDetailsView";

class App extends Component {
    render() {
		return (
			<div>
				<TopMenu.Component/>
				<Loader.Component/>
				<DetailsView.Component/>
				<LinksView.Component/>
				<DeployContract.Component/>
				<EditDetailsView/>
			</div>
		);
	}
}

export default App;
