<template>
	<button :class="['c-btn', type]" @click="click">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: 'c-btn',
		emits: ['click'],
		props: {
			type: {
				type: String,
				default: 'success'
			}
		},
		data() {
			return {
			}
		},
		methods: {
			click() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-btn {
		margin: 0;
		padding: 16rpx 24rpx;
		line-height: 1;
		font-size: 30rpx;
		color: #fff;
		
		&.success {
			background-color: $uni-color-success;
		}
		&.error {
			background-color: $uni-color-error;
		}
	}
</style>
