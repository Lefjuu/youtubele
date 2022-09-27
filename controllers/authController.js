import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import pool from '../db/connect.cjs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    const { username, email, password } = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if (!username, !email, !password) {
        throw new BadRequestError('Provide all values')
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    if (result.rows.length > 0) {
        throw new BadRequestError('Email already in use')
    }

    await pool.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`, [username, email, hashedPassword])

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })

    res.status(201).json({
        user: {
            email,
            username,
            password: hashedPassword,
            profilePicture: '',
        },
        token,
        followings: [],
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Provide all values')
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (user.rows.length === 0) {
        throw new BadRequestError('Wrong Email provided')
    }
    if (user.rows[0].email !== email) {
        throw new UnAuthenticatedError('Invalid Credentials1')
    }

    const isPasswordCorrect = await pool.query(`SELECT password FROM users WHERE email = $1`, [email])
    const comparePassword = await bcrypt.compare(password, isPasswordCorrect.rows[0].password)

    if (!comparePassword) {
        throw new UnAuthenticatedError('Invalid Credentials2')
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })

    res.status(200).json({
        user: {
            email: user.rows[0].email,
            username: user.rows[0].username,
            password: user.rows[0].password,
            profilePicture: user.rows[0].profilepicture
        },
        token,
        followings: user.rows[0].followings
    })
}

const updateUser = async (req, res) => {
    const { email, username, password, profilePicture, coverPicture } = req.body
    if (!email || !password || !username) {
        throw new BadRequestError('Provide all values')
    }
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.username = username
    user.password = hashedPassword
    user.profilePicture = profilePicture
    // user.coverPicture = coverPicture
    user.email = email


    await pool.query(`UPDATE users SET username = $1, password = $2, profilepicture = $3, coverpicture = $4 WHERE email = $5`, [username, hashedPassword, profilePicture, coverPicture, email])
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    })

    res.status(200).json({ user, token })
}

export { register, login, updateUser }