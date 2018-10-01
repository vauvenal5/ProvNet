import React, { Component } from 'react';
import TopMenu from './TopMenu';
import Loader from "./Web3Loader";
import DetailsView from "./DetailsView";
import LinksView from "./LinksView";

class App extends Component {
    render() {
		return (
			<div>
				<TopMenu.Component/>
				<Loader.Component/>
				<DetailsView.Component/>
				<LinksView.Component/>
			</div>
		);
	}
}

export default App;
