import React, { memo, useMemo, useState, useRef, useCallback } from "react";
import OptimizedImage from "./OptimizedImage";
import LikeButtonIcon from "../assets/icons/icons8-facebook-like-64.png";
import CommentIcon from "../assets/icons/comment.svg";
import ShareIcon from "../assets/icons/share.svg";
import { Link } from "react-router-dom";

// Subcomponent: Likes Modal
const LikesModal = ({ isOpen, onClose, likes = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white font-semibold mb-4">Liked by</h3>
        {likes.length === 0 ? (
          <p className="text-gray-400">No likes yet.</p>
        ) : (
          <div className="space-y-3">
            {likes.map((user, i) => (
              <div key={i} className="flex items-center space-x-3">
                <img src={user.avatarUrl || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full" alt={user.name} />
                <span className="text-gray-200">{user.name}</span>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded">Close</button>
      </div>
    </div>
  );
};

// Subcomponent: Comment Box (inline under post)
const CommentBox = ({ comments = [], onSubmit, showComments, setShowComments }) => {
  const [commentText, setCommentText] = useState('');

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    onSubmit(text);
    setCommentText('');
  };

  return (
    <div className={`mt-4 transition-all duration-300 z-20 relative ${showComments ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
      <div className="space-y-3 max-h-56 overflow-y-auto pr-2 scrollbar-hide mb-3">
        {comments.length === 0 ? (
          <div className="text-gray-400 text-sm">No comments yet. Be the first to comment.</div>
        ) : (
          comments.map((c, i) => {
            const name = c.user?.name ?? 'Anonymous';
            const avatar = c.user?.avatarUrl ?? 'https://via.placeholder.com/32';
            const date = c.createdAt ? new Date(c.createdAt).toLocaleString() : '';

            return (
              <div key={i} className="flex items-start space-x-3">
                <img src={avatar} className="w-8 h-8 rounded-full" alt={name} />
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

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyDown={(e) => { if (e.key === 'Enter') submitComment(); }}
        />
        <button onClick={submitComment} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white text-sm">
          Send
        </button>
      </div>
    </div>
  );
};

// Subcomponent: Comment Modal (Bottom Drawer)
const CommentModal = ({ isOpen, onClose, comments = [], onSubmit }) => {
  const [commentText, setCommentText] = useState('');

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    onSubmit(text);
    setCommentText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-t-lg w-full max-w-md max-h-96 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-white font-semibold">Comments</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">X</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.length === 0 ? (
            <div className="text-gray-400 text-sm">No comments yet. Be the first to comment.</div>
          ) : (
            comments.map((c, i) => {
              const name = c.user?.name ?? 'Anonymous';
              const avatar = c.user?.avatarUrl ?? 'https://via.placeholder.com/32';
              const date = c.createdAt ? new Date(c.createdAt).toLocaleString() : '';

              return (
                <div key={i} className="flex items-start space-x-3">
                  <img src={avatar} className="w-8 h-8 rounded-full" alt={name} />
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

        <div className="p-4 border-t border-gray-700 flex items-center space-x-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => { if (e.key === 'Enter') submitComment(); }}
          />
          <button onClick={submitComment} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-white text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Post Component
function Post({
  authorName = "",
  authorAvatarUrl = "",
  timestamp = "Just now",
  content = "",
  images = [],
  likesCount = 0,
  likes = [],
  comments = [],
  onLike,
  onComment,
  onShare,
  className = "",
  authorId = ""
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [liked, setLiked] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const imageContainerRef = useRef(null);

  const initials = useMemo(() => {
    if (!authorName) return "";
    return authorName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");
  }, [authorName]);

  const formatCount = useMemo(() => (n) => {
    if (!n || n <= 0) return "";
    if (n < 1000) return String(n);
    if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }, []);

  const hasImages = useMemo(() => Array.isArray(images) && images.length > 0, [images]);
  const imgCount = hasImages ? images.length : 0;

  // Touch handlers for image swiping
  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < imgCount - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  }, [touchStart, touchEnd, currentImageIndex, imgCount]);

  // Navigation functions
  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < imgCount - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleLike = () => {
    setLiked((v) => !v);
    setLocalLikes((prev) => liked ? prev - 1 : prev + 1);
    if (onLike) onLike();
  };

  const handleComment = (text) => {
    // Optimistic update — matches server structure
    const newComment = {
      content: text,
      createdAt: new Date().toISOString(),
      user: {
        name: 'You',
        avatarUrl: 'https://via.placeholder.com/32'
      }
    };
    setLocalComments(prev => [...prev, newComment]);
    if (onComment) onComment(text);
  };

  const renderImages = useMemo(() => {
    if (!hasImages) return null;

    if (imgCount === 1) {
      return (
        <div className="mt-3">
          <OptimizedImage
            src={images[0]}
            alt="post media"
            className="w-full aspect-video object-cover rounded-xl ring-1 ring-gray-600/50"
          />
        </div>
      );
    }

    return (
      <div className="mt-3 relative">
        {/* Image Container */}
        <div
          ref={imageContainerRef}
          className="relative overflow-hidden rounded-xl ring-1 ring-gray-600/50 bg-gray-900/50"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            aspectRatio: '16/9',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          <div
            className="flex transition-transform duration-300 ease-out h-full"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
              width: `${imgCount * 100}%`
            }}
          >
            {images.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-full h-full relative">
                <OptimizedImage
                  src={src}
                  alt={`post media ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                  {i + 1}/{imgCount}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <button
              onClick={goToPreviousImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full
                border border-gray-600/50 flex items-center justify-center
                text-white hover:bg-purple-600/50 transition-all duration-300
                hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {currentImageIndex < imgCount - 1 && (
            <button
              onClick={goToNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full
                border border-gray-600/50 flex items-center justify-center
                text-white hover:bg-purple-600/50 transition-all duration-300
                hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Image Indicators */}
        {imgCount > 1 && (
          <div className="flex justify-center items-center mt-3 gap-2">
            <div className="flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Swipe hint for mobile */}
        {imgCount > 1 && (
          <div className="md:hidden text-center mt-2">
            <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Swipe to see more images
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </p>
          </div>
        )}
      </div>
    );
  }, [hasImages, images, imgCount, currentImageIndex, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <>
      <article
        data-reveal
        className={`rounded-2xl p-4 bg-gray-800/80 backdrop-blur border border-gray-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 will-change-transform mb-6 ${className}`}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Header */}
        <Link to={`/viewprofile/${authorId}`}>
          <header className="flex items-center gap-3">
            {authorAvatarUrl ? (
              <OptimizedImage
                src={authorAvatarUrl}
                alt={authorName}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-600/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 text-white grid place-items-center text-sm font-semibold ring-1 ring-gray-600/50">
                {initials}
              </div>
            )}
            <div>
              <div className="font-semibold text-white leading-tight">
                {authorName}
              </div>
              <div className="text-xs text-gray-400">{timestamp}</div>
            </div>
          </header>
        </Link>

        {/* Content */}
        {content ? (
          typeof content === "string" ? (
            <p className="mt-3 text-gray-200 whitespace-pre-line leading-relaxed">{content}</p>
          ) : (
            <div className="mt-3 text-gray-200">{content}</div>
          )
        ) : null}

        {/* Images */}
        {renderImages}

        {/* Footer */}
        <footer className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700/50 transition ${liked ? 'text-purple-400' : 'text-gray-300'}`}
              aria-label="Like"
            >
              <img src={LikeButtonIcon} alt="Like" className="h-5" loading="lazy"/>
              {localLikes > 0 && (
                <span className="font-medium cursor-pointer" onClick={() => setShowLikesModal(true)}>
                  {formatCount(localLikes)}
                </span>
              )}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-purple-900/40 text-gray-300 hover:text-white transition-all duration-200 active:scale-95"
              onClick={() => setShowCommentModal(true)}
              aria-label="Comment"
            >
              <img src={CommentIcon} alt="Comment" className="h-5" />
              {localComments.length > 0 && (
                <span className="font-medium">{formatCount(localComments.length)}</span>
              )}
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-purple-900/40 text-gray-300 hover:text-white transition-all duration-200 active:scale-95"
              onClick={onShare}
              aria-label="Share"
            >
              <img src={ShareIcon} alt="Share" className="h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          <div>
            <button className="text-xs text-gray-400">More</button>
          </div>
        </footer>
      </article>

      {/* Modals */}
      <LikesModal isOpen={showLikesModal} onClose={() => setShowLikesModal(false)} likes={likes} />
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        comments={localComments}
        onSubmit={handleComment}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

export default memo(Post);