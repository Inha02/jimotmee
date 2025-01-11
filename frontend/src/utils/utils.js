export const publicUrl = process.env.PUBLIC_URL;

// 헥스 컬러
export const getRandomHexColor = (isLoggedIn = false) => {
  if (!isLoggedIn) {
    console.warn('로그인 후에만 색상 변경이 가능합니다.');
    return '#CCCCCC'; // 기본 색상 (비활성화 상태)
  }

  const letters = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += letters[Math.floor(Math.random() * 16)];
  }
  return hex;
};

// 오디오 플레이어
export function Audio(player, playlists, isLoggedIn = false) {
  this.player = player;
  this.playlists = playlists;
  this.idx = 0;
  this.title = '';
  this.isLoggedIn = isLoggedIn;

  this.setCurTime = curTime => {
    if (!this.isLoggedIn) {
      console.warn('로그인 후에만 오디오 기능을 사용할 수 있습니다.');
      return;
    }
    this.player.currentTime = curTime;
  };

  // 재생정보 설정
  this.setCurrentSong = (idx, curTime) => {
    if (!this.isLoggedIn) {
      console.warn('로그인 후에만 오디오 기능을 사용할 수 있습니다.');
      return;
    }

    this.idx = idx;
    this.title = this.playlists[idx].dataset.title;
    this.player.src = `${publicUrl}/resources/audio/${this.title}.mp3`;
    this.setCurTime(curTime);
  };

  // 사용자별 커스텀 데이터 로드
  this.loadUserCustomData = async () => {
    if (!this.isLoggedIn) {
      console.warn('로그인 후에만 사용자 커스텀 데이터를 불러올 수 있습니다.');
      return;
    }

    try {
      const response = await fetch('/api/user/custom-data', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        // 노래 및 색상 데이터 로드
        console.log('커스텀 데이터 로드 완료:', data);
        this.playlists = data.playlists; // 사용자 노래 데이터
        document.documentElement.style.setProperty('--main-color', data.color); // 사용자 커스텀 색상
      } else {
        console.error('커스텀 데이터를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('커스텀 데이터 로드 중 오류 발생:', error);
    }
  };
}

