const express = require('express');
const router = express.Router();
const { addUser, getUsers } = require('../controllers/userController');
const User = require('../models/user');



// GET /users -> 유저 목록 조회
router.get('/', getUsers);

// POST /users -> 유저 추가
router.post('/', addUser);

// 점수 업데이트 API
router.patch('/update-score/:id', async (req, res) => {
    const { id } = req.params;
    const { score } = req.body;

    if (typeof score !== 'number') {
        return res.status(400).json({ message: 'Score must be a number.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { score },
            { new: true } // 업데이트된 데이터를 반환
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Score updated successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error });
    }
});


module.exports = router;