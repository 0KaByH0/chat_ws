const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const wsServer = new WebSocket.Server({ port: 5000 });
const app = express();

// UTILS
const normalizeRoom = (room) => ({ ...room, users: room.users.map((user) => user.userName) });
const sendAll = (message, roomUsers) =>
  roomUsers.forEach((user) => user.client.send(JSON.stringify(message)));

// CONSTANTS
const MESSAGES = {
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  USER_CONNECTED: 'USER_CONNECTED',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  SEND: 'SEND',
};

let rooms = [
  {
    id: 1,
    name: 'First Room',
    messages: [
      { message: 'Hi', date: new Date().toLocaleTimeString(), userName: 'Bob' },
      { message: 'Hi men', date: new Date().toLocaleTimeString(), userName: 'Ben' },
      { message: 'How r u?', date: new Date().toLocaleTimeString(), userName: 'Yan' },
    ],
    users: [],
  },
  {
    id: 2,
    name: 'Second Room',
    messages: [
      { message: 'Hi 2', date: new Date().toLocaleTimeString(), userName: 'Bob 2' },
      { message: 'Hi men 2', date: new Date().toLocaleTimeString(), userName: 'Ben 2' },
      { message: 'How r u? 2', date: new Date().toLocaleTimeString(), userName: 'Yan 2' },
    ],
    users: [],
  },
];

app.use(cors());
app.get('/rooms', (req, res) => {
  res.send(JSON.stringify(rooms.map((room) => normalizeRoom(room))));
});
app.listen(5001);

wsServer.on('connection', onConnect);

function onConnect(wsClient) {
  console.log('User connected');

  wsClient.on('close', (event) => {
    console.log('User disconected');
  });

  wsClient.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case MESSAGES.CONNECTED:
          const roomToConnect = rooms.find((room) => room.id === parsedMessage.roomId);
          roomToConnect.users.push({ userName: parsedMessage.userName, client: wsClient });
          roomToConnect.messages.push({
            message: '',
            date: new Date().toLocaleTimeString(),
            userName: parsedMessage.userName,
            type: 'CONNECTED',
          });

          wsClient.send(
            JSON.stringify({
              type: MESSAGES.CONNECTED,
              room: normalizeRoom(roomToConnect),
            }),
          );

          sendAll(
            { type: MESSAGES.USER_CONNECTED, room: normalizeRoom(roomToConnect) },
            roomToConnect.users,
          );
          break;

        case MESSAGES.SEND:
          const { userName, date, message } = parsedMessage;
          const userRoom = rooms.find((room) => room.id === parsedMessage.roomId);
          userRoom.messages.push({ userName, date, message });
          sendAll(parsedMessage, userRoom.users);
          break;

        case MESSAGES.DISCONNECTED:
          const roomToDisConnect = rooms.find((room) => room.id === parsedMessage.roomId);
          if (roomToDisConnect) {
            roomToDisConnect.messages.push({
              message: '',
              date: new Date().toLocaleTimeString(),
              userName: parsedMessage.userName,
              type: 'DISCONNECTED',
            });

            rooms = rooms.map((room) =>
              room.id === roomToDisConnect.id
                ? {
                    ...roomToDisConnect,
                    users: room.users.filter((user) => user.userName !== parsedMessage.userName),
                  }
                : room,
            );

            const disConectedRoom = rooms.find((room) => room.id === roomToDisConnect.id);
            sendAll(
              { type: MESSAGES.USER_DISCONNECTED, room: normalizeRoom(disConectedRoom) },
              disConectedRoom.users,
            );
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('Error', error);
    }
  });
}
