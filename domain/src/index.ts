import { defineModule } from '@directus/extensions-sdk';

import OrgChart from './routes/orgChart.vue';
import NotFound from './routes/notFound.vue';


export default defineModule({
	id: 'domain',
	name: 'Domain',
	icon: 'domain',
	routes: [
		{
			path: '',
			redirect: '/domain/orgchart',
		},
		{
			path: 'orgchart',
			component: OrgChart,
		},
		{
			name: 'settings-not-found',
			path: ':_(.+)+',
			component: NotFound,
		},
	],
	preRegisterCheck(user, permissions) {
		const admin = user.role.admin_access;
		if (admin) return true;

		const permission = permissions.find(
			(permission) => permission.collection === 'directus_users' && permission.action === 'read'
		);
		return !!permission;
	},
});
