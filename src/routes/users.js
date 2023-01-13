const express = require('express')
const router = express.Router()
const {login,profile,refreshToken,registerAccount,VerifyAccount} = require('../controller/users')
const {protect} = require('../middlewares/auth')


router
.post('/register',registerAccount)
.get('/verify',VerifyAccount)
.post('/login',login)
.post('/refersh-token',refreshToken)
.get('/profile',profile)


module.exports = router