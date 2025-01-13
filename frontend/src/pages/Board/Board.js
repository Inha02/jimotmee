import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 10px 0;
  font-family: serif;
  font-weight: bold;
  img {
    width: 100%;
    margin: 5px 0;
    border-radius: 8px;
  }
  h2 {
    color: #a7a7a7;
    font-size: 1.2rem;
  }
  .post-info {
    color: #cec6a0;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
  .post-time {
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 10px;
  }
`;

const PostWrapper = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
`;

const TxtWrapper = styled.div`
  padding: 10px 0;
  text-align: left;
  .txt {
    margin-bottom: 15px;
    color: #333;
    font-weight: normal;
    font-size: 0.95rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  button {
    background: #eee;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: bold;
    color: #555;

    &:hover {
      background: #ddd;
    }
  }
`;

const Board = ({ posts }) => {
  return (
    <Wrapper>
      <h2>게시판</h2>
      {posts.map((post, index) => (
        <PostWrapper key={index}>
          <p className="post-info">작성자: {post.author}</p>
          <p className="post-time">{post.time}</p>
          <img src={post.image} alt="게시물 이미지" />
          <TxtWrapper>
            <p className="txt">{post.content}</p>
          </TxtWrapper>
          <ButtonWrapper>
            <button>좋아요</button>
            <button>공유</button>
          </ButtonWrapper>
        </PostWrapper>
      ))}
    </Wrapper>
  );
};

export default Board;
