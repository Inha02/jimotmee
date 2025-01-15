import 'whatwg-fetch';

const SET_COLOR = 'palette/SET_COLOR';
const LOAD_PALETTE = 'palette/LOAD_PALETTE';

export const setColor = (payload) => ({ type: SET_COLOR, payload });
export const loadPalette = (payload) => ({ type: LOAD_PALETTE, payload });

const initialState = null; // 초기 상태를 null로 설정

// API 호출 함수 정의
export const fetchPalette = async (userId) => {
  try {
    const response = await fetch(`/api/palette/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data; // 서버에서 받은 팔레트 데이터 반환
  } catch (error) {
    console.error('팔레트 데이터 조회 실패:', error);
    throw error;
  }
};

export const updatePalette = async (userId, key, title, color) => {
  try {
    const payload = { userId, key, title, color };
    const response = await fetch('/api/palette/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('팔레트 데이터 업데이트 실패:', error);
    throw error;
  }
};

// Reducer
export default function palette(state = initialState, action) {
  switch (action.type) {
    case LOAD_PALETTE:
      return action.payload; // DB에서 가져온 데이터로 상태 설정
    case SET_COLOR: {
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
