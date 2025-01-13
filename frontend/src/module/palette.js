const SET_COLOR = 'palette/SET_COLOR';

export const setColor = payload => ({ type: SET_COLOR, payload });

const initialState = {
  bg: {
    title: '배경',
    color: 'gray',
  },
  layoutBorder1: {
    title: '바깥 테두리',
    color: 'black',
  },
  layoutBg1: {
    title: '바깥(1) 영역',
    color: '#a9d2d9',
  },
  layoutBorder2: {
    title: '점선 테두리',
    color: '#fff',
  },
  layoutBg2: {
    title: '바깥(2) 영역',
    color: 'lightgray',
  },
  cardBorder: {
    title: '안쪽 테두리',
    color: '#a5a5a5',
  },
  cardBg: {
    title: '안쪽 영역',
    color: '#fff',
  },
  mainColor: {
    title: '메인 메뉴',
    color: '#238db3',
  },
  headerColor: {
    title: '미니포트폴리 타이틀',
    color: '#333',
  },
  textColor: {
    title: '서브페이지 메뉴',
    color: '#07698c',
  },
};

export default function palette(state = initialState, action) {
  switch (action.type) {
    case SET_COLOR: {
      // JWT 유효성 확인
      const tokenExpiry = sessionStorage.getItem('tokenExpiry');
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

      if (!tokenExpiry || currentTime >= parseInt(tokenExpiry, 10)) {
        console.warn('JWT가 유효하지 않거나 만료되었습니다. 로그인을 다시 시도하세요.');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiry');
        sessionStorage.removeItem('userInfo');
        return state; // 상태 변경 없이 현재 상태 반환
      }

      // 색상 변경 처리
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: {
          ...state[key],
          color: value,
        },
      };
    }

    default:
      return state;
  }
}
