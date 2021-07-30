<template>
	<view class="discovery-wrapper">
		<c-list>
			<c-list-item thumb="/static/icon/pengyouquan.png" link to="/pages/moment/moment">
				朋友圈
			</c-list-item>
			<c-list-item thumb="/static/icon/saoyisao.png" link @on-tap="scanCode">
				扫一扫
			</c-list-item>
		</c-list>
	</view>
</template>

<script>
	import CList from '@/components/list/list.vue'
	import CListItem from '@/components/list/list-item.vue'
	
	export default {
		components: {
			CList,
			CListItem
		},
		data() {
			return {
				
			}
		},
		methods: {
			scanCode() {
				uni.scanCode({
				    success: res => {
						const { scanType, result } = res
						
						console.log('条码类型：' + scanType)
						console.log('条码内容：' + result)
						
						if (res.scanType === 'QR_CODE') {
							this.handleQRCode(result)
						}
				    }
				})
			},
			handleQRCode(result) {
				const userQrcodePrefix = 'qrcode_'
				if (result.startsWith(userQrcodePrefix)) {
					const fid = result.slice(userQrcodePrefix.length)
					uni.navigateTo({ url: `/pages/friend/friend?fid=${fid}` })
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color-grey;
	}
</style>
