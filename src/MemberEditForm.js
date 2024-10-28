import React, { useState } from 'react';
import axios from 'axios';

const MemberEditForm = ({ onUpdateUser, onClose }) => {
  const [nick_name, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mlbTeam, setMlbTeam] = useState('');
  const [kboTeam, setKboTeam] = useState('');
  const [klTeam, setKlTeam] = useState('');
  const [plTeam, setPlTeam] = useState('');
  const [kblTeam, setKblTeam] = useState('');
  const [nbaTeam, setNbaTeam] = useState('');
  const [vmanTeam, setVmanTeam] = useState('');
  const [vwoTeam, setVwoTeam] = useState('');
  const [isUsernameUnique, setIsUsernameUnique] = useState(null);
  const [isEmailUnique, setIsEmailUnique] = useState(null);
  


  const mlbTeams = ["Baltimore Orioles", "Boston Red Sox", "New York Yankees", "Tampa Bay Rays", "Toronto Blue Jays", "Chicago White Sox", "Cleveland Guardians", "Detroit Tigers", "Kansas City Royals", "Minnesota Twins", "Houston Astros", "Los Angeles Angels", "Oakland Athletics", "Seattle Mariners", "Texas Rangers", "Atlanta Braves", "Miami Marlins", "New York Mets", "Philadelphia Phillies", "Washington Nationals", "Chicago Cubs", "Cincinnati Reds", "Milwaukee Brewers", "Pittsburgh Pirates", "St. Louis Cardinals", "Arizona Diamondbacks", "Colorado Rockies", "Los Angeles Dodgers", "San Diego Padres", "San Francisco Giants"];
  
  const kboTeams = ["두산 베어스", "롯데 자이언츠", "삼성 라이온즈", "SSG 랜더스", "키움 히어로즈", "LG 트윈스", "한화 이글스", "NC 다이노스"];
  
  const klTeams = ["전북 현대 모터스", "울산 현대 FC", "FC 서울", "수원 삼성 블루윙즈", "포항 스틸러스"];
  
  const plTeams = ["아스날", "맨체스터 시티", "리버풀", "첼시", "토트넘"];
  
  const kblTeams = ["서울 SK 나이츠", "안양 KGC", "전주 KCC 이지스"];
  
  const nbaTeams = ["Los Angeles Lakers", "Golden State Warriors", "Miami Heat", "Brooklyn Nets"];
  
  const vmanTeams = ["삼성화재 블루팡스", "현대캐피탈 스카이워커스"];
  
  const vwoTeams = ["GS칼텍스 서울 KIXX", "흥국생명 핑크스파이더스"];

  const handleUsernameCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:8181/member/valid_id?nick_name=${nick_name}`);
      if(response.data==='failed'){
        setIsUsernameUnique(true)
      } else{
        setIsUsernameUnique(false)
      }
    } catch (error) {
      
    }
  };

  const handleEmailCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:8181/member/valid_email?email=${email}`);
      if(response.data==='failed'){
        setIsEmailUnique(true)
      } else{
        setIsEmailUnique(false)
      }
    } catch (error) {
        
    }
  };

  const handleUpdate = async () => {

    try {
      const response = await axios.put(`http://localhost:8181/member/modify`, {
        nick_name: nick_name,
        password: password,
        email: email,
        mlb_team: mlbTeam,
        kbo_team: kboTeam,
        kl_team: klTeam,
        pl_team: plTeam,
        kbl_team: kblTeam,
        nba_team: nbaTeam,
        vman_team: vmanTeam,
        vwo_team: vwoTeam,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        withCredentials: true,
      });
      
      if (response.status === 200) {
        alert('회원정보가 수정되었습니다.');
        onUpdateUser(response.data);
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert('회원정보 수정에 실패했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', maxWidth: '600px' }}>
      <h2 style={{ width: '100%' }}>회원정보 수정</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          value={nick_name}
          onChange={(e) => setNickName(e.target.value)}
          placeholder='닉네임'
          style={{ width: '150px' }}
        />
        <button onClick={handleUsernameCheck}>닉네임 중복 확인</button>
        {isUsernameUnique !==null && (
          <span>
            {isUsernameUnique ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'}
          </span>
        )}
      </div>

      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='비밀번호'
        style={{ width: '150px' }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='이메일'
          style={{ width: '150px' }}
        />
        <button onClick={handleEmailCheck}>이메일 중복 확인</button>
        {isEmailUnique !==null && (
          <span>
            {isEmailUnique ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.'}
          </span>
        )}
      </div>

      <select value={mlbTeam} onChange={(e) => setMlbTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">MLB 팀 선택</option>
        {mlbTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={kboTeam} onChange={(e) => setKboTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">KBO 팀 선택</option>
        {kboTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={klTeam} onChange={(e) => setKlTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">KL 팀 선택</option>
        {klTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={plTeam} onChange={(e) => setPlTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">PL 팀 선택</option>
        {plTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={kblTeam} onChange={(e) => setKblTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">KBL 팀 선택</option>
        {kblTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={nbaTeam} onChange={(e) => setNbaTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">NBA 팀 선택</option>
        {nbaTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={vmanTeam} onChange={(e) => setVmanTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">V리그 남자 팀 선택</option>
        {vmanTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <select value={vwoTeam} onChange={(e) => setVwoTeam(e.target.value)} style={{ width: '150px' }}>
        <option value="">V리그 여자 팀 선택</option>
        {vwoTeams.map(team => <option key={team} value={team}>{team}</option>)}
      </select>

      <button onClick={handleUpdate} style={{ width: '150px' }}>수정하기</button>
      <button onClick={onClose} style={{ width: '150px' }}>취소</button>
    </div>
  );
};

export default MemberEditForm;
