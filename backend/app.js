const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const friendRoutes = require('./routes/friendRoutes');
const postRouter = require('./routes/posts');


// MongoDB 연결 URI
const MONGO_URI = process.env.MONGO_URI

// MongoDB 연결
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

//API 
//app.use('/', authRouter); //카카오 로그인 URL
app.use('/auth', authRouter); //위 Api와 중복되어 주석처리
app.use('/users', userRoutes); //유저 목록 조회, 유저 추가, get 조회, post 추가
app.use('/profile', profileRoutes); //프로필 조회, 프로필 추가, get 조회, post 추가 - 토큰 필요
app.use('/api/friends', friendRoutes); // post send-request 요청 보내기, post accept-request 요청 승인, /delete-friend 친구 삭제
app.use('/posts', postRouter); //post add 게시글 추가, get / 게시글 목록 조회, delete /delete/:id, 폼 타입으로 요청 필요

// Routes
// app.get('/', (req, res) => {
//     res.send('Hello, Jimotmee!');
// });

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
