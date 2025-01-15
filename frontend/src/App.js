import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Board from './pages/Board';
import Quiz from './pages/Quiz';
import BeforeLogin from './pages/BeforeLogin/BeforeLogin';
import KakaoCallbackHandler from './pages/callback';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';
import { fetchPalette, loadPalette } from './module/palette';

const App = () => {
    const dispatch = useDispatch();
    const palette = useSelector((state) => state.palette); // 테마 정보
    const [isChecking, setIsChecking] = useState(true); // 로그인 상태 확인 중
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

    const defaultTheme = {
        bg: {
          title: '배경',
          color: 'gray',
        },
        layoutBorder1: {
          title: '바깥 테두리',
          color: 'black',
        },
        layoutBg1: {
          title: '바깥(1) 영역',
          color: '#a9d2d9',
        },
        layoutBorder2: {
          title: '점선 테두리',
          color: '#fff',
        },
        layoutBg2: {
          title: '바깥(2) 영역',
          color: 'lightgray',
        },
        cardBorder: {
          title: '안쪽 테두리',
          color: '#a5a5a5',
        },
        cardBg: {
          title: '안쪽 영역',
          color: '#fff',
        },
        mainColor: {
          title: '메인 메뉴',
          color: '#238db3',
        },
        headerColor: {
          title: '미니포트폴리 타이틀',
          color: '#333',
        },
        textColor: {
          title: '서브페이지 메뉴',
          color: '#07698c',
        },
    };

    const transformPaletteData = (data) => {
        return data.reduce((acc, item) => {
            acc[item.key] = { title: item.title, color: item.color };
            return acc;
        }, {});
    };

    useEffect(() => {
        // 카카오 SDK 초기화
        if (!window.Kakao.isInitialized()) {
            const kakaoKey = process.env.REACT_APP_JAVASCRIPT_KEY;
            window.Kakao.init(kakaoKey);
            console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
        }

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

        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const userId = userInfo?.userId;

        if (!userId) {
            setIsChecking(false); // 비로그인 상태 처리
            return;
        }
    
        fetchPalette(userId)
        .then(response => {
            console.log('App.js - API 원본 응답 데이터:', response);
    
            // response가 배열인지 확인
            if (Array.isArray(response)) {
                const data = response.reduce((acc, item) => {
                    acc[item.key] = { title: item.title, color: item.color };
                    return acc;
                }, {});
                console.log('App.js - 변환된 팔레트 데이터:', data);
                dispatch(loadPalette(data));
            } else {
                console.warn('App.js - 유효하지 않은 팔레트 데이터:', response);
                dispatch(loadPalette(defaultTheme)); // 기본 테마 설정
            }
        })
        .catch(err => {
            console.error('App.js - 팔레트 로드 오류:', err);
            dispatch(loadPalette(defaultTheme));
        })
        .finally(() => setIsChecking(false));
    }, [dispatch]);

    if (isChecking) {
        return <div>Loading...</div>; // 로딩 화면 표시
    }

    return (
        <ThemeProvider theme={palette || defaultTheme}>
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
