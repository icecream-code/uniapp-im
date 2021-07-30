const TOKEN = 'token'
const USER_INFO = 'user_info'
const CONTACT = 'contact'
const FRIEND_REQUEST = 'friend_request_'

export const getToken = () => {
	return getStorageSync(TOKEN)
}

export const saveToken = value => {
	setStorageSync(TOKEN, value)
}

export const removeToken = () => {
	removeStorageSync(TOKEN)
}

export const getUserInfo = () => {
	return getStorageSync(USER_INFO)
}

export const saveUserInfo = value => {
	setStorageSync(USER_INFO, value)
}

export const removeUserInfo = () => {
	removeStorageSync(USER_INFO)
}

export const getUserId = () => {
	const userInfo = getUserInfo()
	return userInfo && userInfo.id || null
}

export const setRequestList = (payloads) => {
	const key = FRIEND_REQUEST + getUserId()
	const list = getRequestList()
	payloads.forEach(item => {
		const index = list.findIndex(n => n.id === item.id)
		if (index < 0) {
			list.unshift(item)
			setStorageSync(key, list)
		}
	})
	return list
}

export const getRequestList = () => {
	const uid = getUserId()
	if (!uid) {
		return []
	}
	const key = FRIEND_REQUEST + uid
	return getStorageSync(key) || []
}

export const removeRequestList = () => {
	const key = FRIEND_REQUEST + getUserId()
	removeStorageSync(key)
}

export const updateRequestStatus = (fromId, status) => {
	const list = getRequestList()
	list.forEach(item => {
		if (item.from === fromId) {
			item.status = status
		}
	})
	const key = FRIEND_REQUEST + getUserId()
	setStorageSync(key, list)
	return list
}


export const setStorageSync = (key, value) => {
	try {
	    uni.setStorageSync(key, value)
	} catch (e) {
	    console.log('set storage sync error. ')
	}
}

export const getStorageSync = key => {
	try {
	    const value = uni.getStorageSync(key)
	    if (value) {
	        return value
	    }
	} catch (e) {
	    console.log('set storage sync error. ')
	}
	return null
}

export const removeStorageSync = key => {
	try {
	    uni.removeStorageSync(key)
	} catch (e) {
	    console.log('remove storage sync error. ')
	}
}