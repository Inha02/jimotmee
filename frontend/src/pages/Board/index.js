import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Layout/Card';
import SubMenu from '../../components/Menu/SubMenu';
import Sidebar from '../../components/Layout/Sidebar';
import Content from '../../components/Layout/Content';
import WholeBoard from './WholeBoard';
import MyBoard from './MyBoard';
import Uploader from './Uploader';

const Boards = () => {
  const match = useRouteMatch();
  const list = [
    {
      id: 1,
      title: '👭전체 게시판',
      url: '',
    },
    {
      id: 2,
      title: '⭐내 게시물',
      url: '/my-board',
    },
    {
      id: 3,
      title: '👩‍💻게시물 쓰기',
      url: '/upload',
    },
  ];

  return (
    <Layout>
      <Sidebar>
        <Card>
          <SubMenu title="Board" list={list} />
        </Card>
      </Sidebar>
      <Content>
        <Card>
          <Switch>
            <Route exact path={`${match.path}`} component={WholeBoard} />
            <Route path={`${match.path}/my-board`} component={MyBoard} />
            <Route path={`${match.path}/upload`} component={Uploader} />
          </Switch>
        </Card>
      </Content>
    </Layout>
  );
};

export default Boards;
