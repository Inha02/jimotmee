const express = require('express');
const router = express.Router();
const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

// 친구 요청 보내기
router.post('/send-request', async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // 이미 요청이 존재하는지 확인
        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: '친구 요청이 이미 존재합니다.' });
        }

        // 새 친구 요청 생성
        const friendRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
        await friendRequest.save();

        res.status(200).json({ message: '친구 요청이 성공적으로 전송되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '오류가 발생했습니다.', error });
        console.error('오류:', error);
    }
});

// 친구 요청 승인
router.post('/accept-request', async (req, res) => {
    const { requestId } = req.body;

    try {
        // 요청 가져오기
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest || friendRequest.status !== 'pending') {
            return res.status(404).json({ message: '유효하지 않은 요청입니다.' });
        }

        // 요청 상태 업데이트
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // 사용자 친구 목록 업데이트
        await User.findByIdAndUpdate(friendRequest.sender, {
            $push: { friends: friendRequest.receiver }
        });
        await User.findByIdAndUpdate(friendRequest.receiver, {
            $push: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: '친구 요청이 승인되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '오류가 발생했습니다.', error });
    }
});


module.exports = router;
