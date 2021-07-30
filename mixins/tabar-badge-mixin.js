import { mapGetters } from 'vuex'

export default {
	onShow() {
		setChatTabarBadge(this.chatCount)
		setContactTabarBadge(this.requestCount)
	},
	computed: {
		...mapGetters('chat', ['chatCount']),
		...mapGetters('user', ['requestCount'])
	},
	watch: {
		chatCount: {
			handler(val) {
				setChatTabarBadge(val)
			},
			immediate: true
		},
		requestCount: {
			handler(val) {
				setContactTabarBadge(val)
			},
			immediate: true
		}
	}
}

function setTabarBadge(index, val) {
	if (val) {
		uni.setTabBarBadge({ index, text: val + '' })
	} else {
		uni.removeTabBarBadge({ index })
	}
}

function setChatTabarBadge(val) {
	setTabarBadge(0, val)
}

function setContactTabarBadge(val) {
	setTabarBadge(1, val)
}