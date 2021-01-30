import React from 'react';
import {inject, observer} from 'mobx-react';
import Sound from 'react-sound';
import {ISound, RootStore} from "stores/rootStore/rootStore";

interface IAudioPlayerProps {
	rootStore?: RootStore
}

@inject('rootStore') @observer
export default class AudioPlayer extends React.Component<IAudioPlayerProps> {

	constructor(props) {
		super(props);
	}

	onFinishedPlaying = (sound: ISound) => {
		if (sound.once) {
			this.props.rootStore.removeSound(sound);
		}
	};

	render() {
		return <>
			{
				this.props.rootStore.sounds.map(sound =>
					<Sound key={sound.id}
						   url={sound.url}
						   autoLoad={true}
						   playStatus={sound.autostart ? Sound.status.PLAYING : undefined}
						   onFinishedPlaying={() => this.onFinishedPlaying(sound)}/>
				)
			}
		</>;
	}
}