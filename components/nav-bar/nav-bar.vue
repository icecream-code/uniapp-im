<template>
	<view class="navbar-wrapper">
		<view :class="{navbar: true, fixed: fixed}">
			<view class="status-bar" :style="{height: statusBarHeight + 'px'}" />
			<view class="navbar__main">
				<view class="navbar-left">
					<slot name="left">
						<uni-icons v-if="back" type="back" size="26" @click="goBack" />
					</slot>
				</view>
				<view class="navbar-title">
					<slot></slot>
				</view>
				<view class="navbar-right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
		<view v-if="fixed" :style="{height: navBarHeight + 'px'}" />
	</view>
</template>

<script>
	export default {
		name: 'nav-bar',
		props: {
			back: {
				type: Boolean,
				default: true
			},
			fixed: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0
			}
		},
		created() {
			const sysInfo = uni.getSystemInfoSync()
			this.statusBarHeight = sysInfo.statusBarHeight
			this.navBarHeight = this.statusBarHeight + 44
		},
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar-wrapper {
		width: 100%;
		
		.navbar {
			// border-bottom: 1px solid $uni-border-color;
			width: 100%;
			background-color: $uni-bg-color-grey;
			
			&.fixed {
				position: fixed;
				left: 0;
				top: 0;
			}
			
			&__main {
				display: flex;
				align-items: center;
				height: 88rpx;
				font-size: 32rpx;
				
				.navbar-left,
				.nav-title,
				.navbar-right {
					flex: 1;
					display: flex;
					align-items: center;
					height: 100%;
				}
				
				.navbar-left {
					padding-left: 28rpx;
				}
				
				.navbar-title {
					justify-content: center;
					font-weight: 500;
					white-space: nowrap;
				}
				
				.navbar-right {
					justify-content: flex-end;
					margin-right: 28rpx;
				}
			}
		}
	}
</style>
