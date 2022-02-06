<template>
	<div class="metric type-title selectable" :class="{ 'has-header': showHeader }">
		<v-progress-circular v-if="loading" indeterminate />
		<div v-else>
			<span class="prefix">{{ prefix }}</span>
			<span class="value">{{ displayValue }}</span>
			<span class="suffix">{{ suffix }}</span>
		</div>
	</div>
</template>

// v-else :style="{ color }"

<script>
import { useApi } from '@directus/extensions-sdk';

export default {
	props: {
		id: String,
		showHeader: {
			type: Boolean,
			default: false,
		},
		collection1: {
			type: String,
			required: true,
		},
		field1: {
			type: String,
			required: true,
		},
		collection2: {
			type: String,
			required: true,
		},
		field2: {
			type: String,
			required: true,
		},
		sumfield: {
			type: String,
			required: true,
		},
		decimals: {
			type: Number,
			default: 0,
		},
		prefix: {
			type: String,
			default: null,
		},
		suffix: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			headers: [],
			displayValue: '',
			loading: true,
		};
	},
	created() {
		this.fetchData();
	},
	methods: {
		async fetchData() {
			this.loading = true;

			const api = useApi();
			const { data } = await api(`metric-extra-api/${this.id}`);
			this.displayValue = data
				.toFixed(this.decimals)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			this.loading = false;
		},
	},
};
</script>

<style scoped>
.metric {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	font-weight: 800;
	font-size: 42px;
	line-height: 52px;
}
.metric.has-header {
	height: calc(100% - 16px);
}
</style>
