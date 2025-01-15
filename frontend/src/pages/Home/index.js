import React from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';
import Content from '../../components/Layout/Content';
import Card from '../../components/Layout/Card';
import Profile from './profile';
import MyPet from './mypet';
import { publicUrl } from '../../utils/utils';

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
    color: ${(props) => props.theme.mainColor.color};
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

const Home = () => {
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

  const randomOl = olOptions[Math.floor(Math.random() * olOptions.length)];

  return (
    <Layout>
      <Sidebar>
        <Card>
          <FlexWrapper>
            <Profile />
            <MyPet />
          </FlexWrapper>
        </Card>
      </Sidebar>
      <Content>
        <Card>
          <ContentSection>
            <h2>마이룸</h2>
            <div>
              <img src={publicUrl + '/resources/img/miniroom.gif'} alt="miniroom" />
            </div>
          </ContentSection>
          <ContentSection>
            <h2>얘들아... ㄱ나니??</h2>
            <ol>
              {randomOl.map((item, index) => (
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
