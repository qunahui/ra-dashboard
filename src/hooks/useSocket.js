import { io } from 'socket.io-client';

const socket = io("http://127.0.0.1:5050", {
  path: '/test',
  transports: ['websocket']
})

// export { useSocket };