const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    content: { type: String },
    image: { type: String }, // 게시글 이미지 경로
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 사용자 참조
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
