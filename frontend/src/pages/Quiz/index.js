import React from 'react';
import styled from 'styled-components';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Layout/Card';
import SubMenu from '../../components/Menu/SubMenu';
import Sidebar from '../../components/Layout/Sidebar';
import Content from '../../components/Layout/Content';
import Quiz from './Quiz';
import Profile from './profile';
import MyPet from './mypet';
import { publicUrl } from '../../utils/utils';

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Quizs = () => {
  const match = useRouteMatch();

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
            <Profile />
            <MyPet />
          </FlexWrapper>
        </Card>
      </Sidebar>
      <Content>
        <Card>
          <Switch>
            <Route exact path={`${match.path}`} component={Quiz} />
          </Switch>
        </Card>
      </Content>
    </Layout>
  );
};

export default Quizs;
