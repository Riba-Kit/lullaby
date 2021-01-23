import {action, observable} from "mobx";
import React from "react";
import _ from "lodash";

let uniqNumber = 0;
function getUniqNumber() {
	return uniqNumber++;
}

export interface IElement {
	initX: number,
	initY: number,
	initX2: number,
	initY2: number,
	id: number,
	needRemove: boolean,
}

class RootStore {
	mainLayerRef: React.RefObject<HTMLDivElement>;
	@observable elements: IElement[] = [];

	addBubble = action((x: number, y: number, x2: number, y2: number) => {
		this.elements.push({
			initX: x, initY: y,initX2: x2, initY2: y2, id: getUniqNumber(), needRemove: false
		});
		this.elements = this.elements.slice();
	});

	removeElements = _.debounce(action(() => {
		this.elements = this.elements.filter(e => !e.needRemove);
	}), 5000, {leading: false, trailing: true});

	removeElement = (id: number) => {
		let found = _.find(this.elements, {id});
		if (found) {
			found.needRemove = true;
			this.removeElements();
		}
	};
}

let rootStore = new RootStore();

export {
	rootStore,
	RootStore
};

