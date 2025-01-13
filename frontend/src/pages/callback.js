import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // v5에서 사용하는 useHistory

const KakaoCallbackHandler = () => {
  const history = useHistory();

  function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; // ArrayBuffer 반환
  }

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = decodeURIComponent(query.get('token'));

    if (token) {
      try {
        const parts = token.split('.');
            console.log('JWT parts:', parts);

            if (parts.length === 3) {
                const base64Payload = parts[1];
                const arrayBuffer = base64ToArrayBuffer(base64Payload);
                const utf8Decoder = new TextDecoder('utf-8');
                const decodedPayload = JSON.parse(utf8Decoder.decode(arrayBuffer));
                console.log('Decoded payload with UTF-8 fix:', decodedPayload);

                // JWT 저장
                sessionStorage.setItem('token', token);
                sessionStorage.setItem(
                    'userInfo',
                    JSON.stringify({
                        name: decodedPayload.name,
                        profileImage: decodedPayload.profileImage,
                    })
                );
                sessionStorage.setItem('tokenExpiry', decodedPayload.exp);

                // 홈 화면으로 이동
                window.location.href = '/';
            } else {
                console.error('Invalid JWT format:', parts);
            }
      } catch (error) {
        alert('로그인 실패: JWT 처리 오류.');
        console.error('JWT 처리 중 오류:', error);
        history.push('/before-login');
      }
    } else {
      alert('로그인 실패: 유효한 토큰이 없습니다.');
      history.push('/before-login');
    }
  }, [history]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallbackHandler;
