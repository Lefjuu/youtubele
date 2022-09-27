import express from 'express'
import { findAuthor, followUser, unfollowUser } from '../controllers/usersController.js'

const router = express.Router()

router.route('/find').get(findAuthor)
router.route('/:id/follow').patch(followUser)
router.route('/:id/unfollow').patch(unfollowUser)

export default router