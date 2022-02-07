import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

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
			component: ModuleComponent,
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
