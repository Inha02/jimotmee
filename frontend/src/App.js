import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BeforeLogin from './pages/BeforeLogin/BeforeLogin';

const App = () => {
  const { palette } = useSelector(state => state); // 테마 정보
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isChecking, setIsChecking] = useState(true); // 로그인 상태 확인 중

  useEffect(() => {
    // 로그인 상태 확인
    const sessionData = sessionStorage.getItem('isLoggedIn');
    setIsLoggedIn(sessionData === 'true');
    setIsChecking(false); // 상태 확인 완료
  }, []);

  if (isChecking) {
    return <div>Loading...</div>; // 상태 확인 중 로딩 화면
  }

  return (
    <ThemeProvider theme={palette}>
      <Switch>
        {/* 로그인 여부에 따라 홈 경로 처리 */}
        <Route exact path="/">
          {isLoggedIn ? <Home /> : <Redirect to="/before-login" />}
        </Route>

        {/* 프로필 페이지 */}
        <Route path="/profile">
          {isLoggedIn ? <Profile /> : <Redirect to="/before-login" />}
        </Route>

        {/* 로그인 전 페이지 */}
        <Route path="/before-login">
          <BeforeLogin setIsLoggedIn={setIsLoggedIn} />
        </Route>
      </Switch>
    </ThemeProvider>
  );
};

export default App;
