import React, { useState } from 'react';
import axios from 'axios';

const BoardSaveForm = ({ setMessage, setError, setShowBoardSave, fetchPosts }) => {
  const [saveTitle, setSaveTitle] = useState('');
  const [saveContent, setSaveContent] = useState('');

  const handleSave = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8181/board/save',
        {
          title: saveTitle,
          content: saveContent,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setMessage('게시물이 성공적으로 등록되었습니다.');
        setSaveTitle('');
        setSaveContent('');
        setShowBoardSave(false);
        fetchPosts();
      } else {
        setError('게시물 등록 실패');
      }
    } catch (error) {
      setError('서버 오류');
    }
  };

  return (
    <div>
      <h2>게시물 등록</h2>
      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="title">제목:</label>
          <input type="text" id="title" value={saveTitle} onChange={(e) => setSaveTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="content">내용:</label>
          <textarea id="content" value={saveContent} onChange={(e) => setSaveContent(e.target.value)} required />
        </div>
        <button type="submit">게시물 등록</button>
      </form>
      <button onClick={() => setShowBoardSave(false)}>취소</button>
    </div>
  );
};

export default BoardSaveForm;
