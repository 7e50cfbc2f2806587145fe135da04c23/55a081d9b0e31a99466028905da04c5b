import React, {Component, Fragment} from 'react';
import {CodeInput} from "components/codeInput";
import {binder, consumer, inject, Routing} from "coreact";
import {AuthService} from "services/authService";
import {Routes} from "lib/routes";
import {Link} from "react-router-dom";
import {attach, changeHelper, initialize, RequestWrapper} from "lib/stateFullFetch";

@consumer
export class LoginConfirm extends Component {
	@inject auth = binder.bind(this)(AuthService);
	@inject routing = binder.bind(this)(Routing);
	rules = () => ({
		mobileNumber: ['شماره همراه مالک', 'required', 'mobile'],
	});

	state = initialize({
		form: {
			code: '',
		},
		remaining: Math.floor((this.auth.remaining - Date.now()) / 1000),
	});
	timer: any = null;

	send = async () => {
		let result: any = null;
		await attach.call(this, {
			task: async () => {
				result = await this.auth.send();
				
				this.auth.remaining = Date.now() + (result.resendAt * 1000);
				this.auth.codeSent = true;
				return {
					remaining: result.resendAt
				};
			},
			after: () => {
				this.startTimer();
			}
		})
	};

	onChange = changeHelper.call(this, this.rules);

	startTimer = () => {
		if (this.timer)
			clearInterval(this.timer);
		this.timer = setTimeout(() => {
			this.setState({
				remaining: this.state.remaining - 1,
			});
			if (this.state.remaining > 0) {
				this.startTimer()
			}
		}, 1000);
	};

	login = async (code: string) => {
		let token = '';
		await attach.call(this, {
			task: async () => {
				 token = await this.auth.login(code, 'code');
			},
			after: ()=>{
				this.auth.token = token;
				this.auth.registerMiddleware();
			}
		});
	};

	componentDidMount(): void {
		if (!this.auth.codeSent) {
			this.send();
		} else {
			this.startTimer();
		}
	}

	componentWillUnmount(): void {
		if (this.timer)
			clearInterval(this.timer);
	}

	render() {
		const {form, messages, remaining} = this.state;
		return <Fragment>
			<RequestWrapper state={this.state}/>
			<div className="container">
				<div className="vs-3"/>
				<b className="mb-2">رمز پیامکی ارسال شده را وارد کنید.</b>

				<div>
					<span>برای شماره تلفن</span>
					<b className="px-1">{this.auth.mobileNumber}</b>
					<span>یک کد چهار رقمی از طریق پیامک ارسال شد. لطفا کد را وارد کنید.</span>
				</div>
				<div className="vs-2"/>
				<CodeInput
					name="code"
					length={4}
					values={form}
					errors={messages}
					onChange={this.onChange}
					onFill={this.login}
				/>
				<div className="vs-2"/>

				<small>برای دریافت مجدد کد یکی از روشهای زیر را انتخاب کنید.</small>
				<div className="vs-2"/>
				<button className={`button button-primary ${remaining > 0 ? 'disabled' : ''}`} onClick={this.send}>
					<span>ارسال پیام</span>
					{remaining > 0 && <small className="px-1">(ارسال مجدد {remaining})</small>}
				</button>
				<div className="vs-4 v-spacer"/>
				<div className="centered-container">
					<Link to={Routes.loginOtp()}>تغییر شماره موبایل</Link>
				</div>
			</div>
		</Fragment>;
	}
}
