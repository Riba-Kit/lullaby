import React, {MouseEvent, TouchEvent} from "react";

import './Tree.styl';
import SizerStyled from "components/Sizer/SizerStyled";

interface ITreeProps {
	addBubble: (x: number, y: number, x2: number, y2: number) => void,
}

export default class Tree extends React.Component<ITreeProps> {
	ref: React.RefObject<HTMLDivElement>;
	bubbling: boolean = false;
	bubbleInterval: NodeJS.Timeout;

	constructor(props) {
		super(props);

		this.ref = React.createRef();
	}

	componentWillUnmount() {
		clearInterval(this.bubbleInterval)
	}

	onClick = (e: MouseEvent) => {
		if ('ontouchstart' in document.documentElement) return;
		this.startBubbling();
	}

	onTouchStart = (e: TouchEvent) => {
		this.startBubbling();
	}

	startBubbling = () => {
		if (this.bubbling) return;
		this.bubbling = true;
		let counter = 0;
		this.bubbleInterval = setInterval(() => {
			if (counter > 10) {
				clearInterval(this.bubbleInterval)
				this.bubbling = false;
				return;
			}
			counter++;
			this.makeBubble();
		}, 100);
	}

	makeBubble = () => {
		let bounding = this.ref.current.getBoundingClientRect();
		let bubbleSourceX = bounding.left + bounding.width * 0.75;
		let bubbleSourceY = bounding.top + bounding.height * 0.2;
		let bubbleDestX = bounding.left + bounding.width * 2;
		let bubbleDestY = bounding.top + bounding.height * -0.4;
		this.props.addBubble(bubbleSourceX, bubbleSourceY, bubbleDestX, bubbleDestY);
	}

	render() {
		return <div className={"Tree"}
				 ref={this.ref}
				 onClick={this.onClick}
				 onTouchStart={this.onTouchStart}/>
	}
}