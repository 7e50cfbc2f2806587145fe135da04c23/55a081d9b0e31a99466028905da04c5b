import React, {PureComponent, ReactNode} from 'react';
import {binder, consumer, inject, observe} from "coreact";
import {AuthService} from "services/authService";


export interface GatewayProps {
	children: ReactNode,
	fallback?: ReactNode,
	callback?: () => any;
}

@consumer
export class Gateway extends PureComponent<GatewayProps> {
	@inject auth = binder.bind(this)(AuthService);

	@observe(AuthService)
	observe = (key: string, value: any) => {
		if (key === 'token') {
			this.setState({[key]: value}, ()=>{
				if (value) {
					this.props.callback();
				}
			});
		}
	};

	componentDidMount(): void {
		if (this.auth.token) {
			this.props.callback();
		}
	}

	render() {
		const {children, fallback} = this.props;
		if (this.auth.token)
			return children;
		return fallback ? fallback : null;
	}
}
