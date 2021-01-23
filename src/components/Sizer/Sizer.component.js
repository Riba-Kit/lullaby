import React from 'react';

export default class Sizer extends React.Component {
	/**
	 * @class
	 * @param props.anchor {string} - 'width' | 'height'
	 * @param props.ratio {number}
	 * @param props.onResize {function}
	 * @param props.updater {number}
	 */
	constructor(props) {
		super(props);

		this.recalculateSize = this.recalculateSize.bind(this);
		this.throttledResize = _.debounce(this.recalculateSize.bind(this), 300, {
			leading: true,
			trailing: true
		});

		this.state = {
			size: 'auto',
			anchor: this.props.anchor
		};

		window.addEventListener('resize', this.throttledResize)
	};

	recalculateSize() {
		if (this.div) {
			let divSize = this.div.getBoundingClientRect();
			if (this.props.anchor === 'contain') {
				let parentSize = this.div.parentNode.getBoundingClientRect();
				let anchor = parentSize.width / parentSize.height > this.props.ratio ? 'height' : 'width';
				let newValue = (parentSize.width / parentSize.height > this.props.ratio)
									? +parentSize.height * this.props.ratio + 'px'
									: +parentSize.width / this.props.ratio + 'px';
				if (newValue !== this.state.size || anchor !== this.state.anchor) {
					this.setState({
						size: newValue,
						anchor
					}, () => {
						if (this.props.onResize) this.props.onResize();
					});
				}
			} else if (this.props.anchor === 'cover') {
				let parentSize = this.div.parentNode.getBoundingClientRect();
				let anchor = parentSize.height < parentSize.width ? 'width' : 'height';
				let newValue = (parentSize.height < parentSize.width)
									? +parentSize.width * this.props.ratio + 'px'
									: +parentSize.height * this.props.ratio + 'px';
				if (newValue !== this.state.size || anchor !== this.state.anchor) {
					this.setState({
						size: newValue,
						anchor
					}, () => {
						if (this.props.onResize) this.props.onResize();
					});
				}
			} else if (this.props.anchor === 'height') {
				let newValue = +divSize.height * this.props.ratio + 'px';
				//if (newValue !== this.state.size) {
					this.setState({
						size: newValue,
						anchor: 'height'
					}, () => {
						if (this.props.onResize) this.props.onResize();
					});
				//}
			} else if (this.props.anchor === 'width') {
				let newValue = +divSize.width / this.props.ratio + 'px';
				//if (newValue !== this.state.size) {
					this.setState({
						size: newValue,
						anchor: 'width'
					}, () => {
						if (this.props.onResize) this.props.onResize();
					});
				//}
			}
		}
	}

	componentDidMount() {
		this.recalculateSize();
	}

	componentDidUpdate(prevProps) {
		if (this.anchorStyleUpdating) {
			this.recalculateSize();
			this.anchorStyleUpdating = false;
		}

		if (prevProps.anchor !== this.props.anchor) {
			this.anchorStyleUpdating = true;
			this.setState({anchor: this.props.anchor});
		} else if (prevProps.ratio !== this.props.ratio
			|| prevProps.updater !== this.props.updater) {
			this.recalculateSize();
		}
	}

	render() {

		let style = this.state.anchor === 'height'
						? {
				height: '100%',
				width: this.state.size
			}
						: {
				width: '100%',
				height: this.state.size
			};
		return (
			<div ref={div => {this.div = div;}}
				  style={style} className={this.props.className || ''}>
				{this.props.children}
			</div>
		);
	}
}