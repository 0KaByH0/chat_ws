import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, Room } from '../../types/types';

type ChatSliceType = {
  userName: string;
  room: Room;
  rooms: Room[];
  isConnected: boolean;
};

export const emptyRoom: Room = {
  id: '',
  name: '',
  messages: [],
  users: [],
};

const initialState = {
  userName: '',
  room: emptyRoom,
  rooms: [],
  isConnected: false,
} as ChatSliceType;

const chatSlice = createSlice({
  name: 'Chat',
  initialState,
  reducers: {
    setIsConnected: (state, { payload }: PayloadAction<boolean>) => {
      state.isConnected = payload;
    },
    setUserName: (state, { payload }: PayloadAction<string>) => {
      state.userName = payload;
    },
    setRooms: (state, { payload }: PayloadAction<Room[]>) => {
      state.rooms = payload;
    },
    setRoom: (state, { payload }: PayloadAction<Room>) => {
      state.room = payload;
    },
    setMessage: (state, { payload }: PayloadAction<Message>) => {
      state.room.messages.push(payload);
    },
  },
});

export const chatSliceActions = chatSlice.actions;
export const chatSliceReducer = chatSlice.reducer;
