import React, {MouseEvent, TouchEvent} from "react";
import {inject, observer} from "mobx-react";
import {RootStore} from "stores/rootStore/rootStore";
import FormsLayer from "components/FormsLayer/FormsLayer";
import './MainLayer.styl';
import Tree from "components/Tree/Tree";

interface IMainLayerProps {
	rootStore?: RootStore
}

@inject("rootStore") @observer
export default class MainLayer extends React.Component<IMainLayerProps> {
	mainDivRef: React.RefObject<HTMLDivElement>;

	root: any;

	constructor(props)  {
		super(props);

		this.mainDivRef = React.createRef();

		this.root = document.getElementById("root");
	}

	componentDidMount() {
		this.props.rootStore.mainLayerRef = this.mainDivRef;
	}

	onClick = (e: MouseEvent) => {
		//fullScreen(this.root);
	}

	addBubble = (x: number, y: number, x2: number, y2: number) => {
		this.props.rootStore.addBubble(x, y,x2,y2);
	}

	render() {
		return <div className={"MainLayer"}
					onClick={this.onClick}
					// onMouseMove={this.onMouseMove}
					//onMouseDown={this.onMouseDown}
					//onTouchEnd={this.onTouchEnd}
					ref={this.mainDivRef}>
			<Tree addBubble={this.addBubble}/>
			<FormsLayer/>
		</div>
	}
}

function fullScreen(element) {
	if (element.fullscreenEnabled) return;

	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.webkitrequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.mozRequestFullscreen) {
		element.mozRequestFullScreen();
	}
}