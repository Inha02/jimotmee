const express = require('express');
const router = express.Router();
const Palette = require('../models/paletteModel');
console.log('Palette:', Palette);
const user = require("../models/user");

// 1. 사용자 색상 데이터 추가 또는 업데이트
router.post('/update', async (req, res) => {
    const { userId, key, title, color } = req.body;

    if (!userId || !key || !title || !color) {
        return res.status(400).json({ success: false, message: '모든 필드가 필요합니다.' });
    }

    try {
        // 기존 데이터 업데이트
        const palette = await Palette.findOneAndUpdate(
            { userId, 'colors.key': key }, // 조건: userId와 key가 일치하는 색상
            {
                $set: { 'colors.$.color': color }, // 색상 업데이트
            },
            { new: true }
        );

        // 기존 데이터가 없으면 새로 추가
        if (!palette) {
            await Palette.findOneAndUpdate(
                { userId },
                {
                    $push: { colors: { key, title, color } }, // 새로운 색상 추가
                },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ success: true, message: '색상 데이터 업데이트 성공' });
    } catch (error) {
        console.error('색상 데이터 업데이트 실패:', error);
        res.status(500).json({ success: false, message: '색상 데이터 업데이트 실패' });
    }
});

// 2. 사용자 색상 데이터 조회
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    // 초기 색상 데이터 정의
    const initialColors = [
        { key: 'bg', title: '배경', color: 'gray' },
        { key: 'layoutBorder1', title: '바깥 테두리', color: 'black' },
        { key: 'layoutBg1', title: '바깥(1) 영역', color: '#a9d2d9' },
        { key: 'layoutBorder2', title: '점선 테두리', color: '#fff' },
        { key: 'layoutBg2', title: '바깥(2) 영역', color: 'lightgray' },
        { key: 'cardBorder', title: '안쪽 테두리', color: '#a5a5a5' },
        { key: 'cardBg', title: '안쪽 영역', color: '#fff' },
        { key: 'mainColor', title: '메인 메뉴', color: '#238db3' },
        { key: 'headerColor', title: '미니포트폴리 타이틀', color: '#333' },
        { key: 'textColor', title: '서브페이지 메뉴', color: '#07698c' },
    ];

    try {
        let palette = await Palette.findOne({ userId });
        if (!palette) {
            palette = new Palette({
                userId,
                colors: initialColors,
            });
            await palette.save();
        }

        res.status(200).json({ success: true, data: palette.colors });
    } catch (error) {
        console.error('사용자 색상 데이터 조회 실패:', error);
        console.log('Palette:', Palette);
        res.status(500).json({ success: false, message: '사용자 색상 데이터 조회 실패' });
    }
});

// 3. 사용자 색상 데이터 삭제
router.delete('/delete', async (req, res) => {
    const { userId, key } = req.body;

    if (!userId || !key) {
        return res.status(400).json({ success: false, message: 'userId와 key가 필요합니다.' });
    }

    try {
        await Palette.findOneAndUpdate(
            { userId },
            { $pull: { colors: { key } } } // key가 일치하는 항목 삭제
        );

        res.status(200).json({ success: true, message: '색상 데이터 삭제 성공' });
    } catch (error) {
        console.error('색상 데이터 삭제 실패:', error);
        res.status(500).json({ success: false, message: '색상 데이터 삭제 실패' });
    }
});

module.exports = router;
