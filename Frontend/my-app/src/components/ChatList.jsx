import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChats, selectChat } from '../redux/slices/ChatSlice';

const ChatList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats, loading, error } = useSelector((state) => state.chat);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchChats());
    console.log(chats)
  }, [dispatch]);

  const filteredChats = chats?.filter(chat =>
    chat.counterpartInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // if (loading) return <div className="text-gray-400 p-4">Loading chats...</div>;
  if (error) return <div className="text-red-400 p-4">Error: {error}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-gray-800 backdrop-blur-sm p-4 border-b border-gray-700">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chats..."
          className="w-full p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide p-2">
        <ul className="space-y-2">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <li
                key={chat.id || chat._id}
                onClick={() => {
                  dispatch(selectChat(chat));
                  navigate(`/chat/${chat.conversationId}`);
                }}
                className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
              >
                <img
                  src={chat.counterpartInfo?.avatarUrl || 'https://via.placeholder.com/40'}
                  alt={chat.counterpartInfo?.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{chat.counterpartInfo?.name || 'Unknown'}</div>
                  <div className="text-gray-400 text-sm truncate">{chat.lastMessage?.text || 'No messages yet'}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-center py-4">No chats available</li>
          )}
        </ul>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChatList;
