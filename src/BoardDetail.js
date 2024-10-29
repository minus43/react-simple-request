import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BoardDetail = ({ board, setSelectedPost, fetchPosts }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [likedPost, setLikedPost] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [likedComments, setLikedComments] = useState({});

  // 댓글 목록을 서버에서 가져옴
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
      // 각 댓글의 좋아요 상태와 좋아요 수 설정
      const likedStatus = {};
      const likesCount = {};
      response.data.forEach((comment) => {
        likedStatus[comment.reply_num] = comment.liked;
        likesCount[comment.reply_num] = comment.likeCount;
      });
      setLikedComments(likedStatus);
      setCommentLikes(likesCount);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  }, [board]);

  useEffect(() => {
    fetchComments();
    setLikes(board.good_count || 0);
    const updateViewCount = async () => {
      try {
        await axios.put(`http://localhost:8181/board/view/${board.board_num}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error('조회수 업데이트 실패:', error);
      }
    };
    updateViewCount();
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8181/board/like_status/${board.board_num}`,
          {
            withCredentials: true,
          }
        );
        setLikedPost(response.data === 'success');
      } catch (error) {
        console.error('좋아요 상태 조회 실패:', error);
      }
    };
    fetchLikeStatus(); // 초기 좋아요 수 설정
  }, [fetchComments, board]);

  // 게시글 좋아요 클릭 핸들러
  const handleLikePost = async () => {
    if (likedPost === null) return; // 초기 좋아요 상태를 알 수 없을 때 클릭 방지
    try {
      if (likedPost) {
        await axios.delete(
          `http://localhost:8181/board/unlike/${board.board_num}`,
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            withCredentials: true,
          }
        );
        setLikes((prevLikes) => prevLikes - 1);
      } else {
        await axios.post(
          `http://localhost:8181/board/like/${board.board_num}`,
          null,
          {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
            },
            withCredentials: true,
          }
        );
        setLikes((prevLikes) => prevLikes + 1);
      }
      setLikedPost((prevLiked) => !prevLiked);
    } catch (error) {
      console.error('게시물 좋아요/취소 실패:', error);
    }
  };

  // 댓글 좋아요 클릭 핸들러
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

  // 뒤로 가기 버튼 - 게시물 목록으로 돌아가기
  const handleBack = () => {
    fetchPosts();
    setSelectedPost(null);
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

  if (!board) return <p>Loading...</p>;

  return (
    <div>
      <h2>게시물 상세 보기</h2>
      <p>제목: {board.title}</p>
      <p>내용: {board.content}</p>
      <p>작성자: {board.writer}</p>
      <p>조회수: {board.view_count + 1}</p>
      <p>좋아요: {likes}</p>
      {!likedPost ? (
        <button onClick={handleLikePost}>좋아요</button>
      ) : (
        <button onClick={handleLikePost}>좋아요 취소</button>
      )}
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

export default BoardDetail;
