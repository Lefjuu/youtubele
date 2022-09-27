import express from 'express'
import { uploadImage, getFile, uploadVideo } from '../controllers/fileController.js'
const router = express.Router()

router.route('/uploadImage').post(uploadImage)
router.route('/uploadVideo').post(uploadVideo)
router.route('/images').get(getFile)


export default router