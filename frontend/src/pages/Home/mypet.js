import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { publicUrl } from '../../utils/utils';

const MyPetSection = styled.div`
  margin: 20px 0;
  border-top: 1px dashed #ddd;
  padding-top: 10px;
  text-align: center;
  position: relative;

  .pet-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props) => props.theme.mainColor.color};
  }
  img {
    width: 100%;
    max-width: 120px;
    margin: 10px auto;
    display: block;
  }
  .pet-status {
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
  }
  .pet-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
    button {
      border: 1px solid #ddd;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #f5f5f5;
      cursor: pointer;
      &:hover {
        background-color: ${(props) => props.theme.mainColor.color};
        color: white;
      }
    }
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(66, 66, 66, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  z-index: 10;
`;

const MyPet = () => {
  const [dogState, setDogState] = useState('로딩 중...');
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchDogState = async () => {
      try {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const userId = userInfo?.userId;
        const response = await fetch(`/api/dog/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dog state');
        }
        const data = await response.json();
        setDogState(data.state);
      } catch (error) {
        console.error('Error fetching dog state:', error);
        setDogState('오류 발생');
      }
    };

    const fetchScore = () => {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      setScore(userInfo?.score || 0);
    };

    fetchDogState();
    fetchScore();
  }, []);

  const handleAction = async (action) => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      const userId = userInfo?.userId;
      const requiredAction = {
        '배고픔': '밥 주기',
        '더러움': '씻기',
        '산책필요': '산책하기',
      }[dogState];

      if (action !== requiredAction) {
        alert('올바른 행동을 선택해주세요!');
        return;
      }

      const response = await fetch('/api/dog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dog state');
      }

      const updatedData = await response.json();
      setDogState(updatedData.state);
    } catch (error) {
      console.error('Error updating dog state:', error);
    }
  };

  if (score === null) {
    return <p>로딩 중...</p>;
  }

  return (
    <MyPetSection>
      {score <= 80 && (
        <Overlay>
          80점 이상만 접근 가능
        </Overlay>
      )}
      <p className="pet-title">마이펫 키우기</p>
      <img src={publicUrl + '/resources/img/dog1.jpg'} alt="강아지" />
      <p className="pet-status">강아지 상태: {dogState}</p>
      <div className="pet-actions">
        <button onClick={() => handleAction('밥 주기')}>밥 주기</button>
        <button onClick={() => handleAction('씻기')}>씻기</button>
        <button onClick={() => handleAction('산책하기')}>산책하기</button>
      </div>
    </MyPetSection>
  );
};

export default MyPet;
