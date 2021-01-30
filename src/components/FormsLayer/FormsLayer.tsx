import React from "react";
import {inject, observer} from "mobx-react";
import {IElement, RootStore} from "stores/rootStore/rootStore";
import {action, computed, observable} from "mobx";
import './FlyingElement.styl';
import _ from "lodash";
const bubble = require("./bubble.mp3");

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
const INITIAL_ANIMATION_DURATION = 5000;

@inject("rootStore") @observer
class FlyingElement extends React.Component<{ element: IElement, rootStore?: RootStore }> {

	anchorX: number;
	anchorY: number;
	endX: number;
	endY: number;
	startX: number;
	startY: number;
	divRef: React.RefObject<HTMLDivElement>;
	@observable keyframes: string;
	@observable animationTimingX: string;
	@observable animationTimingY: string;

	animationCounter: number = 0;

	calculateInterval: NodeJS.Timeout;
	initialTimeout: NodeJS.Timeout;
	removeTimeout: NodeJS.Timeout;

	size: number;
	@observable removed = false;

	initialKeyframes: string;

	constructor(props) {
		super(props);

		this.anchorX = this.props.element.initX2;
		this.anchorY = this.props.element.initY2;
		this.endX = this.anchorX;
		this.endY = this.anchorY;
		this.size = Math.random() * 12 + 2;

		this.divRef = React.createRef();
		this.initialKeyframes = `
			@keyframes InitialFlyingElement${this.props.element.id} {
			 	from { transform: translateX(${this.props.element.initX - this.anchorX}px) translateY(${this.props.element.initY - this.anchorY}px) scale(0);}
			 	to { transform: translateX(0) translateY(0) scale(1) ; }
			}			
		`;
	}

	componentDidMount() {
		this.initialTimeout = setTimeout(() => {
			this.calculateAnimation();
			this.calculateInterval = setInterval(this.calculateAnimation, ANIMATION_DURATION);
			this.removeTimeout = setTimeout(() => this.killBubble(), Math.random() * 20000 + 50000);
		}, 0);
	}

	componentWillUnmount() {
		clearInterval(this.calculateInterval);
		clearTimeout(this.removeTimeout);
		//clearTimeout(this.initialTimeout);
	}

	killBubble = action(() => {
		if (this.removed) return;
		this.removed = true;
		this.props.rootStore.addSound({
			once: true,
			autostart: true,
			url: bubble
		});
		this.props.rootStore.removeElement(this.props.element.id);
	});

	calculateAnimation = action(() => {
		this.animationCounter++;
		this.startX = this.endX;
		this.startY = this.endY;
		let angle = Math.random() * 2 * Math.PI;
		let bounding = this.props.rootStore.mainLayerRef.current.getBoundingClientRect();
		let thisBounding = this.divRef.current.getBoundingClientRect();
		let circleRadius = _.max([bounding.width, bounding.height]) / 1.5 +
			_.max([thisBounding.width, thisBounding.height]);
		this.endX = bounding.width / 2 + circleRadius * Math.cos(angle);
		this.endY = bounding.height / 2 + circleRadius * Math.sin(angle);

		this.keyframes = `
			@keyframes FlyingElementX${this.props.element.id}_${this.animationCounter} {
			 	from { transform: translateX(${this.startX - this.anchorX}px); }
			 	to { transform: translateX(${this.endX - this.anchorX}px); }
			}
			@keyframes FlyingElementY${this.props.element.id}_${this.animationCounter} {
			 	from { transform: translateY(${this.startY - this.anchorY}px); }
			 	to { transform: translateY(${this.endY - this.anchorY}px); }
			}
		`;

		this.animationTimingX = `cubic-bezier(${Math.random()}, ${
			this.animationCounter === 1 ? 0 : Math.random() * 2 - 1
		}, ${Math.random()}, ${Math.random() * 2 - 1})`;

		this.animationTimingY = `cubic-bezier(${Math.random()}, ${
			this.animationCounter === 1 ? 0 : Math.random() * 2 - 1
		}, ${Math.random()}, ${Math.random() * 2 - 1})`;
	})

	@computed get style() {
		return {
			width: this.size + "vmin",
			height: this.size + "vmin",
			marginTop: -this.size / 2 + "vmin",
			marginLeft: -this.size / 2 + "vmin",
			top: `${this.anchorY}px`,
			left: `${this.anchorX}px`,
		};
	}

	@computed get initialStyleTag() {
		return `
			${this.initialKeyframes}
			.InitialFlyingElement__position--${this.props.element.id} {				
				animation: InitialFlyingElement${this.props.element.id};
				animation-timing-function: easy-out;
				animation-fill-mode: forwards;
				animation-duration: ${INITIAL_ANIMATION_DURATION}ms;
				transform-origin: center;
			}			
		`;
	}

	@computed get styleTag() {
		return `
			${this.keyframes || ''}
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

	onMouseDown = () => {
		if ('ontouchstart' in document.documentElement) return;
		this.killBubble();
	}

	onTouchStart = () => {
		this.killBubble();
	}

	render() {
		if (this.removed) return null;
		return <div className={"FlyingElement"}
					ref={this.divRef}
					style={this.style}>
			<style>
				{this.initialStyleTag}
				{this.styleTag}
			</style>

			<div className={`InitialFlyingElement__position--${this.props.element.id}`}>
				<div className={`FlyingElement__positionX--${this.props.element.id}`}>
					<div className={`FlyingElement__positionY--${this.props.element.id}`}>
						<div className={"FlyingElement__inners"}>
							<svg viewBox={"0 0 1 1"}>
								<circle cx={0.5} cy={0.5} r={0.5}
										fill={'none'}
										stroke={'none'}
										strokeWidth={0.01}
										onTouchStart={this.onTouchStart}
										onMouseDown={this.onMouseDown}/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
}