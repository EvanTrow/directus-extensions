<template>
	<div>
		<input style="position: fixed; top: -50px" v-on:focus="$event.target.select()" ref="clone" readonly :value="prefix + value + suffix" />
		{{ prefix }}{{ value }}{{ suffix }}
		<v-button class="header-icon" small rounded icon exact @click.stop="triggerClick">
			<v-icon name="content_copy" />
		</v-button>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: null,
		},
		prefix: {
			type: String,
			default: '',
		},
		suffix: {
			type: String,
			default: '',
		},
	},

	methods: {
		triggerClick() {
			this.$refs.clone.focus();
			document.execCommand('copy');
		},
	},
};
</script>
