import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout/Layout';
import Sidebar from '../components/Layout/Sidebar';
import Content from '../components/Layout/Content';
import Card from '../components/Layout/Card';
import {
  MdLink,
  MdMailOutline,
  MdLocationOn,
  MdPhoneIphone,
} from 'react-icons/md';
import { publicUrl } from '../utils/utils';

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ContentSection = styled.section`
  height: fit-content !important;
  h2 {
    padding: 5px;
    margin-bottom: 10px;
    font-weight: bold;
    color: ${props => props.theme.mainColor.color};
  }
  &:first-of-type {
    h2 {
      margin-bottom: 5px;
    }
    div {
      width: 100%;
      min-height: 200px;
      img {
        width: 100%;
      }
    }
  }
  &:last-of-type {
    margin-top: 20px;
    h2 {
      margin-bottom: 15px;
      border-bottom: 2px solid #eee;
    }
  }
  ol {
    line-height: 1.8;
    li {
      height: 30px;
      border-bottom: 1px dashed #a5a5a5;
    }
  }
`;

const ProfileSection = styled.section`
  text-align: center;
  img {
    width: 100%;
    max-width: 180px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0 auto;
  }
  .profile-row {
    display: flex;
    align-items: center;
    justify-content: center; /* 기본적으로 이름을 가운데 정렬 */
    margin-top: 10px;
    position: relative; /* 로그아웃 버튼의 위치를 조정하기 위한 상대 위치 */
  }
  .my-name {
    font-size: 1.05rem;
    font-weight: bold;
    color: ${props => props.theme.mainColor.color};
  }
  .logout-button {
    position: absolute; /* 로그아웃 버튼을 이름 오른쪽 끝에 고정 */
    right: 0;
    font-size: 0.75rem;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 3px 6px;
    background: none;
    cursor: pointer;
    &:hover {
      background-color: ${props => props.theme.mainColor.color};
      color: white;
    }
  }
`;

const MyPet = styled.div`
  margin: 20px 0;
  border-top: 1px dashed #ddd;
  padding-top: 10px;
  text-align: center;

  .pet-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${props => props.theme.mainColor.color};
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
        background-color: ${props => props.theme.mainColor.color};
        color: white;
      }
    }
  }
`;

const Home = () => {
  // 로그아웃 함수
  const logout = () => {
    alert('로그아웃 되었습니다!');
    sessionStorage.clear();
    window.location.reload();
  };

  // sessionStorage에서 userInfo를 가져옴
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  // profileImage가 존재하면 해당 URL을 사용하고, 없으면 기본 이미지를 사용
  const profileImage = userInfo && userInfo.profileImage ? userInfo.profileImage : publicUrl + '/resources/img/memo_.jpg';
  const myname = userInfo.name;

  const olOptions = [
    [
      "ŀ ĿØvЁ уØЦ *…",
      "ㄴГㅁざㅂГㄹГ보Гㅈゴ…ε♡з"
    ],
    [
      "우ºㄹiº참º좋º恩º친º⑨º됐º으º면º조ºㅋrºㄸr ",
      "☆じ┣ 丕の┣?¿☆"
    ],
    [
      "*`_*행복ol란`*`웃어야zl*`존자l한다l♥ ",
      "★-··Lŀ는,ユ댈향ぁĦ,口l소짓죠··-★ "
    ],
    [
      "믿고의ズl할水ː있는건∥친구∥뿐Øl㈐",
      "●친구øF, ㄴıㄱŀ 보고 싶Øł●"
    ],
    [
      "`*,`*,당신oㅔ게 영원한 우정을 약속합Ll다♡",
      "우乙l우정 변ㅊl않을꺼ㅈl[?]"
    ],
    [
      "( . .)☆´˚。☆",
      "( づ♡ ☆"
    ],
    [
      "♡*♡*♡*♡*♡*♡*♡*♡*♡*♡*♡*♡ ",
      "*∵♨∵♨∵♨∵♨∵♨∵♨∵♨∵♨∵♨∵*"
    ],
    [
      "♥:..*..♡..*..:♥:..*..♡..*..:♥:..*..♡..*..:♥ ",
      "....:*:♥♡♥:*:....:*:♥♡♥:*:....:*:♥♡♥:*:.... "
    ],
    [
      "╋┏━┓╋♡╋┏━┓╋♡╋┏━┓╋ ",
      "╋┗━┛╋♡╋┗━┛╋♡╋┗━┛╋"
    ],
    [
      "*:..:*:..:*:..:*LOVE*:..:*LOVE*:..:*:..:*:..:* ",
      "♥:..*..♡..*..:♥:..*..♡..*..:♥:..*..♡..*..:♥ "
    ],
    [
      "그다l 원라l ○ı런 ",
      "사람Οl었ㄴГ요"
    ],
    [
      "§+칭＊구＊얌..＊④＊랑＊㉭ㅐ+☆",
      "☆™우정의 쪼꼬㉥㉥ㅏ㉧ㅣ..☆"
    ],
  ];

  const [selectedOl, setSelectedOl] = useState([]);

  useEffect(() => {
    // 랜덤으로 `olOptions` 중 하나를 선택
    const randomIndex = Math.floor(Math.random() * olOptions.length);
    setSelectedOl(olOptions[randomIndex]);
  }, []);

  return (
    <Layout>
      <Sidebar>
        <Card>
          <FlexWrapper>
            <ProfileSection>
              <img src={profileImage} alt="profile" />
              <div className="profile-row">
                <span className="my-name">{myname}</span>
                <button className="logout-button" onClick={logout}>
                  로그아웃
                </button>
              </div>
            </ProfileSection>

            <MyPet>
              <p className="pet-title">마이펫 키우기</p>
              <img
                src={publicUrl + '/resources/img/dog1.jpg'}
                alt="강아지"
              />
              <p className="pet-status">강아지 상태: 행복하고 건강함</p>
              <div className="pet-actions">
                <button>밥 주기</button>
                <button>씻기</button>
                <button>산책하기</button>
              </div>
            </MyPet>
          </FlexWrapper>
        </Card>
      </Sidebar>
      <Content>
        <Card>
          <ContentSection>
            <h2>마이룸</h2>
            <div>
              <img
                src={publicUrl + '/resources/img/miniroom.gif'}
                alt="miniroom"
              />
            </div>
          </ContentSection>
          <ContentSection>
            <h2>얘들아... ㄱ나니??</h2>
            <ol>
            {selectedOl.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            </ol>
          </ContentSection>
        </Card>
      </Content>
    </Layout>
  );
};
export default Home;
