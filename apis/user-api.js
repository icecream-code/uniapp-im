import { request, uploadFile } from '../utils/request.js'

const PREFIX = '/user'

export const login = data => request(`/login`, 'POST', data)

export const register = data => request(`${PREFIX}/register`, 'POST', data)

export const getInfo = () => request(`${PREFIX}/profile`, 'POST')

export const setNickname = nickname => request(`${PREFIX}/nickname/${nickname}`, 'PUT')

export const setGender = gender => request(`${PREFIX}/gender/${gender}`, 'PUT')

export const uploadAvatar = filePath => uploadFile(`${PREFIX}/upload/avatar`, filePath)

export const getFriendList = () => request(`${PREFIX}/friend`, 'GET')

export const getFriendInfo = id => request(`${PREFIX}/friend/${id}`, 'GET')

export const setMarkName = (id, markName) => request(`${PREFIX}/friend/${id}/mark/${markName}`, 'PUT')

export const searchByUsername = username => request(`${PREFIX}/username/${username}`, 'GET')

export const friendRequest = data => request(`${PREFIX}/friend/request`, 'POST', data)

export const getFriendRequestList = () => request(`${PREFIX}/friend/request`, 'GET')

export const handleFriendRequest = (from, type) => request(`${PREFIX}/friend/request/${from}/${type}`, 'POST')

export const deleteFriend = fid => request(`${PREFIX}/friend/${fid}`, 'DELETE')

export const getUnSignedMessages = () => request(`${PREFIX}/message/unsigned`, 'GET')
