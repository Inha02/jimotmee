import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SidebarBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  height: 100%;
  margin-right: 8px;
  & > ul {
    display: flex;
    justify-content: center;
    font-size: 0.8rem;
    line-height: 1.4;
  }
  .today {
    color: #e03131;
  }
`;

const Sidebar = ({ children }) => {
  const [highScore, setHighScore] = useState(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    return userInfo?.score || 0;
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      setHighScore(userInfo?.score || 0);
    };

    window.addEventListener('updateSession', handleStorageUpdate);

    return () => {
      window.removeEventListener('updateSession', handleStorageUpdate);
    };
  }, []);

  return (
    <SidebarBlock>
      <ul>
        <li>High-Score: {highScore}</li>
      </ul>
      {children}
    </SidebarBlock>
  );
};

export default Sidebar;
