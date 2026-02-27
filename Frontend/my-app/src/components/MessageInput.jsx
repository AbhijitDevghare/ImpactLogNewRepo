import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust to match your backend's URL and port

const MessageInput = ({ conversationId, userId }) => {
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (text.trim()) {
      socket.emit('sendMessage', { conversationId, text, senderId: userId });
      setText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;