import React, { useState } from 'react';
import axios from 'axios';

/**
 * SignupForm 컴포넌트
 * 
 * 기본 회원가입 폼과 카카오톡 간편로그인을 제공함.
 * 서버 응답에 따라 성공 또는 오류 메시지를 표시함.
 *
 * @param {Function} setMessage - 성공 메시지를 표시하는 함수.
 * @param {Function} setError - 오류 메시지를 표시하는 함수.
 * @returns {JSX.Element} 회원가입 폼 컴포넌트.
 */
const SignupForm = ({ setMessage, setError }) => {
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  // 일반 회원가입 처리
  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8181/member/signup',
        {
          nick_name: signupUsername,
          password: signupPassword,
          email: signupEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      );

      if (response.status === 200) {
        setMessage('회원가입에 성공하였습니다. 로그인 해주세요.');
        setSignupUsername('');
        setSignupPassword('');
        setSignupEmail('');
      } else {
        setError('회원가입 실패');
      }
    } catch (error) {
      setError('서버 오류');
    }
  };

 

  return (
    <form onSubmit={handleSignup}>
      <div>
        <label htmlFor='signupUsername'>닉네임:</label>
        <input
          type='text'
          id='signupUsername'
          value={signupUsername}
          onChange={(e) => setSignupUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='signupPassword'>비밀번호:</label>
        <input
          type='password'
          id='signupPassword'
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='signupEmail'>이메일:</label>
        <input
          type='email'
          id='signupEmail'
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button type='submit'>회원가입</button>
        
      </div>
    </form>
  );
};

export default SignupForm;
