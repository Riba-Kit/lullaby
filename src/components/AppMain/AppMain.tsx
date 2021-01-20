import React from "react";
import {Provider} from 'mobx-react';
import {rootStore} from 'stores/rootStore/rootStore';
import MainLayer from "components/MainLayer/MainLayer";

export default class AppMain extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}

	render() {

		return <Provider rootStore={rootStore}>
			<MainLayer/>
		</Provider>
	}
}