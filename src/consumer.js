const express = require('express')
const app = express()
const { getStreamConsumer } = require('./redis-stream');

app.get('/', function (req, res) {
    res.send('Hello World')
});

console.log()
const streamIndex = process.argv[2];
const groupIndex = process.argv[3];
const consumerIndex = process.argv[4];

const port = Number(`3${streamIndex}${groupIndex}${consumerIndex}`)

const start = async () => {
    const streamName = `stream_${streamIndex}`;
    const groupName = `group_${groupIndex}`;
    const consumerName = `consumer_${consumerIndex}`;

    const streamConsumer = await getStreamConsumer(streamName, groupName, consumerName);
    streamConsumer.StartConsuming();

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
};

start();