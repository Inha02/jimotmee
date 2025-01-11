const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    kakaoId: { type: String, required: true, unique: true },
    name: { type: String },
    profileImage: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);