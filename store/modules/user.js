import { getInfo, getFriendList, getFriendRequestList } from '@/apis/user-api.js'
import {
	getUserId,
	getToken,
	saveToken,
	removeToken,
	getUserInfo,
	saveUserInfo,
	removeUserInfo,
	setRequestList,
	getRequestList,
	updateRequestStatus
} from '@/utils/storage.js'
import contactUtil from '@/utils/contact.js'

function initUserInfo() {
	return {
		id: null,
		username: '',
		nickname: '',
		gender: 0,
		faceImage: '',
		qrCode: ''
	}
}

const state = {
	token: getToken(),
	userInfo: getUserInfo() || initUserInfo(),
	contactList: contactUtil.getContactList(getUserId()) || [],
	contactMap: contactUtil.getContactMap(getUserId()) || {},
	requestList: getRequestList()
}

const getters = {
	token: state => state.token,
	requestCount: state => state.requestList.reduce((prev, cur) => {
		return prev + (cur.status === 0 ? 1 : 0)
	}, 0)
}

const mutations = {
	SET_TOKEN: (state, payload) => {
		state.token = payload
		saveToken(payload)
	},
	
	DELETE_TOKEN: (state) => {
		state.token = null
		removeToken()
	},
	
	SET_USER_INFO: (state, payload) => {
		state.userInfo = payload
		saveUserInfo(payload)
	},
	
	DELETE_USER_INFO: (state) => {
		state.userInfo = initUserInfo()
		removeUserInfo()
	},
	
	SET_CONTACT_LIST: (state, payload) => {
		state.contactList = payload
	},
	
	SET_CONTACT_MAP: (state, payload) => {
		state.contactMap = payload
	},
	
	SET_REQUEST_LIST: (state, payload) => {
		state.requestList = setRequestList(payload)
	}
}

const actions = {
	setToken({ commit }, payload) {
		return new Promise((resolve, reject) => {
			commit('SET_TOKEN', payload)
			resolve(payload)
		})
	},
	
	setUserInfo({ commit }, payload) {
		return new Promise((resolve, reject) => {
			commit('SET_USER_INFO', payload)
			resolve(payload)
		})
	},
	
	fetchUserInfo({ commit }) {
		return new Promise((resolve, reject) => {
			getInfo().then(res => {
				commit('SET_USER_INFO', res)
				resolve(res)
			}).catch(e => reject(e))
		})
	},
	
	updateContact({ dispatch, state }, payload) {
		const list = [...state.contactList]
		const index = list.findIndex(item => item.id === payload.id)
		if (index > -1) {
			list[index] = payload
			dispatch('setContactList', list)
		}
	},
	
	setContactList({ commit, state }, payload) {
		const uid = state.userInfo.id
		if (payload) {
			contactUtil.setContactList(uid, payload)
		}
		const contactList = contactUtil.getContactList(uid)
		const contactMap = contactUtil.getContactMap(uid)
		commit('SET_CONTACT_LIST', contactList)
		commit('SET_CONTACT_MAP', contactMap)
	},
	
	fetchContactList({ dispatch }) {
		return new Promise((resolve, reject) => {
			getFriendList().then(list => {
				dispatch('setContactList', list)
				resolve(list)
			}).catch(e => reject(e))
		})
	},
	
	fetchRequestList({ commit }) {
		return new Promise((resolve, reject) => {
			getFriendRequestList().then(res => {
				commit('SET_REQUEST_LIST', res)
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
	
	updateRequestStatus({ commit }, { fromId, status }) {
		const list = updateRequestStatus(fromId, status)
		commit('SET_REQUEST_LIST', list)
	},
	
	logout({ commit }) {
		return new Promise((resolve, reject) => {
			commit('DELETE_TOKEN')
			commit('DELETE_USER_INFO')
			resolve()
		})
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
