<template>
	<div class="card" @click="handleClick">
		<div class="header">
			<div class="selection-fade"></div>
			<v-skeleton-loader v-if="!photo" />
			<template v-else>
				<v-icon-file v-if="photoError == true" :ext="type" />
				<template v-else>
					<div @dragover.prevent @drop.prevent>
						<input type="file" accept="image/*" :id="'imageInput' + index" @change="uploadFile" style="display: none" />
						<div @drop="dragFile">
							<img v-if="photo" class="image" loading="lazy" :src="photo" alt="" role="presentation" @error="imageLoadError = true" />
						</div>
					</div>

					<!-- <v-icon v-else large name="account_circle" /> -->
				</template>
			</template>
		</div>
		<v-skeleton-loader v-if="!photo" type="text" />
		<template v-else>
			<div class="title">{{ name }}</div>
			<div class="subtitle">{{ user }}</div>
		</template>
	</div>
</template>

<script lang="ts">
import { useApi, useStores } from '@directus/extensions-sdk';

export default {
	name: 'card',
	setup() {
		const api = useApi();

		const { useCollectionsStore } = useStores();
		const collectionsStore = useCollectionsStore();

		// ...
	},
	props: {
		index: {
			type: Int32Array,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		user: {
			type: String,
			default: '',
		},
	},
	data: () => ({
		photo: null,
		photoError: false,

		file: null,
		image: null,
	}),
	methods: {
		handleClick(e) {
			document.getElementById('imageInput' + this.index).click();
		},
		uploadFile(e) {
			this.file = e.target.files[0];
			// this.photo = URL.createObjectURL(this.file);
			this.uploadPhoto();
		},
		dragFile(e) {
			this.file = e.dataTransfer.files[0];
			// this.photo = URL.createObjectURL(this.file);
			this.uploadPhoto();
		},
		imageLoadError() {
			console.log('Image failed to load');
			this.photoError = true;
		},
		uploadPhoto() {
			const blobURL = URL.createObjectURL(this.file);
			const img = new Image();
			img.src = blobURL;
			img.onload = () => {
				// crop image square
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');

				var width = img.width;
				var height = img.height;
				canvas.width = canvas.height = 512;
				ctx.drawImage(
					img,
					width > height ? (width - height) / 2 : 0,
					height > width ? (height - width) / 2 : 0,
					width > height ? height : width,
					width > height ? height : width,
					0,
					0,
					512,
					512
				);

				this.photo = canvas.toDataURL();
				this.image = this.dataURLtoFile(this.photo, 'image.jpg');

				// upload image to endpoint
				const formData = new FormData();
				formData.append('image', this.image);
				this.api
					.post(`/domain-endpoint/users/${this.user}/photo`, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					})
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						console.error(err);
					});
			};
		},

		createBlob(dataURL) {
			var BASE64_MARKER = ';base64,';
			if (dataURL.indexOf(BASE64_MARKER) == -1) {
				var parts = dataURL.split(',');
				var contentType = parts[0].split(':')[1];
				var raw = decodeURIComponent(parts[1]);
				return new Blob([raw], { type: contentType });
			}
			var parts = dataURL.split(BASE64_MARKER);
			var contentType = parts[0].split(':')[1];
			var raw = window.atob(parts[1]);
			var rawLength = raw.length;

			var uInt8Array = new Uint8Array(rawLength);

			for (var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}

			return new Blob([uInt8Array], { type: contentType });
		},
		dataURLtoFile(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);

			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}

			return new File([u8arr], filename, { type: mime });
		},
	},
	inject: ['api'],
	mounted() {
		this.photo = `/domain-endpoint/users/${this.user}/photo?access_token=${this.api.defaults.headers.common.Authorization.split('Bearer ')[1]}`;
	},
};
</script>

<style lang="scss" scoped>
.loading {
	.header {
		margin-bottom: 8px;
	}
}
.card {
	position: relative;
	cursor: pointer;
	.header {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		overflow: hidden;
		background-color: var(--background-normal);
		border-color: var(--primary-50);
		border-style: solid;
		border-width: 0px;
		border-radius: var(--border-radius);
		transition: border-width var(--fast) var(--transition);
		&::after {
			display: block;
			padding-bottom: 100%;
			content: '';
		}
		.image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
		.svg {
			position: absolute;
			width: 75%;
			height: 75%;
			object-fit: contain;
		}
		.type {
			color: var(--foreground-subdued);
			text-transform: uppercase;
		}
		.v-icon {
			--v-icon-color: var(--foreground-subdued);
		}
		.v-skeleton-loader {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.selection-fade {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 48px;
			opacity: 0;
			transition: opacity var(--fast) var(--transition);
			&::before {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-image: linear-gradient(-180deg, rgb(38 50 56 / 0.1) 10%, rgb(38 50 56 / 0));
				content: '';
			}
		}
	}
	&::before {
		position: absolute;
		top: 7px;
		left: 7px;
		z-index: 2;
		width: 18px;
		height: 18px;
		background-color: var(--background-page);
		border-radius: 24px;
		opacity: 0;
		transition: opacity var(--fast) var(--transition);
		content: '';
	}
	.selector {
		--v-icon-color: var(--white);
		--v-icon-color-hover: var(--white);
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 3;
		margin: 4px;
		opacity: 0;
		transition: opacity var(--fast) var(--transition), color var(--fast) var(--transition);
		&:hover {
			opacity: 1 !important;
		}
	}
	&.select-mode {
		.selector {
			opacity: 0.5;
		}
		.header {
			.selection-fade {
				opacity: 1;
			}
		}
	}
	&.selected {
		&::before {
			opacity: 1;
		}
		.selector {
			--v-icon-color: var(--primary);
			--v-icon-color-hover: var(--primary);
			opacity: 1;
		}
		.header {
			border-width: 12px;
			.selection-fade {
				opacity: 1;
			}
		}
	}
	&:hover {
		.selector {
			opacity: 0.5;
		}
		.header {
			.selection-fade {
				opacity: 1;
			}
		}
	}
}
.readonly {
	pointer-events: none;
}
.title,
.subtitle {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: 20px;
	margin-top: 2px;
	overflow: hidden;
	line-height: 1.3em;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.subtitle {
	margin-top: 0px;
	color: var(--foreground-subdued);
}
</style>
