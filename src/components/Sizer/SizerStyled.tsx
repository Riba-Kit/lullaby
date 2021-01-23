import React from 'react';
import {observer, inject} from 'mobx-react';
import {
	observable,
	action,
	computed
} from 'mobx';
import './Sizer.styl';

interface ISizerStyledProps {
	ratio: number,
	width: string,
	className?: string
}

@observer
export default class SizerStyled extends React.Component<ISizerStyledProps> {
	constructor(props) {
		super(props);
	};

	render() {
		let style = {
			paddingTop: `${100 / this.props.ratio}%`,
			width: this.props.width || '100%',
		};
		return (
			<div className={'Sizer '  + (this.props.className || '')} style={style}>
				<div className={'Sizer__content'}>
					{this.props.children}
				</div>
			</div>
		);
	}
}