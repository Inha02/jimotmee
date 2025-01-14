import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BoardItem from './BoardItem';

const Wrapper = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Message = styled.div`
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-top: 20px;
`;

const MyBoard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 10;

  // 게시물 데이터를 가져오는 함수
  const fetchPosts = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/my-posts?page=${page}&limit=${LIMIT}`);
      const data = await response.json();

      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setPosts((prevPosts) => [...prevPosts, ...data]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // 무한 스크롤 구현
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !isLoading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  return (
    <Wrapper>
      <h2>내 게시물</h2>
      {posts.map((post, index) => (
        <BoardItem key={index} post={post} />
      ))}
      {isLoading && <Message>로딩 중...</Message>}
      {!hasMore && <Message>더 이상 게시물이 없습니다.</Message>}
    </Wrapper>
  );
};

export default MyBoard;
