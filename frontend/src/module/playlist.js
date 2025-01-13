const SET_CURSONG = 'playlist/SET_CURSONG';

export const setCurSong = payload => ({ type: SET_CURSONG, payload });

const initialState = {
  list: [
    'Bigbang-CAFE',
    'Bigbang-BLUE',
    'Bigbang-LOVEDUST',
    'Bigbang-BADBOY',
  ],
  curSong: {
    idx: 0,
    title: 'Bigbang-CAFE',
    curTime: 0,
  },
};

export default function playlist(state = initialState, action) {
  switch (action.type) {
    case SET_CURSONG:
      return {
        ...state,
        curSong: {
          idx: action.payload.idx,
          title: action.payload.title,
          curTime: action.payload.curTime,
        },
      };
    default:
      return state;
  }
}
