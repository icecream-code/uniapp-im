<template>
	<view :class="['text-input', fullscreen ? 'fullscreen' : '']">
		<nav-bar>
			<template v-slot:left>
				<text @click="cancel">取消</text>
			</template>
			<template v-slot:default>
				<text>{{ title }}</text>
			</template>
			<template v-slot:right>
				<button class="nav-btn" :disabled="!canDone" @click="done">完成</button>
			</template>
		</nav-bar>
		<input v-model="value" focus class="input" type="text" />
	</view>
</template>

<script>
	export default {
		name: 'text-input',
		emits: ['done', 'cancel'],
		props: {
			title: {
				type: String,
				default: ''
			},
			initValue: {
				type: String,
				default: ''
			},
			fullscreen: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				value: ''
			}
		},
		computed: {
			canDone() {
				return this.value && this.value.length && this.value !== this.initValue
			}
		},
		created() {
			this.value = this.initValue
		},
		mounted() {
			this.value = this.initValue // 微信小程序mounted赋值才成功
		},
		methods: {
			done() {
				this.$emit('done', this.value)
			},
			cancel() {
				this.$emit('cancel')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text-input {
		background-color: $uni-bg-color-grey;
		
		&.fullscreen {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			bottom: constant(safe-area-inset-bottom);
			bottom: env(safe-area-inset-bottom);
			left: 0;
			z-index: 998;
		}
		
		.nav-btn {
			margin: 0;
			padding: 16rpx 24rpx;
			line-height: 1;
			font-size: 30rpx;
			color: #fff;
			background-color: $uni-color-success;
			
			&[disabled] {
				color: rgba(0,0,0,.3);
				background-color: #f7f7f7;
			}
		}
		
		.input {
			height: 88rpx;
			padding: 0 16rpx;
			background-color: #fff;
		}
	}
</style>
