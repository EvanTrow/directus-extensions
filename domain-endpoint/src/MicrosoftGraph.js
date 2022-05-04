const axios = require('axios');

module.exports = {
	// get token from Azure
	getToken: async function (tenant, client_id, client_secret) {
		const params = new URLSearchParams();
		params.append('grant_type', 'client_credentials');
		params.append('client_id', client_id);
		params.append('client_secret', client_secret);
		params.append('resource', 'https://graph.microsoft.com');
		const res = await axios.post('https://login.microsoftonline.com/' + tenant + '/oauth2/token', params);
		return res.data;
	},

	getPhoto: async function (user, token) {
		return axios
			.request({
				method: 'GET',
				url: `https://graph.microsoft.com/v1.0/users/${user}/photos/240x240/$value`,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				responseType: 'arraybuffer',
				responseEncoding: 'binary',
			})
			.then((response) => {
				if (response.status !== 404) {
					return response.data;
				} else {
					return false;
				}
			})
			.catch((e) => {
				// console.log(e);
				return false;
			});
	},
};
