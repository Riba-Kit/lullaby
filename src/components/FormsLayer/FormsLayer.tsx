import React from "react";
import {inject, observer} from "mobx-react";
import {IElement, RootStore} from "stores/rootStore/rootStore";
import {action, computed, observable} from "mobx";
import './FlyingElement.styl';
import _ from "lodash";

interface IMainLayerProps {
	rootStore?: RootStore,
}

@inject("rootStore") @observer
export default class FormsLayer extends React.Component<IMainLayerProps> {

	constructor(props) {
		super(props);
	}

	render() {
		return <>
			{this.props.rootStore.elements.map((element) =>
				<FlyingElement key={element.id}
							   element={element}/>
			)}
		</>
	}
}

const ANIMATION_DURATION = 15000;

@inject("rootStore") @observer
class FlyingElement extends React.Component<{ element: IElement, rootStore?: RootStore }> {

	anchorX: number;
	anchorY: number;
	endX: number;
	endY: number;
	divRef: React.RefObject<HTMLDivElement>;
	@observable keyframes: string;
	@observable animationTimingX: string;
	@observable animationTimingY: string;

	animationCounter: number = 0;

	calculateInterval: NodeJS.Timeout;
	removeTimeout: NodeJS.Timeout;

	size: number;
	@observable removed = false;

	constructor(props) {
		super(props);

		this.anchorX = this.props.element.initX;
		this.anchorY = this.props.element.initY;
		this.endX = this.props.element.initX;
		this.endY = this.props.element.initY;
		this.size = Math.random() * 12 + 2;

		this.divRef = React.createRef();
	}

	componentDidMount() {
		this.calculateAnimation();
		this.calculateInterval = setInterval(this.calculateAnimation, ANIMATION_DURATION);
		this.removeTimeout = setTimeout(action(() => {
			this.removed = true;
			this.props.rootStore.removeElement(this.props.element.id);
		}), Math.random() * 20000 + 5000)
	}

	componentWillUnmount() {
		clearInterval(this.calculateInterval);
		clearTimeout(this.removeTimeout);
	}

	calculateAnimation = action(() => {
		this.animationCounter++;
		this.anchorX = this.endX;
		this.anchorY = this.endY;
		let angle = Math.random() * 2 * Math.PI;
		let bounding = this.props.rootStore.mainLayerRef.current.getBoundingClientRect();
		let thisBounding = this.divRef.current.getBoundingClientRect();
		let circleRadius = _.max([bounding.width, bounding.height]) / 1.5 +
			_.max([thisBounding.width, thisBounding.height]);
		this.endX = bounding.width / 2 + circleRadius * Math.cos(angle);
		this.endY = bounding.height / 2 + circleRadius * Math.sin(angle);

		this.keyframes = `
			@keyframes FlyingElementX${this.props.element.id}_${this.animationCounter} {
			 	from { transform: translateX(${this.anchorX}px); }
			 	to { transform: translateX(${this.endX}px); }
			}
			@keyframes FlyingElementY${this.props.element.id}_${this.animationCounter} {
			 	from { transform: translateY(${this.anchorY}px); }
			 	to { transform: translateY(${this.endY}px); }
			}
		`;

		this.animationTimingX = `cubic-bezier(${Math.random()}, ${Math.random() * 2 - 1}, ${Math.random()}, ${Math.random() * 2 - 1})`;

		this.animationTimingY = `cubic-bezier(${Math.random()}, ${Math.random() * 2 - 1}, ${Math.random()}, ${Math.random() * 2 - 1})`;
	})

	@computed get style() {
		return {
			width: this.size + "vmin",
			height: this.size + "vmin",
			marginTop: -this.size / 2 + "vmin",
			marginLeft: -this.size / 2 + "vmin",
		};
	}



	@computed get styleTag() {
		return `
			${this.keyframes}
			.FlyingElement__positionX--${this.props.element.id} {
				animation: FlyingElementX${this.props.element.id}_${this.animationCounter};
				animation-timing-function: ${this.animationTimingX};
				animation-fill-mode: forwards;
				animation-duration: ${ANIMATION_DURATION}ms;
			}
			.FlyingElement__positionY--${this.props.element.id} {
				animation: FlyingElementY${this.props.element.id}_${this.animationCounter};
				animation-timing-function: ${this.animationTimingY};
				animation-fill-mode: forwards;
				animation-duration: ${ANIMATION_DURATION}ms;
			}
		`;
	}

	render() {
		if (this.removed) return null;
		return <>
			<style>
				{this.styleTag}
			</style>
			<div className={"FlyingElement"}
				 ref={this.divRef}>
				<div className={`FlyingElement__positionX--${this.props.element.id}`}>
					<div className={`FlyingElement__positionY--${this.props.element.id}`}>
						<div className={"FlyingElement__inners"}
							 style={this.style}/>
					</div>
				</div>
			</div>
		</>
	}
}