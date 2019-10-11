require('module-alias/register');
//
const path = require('path');
import express from 'express';
import {Mahan} from "lib/mahan";
import {serverHandler} from 'coreact/dist/serverHandler';

const port = process.env.PORT || 3500;
const isDevelopment = process.env.NODE_ENV === 'development';

(async () => {
	await Mahan.discovery();
	const name = process.env.APP_NAME || '';
	const app = express();
	const basePath = name ? ('/' + name) : '';
	require('coreact/dist/webpack').register(path.resolve(__dirname, '.'), basePath + '/dist/src');
	const Provider = require('./provider').default;
	process.env.APP_NAME = name;
	serverHandler(app, {
		provider: Provider,
		match: basePath + '*',
		assets: isDevelopment ? [
			'/dist/app.js?2',
			'/assets/fonts/fonts.css',
		] : [
			'/dist/app.js?2',
			'/dist/app.css',
			'/assets/fonts/fonts.css',
		],
		enableGzip: true,
		proxy: Mahan.api,
		publicDir: ['/assets', path.resolve(__dirname, '../assets')],
		bundleDir: ['/dist', path.resolve(__dirname, '../bundle' + basePath)],
		webpackOptions: isDevelopment ? require('../webpack.config.js') : {},
	});
	await app.listen(port, () => console.log(`Listening on port ${port}`));
})();

process.on('uncaughtException', (err) => {
	console.log(err);
});
