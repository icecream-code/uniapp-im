<template>
	<view class="avatar-wrapper">
		<nav-bar fixed>
			<template v-slot:default>
				<text>个人头像</text>
			</template>
			<template v-slot:right>
				<uni-icons type="more-filled" size="24" @tap="showActionSheet" />
			</template>
		</nav-bar>
		<view class="avatar-content">
			<image :src="filePath" mode="widthFix" class="image" />
			<iqy-image-cropper :src="tempFilePath" @ok="confirm" @cancel="cancel" />
		</view>
	</view>
</template>

<script>
	import { uploadAvatar } from '@/apis/user-api.js'
	
	export default {
		data() {
			return {
				tempFilePath: '',
				filePath: ''
			}
		},
		created() {
			const avatar = this.$store.state.user.userInfo.faceImage
			this.filePath = avatar
		},
		methods: {
			showActionSheet() {
				uni.showActionSheet({
				    itemList: ['拍照', '从手机相册选择', '保存图片'],
				    success: e => {
						const index = e.tapIndex
				        if (index ===0 || index === 1) {
							this.chooseImage(index)
						}
						if (index === 2) {
							this.saveImageToPhotosAlbum()
						}
				    },
				    fail: e => console.log(e.errMsg)
				})
			},
			chooseImage(st) {
				uni.chooseImage({
				    count: 1,
				    sizeType: ['original'],
				    sourceType: [st === 0 ? 'camera' : 'album'],
				    success: res => {
						this.tempFilePath = res.tempFilePaths.shift()
				    }
				})
			},
			saveImageToPhotosAlbum() {
				uni.saveImageToPhotosAlbum({
					filePath: this.filePath,
					success: () => {
						uni.showToast({ title: '保存成功', duration: 2000, icon: 'none' })
					}
				})
			},
			async confirm(tempFilePath) {
				this.tempFilePath = ''
				const filePath = this.filePath = tempFilePath

				uni.showLoading()
				await uploadAvatar(filePath)
				uni.hideLoading()
				uni.showToast({ title: '上传成功' })
				this.$store.dispatch('user/fetchUserInfo')
				this.$store.dispatch('user/fetchContactList')
			},
			cancel() {
				this.tempFilePath = ''
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	
	.avatar-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: #000;
		
		.avatar-content {
			display: flex;
			align-items: center;
			height: 100%;
			
			.image {
				width: 100%;
			}
		}
	}
</style>
