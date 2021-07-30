<template>
	<view class="friend-page">
		<nav-bar />
		
		<uni-list-item>
			<!-- 自定义 header -->
			<view slot="header" class="slot-header">
				<image class="image" :src="info.faceImage" mode="widthFix" @click="viewAvatar(info.faceImage)" />
			</view>
			<!-- 自定义 body -->
			<view slot="body" class="slot-body">
				<view class="markname">
					<text> {{ info.markName || info.nickname }}</text>
					<span v-if="info.gender === 0" class="female iconfont icon-Female-User" />
					<span v-else class="male iconfont icon-Male-" />
				</view>
				<view v-if="!isMyself" class="text">昵称：{{ info.nickname }}</view>
				<view class="text">账号：{{ info.username }}</view>
				<view class="text">地区：{{ info.area && info.area || ''}}</view>
			</view>
		</uni-list-item>
		
		<c-list v-if="isFriend && !isMyself">
			<c-list-item link to="/pages/moment/moment" @on-tap="showTextInput">备注</c-list-item>
		</c-list>
		
		<btn-group class="btn-group">
			<template v-if="isFriend && !isMyself">
				<button type="primary" @click="toChatPage">发消息</button>
				<button type="warn" @click="showDeleteActionSheet">删除</button>
			</template>
			<template v-if="!isFriend">
				<button type="primary" @click="openPopup">添加到通讯录</button>
			</template>
		</btn-group>
		
		<!-- 备注修改 -->
		<text-input
			v-if="textInputVisible"
			title="修改备注"
			:initValue="info.markName || info.nickname"
			fullscreen
			@cancel="hideTextInput"
			@done="setMarkName"
		/>
		<!-- 好友请求附加信息 -->
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog
				mode="input"
				:value="info.markName"
				:duration="2000"
				:before-close="true"
				@close="closePopup"
				@confirm="confirmPopup"
			/>
		</uni-popup>
	</view>
</template>

<script>
	import CList from '@/components/list/list.vue'
	import CListItem from '@/components/list/list-item.vue'
	import { getFriendInfo, setMarkName, deleteFriend, friendRequest } from '@/apis/user-api.js'
	
	export default {
		components: {
			CList,
			CListItem
		},
		data() {
			return {
				fid: null,
				info: {},
				textInputVisible: false
			}
		},
		onLoad(option) {
			this.fid = option.fid
			this.info = this.$store.state.user.contactMap[this.fid] || {}
			this.getFriendInfo()
		},
		computed: {
			uid() {
				return this.$store.state.user.userInfo.id
			},
			isMyself() {
				return this.uid === this.fid
			},
			isFriend() {
				return this.$store.state.user.contactList.findIndex(u => u.id === this.fid) > -1
			}
		},
		methods: {
			async getFriendInfo() {
				this.info = await getFriendInfo(this.fid)
				if (this.isFriend) {
					this.$store.dispatch('user/updateContact', this.info)
				}
			},
			refreshContactList() {
				this.$store.dispatch('user/fetchContactList')
			},
			toChatPage() {
				const chatType = 0
				uni.navigateTo({
					url: `/pages/chat/chat?fid=${this.fid}&chatType=${chatType}`
				})
			},
			viewAvatar(url) {
				uni.previewImage({ current: 0, urls: [url] })
			},
			showTextInput() {
				this.textInputVisible = true
			},
			hideTextInput() {
				this.textInputVisible = false
			},
			async setMarkName(str) {
				if (str.length) {
					await setMarkName(this.fid, str)
					this.$set(this.info, 'markName', str)
					this.refreshContactList()
					this.hideTextInput()
				}
			},
			openPopup() {
				this.$refs.popup.open()
			},
			closePopup() {
				this.$refs.popup.close()
			},
			async confirmPopup(msg) {
				const data = {
					to: this.info.id,
					message: msg !== 'undefined' ? msg : ''
				}
				friendRequest(data).then(res => {
					uni.showToast({ title: '请求已发送', icon: 'none' })
					this.closePopup()
				}).catch(e => {
					uni.showToast({ title: '请求失败', icon: 'none' })
				})
			},
			showDeleteActionSheet() {
				uni.showActionSheet({
				    itemList: ['删除'],
				    success: e => {
				        this.deleteFriend()
				    },
				    fail: e => console.log(e.errMsg)
				})
			},
			deleteFriend() {
				deleteFriend(this.fid).then(res => {
					uni.showToast({ title: '删除成功', icon: 'none' })
					this.refreshContactList()
					uni.navigateBack()
				}).catch(e => {
					uni.showToast({ title: e, icon: 'none' })
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
	
	.friend-page {
		.slot-header {
			width: 114rpx;
			margin-right: 20rpx;
			
			.image {
				width: 100%;
				height: 100%;
			}
		}
		
		.slot-body {
			.markname {
				display: flex;
				align-items: center;
				font-size: $uni-font-size-lg;
				margin-bottom: 6rpx;
				
				.iconfont {
					margin: 0 6rpx;
					font-size: 24rpx;
				}
				
				.male {
					color: $uni-color-primary;
				}
				
				.female {
					color: $uni-color-error;
				}
			}
			
			.text {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
		}
		
		.btn-group {
			margin: 20rpx 0;
		}
	}
</style>
