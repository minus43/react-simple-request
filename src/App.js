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
  const [showSignupForm, setShowSignupForm] = useState(false);
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

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8181/member/check_login', {
        withCredentials: true,
      });
  
      if (response.status === 200 && response.data !== "failed" && response.data.username !== null) {
        setIsLoggedIn(true);
        setUserData(response.data); // 사용자 정보 설정
        console.log(response.data); // 응답 데이터 로그 출력
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setError('로그인 상태 확인 실패');
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인
    fetchPosts(); // 항상 게시물 목록을 불러오기
  }, []);
  
  useEffect(() => {
    console.log("userData 상태가 업데이트되었습니다:", userData);
  }, [userData]);

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
        setSelectedPost(null);
        setShowBoardSave(false);
      } else {
        setError('로그아웃 실패');
      }
    } catch (error) {
      setError('서버 오류');
    }
  };

  // 사용자 정보 업데이트 핸들러
  const handleUpdateUser = (updatedUserData) => {
    setUserData(updatedUserData);
    setMessage('회원정보가 수정되었습니다.');
  };

  return (
    <div>
      {isLoggedIn && userData && (
        <div>
          <h2>{userData.nick_name}님 안녕하세요!</h2>
        </div>
      )}
      {!isLoggedIn && (
        <div>
          <h2>로그인 또는 회원가입</h2>
          {message && <p>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <LoginForm
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
            setMessage={setMessage}
            setError={setError}
          />
          <button onClick={() => setShowSignupForm(!showSignupForm)}>
            {showSignupForm ? '회원가입 닫기' : '회원가입 열기'}
          </button>
          {showSignupForm && <SignupForm setMessage={setMessage} setError={setError} />}
        </div>
      )}

      {showBoardSave ? (
        <BoardSaveForm
          setMessage={setMessage}
          setError={setError}
          setShowBoardSave={setShowBoardSave}
          fetchPosts={fetchPosts}
        />
      ) : selectedPost ? (
        <BoardDetail
          board={selectedPost}
          setSelectedPost={setSelectedPost}
          fetchPosts={fetchPosts}
        />
      ) : (
        <BoardList
          posts={posts}
          handleLogout={handleLogout}
          setSelectedPost={setSelectedPost}
          setShowBoardSave={setShowBoardSave}
          isLoggedIn={isLoggedIn}
          onUpdateUser={handleUpdateUser} // 사용자 정보 업데이트 함수 전달
        />
      )}
    </div>
  );
};

export default App;
