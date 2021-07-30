export const action = {
	CONNECT: 0,
	KEEP_ALIVE: 1,
	CHAT: 2,
	SIGNED: 3,
	FRIEND_REQUEST: 4,
	FRIEND_ACCEPTED: 5
}

const createPacket = (cmd, expand = '') => {
	return { action: cmd, expand, msg: '' }
}

const connectPacket = token => {
	return createPacket(action.CONNECT, token)
}

const keepAlivePacket = () => {
	return createPacket(action.KEEP_ALIVE)
}

const chatPacket = (msg) => {
	msg = JSON.stringify(msg)
	return createPacket(action.CHAT, msg)
}

const signedPacket = string => {
	return createPacket(action.SIGNED, string)
}

export default {
	createPacket,
	connectPacket,
	keepAlivePacket,
	chatPacket,
	signedPacket
}
