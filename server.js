const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

app.post('/auth/login', (req, res) => {
    const {username, password} = req.body;
    const user = {
        name: 'hj',
        password: "1234",
    }

    if(user.name === username && user.password === password) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        res.json({accessToken, refreshToken})

    } else {
        res.status('400').json('아이디 혹은 비밀번호가 일치하지 않습니다.')
    }
})


app.get('/blog', authenticateToken, (req, res) => {
    const result = [
        {
            title : '블로그 첫번째',
            des: '내용1'
        },
        {
            title : '블로그 두번째',
            des: '내용2'
        }
    ]
    res.json(result)
})

function authenticateToken(req, res, next)  {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        console.log(user)
    })
    next();
}

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
}

const PORT = 4000;

app.listen(PORT, () => {
 console.log('server is running!')
})
