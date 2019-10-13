import React, {Component, Fragment} from 'react';
import {binder, consumer, inject} from 'coreact';
import {Routing} from 'coreact/dist/routing';
import {Link} from "react-router-dom";
import {Routes} from "lib/routes";
import {SimpleInput} from "components/simpleInput";
import {changeHelper, initialize} from "lib/stateFullFetch";
import {Outbind} from "outbind";
import {LoginOtp} from "../auth/loginOtp";
import {Tab, TabItem} from "components/tab";
import {ScrollListener} from "components/scrollListener";

@consumer
export class Home extends Component {
	@inject routing = binder.bind(this)(Routing);

	state = initialize({
		authTab: 0,
		form: {
			search: '',
		},
		searchPopup: false,
		offset: 0,
	});

	onChange = changeHelper.call(this, () => ({}));

	show = () => this.setState({searchPopup: true});
	hide = () => this.setState({searchPopup: false});
	changeTab = (tab: any) => this.setState({authTab: tab});

	render() {
		const {form, searchPopup, authTab} = this.state;
		return <Fragment>
			<ScrollListener>
				{(offset) => <div className={`home-navbar ${offset > 100 ? 'is-detached' : ''}`}>
					<div className="container-slim wrapper">
						<div className="links right">
							<i className="icon mobile">menu</i>
							<img src={require('./images/logo.png')} alt="موسسه آموزش عالی ماهان" className="brand"/>
							<Link to={Routes.home()} className="link">تخمین رتبه</Link>
							<Link to={Routes.home()} className="link">محل قبولی</Link>
							<Link to={Routes.home()} className="link">درباره ما</Link>
						</div>
						<div className="links left">
							<Link to={Routes.home()} className="link">نتایج</Link>
							<div className="hs-2"/>
							<Link to={Routes.home()} className="link outline">ورود و ثبت نام</Link>
							<i className="icon outlined mobile">favorite_border</i>
							<i className="icon outlined mobile">account_circle</i>
						</div>
					</div>
				</div>}
			</ScrollListener>
			<div className="home-banner">
				<img className="background" src={require('./images/banner.jpg')} alt=""/>
				<div className="container-slim">
					<div className="home-slogan">رتبه و محل قبولی در آزمون کارشناسی ارشد</div>
					<div className={`home-lookup ${searchPopup ? 'show-backdrop' : ''}`}>
						<label>رشته خود را انتخاب کنید</label>
						<div className="input" onClick={this.show}>
							<div className="icon">school</div>
							<span>{form.search || 'گرایش خود را وارد کنید'}</span>
							{searchPopup && <Outbind onClick={this.hide}>
								<div className="dropdown">
									<div className="search-wrapper">
										<i className="icon">search</i>
										<SimpleInput
											name="search"
											placeholder="گرایش خود را وارد کنید"
											values={form}
											onChange={this.onChange}
											autoFocus
										/>
									</div>
									<div className="content">
										<div className="item">
											<i className="icon">school</i>
											<span className="title">الکترمغناطیس</span>
											<span className="postfix">مهندسی برق</span>
										</div>
										<div className="item">
											<i className="icon">school</i>
											<span className="title">میکرونانوالکتریک</span>
											<span className="postfix">مهندسی برق</span>
										</div>
										<div className="item">
											<i className="icon">school</i>
											<span className="title">هوش مصنوعی</span>
											<span className="postfix">مهندسی کامپیوتر</span>
										</div>
										<div className="item">
											<i className="icon">school</i>
											<span className="title">میکرونانوالکتریک</span>
											<span className="postfix">مهندسی برق</span>
										</div>
									</div>
								</div>
							</Outbind>}
						</div>
						<div className="button btn-primary">
							ادامه و تکمیل
							<i className="icon">keyboard_arrow_left</i>
						</div>
					</div>
				</div>
				<div className={`home-slider ${searchPopup ? 'show-backdrop' : ''}`}>
					<div className="wrapper">
						<div className="item">
							<img src={require('./images/society.svg')} alt=""/>
							<header>خانواده ۲ میلیون نفری ماهان</header>
							<label>ماهان بیش از ۲۰ سال است که در خدمت دانش‌آموختگان سراسر کشور است.</label>
						</div>
						<div className="item">
							<img src={require('./images/home.svg')} alt=""/>
							<header>قبولی تضمینی در کنکور سراسری</header>
							<label>ارائه برنامه درسی، آموزش مستمر در کنار بهترین اساتید کنکور شما را در قبولی یاری
								می‌کند.</label>
						</div>
						<div className="item">
							<img src={require('./images/study.svg')} alt=""/>
							<header>انتشار بیش از ۱۰۰ کتاب کمک درسی</header>
							<label>نگران منابع کنکور نباشید، ما در ماهان بهترین کتاب ها را برای شما گرد هم
								آوردیم.</label>

						</div>
					</div>
				</div>
			</div>
			<div className="vs-5"/>
			<div className="flex center column solid">
				<div className="text-semi-large">سامانه دانشجویان</div>
				<div className="text-semi-large text-danger">ثبت نام کنید</div>
			</div>
			<div className="vs-3"/>
			<div className="container-slim">
				<div className="row">
					<div className="col-4">
						<Tab value={authTab} onChange={this.changeTab}>
							<TabItem label="ورود"/>
							<TabItem label="ثبت نام"/>
						</Tab>
						<LoginOtp/>
					</div>
					<div className="hs-6 h-spacer visible-desktop"/>
					<div className="col-8 flex-center visible-desktop">
						<img src={require('./images/try.svg')} alt=""/>
					</div>
				</div>
			</div>
			<div className="vs-6"/>
		</Fragment>
	}
}
