export type Room = {
  id: string;
  name: string;
  messages: Message[];
  users: [];
};

export type Message = {
  userName: string;
  date: string;
  message: string;
  type?: string;
};
