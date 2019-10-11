import {observable, persist, RequestContext, save, service, ServiceEvents} from "coreact";
import {request, requestMiddleware} from "netlayer";
import {optional} from "lib/optional";
import cookie from "js-cookie";


function parseClientName(useragent: any) {
	let screen = '';
	if (useragent.isMobile) {
		screen = 'mobile'
	}
	if (useragent.isDesktop) {
		screen = 'desktop'
	}
	return `${useragent.platform}/${screen}/${useragent.browser}:${useragent.version}`
}

const gateway = 'ApNative';

@service
export class AuthService implements ServiceEvents {
	@save clientName: any = '';
	@observable @save token: string = '';
	@save mobileNumber: string = '';
	@save fullName: string = '';
	@save id: number = 0;


	@persist
	codeSent: boolean = false;
	@persist
	remaining: number = 0;
	@persist
	mobile: string = '';


	async onServerLoad(context: RequestContext) {
		this.clientName = parseClientName(context.useragent);
		const asanToken = optional(() => context.body.startupData.token, '');
		if (asanToken) {
			try {
				const user = (await request<{
					id: number;
					fullName: string;
					mobileNumber: string;
					token: string;
				}>({
					url: '/identity/login',
					method: 'GET',
					headers: {
						'Client-name': this.clientName,
						'App-Gateway': gateway,
						'Auth-Token': asanToken,
					}
				}));
				this['id'] = user.payload.id;
				this['fullName'] = user.payload.fullName;
				this['mobileNumber'] = user.payload.mobileNumber;
				this.token = user.payload.token;
				this.registerMiddleware();
			} catch (e) {
			}
		}else {
			if (context.cookies.kind) {
				try {
					const {id, mobileNumber, fullName} = await this.authorize(context.cookies.kind);
					this.id = id;
					this.mobileNumber = mobileNumber;
					this.fullName = fullName;
					this.token = context.cookies.kind;
					this.registerMiddleware();
				} catch (e) {
				}
			}
		}
	}

	async onClientLoad(context: RequestContext) {
		this.registerMiddleware()
	}


	async find(mobile: number) {
		try {
			const user = await request<{
				name: string;
			}>({
				url: '/identity/find/' + mobile,
				method: 'GET',
			});
			return user.payload.name;
		} catch (e) {
			return '';
		}
	}

	send = async () => {
		return (await request<{ resendAt: number }>({
			url: `/identity/otp/${this.mobile}/send`,
			headers: {
				'Client-Name': this.clientName,
				'App-Gateway': gateway,
			},
			method: 'GET'
		})).payload;
	};

	login = async (password: string, type: 'code' | 'password') => {
		try {
			const data = await request<{ id: number, fullName: string, token: string, mobileNumber: string }>({
				url: `/identity/otp`,
				method: 'POST',
				headers: {
					'Client-Name': this.clientName,
					'App-Gateway': gateway,
				},
				payload: {
					mobileNumber: this.mobile,
					[type]: password,
				},
			});
			const {id, token, fullName, mobileNumber} = data.payload;
			this.id = id;
			this.fullName = fullName;
			this.mobileNumber = mobileNumber;
			cookie.set('kind', token);
			return token;
		} catch (e) {
			throw e;
		}
	};


	authorize = async (token: string) => {
		try {
			const res = await request<{ id: number, fullName: string, mobileNumber: string }>({
				url: `/identity/current`,
				headers: {
					'Client-Name': this.clientName,
					'App-Gateway': gateway,
					'Authorization': `Bearer ${token}`,
				},
				method: 'GET',
			});
			return res.payload;
		} catch (e) {
			throw e;
		}
	};
	registerMiddleware = () => {
		if (this.token) {
			requestMiddleware('auth', (request) => ({
				...request,
				headers: {
					'Client-name': this.clientName,
					'App-Gateway': gateway,
					'Authorization': `Bearer ${this.token}`,
					...request.headers,
				}
			}))
		}
	};

	logout = () => {
		this.mobileNumber = '';
		this.fullName = '';
		this.id = 0;
		cookie.remove('kind');
		requestMiddleware('auth', null);
		this.token = '';
	}

}
