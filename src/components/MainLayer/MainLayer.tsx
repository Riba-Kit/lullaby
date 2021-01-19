import React, {MouseEvent} from "react";
import {inject, observer} from "mobx-react";
import {RootStore} from "stores/rootStore/rootStore";
import FormsLayer from "components/FormsLayer/FormsLayer";
import './MainLayer.styl';

interface IMainLayerProps {
	rootStore?: RootStore
}

@inject("rootStore") @observer
export default class MainLayer extends React.Component<IMainLayerProps> {
	mainDivRef: React.RefObject<HTMLDivElement>;

	constructor(props)  {
		super(props);

		this.mainDivRef = React.createRef();
	}

	onClick= (event: MouseEvent) => {
		let clientX = event.clientX;
		let clientY = event.clientY;

		let bounding = this.mainDivRef.current.getBoundingClientRect();

		let relativeX = clientX - bounding.left;
		let relativeY = clientY - bounding.top;

		this.props.rootStore.addElement(relativeX, relativeY);
	}

	render() {
		return <div className={"MainLayer"}
					onClick={this.onClick}
					ref={this.mainDivRef}>
			<FormsLayer mainLayerRef={this.mainDivRef}/>
		</div>
	}
}