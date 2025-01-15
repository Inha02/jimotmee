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
`;

const PostWrapper = styled.div`
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center; /* 이미지와 텍스트를 수직 중앙 정렬 */
  margin-bottom: 10px;

  .profile-img {
    width: 40px; /* 프로필 이미지 크기 */
    height: 40px;
    border-radius: 50%; /* 원형 이미지 */
    margin-right: 10px;
    object-fit: cover; /* 이미지 비율 유지 */
  }

  .info-text {
    display: flex;
    flex-direction: column;

    .post-author {
      color: #ce6a0; /* 텍스트 색상 */
      font-size: 0.95rem;
      font-weight: bold;
    }

    .post-time {
      color: #999;
      font-size: 0.8rem;
    }
  }
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
    margin-right: 10px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: bold;
    color: #555;

    &:hover {
      color: #fff;
      background: ${props => props.theme.mainColor.color};
    }
  }
`;

const BoardItem = ({ post, onDelete }) => {
  if (!post) return null;

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const isOwner = userInfo && userInfo.userId === post.user._id; // 작성자 확인

  const handleDelete = async () => {
    // 삭제 확인 팝업
    const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
    if (!confirmDelete) return; // 사용자가 취소를 누르면 종료

    try {
      const response = await fetch(`/posts/delete/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      onDelete(post._id); // 삭제된 게시물 ID를 상위 컴포넌트에 전달
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleShare = () => {
    if (!window.Kakao) {
      console.error('Kakao SDK not loaded');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_JAVASCRIPT_KEY);
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '친구야.. ㄱ나니??',
        description: post.content,
        imageUrl: `https://item.kakaocdn.net/do/03c52e10ebbd233c0e7e44361e34e8479f17e489affba0627eb1eb39695f93dd`,
        link: {
          mobileWebUrl: `http://localhost:3000/posts/${post._id}`,
          webUrl: `http://localhost:3000/posts/${post._id}`,
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: `http://localhost:3000/posts/${post._id}`,
            webUrl: `http://localhost:3000/posts/${post._id}`,
          },
        },
      ],
    });
  };

  return (
    <Wrapper>
      <PostWrapper>
        <InfoWrapper>
          <img
            src={post.user.profileImage}
            alt="작성자 프로필 이미지"
            className="profile-img"
          />
          <div className="info-text">
            <span className="post-author">{post.user.name}</span>
            <span className="post-time">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </InfoWrapper>
        <img src={`/uploads/${post.image}`} alt="게시물 이미지" />
        <TxtWrapper>
          <p className="txt">{post.content}</p>
        </TxtWrapper>
        <ButtonWrapper>
          {isOwner && <button onClick={handleDelete}>삭제</button>}
          <button onClick={handleShare}>공유</button>
        </ButtonWrapper>
      </PostWrapper>
    </Wrapper>
  );
};

export default BoardItem;
