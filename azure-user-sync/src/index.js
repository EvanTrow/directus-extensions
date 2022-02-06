import MicrosoftGraph from './MicrosoftGraph';

export default ({ schedule }, { database }) => {
	schedule('*/15 * * * *', async () => {
		try {
			const settingsSql = await database.raw(`SELECT TOP(1) AzureSyncEnabled, AzureTenantID, AzureGroupID, AzureAppClientID, ClientSecretAzure ,adminUser FROM settings`);
			const settingsData = settingsSql[0];

			if (settingsData.AzureSyncEnabled) {
				console.log('Azure Sync: Running Azure User Sync...');

				var associatesExport = [];

				var token = await MicrosoftGraph.getToken(settingsData.AzureTenantID, settingsData.AzureAppClientID, settingsData.ClientSecretAzure); // get token with creds
				var users = await MicrosoftGraph.getUsers(settingsData.AzureGroupID, token); // get all users by group ID

				if (users.data) {
					users.data.value.forEach(async (user, i) => {
						// var photo = await MicrosoftGraph.getPhoto(user.mail, token); // get photo by email

						// filter out groups
						if (user['@odata.type'] === '#microsoft.graph.user') {
							var manager = await MicrosoftGraph.getManager(user.userPrincipalName, token); // get manager by email

							// add to associatesExport array
							associatesExport.push({
								id: user.id.toUpperCase(),
								email: user.userPrincipalName,
								first_name: user.givenName,
								last_name: user.surname,
								title: user.jobTitle,
								location: user.companyName,
								status: user.accountEnabled ? 'active' : 'suspended',
								manager: manager,
							});

							if (associatesExport.length === users.data.value.filter((user) => user['@odata.type'] === '#microsoft.graph.user').length) {
								var userSort = sortUsersManagerfirst(associatesExport);
								var currUsers = await database.select('*').from('directus_users').where('provider', '=', 'microsoft');

								var insertedUsers = 0;
								var updatedUsers = 0;
								var archivedUsers = 0;

								for (let index = 0; index < userSort.length; index++) {
									const u = userSort[index];

									const currUser = currUsers.filter((cu) => cu.id == u.id);

									if (currUser.length === 0) {
										// insert new user
										console.log(`Azure Sync: Adding: ${u.id} ${u.email}`);
										await database
											.insert({
												...u,
												provider: 'microsoft',
												external_identifier: u.email,
												email_notifications: false,
											})
											.into('directus_users');

										insertedUsers++;
									} else if (
										currUser.length === 1 &&
										(currUser[0].email != u.email ||
											currUser[0].first_name != u.first_name ||
											currUser[0].last_name != u.last_name ||
											currUser[0].title != u.title ||
											currUser[0].location != u.location ||
											currUser[0].manager != u.manager ||
											currUser[0].status != u.status)
									) {
										console.log(currUser[0], u);

										// update user
										console.log(`Azure Sync: Updating: ${u.id} ${u.email}`);
										await database('directus_users')
											.where('id', '=', u.id)
											.andWhere('provider', '=', 'microsoft')
											.update({ ...u });

										updatedUsers++;
									}
								}

								// mark missing users as archived
								for (let index = 0; index < currUsers.length; index++) {
									const cUser = currUsers[index];

									var archiveUser = associatesExport.filter((au) => au.id == cUser.id);

									if (archiveUser.length == 0 && cUser.email != settingsData.adminUser) {
										console.log(`Azure Sync: Archiving: ${cUser.id} ${cUser.email}`);
										await database('directus_users').where('id', '=', cUser.id).andWhere('provider', '=', 'microsoft').update({ manager: null, status: 'archived' });
										archivedUsers++;
									}
								}

								console.log(`Azure Sync: added ${insertedUsers}, updated ${updatedUsers}, archived ${archivedUsers} users`);
							}
						}
					});
				}
			}
		} catch (error) {
			console.log('Azure Sync: ERROR!', error);
		}
	});
};

function sortUsersManagerfirst(users) {
	var outputUsers = [];

	const subSort = (id, users) => {
		var outputSubUsers = [];
		users
			.filter((u) => u.manager === id)
			.forEach((user) => {
				outputSubUsers.push(user);
				if (users.filter((sa) => sa.manager !== null && sa.manager === user.id).length !== 0) {
					outputSubUsers = outputSubUsers.concat(subSort(user.id, users));
				}
			});
		return outputSubUsers;
	};

	var userWithoutManager = users.filter((u) => u.manager === null);
	if (userWithoutManager.length === 0) {
		console.log('Azure Sync: ERROR! group does not contain top user.');
	} else {
		users
			.filter((u) => u.manager === null)
			.forEach((user) => {
				outputUsers.push(user);
				outputUsers = outputUsers.concat(subSort(user.id, users));
			});
	}

	return outputUsers;
}
