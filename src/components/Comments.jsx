import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVideoComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  toggleCommentDislike
} from '../redux/features/comments.slice';
import { formatDistanceToNow } from 'date-fns';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import {useParams} from "react-router-dom"

const Comments = ({ }) => {
  const {videoId:videoId} = useParams()
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [page, setPage] = useState(1);
  const [localComments, setLocalComments] = useState([]);
  const commentsContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { comments = [], loading, error, hasMore } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (Array.isArray(comments)) {
      setLocalComments(comments);
    }
  }, [comments]);

  useEffect(() => {
    let mounted = true;
    
    const fetchComments = async () => {
      if (videoId && mounted) {
        const videoIdString = typeof videoId === 'object' ? videoId._id || videoId.id : videoId;
        try {
          // Remove the condition that checks comments[0]?.videoId
          if (!Array.isArray(comments) || comments.length === 0) {
            await dispatch(fetchVideoComments(videoIdString));
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();
    
    return () => {
      mounted = false;
    };
  }, [videoId, dispatch]); // Remove 'page' and 'comments' from dependency array

  const handleScroll = useCallback(() => {
    if (commentsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = commentsContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const container = commentsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSubmitComment = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await dispatch(addComment({ videoId, content: newComment })).unwrap();
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }, [dispatch, newComment, videoId, user]);

  const handleUpdateComment = useCallback(async (commentId) => {
    if (!editContent.trim() || !user) return;
    try {
      await dispatch(updateComment({ commentId, content: editContent })).unwrap();
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  }, [dispatch, editContent, user]);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (!user) return;
    try {
      await dispatch(deleteComment({ commentId, videoId })).unwrap();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }, [dispatch, videoId, user]);

  const handleLikeComment = useCallback(async (commentId) => {
    if (!user || !commentId) return;
    
    const cleanCommentId = String(commentId).trim();
    
    // Optimistic update
    setLocalComments(prevComments => 
      prevComments.map(comment => {
        if (comment._id === cleanCommentId) {
          const wasLiked = comment.isLiked;
          return {
            ...comment,
            isLiked: !wasLiked,
            isDisliked: false,
            likesCount: wasLiked ? comment.likesCount - 1 : comment.likesCount + 1,
            dislikesCount: comment.isDisliked ? comment.dislikesCount - 1 : comment.dislikesCount
          };
        }
        return comment;
      })
    );

    try {
      await dispatch(toggleCommentLike(cleanCommentId)).unwrap();
    } catch (error) {
      console.error('Error liking comment:', error);
      // Revert on error
      setLocalComments(comments);
    }
  }, [dispatch, user, comments]);

  // Update the handleDislikeComment function
  const handleDislikeComment = useCallback(async (commentId) => {
      // Early return if no user or invalid commentId
      if (!user?._id || !commentId) {
          console.log('Invalid user or comment ID');
          return;
      }
      
      // Ensure commentId is valid
      const cleanCommentId = String(commentId).trim();
      if (!cleanCommentId) {
          console.log('Invalid comment ID after cleaning');
          return;
      }
      
      console.log('Disliking comment:', cleanCommentId);
  
      // Optimistic update
      setLocalComments(prevComments => 
          prevComments.map(comment => {
              if (comment._id === cleanCommentId) {
                  const wasDisliked = comment.isDisliked;
                  return {
                      ...comment,
                      isDisliked: !wasDisliked,
                      isLiked: false,
                      dislikesCount: wasDisliked ? comment.dislikesCount - 1 : comment.dislikesCount + 1,
                      likesCount: comment.isLiked ? comment.likesCount - 1 : comment.likesCount
                  };
              }
              return comment;
          })
      );
  
      try {
          const response = await dispatch(toggleCommentDislike(cleanCommentId)).unwrap();
          console.log('Dislike response:', response);
      } catch (error) {
          console.error('Error disliking comment:', error);
          // Revert on error
          setLocalComments(comments);
      }
  }, [dispatch, user, comments]);

  const renderLikeDislikeButtons = useCallback((comment) => (
    <div className="flex items-center gap-4 mt-2">
      <button 
        onClick={() => comment._id && handleLikeComment(comment._id)}
        className={`flex items-center gap-1 ${
          comment.isLiked
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400'
        } hover:text-gray-900 dark:hover:text-gray-200 transition-colors`}
        disabled={!user || !comment._id}
      >
        <FaThumbsUp size={16} />
        <span>{comment.likesCount || 0}</span>
      </button>
      <button 
        onClick={() => comment._id && handleDislikeComment(comment._id)}
        className={`flex items-center gap-1 ${
          comment.isDisliked
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-600 dark:text-gray-400'
        } hover:text-gray-900 dark:hover:text-gray-200 transition-colors`}
        disabled={!user || !comment._id}
      >
        <FaThumbsDown size={16} />
        <span>{comment.dislikesCount || comment.dislikes.length}</span>
      </button>
      {user?._id === comment.owner?._id && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingId(comment._id);
              setEditContent(comment.content);
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteComment(comment._id)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ), [handleLikeComment, handleDislikeComment, handleDeleteComment, user]);

  return (
    <div className="comments-section">
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
          <button 
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newComment.trim()}
          >
            Comment
          </button>
        </form>
      )}

      <div 
        ref={commentsContainerRef}
        className="comments-container max-h-[600px] overflow-y-auto"
      >
        {error && (
          <div className="text-red-500 text-center py-2">
            Error loading comments
          </div>
        )}
        
        {localComments.map((comment) => (
          <div key={comment._id} className="comment-item mb-4 p-3 border-b dark:border-gray-700">
            <div className="flex items-start gap-2">
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {comment.owner?.username || 'Unknown User'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                {editingId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateComment(comment._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent('');
                        }}
                        className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                    {renderLikeDislikeButtons(comment)}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="text-center py-2 text-gray-600 dark:text-gray-400">
            Loading more comments...
          </div>
        )}
        
        {!loading && hasMore && (
          <div className="text-center py-2 text-gray-600 dark:text-gray-400">
            Scroll for more comments...
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;