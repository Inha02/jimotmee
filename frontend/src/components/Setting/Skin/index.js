import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import PaletteTab from './PaletteTab';
import Palette from './Palette';
import { fetchPalette, loadPalette, updatePalette } from '../../../module/palette';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();
  const palette = useSelector(state => state.palette);
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
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      const userId = userInfo?.userId;
      fetchPalette(userId)
        .then(response => {
          if (Array.isArray(response)) {
            const data = response.reduce((acc, item) => {
              acc[item.key] = { title: item.title, color: item.color };
              return acc;
            }, {});
            dispatch(loadPalette(data)); // Redux 상태에 로드
            setHexColor(data[target]?.color || '#ffc9c9'); // 초기 색상 설정
          } else {
            console.warn('유효하지 않은 팔레트 데이터:', response);
          }
        })
        .catch(err => console.error('팔레트 로드 오류:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isLoggedIn, dispatch, target]);

  const handleColorChange = (key, color) => {
    setHexColor(color);
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const userId = userInfo?.userId;
    if (userId) {
      updatePalette(userId, key, palette[key]?.title || 'Unknown', color)
        .then(() => console.log('색상 업데이트 성공'))
        .catch(err => console.error('색상 업데이트 실패:', err));
    }
  };

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
            setHexColor={(color) => handleColorChange(target, color)}
          />
        </ToggleContent>
      )}
    </Wrapper>
  );
};

export default React.memo(ChangeSkin);
