const express = require('express');
const router = express.Router();
const { addUser, getUsers } = require('../controllers/userController');

// GET /users -> 유저 목록 조회
router.get('/', getUsers);

// POST /users -> 유저 추가
router.post('/', addUser);

module.exports = router;