const express = require('express')
const app = express()
const { publishMessage } = require('./redis-stream');

app.get('/', async function (req, res) {
    for (let i = 1; i < 12; i++) {
        for (let j = 1; j < 4; j++) {
            const streamName = `stream_${j}`;
            await publishMessage(streamName, `${j}${i}`)
        }
    }
    return res.send();
})

const start = async () => {
    app.listen(3000)
};

start();