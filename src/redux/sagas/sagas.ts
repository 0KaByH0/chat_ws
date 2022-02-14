import { PayloadAction } from '@reduxjs/toolkit';
import { EventChannel, SagaIterator, Task } from 'redux-saga';
import { call, takeEvery, put, select, cancel, take, fork, cancelled } from 'redux-saga/effects';
import { Room } from '../../types/types';
import { createSocketChannel, createWebSocketConnection } from '../../api/WebSoket';
import { MESSAGES, sagaActions } from '../constants/constants';
import { getRoomId, getUserName } from '../selectors/selectors';
import { chatSliceActions, emptyRoom } from '../slices/chat';
import { ApiService } from '../../api/ApiService';

let SOCKET: WebSocket;

const sendMSG = (type: string, userName: string, message: string, date: string, roomId: string) =>
  SOCKET.send(JSON.stringify({ type, userName, message, date, roomId }));

function* sendUserMessage({ payload: message }: PayloadAction<string>) {
  try {
    const userName: string = yield select(getUserName);
    const roomId: string = yield select(getRoomId);
    yield call(sendMSG, MESSAGES.SEND, userName, message, new Date().toLocaleTimeString(), roomId);
  } catch (error) {
    console.log('Cannot send message', error);
  }
}

function* sendInfoMessage(type: string, userName: string, roomId: string) {
  try {
    yield call(sendMSG, type, userName, '', new Date().toLocaleTimeString(), roomId);
  } catch (error) {
    console.log('Cannot send message', error);
  }
}

function* listenForSocketMessages(userName: string, roomId: string): SagaIterator {
  let socketChannel: EventChannel<typeof SOCKET> | undefined;

  try {
    SOCKET = yield call(createWebSocketConnection);
    socketChannel = yield call(createSocketChannel, SOCKET);

    yield put(chatSliceActions.setIsConnected(true));
    yield call(sendInfoMessage, MESSAGES.CONNECTED, userName, roomId);

    while (true) {
      const payload: string = socketChannel ? yield take(socketChannel) : '';
      const parsedPayload = JSON.parse(payload);
      const { userName, date, message, room } = parsedPayload;

      switch (parsedPayload.type) {
        case MESSAGES.CONNECTED:
        case MESSAGES.USER_DISCONNECTED:
        case MESSAGES.USER_CONNECTED:
          yield put(chatSliceActions.setRoom(room));
          break;
        case MESSAGES.SEND:
          yield put(chatSliceActions.setMessage({ userName, date, message }));
          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.log('Error while connecting to the WebSocket', error);
  } finally {
    if (yield cancelled()) {
      yield call(sendInfoMessage, MESSAGES.DISCONNECTED, userName, roomId);
      socketChannel?.close();
      SOCKET.close();
    } else {
      console.log('WebSocket disconnected');
    }
  }
}

export function* connect({ payload }: PayloadAction<{ userName: string; roomId: string }>) {
  const socketTask: Task = yield fork(listenForSocketMessages, payload.userName, payload.roomId);
  yield put(chatSliceActions.setUserName(payload.userName));

  yield take(sagaActions.DISCONNECT);
  yield cancel(socketTask);
  yield call(getRooms);
  yield put(chatSliceActions.setIsConnected(false));
  yield put(chatSliceActions.setRoom(emptyRoom));
}

export function* getRooms() {
  const rooms: Room[] = yield call(ApiService.getRooms);
  yield put(chatSliceActions.setRooms(rooms));
}

export function* rootSaga() {
  yield takeEvery(sagaActions.CONNECT, connect);
  yield takeEvery(sagaActions.SEND, sendUserMessage);
  yield takeEvery(sagaActions.GET_ROOMS, getRooms);
}
