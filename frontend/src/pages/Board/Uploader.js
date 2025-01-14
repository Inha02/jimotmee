import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const Wrapper = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  height: 80px;
  max-length: 128;
`;

const FileInput = styled.input`
  border: none;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${props => props.theme.mainColor.color};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${props => props.theme.textColor.color};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
`;

const Uploader = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content || content.length > 128) {
      setError('글 내용은 1자 이상, 128자 이하여야 합니다.');
      return;
    }

    if (!image) {
      setError('이미지를 선택해 주세요.');
      return;
    }

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.userId) {
      setError('로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', image);
    formData.append('userId', userInfo.userId);

    try {
      const response = await fetch('/posts/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const data = await response.json();
      console.log('업로드 성공:', data);
      history.push('/board'); // 업로드 성공 후 게시판 페이지로 이동
    } catch (err) {
      console.error('Error uploading post:', err);
      setError('게시물 업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <Wrapper>
      <Title>게시물 쓰기</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Textarea
          placeholder="글 내용을 입력하세요 (최대 128자)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={128}
        />
        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
        <Button type="submit">올리기</Button>
      </Form>
    </Wrapper>
  );
};

export default Uploader;
