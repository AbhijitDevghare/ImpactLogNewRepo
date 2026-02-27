import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLatestPost, createPost } from "../redux/slices/PostSlice";
import Posts from "./Posts";

// Default main feed content (share box + posts list)
function MainFeed() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.posts);
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getLatestPost());
  }, [dispatch]);

  const handleShare = () => {
    if (postContent.trim() || images.length > 0) {
      dispatch(createPost({ content: postContent, images }));
      setPostContent("");
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      // Optionally refetch posts after creation
      dispatch(getLatestPost());
    }
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  return (
  <section className="space-y-6 pr-2">
      {/* Share Post Card */}
      <div
        data-reveal
        className="rounded-2xl p-4 bg-gray-800/80 backdrop-blur border border-gray-700/60 shadow-xl hover:shadow-2xl transition"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-900/50 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-sm"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={3}
            />
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`preview-${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-4 text-sm text-gray-400">
                <button className="flex items-center gap-1 hover:text-gray-200 transition" onClick={() => fileInputRef.current?.click()}>
                  <img src="/src/assets/icons/gallery.svg" alt="" className="h-5" /> Photo
                </button>
                <button className="flex items-center gap-1 hover:text-gray-200 transition">
                  <img src="/src/assets/icons/attachment.svg" alt="" className="h-5" /> Link
                </button>
                <button className="flex items-center gap-1 hover:text-gray-200 transition">
                  <img src="/src/assets/icons/location.svg" alt="" className="h-5" /> Location
                </button>
                <button className="flex items-center gap-1 hover:text-gray-200 transition">
                  <img src="/src/assets/icons/smile.svg" alt="" className="h-5" /> Feeling
                </button>
              </div>
              <button
                className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 flex items-center gap-2"
                onClick={handleShare}
                disabled={loading || (!postContent.trim() && images.length === 0)}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Posts Feed */}
      <Posts />
    </section>
  );
}

export default MainFeed;
