import React, {PureComponent, ReactNode} from 'react';
import throttle from "lodash/throttle";


export interface ScrollListenerProps {
	children: (offset: number) => ReactNode;
}

export class ScrollListener extends PureComponent<ScrollListenerProps> {
	app: HTMLElement = null;
	state = {
		offset: 0,
	};

	scroll = throttle(() => {
		this.setState({
			offset: this.app.scrollTop,
		})
	}, 500);

	windowScroll = () => {
		this.scroll();
	};

	componentDidMount(): void {
		this.app = document.getElementById('app');
		this.app.addEventListener('scroll', this.windowScroll)
	}

	componentWillUnmount(): void {
		this.app.removeEventListener('scroll', this.windowScroll)
	}

	render() {
		return this.props.children(this.state.offset)
	}
}
