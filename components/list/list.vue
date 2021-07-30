<template>
	<view class="list">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'list',
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import "@/static/scss/mixins.scss";
	
	.list {
		border-top: .5px solid $uni-border-color;
		border-bottom: .5px solid $uni-border-color;
		
		&::v-deep .list-item:not(:last-child) {
			.list-item__content {
				border-bottom: .5px solid $uni-border-color;
			}
		}
		
		// position: relative;
		// &::before {
		// 	@include bdr-1px();
		// }
		
		// &::after {
		// 	@include bdr-1px(bottom);
		// }
		
		// &::v-deep .list-item:not(:last-child) {
		// 	.list-item__content::after {
		// 		@include bdr-1px(bottom);
		// 	}
		// }
	}
</style>
