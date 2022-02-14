import React from 'react';
import { useDispatch } from 'react-redux';
import { sagaActions } from '../../redux/constants/constants';
import { getCurrentRoom, getRooms } from '../../redux/selectors/selectors';
import { useAppSelector } from '../../redux/utils';

type RoomsProps = {
  userName: string;
};

export const Rooms: React.FC<RoomsProps> = ({ userName }) => {
  const dispatch = useDispatch();
  const rooms = useAppSelector(getRooms);
  const currentRoom = useAppSelector(getCurrentRoom);

  const [showRooms, setShowRooms] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShowRooms(!currentRoom.id && !!userName.length);
    }, 150);
  }, [currentRoom.id, userName]);

  const connect = (roomId: string) =>
    dispatch({ type: sagaActions.CONNECT, payload: { userName, roomId } });

  return (
    <>
      {showRooms && (
        <>
          {rooms.map((room) => (
            <div onClick={() => connect(room.id)}>
              <span>{room.name}</span>
              <span>{room.users.length} users</span>
            </div>
          ))}
        </>
      )}
    </>
  );
};
