import DisplayComponent from './display.vue';

export default {
	id: 'onboarding-link',
	name: 'Onboarding Link',
	icon: 'content_copy',
	description: 'Copy Link button',
	component: DisplayComponent,
	options: [
		{
			field: 'prefix',
			type: 'string',
			name: '$t:prefix',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '$t:prefix_placeholder',
					trim: false,
				},
			},
		},
		{
			field: 'suffix',
			type: 'string',
			name: '$t:suffix',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					placeholder: '$t:suffix_placeholder',
					trim: false,
				},
			},
		},
	],
	types: ['uuid', 'integer', 'decimal', 'float', 'string'],
};
