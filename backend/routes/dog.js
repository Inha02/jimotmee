const express = require('express');
const router = express.Router();
const DogState = require('../models/dogState');

// 특정 사용자 강아지 상태 가져오기
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        let dogState = await DogState.findOne({ userId });

        if (!dogState) {
            dogState = new DogState({ userId }); // 기본 상태는 스키마에서 지정된 "행복함"
            await dogState.save();
        }

        res.json(dogState);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 특정 사용자 강아지 상태 업데이트
router.post('/update', async (req, res) => {
    try {
        const { userId, newState } = req.body;

        const dogState = await DogState.findOne({ userId });
        if (!dogState) {
            const newDogState = new DogState({ userId, state: newState });
            await newDogState.save();
            return res.json(newDogState);
        }

        dogState.state = newState;
        dogState.updatedAt = new Date();
        await dogState.save();

        res.json(dogState);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 모든 사용자 강아지 상태 가져오기 (디버그용)
router.get('/', async (req, res) => {
    try {
        const allStates = await DogState.find();
        res.json(allStates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
