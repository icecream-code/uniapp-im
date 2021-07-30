import { setStorageSync, getStorageSync, removeStorageSync } from '@/utils/storage.js'

const contactList = []
const contactMap = {}

const CONTACT_LIST_KEY = 'contact_list_'
const CONTACT_MAP_KEY = 'contact_map_'

function getContactList(uid) {
	const key = CONTACT_LIST_KEY + uid
	return getStorageSync(key) || []
}

function setContactList(uid, list) {
	const map = getContactMap(uid)
	list.forEach(c => map[c.id] = c)
	
	setStorageSync(CONTACT_LIST_KEY + uid, list)
	setStorageSync(CONTACT_MAP_KEY + uid, map)
}

function removeContactList(uid) {
	const key = CONTACT_LIST_KEY + uid
	removeStorageSync(CONTACT_LIST_KEY)
}

function getContactMap(uid) {
	const key = CONTACT_MAP_KEY + uid
	return getStorageSync(key) || {}
}

export default {
	getContactList,
	setContactList,
	removeContactList,
	getContactMap
}