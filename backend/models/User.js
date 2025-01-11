const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    kakaoId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profileImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);