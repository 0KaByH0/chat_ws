import { eventChannel } from 'redux-saga';

const PORT = 5000;
const BASE_URL = 'ws://localhost:' + PORT;

export function createWebSocketConnection() {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(BASE_URL);

    socket.onopen = function () {
      resolve(socket);
    };

    socket.onerror = function (evt) {
      reject(evt);
    };
  });
}

export function createSocketChannel(socket: WebSocket) {
  return eventChannel((emit) => {
    socket.onmessage = (event) => {
      emit(event.data);
    };

    socket.onclose = () => {
      emit('END');
    };

    const unsubscribe = () => {
      socket.onmessage = null;
    };

    return unsubscribe;
  });
}
