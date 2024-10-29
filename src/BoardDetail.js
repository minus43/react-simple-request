// BoardDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentSection from './CommentSection';

const BoardDetail = ({ board, setSelectedPost, fetchPosts }) => {
  const [likes, setLikes] = useState(board.good_count);
  const [likedPost, setLikedPost] = useState(null);

  useEffect(() => {
    const fetchBoardLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8181/board/like_status/${board.board_num}`,
          {
            withCredentials: true,
          }
        );
        if (response.data === 'success') {
          setLikedPost(true);
        } else if (response.data === 'failed') {
          setLikedPost(false);
        }
      } catch (error) {
        console.error('좋아요 상태 불러오기 실패:', error);
      }
    };
    fetchBoardLikeStatus();

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
  }, [board]);

  const handleLikePost = async () => {
    if (likedPost === null) return;
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

  const handleBack = () => {
    fetchPosts();
    setSelectedPost(null);
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
      {likedPost === true ? (
        <button onClick={handleLikePost}>좋아요 취소</button>
      ) : (
        <button onClick={handleLikePost}>좋아요</button>
      )}
      <button onClick={handleBack}>뒤로가기</button>
      <button onClick={handleEdit}>수정하기</button>
      <button onClick={handleDelete}>삭제하기</button>

      <CommentSection board={board} />
    </div>
  );
};

export default BoardDetail;
