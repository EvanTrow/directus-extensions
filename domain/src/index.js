import NotFound from './components/notFound.vue';
import ProfileImages from './components/profileImages/profileImages.vue';

export default {
	id: 'domain',
	name: 'Domain',
	icon: 'domain',
	routes: [
		{
			path: '',
			redirect: '/domain/profile-images',
		},
		{
			path: 'profile-images',
			component: ProfileImages,
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

		const permission = permissions.find((permission) => permission.collection === 'domain' && permission.action === 'update');
		return !!permission;
	},
};
