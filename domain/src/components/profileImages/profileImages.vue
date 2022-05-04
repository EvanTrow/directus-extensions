<template>
	<private-view title="Profile Images">
		<template #headline><v-breadcrumb :items="[{ name: 'Domain', to: '/domain' }]" /></template>
		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="domain" />
			</v-button>
		</template>

		<template #actions> actions </template>

		<ul class="auto-grid">
			<li v-for="(user, i) in users" :key="i">
				<!-- {{ col.collection }} -->

				<card :index="i" :name="user.first_name + ' ' + user.last_name" :user="user.email" />
			</li>
		</ul>

		<template #navigation>
			<domain-navigation />
		</template>
	</private-view>
</template>

<script lang="ts">
// import { useI18n } from 'vue-i18n';.

import { defineComponent } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';

import MicrosoftGraph from '../../MicrosoftGraph';

import DomainNavigation from '../navigation.vue';
import card from './card.vue';

export default defineComponent({
	name: 'ProfileImages',
	components: { DomainNavigation, card },
	setup() {
		const api = useApi();

		const { useCollectionsStore } = useStores();
		const collectionsStore = useCollectionsStore();

		// ...
	},

	data: () => ({
		settings: null,
		token: null,
		users: null,

		File: [],
		url: null,
	}),

	methods: {
		uploadFile(e) {
			this.File = e.target.files;
			console.log(e, this.File);
		},
		dragFile(e) {
			this.File = e.dataTransfer.files;
			console.log(e);
			const file = e.dataTransfer.files[0];
			this.url = URL.createObjectURL(file);
		},
	},
	inject: ['api'],
	mounted() {
		// Get a list of all available collections to use with this module

		this.api.get('/users?limit=-1&sort[]=email&filter[status][_eq]=active').then((res) => {
			this.users = res.data.data;
			console.log(this.users);
		});
	},
});
</script>

<style>
/*
  AUTO GRID
  Set the minimum item size with `--auto-grid-min-size` and you'll
  get a fully responsive grid with no media queries.
*/
.auto-grid {
	--auto-grid-min-size: 16rem;

	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr));
	grid-gap: 1rem;

	margin: 4px;
	padding: 4px;
}

/* Presentational styles */

li {
	/* padding: 5rem 1rem; */
	/* text-align: center; */
	/* font-size: 1.2rem; */
	/* background: #eb4d4b;
	color: #ffffff; */
	list-style-type: none;
}
</style>
