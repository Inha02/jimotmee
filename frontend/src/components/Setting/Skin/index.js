import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import PaletteTab from './PaletteTab';
import Palette from './Palette';

const Wrapper = styled.div`
  margin-top: 10px;
  background: #eee;
  padding: 10px;
`;

const ToggleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  h2 {
    font-weight: bold;
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  cursor: pointer;
`;

const ToggleContent = styled.div`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  padding-top: 10px;
`;

const Message = styled.p`
  text-align: center;
`;

const ChangeSkin = () => {
  const [isOpen, setIsOpen] = useState(false); // 배경 변경 패널 토글 상태
  const [target, setTarget] = useState('bg'); // 변경 대상
  const [hexColor, setHexColor] = useState('#ffc9c9'); // 현재 색상
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  useEffect(() => {
    // JWT 만료 시간 확인
    const tokenExpiry = sessionStorage.getItem('tokenExpiry');
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

    if (tokenExpiry && currentTime < parseInt(tokenExpiry, 10)) {
      setIsLoggedIn(true); // 유효한 JWT
    } else {
      // 만료된 토큰 제거
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('tokenExpiry');
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // JWT가 유효하다면 DB에서 사용자 데이터를 로드
    if (isLoggedIn) {
      setIsLoading(true);
      const token = sessionStorage.getItem('token');
      fetch('/api/user/colors', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setHexColor(data.colors[target] || '#ffc9c9'); // 기본 색상 설정
          } else {
            console.error('배경 색상 데이터를 불러오지 못했습니다.');
          }
        })
        .catch(err => console.error('배경 색상 로드 오류:', err))
        .finally(() => setIsLoading(false));
    }
  }, [target, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Wrapper>
        <Message>배경 색상을 변경하려면 로그인하세요.</Message>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ToggleHeader>
        <h2>배경 바꾸기</h2>
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </ToggleButton>
      </ToggleHeader>
      {isLoading ? (
        <Message>배경 색상 데이터를 불러오는 중입니다...</Message>
      ) : (
        <ToggleContent isOpen={isOpen}>
          <PaletteTab
            target={target}
            setTarget={setTarget}
            setHexColor={setHexColor}
          />
          <Palette
            target={target}
            hexColor={hexColor}
            setHexColor={setHexColor}
          />
        </ToggleContent>
      )}
    </Wrapper>
  );
};

export default React.memo(ChangeSkin);
