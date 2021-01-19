import React from "react";
import {inject, observer} from "mobx-react";
import {IElement, RootStore} from "stores/rootStore/rootStore";
import {action, computed, observable} from "mobx";
import './FlyingElement.styl';
import _ from "lodash";

interface IMainLayerProps {
	rootStore?: RootStore,
	mainLayerRef: React.RefObject<HTMLDivElement>,
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
							   element={element}
							   mainLayerRef={this.props.mainLayerRef}/>
			)}
		</>
	}
}

@observer
class FlyingElement extends React.Component<{ element: IElement, mainLayerRef: React.RefObject<HTMLDivElement>, }> {

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

	constructor(props) {
		super(props);

		this.anchorX = this.props.element.initX;
		this.anchorY = this.props.element.initY;
		this.endX = this.props.element.initX;
		this.endY = this.props.element.initY;

		this.divRef = React.createRef();
	}

	componentDidMount() {
		this.calculateAnimation();
		this.calculateInterval = setInterval(this.calculateAnimation, 10000);
	}

	componentWillUnmount() {
		clearInterval(this.calculateInterval);
	}

	calculateAnimation = action(() => {
		this.animationCounter++;
		this.anchorX = this.endX;
		this.anchorY = this.endY;
		let angle = Math.random() * 2 * Math.PI;
		let bounding = this.props.mainLayerRef.current.getBoundingClientRect();
		let thisBounding = this.divRef.current.getBoundingClientRect();
		let circleRadius = _.max([bounding.width, bounding.height]) / 2 +
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
		};
	}

	@computed get styleTag() {
		return `
			${this.keyframes}
			.FlyingElement__positionX--${this.props.element.id} {
				animation: FlyingElementX${this.props.element.id}_${this.animationCounter};
				animation-timing-function: ${this.animationTimingX};
				animation-fill-mode: forwards;
				animation-duration: 10s;
			}
			.FlyingElement__positionY--${this.props.element.id} {
				animation: FlyingElementY${this.props.element.id}_${this.animationCounter};
				animation-timing-function: ${this.animationTimingY};
				animation-fill-mode: forwards;
				animation-duration: 10s;
			}
		`;
	}

	render() {
		return <>
			<style>
				{this.styleTag}
			</style>
			<div className={"FlyingElement"}
				 style={this.style}
				 ref={this.divRef}>
				<div className={`FlyingElement__positionX--${this.props.element.id}`}>
					<div className={`FlyingElement__positionY--${this.props.element.id}`}>
						<div className={"FlyingElement__inners"}/>
					</div>
				</div>
			</div>
		</>
	}
}