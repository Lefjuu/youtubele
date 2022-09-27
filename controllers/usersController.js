import pool from '../db/connect.cjs'
import BadRequestError from '../errors/bad-request.js'

const findAuthor = async (req, res) => {
    try {
        const { email } = req.query

        const foundAuthor = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        res.status(200).json(foundAuthor.rows[0])
    } catch (error) {
        console.log(error);
    }
}

const followUser = async (req, res) => {
    // console.log(req.body.email); 
    // console.log(req.params.id);
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [req.body.email])
    // console.log(user.rows[0].id);

    if (user.rows[0].id === req.params.id) {
        throw new BadRequestError(`You can't follow yourself`)
    }

    // const currentUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
    // console.log(user.rows[0].followers.includes(parseInt(req.params.id)));
    if (user.rows[0].followings !== null && user.rows[0].followings.includes(parseInt(req.params.id))) {
        throw new BadRequestError('You already follow this user')
    }

    await pool.query(`UPDATE users SET followers = array_append(followers, $2) WHERE id = $1 `, [req.params.id, user.rows[0].id])
    const result = await pool.query(`UPDATE users SET followings = array_append(followings, $1) WHERE id = $2 RETURNING * `, [req.params.id, user.rows[0].id])
    // console.log();


    console.log(result.rows[0].followings);
    res.status(200).json(result.rows[0].followings)
}


const unfollowUser = async (req, res) => {
    console.log(req.body.email);
    console.log(req.params.id);

    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [req.body.email])
    const currentUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])

    // console.log(user.rows[0].id);
    if (user.rows[0].id === req.params.id) {
        throw new BadRequestError('You cant follow yourself')
    }
    // user.rows[0].followers !== null && 
    if (user.rows[0].followers !== null && !user.rows[0].followings.includes(parseInt(req.params.id))) {
        throw new BadRequestError(`You didin't follow this user`)
    }

    // await pool.query(`SELECT array_remove(followers, $1) from users WHERE id = $2`, [req.params.id, user.rows[0].id])
    // await pool.query(`SELECT array_remove(followings, $2) from users WHERE id = $1`, [req.params.id, user.rows[0].id])
    await pool.query(`UPDATE users SET followers = array_remove(followers, $2) WHERE id = $1  `, [req.params.id, user.rows[0].id])
    const result = await pool.query(`UPDATE users SET followings = array_remove(followings, $1) WHERE id = $2 RETURNING *`, [req.params.id, user.rows[0].id])


    // await pool.query(`UPDATE users SET followings = array_reduced(followings, $2) WHERE id = $1`, [req.params.id, user.rows[0].id])
    // select array_remove(sales, 9) as reduced_array from employees where id=1;
    // console.log(result.rows[0]);
    // console.log(result.rows[0].followings);
    res.status(200).json(result.rows[0].followings)
}

export { findAuthor, followUser, unfollowUser }