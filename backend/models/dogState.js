const mongoose = require('mongoose');

const dogStateSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // 사용자 ID (고유값)
        unique: true,
    },
    state: {
        type: String,
        enum: ['행복함', '배고픔', '씻기', '산책필요'],
        default: '행복함',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DogState', dogStateSchema);
