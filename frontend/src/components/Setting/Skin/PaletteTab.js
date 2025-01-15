import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { getRandomHexColor } from '../../../utils/utils';

const Wrapper = styled.ul``;

const Tab = styled.li`
  width: 25px;
  height: 20px;
  border: 1px solid #a5a5a5;
  ${props =>
    props.isActive &&
    css`
      border-right-color: ${props => props.color};
    `}
  border-radius: 5px 0 0 5px;
  background: ${props => props.color};
  cursor: pointer;
`;

const PaletteTab = ({ target, setTarget, setHexColor }) => {
  const { palette } = useSelector(state => state);

  // 탭 리스트 생성
  const tabList = Object.keys(palette).map((key, index) => ({
    id: index + 1,
    target: key,
    color: palette[key]?.color || '#fff', // 기본 색상 안전 처리
  }));

  // 탭 클릭 핸들러
  const onClick = target => {
    setTarget(target);
    setHexColor(palette[target]?.color || getRandomHexColor()); // 기존 색상 또는 랜덤 색상 적용
  };

  return (
    <Wrapper>
      {tabList.map(tab => (
        <Tab
          key={tab.id}
          color={tab.color}
          isActive={tab.target === target}
          onClick={() => onClick(tab.target)}
        />
      ))}
    </Wrapper>
  );
};

export default React.memo(PaletteTab);
