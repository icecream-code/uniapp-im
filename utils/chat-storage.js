import { setStorageSync, getStorageSync, removeStorageSync } from './storage.js'

/**
 * 保存与好友的聊天历史记录
 * @param uid 用户ID
 * @param fid 好友ID
 * @param msg 消息对象{ id: '', from: '', to: '', type: 0, content: '', signed: 0, createTime: '' }
 */
export function saveChatHistory(uid, fid, msg) {
  const chatHisList = getChatHistory(uid, fid)
  const len = chatHisList.length
  let isShowTime = true
  if (len) {
	const lastTime = chatHisList[len - 1].createTime
	if (msg.createTime - lastTime < 60000) {
		isShowTime = false
	}
	
	if (len >= 20) {
		chatHisList.shift()
	}
  }
  msg.isShowTime = isShowTime
  chatHisList.push(msg)
  
  _setChatHistory(uid, fid, chatHisList)
}

/**
 * 获取与好友的聊天历史记录
 * @param uid 用户ID
 * @param fid 好友ID
 * @returns {[]}
 */
export function getChatHistory(uid, fid) {
  const o = _getChatHistory(uid)
  return o[fid] || []
}

/**
 * 删除与好友的聊天历史记录
 * @param uid 用户ID
 * @param fid 好友ID
 */
export function deleteChatHistory(uid, fid) {
  _setChatHistory(uid, fid, [])
}

function _getChatHistory(uid) {
  const key = _getChatHistoryKey(uid)
  const chatHisStr = getStorageSync(key)
  if (chatHisStr) {
	return JSON.parse(chatHisStr)
  }
  return {}
}

function _setChatHistory(uid, fid, list) {
  const o = _getChatHistory(uid)
  o[fid] = list
  setStorageSync(_getChatHistoryKey(uid), JSON.stringify(o))
}

/**
 * 清空聊天缓存
 * @param {Object} uid 用户ID
 */
export function clearChatCache(uid) {
  removeStorageSync(_getChatHistoryKey(uid))
  removeStorageSync(_getChatHistorySnapshotKey(uid))
}

/**
 * 保存聊天快照列表
 * @param uid 用户ID
 * @param fid 好友ID
 * @param msg 消息对象{ id: '', from: '', to: '', type: 0, content: '', signed: 0, createTime: '' }
 * @param read 是否已读
 */
export function saveChatHistorySnapshot(uid, fid, msg, read = false) {
  // 获取之前的快照
  const chatSnapshotList = getChatHistorySnapshot(uid)
  // 删除对应快照中的数据
  const o = _deleteChatHistorySnapshot(fid, chatSnapshotList)

  // 向快照列表插入最新的消息
  chatSnapshotList.unshift({
    uid: fid,
    type: msg.type,
	content: msg.content,
    time: msg.createTime,
    unread: read ? 0 : (o ? (o.unread + 1) : 1)
  })
  // 保存
  setStorageSync(_getChatHistorySnapshotKey(uid), JSON.stringify(chatSnapshotList))
}

/**
 * 获取聊天快照列表
 * @param uid 用户ID
 * @returns {[]} [{}]
 */
export function getChatHistorySnapshot(uid) {
  let chatHisSnapshotList = []

  const key = _getChatHistorySnapshotKey(uid)

  const chatHisListStr = getStorageSync(key)
  if (chatHisListStr) {
    chatHisSnapshotList = JSON.parse(chatHisListStr)
  }
  return chatHisSnapshotList
}

/**
 * 删除与好友的聊天快照
 * @param uid 用户ID
 * @param fid 好友ID
 * @returns {boolean}
 */
export function deleteChatHistorySnapshot(uid, fid) {
  const chatSnapshotList = getChatHistorySnapshot(uid)
  if (_deleteChatHistorySnapshot(fid, chatSnapshotList)) {
    const key = _getChatHistorySnapshotKey(uid)
    setStorageSync(key, JSON.stringify(chatSnapshotList))
    return true
  }
  return false
}

/**
 * 更新未读信息数
 * @param uid 用户ID
 * @param fid 好友ID
 */
export function updateChatHistorySnapshotUnread(uid, fid) {
  const list = getChatHistorySnapshot(uid)
  for (let i = 0; i < list.length; i++) {
    if (fid === list[i].uid) {
      list[i].unread = 0
      break
    }
  }
  const key = _getChatHistorySnapshotKey(uid)
  setStorageSync(key, JSON.stringify(list))
}

/**
 * 删除好友ID为fid的聊天快照
 * @param fid 好友ID
 * @param chatSnapshotList 聊天快照列表
 * @returns {any[]|null}
 * @private
 */
function _deleteChatHistorySnapshot(fid, chatSnapshotList) {
  let index = 0
  const len = chatSnapshotList.length
  while (index < len) {
    if (fid === chatSnapshotList[index].uid) {
      const o = chatSnapshotList[index]
      chatSnapshotList.splice(index, 1)
      return o
    }
    index++
  }
  return null
}

export function _getChatHistoryKey(uid) {
  return `chat_history_${uid}`
}

export function _getChatHistorySnapshotKey(uid) {
  return `chat_snapshot_${uid}`
}
