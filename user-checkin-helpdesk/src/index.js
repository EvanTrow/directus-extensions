// {
// 	payload: {
// 		user: '3BF39B2D-F5E7-403D-9E41-3EE12B640BB5',
// 		issues: 'iss',
// 		roadBlocks: 'block',
// 		userImpact: 2,
// 		ourPriority: 2,
// 		notes: 'test notes',
// 	},
// 	key: 'b17a2928-4f65-4712-b186-935510a6f0f9',
// 	collection: 'userCheckin',
// }

import axios from 'axios';
import moment from 'moment';

import auth from './auth.json';
// {
// 	"helpdesk_token": "Basic base64 encoded authenication"
// }

export default ({ action }) => {
	action('userCheckin.items.create', async (payload, { schema, accountability, database }) => {
		console.log('User checkin created!', payload);

		if (payload.payload.ticketRequired) {
			console.log('Create Ticket!');

			const userSql = await database.raw(`select top(1) * from directus_users where id = '${payload.payload.user}'`);
			const userData = userSql[0];

			axios
				.request({
					method: 'POST',
					url: 'https://pennair.freshservice.com/api/v2/tickets',
					headers: {
						'Content-Type': 'application/json',
						Authorization: auth.helpdesk_token,
					},
					data: {
						email: userData.email,
						subject: `User Checkin - ${moment().format('l')}`,
						description: `<div><b>Issues:</b><br>${payload.payload.issues}<br><br><br><b>Road Blocks:</b><br>${payload.payload.roadBlocks}<br><br><br><b>Notes:</b><br>${payload.payload.notes}</div>`,
						status: 8,
						source: 1001,
						impact: payload.payload.userImpact | 1,
						priority: payload.payload.ourPriority | 1,
					},
				})
				.then(async (response) => {
					console.log(response.data);

					const ticket = response.data.ticket;
					await database.raw(`update userCheckin set status = 'inprogress', ticketUrl = 'https://helpdesk.pennair.com/helpdesk/tickets/${ticket.id}' where id = '${payload.key}'`);

					axios
						.request({
							method: 'PUT',
							url: `https://pennair.freshservice.com/api/v2/tickets/${ticket.id}`,
							headers: {
								'Content-Type': 'application/json',
								Authorization: auth.helpdesk_token,
							},
							data: {
								impact: payload.payload.userImpact | 1,
								priority: payload.payload.ourPriority | 1,
								custom_fields: {
									status_notes: `${payload.key}`,
								},
							},
						})
						.then(function (response) {
							console.log(response.data);
						})
						.catch(function (error) {
							console.error(error);
						});
				})
				.catch((error) => {
					console.error(error);
				});
		}
	});
};
