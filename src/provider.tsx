import React, { Fragment } from 'react';
import { AppProvider, guid, metadataOf } from 'coreact';
import { App } from './app';
import { config, configuration, requestMiddleware } from 'netlayer';
import { Mahan } from 'lib/mahan';
import { fetchDriver } from 'lib/fetchDriver';
import {Spinner} from "components/spinner";

export default class Provider extends AppProvider {

	async before() {
		configuration.withCredentials = false;
		configuration.baseUrl = this.context.environment === 'client' ? `${this.context.baseUrl}${Mahan.api}` : Mahan.api;
		config(fetchDriver);
		this.context.storagePrefix = "mahan";
		this.application = <App/>;
		this.splash = <div className="spinner-overlay"><Spinner/></div>;
		this.beginOfHead = <Fragment>
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no, user-scalable=no"/>
		</Fragment>;
		this.beginOfBody = <noscript>
			Please enable javascript to proceed.
		</noscript>;
	}
}

