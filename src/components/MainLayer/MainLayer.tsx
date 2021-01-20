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

	addBubble =(clientX, clientY,) => {

		fullScreen(this.root);

		let bounding = this.mainDivRef.current.getBoundingClientRect();

		let relativeX = clientX - bounding.left;
		let relativeY = clientY - bounding.top;

		this.props.rootStore.addElement(relativeX, relativeY);
	}

	onClick = (event: MouseEvent) => {
		if ('ontouchend' in document.documentElement) return;
		this.addBubble(event.clientX, event.clientY);
	}

	onTouchEnd = (event: TouchEvent) => {
		this.addBubble(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
	}

	render() {
		return <div className={"MainLayer"}
					onClick={this.onClick}
					onTouchEnd={this.onTouchEnd}
					ref={this.mainDivRef}>
			<FormsLayer/>
			<Tree/>
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