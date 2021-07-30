/**
 * 聊天快照数据结构
 */
export class ChatItem {
	uid = ''
	nickname = ''
	markName = ''
	avatar = '/static/logo.png'
	type = 0
	content = ''
	time = '2021/06/01'
	unread = 0
}

/**
 * 聊天消息数据结构
 */
export class MsgItem {
	id = ''
	// 发送人
	from = ''
	// 接收人
	to = ''
	// 消息类型
	type = 0
	// 消息内容
	content = ''
	// 聊天时间
	createTime = null
	// 聊天类型 0.单聊 1.群聊
	chatType = 0
	// 是否显示时间
	isShowTime = true
}

/**
 * 好友请求数据结构
 */
export class FriendRequest {
	id = ''
	from = ''
	to = ''
	username = ''
	nickname = ''
	faceImage = ''
	status = 0
	message = ''
	createTime = ''
}
