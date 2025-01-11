const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const profileRouter = express.Router();

// 사용자 프로필 조회
profileRouter.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }
});

// 사용자 프로필 수정
profileRouter.put('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { name, profileImage } = req.body;

    if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

        user.name = name || user.name;
        user.profileImage = profileImage || user.profileImage;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }
});

module.exports = profileRouter;
