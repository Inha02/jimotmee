import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
`;

const InfoMessage = styled.div`
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.theme.mainColor.color};
`;

const BeforeLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // JWT 만료 시간 확인 및 사용자 정보 로드
    const tokenExpiry = sessionStorage.getItem('tokenExpiry');
    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenExpiry && currentTime < parseInt(tokenExpiry, 10)) {
      setIsLoggedIn(true);
      const user = JSON.parse(sessionStorage.getItem('userInfo'));
      setUserInfo(user);
    } else {
      // 만료된 토큰 제거
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('userInfo');
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Layout>
      {!isLoggedIn && <DisabledOverlay />} {/* 모든 버튼 비활성화 */}

      <Sidebar>
        <Card>
          <CenteredContainer>
            <InfoMessage>
              {isLoggedIn
                ? `안녕하세요, ${userInfo?.nickname || userInfo?.name}님!`
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
            {!isLoggedIn && <KakaoLoginButton />}
          </CenteredContainer>
        </Card>
      </Content>
    </Layout>
  );
};

export default BeforeLogin;
