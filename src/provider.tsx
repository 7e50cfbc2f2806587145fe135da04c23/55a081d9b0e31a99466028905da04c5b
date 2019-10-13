import React, {Fragment} from 'react';
import {AppProvider} from 'coreact';
import {App} from './app';

export default class Provider extends AppProvider {

	async before() {
		this.context.storagePrefix = "mahan";
		this.application = <App/>;
		this.beginOfHead = <Fragment>
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no"/>
		</Fragment>;
	}
}

