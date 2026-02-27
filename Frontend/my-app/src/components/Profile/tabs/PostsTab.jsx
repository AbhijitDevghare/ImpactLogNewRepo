import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { likePost, commentPost } from "../../../redux/slices/EngagementSlice";

export default function PostsTab({ posts, isOwnProfile = false }) {
  const dispatch = useDispatch();
  const [selectedPost, setSelectedPost] = useState(null);
  const [localPosts, setLocalPosts] = useState(posts);

  // Sync when parent re-renders with new posts
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const title = isOwnProfile ? "Your Posts" : "Their Posts";
  const emptyMessage = isOwnProfile
    ? "Share your thoughts and connect with the community!"
    : "This user hasn't shared any posts yet.";

  /* --------------------------------------------------------------
     1. HANDLE LIKE – Optimistic + Dispatch (same as Post)
     -------------------------------------------------------------- */
  const handleLike = useCallback((postId) => {
    // Optimistic UI
    setLocalPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              engagement: {
                ...p.engagement,
                likes: p.engagement.likes.includes("currentUser")
                  ? p.engagement.likes.filter((id) => id !== "currentUser")
                  : [...p.engagement.likes, "currentUser"],
              },
            }
          : p
      )
    );

    // Keep modal in sync
    setSelectedPost((prev) =>
      prev?.id === postId
        ? {
            ...prev,
            engagement: {
              ...prev.engagement,
              likes: prev.engagement.likes.includes("currentUser")
                ? prev.engagement.likes.filter((id) => id !== "currentUser")
                : [...prev.engagement.likes, "currentUser"],
            },
          }
        : prev
    );

    // Redux dispatch
    dispatch(likePost({ postId }));
  }, [dispatch]);

  /* --------------------------------------------------------------
     2. HANDLE COMMENT – Optimistic + Dispatch (same as Post)
     -------------------------------------------------------------- */
  const handleComment = useCallback((postId, text) => {
    if (!text.trim()) return;

    const newComment = {
      content: text,
      createdAt: new Date().toISOString(),
      user: {
        name: "You",
        avatarUrl: "https://via.placeholder.com/32",
      },
    };

    // Optimistic UI
    setLocalPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              engagement: {
                ...p.engagement,
                comments: [...p.engagement.comments, newComment],
              },
            }
          : p
      )
    );

    // Keep modal in sync
    setSelectedPost((prev) =>
      prev?.id === postId
        ? {
            ...prev,
            engagement: {
              ...prev.engagement,
              comments: [...prev.engagement.comments, newComment],
            },
          }
        : prev
    );

    // Redux dispatch
    dispatch(commentPost({ postId, comment: text }));
  }, [dispatch]);

  const isLiked = (likes) => likes.includes("currentUser");

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl shadow-xl border border-gray-700/60 p-6 relative">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-pink-900/50 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {title} ({localPosts.length})
      </h3>

      {/* Grid of Posts */}
      {localPosts?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {localPosts.map((post) => (
            <div
              key={post.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-gray-700/50">
                <img
                  src={post.mediaUrls?.[0] || "https://via.placeholder.com/300"}
                  alt="Post"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
                <div className="text-center text-white">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      {isLiked(post.engagement.likes) ? "Heart" : "Empty Heart"} <span className="text-sm">{post.engagement.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      Comment <span className="text-sm">{post.engagement.comments.length}</span>
                    </div>
                  </div>
                  <p className="text-sm px-2 line-clamp-2">{post.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h4 className="text-xl font-bold text-white mb-2">No posts yet</h4>
          <p className="text-gray-400 mb-6">{emptyMessage}</p>
          {isOwnProfile && (
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
              Create Your First Post
            </button>
          )}
        </div>
      )}

      {/* FULL POST MODAL – Matches Post.jsx style */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl overflow-hidden w-full max-w-5xl shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm text-white rounded-full p-2 hover:bg-gray-700 transition z-10"
            >
              X
            </button>

            {/* Media */}
            <div className="md:w-1/2 h-64 md:h-auto">
              <img
                src={selectedPost.mediaUrls?.[0] || "https://via.placeholder.com/500"}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content + Interaction */}
            <div className="md:w-1/2 flex flex-col h-full">
              <div className="p-6 flex-1 overflow-y-auto">
                <h4 className="text-white text-lg font-semibold mb-3">
                  {selectedPost.title || "Post"}
                </h4>
                <p className="text-gray-300 mb-6 leading-relaxed">{selectedPost.content}</p>

                {/* Engagement */}
                <div className="flex items-center gap-6 text-sm mb-6">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center gap-2 transition-all ${
                      isLiked(selectedPost.engagement.likes)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  >
                    {isLiked(selectedPost.engagement.likes) ? "Heart" : "Empty Heart"}
                    <span className="font-medium">{selectedPost.engagement.likes.length} Likes</span>
                  </button>

                  <div className="flex items-center gap-2 text-gray-400">
                    Comment <span className="font-medium">{selectedPost.engagement.comments.length} Comments</span>
                  </div>
                </div>

                {/* Comments List – Same as Post.jsx */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                  {selectedPost.engagement.comments.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No comments yet. Be the first!</p>
                  ) : (
                    selectedPost.engagement.comments.map((c, i) => {
                      const name = c.user?.name ?? "Anonymous";
                      const avatar = c.user?.avatarUrl ?? "https://via.placeholder.com/32";
                      const date = c.createdAt ? new Date(c.createdAt).toLocaleString() : "";

                      return (
                        <div key={i} className="flex items-start space-x-3">
                          <img
                            src={avatar}
                            alt={name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-600"
                          />
                          <div className="bg-gray-800/60 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-400 font-medium">{name}</div>
                              {date && <div className="text-xs text-gray-500">{date}</div>}
                            </div>
                            <div className="mt-1">{c.content}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Comment Input – Reusable */}
              <CommentInput onSubmit={(text) => handleComment(selectedPost.id, text)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------
   Reusable Comment Input – Matches Post.jsx style
   -------------------------------------------------------------- */
function CommentInput({ onSubmit, placeholder = "Write a comment..." }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800/50">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSubmit}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}