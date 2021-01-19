import {action, observable} from "mobx";

let uniqNumber = 0;
function getUniqNumber() {
	return uniqNumber++;
}

export interface IElement {
	initX: number,
	initY: number,
	id: number,
}

class RootStore {
	@observable elements: IElement[] = [];

	addElement = action((initX: number, initY: number) => {
		this.elements.push({
			initX, initY, id: getUniqNumber(),
		});
		this.elements = this.elements.slice();
	});
}

let rootStore = new RootStore();

export {
	rootStore,
	RootStore
};

