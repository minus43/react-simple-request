import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ setMessage, setError }) => {
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [mlbTeam, setMlbTeam] = useState('');
  const [kboTeam, setKboTeam] = useState('');
  const [klTeam, setKlTeam] = useState('');
  const [plTeam, setPlTeam] = useState('');
  const [kblTeam, setKblTeam] = useState('');
  const [nbaTeam, setNbaTeam] = useState('');
  const [vmanTeam, setVmanTeam] = useState('');
  const [vwoTeam, setVwoTeam] = useState('');

  const mlbTeams = ["Baltimore Orioles", "Boston Red Sox", "New York Yankees", "Tampa Bay Rays", "Toronto Blue Jays", "Chicago White Sox", "Cleveland Guardians", "Detroit Tigers", "Kansas City Royals", "Minnesota Twins", "Houston Astros", "Los Angeles Angels", "Oakland Athletics", "Seattle Mariners", "Texas Rangers", "Atlanta Braves", "Miami Marlins", "New York Mets", "Philadelphia Phillies", "Washington Nationals", "Chicago Cubs", "Cincinnati Reds", "Milwaukee Brewers", "Pittsburgh Pirates", "St. Louis Cardinals", "Arizona Diamondbacks", "Colorado Rockies", "Los Angeles Dodgers", "San Diego Padres", "San Francisco Giants"];

  const kboTeams = ["두산 베어스", "롯데 자이언츠", "삼성 라이온즈", "SSG 랜더스", "키움 히어로즈", "LG 트윈스", "한화 이글스", "NC 다이노스"];

  const klTeams = ["전북 현대 모터스", "울산 현대 FC", "FC 서울", "수원 삼성 블루윙즈", "포항 스틸러스"];

  const plTeams = ["아스날", "맨체스터 시티", "리버풀", "첼시", "토트넘"];

  const kblTeams = ["서울 SK 나이츠", "안양 KGC", "전주 KCC 이지스"];

  const nbaTeams = ["Los Angeles Lakers", "Golden State Warriors", "Miami Heat", "Brooklyn Nets"];

  const vmanTeams = ["삼성화재 블루팡스", "현대캐피탈 스카이워커스"];

  const vwoTeams = ["GS칼텍스 서울 KIXX", "흥국생명 핑크스파이더스"];

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
        }
      );

      if (response.status === 200) {
        setMessage('회원가입에 성공하였습니다. 로그인 해주세요.');
        setSignupUsername('');
        setSignupPassword('');
        setSignupEmail('');
        setMlbTeam('');
        setKboTeam('');
        setKlTeam('');
        setPlTeam('');
        setKblTeam('');
        setNbaTeam('');
        setVmanTeam('');
        setVwoTeam('');
      } else {
        setError('회원가입 실패');
      }
    } catch (error) {
      setError('서버 오류');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      {/* Nickname, Password, Email */}
      <div>
        <label>닉네임:</label>
        <input type="text" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required />
      </div>
      <div>
        <label>비밀번호:</label>
        <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
      </div>
      <div>
        <label>이메일:</label>
        <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
      </div>

      {/* MLB Team */}
      <div>
        <label>MLB 팀:</label>
        <select value={mlbTeam} onChange={(e) => setMlbTeam(e.target.value)}>
          <option value="">선택</option>
          {mlbTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* KBO Team */}
      <div>
        <label>KBO 팀:</label>
        <select value={kboTeam} onChange={(e) => setKboTeam(e.target.value)}>
          <option value="">선택</option>
          {kboTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* KL Team */}
      <div>
        <label>KL 팀:</label>
        <select value={klTeam} onChange={(e) => setKlTeam(e.target.value)}>
          <option value="">선택</option>
          {klTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* PL Team */}
      <div>
        <label>PL 팀:</label>
        <select value={plTeam} onChange={(e) => setPlTeam(e.target.value)}>
          <option value="">선택</option>
          {plTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* KBL Team */}
      <div>
        <label>KBL 팀:</label>
        <select value={kblTeam} onChange={(e) => setKblTeam(e.target.value)}>
          <option value="">선택</option>
          {kblTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* NBA Team */}
      <div>
        <label>NBA 팀:</label>
        <select value={nbaTeam} onChange={(e) => setNbaTeam(e.target.value)}>
          <option value="">선택</option>
          {nbaTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* V League Men */}
      <div>
        <label>V리그 남자 팀:</label>
        <select value={vmanTeam} onChange={(e) => setVmanTeam(e.target.value)}>
          <option value="">선택</option>
          {vmanTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      {/* V League Women */}
      <div>
        <label>V리그 여자 팀:</label>
        <select value={vwoTeam} onChange={(e) => setVwoTeam(e.target.value)}>
          <option value="">선택</option>
          {vwoTeams.map(team => <option key={team} value={team}>{team}</option>)}
        </select>
      </div>

      <button type="submit">회원가입</button>
    </form>
  );
};

export default SignupForm;
