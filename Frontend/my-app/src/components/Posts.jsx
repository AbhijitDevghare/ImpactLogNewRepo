import { useEffect, useRef, useState, startTransition, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLatestPost } from "../redux/slices/PostSlice";
import Post from "./Post";
import VirtualizedList from "./VirtualizedList";
import { likePost, commentPost, sharePost } from '../redux/slices/EngagementSlice';

function Posts() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);
  

  // Progressive rendering state and sentinel for infinite "load more"
  const [visibleCount, setVisibleCount] = useState(() => {
    const estPerScreen = Math.ceil(
      (typeof window !== "undefined" ? window.innerHeight : 800) / 450
    );
    return Math.max(10, estPerScreen + 6);
  });

  const CHUNK = 10; 
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getLatestPost());
      console.log("POSTS : ",posts)
    }
  }, [dispatch]);

  // Ensure initial batch is reasonable when posts change
  useEffect(() => {
    if (!Array.isArray(posts)) return;
    const estPerScreen = Math.ceil(
      (typeof window !== "undefined" ? window.innerHeight : 800) / 450
    );
    const initial = Math.max(10, estPerScreen + 6);
    setVisibleCount((c) => Math.min(Math.max(c, initial), posts.length));
  }, [posts?.length]);

  // Observe the sentinel and grow visibleCount as the user scrolls
  useEffect(() => {
    if (!Array.isArray(posts) || visibleCount >= posts.length) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          startTransition(() => {
            setVisibleCount((c) => Math.min(c + CHUNK, posts.length));
            setTimeout(() => setIsLoading(false), 100);
          });
        }
      },
      { root: null, rootMargin: "800px 0px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [posts, visibleCount, isLoading]);

  // Memoized visible posts for performance
  const visiblePosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.slice(0, visibleCount);
  }, [posts, visibleCount]);

  // Render function for virtualized list
  const renderPost = useMemo(() => (post, index) => (
    <div
      key={post.id || index}
      // Enhanced performance hints for the browser
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "650px",
        // Optimize for GPU acceleration
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      <Post
        id={post.id}
        authorName={post.authorName}
        authorAvatarUrl={post.authorProfileUrl}
        timestamp={new Date(post.createdAt || Date.now()).toLocaleString()}
        content={post.content}
        images={post.mediaUrls}
        likesCount={Array.isArray(post.engagement?.likes) ? post.engagement.likes.length : (typeof post.engagement?.likes === 'number' ? post.engagement.likes : 0)}
        likes={Array.isArray(post.engagement?.likes) ? post.engagement.likes : []}
        comments={Array.isArray(post.engagement?.comments) ? post.engagement.comments : []}
        shares={Array.isArray(post.engagement?.shares) ? post.engagement.shares.length : 0}
        onLike={() => dispatch(likePost({ postId: post.id }))}
        onComment={(text) => dispatch(commentPost({ postId: post.id, comment: text }))}
        onShare={() => dispatch(sharePost({ postId: post.id }))}
        authorId={post.authorId}
      />
    </div>
  ), [dispatch]);

  if (!Array.isArray(posts)) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        // Use VirtualizedList for better performance with large lists
        <VirtualizedList
          items={visiblePosts}
          itemHeight={650} // Estimated height per post
          containerHeight={typeof window !== "undefined" ? window.innerHeight - 200 : 600}
          renderItem={renderPost}
          overscan={3}
          className="space-y-6"
        />
      ) : (
        <p className="text-gray-400 text-center">Loading ...</p>
      )}

      {/* Enhanced loading indicator */}
      {Array.isArray(posts) && visibleCount < posts.length && (
        <div ref={sentinelRef} className="py-6 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-300 text-sm">Loading more posts...</p>
            </div>
          ) : (
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"
                   style={{ width: `${(visibleCount / posts.length) * 100}%` }}></div>
            </div>
          )}
        </div>
      )}

      {/* End of feed indicator */}
      {Array.isArray(posts) && visibleCount >= posts.length && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
}

export default memo(Posts);
