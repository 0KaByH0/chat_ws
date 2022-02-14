import { RootState } from '../utils';

export const getRooms = (state: RootState) => state.rooms;

export const getUserName = (state: RootState) => state.userName;

export const getCurrentRoom = (state: RootState) => state.room;

export const getCurrentRoomUsers = (state: RootState) => state.room.users;

export const getRoomId = (state: RootState) => state.room.id;

export const getIsConnected = (state: RootState) => state.isConnected;
