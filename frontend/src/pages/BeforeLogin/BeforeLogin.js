import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';
import Content from '../../components/Layout/Content';
import Card from '../../components/Layout/Card';
import KakaoLoginButton from './KakaoLoginButton';

const DisabledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
  display: flex; /* Flexbox 활성화 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
`;

const CenteredContainer = styled.div`
  display: flex; /* Flexbox 활성화 */
  flex-direction: column; /* 세로 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  text-align: center; /* 텍스트 중앙 정렬 */
  height: 100%; /* 부모 높이에 맞춰 중앙 배치 */
`;

const InfoMessage = styled.div`
  margin-bottom: 20px; /* 버튼과 메시지 사이 간격 */
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.mainColor.color};
`;

const BeforeLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    const sessionData = sessionStorage.getItem('isLoggedIn');
    if (sessionData === 'true') {
      const userData = JSON.parse(sessionStorage.getItem('userInfo'));
      setUserInfo(userData); // 세션에 저장된 사용자 정보 로드
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      // 백엔드 로그인 API 호출
      const response = await axios.post('/api/login/kakao'); // API 경로는 백엔드와 협의 필요
      const { data } = response;

      if (data.success) {
        setUserInfo(data.user); // 백엔드에서 반환된 사용자 정보 저장
        setIsLoggedIn(true);

        // 로그인 상태를 sessionStorage에 저장
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userInfo', JSON.stringify(data.user));
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      {!isLoggedIn && <DisabledOverlay />} {/* 모든 버튼 비활성화 */}

      <Sidebar>
        <Card>
          <CenteredContainer>
            <InfoMessage>
              {isLoggedIn
                ? `안녕하세요, ${userInfo?.nickname}님!`
                : ''}
            </InfoMessage>
          </CenteredContainer>
        </Card>
      </Sidebar>

      <Content>
        <Card>
          <CenteredContainer>
            <InfoMessage>
              {!isLoggedIn
                ? '로그인 후 다양한 기능을 사용할 수 있습니다.'
                : '로그인이 완료되었습니다. 사이트를 즐겨보세요!'}
            </InfoMessage>
            {!isLoggedIn && <KakaoLoginButton onClick={handleLogin} />}
          </CenteredContainer>
        </Card>
      </Content>
    </Layout>
  );
};

export default BeforeLogin;
