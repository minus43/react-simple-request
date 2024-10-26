import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import BoardList from './BoardList';
import BoardSaveForm from './BoardSaveForm';
import BoardDetail from './BoardDetail';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBoardSave, setShowBoardSave] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8181/board/find_all', {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
      setPosts(response.data);
    } catch (error) {
      setError('게시물 조회 실패');
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8181/member/logout',
        null,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessage('로그아웃 되었습니다.');
        setIsLoggedIn(false);
        setUserData(null);
        setPosts([]);
        setSelectedPost(null);
        setShowBoardSave(false);
      } else {
        setError('로그아웃 실패');
      }
    } catch (error) {
      setError('서버 오류');
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <div>
          <h2>로그인 또는 회원가입</h2>
          {message && <p>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <LoginForm setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} setMessage={setMessage} setError={setError} />
          <SignupForm setMessage={setMessage} setError={setError} />
        </div>
      ) : showBoardSave ? (
        <BoardSaveForm setMessage={setMessage} setError={setError} setShowBoardSave={setShowBoardSave} fetchPosts={fetchPosts} />
      ) : selectedPost ? (
        // 여기에서 BoardDetail에 fetchPosts를 전달
        <BoardDetail board={selectedPost} setSelectedPost={setSelectedPost} fetchPosts={fetchPosts} />
      ) : (
        <BoardList posts={posts} handleLogout={handleLogout} setSelectedPost={setSelectedPost} setShowBoardSave={setShowBoardSave} />
      )}
    </div>
  );
};

export default App;
