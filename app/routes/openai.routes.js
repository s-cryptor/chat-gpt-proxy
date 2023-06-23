import Router from 'express'
import openaiController from '../controllers/openai.controller.js'

const router = new Router()
router.post('/ai/chat/send-message', openaiController.sendMessage)

export default router
