const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { KAKAO_REST_API_KEY, KAKAO_REDIRECT_URI } = require('../config/kakao');
const router = express.Router();

// 카카오 로그인 URL
router.get('/kakao', (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`;
    res.redirect(kakaoAuthUrl);
});

// 카카오 콜백 처리
router.get('/kakao/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // 카카오 토큰 발급
        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: KAKAO_REST_API_KEY,
                redirect_uri: KAKAO_REDIRECT_URI,
                code,
            },
        });

        const kakaoAccessToken = tokenResponse.data.access_token;

        // 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${kakaoAccessToken}` },
        });

        const { id: kakaoId, properties } = userResponse.data;
        const { nickname: name, profile_image: profileImage } = properties;

        // 사용자 DB 저장 또는 업데이트
        let user = await User.findOne({ kakaoId });
        if (!user) {
            user = new User({ kakaoId, name, profileImage });
            await user.save();
        }

        // JWT 발급
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '카카오 로그인 실패' });
    }
});

module.exports = router;