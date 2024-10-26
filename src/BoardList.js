import React from 'react';

const BoardList = ({ posts, handleLogout, setSelectedPost, setShowBoardSave }) => {
  const handlePostClick = (postId) => {
    const post = posts.find((p) => p.board_num === postId);
    setSelectedPost(post);
  };

  return (
    <div>
      <h2>게시물 목록</h2>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={() => setShowBoardSave(true)}>게시물 등록</button>
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
