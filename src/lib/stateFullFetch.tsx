import React, {Fragment} from "react";

import {optional} from "lib/optional";
import {validate} from "lib/validate";
import {Spinner} from "components/spinner";

export function initialize<T>(state: T) {
	return {
		form: {},
		messages: {},
		enabled: false,
		pending: false,
		succeed: false,
		message: '',
		...state,
	}
}

export async function attach(props: {
	task: () => Promise<any>, failedState?: any,
	after?: () => any,
}) {
	const {task, failedState = {}, after} = props;
	this.setState({
		pending: true,
		succeed: false,
		message: '',
		messages: {},
	});
	try {
		const data = (await task()) || {};
		const state: any = {
			pending: false,
			succeed: true,
			message: '',
			messages: {},
			...data
		};
		this.setState(state, after);
	} catch (e) {
		this.setState({
			pending: false,
			succeed: false,
			message: optional(() => e.payload.message, ''),
			messages: optional(() => e.payload.messages, {}),
			...failedState,
		});
	}
}

export function RequestWrapper(props: { state: any }) {
	const {message, pending, succeed} = props.state;
	return <Fragment>
		{(message && !succeed) && <div className="sticky-top indicate  indicate-error elevation-inset">
			{message}
        </div>}
		{(pending && !succeed) && <div className="spinner-overlay"><Spinner/></div>}
	</Fragment>
}

export function changeHelper(rules: (form?: any) => any, after?: (name: string, value: any) => any) {
	return (name: string, value: any, fn?: (name: string, value: any) => any) => {
		const form = {...this.state.form, [name]: value};
		const messages = validate(form, rules(form));
		const enabled = Object.keys(messages).length == 0;
		this.setState({
			form,
			enabled,
			messages: {
				...this.state.messages,
				[name]: messages[name],
			},
		}, () => {
			if (after) after(name, value);
			if (fn) fn(name, value);
		})
	}
}

export function validator(rules: (form?: any) => any, simple?: boolean) {
	const messages = validate(this.state.form, rules(this.state.form));
	const enabled = Object.keys(messages).length == 0;
	if(simple){
		return this.setState({
			enabled,
			messages: {},
		})
	}
	this.setState({
		enabled,
		messages
	})
}

export function checkForm(rules: (form?: any) => any) {
	const {form} = this.state;
	const messages = validate(form, rules(form));
	const enabled = Object.keys(messages).length == 0;
	if (!enabled) {
		this.setState({enabled, messages});
		return false
	}
	return true
}
