import React from 'react';
import { useDispatch } from 'react-redux';
import { sagaActions } from '../../redux/constants/constants';
import { getIsConnected } from '../../redux/selectors/selectors';
import { useAppSelector } from '../../redux/utils';
import { Rooms } from '../Rooms/Rooms';

type LoginProps = {
  userName: string;
  setUserName: (e: string) => void;
};

export const Login: React.FC<LoginProps> = ({ userName, setUserName }) => {
  const dispatch = useDispatch();
  const isConnected = useAppSelector(getIsConnected);

  const disconnect = () => dispatch({ type: sagaActions.DISCONNECT });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  React.useEffect(() => {
    dispatch({ type: sagaActions.GET_ROOMS });

    window.addEventListener('beforeunload', disconnect);
    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, []);

  return (
    <>
      <div className={`login ${isConnected ? 'connected' : ''}`}>
        <div className="login-header">
          <h1>Chat</h1>
        </div>
        <div className={`login-info-wrapper ${isConnected ? 'connected' : ''}`}>
          {!isConnected && <span>Type your User Name</span>}
          <div>
            <input
              disabled={isConnected}
              value={userName}
              onChange={onInputChange}
              type="text"
              placeholder="UserName"
            />
            {isConnected && (
              <button className="login-disconnect__btn" onClick={disconnect}>
                Disconnect
              </button>
            )}
          </div>
        </div>
        {!isConnected && (
          <div className="rooms">
            <Rooms userName={userName} />
          </div>
        )}
      </div>
    </>
  );
};
