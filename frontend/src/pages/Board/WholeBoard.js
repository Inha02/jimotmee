import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import BoardItem from './BoardItem';

const Wrapper = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
    h2 {
    margin-bottom: 10px; /* 기존 마진 조정 */
    position: relative;
    top: -10px; /* 10px 위로 이동 */
    font-weight: bold;
    font-size: 1rem;
  }
`;

const ScrollContainer = styled.div`
  height: 500px; /* Card의 높이를 제한 */
  overflow-y: auto; /* 스크롤 가능 */
`;

const Message = styled.div`
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin-top: 20px;
`;

const WholeBoard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const LIMIT = 10;

  const SCROLL_THRESHOLD = 50; // 스크롤 감지 임계값 (px)
  const containerRef = useRef(null); // ScrollContainer의 참조

  const fetchPosts = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);

    console.log(`Fetching posts for page: ${page}`);

    try {
      const offset = (page - 1) * LIMIT;
      const response = await fetch(`/posts?offset=${offset}&limit=${LIMIT}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.length < LIMIT) {
        setHasMore(false);
      }

      setPosts((prevPosts) => [...prevPosts, ...data]);
      console.log(`Fetched ${data.length} posts.`);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [LIMIT]);

  // 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // Card 내에서 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD;

      if (isNearBottom && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoading, SCROLL_THRESHOLD]);

  return (
    <Wrapper>
      <h2>전체 게시판</h2>
      <ScrollContainer ref={containerRef}>
        {error && <Message>에러 발생: {error}</Message>}
        {posts.map((post, index) => (
          <BoardItem key={post._id || index} post={post} />
        ))}
        {isLoading && <Message>로딩 중...</Message>}
        {!hasMore && !isLoading && <Message>더 이상 게시물이 없습니다.</Message>}
      </ScrollContainer>
    </Wrapper>
  );
};

export default WholeBoard;
