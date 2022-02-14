import axios from 'axios';
import { Room } from '../types/types';

export const PORT = 5001;
export const BASE_URL = 'http://localhost:' + PORT;

export class ApiService {
  static getRooms = () => axios.get<Room[]>(BASE_URL + '/rooms').then((data) => data.data);
}
