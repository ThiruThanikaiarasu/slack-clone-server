require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3500

const mongoose = require('mongoose')

app.get('/', (request, response) => {
    response.status(200).json({message : "Welcome to Slack Clone"})
})

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (errorMessage) => console.log(errorMessage))
db.once('open', () => console.log('Connected to db successfully')) 

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}/api/v1`))