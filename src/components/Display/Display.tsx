import React from 'react';
import { useDispatch } from 'react-redux';
import { MESSAGES, sagaActions } from '../../redux/constants/constants';
import { getCurrentRoom } from '../../redux/selectors/selectors';
import { useAppSelector } from '../../redux/utils';
import { Users } from '../Users/Users';

export const Display = () => {
  const dispatch = useDispatch();
  const currentRoom = useAppSelector(getCurrentRoom);
  const displayRef = React.useRef<HTMLDivElement>(null);

  const [message, setMessage] = React.useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  React.useEffect(() => {
    displayRef.current?.scrollTo({ top: displayRef.current.scrollHeight });
  }, [currentRoom]);

  const sendMessage = () => {
    dispatch({ type: sagaActions.SEND, payload: message });
    setTimeout(() => {
      displayRef.current?.scrollTo({ top: displayRef.current.scrollHeight });
    });
  };

  return (
    <>
      <section ref={displayRef}>
        {currentRoom.messages?.map((message) =>
          message?.type ? (
            <div className="message">
              <span className="message-date">{message.date}</span>
              <div>
                <span className="message-username">
                  <b>{message.userName}</b>:
                </span>
                <span className={message.type === MESSAGES.CONNECTED ? `green` : 'red'}>
                  {message.type}
                </span>
              </div>
            </div>
          ) : (
            <div className="message">
              <span className="message-date">{message.date}</span>
              <div>
                <span className="message-username">{message.userName}:</span>
                <span>{message.message}</span>
              </div>
            </div>
          ),
        )}
      </section>
      <Users />
      <div className="controls">
        <input value={message} onChange={onInputChange} type="text" placeholder="Message" />
        <button disabled={!message.length} onClick={sendMessage}>
          Send
        </button>
      </div>
    </>
  );
};
