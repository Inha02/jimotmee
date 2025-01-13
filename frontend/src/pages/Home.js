import React from 'react';
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
  ul {
    line-height: 1.8;
    li {
      height: 30px;
      border-bottom: 1px dashed #a5a5a5;
    }
  }
`;

// const ProfileSection = styled.section`
//   height: fit-content !important;
//   &:last-of-type {
//     padding: 10px 0;
//     border-top: 1px dashed #a5a5a5;
//     p {
//       display: flex;
//       align-items: center;
//       margin: 10px 0;
//     }
//     svg {
//       margin-right: 3px;
//       color: #666;
//     }
//   }
//   img {
//     width: 100%;
//     height: auto;
//     object-fit: cover;
//   }
//   .my-name {
//     margin-right: 5px;
//     color: ${props => props.theme.mainColor.color};
//     font-size: 1rem;
//     font-weight: bold;
//   }
//   .my-sex,
//   .my-brthdy {
//     color: #9e9e9e;
//     font-size: 0.85rem;
//   }
//   .my-sex {
//     margin-right: 2px;
//     font-size: 0.8rem;
//   }
// `;

const ProfileSection = styled.section`
  text-align: center;
  img {
    width: 180px;
    height: 180px;
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




// const LinkTitle = styled.p`
//   display: flex;
//   align-items: center;
//   margin: 10px 0;
//   &:first-of-type {
//     margin-top: 20px;
//   }
//   &:last-of-type {
//     margin-bottom: 20px;
//   }
//   cursor: pointer;
//   svg {
//     margin-right: 5px;
//     color: #666;
//     font-size: 1.2rem;
//   }
//   &:hover {
//     color: ${props => props.theme.mainColor.color};
//   }
// `;

const LinkTitle = styled.div`
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
  const goGithub = () => {
    window.location.href = 'https://github.com/danbiilee/react-miniportfoly';
  };
  const goVelog = () => {
    window.location.href = 'https://velog.io/@dblee';
  };
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

  return (
    <Layout>
      <Sidebar>
        <Card>
          <FlexWrapper>
            {/* <ProfileSection>
            <img src={profileImage} alt="profile" />
              <LinkTitle onClick={goGithub}>
                <MdLink />
                Github
              </LinkTitle>
              <LinkTitle onClick={goVelog}>
                <MdLink />
                dblee.log
              </LinkTitle>
            </ProfileSection>
            <ProfileSection>
              <p>
                <span className="my-name">{myname}</span>
                <span className="my-sex">(♀)</span>
                <span className="my-brthdy">1992.08.19</span>
              </p>
              <p>
                <MdMailOutline />
                danbi.db@gmail.com
              </p>
              <p>
                <MdPhoneIphone />
                010-4013-4147
              </p>
              <p>
                <MdLocationOn />
                경기도 안양시
              </p>
            </ProfileSection> */}
            <ProfileSection>
              <img src={profileImage} alt="profile" />
              <div className="profile-row">
                <span className="my-name">{myname}</span> {/* 이름 */}
                <button className="logout-button" onClick={logout}>
                  로그아웃
                </button> {/* 로그아웃 버튼 */}
              </div>
            </ProfileSection>

            <LinkTitle>
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
            </LinkTitle>
          </FlexWrapper>
        </Card>
      </Sidebar>
      <Content>
        <Card>
          <ContentSection>
            <h2>미니룸</h2>
            <div>
              <img
                src={publicUrl + '/resources/img/miniroom.gif'}
                alt="miniroom"
              />
            </div>
          </ContentSection>
          <ContentSection>
            <h2>한 줄 감성</h2>
            <ul>
              <li>싸이월드 미니홈피 감성으로 기획, 개발했습니다~☆</li>
              <li>프로필 페이지를 구경해주세요~☆</li>
              <li>배경도 바꿀 수 있답니다~☆</li>
              <li></li>
              <li></li>
            </ul>
          </ContentSection>
        </Card>
      </Content>
    </Layout>
  );
};
export default Home;
