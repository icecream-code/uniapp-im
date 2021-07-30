import { getUserId } from '@/utils/storage.js'
import { getChatHistorySnapshot } from '@/utils/chat-storage'

const state = {
	chatList: []
}

const getters = {
	chatCount: state => state.chatList.reduce((prev, cur) => prev + cur.unread, 0)
}

const mutations = {
	SET_CHAT_LIST: (state, payload) => {
		state.chatList = payload
	}
}

const actions = {
	loadChatList({ commit, state }) {
		const uid = getUserId()
		const list = getChatHistorySnapshot(uid)
		commit('SET_CHAT_LIST', list)
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
