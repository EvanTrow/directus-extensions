var tokenExpires = null;
var token = null;

import MicrosoftGraph from './MicrosoftGraph';

import axios from 'axios';
import fileUpload from 'express-fileupload';

export default (router, { database }) => {
	router.use(fileUpload());

	async function checkAuth(req, res, next) {
		try {
			if (!req.accountability.user) {
				res.status(401).send('Forbidden request');
			} else {
				next();
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send(error);
		}
	}
	router.use(checkAuth);

	async function checkToken(req, res, next) {
		try {
			if (tokenExpires - 120 < Math.floor(Date.now() / 1000)) {
				const settingsSql = await database.raw(`SELECT TOP(1) AzureSyncEnabled, AzureTenantID, AzureGroupID, AzureAppClientID, ClientSecretAzure ,adminUser FROM settings`);
				const settingsData = settingsSql[0];

				console.log('Getting new token');
				token = await MicrosoftGraph.getToken(settingsData.AzureTenantID, settingsData.AzureAppClientID, settingsData.ClientSecretAzure);
				tokenExpires = token.expires_on;

				next();
			} else {
				next();
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send(error);
		}
	}
	router.use(checkToken);

	router.get('/users/:user/photo', async (req, res) => {
		// console.log(req.params);
		// console.log(user, token.access_token);

		var photo = await MicrosoftGraph.getPhoto(req.params.user, token.access_token);

		if (photo) {
			res.set('Content-Type', 'image/png');
			res.set('Content-Length', photo.length);
			res.end(photo);
		} else {
			res.status(404).send('photo not found');
		}
	});

	router.post('/users/:user/photo', async (req, res) => {
		try {
			if (!req.files || Object.keys(req.files).length === 0) {
				return res.status(400).send('No files were uploaded.');
			}

			// console.log(req.files.image);

			await axios
				.put(`https://graph.microsoft.com/v1.0/users/${req.params.user}/photo/$value`, req.files.image.data, {
					headers: { Authorization: 'Bearer '.concat(token.access_token), 'content-type': 'image/jpeg' },
				})
				.then((imgRes) => {
					res.send('ok');
					// console.log(res);
				})
				.catch((error) => {
					res.status(500).send('error');
					console.log(error);
				});
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	});
};
