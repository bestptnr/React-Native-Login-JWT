const express = require('express')

const router = express.Router()
const { body, validationResult } = require('express-validator');
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const validate = [
    body('fullName').isLength({ min: 2 }).withMessage("Your Fullname is required"),
    body('email').isEmail().withMessage("Please input email only"),
    body('password').isLength({ min: 6 }).withMessage("Password must be less 6 charecter")
]

const generateToken = user => {
    return jwt.sign({ _id: user.id, email: user.email, fullName: user.fullName }, "SUPERSECRET123")
}

const LoginValidate = [
    body('email').isEmail().withMessage("Please input email only"),
    body('password').isLength({ min: 6 }).withMessage("Password must be less 6 charecter")
]

router.post('/register', validate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userExit = await User.findOne({ email: req.body.email })
    if (userExit) {
        return res.status(400).send({ success: false, message: 'Email is already' })
    }

    const salt = await bcrypt.genSalt()
    const hashpassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashpassword
    })

    try {
        const NewUser = await user.save()
        const token = generateToken(user)
        res.send({ success: true, data: { id: NewUser._id, email: NewUser.email, fullname: NewUser.fullName }, token })
    } catch (error) {
        res.status(400).send({ success: false, error })
    }
})

router.post('/login', LoginValidate, async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() }).status(400);
    }
    // check is email exits
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.send({ success: false, message: "User is not registered" }).status(404)
    //check if password correct
    const vaildpassword = await bcrypt.compare(req.body.password, user.password)
    if (!vaildpassword) return res.send({ success: false, message: "Invalid Email or password" }).status(404)
    //assign token
    const token = generateToken(user)
    res.header('auth-token', token).send({ success: true, message: "Login Successfully", token })
})

module.exports = router;