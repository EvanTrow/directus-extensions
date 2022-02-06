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
		return res.data.access_token;
	},

	// get users in group with token auth
	getUsers: async function (group, token) {
		return axios
			.get('https://graph.microsoft.com/v1.0/groups/' + group + '/transitiveMembers?$top=999&$select=id,userPrincipalName,givenName,surname,jobTitle,companyName,accountEnabled', {
				headers: { Authorization: 'Bearer '.concat(token) }, // pass token
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error;
			});
	},

	// get manager for user by upn
	getManager: async function (upn, token) {
		return axios
			.get(`https://graph.microsoft.com/v1.0/users/${upn}/manager?$select=id,userPrincipalName`, {
				headers: { Authorization: 'Bearer '.concat(token) }, // pass token
			})
			.then((response) => {
				return response.data.id.toUpperCase();
				// return {
				// 	azureId: response.data.id,
				// 	upn: response.data.userPrincipalName,
				// };
			})
			.catch((error) => {
				return null;
			});
	},
};
