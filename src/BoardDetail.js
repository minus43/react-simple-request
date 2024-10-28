import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BoardDetail = ({ board, setSelectedPost, fetchPosts }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(board.good_count);
  const [isLiked, setIsLiked] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8181/reply/find_all/${board.board_num}`
      );
      // 각 댓글에 좋아요 수와 상태를 추가
      const commentsWithLikes = response.data.map((comment) => ({
        ...comment,
        likeCount: comment.good_count,
        isLiked: false,
      }));
      setComments(commentsWithLikes);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  }, [board.board_num]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleToggleCommentLike = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.reply_num === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      )
    );
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
      fetchPosts();
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };

  const handleEditComment = async (commentId, currentContent, commentWriter) => {
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
      fetchPosts();
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
      fetchPosts();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8181/board/delete/${board.board_num}`,
        { withCredentials: true }
      );
      setSelectedPost(null);
      alert('게시물이 삭제되었습니다.');
      fetchPosts();
    } catch (error) {
      alert('게시물 삭제에 실패했습니다.');
    }
  };

  const handleEdit = async () => {
    const newTitle = prompt('새로운 제목을 입력하세요', board.title);
    const newContent = prompt('새로운 내용을 입력하세요', board.content);

    if (newTitle && newContent) {
      try {
        const response = await axios.put(
          'http://localhost:8181/board/modify',
          {
            board_num: board.board_num,
            title: newTitle,
            content: newContent,
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          alert('게시물이 수정되었습니다.');
          fetchPosts();
          setSelectedPost(null);
        } else {
          alert('게시물 수정에 실패했습니다.');
        }
      } catch (error) {
        alert('서버 오류로 인해 게시물 수정에 실패했습니다.');
      }
    }
  };

  const handleBack = async () => {
    try {
      // 게시물 좋아요 수 & 조회수 업데이트
      await axios.put(
        `http://localhost:8181/board/like_view_update/${board.board_num}`,
        { good_count: likeCount },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        }
      );

      // 각 댓글 좋아요 수 업데이트
      for (const comment of comments) {
        await axios.put(
          `http://localhost:8181/reply/like_update/${comment.reply_num}`,
          { good_count: comment.likeCount },
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            withCredentials: true,
          }
        );
      }

      fetchPosts();
      setSelectedPost(null);
    } catch (error) {
      console.error('좋아요 업데이트 실패:', error);
    }
  };

  if (!board) return <p>Loading...</p>;

  return (
    <div>
      <h2>게시물 상세 보기</h2>
      <p>제목: {board.title}</p>
      <p>내용: {board.content}</p>
      <p>작성자: {board.writer}</p>
      <p>작성일: {board.reg_date}</p>
      <p>수정일: {board.mod_date}</p>
      <p>좋아요 수: {likeCount}</p>
      <p>조회수: {board.view_count + 1}</p>
      <button onClick={handleToggleLike}>
        {isLiked ? '좋아요 취소' : '좋아요'}
      </button>
      <button onClick={handleBack}>뒤로가기</button>
      <button onClick={handleEdit}>수정하기</button>
      <button onClick={handleDelete}>삭제하기</button>

      <h3>댓글</h3>
      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.reply_num}>
              <p>{comment.content}</p>
              <small>
                작성자: {comment.writer} 작성날짜:{comment.reg_date} 수정날짜:{' '}
                {comment.mod_date} 좋아요: {comment.likeCount}
              </small>
              <button onClick={() => handleToggleCommentLike(comment.reply_num)}>
                {comment.isLiked ? '좋아요 취소' : '좋아요'}
              </button>
              <button
                onClick={() =>
                  handleEditComment(comment.reply_num, comment.content, comment.writer)
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

export default BoardDetail;
