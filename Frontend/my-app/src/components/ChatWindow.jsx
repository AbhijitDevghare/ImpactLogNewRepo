  import React, { useEffect, useRef, useState } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchMessages, clearMessages, addMessage } from '../redux/slices/ChatSlice';

  const ChatWindow = ({ conversationId, socket }) => {
    const dispatch = useDispatch();
    const { messages, loading, error, selectedChat } = useSelector((state) => state.chat);
    const currentUser  = useSelector((state) => state.auth.data);
    const [text, setText] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [chatSearchTerm, setChatSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      if (conversationId) {
        dispatch(clearMessages());
        dispatch(fetchMessages(conversationId));
      }
    }, [conversationId, dispatch]);

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
      if (!text.trim()) return;
      socket.emit(
        'sendMessage',
        { receiverId: selectedChat?.counterpartId || 'any', text },
        (res) => {
          if (res.ok) dispatch(addMessage(res.message));
        }
      );
      setText('');
    };

    const filteredMessages =
      messages?.filter((msg) =>
        msg.text?.toLowerCase().includes(chatSearchTerm.toLowerCase())
      ) || [];

    if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading messages...</div>;
    if (error) return <div className="flex items-center justify-center h-full text-red-400">Error: {error}</div>;

    return (
      <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 h-16 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={selectedChat?.counterpartInfo?.avatarUrl || 'https://via.placeholder.com/40'}
              alt={selectedChat?.counterpartInfo?.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span className="text-white font-medium">{selectedChat?.counterpartInfo?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {showSearch ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatSearchTerm}
                  onChange={(e) => setChatSearchTerm(e.target.value)}
                  placeholder="Search in chat..."
                  className="w-48 p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button onClick={() => setShowSearch(false)} className="hover:bg-gray-700/50 rounded-full p-2 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setShowSearch(true)} className="hover:bg-gray-700/50 rounded-full p-2 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="hover:bg-gray-700/50 rounded-full p-2 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="hover:bg-gray-700/50 rounded-full p-2 transition">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUser?.id;
              const avatarUrl = isCurrentUser
                ? currentUser?.avatarUrl
                : selectedChat?.counterpartInfo?.avatarUrl;

              return (
                <div
                  key={msg._id}
                  className={`flex items-end space-x-2 mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`} // mb-3 adds space
                >
                  {!isCurrentUser && <img src={avatarUrl || 'https://via.placeholder.com/32'} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />}
                  <div className={`max-w-xs px-4 py-3 rounded-2xl ${isCurrentUser ? 'bg-blue-500 text-white sent' : 'bg-gray-700 text-white received'}`}>
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                    <div className="text-xs text-gray-300 mt-2 opacity-75">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                  {isCurrentUser && <img src={avatarUrl || 'https://via.placeholder.com/32'} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />}
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-center py-8">No messages found</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-gray-800 backdrop-blur-sm p-4 border-t border-gray-700">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="w-full p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    );
  };

  export default ChatWindow;
