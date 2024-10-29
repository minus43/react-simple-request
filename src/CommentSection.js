// CommentSection.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CommentSection = ({ board }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLikes, setCommentLikes] = useState({});
  const [likedComments, setLikedComments] = useState({});

  const fetchComments = useCallback(async () => {
    if (!board || !board.board_num) {
      console.error('유효하지 않은 게시물 번호입니다.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8181/reply/find_all/${board.board_num}`
      );
      setComments(response.data);
      const likesCount = {};
      response.data.forEach((comment) => {
        likesCount[comment.reply_num] = comment.good_count || 0;
      });
      setCommentLikes(likesCount);
      const likedStatus = await axios.get(
        `http://localhost:8181/reply/like_status/${board.board_num}`,
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        }
      );
      setLikedComments(
        likedStatus.data.reduce((acc, replyNum) => {
          acc[replyNum] = true;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  }, [board]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLikeComment = async (commentId) => {
    try {
      if (likedComments[commentId]) {
        await axios.delete(`http://localhost:8181/reply/unlike/${commentId}`, {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        });
        setCommentLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: (prevLikes[commentId] || 1) - 1,
        }));
      } else {
        await axios.post(
          `http://localhost:8181/reply/like/${commentId}`,
          null,
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            withCredentials: true,
          }
        );
        setCommentLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: (prevLikes[commentId] || 0) + 1,
        }));
      }
      setLikedComments((prevLiked) => ({
        ...prevLiked,
        [commentId]: !prevLiked[commentId],
      }));
    } catch (error) {
      console.error('댓글 좋아요/취소 실패:', error);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!newComment) return;

    try {
      await axios.post(
        'http://localhost:8181/reply/save',
        {
          board_num: board.board_num,
          content: newComment,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };

  const handleEditComment = async (
    commentId,
    currentContent,
    commentWriter
  ) => {
    const updatedContent = prompt('댓글 내용을 수정하세요:', currentContent);
    if (!updatedContent) return;

    try {
      await axios.put(
        'http://localhost:8181/reply/modify',
        {
          reply_: commentId,
          content: updatedContent,
          writer: commentWriter,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        }
      );
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8181/reply/delete/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('popstate', fetchComments);
    return () => {
      window.removeEventListener('popstate', fetchComments);
    };
  }, [fetchComments]);

  return (
    <div>
      <h3>댓글</h3>
      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.reply_num}>
              <p>{comment.content}</p>
              <small>작성자: {comment.writer}</small>
              <p>좋아요: {commentLikes[comment.reply_num] || 0}</p>
              <button onClick={() => handleLikeComment(comment.reply_num)}>
                {likedComments[comment.reply_num] ? '좋아요 취소' : '좋아요'}
              </button>
              <button
                onClick={() =>
                  handleEditComment(
                    comment.reply_num,
                    comment.content,
                    comment.writer
                  )
                }
              >
                수정
              </button>
              <button onClick={() => handleDeleteComment(comment.reply_num)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment}>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='댓글을 입력하세요'
          required
        />
        <button type='submit'>댓글 추가</button>
      </form>
    </div>
  );
};

export default CommentSection;
