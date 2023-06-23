import server from './app/index.js'
const port = process.env.PORT || '3000'
server.listen(port, () => console.log(`Start listening on port ${port}`))
