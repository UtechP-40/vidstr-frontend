import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoComments, addComment, updateComment, deleteComment } from '../redux/features/comments.slice';

const Comments = ({ videoId }) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoComments(videoId));
    }
  }, [videoId, dispatch]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(addComment({ videoId, comment: newComment })).unwrap();
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      await dispatch(updateComment({ commentId, comment: editContent })).unwrap();
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(deleteComment(commentId)).unwrap();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    // TODO: Implement like functionality
    console.log('Like comment:', commentId);
  };

  if (loading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="px-5 py-4 max-w-4xl mx-auto">
      {user ? (
        <form onSubmit={handleSubmitComment} className="flex gap-3 mb-6">
          <img 
            src={user.avatar || "/default-avatar.png"} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comment
          </button>
        </form>
      ) : (
        <div className="text-center py-4 mb-6 text-gray-600">
          Please login to add comments
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <img
              src={comment.owner?.avatar || "/default-avatar.png"}
              alt={`${comment.owner?.username}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{comment.owner?.username}</div>
                <div className="flex gap-2">
                  {user && (
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <i className="fas fa-thumbs-up"></i> Like
                    </button>
                  )}
                  {user?._id === comment.owner?._id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditContent(comment.content);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId === comment._id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-700">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;