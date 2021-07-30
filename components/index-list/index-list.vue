<template>
	<scroll-view class="index-list" scroll-y="true">
		<view v-for="g in list" :key="g.letter">
			<view class="index-title">{{ g.letter }}</view>
			<c-list>
				<c-list-item
					v-for="item in g.list"
					:key="item.id"
					:thumb="item.thumb || ''"
					@on-tap="handleListItemTap(item)"
				>
					{{ item.title }}
				</c-list-item>
			</c-list>
		</view>
	</scroll-view>
</template>

<script>
	import CList from '../list/list.vue'
	import CListItem from '../list/list-item.vue'
	
	// 数据结构
	function list() {
		return [
			{
				letter: 'A',
				list: [{ id: '', thumb: '', title: '' }]
			}
		]
	}
	
	export default {
		name: 'index-list',
		components: {
			CList,
			CListItem
		},
		props: {
			list: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				handleListItemTap(e) {
					this.$emit('on-list-item-click', e)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-list {
		
		.index-title {
			padding: 12rpx 30rpx;
			background-color: $uni-bg-color-grey;
			font-size: 24rpx;
		}
	}
</style>
