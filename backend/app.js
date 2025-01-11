const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');

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
app.use('/', authRouter);
app.use('/auth', authRouter);
app.use('/users', userRoutes);

// Routes
// app.get('/', (req, res) => {
//     res.send('Hello, Jimotmee!');
// });

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
