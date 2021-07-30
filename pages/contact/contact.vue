<template>
	<view class="contact-wrapper">
		<c-list>
			<c-list-item thumb="/static/icon/friend-new.png" to="/pages/friend-request/friend-request">
				<view>新的朋友</view>
				<view slot="extra">
					<uni-badge :text="requestCount" size="small" type="error" />
				</view>
			</c-list-item>
		</c-list>
		<index-list :list="list" @on-list-item-click="toFriendDetail" />
	</view>
</template>

<script>
	import tabarBadgeMixin from '@/mixins/tabar-badge-mixin.js'
	import CList from '@/components/list/list.vue'
	import CListItem from '@/components/list/list-item.vue'
	
	export default {
		mixins: [tabarBadgeMixin],
		components: {
			CList,
			CListItem
		},
		data() {
			return {
			}
		},
		computed: {
			contactList() {
				return this.$store.state.user.contactList
			},
			list() {
				const arr = []
				const o = {}
				
				// ==> { letter: '', list: [] }
				this.contactList.forEach(c => {
					const letter = c.letter
					if (!o[letter]) {
						o[letter] = { letter, list: []}
					}
					o[letter].list.push({ id: c.id, thumb: c.faceImage, title: c.markName })
				})
				
				// ==> [{ letter: '', list: [] }]
				Object.keys(o).forEach(k => {
					arr.push(o[k])
				})
				arr.sort((o1, o2) => o1.letter > o2.letter)
				
				return arr
			}
		},
		methods: {
			toFriendDetail(e) {
				uni.navigateTo({ url: `/pages/friend/friend?fid=${e.id}` })
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.contact-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
