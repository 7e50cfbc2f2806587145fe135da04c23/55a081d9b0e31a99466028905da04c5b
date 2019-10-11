import React, { Component, Fragment } from 'react';
import { binder, consumer, inject } from 'coreact';
import { Routing } from 'coreact/dist/routing';
import {changeHelper, initialize} from "lib/stateFullFetch";
import {TextInput} from "components/textInput";

@consumer
export class Home extends Component {
	@inject routing = binder.bind(this)(Routing);

	rules = ()=>({
		'text': ['نوشته', 'minLength:10']
	});

	state = initialize({
		form: {
			text: 'asdasdasd',
		},
	});

	onChange = changeHelper.call(this, this.rules);

	render() {
		const {messages, form} = this.state;
		return <Fragment>
			<div className="container-slim py-2">
				hello world <span className="badge color-warning">salam</span> hello world
				<div className="vs-2"/>
				<button className="btn btn-primary">
					وارد شوید
				</button>
				<div className="vs-2"/>
				<TextInput name="text" placeholder="مقدار وارد نمایید" postfix="IR" errors={messages} values={form} onChange={this.onChange}/>
				<div className="vs-2"/>
				<button className="fab btn-primary">
					<i className="icon">add</i>
					وارد شوید
				</button>
			</div>
		</Fragment>
	}
}
