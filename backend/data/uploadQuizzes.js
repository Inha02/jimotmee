const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('../models/quizModel');
const path = require("path");
require('dotenv').config();

// MongoDB 연결
const mongoURI = process.env.MONGO_URI

async function uploadQuizzes() {

    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        const jsonData = fs.readFileSync(path.join(__dirname, '../data/quizzes.json'), 'utf-8');
        const quizzes = JSON.parse(jsonData);

        await Quiz.insertMany(quizzes);
        console.log("Quizzes uploaded successfully");

        mongoose.connection.close();
    } catch (err) {
        console.error("Error uploading quizzes:", err.message);
        mongoose.connection.close();
    }
}

// 스크립트 실행
uploadQuizzes();
