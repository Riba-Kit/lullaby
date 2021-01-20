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
	id: number,
	needRemove: boolean,
	allowRemove: boolean,
}

const MAX_BUBBLES = 3;

class RootStore {
	mainLayerRef: React.RefObject<HTMLDivElement>;
	@observable elements: IElement[] = [];

	addElement = action((initX: number, initY: number) => {
		this.elements.push({
			initX, initY, id: getUniqNumber(), needRemove: false, allowRemove: false,
		});
		this.elements = this.elements.slice();
		if (this.elements.length > MAX_BUBBLES) {
			for (let i = 0; i < this.elements.length - MAX_BUBBLES; i++) {
				if (!this.elements[i].needRemove) {
					this.elements[i].needRemove = true;
				}
			}
		}
	});

	removeElements = _.debounce(action(() => {
		this.elements = this.elements.filter(e => !e.allowRemove);
	}), 1000, {leading: false, trailing: true});

	removeElement = (element:IElement) => {
		let found = _.find(this.elements, element);
		if (found) {
			found.allowRemove = true;
			this.removeElements();
		}
	};
}

let rootStore = new RootStore();

export {
	rootStore,
	RootStore
};

