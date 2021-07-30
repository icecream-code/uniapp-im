const host = '172.20.10.10'

let baseUrl = `http://${host}:8081/im`
let wsUrl = `ws://${host}:8082/ws`

// #ifdef H5
baseUrl = '/im'
wsUrl = 'ws://localhost:8082/ws'
// #endif

export const BASE_URL = baseUrl
export const WS_URL = wsUrl