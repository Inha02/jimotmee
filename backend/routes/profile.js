const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// 업로드 폴더 확인 및 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // 업로드 폴더 설정
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // 파일 이름 설정
    },
});
const upload = multer({ storage });

profileRouter.put('/', upload.single('profileImage'), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { name } = req.body; // 'name'은 텍스트 데이터
    const profileImage = req.file; // Multer가 처리한 파일 데이터

    if (!token) return res.status(401).json({ message: '토큰이 없습니다.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

        // 이름 업데이트
        if (name) {
            user.name = name;
        }

        // 파일 저장 경로 업데이트
        if (profileImage) {
            user.profileImage = `/uploads/${profileImage.filename}`;
        }

        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
    }
});

module.exports = profileRouter;
