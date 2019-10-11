import {configuration, HttpRequest, HttpResponse} from 'netlayer';
import axios from 'axios';

export const fetchDriver = async (request: HttpRequest): Promise<HttpResponse> => {

	const logger = configuration.logger;

	function log(...args: any[]) {
		logger && logger(...args);
	}

	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		log('request', request);
		const response = await axios({
			url: request.url,
			method: request.method || configuration.method,
			data: ['PUT', 'POST'].includes(request.method) ? request.payload : {},
			params: ['DELETE', 'GET'].includes(request.method) ? request.payload : {},
			timeout: request.timeout || configuration.timeout,
			withCredentials: request.withCredentials || configuration.withCredentials,
			responseType: request.responseType || 'json',
			baseURL: request.baseHref || configuration.baseUrl,
			headers: {
				'Content-Type': 'application/json',
				...request.headers,
			},
			onUploadProgress: request.progress && ((progressEvent) => {
				const totalLength = progressEvent.lengthComputable ?
					progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
				if (totalLength !== null) {
					request.progress('upload', totalLength, progressEvent.loaded);
				}
			}),
		});

		const result = {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			payload: response.data,
		};
		log('response', result);
		return result;

	} catch (e) {
		if (e && e.shit) {
			throw e.shit;
		}
		const error = e as any;
		if (!error || !error.response) {
			throw {} as HttpResponse;
		}
		const result = {
			status: error.response.status,
			statusText: error.response.statusText,
			errorCode: error.code,
			headers: error.response.headers,
			payload: error.response.data,
		};
		log('error', result);
		throw result as HttpResponse;
	}
};
