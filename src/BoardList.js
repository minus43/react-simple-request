// BoardList.js
import React, { useState } from 'react';
import MemberEditForm from './MemberEditForm';

const BoardList = ({ posts, handleLogout, setSelectedPost, setShowBoardSave, isLoggedIn, onUpdateUser }) => {
  const [showEditForm, setShowEditForm] = useState(false); // 회원정보 수정 폼 표시 여부

  const handlePostClick = (postId) => {
    const post = posts.find((p) => p.board_num === postId);
    setSelectedPost(post);
  };

  const handleEditClick = () => {
    setShowEditForm(true); // 회원정보 수정 폼 표시
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
              <strong>{post.board_num}</strong>: {post.title} : {post.content} : {post.writer} : {post.reg_date} :{' '}
              {post.mod_date} : {post.good_count} : {post.reply_count}
              <button onClick={() => handlePostClick(post.board_num)}>상세보기</button>
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
