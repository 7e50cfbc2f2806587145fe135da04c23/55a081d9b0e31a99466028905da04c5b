import React, {Component, Fragment} from 'react';
import {TextInput} from "components/textInput";
import {Link} from "react-router-dom";
import {Routes} from "lib/routes";
import {PasswordInput} from "components/passwordInput";
import {binder, consumer, inject} from "coreact";
import {AuthService} from "services/authService";
import {Spinner} from "components/spinner";
import {attach, changeHelper, initialize, RequestWrapper} from "lib/stateFullFetch";

@consumer
export class LoginPassword extends Component {

	@inject auth = binder.bind(this)(AuthService);
	rules = () => ({
		mobileNumber: ['شماره موبایل', 'required', 'mobile'],
		password: ['رمز عبور', 'required'],
	});

	state = initialize({
		form: {
			mobileNumber: this.auth.mobile,
			password: '',
		},
	});

	submit = async (e?: any) => {
		const {mobileNumber} = this.state.form;
		let token = '';
		await attach.call(this, {
			task: async () => {
				this.auth.mobile = mobileNumber;
				token = await this.auth.login(this.state.form.password, 'password');
			},
			after: ()=>{
				this.auth.token = token;
				this.auth.registerMiddleware();
			}
		});
	};

	onChange = changeHelper.call(this, this.rules);


	render() {
		const {form, messages} = this.state;
		return <Fragment>
			<RequestWrapper state={this.state}/>
			<div className="container">
				<div className="vs-3"/>
			<TextInput
				name="mobileNumber"
				placeholder="شماره موبایل خود را وارد کنید"
				errors={messages}
				values={form}
				onChange={this.onChange}
				number
			/>
			<div className="vs-2"/>
			<PasswordInput
				name="password"
				placeholder="رمز عبور خود را وارد کنید"
				errors={messages}
				values={form}
				onChange={this.onChange}
			/>
			<div className="vs-2"/>
			<button className="button button-primary" onClick={this.submit}>
				ورود به حساب کاربری
			</button>
			<div className="vs-4 v-spacer"/>
			<div className="centered-container">
				<Link to={Routes.loginOtp()}>ورود با رمز پیامکی</Link>
			</div>
			</div>
		</Fragment>;
	}
}
