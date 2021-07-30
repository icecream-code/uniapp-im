import store from'@/store/index.js'
import packet, { action } from './packet.js'
import { getToken, getUserId } from './storage.js'
import { saveChatHistory, saveChatHistorySnapshot } from "./chat-storage"
import { getUnSignedMessages, handleFriendRequest } from "@/apis/user-api.js"
import { WS_URL } from '@/config/index.js'

let websocket
let timer
let _timer
let _reTimer
const msgQueue = []

function _initWebsocket() {
	console.log('init')
	if (_isWebsocketOpen()) {
		return
	}
	websocket = uni.connectSocket({
		url: WS_URL,
		complete: e => {}
	})
	uni.onSocketOpen(_onopen)
	uni.onSocketMessage(_onmessage)
	uni.onSocketError(_onerror)
	uni.onSocketClose(_onclose)
}

function _isWebsocketOpen() {
	return websocket && websocket.readyState === websocket.OPEN
}

function _closeWebsocket() {
	uni.closeSocket()
}

function _send(packet) {
	if (_isWebsocketOpen()) {
		uni.sendSocketMessage({
			data: JSON.stringify(packet)
		})
		return true
	}
	return false
}

function _onopen() {
	console.log('websocket open...')

	// 构建连接netty服务器请求信息
	_send(packet.connectPacket(getToken().accessToken))
	// 获取未签收的信息
	_fetchUnsignedMessage()
	// 心跳发送
	_keepAlive()
	
	for (let i = 0; i < msgQueue.length; i++) {
		uni.sendSocketMessage({
			data: JSON.stringify(packet)
		})
	}
}

function _onmessage(e) {
	console.log('websocket onmessage.')

	const packet = JSON.parse(e.data)
	
	switch (packet.action) {
		case action.KEEP_ALIVE:
			_clearTimout()
			break
		case action.CHAT:
			_recvMsg(packet.msg)
			break
		case action.FRIEND_REQUEST:
			chat.fetchRequestList()
			break
		case action.FRIEND_ACCEPTED:
			chat.fetchContactList()
			break
		default:
			break
	}
}

function _onerror() {
	console.log('websocket error.')
	_onclose()
	_initWebsocket()
}

function _onclose() {
	console.log('websocket close.')
	websocket = null
	_clearTimer()
}

function _keepAlive() {
	_clearTimer()
	timer = setInterval(() => {
		_send(packet.keepAlivePacket())
		_clearTimout()
		_timer = setTimeout(() => {
			console.log('lose keep alive')
			// 重连
			_initWebsocket()
		}, 16000)
	}, 8000)
}

function _clearTimer() {
	if (timer) {
		clearInterval(timer)
	}
}

function _clearTimout() {
	if (_timer) {
		clearTimeout(_timer)
	}
}

/**
 * 从服务器获取未签收的信息并进行缓存、签收
 * @returns {Promise<void>}
 */
async function _fetchUnsignedMessage() {
	const list = await getUnSignedMessages()
	const ids = []
	
	// 1. 保存聊天记录到本地缓存
	list.forEach(msg => {
		const { to: uid, from: fid } = msg
		// 保存并刷新
		_saveMsg(uid, fid, msg, false)
		// 收集消息ID
		ids.push(msg.id)
	})
	// 2. 签收信息
	ids && _signedMsg(ids.join(','))
}

function _signedMsg(string) {
	_send(packet.signedPacket(string))
}

function _sendMsg(msg) {
	// 发送聊天消息
	const pk = packet.chatPacket(msg)
	if (!_send(pk)) {
		msgQueue.push(pk)
	}
	
	// 缓存消息
	const { to: fid, from: uid } = msg
	_saveMsg(uid, fid, msg, true)
}

function _recvMsg(msg) {
	// 签收
	_signedMsg(msg.id)
	// 缓存
	_saveMsg(msg.to, msg.from, msg, chat.fid === msg.from)
}

function _saveMsg(uid, fid, msg, isRead) {
	if (!msg.createTime) {
		msg.createTime = new Date().getTime()
	}
	
	// 缓存
	saveChatHistory(uid, fid, msg)
	saveChatHistorySnapshot(uid, fid, msg, isRead)
	// 刷新快照
	chat.refreshChatList()
	// 接收聊天消息
	chat.recvMsg(msg)
	
	if (msg.from === fid) {
		// 震动提示
		uni.vibrateShort()
	}
}

export const chat = {
	uid: getUserId(),
	fid: null,
	chatType: null,
	initWebsocket() {
		_initWebsocket()
	},
	closeWebsocket() {
		_closeWebsocket()
	},
	sendMsg(msg) {
		_sendMsg(msg)
	},
	recvMsg(msg) {
		uni.$emit('on-chat-msg', msg)
	},
	refreshChatList() {
		store.dispatch('chat/loadChatList')
	},
	fetchContactList() {
		store.dispatch('user/fetchContactList')
	},
	fetchRequestList() {
		store.dispatch('user/fetchRequestList')
	}
}