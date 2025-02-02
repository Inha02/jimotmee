const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = require('../config/kakao');
const authRouter = express.Router();

// 카카오 로그인 URL
authRouter.get('/kakao', (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;
    console.log('Redirect URI:', KAKAO_REDIRECT_URI); // 디버깅용
    res.redirect(kakaoAuthUrl);
});

// 카카오 콜백 처리
authRouter.get('/kakao/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // 1. 카카오 토큰 발급
        console.log('카카오 로그인 콜백 진입');
        console.log('받은 code:', code);

        // 카카오 토큰 발급
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: KAKAO_REST_API_KEY,
                redirect_uri: KAKAO_REDIRECT_URI,
                code,
            },
        });
        console.log('카카오 토큰 응답(tokenResponse.data):', tokenResponse.data);
        const kakaoAccessToken = tokenResponse.data.access_token;
        console.log('카카오 AccessToken:', kakaoAccessToken);

        // 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${kakaoAccessToken}` },
        });
        console.log('카카오 사용자 정보(userResponse.data):', userResponse.data);

        console.log('Kakao User Data:', userResponse.data);

        const { id: kakaoId, properties } = userResponse.data;
        const { nickname: name, profile_image: profileImage, score: score } = properties;

        console.log('kakaoId:', kakaoId);
        console.log('name:', name);
        console.log('profileImage:', profileImage);
        console.log('score:', score);

        // 사용자 DB 저장 또는 업데이트
        let user = await User.findOne({ kakaoId });

        if (!user) {
            console.log('DB에 사용자 정보가 없어서 새로 저장합니다.');
            user = new User({ kakaoId, name, profileImage });
            console.log('user.kakaoId:', user.kakaoId);
            await user.save();
        }
        console.log('user.kakaoId:', user.kakaoId);

        // JWT 발급
        const token = jwt.sign(
            { userId: user._id, name: user.name, profileImage: user.profileImage, score: user.score }, // 사용자 정보 포함
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('JWT:', token);
        res.redirect(`${process.env.CLIENT_URL}/callback?token=${encodeURIComponent(token)}`);
    } catch (error) {
        console.log('카카오 로그인 중 에러 발생');
        console.error(error);
        console.log('에러 상세(error):', error);
        res.status(500).json({ message: '카카오 로그인 실패' });
    }
});

module.exports = authRouter;