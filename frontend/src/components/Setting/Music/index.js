import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Audio } from '../../../utils/utils';
import { setCurSong } from '../../../module/playlist';
import Modal from '../../Modal/Modal';

const Wrapper = styled.div`
  background: #eee;
`;

const TitleWrapper = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 3px;
  background: darkgrey;
`;

const Title = styled.div`
  margin-left: 5px;
`;

const Setting = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const Player = styled.audio`
  height: 10px;
  outline: none;
  &::-webkit-media-controls-panel {
    background: #eee;
  }
  &::-webkit-media-controls-current-time-display,
  &::-webkit-media-controls-time-remaining-display {
    display: none;
  }
`;

const Button = styled.button`
  margin-right: 15px;
  font-size: 0.7rem;
  cursor: pointer;
`;

const PlayList = styled.ul`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  margin-top: 5px;
  padding: 10px;
  border-radius: 3px;
  background: #333;
  color: #eee;
`;

const Li = styled.li`
  padding: 5px 0;
  &:first-of-type {
    padding-top: 0;
  }
  &:last-of-type {
    padding-bottom: 0;
  }
  &:not(:last-of-type) {
    border-bottom: 1px solid #a5a5a5;
  }
  cursor: pointer;
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
  &:hover {
    font-weight: bold;
  }
  p:last-of-type {
    margin-top: 3px;
    color: #ccc;
    font-size: 0.6rem;
  }
`;

const PlayButton = styled.h4`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100% !important;
  width: 100% !important;
  border-radius: 10px;
  font-size: 2rem !important;
  cursor: pointer;
  &:hover {
    background: #79aaba;
  }
`;

const LoginMessage = styled.p`
  text-align: center;
`;

const MusicPlayer = () => {
  const dispatch = useDispatch();
  const { list: miniPlaylist } = useSelector(state => state.playlist);
  const { curSong } = useSelector(state => state.playlist);

  const playerRef = useRef();
  const playlistRef = useRef();
  const audioRef = useRef(); // 리렌더링 방지

  const [isOpenModal, setIsOpenModal] = useState(false); // 모달
  const [isOpenList, setIsOpenList] = useState(false); // 재생목록
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  useEffect(() => {
    // JWT 토큰 만료 시간 확인
    const tokenExpiry = sessionStorage.getItem('tokenExpiry');
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

    if (tokenExpiry && currentTime < parseInt(tokenExpiry, 10)) {
      setIsLoggedIn(true); // 유효한 JWT
    } else {
      // 만료된 토큰 제거
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('tokenExpiry');
      setIsLoggedIn(false);
    }
  }, []);

  const handleList = () => setIsOpenList(!isOpenList);

  const handleUserInteraction = () => {
    const audio = audioRef.current;
    if (audio.player.pause) {
      audio.player.play();
    }
    setIsOpenModal(!isOpenModal);
  };

  const initCurSong = useCallback(
    (audio, idx) => {
      audio.setCurrentSong(idx, 0);
      dispatch(
        setCurSong({
          idx: audio.idx,
          title: audio.title,
          curTime: 0,
        }),
      );
    },
    [dispatch],
  );

  const moveToNextSong = (audio, idx) => {
    initCurSong(audio, idx);
    if (audio.player.pause) {
      audio.player.play();
    }
  };

  // useEffect(() => {
  //   if (!isLoggedIn) return; // 로그인 상태가 아니면 초기화하지 않음

  //   audioRef.current = new Audio(
  //     playerRef.current,
  //     playlistRef.current.childNodes,
  //   );
  //   const audio = audioRef.current;
  //   audio.setCurrentSong(curSong.idx, curSong.curTime);

  //   const playPromise = audio.player.play();
  //   if (playPromise !== undefined) {
  //     playPromise.catch(e => {
  //       if (e.name === 'NotAllowedError') {
  //         if (!isOpenModal) {
  //           setIsOpenModal(!isOpenModal);
  //         }
  //       }
  //     });
  //   }

  //   audio.player.addEventListener('ended', () => {
  //     let idx = audio.idx;
  //     idx++;
  //     if (idx === audio.playlists.length) {
  //       idx = 0;
  //     }
  //     moveToNextSong(audio, idx);
  //   });

  //   audio.playlists.forEach((item, idx) => {
  //     item.addEventListener('click', () => {
  //       moveToNextSong(audio, idx);
  //     });
  //   });

  //   return () => {
  //     dispatch(
  //       setCurSong({
  //         idx: audio.idx,
  //         title: audio.title,
  //         curTime: audio.player.currentTime,
  //       }),
  //     );
  //   };
  // }, [isLoggedIn, curSong.idx, curSong.curTime, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) return;
  
    // Audio 객체 초기화
    audioRef.current = new Audio(playerRef.current, playlistRef.current.childNodes);
    const audio = audioRef.current;
  
    // 현재 곡 설정
    audio.setCurrentSong(curSong.idx, curSong.curTime);
  
    // 곡 재생
    const playPromise = audio.player.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        if (e.name === 'NotAllowedError' && !isOpenModal) {
          setIsOpenModal(true); // 모달 열기
        }
      });
    }
  
    // 곡이 종료될 때 다음 곡으로 전환
    const handleSongEnd = () => {
      let nextIdx = audio.idx + 1;
      if (nextIdx >= audio.playlists.length) nextIdx = 0;
  
      // 상태와 오디오 동기화
      dispatch(
        setCurSong({
          idx: nextIdx,
          title: audio.playlists[nextIdx].dataset.title,
          curTime: 0,
        }),
      );
    };
  
    // 이벤트 리스너 등록
    audio.player.addEventListener('ended', handleSongEnd);
  
    // 재생목록 클릭 이벤트
    const handlePlaylistClick = idx => {
      // 클릭한 곡의 상태와 오디오 동기화
      audio.setCurrentSong(idx, 0); // 오디오 상태 업데이트
      audio.player.play(); // 재생 시작
  
      // Redux 상태 업데이트
      dispatch(
        setCurSong({
          idx,
          title: audio.playlists[idx].dataset.title,
          curTime: 0,
        }),
      );
    };
  
    // 재생목록에 클릭 이벤트 추가
    audio.playlists.forEach((item, idx) => {
      item.removeEventListener('click', () => handlePlaylistClick(idx)); // 기존 리스너 제거
      item.addEventListener('click', () => handlePlaylistClick(idx)); // 새 리스너 추가
    });
  
    // Cleanup
    return () => {
      audio.player.removeEventListener('ended', handleSongEnd);
      audio.playlists.forEach((item, idx) => {
        item.removeEventListener('click', () => handlePlaylistClick(idx));
      });
    };
  }, [isLoggedIn, curSong.idx, curSong.curTime, dispatch]); // 의존성 배열 최적화

  if (!isLoggedIn) {
    return (
      <Wrapper>
        <LoginMessage>로그인이 필요합니다.</LoginMessage>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Modal isOpen={isOpenModal} width={100} height={100} bg="lightblue">
        <PlayButton onClick={handleUserInteraction}>🎶</PlayButton>
      </Modal>
      <TitleWrapper>
        🎶 <Title>{curSong.title}</Title>
      </TitleWrapper>
      <Setting>
        <Player
          type="audio/mp3"
          controls
          controlsList="nodownload"
          ref={playerRef}
        >
          Your browser does not support the audio element.
        </Player>
        <Button onClick={handleList}>List</Button>
      </Setting>
      <PlayList ref={playlistRef} isOpen={isOpenList}>
        {miniPlaylist.map((item, index) => (
          <Li key={index} data-title={item} isActive={index === curSong.idx}>
            <p>{item.split(' - ')[1]}</p>
            <p>{item.split(' - ')[0]}</p>
          </Li>
        ))}
      </PlayList>
    </Wrapper>
  );
};

export default React.memo(MusicPlayer);
