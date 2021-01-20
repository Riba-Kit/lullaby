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
}

class RootStore {
	mainLayerRef: React.RefObject<HTMLDivElement>;
	@observable elements: IElement[] = [];

	addElement = action((initX: number, initY: number) => {
		this.elements.push({
			initX, initY, id: getUniqNumber(), needRemove: false
		});
		this.elements = this.elements.slice();
	});

	removeElements = _.debounce(action(() => {
		this.elements = this.elements.filter(e => !e.needRemove);
	}), 1000, {leading: false, trailing: true});

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

