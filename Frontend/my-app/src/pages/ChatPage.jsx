import React, { useState, useEffect } from 'react';
import "./ChatPage.css"
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useSocket } from '../hooks/useSocket';
import MainLayout from '../layout/MainLayout';
import { selectChat, createConversation } from '../redux/slices/ChatSlice';

const ChatPage = () => {
  const { selectedChat, chats, loading, error } = useSelector((state) => state.chat);
  const { data: authData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const socket = useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [followerSearchTerm, setFollowerSearchTerm] = useState('');

  useEffect(() => {
    if (conversationId && chats.length > 0) {
      const chat = chats.find(c => c.conversationId === conversationId);
      if (chat && (!selectedChat || selectedChat.conversationId !== conversationId)) {
        dispatch(selectChat(chat));
      }
    }
  }, [conversationId, chats, selectedChat, dispatch]);

  const handleFollowerClick = async (follower) => {
    const existingChat = chats.find(chat => chat.counterpartId === follower.id);
    if (existingChat) {
      dispatch(selectChat(existingChat));
      navigate(`/chat/${existingChat.conversationId}`);
      setShowNewMessageModal(false);
    } else {
      try {
        const newChat = await dispatch(createConversation(follower.id)).unwrap();
        dispatch(selectChat(newChat));
        navigate(`/chat/${newChat.conversationId}`);
        setShowNewMessageModal(false);
      } catch (err) {
        console.error('Failed to create conversation:', err);
      }
    }
  };

  const filteredFollowers = authData?.followers?.followers?.filter(follower =>
    follower.name?.toLowerCase().includes(followerSearchTerm.toLowerCase()) ||
    follower.username?.toLowerCase().includes(followerSearchTerm.toLowerCase())
  ) || [];

  return (
    <MainLayout>
       <div class="chatpage">
        <div className='chatlist'>
          <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
            <h2 className="text-white font-medium">Chats</h2>
            <button onClick={() => setShowNewMessageModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          {showNewMessageModal ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
                <button onClick={() => setShowNewMessageModal(false)} className="mr-4 text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-white font-medium">New Message</h2>
              </div>
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <input
                  type="text"
                  value={followerSearchTerm}
                  onChange={(e) => setFollowerSearchTerm(e.target.value)}
                  placeholder="Search followers..."
                  className="w-full p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {filteredFollowers.length > 0 ? (
                  filteredFollowers.map((follower) => (
                    <div key={follower.id} onClick={() => handleFollowerClick(follower)} className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition mb-2">
                      <img
                        src={follower.avatarUrl || 'https://via.placeholder.com/40'}
                        alt={follower.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{follower.name}</div>
                        <div className="text-gray-400 text-sm">@{follower.username}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No followers found</div>
                )}
              </div>
            </div>
          ) : (
            <ChatList searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          )}
        </div>   
        <div className='chatwindow'>
 {selectedChat ? (
            <ChatWindow
              conversationId={selectedChat.conversationId}
              socket={socket}
              searchTerm={searchTerm}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 select-none">
              Select a chat
            </div>
          )}        </div>   
       </div>
    </MainLayout>
  );
};

export default ChatPage;
