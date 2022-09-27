import express from 'express'

const router = express.Router()

import { getVideo, getVideos, UploadVideo } from '../controllers/videosController.js'


router.route('/video').post(UploadVideo).get(getVideos)
router.route('/video/:id').get(getVideo)

export default router