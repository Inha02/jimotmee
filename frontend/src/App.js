import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Board from './pages/Board/Board';
import BeforeLogin from './pages/BeforeLogin/BeforeLogin';
import KakaoCallbackHandler from './pages/callback';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';

const App = () => {
    const { palette } = useSelector((state) => state); // 테마 정보
    const [isChecking, setIsChecking] = useState(true); // 로그인 상태 확인 중
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

    const [posts, setPosts] = useState([]); // 게시물 상태
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부
    const LIMIT = 10; // 한 번에 가져올 게시물 개수

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

    // 게시물 데이터를 가져오는 함수
    const fetchPosts = async (page) => {
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=${LIMIT}`);
            const data = await response.json();

            if (data.length < LIMIT) {
                setHasMore(false); // 더 이상 데이터가 없으면 false
            }

            setPosts((prevPosts) => [...prevPosts, ...data]); // 기존 게시물에 새 데이터 추가
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // 페이지가 변경될 때마다 데이터를 가져옴
    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page]);

    // 무한 스크롤 구현
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 100 &&
                hasMore
            ) {
                setPage((prevPage) => prevPage + 1); // 다음 페이지 로드
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    // 처음 로드 시 첫 페이지 데이터 가져오기
    useEffect(() => {
        fetchPosts(1);
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
                  {isChecking ? (
                    <div>Loading...</div>
                  ) : isLoggedIn ? (
                    <Home />
                  ) : (
                    <Redirect to="/before-login" />
                  )}
                </Route>

                {/* 프로필 페이지 */}
                <Route path="/profile">
                  {isChecking ? (
                    <div>Loading...</div>
                  ) : isLoggedIn ? (
                    <Profile />
                  ) : (
                    <Redirect to="/before-login" />
                  )}
                </Route>

                {/* 게시판 페이지 */}
                <Route path="/board">
                  {isChecking ? (
                    <div>Loading...</div>
                  ) : isLoggedIn ? (
                    <Board posts={posts} />
                  ) : (
                    <Redirect to="/before-login" />
                  )}
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
