// BoardList.js
import React, { useState } from 'react';
import axios from 'axios';
import MemberEditForm from './MemberEditForm';

const BoardList = ({
  posts,
  handleLogout,
  setSelectedPost,
  setShowBoardSave,
  isLoggedIn,
  onUpdateUser,
}) => {
  const [showEditForm, setShowEditForm] = useState(false); // 회원정보 수정 폼 표시 여부
  const [showPasswordCheck, setShowPasswordCheck] = useState(false); // 비밀번호 확인 폼 표시 여부
  const [password, setPassword] = useState('');

  const handlePostClick = (postId) => {
    const post = posts.find((p) => p.board_num === postId);
    setSelectedPost(post);
  };

  const handleEditClick = () => {
    setShowPasswordCheck(true); // 비밀번호 확인 폼 표시
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8181/member/valid_password',
        {
          params: { password },
          withCredentials: true, // 쿠키를 함께 전달
        }
      );

      if (response.data === 'success') {
        setShowEditForm(true);
        setShowPasswordCheck(false);
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 확인 중 오류 발생:', error);
      alert('비밀번호 확인에 실패했습니다.');
    }
  };

  return (
    <div>
      <h2>게시물 목록</h2>
      {isLoggedIn && (
        <>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={() => setShowBoardSave(true)}>게시물 등록</button>
          <button onClick={handleEditClick}>회원정보 수정</button>
        </>
      )}

      {showPasswordCheck && (
        <div>
          <h3>비밀번호 확인</h3>
          <input
            type='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='비밀번호를 입력하세요'
          />
          <button onClick={handlePasswordSubmit}>확인</button>
        </div>
      )}

      {showEditForm && (
        <MemberEditForm
          onUpdateUser={onUpdateUser}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.board_num}>
              <strong>게시물 번호:</strong> {post.board_num} <br />
              <strong>제목:</strong> {post.title} <br />
              <strong>내용:</strong> {post.content} <br />
              <strong>작성자:</strong> {post.writer} <br />
              <strong>작성일:</strong> {post.reg_date} <br />
              <strong>수정일:</strong> {post.mod_date} <br />
              <strong>좋아요 수:</strong> {post.good_count} <br />
              <strong>댓글 수:</strong> {post.reply_count} <br />
              <strong>조회 수:</strong> {post.view_count} <br />
              <button onClick={() => handlePostClick(post.board_num)}>
                상세보기
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
};

export default BoardList;
