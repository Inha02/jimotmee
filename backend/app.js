const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');

const app = express();
app.use(express.json());

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const friendRoutes = require('./routes/friendRoutes');
const postRouter = require('./routes/posts');
const quizRoutes = require('./routes/quizRoutes');
const paletteRoutes = require('./routes/palette');
const dogRouter = require('./routes/dog');

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
app.use('/users', userRoutes); //유저 목록 조회, 유저 추가, get 조회, post 추가, patch /update-score/:id 점수 업업데이트
app.use('/profile', profileRoutes); //프로필 조회, 프로필 추가, get 조회, post 추가 - 토큰 필요
app.use('/api/friends', friendRoutes); // post send-request 요청 보내기, post accept-request 요청 승인, /delete-friend 친구 삭제
app.use('/posts', postRouter); //post add 게시글 추가, get / 게시글 목록 조회, delete /delete/:id, 폼 타입으로 요청 필요, /my-posts/:userId 내 게시물물
app.use('/api/quizzes', quizRoutes); // get / 퀴즈 목록 조회
app.use('/api/palette', paletteRoutes); // post /update 색상 데이터 추가 또는 업데이트, get /:userId 사용자 색상 데이터 조회
app.use('/api/dog', dogRouter); // get /:userId 특정 사용자 강아지 상태 가져오기, post /update 특정 사용자 강아지 상태 업데이트, get / 모든 사용자 강아지 상태 가져오기 (디버그용)

// Routes
// app.get('/', (req, res) => {
//     res.send('Hello, Jimotmee!');
// });

// 강아지 상태 변경 스케줄러 (30분마다 각 사용자의 상태 변경)
const DogState = require('./models/dogState');

cron.schedule('*/1 * * * *', async () => {
    console.log('모든 사용자 강아지 상태 업데이트 실행...');
    const states = ['배고픔', '씻기', '산책필요'];

    try {
        const allDogs = await DogState.find();
        for (const dog of allDogs) {
            const newState = states[Math.floor(Math.random() * states.length)];
            dog.state = newState;
            dog.updatedAt = new Date();
            await dog.save();
            console.log(`사용자 ${dog.userId}의 강아지 상태가 '${newState}'로 변경되었습니다.`);
        }
    } catch (err) {
        console.error('상태 업데이트 중 오류:', err.message);
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
