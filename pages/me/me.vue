<template>
	<view class="me-wrapper">
		<view class="info-list">
			<c-list>
				<c-list-item link to="/pages/me/avatar">
					<view>头像</view>
					<view slot="extra">
						<view class="avatar">
							<image :src="info.faceImage" mode="widthFix" />
						</view>
					</view>
				</c-list-item>
				<c-list-item link :to="`/pages/me/nickname?nickname=${info.nickname}`">
					<view>名字</view>
					<view slot="extra">
						<text>{{ info.nickname }}</text>
					</view>
				</c-list-item>
				<c-list-item link>
					<view>账号</view>
					<view slot="extra">
						<text>{{ info.username }}</text>
					</view>
				</c-list-item>
				<c-list-item link @on-tap="showGenderPopup">
					<view>性别</view>
					<view slot="extra">
						<text>{{ info.gender === 0 ? '女' : '男' }}</text>
					</view>
				</c-list-item>
				<c-list-item link to="/pages/me/qrcode">
					<view>我的二维码</view>
					<view slot="extra">
						<span class="iconfont icon-iconfontsaoyisao" />
					</view>
				</c-list-item>
			</c-list>
		</view>
		
		<view class="setting-list">
			<c-list>
				<c-list-item link to="/pages/setting/setting">
					<view>设置</view>
				</c-list-item>
			</c-list>
		</view>
	</view>
</template>

<script>
	import CList from '@/components/list/list.vue'
	import CListItem from '@/components/list/list-item.vue'
	import { setGender } from '@/apis/user-api.js'
	
	export default {
		components: {
			CList,
			CListItem
		},
		data() {
			return {
			}
		},
		computed: {
			info() {
				// vuex
				return this.$store.state.user.userInfo
			}
		},
		methods: {
			showGenderPopup() {
				uni.showActionSheet({
				    itemList: ['女', '男'],
				    success: res => {
						const index = res.tapIndex
						this.updateGender(index)
				    }
				})
			},
			async updateGender(gender) {
				uni.showLoading()
				await setGender(gender)
				await this.$store.dispatch('user/fetchUserInfo')
				uni.hideLoading()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
	.me-wrapper {
		
		.info-list {
			margin-bottom: 16rpx;
			
			.avatar {
				margin: 16rpx 0;
				width: 98rpx;
				height: 98rpx;
				
				image {
					width: 100%;
					height: 100%;
					border-radius: $uni-border-radius-base;
				}
			}
		}
	}
</style>
