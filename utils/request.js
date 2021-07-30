import { BASE_URL } from '@/config/index.js'
import store from '@/store'

export const getAuthorization = (isRefreshToken = false) => {
	const token = store.state.user.token
	if (token) {
		return 'Bearer ' + (isRefreshToken ? token.refreshToken : token.accessToken)
	}
	return ''
}

export const getUrl = uri => {
	if (!uri) {
		uri = ''
	}
	uri = uri.indexOf('/') === 0 ? uri : `/${uri}`
	return `${BASE_URL}${uri}`
}

export const request = (uri, method, data) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: getUrl(uri),
			method,
			data,
			header: {
				'Authorization': getAuthorization()
			},
			success: res => _httpResult(res, resolve, reject, () => request(uri, method, data)),
			fail: err => reject(err)
		})
	})
}

export const uploadFile = (uri, filePath, name = 'file', formData = {}) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: getUrl(uri),
			filePath,
			name,
			formData,
			header: {
				'Authorization': getAuthorization()
			},
			success: res => _httpResult(res, resolve, reject, () => uploadFile(uri, filePath, name, formData)),
			fail: err => reject(err)
		})
	})
}

const _httpResult = (res, resolve, reject, tryFn) => {
	if (res.statusCode === 200) {
		resolve(res.data)
	} else if (res.statusCode === 401) {
		refreshToken(tryFn)
	} else if (res.statusCode === 500) {
		uni.showToast({ title: res.data.message, duration: 2000, icon: 'none' })
	} else {
		reject(res.data)
	}
}

const refreshToken = fn => {
	uni.request({
		url: getUrl('/token/refresh'),
		method: 'POST',
		header: {
			'Authorization': getAuthorization(true)
		},
		success: async res => {
			if (res.statusCode === 200) {
				await store.dispatch('user/setToken', res.data)
				fn && fn()
			} else {
				uni.reLaunch({ url: '/pages/login/login' })
			}
		},
		fail: err => toLogin()
	})
}