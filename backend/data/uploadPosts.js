const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
require('dotenv').config();

const mongoURI = process.env.MONGO_URI // MongoDB 연결 URI

async function uploadPosts() {
    try {
        // MongoDB 연결
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        // JSON 파일 읽기
        const jsonData = fs.readFileSync(path.join(__dirname, "../data/posts.json"), "utf-8");
        const posts = JSON.parse(jsonData);

        // MongoDB에 데이터 삽입
        await Post.insertMany(posts);
        console.log("Posts uploaded successfully");

        // MongoDB 연결 종료
        mongoose.connection.close();
    } catch (err) {
        console.error("Error uploading posts:", err.message);
        mongoose.connection.close();
    }
}

// 스크립트 실행
uploadPosts();
