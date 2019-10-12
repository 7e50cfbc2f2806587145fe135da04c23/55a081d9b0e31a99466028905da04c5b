import React, {Component, Fragment} from 'react';
import {TextInput} from "components/textInput";
import {Link} from "react-router-dom";
import {Routes} from "lib/routes";
import {binder, consumer, inject, Routing} from "coreact";
import {AuthService} from "services/authService";
import {attach, changeHelper, initialize, RequestWrapper} from "lib/stateFullFetch";

@consumer
export class LoginOtp extends Component {

	@inject auth = binder.bind(this)(AuthService);
	@inject routing = binder.bind(this)(Routing);


	rules = () => ({
		mobileNumber: ['شماره موبایل', 'required', 'mobile'],
	});

	state = initialize({
		form: {
			mobileNumber: this.auth.mobile,
		},
	});

	submit = async (e?: any) => {
		const {mobileNumber} = this.state.form;
		await attach.call(this, {
			task: async () => {
				this.auth.codeSent = false;
				this.auth.mobile = mobileNumber;
				const result = await this.auth.send();
				this.auth.remaining = Date.now() + (result.resendAt * 1000);
				this.auth.codeSent = true;
			},
			after: () => {
				this.routing.href = Routes.loginConfirm();
			}
		})
	};

	onChange = changeHelper.call(this, this.rules);

	render() {
		const {form, messages} = this.state;
		return <Fragment>
			<RequestWrapper state={this.state}/>
			<div className="container">
				<div className="vs-3"/>
				<div>لطفا شماره تلفن همراه خود را وارد کنید. رمز پیامکی (کد چهار رقمی) برای تایید شماره شما ارسال خواهد شد.</div>
				<div className="vs-2"/>
				<TextInput
					name="mobileNumber"
					placeholder="شماره موبایل خود را وارد کنید"
					values={form}
					maxLength={11}
					errors={messages}
					onChange={this.onChange}
					number
				/>
				<div className="vs-2"/>

				<button className="btn btn-primary" onClick={this.submit}>
					ارسال کد
				</button>
				<div className="vs-2"/>
				<div>اگر قبلا برای حساب خود رمز عبور را وارد کرده‌اید، می‌توانید با شماره موبایل و رمز عبور نیز وارد شوید.</div>
				<div className="vs-4 v-spacer"/>
				<div className="flex center">
					<Link to={Routes.loginPassword()}>ورود با رمز عبور</Link>
				</div>

			</div>
		</Fragment>;
	}
}
