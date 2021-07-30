<template>
	<view class="qrcode-wrapper">
		<nav-bar>我的二维码</nav-bar>
		<view class="qrcode__main">
			<image :src="qrCode" mode="widthFix" class="qrcode__main--image" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {
			qrCode() {
				// vuex
				return this.$store.state.user.userInfo.qrCode
			}
		},
		methods: {}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	
	.qrcode-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		
		.qrcode__main {
			display: flex;
			align-items: center;
			height: 100%;
			
			&--image {
				width: 100%;
			}
		}
	}
</style>
