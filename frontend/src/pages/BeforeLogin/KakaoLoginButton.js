import React from 'react';
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

const KakaoLoginButton = () => {
  const handleLogin = () => {
    // 백엔드의 카카오 로그인 엔드포인트로 리다이렉트
    window.location.href = '/auth/kakao';
  };

  return <Button onClick={handleLogin}>카카오 로그인</Button>;
};

export default KakaoLoginButton;
