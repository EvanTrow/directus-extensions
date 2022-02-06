import PanelComponent from './panel.vue';

export default {
	id: 'metric-extra',
	name: 'Metric Extras',
	description: 'Sum of feild with table join',
	icon: 'functions',
	component: PanelComponent,
	options: [
		{
			field: 'styleDivider',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					icon: 'style',
					title: 'Primary Table',
				},
				special: ['alias', 'no-data'],
			},
		},
		{
			field: 'collection1',
			type: 'string',
			name: 'Collection 1',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
				},
				width: 'half',
			},
		},
		{
			field: 'field1',
			type: 'string',
			name: 'Field 1',
			meta: {
				interface: 'system-field',
				options: {
					collectionField: 'collection1',
					typeAllowList: ['uuid'],
					allowPrimaryKey: true,
					allowNone: true,
				},
				width: 'half',
			},
		},
		{
			field: 'styleDivider',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					icon: 'style',
					title: 'Secondary Table',
				},
				special: ['alias', 'no-data'],
			},
		},
		{
			field: 'collection2',
			type: 'string',
			name: 'Collection 2',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
				},
				width: 'half',
			},
		},
		{
			field: 'field2',
			type: 'string',
			name: 'Field 2',
			meta: {
				interface: 'system-field',
				options: {
					collectionField: 'collection2',
					typeAllowList: ['uuid', 'string'],
					allowPrimaryKey: true,
					allowNone: true,
				},
				width: 'half',
			},
		},
		{
			field: 'styleDivider',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					icon: 'style',
					title: 'Sum Feild',
				},
				special: ['alias', 'no-data'],
			},
		},
		{
			field: 'sumfield',
			type: 'string',
			name: 'Sum Field',
			meta: {
				interface: 'system-field',
				options: {
					collectionField: 'collection2',
					typeAllowList: ['integer', 'bigInteger', 'float', 'decimal'],
					allowPrimaryKey: true,
					allowNone: true,
				},
				width: 'half',
			},
		},
		{
			field: 'styleDivider',
			type: 'alias',
			meta: {
				interface: 'presentation-divider',
				options: {
					icon: 'style',
					title: 'Style & Format',
				},
				special: ['alias', 'no-data'],
			},
		},
		{
			field: 'decimals',
			type: 'integer',
			name: '$t:decimals',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					placeholder: '$t:decimals_placeholder',
				},
			},
			schema: {
				default_value: 0,
			},
		},
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
	minWidth: 12,
	minHeight: 5,
};
