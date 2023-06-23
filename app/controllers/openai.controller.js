import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

class OpenaiController {
  constructor() {
    if (typeof OpenaiController.instance === 'object') {
      return OpenaiController.instance
    }

    OpenaiController.instance = this
    return OpenaiController.instance
  }

  async sendMessage(req, res) {
    try {
      const res = await openai.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: req.body.text }],
          stream: true,
        },
        { responseType: 'stream' }
      )

      res.data.on('data', (data) => {
        const lines = data
          .toString()
          .split('\n')
          .filter((line) => line.trim() !== '')
        for (const line of lines) {
          const message = line.replace(/^data: /, '')
          if (message === '[DONE]') {
            return // Stream finished
          }
          try {
            const parsed = JSON.parse(message)
            console.log(parsed.choices[0].delta.content)
          } catch (error) {
            console.error('Could not JSON parse stream message', message, error)
          }
        }
      })
    } catch (error) {
      if (error.response?.status) {
        console.error(error.response.status, error.message)
        error.response.data.on('data', (data) => {
          const message = data.toString()
          try {
            const parsed = JSON.parse(message)
            console.error('An error occurred during OpenAI request: ', parsed)
          } catch (error) {
            console.error('An error occurred during OpenAI request: ', message)
          }
        })
      } else {
        console.error('An error occurred during OpenAI request', error)
      }
    }
    // try {
    //   const { text } = req.body
    //   const chatCompletion = await openai.createChatCompletion({
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'user', content: text }],
    //   })
    //   res.json({ text: chatCompletion.data.choices[0].message.content })
    // } catch (error) {}
  }
}

export default new OpenaiController()
