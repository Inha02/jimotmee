import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Audio } from '../utils/utils';
import { setCurSong } from '../module/playlist';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 300px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background: #333;
  color: #fff;
  border-radius: 5px;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-left: 5px;
  display: flex;
  align-items: center;

  &::before {
    content: "♫";
    margin-right: 5px;
    color: #fff;
  }
`;

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Player = styled.audio`
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  outline: none;
  background: #e0e0e0;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
  &:hover {
    background: #555;
  }
`;

const PlaylistWrapper = styled.ul`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  background: #222;
  color: #eee;
  margin-top: 5px;
  padding: 10px;
  border-radius: 5px;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
`;

const PlaylistItem = styled.li`
  padding: 8px;
  border-bottom: 1px solid #444;
  font-size: 0.9rem;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? '#444' : 'transparent')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#eee')};

  &:last-of-type {
    border-bottom: none;
  }
  &:hover {
    background: #555;
    font-weight: bold;
  }
`;

const GlobalMusicPlayer = () => {
  const dispatch = useDispatch();
  const miniPlaylist = useSelector((state) => state.playlist.list);
  const curSong = useSelector((state) => state.playlist.curSong);

  const playerRef = useRef();
  const playlistRef = useRef();
  const audioRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpenList, setIsOpenList] = useState(false);

  useEffect(() => {
    const tokenExpiry = sessionStorage.getItem('tokenExpiry');
    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenExpiry && currentTime < parseInt(tokenExpiry, 10)) {
      setIsLoggedIn(true);
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('tokenExpiry');
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (!playlistRef.current || playlistRef.current.childNodes.length === 0) {
      console.error('Playlist reference or childNodes are not properly initialized.');
      return;
    }

    audioRef.current = new Audio(playerRef.current, playlistRef.current.childNodes);
    const audio = audioRef.current;

    if (!curSong || curSong.idx >= miniPlaylist.length) {
      console.error('Invalid curSong or index out of range.');
      return;
    }

    audio.setCurrentSong(curSong.idx, curSong.curTime);

    const playPromise = audio.player.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        if (e.name === 'NotAllowedError') {
          console.warn('Audio play requires user interaction.');
        }
      });
    }

    const handleSongEnd = () => {
      let nextIdx = audio.idx + 1;
      if (nextIdx >= miniPlaylist.length) nextIdx = 0;

      dispatch(
        setCurSong({
          idx: nextIdx,
          title: miniPlaylist[nextIdx],
          curTime: 0,
        })
      );
    };

    audio.player.addEventListener('ended', handleSongEnd);

    return () => {
      audio.player.removeEventListener('ended', handleSongEnd);
    };
  }, [isLoggedIn, curSong.idx, curSong.curTime, dispatch, miniPlaylist]);

  const handlePlaylistClick = (index) => {
    dispatch(
      setCurSong({
        idx: index,
        title: miniPlaylist[index],
        curTime: 0,
      })
    );

    const audio = audioRef.current;
    audio.setCurrentSong(index, 0);
    audio.player.play();
  };

  if (!isLoggedIn) return null;

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{curSong.title}</Title>
        <Button onClick={() => setIsOpenList((prev) => !prev)}>List</Button>
      </TitleWrapper>
      <PlayerWrapper>
        <Player
          ref={playerRef}
          type="audio/mp3"
          controls
          controlsList="nodownload"
        />
      </PlayerWrapper>
      <PlaylistWrapper isOpen={isOpenList} ref={playlistRef}>
        {miniPlaylist.map((song, index) => (
          <PlaylistItem
            key={index}
            data-src={song}
            data-title={song}
            isActive={index === curSong.idx}
            onClick={() => handlePlaylistClick(index)}
          >
            {song}
          </PlaylistItem>
        ))}
      </PlaylistWrapper>
    </Wrapper>
  );
};

export default GlobalMusicPlayer;
