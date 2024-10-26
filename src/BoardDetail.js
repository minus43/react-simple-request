import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BoardDetail = ({ board, setSelectedPost, fetchPosts }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 댓글 목록을 가져오는 함수에 useCallback 사용
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8181/reply/find_all/${board.board_num}`
      );
      setComments(response.data);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  }, [board.board_num]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글 추가
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
      setNewComment(''); // 입력 필드 초기화
      fetchComments(); // 댓글 목록 갱신
      fetchPosts();
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };

  // 댓글 수정
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
      fetchPosts();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8181/reply/delete/${commentId}`, {
        withCredentials: true,
      });
      fetchComments(); // 댓글 목록 갱신
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
      fetchPosts(); // 게시물 삭제 후 목록 갱신
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
          fetchPosts(); // 게시물 수정 후 목록 갱신
          setSelectedPost(null); // 수정 후 목록으로 돌아감
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
      <p>작성일: {board.reg_date}</p>
      <p>수정일: {board.mod_date}</p>
      <p>좋아요 수: {board.good_count}</p>
      <button onClick={() => setSelectedPost(null)}>뒤로가기</button>
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
                {comment.mod_date} 좋아요:{comment.good_count}
              </small>
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
