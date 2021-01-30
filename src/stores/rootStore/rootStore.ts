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

interface ISoundSpec {
	once: boolean,
	url: string,
	autostart: boolean,
}

export interface ISound {
	once: boolean,
	url: string,
	autostart: boolean,
	id: number,
}

class RootStore {
	@observable sounds: ISound[] = [];
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

	removeSound = action((sound: ISound) => {
		this.sounds = this.sounds.filter(oldSound => oldSound !== sound);
	})

	addSound = action((sound: ISoundSpec) => {
		let newSound = {
			once: sound.once,
			url: sound.url,
			autostart: sound.autostart,
			id: getUniqNumber(),
		};
		this.sounds.push(newSound);
		this.sounds = this.sounds.slice();
	})
}

let rootStore = new RootStore();

export {
	rootStore,
	RootStore
};

