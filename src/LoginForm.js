import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ setIsLoggedIn, setUserData, setMessage, setError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8181/member/login',
        {
          nick_name: username,
          password: password,
          auto_login: autoLogin,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        }
      );

      setMessage(response.data);
      setIsLoggedIn(true);
      setUserData({ username });
    } catch (error) {
      setError(error.response?.data || '로그인 실패');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor='username'>아이디:</label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='password'>비밀번호:</label>
        <input
          type='text'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            checked={autoLogin}
            onChange={(e) => setAutoLogin(e.target.checked)}
          />
          자동 로그인
        </label>
      </div>
      <button type='submit'>로그인</button>
    </form>
  );
};

export default LoginForm;
