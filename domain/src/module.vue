<template>
	<private-view title="Organization Chart">
		<template #headline><v-breadcrumb :items="[{ name: 'domain', to: '/domain' }]" /></template>
		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="domain" />
			</v-button>
		</template>

		<template #navigation>
			<domain-navigation />
		</template>
	</private-view>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';

import DomainNavigation from './components/navigation.vue';

export default defineComponent({
	components: { DomainNavigation },
});
</script>
