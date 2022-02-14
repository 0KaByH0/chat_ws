import React from 'react';
import { getCurrentRoomUsers } from '../../redux/selectors/selectors';
import { useAppSelector } from '../../redux/utils';

export const Users = () => {
  const users = useAppSelector(getCurrentRoomUsers);

  return (
    <div className="users">
      <div>Online: </div>
      {users.map((user, index) => (
        <>
          <span>{user}</span>
          {index === users.length - 1 ? '' : ','}
        </>
      ))}
    </div>
  );
};
