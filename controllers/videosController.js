import pool from "../db/connect.cjs"
import { BadRequestError } from "../errors/index.js"


const UploadVideo = async (req, res) => {
    const { title, video, thumbnail, author, description } = req.body

    if (!title || !video || !thumbnail || !author || !description) {
        throw new BadRequestError('Provide all values')
    }

    try {
        await pool.query(`INSERT INTO videos (title, video, thumbnail, author, description) VALUES ($1, $2, $3, $4, $5)`, [title, video, thumbnail, author, description])
    } catch (error) {

        console.log(error);
    }
    res.status(201).json('video saved')
}


const getVideos = async (req, res) => {
    const videos = await pool.query(`SELECT * FROM videos`)

    res.status(200).json(videos.rows)
}

const getVideo = async (req, res) => {
    const { id } = req.params
    const video = await pool.query(`SELECT * FROM videos WHERE id = $1`, [id])

    const view = video.rows[0].views + 1
    // console.log(view);

    try {
        await pool.query(`UPDATE videos SET views = $1 WHERE id = $2`, [view, id])

    } catch (error) {
        console.log(error);
    }


    res.status(200).json(video.rows[0])
}

export { UploadVideo, getVideos, getVideo }