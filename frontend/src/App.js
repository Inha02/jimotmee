import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import Quiz from './pages/Quiz';
import BeforeLogin from './pages/BeforeLogin/BeforeLogin';
import KakaoCallbackHandler from './pages/callback';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';

const App = () => {
    const { palette } = useSelector((state) => state); // 테마 정보
    const [isChecking, setIsChecking] = useState(true); // 로그인 상태 확인 중
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

    useEffect(() => {
        // JWT 토큰 만료 시간 확인
        const tokenExpiry = sessionStorage.getItem('tokenExpiry');
        const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

        if (tokenExpiry && currentTime < parseInt(tokenExpiry, 10)) {
            setIsLoggedIn(true); // 유효한 JWT
        } else {
            // 만료된 경우 데이터 정리
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('tokenExpiry');
            setIsLoggedIn(false);
        }
        setIsChecking(false); // 상태 확인 완료
    }, []);

    if (isChecking) {
        return <div>Loading...</div>; // 상태 확인 중 로딩 화면
    }

    return (
        <ThemeProvider theme={palette}>
            {isLoggedIn && <GlobalMusicPlayer />}
            <Switch>
                {/* 로그인 여부에 따라 홈 경로 처리 */}
                <Route exact path="/">
                    {isLoggedIn ? <Home /> : <Redirect to="/before-login" />}
                </Route>

                {/* 게시판 페이지 */}
                <Route path="/board">
                    {isLoggedIn ? <Board /> : <Redirect to="/before-login" />}
                </Route>

                {/* 퀴즈 페이지 */}
                <Route path="/quiz">
                    {isLoggedIn ? <Quiz /> : <Redirect to="/before-login" />}
                </Route>

                {/* 로그인 전 페이지 */}
                <Route path="/before-login">
                    <BeforeLogin />
                </Route>

                {/* 카카오 로그인 콜백 */}
                <Route path="/callback">
                    <KakaoCallbackHandler />
                </Route>
            </Switch>
        </ThemeProvider>
    );
};

export default App;
