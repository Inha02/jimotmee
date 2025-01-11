import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Button = styled.button`
  background: #fee500;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #3c1e1e;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ffd900;
  }
`;

const KakaoLoginButton = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      // 백엔드 로그인 API 호출
      const response = await axios.post('/api/login/kakao');
      const { data } = response;

      if (data.success) {
        // 로그인 성공 처리
        const userInfo = data.user;

        // sessionStorage에 로그인 상태 저장
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

        // 콜백 호출로 부모 컴포넌트에 로그인 성공 알림
        if (onLoginSuccess) {
          onLoginSuccess(userInfo);
        }
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return <Button onClick={handleLogin}>카카오 로그인</Button>;
};

export default KakaoLoginButton;
