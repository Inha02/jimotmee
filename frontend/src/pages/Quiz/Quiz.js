import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 20px;
  padding-top: 60px;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: ${props => props.theme.cardBg.color}; /* 흰색 배경 */
  color: #000000; /* 검은색 글씨 */
  height: auto; /* 높이 자동 조정 */
  max-height: 600px; /* 최대 높이 제한 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const QuizImage = styled.img`
  width: auto;
  height: 100%;
  max-height: 200px; /* 최대 높이 제한 */
  margin-bottom: 20px;
`;

const QuizTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  line-height: 1.5;
  list-style: none; /* 리스트 스타일 제거 */
  padding: 0;

  li {
    margin-bottom: 10px; /* 각 줄 간격 설정 */
  }
`;

const QuizDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 30px;
  color: #666666;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.mainColor.color};
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.textColor.color};
  }
`;

const Input = styled.input`
  padding: 10px;
  width: 80%;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const ResultMessage = styled.p`
  font-size: 1.2rem;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const ScoreText = styled.span`
  font-size: 5rem; /* 점수를 큰 글씨로 */
  font-weight: bold;
  color: ${props => props.theme.textColor.color};
`;

const Quiz = () => {
  const [step, setStep] = useState('start'); // start, quiz, result, end
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const updateSessionStorage = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
    const event = new Event('updateSession');
    window.dispatchEvent(event);
  };
  

  const handleSaveScore = async () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const token = sessionStorage.getItem('token');

    if (!userInfo || !userInfo.userId) {
      alert('사용자 정보를 확인할 수 없습니다.');
      return;
    }

    const previousScore = userInfo.score || 0; // 세션에 저장된 이전 점수 (없으면 0으로 처리)

    if (score <= previousScore) {
      console.log('현재 점수가 세션 점수보다 낮거나 같아 업데이트하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`/users/update-score/${userInfo.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        throw new Error('점수 업데이트에 실패했습니다.');
      }

      const updatedUser = await response.json();
      console.log('Score updated successfully:', updatedUser);

      // 세션 스토리지 업데이트
      updateSessionStorage('userInfo', {
        ...userInfo,
        score: updatedUser.user.score,
      });

    } catch (error) {
      console.error('Error updating score:', error);
      alert('점수 업데이트 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (step === 'quiz') {
      // 퀴즈 문제를 백엔드에서 가져옴
      const fetchQuestions = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/quizzes');
          if (!response.ok) {
            throw new Error('Failed to fetch quizzes');
          }
          const data = await response.json();
          setQuestions(data);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };

      fetchQuestions();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'end') {
      handleSaveScore(); // 퀴즈가 끝난 후 점수 저장
    }
  }, [step]); // step이 'end'로 변경될 때 실행

  const handleStart = () => {
    setStep('quiz');
  };

  const handleSubmitAnswer = () => {
    const current = questions[currentQuestion];
    if (userAnswer.trim() === current.correctAnswer) {
      setScore(score + parseInt(current.score, 10)); // 점수 합산
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setShowResult(false);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('end');
    }
  };

  const handleRestart = () => {
    setStep('start');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setShowResult(false);
  };

  const handleShare = (score) => {
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
        title: '요즘..젊은..것들은...에잉잉..',
        description: `나는.${score}점이다.이눔아! 요즘애들은.몇점이나.나오냐?`,
        imageUrl: `https://health.chosun.com/site/data/img_dir/2009/12/10/2009121001056_0.jpg`,
        link: {
          mobileWebUrl: `http://localhost:3000`,
          webUrl: `http://localhost:3000`,
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: `http://localhost:3000`,
            webUrl: `http://localhost:3000`,
          },
        },
      ],
    });
  };

  const ShareButton = styled(Button)`
    background-color: #ff6f61;

    &:hover {
        background-color: #e55e50;
    }
  `;

  const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px; /* 버튼 간 간격 */
    margin-top: 30px; /* 버튼 그룹과 상단 내용 간 간격 */
  `;

  if (step === 'start') {
    return (
      <Wrapper>
        <QuizImage src="http://localhost:5000/uploads/yummy.gif" alt="퀴즈 이미지" />
        <QuizTitle>당신의 숙성도는?</QuizTitle>
        <QuizDescription>
          <ol>
            <li>★ ㄷб신으l 00~10년ㄷН 추억 레벨을 체크ぁĦ보パㅔ욧! ★</li>
            <li>문제 점수는 출제ㅈΓ으l ~~ブl분~~ 따ㄹΓ 달ㄹΓ집LI⊂トㅎㅎ</li>
            <li>정답 쓸 땐 띄øł쓰ブl ㈛ズlㅁトパㅔ욤! ^-^</li>
          </ol>
        </QuizDescription>
        <Button onClick={handleStart}>퀴즈 시작</Button>
      </Wrapper>
    );
  }

  if (step === 'quiz') {
    if (questions.length === 0) {
      return <Wrapper>로딩 중...</Wrapper>;
    }

    const question = questions[currentQuestion];

    return (
      <Wrapper>
        <QuizImage src={`http://localhost:5000/uploads/${question.imageUrl}`} alt="퀴즈 이미지" />
        <QuizTitle>{question.question}</QuizTitle>
        {!showResult && (
          <>
            <Input
              type="text"
              placeholder="정답을 입력하세요"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <Button onClick={handleSubmitAnswer}>제출</Button>
          </>
        )}
        {showResult && (
          <>
            <ResultMessage>
              {userAnswer.trim() === question.correctAnswer
                ? '정답입니다!'
                : `틀렸습니다. 정답은 "${question.correctAnswer}"입니다.`}
            </ResultMessage>
            <Button onClick={handleNextQuestion}>다음 문제</Button>
          </>
        )}
      </Wrapper>
    );
  }

  if (step === 'end') {
    return (
      <Wrapper>
        <QuizTitle>
            <ol>
                <li>당신의 점수는</li>
                <li>
                    <ScoreText>{score}점!</ScoreText>
                </li>
                <li>★☆ 완전 대박! ^0^ ☆★</li>
            </ol>
        </QuizTitle>
        <ButtonGroup>
          <Button onClick={handleRestart}>다시하기</Button>
          <ShareButton
            onClick={() => {
              handleShare(score)
            }}
          >
            공유하기
          </ShareButton>
        </ButtonGroup>
      </Wrapper>
    );
  }

  return null;
};

export default Quiz;
