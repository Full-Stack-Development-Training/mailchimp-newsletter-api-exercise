const express = require('express')
const app = express()
const request = require('request')
const https = require('https')
require('dotenv').config()

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


app.get('/', (req, res) => res.sendFile(__dirname + "/signup.html"))

app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lasttName = req.body.lastName
    const email = req.body.email
    const data = {
        members: [
            {
             email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lasttName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data)
    const dc = 'us5'
    const audienceId = process.env.AUDIENCE_ID
    const authId = process.env.API_KEY
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}`
    const options = {
        method: 'POST',
        auth: `apiKey:${authId}`

    }
    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })
    })
    request.write(jsonData)
    request.end()
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => console.log("server has started"))
